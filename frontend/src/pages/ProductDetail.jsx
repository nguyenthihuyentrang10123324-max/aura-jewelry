import { useState, useEffect, useRef } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import Header from '../components/Header';
import Footer from '../components/Footer';
import { productAPI } from '../utils/api';
import { formatPrice, getImageUrl } from '../utils/helpers';
import { useCart } from '../context/CartContext';
import toast from 'react-hot-toast';

const ProductDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { addToCart } = useCart();
  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const [selectedImage, setSelectedImage] = useState(0);
  const [selectedMaterial, setSelectedMaterial] = useState('');
  const [selectedSize, setSelectedSize] = useState('');
  const [openDetails, setOpenDetails] = useState(['product-info']);
  const [relatedProducts, setRelatedProducts] = useState([]);
  const mainImageRef = useRef(null);
  const [imageZoom, setImageZoom] = useState({ x: 50, y: 50 });

  useEffect(() => {
    fetchProduct();
  }, [id]);

  const fetchProduct = async () => {
    try {
      setLoading(true);
      const res = await productAPI.getById(id);
      if (res.data.success) {
        const productData = res.data.data.product;
        setProduct(productData);
        
        if (productData.materials?.length > 0) {
          setSelectedMaterial(productData.materials[0]);
        }
        
        const relatedRes = await productAPI.getAll({ 
          category: productData.category,
          limit: 4 
        });
        if (relatedRes.data.success) {
          const filtered = relatedRes.data.data.products.filter(p => p.id !== parseInt(id));
          setRelatedProducts(filtered.slice(0, 4));
        }
      }
    } catch (error) {
      console.error('Error fetching product:', error);
      toast.error('Không thể tải thông tin sản phẩm');
    } finally {
      setLoading(false);
    }
  };

  const handleAddToCart = async () => {
    if (!selectedSize && product.sizes?.length > 0) {
      toast.error('Vui lòng chọn kích thước');
      return;
    }
    const result = await addToCart(product.id, 1, { 
      material: selectedMaterial,
      size: selectedSize 
    });
    if (result.success) {
      toast.success('Đã thêm vào giỏ hàng');
    } else {
      toast.error(result.message || 'Có lỗi xảy ra');
    }
  };

  const handleBuyNow = () => {
    if (!selectedSize && product.sizes?.length > 0) {
      toast.error('Vui lòng chọn kích thước');
      return;
    }
    addToCart(product.id, 1, { material: selectedMaterial, size: selectedSize });
    navigate('/checkout');
  };

  const handleImageZoom = (e) => {
    const rect = e.currentTarget.getBoundingClientRect();
    const x = ((e.clientX - rect.left) / rect.width) * 100;
    const y = ((e.clientY - rect.top) / rect.height) * 100;
    setImageZoom({ x, y });
  };

  const toggleDetail = (key) => {
    setOpenDetails(prev => 
      prev.includes(key) 
        ? prev.filter(k => k !== key)
        : [...prev, key]
    );
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[#FAFAF8]">
        <div className="flex flex-col items-center gap-4">
          <div className="w-12 h-12 border-2 border-[#B8860B] border-t-transparent rounded-full animate-spin"></div>
          <p className="font-mono text-xs uppercase tracking-widest text-[#6B6B6B]">Đang tải...</p>
        </div>
      </div>
    );
  }

  if (!product) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[#FAFAF8]">
        <div className="text-center">
          <svg className="w-16 h-16 text-[#E8E4DF] mx-auto mb-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
          </svg>
          <p className="text-[#6B6B6B] font-light mb-4">Không tìm thấy sản phẩm</p>
          <Link to="/products" className="font-mono text-xs uppercase tracking-widest text-[#B8860B] border-b border-[#B8860B] hover:text-[#D4A84B] hover:border-[#D4A84B] transition-colors">
            Quay lại trang sản phẩm
          </Link>
        </div>
      </div>
    );
  }

  const images = product.images?.map(i => i.url) || [product.thumbnail];
  const currentImages = images.length > 0 ? images : ['https://images.unsplash.com/photo-1515562141207-7a88fb7ce338?w=600&h=800&fit=crop'];

  const materials = product.materials || ['Vàng trắng 18K'];
  const sizes = product.sizes || ['Size 8', 'Size 9', 'Size 10', 'Size 11'];

  const specifications = [
    { label: 'Chất liệu', value: selectedMaterial || materials[0] },
    { label: 'Đá chính', value: product.gemstone || 'Kim cương tự nhiên' },
    { label: 'Độ sạch', value: product.clarity || 'VVS1' },
    { label: 'Màu sắc', value: product.color || 'Nước D' },
  ];

  return (
    <div className="min-h-screen flex flex-col bg-[#FAFAF8] text-[#1A1A1A]">
      <Header />

      <main className="pt-32 pb-24 px-6 md:px-12 lg:px-24 flex-1">
        <div className="max-w-[1440px] mx-auto grid grid-cols-1 lg:grid-cols-12 gap-12 items-start">
          {/* Product Gallery */}
          <div className="lg:col-span-6 grid grid-cols-12 gap-4">
            {/* Main Image */}
            <div 
              className="col-span-12 relative group overflow-hidden"
              onMouseMove={handleImageZoom}
              onMouseLeave={() => setImageZoom({ x: 50, y: 50 })}
            >
              <div 
                className="w-full aspect-[3/4] overflow-hidden"
                style={{
                  backgroundImage: `url(${getImageUrl(currentImages[selectedImage])})`,
                  backgroundPosition: `${imageZoom.x}% ${imageZoom.y}%`,
                  backgroundSize: '200%',
                  backgroundRepeat: 'no-repeat',
                }}
                ref={mainImageRef}
              >
                <img 
                  src={getImageUrl(currentImages[selectedImage])}
                  alt={product.name}
                  className="w-full h-full object-cover opacity-0"
                  onError={(e) => { 
                    e.target.src = 'https://images.unsplash.com/photo-1515562141207-7a88fb7ce338?w=600&h=800&fit=crop'; 
                  }}
                />
              </div>
              {product.badge && (
                <div className="absolute top-4 left-4 bg-white/90 backdrop-blur-sm px-3 py-1 font-mono text-[10px] uppercase tracking-widest">
                  {product.badge}
                </div>
              )}
            </div>

            {/* Thumbnail Images */}
            {currentImages.length > 1 && currentImages.slice(1, 3).map((img, idx) => (
              <div 
                key={idx} 
                className="col-span-6 overflow-hidden cursor-pointer transition-all duration-300 hover:shadow-md"
                onClick={() => setSelectedImage(idx + 1)}
              >
                <img 
                  src={getImageUrl(img)}
                  alt={`${product.name} - ${idx + 2}`}
                  className="w-full aspect-square object-cover hover:scale-105 transition-transform duration-700"
                  onError={(e) => { 
                    e.target.src = 'https://images.unsplash.com/photo-1515562141207-7a88fb7ce338?w=300&h=300&fit=crop'; 
                  }}
                />
              </div>
            ))}
          </div>

          {/* Product Info */}
          <div className="lg:col-span-6 flex flex-col gap-8 lg:sticky lg:top-32">
            {/* Breadcrumb */}
            <nav className="flex gap-2 font-mono text-[10px] uppercase tracking-widest text-[#6B6B6B] mb-6">
              <Link to="/" className="hover:text-[#B8860B] transition-colors">Trang chủ</Link>
              <span>/</span>
              <Link to="/products" className="hover:text-[#B8860B] transition-colors">Sản phẩm</Link>
              <span>/</span>
              <span className="text-[#1A1A1A]">{product.category_name}</span>
            </nav>

            {/* Title & Price */}
            <div>
              <h1 className="font-serif text-4xl md:text-5xl text-[#1A1A1A] leading-tight mb-4">
                {product.name}
              </h1>
              <p className="font-serif text-3xl text-[#B8860B] mb-6">
                {formatPrice(product.price)}
              </p>
              <p className="text-[#6B6B6B] leading-relaxed font-light">
                {product.description || 'Một tuyệt tác tôn vinh sự vĩnh cửu. Sản phẩm được chế tác từ những viên đá quý tinh khiết nhất, ôm trọn lấy trái tim người sở hữu.'}
              </p>
            </div>

            {/* Material Selection */}
            {materials.length > 1 && (
              <div>
                <span className="font-mono text-[10px] uppercase tracking-widest text-[#6B6B6B] mb-4 block">Chất liệu</span>
                <div className="flex flex-wrap gap-4">
                  {materials.map((material, idx) => (
                    <button
                      key={idx}
                      onClick={() => setSelectedMaterial(material)}
                      className={`flex items-center gap-2 px-6 py-3 transition-all duration-300 border ${
                        selectedMaterial === material
                          ? 'border-[#B8860B] text-[#1A1A1A] bg-white'
                          : 'border-[#E8E4DF] text-[#6B6B6B] hover:border-[#B8860B]'
                      }`}
                    >
                      <span className={`w-3 h-3 rounded-full ${
                        material.includes('Vàng trắng') ? 'bg-stone-300' :
                        material.includes('Vàng hồng') ? 'bg-[#f1ccbb]' :
                        material.includes('Vàng') ? 'bg-yellow-400' : 'bg-stone-300'
                      }`}></span>
                      <span className="font-sans text-xs uppercase tracking-wider">{material}</span>
                    </button>
                  ))}
                </div>
              </div>
            )}

            {/* Size Selection */}
            {sizes.length > 0 && (
              <div className="relative">
                <span className="font-mono text-[10px] uppercase tracking-widest text-[#6B6B6B] mb-4 block">Kích thước (Size)</span>
                <div className="relative group">
                  <select 
                    value={selectedSize}
                    onChange={(e) => setSelectedSize(e.target.value)}
                    className="w-full bg-transparent border-b border-[#E8E4DF] py-4 pr-10 focus:outline-none focus:border-[#B8860B] appearance-none font-sans text-sm tracking-wide cursor-pointer"
                  >
                    <option value="">Chọn kích thước</option>
                    {sizes.map((size) => (
                      <option key={size} value={size}>{size}</option>
                    ))}
                  </select>
                  <svg className="absolute right-0 bottom-4 pointer-events-none text-[#6B6B6B] w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M19 9l-7 7-7-7" />
                  </svg>
                </div>
                <a 
                  className="inline-block mt-2 font-mono text-[10px] text-[#B8860B] uppercase tracking-widest border-b border-[#B8860B]/30 hover:text-[#D4A84B] hover:border-[#D4A84B] transition-colors" 
                  href="#"
                  onClick={(e) => {
                    e.preventDefault();
                    toast.success('Hướng dẫn đo size: Đo chu vi ngón tay bằng thước dây');
                  }}
                >
                  Hướng dẫn đo size
                </a>
              </div>
            )}

            {/* Action Buttons */}
            <div className="flex flex-col gap-4 mt-4">
              <button 
                onClick={handleBuyNow}
                className="w-full py-5 bg-[#B8860B] text-white font-sans font-medium uppercase tracking-[0.15em] text-sm hover:bg-[#D4A84B] hover:-translate-y-0.5 hover:shadow-lg active:scale-[0.98] transition-all duration-200 touch-manipulation"
              >
                Mua ngay
              </button>
              <button 
                onClick={handleAddToCart}
                disabled={product.stock === 0}
                className="w-full py-5 border border-[#E8E4DF] hover:border-[#B8860B] hover:text-[#B8860B] uppercase tracking-[0.15em] text-sm font-sans font-medium transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {product.stock === 0 ? 'Hết hàng' : 'Thêm vào giỏ hàng'}
              </button>
            </div>

            {/* Stock Info */}
            {product.stock !== undefined && (
              <p className="font-sans text-xs text-[#6B6B6B]">
                {product.stock > 0 ? `Còn ${product.stock} sản phẩm` : 'Hết hàng'}
              </p>
            )}

            {/* Product Details Accordion */}
            <div className="border-t border-[#E8E4DF] mt-8">
              {/* Product Info */}
              <details 
                className="group border-b border-[#E8E4DF]"
                open={openDetails.includes('product-info')}
              >
                <summary 
                  className="flex justify-between items-center py-6 cursor-pointer list-none"
                  onClick={(e) => { e.preventDefault(); toggleDetail('product-info'); }}
                >
                  <span className="font-mono text-[10px] uppercase tracking-[0.15em] font-medium text-[#1A1A1A]">Chi tiết sản phẩm</span>
                  <svg className={`w-4 h-4 text-[#6B6B6B] transition-transform duration-300 ${openDetails.includes('product-info') ? 'rotate-180' : ''}`} fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M19 9l-7 7-7-7" />
                  </svg>
                </summary>
                <div className="pb-8 space-y-4 font-sans text-sm text-[#6B6B6B] font-light leading-loose">
                  {specifications.map((spec, idx) => (
                    <div key={idx} className="flex justify-between border-b border-[#E8E4DF]/50 pb-2">
                      <span>{spec.label}</span>
                      <span className="text-[#1A1A1A]">{spec.value}</span>
                    </div>
                  ))}
                  {product.weight && (
                    <div className="flex justify-between border-b border-[#E8E4DF]/50 pb-2">
                      <span>Trọng lượng</span>
                      <span className="text-[#1A1A1A]">{product.weight}</span>
                    </div>
                  )}
                  {product.certificate && (
                    <div className="flex justify-between border-b border-[#E8E4DF]/50 pb-2">
                      <span>Chứng nhận</span>
                      <span className="text-[#1A1A1A]">{product.certificate}</span>
                    </div>
                  )}
                </div>
              </details>

              {/* Shipping */}
              <details className="group border-b border-[#E8E4DF]">
                <summary 
                  className="flex justify-between items-center py-6 cursor-pointer list-none"
                  onClick={(e) => { e.preventDefault(); toggleDetail('shipping'); }}
                >
                  <span className="font-mono text-[10px] uppercase tracking-[0.15em] font-medium text-[#1A1A1A]">Giao hàng & Hoàn trả</span>
                  <svg className={`w-4 h-4 text-[#6B6B6B] transition-transform duration-300 ${openDetails.includes('shipping') ? 'rotate-180' : ''}`} fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M19 9l-7 7-7-7" />
                  </svg>
                </summary>
                <div className="pb-8 font-sans text-sm text-[#6B6B6B] font-light leading-relaxed space-y-3">
                  <p>Miễn phí giao hàng tiêu chuẩn cho mọi đơn hàng.</p>
                  <p>Thời gian giao hàng từ 3-5 ngày làm việc.</p>
                  <p>Chính sách hoàn trả trong vòng 7 ngày nếu còn nguyên tem mác.</p>
                </div>
              </details>

              {/* Care */}
              <details className="group">
                <summary 
                  className="flex justify-between items-center py-6 cursor-pointer list-none"
                  onClick={(e) => { e.preventDefault(); toggleDetail('care'); }}
                >
                  <span className="font-mono text-[10px] uppercase tracking-[0.15em] font-medium text-[#1A1A1A]">Hướng dẫn bảo quản</span>
                  <svg className={`w-4 h-4 text-[#6B6B6B] transition-transform duration-300 ${openDetails.includes('care') ? 'rotate-180' : ''}`} fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M19 9l-7 7-7-7" />
                  </svg>
                </summary>
                <div className="pb-8 font-sans text-sm text-[#6B6B6B] font-light leading-relaxed space-y-3">
                  <p>Tránh tiếp xúc với hóa chất và nước hoa.</p>
                  <p>Tháo trang sức khi tắm, bơi lội hoặc vận động mạnh.</p>
                  <p>Bảo quản trong hộp riêng biệt để tránh trầy xước.</p>
                  <p>Lau chùi nhẹ nhàng bằng khăn mềm thường xuyên.</p>
                </div>
              </details>
            </div>

            {/* Trust Badges */}
            <div className="grid grid-cols-3 gap-4 pt-8 mt-8 border-t border-[#E8E4DF]/50">
              <div className="flex flex-col items-center text-center gap-3">
                <svg className="w-8 h-8 text-[#B8860B]" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
                </svg>
                <span className="font-mono text-[10px] uppercase tracking-widest leading-tight text-[#6B6B6B]">Bảo hành trọn đời</span>
              </div>
              <div className="flex flex-col items-center text-center gap-3">
                <svg className="w-8 h-8 text-[#B8860B]" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M5 3v4M3 5h4M6 17v4m-2-2h4m5-16l2.286 6.857L21 12l-5.714 2.143L13 21l-2.286-6.857L5 12l5.714-2.143L13 3z" />
                </svg>
                <span className="font-mono text-[10px] uppercase tracking-widest leading-tight text-[#6B6B6B]">Kiểm định GIA</span>
              </div>
              <div className="flex flex-col items-center text-center gap-3">
                <svg className="w-8 h-8 text-[#B8860B]" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M13 10V3L4 14h7v7l9-11h-7z" />
                </svg>
                <span className="font-mono text-[10px] uppercase tracking-widest leading-tight text-[#6B6B6B]">Giao hàng miễn phí</span>
              </div>
            </div>
          </div>
        </div>

        {/* Related Products */}
        {relatedProducts.length > 0 && (
          <section className="mt-32">
            <div className="flex justify-between items-end mb-16">
              <div>
                <div className="mb-4 flex items-center gap-4">
                  <span className="h-px flex-1 max-w-[60px] bg-[#E8E4DF]"></span>
                  <span className="font-mono text-xs uppercase tracking-[0.15em] text-[#B8860B]">Gợi ý</span>
                </div>
                <h2 className="font-serif text-3xl md:text-4xl text-[#1A1A1A]">Sản phẩm <span className="italic text-[#B8860B]">tương tự</span></h2>
              </div>
              <Link 
                to="/products"
                className="font-sans text-sm text-[#6B6B6B] hover:text-[#B8860B] border-b border-[#E8E4DF] hover:border-[#B8860B] pb-1 transition-colors hidden sm:block"
              >
                Xem tất cả
              </Link>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
              {relatedProducts.map((item) => {
                const image = item.images?.[0]?.url || item.thumbnail;
                return (
                  <div 
                    key={item.id} 
                    className="group cursor-pointer"
                    onClick={() => navigate(`/products/${item.id}`)}
                  >
                    <div className="relative overflow-hidden aspect-square bg-[#F5F3F0] mb-6">
                      <img 
                        src={getImageUrl(image)} 
                        alt={item.name}
                        className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700"
                        onError={(e) => { 
                          e.target.src = 'https://images.unsplash.com/photo-1515562141207-7a88fb7ce338?w=400&h=400&fit=crop'; 
                        }}
                      />
                    </div>
                    <h3 className="font-sans text-sm font-medium tracking-wide mb-2 text-[#1A1A1A] group-hover:text-[#B8860B] transition-colors">{item.name}</h3>
                    <p className="font-mono text-[10px] uppercase tracking-wider text-[#6B6B6B] mb-2">
                      {item.category_name || item.category}
                    </p>
                    <p className="font-sans text-sm text-[#B8860B]">{formatPrice(item.price)}</p>
                  </div>
                );
              })}
            </div>
          </section>
        )}
      </main>

      <Footer />
    </div>
  );
};

export default ProductDetail;
