import { useState, useEffect } from 'react';
import { authAPI } from '../../utils/api';
import toast from 'react-hot-toast';

const AdminUsers = () => {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [filterRole, setFilterRole] = useState('all');
  const [currentPage, setCurrentPage] = useState(1);
  const [editTarget, setEditTarget] = useState(null);
  const [editForm, setEditForm] = useState({ name: '', email: '', phone: '', address: '', role: 'user', is_active: true });
  const [saving, setSaving] = useState(false);
  const [totalCount, setTotalCount] = useState(0);
  const [deleteTarget, setDeleteTarget] = useState(null);
  const [deleting, setDeleting] = useState(false);
  const [togglingId, setTogglingId] = useState(null);
  const itemsPerPage = 10;

  const fetchUsers = () => {
    setLoading(true);
    const params = { page: currentPage, limit: itemsPerPage * 5 };
    if (filterRole !== 'all') params.role = filterRole;

    authAPI.getAllUsers(params)
      .then(res => {
        if (res.data.success) {
          setUsers(res.data.data.users || []);
          setTotalCount(res.data.data.total || 0);
        }
      })
      .finally(() => setLoading(false));
  };

  useEffect(() => {
    fetchUsers();
  }, [currentPage, filterRole]);

  useEffect(() => { setCurrentPage(1); }, [filterRole]);

  const handleEdit = (user) => {
    setEditTarget(user);
    setEditForm({
      name: user.name || '',
      email: user.email || '',
      phone: user.phone || '',
      address: user.address || '',
      role: user.role || 'user',
      is_active: user.is_active !== undefined ? user.is_active : true,
    });
  };

  const handleSave = async () => {
    if (!editTarget) return;
    setSaving(true);
    try {
      const res = await authAPI.updateUser(editTarget.id, {
        name: editForm.name,
        phone: editForm.phone,
        address: editForm.address,
        role: editForm.role,
        is_active: editForm.is_active,
      });
      if (res.data.success) {
        toast.success('Cập nhật thông tin thành công!');
        setEditTarget(null);
        fetchUsers();
      } else {
        toast.error(res.data.message || 'Cập nhật thất bại');
      }
    } catch (error) {
      toast.error(error.response?.data?.message || 'Có lỗi xảy ra khi cập nhật');
    } finally {
      setSaving(false);
    }
  };

  const handleClose = () => {
    setEditTarget(null);
  };

  const handleToggleStatus = async (user) => {
    setTogglingId(user.id);
    try {
      const res = await authAPI.updateUser(user.id, {
        name: user.name,
        phone: user.phone,
        address: user.address,
        role: user.role,
        is_active: !user.is_active,
      });
      if (res.data.success) {
        toast.success(!user.is_active ? 'Đã mở khóa tài khoản!' : 'Đã khóa tài khoản!');
        fetchUsers();
      } else {
        toast.error(res.data.message || 'Cập nhật thất bại');
      }
    } catch (error) {
      toast.error(error.response?.data?.message || 'Có lỗi xảy ra');
    } finally {
      setTogglingId(null);
    }
  };

  const handleDelete = async () => {
    if (!deleteTarget) return;
    setDeleting(true);
    try {
      const res = await authAPI.deleteUser(deleteTarget.id);
      if (res.data.success) {
        toast.success('Xóa người dùng thành công!');
        setDeleteTarget(null);
        fetchUsers();
      } else {
        toast.error(res.data.message || 'Xóa thất bại');
      }
    } catch (error) {
      toast.error(error.response?.data?.message || 'Có lỗi xảy ra khi xóa');
    } finally {
      setDeleting(false);
    }
  };

  const filteredUsers = search.trim()
    ? users.filter(u =>
        u.name?.toLowerCase().includes(search.toLowerCase()) ||
        u.email?.toLowerCase().includes(search.toLowerCase())
      )
    : users;

  const totalPages = Math.ceil(filteredUsers.length / itemsPerPage);
  const paginatedUsers = filteredUsers.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  const getInitials = (name) => {
    if (!name) return '??';
    return name.split(' ').map(n => n[0]).join('').slice(0, 2).toUpperCase();
  };

  const getAvatarGradient = (name, index) => {
    const gs = [
      'linear-gradient(135deg, #F59E0B, #FCD34D)',
      'linear-gradient(135deg, #10B981, #6EE7B7)',
      'linear-gradient(135deg, #3B82F6, #93C5FD)',
      'linear-gradient(135deg, #8B5CF6, #C4B5FD)',
      'linear-gradient(135deg, #EF4444, #FCA5A5)',
    ];
    return gs[index % gs.length];
  };

  const adminCount = users.filter(u => u.role === 'admin').length;
  const userCount = users.filter(u => u.role === 'user').length;

  return (
    <div className="space-y-5">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold" style={{ color: '#1F2937', fontFamily: 'system-ui, -apple-system, "Segoe UI", Roboto, sans-serif' }}>Người dùng</h1>
          <p className="text-sm mt-1" style={{ color: '#92400E' }}>
            {filteredUsers.length} người dùng
            <span style={{ color: '#7C3AED' }}> · {adminCount} admin, {userCount} user</span>
          </p>
        </div>
      </div>

      {/* Filters */}
      <div className="flex flex-wrap items-center gap-3 p-4 rounded-2xl" style={{ background: '#FFFFFF', border: '1px solid #FDE68A', boxShadow: '0 1px 8px rgba(146,64,14,0.06)' }}>
        <div className="relative flex-1 min-w-[200px]">
          <svg className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2" style={{ color: '#92400E' }} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.75}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M21 21l-5.197-5.197m0 0A7.5 7.5 0 105.196 5.196a7.5 7.5 0 0010.607 10.607z" />
          </svg>
          <input
            type="text"
            placeholder="Tìm tên, email..."
            value={search}
            onChange={e => setSearch(e.target.value)}
            className="w-full pl-10 pr-4 py-2.5 rounded-xl text-sm"
            style={{ background: '#FEF3C7', border: '1px solid #FDE68A', color: '#1F2937', outline: 'none' }}
          />
          {search && (
            <button onClick={() => setSearch('')} className="absolute right-3 top-1/2 -translate-y-1/2" style={{ color: '#92400E' }}>
              <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          )}
        </div>

        <div className="flex rounded-xl overflow-hidden" style={{ border: '1px solid #FDE68A' }}>
          {[
            { key: 'all', label: 'Tất cả', count: users.length },
            { key: 'admin', label: 'Admin', count: adminCount },
            { key: 'user', label: 'User', count: userCount },
          ].map(item => (
            <button
              key={item.key}
              onClick={() => setFilterRole(item.key)}
              className="px-4 py-2 text-xs font-medium transition-all"
              style={filterRole === item.key
                ? { background: '#F59E0B', color: '#FFFFFF' }
                : { background: '#FEF3C7', color: '#92400E' }
              }
            >
              {item.label} <span style={{ opacity: 0.6 }}>({item.count})</span>
            </button>
          ))}
        </div>
      </div>

      {/* Edit Modal */}
      {editTarget && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4" style={{ background: 'rgba(0,0,0,0.45)', backdropFilter: 'blur(3px)' }}>
          <div className="w-full max-w-lg rounded-2xl overflow-hidden" style={{ background: '#FFFFFF', boxShadow: '0 20px 60px rgba(146,64,14,0.18)' }}>
            <div className="px-6 py-5 flex items-center justify-between" style={{ background: '#FEF3C7', borderBottom: '1px solid #FDE68A' }}>
              <div className="flex items-center gap-3">
                <div className="w-9 h-9 rounded-xl flex items-center justify-center" style={{ background: 'linear-gradient(135deg, #F59E0B, #FCD34D)' }}>
                  <svg className="w-5 h-5 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                  </svg>
                </div>
                <div>
                  <h2 className="text-lg font-bold" style={{ color: '#78350F' }}>Chỉnh sửa người dùng</h2>
                  <p className="text-xs" style={{ color: '#92400E' }}>ID #{editTarget.id} · {editTarget.email}</p>
                </div>
              </div>
              <button onClick={handleClose} className="p-2 rounded-xl transition-colors hover:bg-amber-100" style={{ color: '#92400E' }}>
                <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>

            <div className="p-6 space-y-4">
              <div>
                <label className="block text-xs font-medium mb-1.5" style={{ color: '#78350F' }}>Họ tên</label>
                <input
                  type="text"
                  value={editForm.name}
                  onChange={e => setEditForm(f => ({ ...f, name: e.target.value }))}
                  className="w-full px-4 py-2.5 rounded-xl text-sm transition-all"
                  style={{ background: '#FEF9F0', border: '1.5px solid #FDE68A', color: '#1F2937', outline: 'none' }}
                  placeholder="Nhập họ tên"
                />
              </div>

              <div>
                <label className="block text-xs font-medium mb-1.5" style={{ color: '#78350F' }}>Email</label>
                <input
                  type="email"
                  value={editForm.email}
                  disabled
                  className="w-full px-4 py-2.5 rounded-xl text-sm cursor-not-allowed"
                  style={{ background: '#F3F4F6', border: '1.5px solid #E5E7EB', color: '#9CA3AF' }}
                />
                <p className="text-xs mt-1" style={{ color: '#92400E' }}>Email không thể thay đổi</p>
              </div>

              <div>
                <label className="block text-xs font-medium mb-1.5" style={{ color: '#78350F' }}>Số điện thoại</label>
                <input
                  type="text"
                  value={editForm.phone}
                  onChange={e => setEditForm(f => ({ ...f, phone: e.target.value }))}
                  className="w-full px-4 py-2.5 rounded-xl text-sm transition-all"
                  style={{ background: '#FEF9F0', border: '1.5px solid #FDE68A', color: '#1F2937', outline: 'none' }}
                  placeholder="Nhập số điện thoại"
                />
              </div>

              <div>
                <label className="block text-xs font-medium mb-1.5" style={{ color: '#78350F' }}>Địa chỉ</label>
                <textarea
                  value={editForm.address}
                  onChange={e => setEditForm(f => ({ ...f, address: e.target.value }))}
                  rows={3}
                  className="w-full px-4 py-2.5 rounded-xl text-sm resize-none transition-all"
                  style={{ background: '#FEF9F0', border: '1.5px solid #FDE68A', color: '#1F2937', outline: 'none' }}
                  placeholder="Nhập địa chỉ"
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-medium mb-1.5" style={{ color: '#78350F' }}>Vai trò</label>
                  <select
                    value={editForm.role}
                    onChange={e => setEditForm(f => ({ ...f, role: e.target.value }))}
                    className="w-full px-4 py-2.5 rounded-xl text-sm transition-all"
                    style={{ background: '#FEF9F0', border: '1.5px solid #FDE68A', color: '#1F2937', outline: 'none' }}
                  >
                    <option value="user">User</option>
                    <option value="admin">Admin</option>
                  </select>
                </div>
                <div>
                  <label className="block text-xs font-medium mb-1.5" style={{ color: '#78350F' }}>Trạng thái</label>
                  <div className="flex items-center h-full pt-2.5">
                    <button
                      type="button"
                      onClick={() => setEditForm(f => ({ ...f, is_active: !f.is_active }))}
                      className="relative inline-flex h-7 w-12 items-center rounded-full transition-colors focus:outline-none"
                      style={editForm.is_active ? { background: '#10B981' } : { background: '#D1D5DB' }}
                    >
                      <span
                        className="inline-block h-5 w-5 transform rounded-full bg-white shadow transition-transform"
                        style={editForm.is_active ? { transform: 'translateX(26px)' } : { transform: 'translateX(2px)' }}
                      />
                    </button>
                    <span className="ml-3 text-xs font-medium" style={{ color: editForm.is_active ? '#059669' : '#6B7280' }}>
                      {editForm.is_active ? 'Hoạt động' : 'Bị khóa'}
                    </span>
                  </div>
                </div>
              </div>
            </div>

            <div className="px-6 py-4 flex items-center justify-end gap-3" style={{ borderTop: '1px solid #FDE68A', background: '#FEF9F0' }}>
              <button
                onClick={handleClose}
                disabled={saving}
                className="px-5 py-2.5 rounded-xl text-sm font-medium transition-all disabled:opacity-50"
                style={{ background: '#FFFFFF', border: '1.5px solid #FDE68A', color: '#92400E' }}
              >
                Hủy
              </button>
              <button
                onClick={handleSave}
                disabled={saving || !editForm.name.trim()}
                className="px-5 py-2.5 rounded-xl text-sm font-medium text-white transition-all disabled:opacity-50 flex items-center gap-2"
                style={{ background: saving ? '#D97706' : '#F59E0B' }}
              >
                {saving ? (
                  <>
                    <div className="w-4 h-4 rounded-full animate-spin" style={{ border: '2px solid rgba(255,255,255,0.3)', borderTopColor: '#FFF' }}></div>
                    Đang lưu...
                  </>
                ) : (
                  <>
                    <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                      <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                    </svg>
                    Lưu thay đổi
                  </>
                )}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Delete Confirmation Modal */}
      {deleteTarget && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4" style={{ background: 'rgba(0,0,0,0.45)', backdropFilter: 'blur(3px)' }}>
          <div className="w-full max-w-sm rounded-2xl overflow-hidden" style={{ background: '#FFFFFF', boxShadow: '0 20px 60px rgba(146,64,14,0.18)' }}>
            <div className="px-6 py-5 flex items-center justify-between" style={{ background: '#FEF2F2', borderBottom: '1px solid #FECACA' }}>
              <div className="flex items-center gap-3">
                <div className="w-9 h-9 rounded-xl flex items-center justify-center" style={{ background: 'linear-gradient(135deg, #EF4444, #FCA5A5)' }}>
                  <svg className="w-5 h-5 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M14.74 9l-.346 9m-4.788 0L9.26 9m9.968-3.21c.342.052.682.107 1.022.166m-1.022-.165L18.16 19.673a2.25 2.25 0 01-2.244 2.077H8.084a2.25 2.25 0 01-2.244-2.077L4.772 5.79m14.456 0a48.108 48.108 0 00-3.478-.397m-12 .562c.34-.059.68-.114 1.022-.165m0 0a48.11 48.11 0 013.478-.397m7.5 0v-.916c0-1.18-.91-2.164-2.09-2.201a51.964 51.964 0 00-3.32 0c-1.18.037-2.09 1.022-2.09 2.201v.916m7.5 0a48.667 48.667 0 00-7.5 0" />
                  </svg>
                </div>
                <div>
                  <h2 className="text-lg font-bold" style={{ color: '#991B1B' }}>Xác nhận xóa</h2>
                  <p className="text-xs" style={{ color: '#DC2626' }}>Hành động này không thể hoàn tác</p>
                </div>
              </div>
              <button onClick={() => setDeleteTarget(null)} className="p-2 rounded-xl transition-colors hover:bg-red-100" style={{ color: '#DC2626' }}>
                <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>

            <div className="p-6">
              <div className="flex items-center gap-3 p-4 rounded-xl mb-4" style={{ background: '#FEF2F2', border: '1px solid #FECACA' }}>
                <div className="w-10 h-10 rounded-xl flex items-center justify-center" style={{ background: 'linear-gradient(135deg, #EF4444, #FCA5A5)' }}>
                  <span className="text-xs font-bold text-white">{getInitials(deleteTarget.name)}</span>
                </div>
                <div>
                  <p className="text-sm font-semibold" style={{ color: '#1F2937' }}>{deleteTarget.name}</p>
                  <p className="text-xs" style={{ color: '#DC2626' }}>{deleteTarget.email}</p>
                </div>
              </div>
              <p className="text-sm" style={{ color: '#374151' }}>
                Bạn có chắc chắn muốn <strong>xóa vĩnh viễn</strong> tài khoản này không? Tất cả dữ liệu liên quan sẽ bị mất.
              </p>
            </div>

            <div className="px-6 py-4 flex items-center justify-end gap-3" style={{ borderTop: '1px solid #FECACA', background: '#FFF5F5' }}>
              <button
                onClick={() => setDeleteTarget(null)}
                disabled={deleting}
                className="px-5 py-2.5 rounded-xl text-sm font-medium transition-all disabled:opacity-50"
                style={{ background: '#FFFFFF', border: '1.5px solid #E5E7EB', color: '#6B7280' }}
              >
                Hủy
              </button>
              <button
                onClick={handleDelete}
                disabled={deleting}
                className="px-5 py-2.5 rounded-xl text-sm font-medium text-white transition-all disabled:opacity-50 flex items-center gap-2"
                style={{ background: deleting ? '#B91C1C' : '#EF4444' }}
              >
                {deleting ? (
                  <>
                    <div className="w-4 h-4 rounded-full animate-spin" style={{ border: '2px solid rgba(255,255,255,0.3)', borderTopColor: '#FFF' }}></div>
                    Đang xóa...
                  </>
                ) : (
                  <>
                    <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                      <path strokeLinecap="round" strokeLinejoin="round" d="M14.74 9l-.346 9m-4.788 0L9.26 9m9.968-3.21c.342.052.682.107 1.022.166m-1.022-.165L18.16 19.673a2.25 2.25 0 01-2.244 2.077H8.084a2.25 2.25 0 01-2.244-2.077L4.772 5.79m14.456 0a48.108 48.108 0 00-3.478-.397m-12 .562c.34-.059.68-.114 1.022-.165m0 0a48.11 48.11 0 013.478-.397m7.5 0v-.916c0-1.18-.91-2.164-2.09-2.201a51.964 51.964 0 00-3.32 0c-1.18.037-2.09 1.022-2.09 2.201v.916m7.5 0a48.667 48.667 0 00-7.5 0" />
                    </svg>
                    Xóa vĩnh viễn
                  </>
                )}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Table */}
      <div className="rounded-2xl overflow-hidden" style={{ background: '#FFFFFF', border: '1px solid #FDE68A', boxShadow: '0 1px 8px rgba(146,64,14,0.06)' }}>
        {loading ? (
          <div className="flex justify-center py-16">
            <div className="w-10 h-10 rounded-full animate-spin" style={{ border: '3px solid #FDE68A', borderTopColor: '#F59E0B' }}></div>
          </div>
        ) : paginatedUsers.length === 0 ? (
          <div className="py-16 text-center">
            <svg className="w-16 h-16 mx-auto mb-4" style={{ color: '#FDE68A' }} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M15 19.128a9.38 9.38 0 002.625.372" />
            </svg>
            <p className="text-base font-medium" style={{ color: '#374151' }}>Không tìm thấy người dùng</p>
          </div>
        ) : (
          <>
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr style={{ background: '#FEF3C7' }}>
                    {['Người dùng', 'Email', 'Vai trò', 'Trạng thái', 'Ngày tham gia', ''].map((h, i) => (
                      <th key={i} className="px-6 py-4 text-left text-xs font-medium uppercase tracking-wider" style={{ color: '#92400E' }}>{h}</th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {paginatedUsers.map((user, idx) => (
                    <tr key={user.id} className="transition-colors" style={{ borderBottom: '1px solid #FEF9F0' }}>
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-3">
                          <div className="w-10 h-10 rounded-xl flex items-center justify-center flex-shrink-0" style={{ background: getAvatarGradient(user.name, idx) }}>
                            <span className="text-xs font-bold text-white">{getInitials(user.name)}</span>
                          </div>
                          <div>
                            <p className="text-sm font-medium" style={{ color: '#1F2937' }}>{user.name}</p>
                            <p className="text-xs mt-0.5" style={{ color: '#92400E' }}>ID #{user.id}</p>
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4 text-sm" style={{ color: '#374151' }}>{user.email}</td>
                      <td className="px-6 py-4">
                        <span
                          className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium"
                          style={user.role === 'admin'
                            ? { background: 'rgba(124,58,237,0.08)', color: '#7C3AED', border: '1px solid rgba(124,58,237,0.2)' }
                            : { background: '#FEF3C7', color: '#92400E', border: '1px solid #FDE68A' }
                          }
                        >
                          {user.role === 'admin' && (
                            <svg className="w-3 h-3" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                              <path strokeLinecap="round" strokeLinejoin="round" d="M9 12.75L11.25 15 15 9.75m-3-7.036A11.959 11.959 0 013.598 6 11.99 11.99 0 003 9.749c0 5.592 3.824 10.29 9 11.623 5.176-1.332 9-6.03 9-11.622 0-1.31-.21-2.571-.598-3.751h-.152c-3.196 0-6.1-1.248-8.25-3.285z" />
                            </svg>
                          )}
                          {user.role === 'admin' ? 'Admin' : 'User'}
                        </span>
                      </td>
                      <td className="px-6 py-4">
                        <span
                          className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium"
                          style={user.is_active
                            ? { background: 'rgba(16,185,129,0.08)', color: '#059669', border: '1px solid rgba(16,185,129,0.2)' }
                            : { background: 'rgba(239,68,68,0.08)', color: '#DC2626', border: '1px solid rgba(239,68,68,0.2)' }
                          }
                        >
                          <span className="w-1.5 h-1.5 rounded-full" style={{ background: user.is_active ? '#10B981' : '#EF4444' }}></span>
                          {user.is_active ? 'Hoạt động' : 'Bị khóa'}
                        </span>
                      </td>
                      <td className="px-6 py-4 text-sm" style={{ color: '#374151' }}>
                        {user.created_at ? new Date(user.created_at).toLocaleDateString('vi-VN', { day: '2-digit', month: 'short', year: 'numeric' }) : '—'}
                      </td>
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-2">
                          <button
                            onClick={() => handleEdit(user)}
                            className="p-2 rounded-xl transition-all"
                            style={{ background: '#FEF9F0', border: '1px solid #FDE68A', color: '#F59E0B' }}
                            title="Chỉnh sửa"
                          >
                            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                              <path strokeLinecap="round" strokeLinejoin="round" d="M16.862 4.487l1.687-1.688a1.875 1.875 0 112.652 2.652L10.582 16.07a4.5 4.5 0 01-1.897 1.13L6 18l.8-2.685a4.5 4.5 0 011.13-1.897l8.932-8.931zm0 0L19.5 7.125M18 14v4.75A2.25 2.25 0 0115.75 21H5.25A2.25 2.25 0 013 18.75V8.25A2.25 2.25 0 015.25 6H10" />
                            </svg>
                          </button>
                          <button
                            onClick={() => handleToggleStatus(user)}
                            disabled={togglingId === user.id}
                            className="p-2 rounded-xl transition-all disabled:opacity-50"
                            style={user.is_active
                              ? { background: 'rgba(239,68,68,0.08)', border: '1px solid rgba(239,68,68,0.2)', color: '#EF4444' }
                              : { background: 'rgba(16,185,129,0.08)', border: '1px solid rgba(16,185,129,0.2)', color: '#10B981' }
                            }
                            title={user.is_active ? 'Khóa tài khoản' : 'Mở khóa tài khoản'}
                          >
                            {togglingId === user.id ? (
                              <div className="w-4 h-4 rounded-full animate-spin" style={{ border: '2px solid rgba(0,0,0,0.15)', borderTopColor: 'currentColor' }}></div>
                            ) : user.is_active ? (
                              <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                                <path strokeLinecap="round" strokeLinejoin="round" d="M16.5 10.5V6.75a4.5 4.5 0 10-9 0v3.75m-.75 11.25h10.5a2.25 2.25 0 002.25-2.25v-6.75a2.25 2.25 0 00-2.25-2.25H6.75a2.25 2.25 0 00-2.25 2.25v6.75a2.25 2.25 0 002.25 2.25z" />
                              </svg>
                            ) : (
                              <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                                <path strokeLinecap="round" strokeLinejoin="round" d="M13.5 10.5V6.75a4.5 4.5 0 119 0v3.75M3.75 21.75h10.5a2.25 2.25 0 002.25-2.25v-6.75a2.25 2.25 0 00-2.25-2.25H3.75a2.25 2.25 0 00-2.25 2.25v6.75a2.25 2.25 0 002.25 2.25z" />
                              </svg>
                            )}
                          </button>
                          <button
                            onClick={() => setDeleteTarget(user)}
                            className="p-2 rounded-xl transition-all"
                            style={{ background: 'rgba(239,68,68,0.08)', border: '1px solid rgba(239,68,68,0.2)', color: '#EF4444' }}
                            title="Xóa tài khoản"
                          >
                            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                              <path strokeLinecap="round" strokeLinejoin="round" d="M14.74 9l-.346 9m-4.788 0L9.26 9m9.968-3.21c.342.052.682.107 1.022.166m-1.022-.165L18.16 19.673a2.25 2.25 0 01-2.244 2.077H8.084a2.25 2.25 0 01-2.244-2.077L4.772 5.79m14.456 0a48.108 48.108 0 00-3.478-.397m-12 .562c.34-.059.68-.114 1.022-.165m0 0a48.11 48.11 0 013.478-.397m7.5 0v-.916c0-1.18-.91-2.164-2.09-2.201a51.964 51.964 0 00-3.32 0c-1.18.037-2.09 1.022-2.09 2.201v.916m7.5 0a48.667 48.667 0 00-7.5 0" />
                            </svg>
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            {totalPages > 1 && (
              <div className="px-6 py-4 flex items-center justify-between" style={{ borderTop: '1px solid #FDE68A' }}>
                <p className="text-xs" style={{ color: '#92400E' }}>
                  {(currentPage - 1) * itemsPerPage + 1}–{Math.min(currentPage * itemsPerPage, filteredUsers.length)} / {filteredUsers.length}
                </p>
                <div className="flex items-center gap-1">
                  <button onClick={() => setCurrentPage(p => Math.max(1, p - 1))} disabled={currentPage === 1}
                    className="p-2 rounded-lg transition-colors disabled:opacity-30" style={{ color: '#92400E' }}>
                    <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                      <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 19.5L8.25 12l7.5-7.5" />
                    </svg>
                  </button>
                  {Array.from({ length: totalPages }, (_, i) => i + 1).map(page => (
                    <button key={page} onClick={() => setCurrentPage(page)}
                      className="w-8 h-8 rounded-lg text-xs font-medium transition-all"
                      style={currentPage === page ? { background: '#F59E0B', color: '#FFF' } : { color: '#92400E' }}>
                      {page}
                    </button>
                  ))}
                  <button onClick={() => setCurrentPage(p => Math.min(totalPages, p + 1))} disabled={currentPage === totalPages}
                    className="p-2 rounded-lg transition-colors disabled:opacity-30" style={{ color: '#92400E' }}>
                    <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                      <path strokeLinecap="round" strokeLinejoin="round" d="M8.25 4.5l7.5 7.5-7.5 7.5" />
                    </svg>
                  </button>
                </div>
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
};

export default AdminUsers;
