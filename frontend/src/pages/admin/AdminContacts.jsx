import { useState, useEffect, useMemo } from 'react';
import { contactAPI } from '../../utils/api';
import toast from 'react-hot-toast';

const AdminContacts = () => {
  const [contacts, setContacts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState('all');
  const [search, setSearch] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const [totalCount, setTotalCount] = useState(0);
  const [selectedId, setSelectedId] = useState(null);
  const [replyText, setReplyText] = useState('');
  const [replying, setReplying] = useState(false);
  const [deleteTarget, setDeleteTarget] = useState(null);
  const [deleting, setDeleting] = useState(false);
  const itemsPerPage = 10;

  useEffect(() => {
    setLoading(true);
    contactAPI.getAll({ limit: 100 })
      .then(res => {
        if (res.data.success) {
          setContacts(res.data.data.contacts || []);
          setTotalCount(res.data.data.pagination?.total || res.data.data.contacts?.length || 0);
        }
      })
      .catch(() => toast.error('Không tải được dữ liệu'))
      .finally(() => setLoading(false));
  }, []);

  const filteredContacts = useMemo(() => {
    let result = [...contacts];
    if (search.trim()) {
      const q = search.toLowerCase();
      result = result.filter(c =>
        c.name?.toLowerCase().includes(q) ||
        c.email?.toLowerCase().includes(q) ||
        c.subject?.toLowerCase().includes(q) ||
        c.message?.toLowerCase().includes(q)
      );
    }
    if (filter !== 'all') {
      result = result.filter(c => {
        if (filter === 'unread') return c.status === 'new';
        if (filter === 'read') return c.status === 'read';
        if (filter === 'replied') return c.status === 'replied';
        return true;
      });
    }
    result.sort((a, b) => {
      const order = { new: 0, read: 1, replied: 2, archived: 3 };
      if (order[a.status] !== order[b.status]) return order[a.status] - order[b.status];
      return new Date(b.created_at) - new Date(a.created_at);
    });
    return result;
  }, [contacts, search, filter]);

  const totalPages = Math.ceil(filteredContacts.length / itemsPerPage);
  const paginatedContacts = filteredContacts.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  const selectedContact = useMemo(() => contacts.find(c => c.id === selectedId), [contacts, selectedId]);
  const unreadCount = contacts.filter(c => c.status === 'new').length;
  const repliedCount = contacts.filter(c => c.status === 'replied').length;

  useEffect(() => { setCurrentPage(1); }, [search, filter]);
  useEffect(() => {
    if (paginatedContacts.length > 0 && !selectedId) setSelectedId(paginatedContacts[0].id);
    else if (paginatedContacts.length === 0) setSelectedId(null);
  }, [paginatedContacts, selectedId]);

  const markAsRead = async (id) => {
    try {
      await contactAPI.updateStatus(id, 'read');
      setContacts(prev => prev.map(c => c.id === id ? { ...c, status: 'read' } : c));
    } catch { toast.error('Cập nhật thất bại'); }
  };

  const markAsUnread = async (id) => {
    try {
      await contactAPI.updateStatus(id, 'new');
      setContacts(prev => prev.map(c => c.id === id ? { ...c, status: 'new' } : c));
    } catch { toast.error('Cập nhật thất bại'); }
  };

  const markAsArchived = async (id) => {
    try {
      await contactAPI.updateStatus(id, 'archived');
      setContacts(prev => prev.map(c => c.id === id ? { ...c, status: 'archived' } : c));
      if (selectedId === id) setSelectedId(null);
      toast.success('Đã lưu trữ');
    } catch { toast.error('Cập nhật thất bại'); }
  };

  const handleReply = async () => {
    if (!replyText.trim()) { toast.error('Vui lòng nhập nội dung phản hồi'); return; }
    if (!selectedId) return;
    setReplying(true);
    try {
      const res = await contactAPI.reply(selectedId, { admin_reply: replyText });
      if (res.data?.success) {
        setContacts(prev => prev.map(c => c.id === selectedId ? { ...c, status: 'replied', admin_reply: replyText, replied_at: new Date() } : c));
        toast.success('Phản hồi thành công');
        setReplyText('');
      } else {
        toast.error(res.data?.message || 'Phản hồi thất bại');
      }
    } catch { toast.error('Phản hồi thất bại'); }
    finally { setReplying(false); }
  };

  const handleDelete = async () => {
    if (!deleteTarget) return;
    setDeleting(true);
    try {
      const res = await contactAPI.delete(deleteTarget.id);
      if (res.data?.success) {
        setContacts(prev => prev.filter(c => c.id !== deleteTarget.id));
        toast.success('Đã xóa liên hệ');
        if (selectedId === deleteTarget.id) setSelectedId(null);
      } else {
        toast.error(res.data?.message || 'Xóa thất bại');
      }
    } catch { toast.error('Xóa thất bại'); }
    finally { setDeleting(false); setDeleteTarget(null); }
  };

  const getInitials = (name) => {
    if (!name) return '??';
    return name.split(' ').map(n => n[0]).join('').slice(0, 2).toUpperCase();
  };

  const formatDate = (date) => {
    if (!date) return '';
    return new Date(date).toLocaleDateString('vi-VN', { day: '2-digit', month: 'short', year: 'numeric' });
  };

  const formatDateTime = (date) => {
    if (!date) return '';
    return new Date(date).toLocaleString('vi-VN', { day: '2-digit', month: 'short', year: 'numeric', hour: '2-digit', minute: '2-digit' });
  };

  const getStatusBadge = (status) => {
    const map = {
      new: { label: 'Mới', bg: '#FEF3C7', color: '#92400E', dot: '#F59E0B' },
      read: { label: 'Đã đọc', bg: '#DBEAFE', color: '#1D4ED8', dot: '#3B82F6' },
      replied: { label: 'Đã phản hồi', bg: '#D1FAE5', color: '#065F46', dot: '#10B981' },
      archived: { label: 'Lưu trữ', bg: '#F3F4F6', color: '#6B7280', dot: '#9CA3AF' },
    };
    return map[status] || map.new;
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="w-10 h-10 rounded-full animate-spin" style={{ border: '3px solid #FDE68A', borderTopColor: '#F59E0B' }}></div>
      </div>
    );
  }

  return (
    <div className="space-y-5">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold" style={{ color: '#1F2937', fontFamily: 'system-ui, -apple-system, "Segoe UI", Roboto, sans-serif' }}>Liên hệ</h1>
        <p className="text-sm mt-1" style={{ color: '#92400E' }}>
          {unreadCount > 0 ? `${unreadCount} liên hệ chưa đọc` : 'Tất cả đã được xử lý'}
        </p>
      </div>

      {/* Stat Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {[
          { label: 'Tổng liên hệ', value: contacts.length, bg: '#FFFBEB', border: '#FDE68A', text: '#92400E' },
          { label: 'Chưa đọc', value: unreadCount, bg: '#FFF7ED', border: '#FDBA74', text: '#C2410C', highlight: unreadCount > 0 },
          { label: 'Đã phản hồi', value: repliedCount, bg: '#ECFDF5', border: '#6EE7B7', text: '#065F46' },
          { label: 'Đã xử lý', value: contacts.length - unreadCount, bg: '#F9FAFB', border: '#E5E7EB', text: '#6B7280' },
        ].map((card, i) => (
          <div
            key={i}
            className="rounded-xl p-4 flex items-center gap-3"
            style={{ background: card.bg, border: `1px solid ${card.border}` }}
          >
            <div className="w-10 h-10 rounded-lg flex items-center justify-center" style={{ background: card.border }}>
              <svg className="w-5 h-5" style={{ color: card.text }} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M21.75 6.75v10.5a2.25 2.25 0 01-2.25 2.25h-15a2.25 2.25 0 01-2.25-2.25V6.75m19.5 0A2.25 2.25 0 0019.5 4.5h-15a2.25 2.25 0 00-2.25 2.25m19.5 0v.243a2.25 2.25 0 01-1.07 1.916l-7.5 4.615a2.25 2.25 0 01-2.36 0L3.32 8.91a2.25 2.25 0 01-1.07-1.916V6.75" />
              </svg>
            </div>
            <div>
              <p className="text-xs font-medium uppercase tracking-wider" style={{ color: card.text }}>{card.label}</p>
              <p className="text-2xl font-bold" style={{ color: card.highlight ? '#EA580C' : card.text, fontFamily: 'system-ui, -apple-system, "Segoe UI", Roboto, sans-serif' }}>{card.value}</p>
            </div>
          </div>
        ))}
      </div>

      {/* Filters */}
      <div className="flex flex-wrap items-center gap-3 p-4 rounded-2xl" style={{ background: '#FFFFFF', border: '1px solid #FDE68A', boxShadow: '0 1px 8px rgba(146,64,14,0.06)' }}>
        <div className="relative flex-1 min-w-[200px] max-w-md">
          <svg className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2" style={{ color: '#92400E' }} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.75}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M21 21l-5.197-5.197m0 0A7.5 7.5 0 105.196 5.196a7.5 7.5 0 0010.607 10.607z" />
          </svg>
          <input
            type="text"
            placeholder="Tìm tên, email, tiêu đề, nội dung..."
            value={search}
            onChange={e => setSearch(e.target.value)}
            className="w-full pl-10 pr-10 py-2.5 rounded-xl text-sm"
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
            { key: 'all', label: 'Tất cả' },
            { key: 'unread', label: 'Mới' },
            { key: 'read', label: 'Đã đọc' },
            { key: 'replied', label: 'Đã phản hồi' },
          ].map(item => (
            <button
              key={item.key}
              onClick={() => setFilter(item.key)}
              className="px-4 py-2.5 text-xs font-medium transition-all"
              style={filter === item.key
                ? { background: '#F59E0B', color: '#FFF' }
                : { background: '#FFFBEB', color: '#92400E' }
              }
            >
              {item.label}
            </button>
          ))}
        </div>
      </div>

      {/* Main Content */}
      <div
        className="rounded-2xl overflow-hidden flex"
        style={{ background: '#FFFFFF', border: '1px solid #FDE68A', boxShadow: '0 1px 8px rgba(146,64,14,0.06)', minHeight: '600px' }}
      >
        {/* Left: List */}
        <div
          className="w-full lg:w-[380px] flex flex-col flex-shrink-0"
          style={{ borderRight: '1px solid #FDE68A' }}
        >
          <div className="px-5 py-4 flex items-center justify-between" style={{ background: '#FEF3C7', borderBottom: '1px solid #FDE68A' }}>
            <div>
              <p className="text-[10px] font-medium uppercase tracking-widest" style={{ color: '#92400E' }}>Hộp thư liên hệ</p>
              <p className="text-xs mt-0.5" style={{ color: '#92400E' }}>{filteredContacts.length} tin nhắn</p>
            </div>
            {unreadCount > 0 && (
              <span className="px-2.5 py-1 rounded-full text-[10px] font-bold text-white" style={{ background: '#DC2626' }}>
                {unreadCount} mới
              </span>
            )}
          </div>

          <div className="flex-1 overflow-y-auto">
            {paginatedContacts.length === 0 ? (
              <div className="py-16 text-center px-6">
                <svg className="w-12 h-12 mx-auto mb-3" style={{ color: '#FDE68A' }} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M21 21l-5.197-5.197m0 0A7.5 7.5 0 105.196 5.196a7.5 7.5 0 0010.607 10.607z" />
                </svg>
                <p className="text-sm font-medium" style={{ color: '#374151' }}>Không có liên hệ nào</p>
              </div>
            ) : (
              paginatedContacts.map(contact => {
                const isSelected = selectedId === contact.id;
                const isUnread = contact.status === 'new';
                const badge = getStatusBadge(contact.status);
                return (
                  <div
                    key={contact.id}
                    onClick={() => { setSelectedId(contact.id); if (isUnread) markAsRead(contact.id); }}
                    className="px-5 py-4 cursor-pointer transition-all duration-200 group"
                    style={{
                      background: isSelected ? '#FEF3C7' : 'transparent',
                      borderBottom: '1px solid #FEF9F0',
                    }}
                    onMouseEnter={e => { if (!isSelected) e.currentTarget.style.background = '#FFFBEB'; }}
                    onMouseLeave={e => { if (!isSelected) e.currentTarget.style.background = 'transparent'; }}
                  >
                    <div className="flex items-start gap-3">
                      <div className="w-10 h-10 rounded-xl flex items-center justify-center flex-shrink-0" style={{ background: isUnread ? '#F59E0B' : '#FEF3C7' }}>
                        <span className="text-xs font-bold" style={{ color: isUnread ? '#FFF' : '#92400E' }}>{getInitials(contact.name)}</span>
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center justify-between mb-0.5">
                          <p className="text-sm font-semibold truncate" style={{ color: isUnread && !isSelected ? '#1F2937' : '#374151' }}>
                            {contact.name}
                          </p>
                          <span className="w-1.5 h-1.5 rounded-full flex-shrink-0 ml-2 mt-1.5" style={{ background: badge.dot }}></span>
                        </div>
                        <p className="text-xs truncate mb-0.5" style={{ color: '#92400E' }}>{contact.email}</p>
                        <p className="text-sm font-medium truncate" style={{ color: '#1F2937' }}>{contact.subject || '(Không có tiêu đề)'}</p>
                        <p className="text-[10px] mt-1" style={{ color: '#92400E' }}>{formatDate(contact.created_at)}</p>
                      </div>
                    </div>
                  </div>
                );
              })
            )}
          </div>

          {totalPages > 1 && (
            <div className="px-5 py-3 flex items-center justify-between" style={{ borderTop: '1px solid #FDE68A' }}>
              <p className="text-[10px]" style={{ color: '#92400E' }}>
                {(currentPage - 1) * itemsPerPage + 1}–{Math.min(currentPage * itemsPerPage, filteredContacts.length)} / {filteredContacts.length}
              </p>
              <div className="flex gap-1">
                <button onClick={() => setCurrentPage(p => Math.max(1, p - 1))} disabled={currentPage === 1}
                  className="w-7 h-7 rounded-lg text-xs flex items-center justify-center transition-all disabled:opacity-30"
                  style={{ color: '#92400E', background: '#FFFBEB' }}>
                  <svg className="w-3 h-3" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 19.5L8.25 12l7.5-7.5" />
                  </svg>
                </button>
                <span className="w-7 h-7 rounded-lg text-xs flex items-center justify-center font-medium" style={{ background: '#F59E0B', color: '#FFF' }}>
                  {currentPage}
                </span>
                <button onClick={() => setCurrentPage(p => Math.min(totalPages, p + 1))} disabled={currentPage === totalPages}
                  className="w-7 h-7 rounded-lg text-xs flex items-center justify-center transition-all disabled:opacity-30"
                  style={{ color: '#92400E', background: '#FFFBEB' }}>
                  <svg className="w-3 h-3" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M8.25 4.5l7.5 7.5-7.5 7.5" />
                  </svg>
                </button>
              </div>
            </div>
          )}
        </div>

        {/* Right: Detail */}
        <div className="hidden lg:flex flex-1 flex-col overflow-hidden">
          {selectedContact ? (
            <>
              <div className="px-8 py-6" style={{ borderBottom: '1px solid #FDE68A' }}>
                <div className="flex items-start justify-between mb-4">
                  <div className="flex items-center gap-4">
                    <div className="w-14 h-14 rounded-2xl flex items-center justify-center" style={{ background: 'linear-gradient(135deg, #F59E0B, #FCD34D)' }}>
                      <span className="text-lg font-bold" style={{ color: '#1F2937' }}>{getInitials(selectedContact.name)}</span>
                    </div>
                    <div>
                      <p className="text-xl font-bold" style={{ color: '#1F2937', fontFamily: 'system-ui, -apple-system, "Segoe UI", Roboto, sans-serif' }}>{selectedContact.name}</p>
                      <p className="text-sm" style={{ color: '#92400E' }}>{selectedContact.email}</p>
                      {selectedContact.phone && (
                        <p className="text-sm" style={{ color: '#92400E' }}>{selectedContact.phone}</p>
                      )}
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="px-3 py-1.5 rounded-full text-xs font-medium" style={{ background: getStatusBadge(selectedContact.status).bg, color: getStatusBadge(selectedContact.status).color }}>
                      {getStatusBadge(selectedContact.status).label}
                    </span>
                    {selectedContact.status === 'read' && (
                      <button onClick={() => markAsUnread(selectedContact.id)}
                        className="p-2 rounded-xl transition-all" style={{ color: '#92400E', border: '1px solid #FDE68A' }}
                        title="Đánh dấu chưa đọc">
                        <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.75}>
                          <path strokeLinecap="round" strokeLinejoin="round" d="M3.981 19.644v4.356a2.25 2.25 0 01-2.25 2.25h4.356m8.606-14.298l-8.606 8.606-3.982-3.982" />
                        </svg>
                      </button>
                    )}
                    {selectedContact.status !== 'archived' && (
                      <button onClick={() => markAsArchived(selectedContact.id)}
                        className="p-2 rounded-xl transition-all" style={{ color: '#92400E', border: '1px solid #FDE68A' }}
                        title="Lưu trữ">
                        <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.75}>
                          <path strokeLinecap="round" strokeLinejoin="round" d="M5 8h14M5 8a2 2 0 110-4h14a2 2 0 110 4M5 8v10a2 2 0 002 2h10a2 2 0 002-2V8m-9 4h4" />
                        </svg>
                      </button>
                    )}
                    <button onClick={() => setDeleteTarget({ id: selectedContact.id, name: selectedContact.name })}
                      className="p-2 rounded-xl transition-all"
                      style={{ color: '#92400E' }}
                      onMouseEnter={e => { e.currentTarget.style.background = '#FEE2E2'; e.currentTarget.style.color = '#EF4444'; }}
                      onMouseLeave={e => { e.currentTarget.style.background = 'transparent'; e.currentTarget.style.color = '#92400E'; }}
                      title="Xóa">
                      <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.75}>
                        <path strokeLinecap="round" strokeLinejoin="round" d="M14.74 9l-.346 9m-4.788 0L9.26 9m9.968-3.21c.342.052.682.107 1.022.166m-1.022-.165L18.16 19.673a2.25 2.25 0 01-2.244 2.077H8.084a2.25 2.25 0 01-2.244-2.077L4.772 5.79m14.456 0a48.108 48.108 0 00-3.478-.397" />
                      </svg>
                    </button>
                  </div>
                </div>

                <div className="flex items-center gap-4 text-xs" style={{ color: '#92400E' }}>
                  <span className="flex items-center gap-1.5">
                    <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                      <path strokeLinecap="round" strokeLinejoin="round" d="M6.75 3v2.25M17.25 3v2.25M3 18.75V7.5a2.25 2.25 0 012.25-2.25h13.5A2.25 2.25 0 0121 7.5v11.25m-18 0A2.25 2.25 0 005.25 21h13.5A2.25 2.25 0 0021 18.75m-18 0v-7.5A2.25 2.25 0 015.25 9h13.5A2.25 2.25 0 0121 11.25v7.5" />
                    </svg>
                    {formatDateTime(selectedContact.created_at)}
                  </span>
                  {selectedContact.replied_at && (
                    <span className="flex items-center gap-1.5">
                      <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                        <path strokeLinecap="round" strokeLinejoin="round" d="M9 12.75L11.25 15 15 9.75M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                      </svg>
                      Phản hồi lúc {formatDateTime(selectedContact.replied_at)}
                    </span>
                  )}
                </div>

                {selectedContact.subject && (
                  <div className="mt-3 px-4 py-3 rounded-xl" style={{ background: '#FEF3C7', border: '1px solid #FDE68A' }}>
                    <p className="text-[10px] font-medium uppercase tracking-wider mb-1" style={{ color: '#92400E' }}>Tiêu đề</p>
                    <p className="text-sm font-semibold" style={{ color: '#1F2937' }}>{selectedContact.subject}</p>
                  </div>
                )}
              </div>

              <div className="flex-1 overflow-y-auto px-8 py-6">
                {/* Admin Reply */}
                {selectedContact.admin_reply && (
                  <div className="mb-6">
                    <p className="text-[10px] font-medium uppercase tracking-wider mb-3" style={{ color: '#92400E' }}>Phản hồi của bạn</p>
                    <div className="p-5 rounded-xl leading-relaxed" style={{ background: '#ECFDF5', border: '1px solid #6EE7B7', color: '#065F46' }}>
                      <p className="text-sm whitespace-pre-wrap">{selectedContact.admin_reply}</p>
                      {selectedContact.replied_at && (
                        <p className="text-[10px] mt-3" style={{ color: '#065F46', opacity: 0.6 }}>
                          Đã gửi lúc {formatDateTime(selectedContact.replied_at)}
                        </p>
                      )}
                    </div>
                  </div>
                )}

                {/* Original Message */}
                <div className="mb-6">
                  <p className="text-[10px] font-medium uppercase tracking-wider mb-3" style={{ color: '#92400E' }}>Nội dung tin nhắn</p>
                  <div className="p-6 rounded-xl leading-relaxed" style={{ background: '#FEF3C7', border: '1px solid #FDE68A', color: '#374151' }}>
                    <p className="text-sm whitespace-pre-wrap">{selectedContact.message}</p>
                  </div>
                </div>

                {/* Reply Form */}
                <div>
                  <p className="text-[10px] font-medium uppercase tracking-wider mb-3" style={{ color: '#92400E' }}>
                    {selectedContact.admin_reply ? 'Gửi phản hồi khác' : 'Gửi phản hồi'}
                  </p>
                  <textarea
                    value={replyText}
                    onChange={e => setReplyText(e.target.value)}
                    placeholder="Nhập nội dung phản hồi cho khách hàng..."
                    rows={4}
                    className="w-full px-4 py-3 rounded-xl text-sm resize-none"
                    style={{ background: '#FFFBEB', border: '1px solid #FDE68A', color: '#1F2937', outline: 'none' }}
                    onFocus={e => { e.currentTarget.style.borderColor = '#F59E0B'; }}
                    onBlur={e => { e.currentTarget.style.borderColor = '#FDE68A'; }}
                  />
                  <div className="mt-3 flex items-center gap-2">
                    <button
                      onClick={handleReply}
                      disabled={replying}
                      className="px-6 py-2.5 rounded-xl text-sm font-medium text-white transition-all duration-200 disabled:opacity-50"
                      style={{ background: 'linear-gradient(135deg, #F59E0B, #FCD34D)', boxShadow: '0 4px 14px rgba(245,158,11,0.3)' }}
                      onMouseEnter={e => { if (!replying) e.currentTarget.style.transform = 'translateY(-1px)'; }}
                      onMouseLeave={e => { e.currentTarget.style.transform = 'translateY(0)'; }}
                    >
                      {replying ? 'Đang gửi...' : 'Gửi phản hồi'}
                    </button>
                    {replyText && (
                      <button onClick={() => setReplyText('')}
                        className="px-4 py-2.5 rounded-xl text-sm font-medium transition-all"
                        style={{ background: '#FEF3C7', color: '#92400E', border: '1px solid #FDE68A' }}
                      >
                        Hủy
                      </button>
                    )}
                    <a
                      href={`mailto:${selectedContact.email}${replyText ? `?subject=Re: ${selectedContact.subject || 'Lien he tu AURA Jewelry'}&body=${encodeURIComponent(replyText)}` : ''}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="ml-auto px-4 py-2.5 rounded-xl text-sm font-medium transition-all"
                      style={{ background: '#FEF3C7', color: '#92400E', border: '1px solid #FDE68A' }}
                    >
                      <span className="flex items-center gap-1.5">
                        <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                          <path strokeLinecap="round" strokeLinejoin="round" d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                        </svg>
                        Mở email
                      </span>
                    </a>
                  </div>
                </div>
              </div>
            </>
          ) : (
            <div className="flex-1 flex flex-col items-center justify-center text-center px-8">
              <div className="w-28 h-28 rounded-full flex items-center justify-center mb-6" style={{ background: '#FEF3C7' }}>
                <svg className="w-14 h-14" style={{ color: '#FDE68A' }} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={0.8}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M21.75 6.75v10.5a2.25 2.25 0 01-2.25 2.25h-15a2.25 2.25 0 01-2.25-2.25V6.75m19.5 0A2.25 2.25 0 0019.5 4.5h-15a2.25 2.25 0 00-2.25 2.25m19.5 0v.243a2.25 2.25 0 01-1.07 1.916l-7.5 4.615a2.25 2.25 0 01-2.36 0L3.32 8.91a2.25 2.25 0 01-1.07-1.916V6.75" />
                </svg>
              </div>
              <h3 className="text-2xl font-bold mb-3" style={{ color: '#1F2937', fontFamily: 'system-ui, -apple-system, "Segoe UI", Roboto, sans-serif' }}>
                Chọn liên hệ để xem
              </h3>
              <p className="text-sm max-w-xs leading-relaxed" style={{ color: '#92400E' }}>
                Chọn một liên hệ từ danh sách bên trái để xem chi tiết và phản hồi.
              </p>
              {unreadCount > 0 && (
                <div className="mt-6 px-5 py-3 rounded-xl" style={{ background: '#FEF3C7', border: '1px solid #FDE68A' }}>
                  <p className="text-sm" style={{ color: '#92400E' }}>
                    <span className="font-bold">{unreadCount}</span> liên hệ chưa được phản hồi
                  </p>
                </div>
              )}
            </div>
          )}
        </div>
      </div>

      {/* Delete Confirmation Modal */}
      {deleteTarget && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center p-4"
          style={{ background: 'rgba(0,0,0,0.45)', backdropFilter: 'blur(4px)' }}
        >
          <div
            className="w-full max-w-sm rounded-2xl p-6 text-center"
            style={{ background: '#FFFFFF', boxShadow: '0 20px 60px rgba(0,0,0,0.15)' }}
          >
            <div className="w-16 h-16 mx-auto mb-4 rounded-full flex items-center justify-center" style={{ background: '#FEE2E2' }}>
              <svg className="w-8 h-8" style={{ color: '#EF4444' }} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M14.74 9l-.346 9m-4.788 0L9.26 9m9.968-3.21c.342.052.682.107 1.022.166m-1.022-.165L18.16 19.673a2.25 2.25 0 01-2.244 2.077H8.084a2.25 2.25 0 01-2.244-2.077L4.772 5.79m14.456 0a48.108 48.108 0 00-3.478-.397" />
              </svg>
            </div>
            <h3 className="text-lg font-bold mb-2" style={{ color: '#1F2937', fontFamily: 'system-ui, -apple-system, "Segoe UI", Roboto, sans-serif' }}>Xóa liên hệ</h3>
            <p className="text-sm mb-6" style={{ color: '#6B7280' }}>
              Bạn có chắc muốn xóa liên hệ của <strong style={{ color: '#1F2937' }}>"{deleteTarget.name}"</strong>? Hành động này không thể hoàn tác.
            </p>
            <div className="flex gap-3">
              <button
                onClick={() => setDeleteTarget(null)}
                className="flex-1 py-2.5 rounded-xl text-sm font-medium transition-all"
                style={{ background: '#F3F4F6', color: '#374151' }}
              >
                Hủy
              </button>
              <button
                onClick={handleDelete}
                className="flex-1 py-2.5 rounded-xl text-sm font-medium text-white transition-all disabled:opacity-60"
                style={{ background: '#EF4444', boxShadow: '0 4px 14px rgba(239,68,68,0.3)' }}
                disabled={deleting}
              >
                {deleting ? 'Đang xóa...' : 'Xóa'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminContacts;
