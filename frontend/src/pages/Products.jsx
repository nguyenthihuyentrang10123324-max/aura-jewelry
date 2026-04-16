import { useState, useEffect, useRef } from 'react';
import Header from '../components/Header';
import Footer from '../components/Footer';
import { Link, useSearchParams } from 'react-router-dom';
import { productAPI } from '../utils/api';
import { formatPrice, getImageUrl } from '../utils/helpers';

const PriceRangeInput = ({ min = 0, max = 50000000, minValue = 0, maxValue = 50000000, onChange }) => {
  const [localMin, setLocalMin] = useState(minValue || min);
  const [localMax, setLocalMax] = useState(maxValue || max);

  useEffect(() => {
    setLocalMin(minValue || min);
    setLocalMax(maxValue || max);
  }, [minValue, maxValue, min, max]);

  const handleApply = () => {
    const newMin = Math.max(min, Number(localMin) || min);
    const newMax = Math.min(max, Number(localMax) || max);
    onChange({ min: newMin, max: newMax });
  };

  return (
    <div className="space-y-4">
      <div className="flex items-center gap-3">
        <div className="flex-1">
          <label className="font-mono text-[10px] uppercase tracking-[0.15em] text-[#6B6B6B] mb-2 block">Từ</label>
          <input
            type="number"
            value={localMin}
            onChange={(e) => setLocalMin(e.target.value)}
            className="w-full px-3 py-2 border border-[#E8E4DF] text-sm font-sans focus:outline-none focus:border-[#B8860B] transition-colors"
            min={min}
            max={localMax - 5000000}
          />
        </div>
        <span className="text-[#6B6B6B] mt-5">-</span>
        <div className="flex-1">
          <label className="font-mono text-[10px] uppercase tracking-[0.15em] text-[#6B6B6B] mb-2 block">Đến</label>
          <input
            type="number"
            value={localMax}
            onChange={(e) => setLocalMax(e.target.value)}
            className="w-full px-3 py-2 border border-[#E8E4DF] text-sm font-sans focus:outline-none focus:border-[#B8860B] transition-colors"
            min={Number(localMin) + 5000000}
            max={max}
          />
        </div>
      </div>
      <button
        onClick={handleApply}
        className="w-full py-2 bg-[#B8860B] text-white font-mono text-xs uppercase tracking-[0.1em] hover:bg-[#D4A84B] transition-colors"
      >
        Áp dụng
      </button>
    </div>
  );
};

const Products = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [category, setCategory] = useState(searchParams.get('category') || '');
  const [material, setMaterial] = useState(searchParams.get('material') || '');
  const [sortBy, setSortBy] = useState(searchParams.get('sort') || 'newest');
  const [currentPage, setCurrentPage] = useState(Number(searchParams.get('page')) || 1);
  const [totalProducts, setTotalProducts] = useState(0);
  const [search, setSearch] = useState(searchParams.get('search') || '');
  const [searchInput, setSearchInput] = useState(searchParams.get('search') || '');
  const [priceMin, setPriceMin] = useState(Number(searchParams.get('min_price')) || 0);
  const [priceMax, setPriceMax] = useState(Number(searchParams.get('max_price')) || 50000000);
  const [hasPriceFilter, setHasPriceFilter] = useState(searchParams.has('min_price') || searchParams.has('max_price'));
  const [sortDropdownOpen, setSortDropdownOpen] = useState(false);
  const productsPerPage = 6;
  const debounceRef = useRef(null);

  // Helper: cập nhật URL params mà không reset các filter khác
  const updateUrl = (updates) => {
    setSearchParams(prev => {
      const p = new URLSearchParams(prev);
      for (const [key, value] of Object.entries(updates)) {
        if (value === null || value === undefined || value === '' || value === false) {
          p.delete(key);
        } else {
          p.set(key, String(value));
        }
      }
      return p;
    });
  };

  useEffect(() => {
    const catFromUrl = searchParams.get('category') || '';
    if (catFromUrl !== category) {
      setCategory(catFromUrl);
      setCurrentPage(1);
    }
  }, [searchParams]);

  useEffect(() => {
    fetchProducts();
  }, [category, material, sortBy, currentPage, priceMin, priceMax, hasPriceFilter, search]);

  useEffect(() => {
    if (debounceRef.current) clearTimeout(debounceRef.current);
    debounceRef.current = setTimeout(() => {
      if (search !== searchInput) {
        setSearch(searchInput);
        setCurrentPage(1);
        if (searchInput) {
          updateUrl({ search: searchInput, page: 1 });
        } else {
          updateUrl({ search: null, page: 1 });
        }
      }
    }, 500);
    return () => clearTimeout(debounceRef.current);
  }, [searchInput]);

  const fetchProducts = async () => {
    try {
      setLoading(true);
      const params = {
        sort: sortBy,
        limit: productsPerPage,
        page: currentPage
      };
      
      if (category) params.category = category;
      if (material) params.material = material;
      if (search) params.search = search;
      if (hasPriceFilter) {
        params.min_price = priceMin;
        params.max_price = priceMax;
      }

      const res = await productAPI.getAll(params);
      if (res.data.success) {
        const data = res.data.data;
        setProducts(data.products || []);
        const total = data.total || data.products?.length || 0;
        setTotalProducts(total);
      }
    } catch (error) {
      console.error('Error fetching products:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleCategoryChange = (cat) => {
    const newCat = cat === category ? '' : cat;
    setCategory(newCat);
    setCurrentPage(1);
    updateUrl({ category: newCat || null, page: 1 });
  };

  const handleMaterialChange = (mat) => {
    const newMat = mat === material ? '' : mat;
    setMaterial(newMat);
    setCurrentPage(1);
    updateUrl({ material: newMat || null, page: 1 });
  };

  const handlePriceChange = ({ min, max }) => {
    setPriceMin(min);
    setPriceMax(max);
    setHasPriceFilter(true);
    setCurrentPage(1);
    updateUrl({ min_price: min, max_price: max, page: 1 });
  };

  const clearPriceFilter = () => {
    setPriceMin(0);
    setPriceMax(50000000);
    setHasPriceFilter(false);
    setCurrentPage(1);
    updateUrl({ min_price: null, max_price: null, page: 1 });
  };

  const totalPages = Math.ceil(totalProducts / productsPerPage);

  const categories = [
    { id: 'Nhẫn', label: 'Nhẫn' },
    { id: 'Dây chuyền', label: 'Dây chuyền' },
    { id: 'Bông tai', label: 'Bông tai' },
    { id: 'Lắc tay', label: 'Lắc tay' },
  ];

  const materials = [
    { id: 'Vàng', label: 'Vàng' },
    { id: 'Bạc', label: 'Bạc' },
    { id: 'Kim cương', label: 'Kim cương' },
  ];

  const sortOptions = [
    { value: 'newest', label: 'Mới nhất' },
    { value: 'price_asc', label: 'Giá: Thấp → Cao' },
    { value: 'price_desc', label: 'Giá: Cao → Thấp' },
    { value: 'name_asc', label: 'Tên: A → Z' },
  ];

  return (
    <div className="min-h-screen flex flex-col bg-[#FAFAF8] text-[#1A1A1A]">
      <Header />
      
      <main className="pt-32 pb-24 px-6 md:px-12 max-w-[1600px] mx-auto flex-1">
        {/* Header Section */}
        <header className="mb-16 text-center">
          <div className="mb-6 flex items-center justify-center gap-4">
            <span className="h-px flex-1 max-w-[80px] bg-[#E8E4DF]"></span>
            <span className="font-mono text-xs font-medium uppercase tracking-[0.15em] text-[#B8860B]">
              Bộ sưu tập
            </span>
            <span className="h-px flex-1 max-w-[80px] bg-[#E8E4DF]"></span>
          </div>
          <h1 className="font-serif text-4xl md:text-5xl text-[#1A1A1A] mb-4">
            Trang sức <span className="italic text-[#B8860B]">cao cấp</span>
          </h1>
          <p className="text-[#6B6B6B] max-w-2xl mx-auto font-light leading-relaxed">
            Khám phá tinh hoa nghệ thuật chế tác kim hoàn từ AURA. Mỗi món trang sức là một tác phẩm nghệ thuật, tôn vinh vẻ đẹp vĩnh cửu.
          </p>
        </header>

        <div className="flex flex-col lg:flex-row gap-12">
          {/* Left Sidebar Filter */}
          <aside className="w-full lg:w-64 flex-shrink-0 space-y-10">
            {/* Search Box */}
            <div>
              <h3 className="font-mono text-[10px] font-medium uppercase tracking-[0.15em] text-[#B8860B] mb-4">Tìm kiếm</h3>
              <div className="relative">
                <input
                  type="text"
                  placeholder="Tên sản phẩm..."
                  value={searchInput}
                  onChange={(e) => setSearchInput(e.target.value)}
                  className="w-full px-4 py-3 border border-[#E8E4DF] bg-white font-sans text-sm font-light placeholder:text-[#6B6B6B]/50 focus:outline-none focus:border-[#B8860B] transition-colors"
                />
                <svg className="absolute right-4 top-1/2 -translate-y-1/2 w-4 h-4 text-[#6B6B6B]" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                </svg>
              </div>
            </div>

            {/* Category Filter */}
            <div>
              <h3 className="font-mono text-[10px] font-medium uppercase tracking-[0.15em] text-[#B8860B] mb-6">Loại sản phẩm</h3>
              <ul className="space-y-4">
                {categories.map((cat) => (
                  <li 
                    key={cat.id}
                    className="flex items-center gap-3 group cursor-pointer"
                    onClick={() => handleCategoryChange(cat.id)}
                  >
                    <span className={`w-4 h-4 border flex items-center justify-center transition-colors ${
                      category === cat.id 
                        ? 'border-[#B8860B] bg-[#B8860B]' 
                        : 'border-[#E8E4DF] group-hover:border-[#B8860B]'
                    }`}>
                      {category === cat.id && (
                        <svg className="w-2.5 h-2.5 text-white" fill="currentColor" viewBox="0 0 20 20">
                          <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                        </svg>
                      )}
                    </span>
                    <span className={`font-sans text-sm font-light group-hover:text-[#1A1A1A] transition-colors ${
                      category === cat.id ? 'text-[#1A1A1A] font-medium' : 'text-[#6B6B6B]'
                    }`}>
                      {cat.label}
                    </span>
                  </li>
                ))}
              </ul>
            </div>

            {/* Material Filter */}
            <div>
              <h3 className="font-mono text-[10px] font-medium uppercase tracking-[0.15em] text-[#B8860B] mb-6">Chất liệu</h3>
              <ul className="space-y-4">
                {materials.map((mat) => (
                  <li 
                    key={mat.id}
                    className="flex items-center gap-3 group cursor-pointer"
                    onClick={() => handleMaterialChange(mat.id)}
                  >
                    <span className={`w-4 h-4 border flex items-center justify-center transition-colors ${
                      material === mat.id 
                        ? 'border-[#B8860B] bg-[#B8860B]' 
                        : 'border-[#E8E4DF] group-hover:border-[#B8860B]'
                    }`}>
                      {material === mat.id && (
                        <svg className="w-2.5 h-2.5 text-white" fill="currentColor" viewBox="0 0 20 20">
                          <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                        </svg>
                      )}
                    </span>
                    <span className={`font-sans text-sm font-light group-hover:text-[#1A1A1A] transition-colors ${
                      material === mat.id ? 'text-[#1A1A1A] font-medium' : 'text-[#6B6B6B]'
                    }`}>
                      {mat.label}
                    </span>
                  </li>
                ))}
              </ul>
            </div>

            {/* Price Range */}
            <div>
              <div className="flex justify-between items-center mb-6">
                <h3 className="font-mono text-[10px] font-medium uppercase tracking-[0.15em] text-[#B8860B]">Khoảng giá</h3>
                {hasPriceFilter && (
                  <button 
                    onClick={clearPriceFilter}
                    className="font-mono text-[10px] uppercase tracking-widest text-[#6B6B6B] hover:text-[#B8860B] transition-colors"
                  >
                    Xóa
                  </button>
                )}
              </div>
              <PriceRangeInput 
                min={0}
                max={50000000}
                minValue={priceMin}
                maxValue={priceMax}
                onChange={handlePriceChange}
              />
            </div>

            {/* Clear All Filters */}
            {(category || material || search || hasPriceFilter) && (
              <button
                onClick={() => {
                  setCategory('');
                  setMaterial('');
                  setSearch('');
                  setSearchInput('');
                  setPriceMin(0);
                  setPriceMax(50000000);
                  setHasPriceFilter(false);
                  setSortBy('newest');
                  setCurrentPage(1);
                  setSearchParams({});
                }}
                className="w-full py-3 border border-[#E8E4DF] font-mono text-[10px] uppercase tracking-widest text-[#6B6B6B] hover:border-[#B8860B] hover:text-[#B8860B] transition-colors"
              >
                Xóa tất cả bộ lọc
              </button>
            )}
          </aside>

          {/* Main Content */}
          <section className="flex-grow">
            {/* Toolbar */}
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-8 pb-4 border-b border-[#E8E4DF]">
              <p className="font-sans text-xs text-[#6B6B6B] font-light">
                {loading ? 'Đang tải...' : `Hiển thị ${products.length} / ${totalProducts} sản phẩm`}
              </p>
              <div className="relative">
                <button 
                  onClick={() => setSortDropdownOpen(!sortDropdownOpen)}
                  className="flex items-center gap-2 font-sans text-xs font-medium uppercase tracking-[0.1em] text-[#1A1A1A] hover:text-[#B8860B] transition-colors"
                >
                  {sortOptions.find(o => o.value === sortBy)?.label}
                  <svg className={`w-3 h-3 transition-transform ${sortDropdownOpen ? 'rotate-180' : ''}`} fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                  </svg>
                </button>
                {sortDropdownOpen && (
                  <div className="absolute top-full right-0 w-48 bg-white shadow-lg border border-[#E8E4DF] mt-2 py-2 z-10">
                    {sortOptions.map((opt) => (
                      <button 
                        key={opt.value}
                        onClick={() => { setSortBy(opt.value); setCurrentPage(1); setSortDropdownOpen(false); updateUrl({ sort: opt.value, page: 1 }); }}
                        className={`w-full text-left px-4 py-3 font-sans text-xs tracking-wide hover:bg-[#F5F3F0] transition-colors ${
                          sortBy === opt.value ? 'text-[#B8860B] font-medium' : 'text-[#1A1A1A]'
                        }`}
                      >
                        {opt.label}
                      </button>
                    ))}
                  </div>
                )}
              </div>
            </div>

            {/* Active Filters */}
            {(category || material || search || hasPriceFilter) && (
              <div className="flex flex-wrap gap-2 mb-6">
                {category && (
                  <span className="inline-flex items-center gap-2 px-3 py-1 bg-[#F5F3F0] text-[#B8860B] font-mono text-[10px] uppercase tracking-wider">
                    {category}
                    <button onClick={() => handleCategoryChange(category)} className="hover:text-[#1A1A1A]">×</button>
                  </span>
                )}
                {material && (
                  <span className="inline-flex items-center gap-2 px-3 py-1 bg-[#F5F3F0] text-[#B8860B] font-mono text-[10px] uppercase tracking-wider">
                    {material}
                    <button onClick={() => handleMaterialChange(material)} className="hover:text-[#1A1A1A]">×</button>
                  </span>
                )}
                {search && (
                  <span className="inline-flex items-center gap-2 px-3 py-1 bg-[#F5F3F0] text-[#B8860B] font-mono text-[10px] uppercase tracking-wider">
                    "{search}"
                    <button onClick={() => { setSearch(''); setSearchInput(''); }} className="hover:text-[#1A1A1A]">×</button>
                  </span>
                )}
              </div>
            )}

            {/* Product Grid */}
            {loading ? (
              <div className="text-center py-20">
                <div className="inline-block w-8 h-8 border-2 border-[#B8860B] border-t-transparent rounded-full animate-spin"></div>
              </div>
            ) : products.length === 0 ? (
              <div className="text-center py-20">
                <svg className="w-16 h-16 text-[#E8E4DF] mx-auto mb-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                </svg>
                <p className="text-[#6B6B6B] font-light mb-2">Không tìm thấy sản phẩm nào</p>
                <p className="text-xs text-[#6B6B6B]/60">Thử thay đổi bộ lọc hoặc từ khóa tìm kiếm</p>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-x-8 gap-y-16">
                {products.map((product) => {
                  const image = product.images?.[0]?.url || product.thumbnail;
                  return (
                    <div key={product.id} className="group">
                      <Link to={`/products/${product.id}`} className="block">
                        <div className="aspect-square bg-[#F5F3F0] overflow-hidden mb-6 relative">
                          <img
                            src={getImageUrl(image)}
                            alt={product.name}
                            className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                            onError={(e) => { e.target.src = 'https://images.unsplash.com/photo-1515562141207-7a88fb7ce338?w=400&h=400&fit=crop'; }}
                          />
                          {product.is_featured && (
                            <div className="absolute top-4 left-4 bg-[#B8860B] text-white font-mono text-[10px] uppercase tracking-widest px-2 py-1">
                              Best Seller
                            </div>
                          )}
                          <div className="absolute inset-0 bg-black/0 group-hover:bg-black/10 transition-colors flex items-center justify-center">
                            <span className="bg-white px-6 py-3 font-mono text-[10px] uppercase tracking-[0.15em] text-[#1A1A1A] opacity-0 group-hover:opacity-100 transition-opacity shadow-lg">
                              Xem chi tiết
                            </span>
                          </div>
                        </div>
                      </Link>
                      <div className="text-center md:text-left">
                        <p className="font-mono text-[10px] uppercase tracking-[0.15em] text-[#B8860B] mb-2">
                          {product.category_name || product.category || 'Trang sức'}
                        </p>
                        <h2 className="font-serif text-lg text-[#1A1A1A] mb-2 group-hover:text-[#B8860B] transition-colors">{product.name}</h2>
                        <p className="font-sans text-sm font-light text-[#6B6B6B]">{formatPrice(product.price)}</p>
                      </div>
                    </div>
                  );
                })}
              </div>
            )}

            {/* Pagination */}
            {totalPages > 1 && (
              <div className="mt-20 flex justify-center items-center gap-2">
                <button
                  onClick={() => setCurrentPage(p => Math.max(1, p - 1))}
                  disabled={currentPage === 1}
                  className="w-10 h-10 flex items-center justify-center border border-[#E8E4DF] text-[#6B6B6B] hover:border-[#B8860B] hover:text-[#B8860B] transition-colors disabled:opacity-30 disabled:cursor-not-allowed"
                >
                  <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M15 19l-7-7 7-7" />
                  </svg>
                </button>

                {Array.from({ length: totalPages }, (_, i) => i + 1).reduce((acc, page) => {
                  if (page === 1 || page === totalPages || (page >= currentPage - 1 && page <= currentPage + 1)) {
                    acc.push(page);
                  } else if (acc[acc.length - 1] !== '...') {
                    acc.push('...');
                  }
                  return acc;
                }, []).map((item, idx) =>
                  item === '...' ? (
                    <span key={`ellipsis-${idx}`} className="w-10 h-10 flex items-center justify-center text-[#6B6B6B]">...</span>
                  ) : (
                    <button
                      key={item}
                      onClick={() => setCurrentPage(item)}
                      className={`w-10 h-10 font-mono text-xs font-medium transition-all ${
                        currentPage === item
                          ? 'bg-[#B8860B] text-white border border-[#B8860B] shadow-sm'
                          : 'border border-[#E8E4DF] text-[#6B6B6B] hover:border-[#B8860B] hover:text-[#B8860B]'
                      }`}
                    >
                      {item}
                    </button>
                  )
                )}

                <button
                  onClick={() => setCurrentPage(p => Math.min(totalPages, p + 1))}
                  disabled={currentPage === totalPages}
                  className="w-10 h-10 flex items-center justify-center border border-[#E8E4DF] text-[#6B6B6B] hover:border-[#B8860B] hover:text-[#B8860B] transition-colors disabled:opacity-30 disabled:cursor-not-allowed"
                >
                  <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 5l7 7-7 7" />
                  </svg>
                </button>
              </div>
            )}
          </section>
        </div>
      </main>

      <Footer />
    </div>
  );
};

export default Products;
