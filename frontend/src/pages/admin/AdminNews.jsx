import { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import toast from 'react-hot-toast';
import { newsAPI } from '../../utils/api';
import api from '../../utils/api';
import { getImageUrl } from '../../utils/helpers';

const AdminNews = () => {
  const navigate = useNavigate();
  const [news, setNews] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [filterCategory, setFilterCategory] = useState('all');
  const [filterStatus, setFilterStatus] = useState('all');
  const [filterFeatured, setFilterFeatured] = useState('all');
  const [currentPage, setCurrentPage] = useState(1);
  const [totalCount, setTotalCount] = useState(0);
  const [categories, setCategories] = useState([]);
  const [deleteTarget, setDeleteTarget] = useState(null);
  const [deleting, setDeleting] = useState(false);
  const itemsPerPage = 10;

  const fetchNews = (page = 1) => {
    setLoading(true);
    const params = { page, limit: itemsPerPage };
    if (search.trim()) params.search = search.trim();
    if (filterCategory !== 'all') params.category = filterCategory;
    if (filterStatus !== 'all') params.is_published = filterStatus === 'published' ? 'true' : 'false';
    if (filterFeatured !== 'all') params.is_featured = filterFeatured === 'featured' ? 'true' : 'false';

    Promise.all([
      newsAPI.getAll(params),
      api.get('/news/categories'),
    ])
      .then(([newsRes, catRes]) => {
        if (newsRes.data.success) {
          setNews(newsRes.data.data.news || []);
          setTotalCount(newsRes.data.data.pagination?.total || 0);
        }
        if (catRes.data.success) setCategories(catRes.data.data.categories || []);
      })
      .catch(() => toast.error('Không tải được dữ liệu'))
      .finally(() => setLoading(false));
  };

  useEffect(() => { fetchNews(currentPage); }, [currentPage, search, filterCategory, filterStatus, filterFeatured]);

  useEffect(() => { setCurrentPage(1); }, [search, filterCategory, filterStatus, filterFeatured]);

  const totalPages = Math.ceil(totalCount / itemsPerPage);

  const handleDelete = async () => {
    if (!deleteTarget) return;
    setDeleting(true);
    try {
      const res = await newsAPI.delete(deleteTarget.id);
        if (res.data.success) {
        toast.success('Đã xóa bài viết');
        fetchNews(currentPage);
      } else {
        toast.error(res.data.message || 'Xóa thất bại');
      }
    } catch (err) {
      toast.error(err.response?.data?.message || 'Xóa thất bại');
    } finally {
      setDeleting(false);
      setDeleteTarget(null);
    }
  };

  const getCategoryStyle = (cat) => {
    const map = {
      'Tin tức': { bg: '#DBEAFE', text: '#1D4ED8' },
      'Khuyến mãi': { bg: '#FEE2E2', text: '#991B1B' },
      'Sự kiện': { bg: '#EDE9FE', text: '#7C3AED' },
      'Hướng dẫn': { bg: '#D1FAE5', text: '#065F46' },
    };
    return map[cat] || { bg: '#FEF3C7', text: '#92400E' };
  };

  const formatDate = (date) => {
    if (!date) return '—';
    return new Date(date).toLocaleDateString('vi-VN', { day: '2-digit', month: 'short', year: 'numeric' });
  };

  return (
    <div className="space-y-5">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold" style={{ color: '#1F2937', fontFamily: 'system-ui, -apple-system, "Segoe UI", Roboto, sans-serif' }}>Tin tức</h1>
          <p className="text-sm mt-1" style={{ color: '#92400E' }}>{totalCount} bài viết</p>
        </div>
        <Link
          to="/admin/news/new"
          className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl text-sm font-medium text-white transition-all duration-200 hover:-translate-y-0.5"
          style={{ background: 'linear-gradient(135deg, #F59E0B, #FCD34D)', boxShadow: '0 4px 14px rgba(245,158,11,0.3)' }}
        >
          <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M12 4v16m8-8H4" />
          </svg>
          Viết bài mới
        </Link>
      </div>

      {/* Filters */}
      <div className="flex flex-wrap items-center gap-3 p-4 rounded-2xl" style={{ background: '#FFFFFF', border: '1px solid #FDE68A', boxShadow: '0 1px 8px rgba(146,64,14,0.06)' }}>
        {/* Search */}
        <div className="relative flex-1 min-w-[200px]">
          <svg className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2" style={{ color: '#92400E' }} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.75}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M21 21l-5.197-5.197m0 0A7.5 7.5 0 105.196 5.196a7.5 7.5 0 0010.607 10.607z" />
          </svg>
          <input
            type="text"
            placeholder="Tìm bài viết..."
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

        {/* Category filter */}
        <select
          value={filterCategory}
          onChange={e => setFilterCategory(e.target.value)}
          className="px-4 py-2.5 rounded-xl text-sm"
          style={{ background: '#FEF3C7', border: '1px solid #FDE68A', color: '#1F2937', outline: 'none' }}
        >
          <option value="all">Tất cả danh mục</option>
          {categories.map(c => (
            <option key={c} value={c}>{c}</option>
          ))}
        </select>

        {/* Status filter */}
        <select
          value={filterStatus}
          onChange={e => setFilterStatus(e.target.value)}
          className="px-4 py-2.5 rounded-xl text-sm"
          style={{ background: '#FEF3C7', border: '1px solid #FDE68A', color: '#1F2937', outline: 'none' }}
        >
          <option value="all">Tất cả trạng thái</option>
          <option value="published">Đã xuất bản</option>
          <option value="draft">Bản nháp</option>
        </select>

        {/* Featured filter */}
        <select
          value={filterFeatured}
          onChange={e => setFilterFeatured(e.target.value)}
          className="px-4 py-2.5 rounded-xl text-sm"
          style={{ background: '#FEF3C7', border: '1px solid #FDE68A', color: '#1F2937', outline: 'none' }}
        >
          <option value="all">Tất cả</option>
          <option value="featured">Nổi bật</option>
          <option value="normal">Thường</option>
        </select>
      </div>

      {/* Table */}
      <div className="rounded-2xl overflow-hidden" style={{ background: '#FFFFFF', border: '1px solid #FDE68A', boxShadow: '0 1px 8px rgba(146,64,14,0.06)' }}>
        {loading ? (
          <div className="flex justify-center py-16">
            <div className="w-10 h-10 rounded-full animate-spin" style={{ border: '3px solid #FDE68A', borderTopColor: '#F59E0B' }}></div>
          </div>
        ) : news.length === 0 ? (
          <div className="py-16 text-center">
            <svg className="w-16 h-16 mx-auto mb-4" style={{ color: '#FDE68A' }} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M19.5 14.25v-2.625a3.375 3.375 0 00-3.375-3.375h-1.5" />
            </svg>
            <p className="text-base font-medium mb-1" style={{ color: '#374151' }}>
              {search || filterCategory !== 'all' || filterStatus !== 'all' || filterFeatured !== 'all'
                ? 'Không tìm thấy bài viết phù hợp'
                : 'Chưa có bài viết nào'}
            </p>
            <p className="text-sm" style={{ color: '#92400E' }}>
              {search || filterCategory !== 'all' || filterStatus !== 'all' || filterFeatured !== 'all'
                ? 'Thử thay đổi bộ lọc hoặc từ khóa tìm kiếm'
                : 'Bắt đầu viết bài đầu tiên của bạn'}
            </p>
          </div>
        ) : (
          <>
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr style={{ background: '#FEF3C7' }}>
                    {['Bài viết', 'Danh mục', 'Trạng thái', 'Nổi bật', 'Lượt xem', 'Ngày tạo', 'Thao tác'].map((h, i) => (
                      <th key={i} className="px-5 py-4 text-left text-xs font-medium uppercase tracking-wider" style={{ color: '#92400E' }}>{h}</th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {news.map(item => {
                    const catStyle = getCategoryStyle(item.category);
                    const isPublished = item.is_published === 1 || item.is_published === true;
                    const isFeatured = item.is_featured === 1 || item.is_featured === true;
                    return (
                      <tr key={item.id} className="transition-colors group" style={{ borderBottom: '1px solid #FEF9F0' }}>
                        <td className="px-5 py-4">
                          <div className="flex items-center gap-3">
                            <img
                              src={getImageUrl(item.thumbnail || item.image)}
                              alt={item.title}
                              className="w-12 h-12 object-cover rounded-xl flex-shrink-0"
                              style={{ background: '#FEF3C7' }}
                              onError={e => { e.target.src = 'https://images.unsplash.com/photo-1556909114-f6e7ad7d3136?w=100&h=100&fit=crop'; }}
                            />
                            <div className="min-w-0">
                              <p className="text-sm font-medium line-clamp-1" style={{ color: '#1F2937' }}>{item.title}</p>
                              <p className="text-xs mt-0.5 line-clamp-1" style={{ color: '#92400E' }}>{item.author_name || 'Không có tác giả'}</p>
                            </div>
                          </div>
                        </td>
                        <td className="px-5 py-4">
                          <span className="text-xs px-3 py-1 rounded-lg inline-block" style={{ background: catStyle.bg, color: catStyle.text }}>
                            {item.category || '—'}
                          </span>
                        </td>
                        <td className="px-5 py-4">
                          <span
                            className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium"
                            style={isPublished ? { background: '#D1FAE5', color: '#065F46' } : { background: '#F3F4F6', color: '#6B7280' }}
                          >
                            <span className="w-1.5 h-1.5 rounded-full" style={{ background: isPublished ? '#10B981' : '#9CA3AF' }}></span>
                            {isPublished ? 'Xuất bản' : 'Nháp'}
                          </span>
                        </td>
                        <td className="px-5 py-4">
                          <span
                            className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium"
                            style={isFeatured ? { background: '#FEF3C7', color: '#92400E' } : { background: '#F3F4F6', color: '#9CA3AF' }}
                          >
                            {isFeatured ? (
                              <svg className="w-3.5 h-3.5" fill="currentColor" viewBox="0 0 24 24">
                                <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z" />
                              </svg>
                            ) : (
                              <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.75}>
                                <path d="M11.049 2.927c.3-.921 1.603-.921 1.902 0l1.519 4.674a1 1 0 00.95.69h4.915c.969 0 1.371 1.24.588 1.81l-3.976 2.888a1 1 0 00-.363 1.118l1.518 4.674c.3.922-.755 1.688-1.538 1.118l-3.976-2.888a1 1 0 00-1.176 0l-3.976 2.888c-.783.57-1.838-.197-1.538-1.118l1.518-4.674a1 1 0 00-.363-1.118l-3.976-2.888c-.784-.57-.38-1.81.588-1.81h4.914a1 1 0 00.951-.69l1.519-4.674z" />
                              </svg>
                            )}
                            {isFeatured ? 'Nổi bật' : 'Thường'}
                          </span>
                        </td>
                        <td className="px-5 py-4">
                          <span className="text-sm font-medium" style={{ color: '#374151' }}>{item.view_count || 0}</span>
                        </td>
                        <td className="px-5 py-4">
                          <span className="text-sm" style={{ color: '#374151' }}>{formatDate(item.created_at)}</span>
                        </td>
                        <td className="px-5 py-4">
                          <div className="flex items-center gap-1">
                            <Link
                              to={`/news/${item.slug || item.id}`}
                              target="_blank"
                              className="p-2 rounded-xl transition-all duration-200"
                              style={{ color: '#92400E' }}
                              onMouseEnter={e => { e.currentTarget.style.background = '#DBEAFE'; e.currentTarget.style.color = '#1D4ED8'; }}
                              onMouseLeave={e => { e.currentTarget.style.background = 'transparent'; e.currentTarget.style.color = '#92400E'; }}
                            >
                              <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.75}>
                                <path strokeLinecap="round" strokeLinejoin="round" d="M2.036 12.322a1.012 1.012 0 010-.639C3.423 7.51 7.36 4.5 12 4.5c4.638 0 8.573 3.007 9.963 7.178.07.207.07.431 0 .639C20.577 16.49 16.64 19.5 12 19.5c-4.638 0-8.573-3.007-9.963-7.178z" />
                                <path strokeLinecap="round" strokeLinejoin="round" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                              </svg>
                            </Link>
                            <Link
                              to={`/admin/news/edit/${item.id}`}
                              className="p-2 rounded-xl transition-all duration-200"
                              style={{ color: '#92400E' }}
                              onMouseEnter={e => { e.currentTarget.style.background = '#FEF3C7'; }}
                              onMouseLeave={e => { e.currentTarget.style.background = 'transparent'; }}
                            >
                              <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.75}>
                                <path strokeLinecap="round" strokeLinejoin="round" d="M16.862 4.487l1.687-1.688a1.875 1.875 0 112.652 2.652L10.582 16.07a4.5 4.5 0 01-1.897 1.13L6 18l.8-2.685a4.5 4.5 0 011.13-1.897l8.932-8.931z" />
                              </svg>
                            </Link>
                            <button
                              onClick={() => setDeleteTarget({ id: item.id, title: item.title })}
                              className="p-2 rounded-xl transition-all duration-200"
                              style={{ color: '#92400E' }}
                              onMouseEnter={e => { e.currentTarget.style.background = '#FEE2E2'; e.currentTarget.style.color = '#EF4444'; }}
                              onMouseLeave={e => { e.currentTarget.style.background = 'transparent'; e.currentTarget.style.color = '#92400E'; }}
                            >
                              <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.75}>
                                <path strokeLinecap="round" strokeLinejoin="round" d="M14.74 9l-.346 9m-4.788 0L9.26 9m9.968-3.21c.342.052.682.107 1.022.166m-1.022-.165L18.16 19.673a2.25 2.25 0 01-2.244 2.077H8.084a2.25 2.25 0 01-2.244-2.077L4.772 5.79m14.456 0a48.108 48.108 0 00-3.478-.397" />
                              </svg>
                            </button>
                          </div>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>

            {totalPages > 1 && (
              <div className="px-5 py-4 flex items-center justify-between" style={{ borderTop: '1px solid #FDE68A' }}>
                <p className="text-xs" style={{ color: '#92400E' }}>
                  {(currentPage - 1) * itemsPerPage + 1}–{Math.min(currentPage * itemsPerPage, totalCount)} / {totalCount}
                </p>
                <div className="flex items-center gap-1">
                  <button
                    onClick={() => setCurrentPage(p => Math.max(1, p - 1))}
                    disabled={currentPage === 1}
                    className="p-2 rounded-lg transition-colors disabled:opacity-30"
                    style={{ color: '#92400E' }}
                    onMouseEnter={e => { if (!e.currentTarget.disabled) e.currentTarget.style.background = '#FEF3C7'; }}
                    onMouseLeave={e => { e.currentTarget.style.background = 'transparent'; }}
                  >
                    <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                      <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 19.5L8.25 12l7.5-7.5" />
                    </svg>
                  </button>
                  {Array.from({ length: Math.min(totalPages, 5) }, (_, i) => {
                    let page;
                    if (totalPages <= 5) page = i + 1;
                    else if (currentPage <= 3) page = i + 1;
                    else if (currentPage >= totalPages - 2) page = totalPages - 4 + i;
                    else page = currentPage - 2 + i;
                    return (
                      <button
                        key={page}
                        onClick={() => setCurrentPage(page)}
                        className="w-8 h-8 rounded-lg text-xs font-medium transition-all"
                        style={currentPage === page ? { background: '#F59E0B', color: '#FFFFFF' } : { color: '#92400E' }}
                        onMouseEnter={e => { if (currentPage !== page) e.currentTarget.style.background = '#FEF3C7'; }}
                        onMouseLeave={e => { if (currentPage !== page) e.currentTarget.style.background = 'transparent'; }}
                      >
                        {page}
                      </button>
                    );
                  })}
                  <button
                    onClick={() => setCurrentPage(p => Math.min(totalPages, p + 1))}
                    disabled={currentPage === totalPages}
                    className="p-2 rounded-lg transition-colors disabled:opacity-30"
                    style={{ color: '#92400E' }}
                    onMouseEnter={e => { if (!e.currentTarget.disabled) e.currentTarget.style.background = '#FEF3C7'; }}
                    onMouseLeave={e => { e.currentTarget.style.background = 'transparent'; }}
                  >
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
            <div
              className="w-16 h-16 mx-auto mb-4 rounded-full flex items-center justify-center"
              style={{ background: '#FEE2E2' }}
            >
              <svg className="w-8 h-8" style={{ color: '#EF4444' }} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.75}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M14.74 9l-.346 9m-4.788 0L9.26 9m9.968-3.21c.342.052.682.107 1.022.166m-1.022-.165L18.16 19.673a2.25 2.25 0 01-2.244 2.077H8.084a2.25 2.25 0 01-2.244-2.077L4.772 5.79m14.456 0a48.108 48.108 0 00-3.478-.397" />
              </svg>
            </div>
            <h3 className="text-lg font-bold mb-2" style={{ color: '#1F2937' }}>Xác nhận xóa bài viết</h3>
            <p className="text-sm mb-6" style={{ color: '#6B7280' }}>
              Bạn có chắc muốn xóa bài viết <strong style={{ color: '#1F2937' }}>"{deleteTarget.title}"</strong>? Hành động này không thể hoàn tác.
            </p>
            <div className="flex gap-3">
              <button
                onClick={() => setDeleteTarget(null)}
                className="flex-1 py-2.5 rounded-xl text-sm font-medium transition-all"
                style={{ background: '#F3F4F6', color: '#374151' }}
                onMouseEnter={e => { e.currentTarget.style.background = '#E5E7EB'; }}
                onMouseLeave={e => { e.currentTarget.style.background = '#F3F4F6'; }}
                disabled={deleting}
              >
                Hủy
              </button>
              <button
                onClick={handleDelete}
                className="flex-1 py-2.5 rounded-xl text-sm font-medium text-white transition-all disabled:opacity-60"
                style={{ background: '#EF4444', boxShadow: '0 4px 14px rgba(239,68,68,0.3)' }}
                onMouseEnter={e => { if (!deleting) e.currentTarget.style.background = '#DC2626'; }}
                onMouseLeave={e => { e.currentTarget.style.background = '#EF4444'; }}
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

export default AdminNews;
