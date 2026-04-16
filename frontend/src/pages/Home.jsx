import { useState, useEffect } from 'react';
import Header from '../components/Header';
import Footer from '../components/Footer';
import ProductCard from '../components/ProductCard';
import { Link } from 'react-router-dom';
import { productAPI } from '../utils/api';

const Home = () => {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    productAPI.getAll({ limit: 8 })
      .then(res => { if (res.data.success) setProducts(res.data.data.products); })
      .finally(() => setLoading(false));
  }, []);

  return (
    <div className="min-h-screen flex flex-col bg-[#FAFAF8] text-[#1A1A1A]">
      <Header />
      <main className="flex-1 pt-[72px]">
        {/* Hero Section */}
        <section className="relative w-full" style={{ aspectRatio: '16/9' }}>
          <div className="absolute inset-0 z-0">
            <img 
              className="w-full h-full object-cover"
              src="/images/banner.jpg"
              alt="AURA Fine Jewelry"
            />
            <div className="absolute inset-0 bg-black/20"></div>
          </div>
          <div className="absolute inset-0 z-10 flex items-center">
            <div className="px-6 md:px-24 max-w-5xl">
              <div className="mb-6 flex items-center gap-4">
                <span className="h-px flex-1 max-w-[80px] bg-white/40"></span>
                <span className="font-mono text-xs font-medium uppercase tracking-[0.2em] text-white/80">
                  Fine Jewelry
                </span>
              </div>
              <h1 className="font-serif text-4xl md:text-6xl lg:text-7xl text-white leading-[1.1] mb-8 tracking-tight">
                Tỏa sáng theo <br/><span className="italic text-[#B8860B]">cách của riêng</span>
              </h1>
              <p className="text-white/80 text-base md:text-lg font-light mb-10 max-w-2xl leading-relaxed">
                Mỗi món trang sức tại AURA là một câu chuyện được kể bằng đôi bàn tay tinh xảo, mang lại vẻ đẹp vĩnh cửu cho người phụ nữ hiện đại.
              </p>
              <Link 
                to="/products"
                className="inline-block bg-[#B8860B] text-white px-10 py-4 font-sans font-medium tracking-[0.1em] uppercase text-sm hover:bg-[#D4A84B] hover:-translate-y-0.5 hover:shadow-lg transition-all duration-200 touch-manipulation"
              >
                Khám phá bộ sưu tập
              </Link>
            </div>
          </div>
        </section>

        {/* Categories Section - Bento Grid */}
        <section className="py-24 md:py-36 px-6 md:px-12 max-w-[1920px] mx-auto">
          <div className="flex flex-col md:flex-row justify-between items-end mb-16 gap-8">
            <div className="max-w-xl">
              <div className="mb-6 flex items-center gap-4">
                <span className="h-px flex-1 max-w-[60px] bg-[#E8E4DF]"></span>
                <span className="font-mono text-xs font-medium uppercase tracking-[0.15em] text-[#B8860B]">
                  Chế tác thủ công
                </span>
              </div>
              <h2 className="font-serif text-4xl md:text-5xl text-[#1A1A1A] leading-tight">
                Kiệt tác từ <span className="italic text-[#B8860B]">đam mê</span>
              </h2>
            </div>
            <Link to="/products" className="font-sans text-sm text-[#6B6B6B] hover:text-[#B8860B] transition-colors border-b border-[#E8E4DF] hover:border-[#B8860B] pb-1">
              Xem tất cả sản phẩm
            </Link>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-12 gap-4 md:gap-6 h-auto md:h-[700px]">
            {/* Nhẫn */}
            <Link to="/products?category=Nhẫn" className="md:col-span-4 relative group overflow-hidden bg-[#F5F3F0]">
              <img 
                className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110 grayscale group-hover:grayscale-0"
                src="https://images.pexels.com/photos/11504786/pexels-photo-11504786.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2"
                alt="Nhẫn"
                style={{ minHeight: '400px', objectPosition: 'center' }}
              />
              <div className="absolute inset-0 bg-black/30 flex flex-col justify-end p-8 group-hover:bg-black/40 transition-colors">
                <h3 className="font-serif text-2xl text-white mb-2">Nhẫn</h3>
                <p className="text-white/70 text-sm font-light">Tuyên ngôn của tình yêu vĩnh cửu</p>
              </div>
            </Link>

            {/* Dây chuyền & Bông tai Column */}
            <div className="md:col-span-4 flex flex-col gap-4 md:gap-6">
              <Link to="/products?category=Dây chuyền" className="h-1/2 relative group overflow-hidden bg-[#F5F3F0]">
                <img 
                  className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110 grayscale group-hover:grayscale-0"
                  src="https://images.unsplash.com/photo-1599643478518-a784e5dc4c8f?w=600&h=400&fit=crop"
                  alt="Dây chuyền"
                />
                <div className="absolute inset-0 bg-black/30 flex flex-col justify-end p-8 group-hover:bg-black/40 transition-colors">
                  <h3 className="font-serif text-2xl text-white mb-2">Dây chuyền</h3>
                  <p className="text-white/70 text-sm font-light">Nét thanh tú trên làn da</p>
                </div>
              </Link>
              <Link to="/products?category=Bông tai" className="h-1/2 relative group overflow-hidden bg-[#F5F3F0]">
                <img 
                  className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110 grayscale group-hover:grayscale-0"
                  src="https://images.unsplash.com/photo-1535632066927-ab7c9ab60908?w=600&h=400&fit=crop"
                  alt="Bông tai"
                />
                <div className="absolute inset-0 bg-black/30 flex flex-col justify-end p-8 group-hover:bg-black/40 transition-colors">
                  <h3 className="font-serif text-2xl text-white mb-2">Bông tai</h3>
                  <p className="text-white/70 text-sm font-light">Ánh sáng của sự rạng rỡ</p>
                </div>
              </Link>
            </div>

            {/* Bộ sưu tập & Lắc tay */}
            <div className="md:col-span-4 flex flex-col gap-4 md:gap-6">
              <Link to="/products" className="h-2/3 relative group overflow-hidden bg-[#F5F3F0]">
                <img 
                  className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110 grayscale group-hover:grayscale-0"
                  src="https://images.pexels.com/photos/16082501/pexels-photo-16082501/free-photo-of-b-c-d-kim-hoan-co-dau-hoa-tai.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2"
                  alt="Bộ sưu tập"
                />
                <div className="absolute inset-0 bg-black/30 flex flex-col justify-end p-8 group-hover:bg-black/40 transition-colors">
                  <h3 className="font-serif text-2xl text-white mb-2">Bộ sưu tập</h3>
                  <p className="text-white/70 text-sm font-light">Những tác phẩm độc bản</p>
                </div>
              </Link>
              <Link to="/products?category=Lắc tay" className="h-1/3 relative group overflow-hidden bg-[#F5F3F0]">
                <img 
                  className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110 grayscale group-hover:grayscale-0"
                  src="https://images.unsplash.com/photo-1611591437281-460bfbe1220a?w=600&h=300&fit=crop"
                  alt="Lắc tay"
                />
                <div className="absolute inset-0 bg-black/30 flex flex-col justify-end p-6 group-hover:bg-black/40 transition-colors">
                  <h3 className="font-serif text-xl text-white mb-1">Lắc tay</h3>
                  <p className="text-white/70 text-xs font-light">Mềm mại và đầy tinh tế</p>
                </div>
              </Link>
            </div>
          </div>
        </section>

        {/* Featured Products */}
        <section className="py-24 md:py-36 px-6 md:px-12 bg-[#F5F3F0]">
          <div className="max-w-[1440px] mx-auto">
            <div className="text-center mb-16">
              <div className="mb-6 flex items-center gap-4 justify-center">
                <span className="h-px flex-1 max-w-[80px] bg-[#E8E4DF]"></span>
                <span className="font-mono text-xs font-medium uppercase tracking-[0.15em] text-[#B8860B]">
                  Bộ sưu tập
                </span>
                <span className="h-px flex-1 max-w-[80px] bg-[#E8E4DF]"></span>
              </div>
              <h2 className="font-serif text-4xl md:text-5xl text-[#1A1A1A] mb-4">
                Sản phẩm <span className="italic text-[#B8860B]">tiêu biểu</span>
              </h2>
              <div className="w-16 h-px bg-[#B8860B] mx-auto"></div>
            </div>
            {loading ? (
              <div className="text-center py-20">
                <div className="inline-block w-8 h-8 border-2 border-[#B8860B] border-t-transparent rounded-full animate-spin"></div>
              </div>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
                {products.map(p => <ProductCard key={p.id} product={p} />)}
              </div>
            )}
          </div>
        </section>

        {/* Why Choose Us Section */}
        <section className="py-24 md:py-36 px-6 md:px-12 bg-[#FAFAF8]">
          <div className="max-w-[1440px] mx-auto">
            <div className="grid grid-cols-2 md:grid-cols-4 gap-8 md:gap-12">
              <div className="flex flex-col items-center text-center p-6 bg-white border-t-2 border-[#B8860B] hover:shadow-md transition-shadow duration-200">
                <svg className="w-10 h-10 text-[#B8860B] mb-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M5 3v4M3 5h4M6 17v4m-2-2h4m5-16l2.286 6.857L21 12l-5.714 2.143L13 21l-2.286-6.857L5 12l5.714-2.143L13 3z" />
                </svg>
                <h3 className="font-serif text-lg text-[#1A1A1A] mb-3">Chất liệu cao cấp</h3>
                <p className="text-[#6B6B6B] text-sm font-light leading-relaxed">Cam kết 100% vàng đủ tuổi và đá quý tự nhiên có chứng chỉ quốc tế.</p>
              </div>
              <div className="flex flex-col items-center text-center p-6 bg-white border-t-2 border-[#B8860B] hover:shadow-md transition-shadow duration-200">
                <svg className="w-10 h-10 text-[#B8860B] mb-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 12l2 2 4-4M7.835 4.697a3.42 3.42 0 001.946-.806 3.42 3.42 0 014.438 0 3.42 3.42 0 001.946.806 3.42 3.42 0 013.138 3.138 3.42 3.42 0 00.806 1.946 3.42 3.42 0 010 4.438 3.42 3.42 0 00-.806 1.946 3.42 3.42 0 01-3.138 3.138 3.42 3.42 0 00-1.946.806 3.42 3.42 0 01-4.438 0 3.42 3.42 0 00-1.946-.806 3.42 3.42 0 01-3.138-3.138 3.42 3.42 0 00-.806-1.946 3.42 3.42 0 010-4.438 3.42 3.42 0 00.806-1.946 3.42 3.42 0 013.138-3.138z" />
                </svg>
                <h3 className="font-serif text-lg text-[#1A1A1A] mb-3">Thiết kế tinh xảo</h3>
                <p className="text-[#6B6B6B] text-sm font-light leading-relaxed">Được chế tác thủ công bởi những nghệ nhân giàu kinh nghiệm nhất.</p>
              </div>
              <div className="flex flex-col items-center text-center p-6 bg-white border-t-2 border-[#B8860B] hover:shadow-md transition-shadow duration-200">
                <svg className="w-10 h-10 text-[#B8860B] mb-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
                </svg>
                <h3 className="font-serif text-lg text-[#1A1A1A] mb-3">Bảo hành trọn đời</h3>
                <p className="text-[#6B6B6B] text-sm font-light leading-relaxed">Dịch vụ làm sạch và đánh bóng hoàn toàn miễn phí trọn đời.</p>
              </div>
              <div className="flex flex-col items-center text-center p-6 bg-white border-t-2 border-[#B8860B] hover:shadow-md transition-shadow duration-200">
                <svg className="w-10 h-10 text-[#B8860B] mb-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M13 10V3L4 14h7v7l9-11h-7z" />
                </svg>
                <h3 className="font-serif text-lg text-[#1A1A1A] mb-3">Giao hàng nhanh</h3>
                <p className="text-[#6B6B6B] text-sm font-light leading-relaxed">Giao hàng nhanh chóng và bảo mật tận tay trên toàn quốc.</p>
              </div>
            </div>
          </div>
        </section>

        {/* Lookbook Section */}
        <section className="py-24 md:py-36 relative overflow-hidden bg-[#F5F3F0]">
          <div className="max-w-[1920px] mx-auto px-6 md:px-12 flex flex-col md:flex-row items-center gap-16 lg:gap-24">
            <div className="w-full md:w-1/2 relative">
              <div className="aspect-[4/5] overflow-hidden">
                <img 
                  className="w-full h-full object-cover"
                  src="https://images.unsplash.com/photo-1515562141207-7a88fb7ce338?w=800&h=1000&fit=crop"
                  alt="AURA Lookbook"
                />
              </div>
              <div className="absolute -bottom-8 -right-8 hidden md:block w-64 h-80 border border-[#B8860B]/20 -z-10"></div>
            </div>
            <div className="w-full md:w-1/2 space-y-8">
              <div className="mb-6 flex items-center gap-4">
                <span className="h-px flex-1 max-w-[60px] bg-[#E8E4DF]"></span>
                <span className="font-mono text-xs font-medium uppercase tracking-[0.15em] text-[#B8860B]">
                  The Atelier
                </span>
              </div>
              <h2 className="font-serif text-4xl md:text-5xl lg:text-6xl text-[#1A1A1A] leading-tight">
                Gói trọn tình yêu<br/><span className="italic text-[#B8860B]">trong từng món quà</span>
              </h2>
              <p className="text-[#6B6B6B] text-lg leading-[1.75] font-light">
                Mỗi món quà từ AURA không chỉ là trang sức, mà là lời nhắn gửi trân quý, là minh chứng cho những khoảnh khắc hạnh phúc khó quên trong cuộc đời. Hãy để chúng tôi giúp bạn kể câu chuyện tình của riêng mình.
              </p>
              <div className="pt-4">
                <Link to="/products" className="inline-flex items-center gap-2 font-sans text-sm text-[#B8860B] border-b border-[#B8860B] pb-1 hover:text-[#D4A84B] hover:border-[#D4A84B] transition-colors">
                  Tìm món quà hoàn hảo
                  <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
                  </svg>
                </Link>
              </div>
            </div>
          </div>
        </section>

        {/* Newsletter Section */}
        <section className="py-24 md:py-36 px-6 bg-[#FAFAF8] relative overflow-hidden">
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[500px] bg-[#B8860B] rounded-full opacity-[0.02] blur-3xl"></div>
          <div className="max-w-3xl mx-auto text-center relative z-10">
            <div className="mb-6 flex items-center gap-4 justify-center">
              <span className="h-px flex-1 max-w-[80px] bg-[#E8E4DF]"></span>
              <span className="font-mono text-xs font-medium uppercase tracking-[0.15em] text-[#B8860B]">
                Ấn phẩm
              </span>
              <span className="h-px flex-1 max-w-[80px] bg-[#E8E4DF]"></span>
            </div>
            <h2 className="font-serif text-4xl md:text-5xl text-[#1A1A1A] mb-6">
              Nhận tư vấn <span className="italic text-[#B8860B]">độc quyền</span>
            </h2>
            <p className="text-[#6B6B6B] text-lg mb-12">Nhận thông tin về bộ sưu tập mới và ưu đãi đặc biệt dành riêng cho bạn.</p>
            <form className="flex flex-col sm:flex-row gap-4 max-w-xl mx-auto">
              <input 
                type="email" 
                placeholder="Nhập email của bạn" 
                className="flex-1 px-6 py-4 bg-white border border-[#E8E4DF] focus:border-[#B8860B] focus:outline-none focus:ring-2 focus:ring-[#B8860B]/20 font-sans text-sm placeholder:text-[#6B6B6B]/50 transition-all"
              />
              <button 
                type="submit" 
                className="px-8 py-4 bg-[#B8860B] text-white font-sans font-medium tracking-[0.1em] uppercase text-sm hover:bg-[#D4A84B] hover:-translate-y-0.5 transition-all duration-200 touch-manipulation"
              >
                Đăng ký
              </button>
            </form>
          </div>
        </section>

        {/* Testimonials Section */}
        <section className="py-24 md:py-36 px-6 bg-[#1A1A1A]">
          <div className="max-w-[1440px] mx-auto">
            <div className="text-center mb-16">
              <div className="mb-6 flex items-center gap-4 justify-center">
                <span className="h-px flex-1 max-w-[80px] bg-white/10"></span>
                <span className="font-mono text-xs font-medium uppercase tracking-[0.15em] text-[#B8860B]">
                  Cảm nhận
                </span>
                <span className="h-px flex-1 max-w-[80px] bg-white/10"></span>
              </div>
              <h2 className="font-serif text-4xl md:text-5xl text-white mb-4">
                Lời từ <span className="italic text-[#B8860B]">trái tim</span>
              </h2>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-12">
              <div className="space-y-6 bg-white/5 p-8 border-t border-[#B8860B]">
                <div className="flex gap-1">
                  {[...Array(5)].map((_, i) => (
                    <svg key={i} className="w-4 h-4 text-[#B8860B]" fill="currentColor" viewBox="0 0 20 20">
                      <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                    </svg>
                  ))}
                </div>
                <p className="font-serif text-lg italic text-white/90 leading-relaxed">
                  "Tôi thực sự ấn tượng với độ tinh xảo của chiếc nhẫn đính hôn. Vợ tôi đã rất hạnh phúc và luôn đeo nó mỗi ngày."
                </p>
                <div>
                  <p className="font-mono text-xs font-medium uppercase tracking-[0.15em] text-white mb-1">Trần Minh Quân</p>
                  <p className="text-white/40 text-xs">Khách hàng tại Hà Nội</p>
                </div>
              </div>
              <div className="space-y-6 bg-white/5 p-8 border-t border-[#B8860B]">
                <div className="flex gap-1">
                  {[...Array(5)].map((_, i) => (
                    <svg key={i} className="w-4 h-4 text-[#B8860B]" fill="currentColor" viewBox="0 0 20 20">
                      <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                    </svg>
                  ))}
                </div>
                <p className="font-serif text-lg italic text-white/90 leading-relaxed">
                  "Sản phẩm đẹp hơn cả trong hình. Sợi dây chuyền có độ sáng bóng hoàn hảo và bao bì đóng gói rất sang trọng."
                </p>
                <div>
                  <p className="font-mono text-xs font-medium uppercase tracking-[0.15em] text-white mb-1">Nguyễn Thanh Vân</p>
                  <p className="text-white/40 text-xs">Khách hàng tại TP. HCM</p>
                </div>
              </div>
              <div className="space-y-6 bg-white/5 p-8 border-t border-[#B8860B]">
                <div className="flex gap-1">
                  {[...Array(5)].map((_, i) => (
                    <svg key={i} className="w-4 h-4 text-[#B8860B]" fill="currentColor" viewBox="0 0 20 20">
                      <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                    </svg>
                  ))}
                </div>
                <p className="font-serif text-lg italic text-white/90 leading-relaxed">
                  "Tôi đã chọn AURA cho bộ trang sức ngày cưới. Thiết kế cổ điển nhưng vẫn rất hiện đại, làm tôn lên vẻ đẹp của bộ váy cưới."
                </p>
                <div>
                  <p className="font-mono text-xs font-medium uppercase tracking-[0.15em] text-white mb-1">Lê Thùy Trang</p>
                  <p className="text-white/40 text-xs">Khách hàng tại Đà Nẵng</p>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Blog Section */}
        <section className="py-24 md:py-36 px-6 md:px-12 bg-[#FAFAF8]">
          <div className="max-w-[1440px] mx-auto">
            <div className="flex justify-between items-end mb-16">
              <div>
                <div className="mb-6 flex items-center gap-4">
                  <span className="h-px flex-1 max-w-[60px] bg-[#E8E4DF]"></span>
                  <span className="font-mono text-xs font-medium uppercase tracking-[0.15em] text-[#B8860B]">
                    Tin tức
                  </span>
                </div>
                <h2 className="font-serif text-4xl text-[#1A1A1A]">
                  Góc nhìn <span className="italic text-[#B8860B]">nghệ thuật</span>
                </h2>
              </div>
              <Link to="/news" className="font-sans text-sm text-[#6B6B6B] hover:text-[#B8860B] transition-colors border-b border-[#E8E4DF] hover:border-[#B8860B] pb-1 hidden sm:block">
                Xem tất cả bài viết
              </Link>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-12">
              <article className="group cursor-pointer">
                <div className="aspect-[4/3] overflow-hidden mb-6 bg-[#F5F3F0]">
                  <img 
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
                    src="https://images.unsplash.com/photo-1617038260897-41a1f14a8ca0?w=600&h=450&fit=crop"
                    alt="Hành trình ra đời một kiệt tác kim hoàn"
                  />
                </div>
                <span className="font-mono text-[10px] tracking-[0.2em] uppercase text-[#B8860B] mb-3 block">Chế tác</span>
                <h3 className="font-serif text-xl text-[#1A1A1A] mb-4 group-hover:text-[#B8860B] transition-colors">Hành trình ra đời một kiệt tác kim hoàn</h3>
                <p className="text-[#6B6B6B] text-sm leading-relaxed line-clamp-2">Khám phá các bước từ bản phác thảo tay đầu tiên đến khi sản phẩm hoàn thiện rạng rỡ.</p>
              </article>
              <article className="group cursor-pointer">
                <div className="aspect-[4/3] overflow-hidden mb-6 bg-[#F5F3F0]">
                  <img 
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
                    src="https://images.unsplash.com/photo-1515562141207-7a88fb7ce338?w=600&h=450&fit=crop"
                    alt="Bí quyết chọn trang sức theo trang phục"
                  />
                </div>
                <span className="font-mono text-[10px] tracking-[0.2em] uppercase text-[#B8860B] mb-3 block">Phong cách</span>
                <h3 className="font-serif text-xl text-[#1A1A1A] mb-4 group-hover:text-[#B8860B] transition-colors">Bí quyết chọn trang sức theo trang phục</h3>
                <p className="text-[#6B6B6B] text-sm leading-relaxed line-clamp-2">Nghệ thuật phối hợp phụ kiện để tôn lên khí chất cá nhân trong mọi hoàn cảnh.</p>
              </article>
              <article className="group cursor-pointer">
                <div className="aspect-[4/3] overflow-hidden mb-6 bg-[#F5F3F0]">
                  <img 
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
                    src="https://images.unsplash.com/photo-1573408301185-9146fe634ad0?w=600&h=450&fit=crop"
                    alt="Cách nhận biết kim cương chất lượng cao"
                  />
                </div>
                <span className="font-mono text-[10px] tracking-[0.2em] uppercase text-[#B8860B] mb-3 block">Kiến thức</span>
                <h3 className="font-serif text-xl text-[#1A1A1A] mb-4 group-hover:text-[#B8860B] transition-colors">Cách nhận biết kim cương chất lượng cao</h3>
                <p className="text-[#6B6B6B] text-sm leading-relaxed line-clamp-2">Hiểu rõ về quy tắc 4C và những tiêu chuẩn khắt khe tại AURA Jewelry.</p>
              </article>
            </div>
          </div>
        </section>
      </main>
      <Footer />
    </div>
  );
};

export default Home;
