import { useState, useEffect, useMemo } from 'react';
import { Link } from 'react-router-dom';
import { productAPI } from '../../utils/api';
import { formatPrice, getImageUrl } from '../../utils/helpers';
import toast from 'react-hot-toast';

const AdminProducts = () => {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [filterCategory, setFilterCategory] = useState('all');
  const [currentPage, setCurrentPage] = useState(1);
  const [sortBy, setSortBy] = useState('newest');
  const itemsPerPage = 8;

  useEffect(() => {
    productAPI.getAll({ limit: 100 })
      .then(res => { if (res.data.success) setProducts(res.data.data.products); })
      .finally(() => setLoading(false));
  }, []);

  const categories = useMemo(() => {
    const cats = [...new Set(products.map(p => p.category_name).filter(Boolean))];
    return ['Tất cả', ...cats];
  }, [products]);

  const filteredProducts = useMemo(() => {
    let result = [...products];
    if (search.trim()) {
      const q = search.toLowerCase();
      result = result.filter(p =>
        p.name?.toLowerCase().includes(q) ||
        p.category_name?.toLowerCase().includes(q)
      );
    }
    if (filterCategory !== 'all') result = result.filter(p => p.category_name === filterCategory);
    switch (sortBy) {
      case 'price_asc': result.sort((a, b) => a.price - b.price); break;
      case 'price_desc': result.sort((a, b) => b.price - a.price); break;
      case 'name': result.sort((a, b) => a.name.localeCompare(b.name)); break;
      default: result.sort((a, b) => b.id - a.id);
    }
    return result;
  }, [products, search, filterCategory, sortBy]);

  const totalPages = Math.ceil(filteredProducts.length / itemsPerPage);
  const paginatedProducts = filteredProducts.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  useEffect(() => { setCurrentPage(1); }, [search, filterCategory, sortBy]);

  const [deleteTarget, setDeleteTarget] = useState(null);

  const handleDelete = async () => {
    if (!deleteTarget) return;
    try {
      await productAPI.delete(deleteTarget.id);
      setProducts(products.filter(p => p.id !== deleteTarget.id));
      toast.success('Đã xóa sản phẩm');
    } catch { toast.error('Xóa thất bại'); }
    finally { setDeleteTarget(null); }
  };

  const getStockStyle = (stock) => {
    if (stock === 0) return { label: 'Hết hàng', bg: '#FEE2E2', text: '#991B1B', dot: '#EF4444' };
    if (stock < 5) return { label: 'Sắp hết', bg: '#FEF3C7', text: '#92400E', dot: '#F59E0B' };
    return { label: 'Còn hàng', bg: '#D1FAE5', text: '#065F46', dot: '#10B981' };
  };

  return (
    <div className="space-y-5">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold" style={{ color: '#1F2937', fontFamily: 'system-ui, -apple-system, "Segoe UI", Roboto, sans-serif' }}>Sản phẩm</h1>
          <p className="text-sm mt-1" style={{ color: '#92400E' }}>
            {filteredProducts.length} sản phẩm
          </p>
        </div>
        <Link
          to="/admin/products/new"
          className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl text-sm font-medium text-white transition-all duration-200 hover:-translate-y-0.5"
          style={{ background: 'linear-gradient(135deg, #F59E0B, #FCD34D)', boxShadow: '0 4px 14px rgba(245,158,11,0.3)' }}
        >
          <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M12 4v16m8-8H4" />
          </svg>
          Thêm sản phẩm
        </Link>
      </div>

      {/* Filters */}
      <div className="flex flex-wrap items-center gap-3 p-4 rounded-2xl" style={{ background: '#FFFFFF', border: '1px solid #FDE68A', boxShadow: '0 1px 8px rgba(146,64,14,0.06)' }}>
        <div className="relative flex-1 min-w-[200px]">
          <svg className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2" style={{ color: '#92400E' }} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.75}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M21 21l-5.197-5.197m0 0A7.5 7.5 0 105.196 5.196a7.5 7.5 0 0010.607 10.607z" />
          </svg>
          <input
            type="text"
            placeholder="Tìm tên, danh mục..."
            value={search}
            onChange={e => setSearch(e.target.value)}
            className="w-full pl-10 pr-10 py-2.5 rounded-xl text-sm transition-all"
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

        <select
          value={filterCategory}
          onChange={e => setFilterCategory(e.target.value)}
          className="px-4 py-2.5 rounded-xl text-sm"
          style={{ background: '#FEF3C7', border: '1px solid #FDE68A', color: '#1F2937', outline: 'none' }}
        >
          {categories.map(c => (
            <option key={c} value={c === 'Tất cả' ? 'all' : c}>{c}</option>
          ))}
        </select>

        <select
          value={sortBy}
          onChange={e => setSortBy(e.target.value)}
          className="px-4 py-2.5 rounded-xl text-sm"
          style={{ background: '#FEF3C7', border: '1px solid #FDE68A', color: '#1F2937', outline: 'none' }}
        >
          <option value="newest">Mới nhất</option>
          <option value="price_asc">Giá: Thấp → Cao</option>
          <option value="price_desc">Giá: Cao → Thấp</option>
          <option value="name">Tên A → Z</option>
        </select>
      </div>

      {/* Table */}
      <div className="rounded-2xl overflow-hidden" style={{ background: '#FFFFFF', border: '1px solid #FDE68A', boxShadow: '0 1px 8px rgba(146,64,14,0.06)' }}>
        {loading ? (
          <div className="flex justify-center py-16">
            <div className="w-10 h-10 rounded-full animate-spin" style={{ border: '3px solid #FDE68A', borderTopColor: '#F59E0B' }}></div>
          </div>
        ) : paginatedProducts.length === 0 ? (
          <div className="py-16 text-center">
            <svg className="w-16 h-16 mx-auto mb-4" style={{ color: '#FDE68A' }} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M20.25 7.5l-.625 10.632a2.25 2.25 0 01-2.247 2.118H6.622a2.25 2.25 0 01-2.247-2.118L3.75 7.5M10 11.25h4" />
            </svg>
            <p className="text-base font-medium mb-1" style={{ color: '#374151' }}>Không tìm thấy sản phẩm</p>
            <p className="text-sm" style={{ color: '#92400E' }}>Thử thay đổi bộ lọc hoặc từ khóa tìm kiếm</p>
          </div>
        ) : (
          <>
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr style={{ background: '#FEF3C7' }}>
                    {['Sản phẩm', 'Danh mục', 'Giá', 'Tồn kho', 'Thao tác'].map((h, i) => (
                      <th key={i} className="px-6 py-4 text-left text-xs font-medium uppercase tracking-wider" style={{ color: '#92400E' }}>{h}</th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {paginatedProducts.map(product => {
                    const st = getStockStyle(product.stock);
                    return (
                      <tr key={product.id} className="transition-colors group" style={{ borderBottom: '1px solid #FEF9F0' }}>
                        <td className="px-6 py-4">
                          <div className="flex items-center gap-4">
                            <img
                              src={getImageUrl(product.thumbnail)}
                              alt={product.name}
                              className="w-14 h-14 object-cover rounded-xl"
                              style={{ background: '#FEF3C7' }}
                              onError={e => { e.target.src = 'https://images.unsplash.com/photo-1515562141207-7a88fb7ce338?w=100&h=100&fit=crop'; }}
                            />
                            <div>
                              <p className="text-sm font-medium line-clamp-1" style={{ color: '#1F2937' }}>{product.name}</p>
                              <p className="text-xs mt-0.5" style={{ color: '#92400E' }}>SKU #{product.id}</p>
                            </div>
                          </div>
                        </td>
                        <td className="px-6 py-4">
                          <span className="text-xs px-3 py-1 rounded-lg inline-block" style={{ background: '#FEF3C7', color: '#92400E' }}>
                            {product.category_name || '—'}
                          </span>
                        </td>
                        <td className="px-6 py-4">
                          <span className="text-sm font-bold" style={{ color: '#F59E0B', fontFamily: 'system-ui, -apple-system, "Segoe UI", Roboto, sans-serif', fontWeight: 'bold' }}>{formatPrice(product.price)}</span>
                        </td>
                        <td className="px-6 py-4">
                          <span className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium" style={{ background: st.bg, color: st.text }}>
                            <span className="w-1.5 h-1.5 rounded-full" style={{ background: st.dot }}></span>
                            {st.label} ({product.stock})
                          </span>
                        </td>
                        <td className="px-6 py-4">
                          <div className="flex items-center gap-1">
                            <Link
                              to={`/admin/products/edit/${product.id}`}
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
                              onClick={() => setDeleteTarget({ id: product.id, name: product.name })}
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
              <div className="px-6 py-4 flex items-center justify-between" style={{ borderTop: '1px solid #FDE68A' }}>
                <p className="text-xs" style={{ color: '#92400E' }}>
                  {(currentPage - 1) * itemsPerPage + 1}–{Math.min(currentPage * itemsPerPage, filteredProducts.length)} / {filteredProducts.length}
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
                  {Array.from({ length: totalPages }, (_, i) => i + 1).map(page => (
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
                  ))}
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
            <h3 className="text-lg font-bold mb-2" style={{ color: '#1F2937' }}>Xác nhận xóa sản phẩm</h3>
            <p className="text-sm mb-6" style={{ color: '#6B7280' }}>
              Bạn có chắc muốn xóa sản phẩm <strong style={{ color: '#1F2937' }}>"{deleteTarget.name}"</strong>? Hành động này không thể hoàn tác.
            </p>
            <div className="flex gap-3">
              <button
                onClick={() => setDeleteTarget(null)}
                className="flex-1 py-2.5 rounded-xl text-sm font-medium transition-all"
                style={{ background: '#F3F4F6', color: '#374151' }}
                onMouseEnter={e => { e.currentTarget.style.background = '#E5E7EB'; }}
                onMouseLeave={e => { e.currentTarget.style.background = '#F3F4F6'; }}
              >
                Hủy
              </button>
              <button
                onClick={handleDelete}
                className="flex-1 py-2.5 rounded-xl text-sm font-medium text-white transition-all"
                style={{ background: '#EF4444', boxShadow: '0 4px 14px rgba(239,68,68,0.3)' }}
                onMouseEnter={e => { e.currentTarget.style.background = '#DC2626'; }}
                onMouseLeave={e => { e.currentTarget.style.background = '#EF4444'; }}
              >
                Xóa
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminProducts;
