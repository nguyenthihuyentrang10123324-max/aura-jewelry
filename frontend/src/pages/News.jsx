import { useState, useEffect, useRef } from 'react';
import Header from '../components/Header';
import Footer from '../components/Footer';
import { newsAPI } from '../utils/api';
import { getImageUrl, formatDate } from '../utils/helpers';
import { Link } from 'react-router-dom';

const categories = [
  { id: 'all', label: 'Tất cả' },
  { id: 'KIẾN THỨC', label: 'Kiến thức' },
  { id: 'XU HƯỚNG', label: 'Xu hướng' },
  { id: 'CẢM HỨNG', label: 'Cảm hứng' },
  { id: 'DI SẢN', label: 'Di sản' },
];

const News = () => {
  const [news, setNews] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeCategory, setActiveCategory] = useState('all');
  const [email, setEmail] = useState('');

  useEffect(() => {
    fetchNews();
  }, []);

  const fetchNews = async () => {
    try {
      setLoading(true);
      const res = await newsAPI.getAll({ limit: 20 });
      if (res.data.success) {
        setNews(res.data.data.news);
      }
    } catch (error) {
      console.error('Error fetching news:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleNewsletterSubmit = (e) => {
    e.preventDefault();
    if (email) {
      alert(`Cảm ơn bạn! Chúng tôi sẽ gửi tin tức đến ${email}`);
      setEmail('');
    }
  };

  const filteredNews = activeCategory === 'all' 
    ? news 
    : news.filter(item => item.category?.toUpperCase() === activeCategory);

  const featuredNews = filteredNews.slice(0, 1)[0];
  const remainingNews = filteredNews.slice(1);

  return (
    <div className="min-h-screen flex flex-col bg-[#FAFAF8] text-[#1A1A1A]">
      <Header />

      <main className="flex-1 pt-[72px]">
        {/* Hero Section */}
        <section className="relative w-full h-[70vh] min-h-[500px] overflow-hidden flex items-center justify-center bg-[#1A1A1A]">
          <img 
            className="absolute inset-0 w-full h-full object-cover opacity-50" 
            src="https://images.unsplash.com/photo-1506630448388-4e683c67ddb0?w=1920&h=1080&fit=crop" 
            alt="Nghệ thuật chế tác trang sức"
          />
          <div className="relative z-10 text-center px-6 max-w-4xl">
            <div className="mb-6 flex items-center justify-center gap-4">
              <span className="h-px flex-1 max-w-[80px] bg-white/30"></span>
              <span className="font-mono text-xs font-medium uppercase tracking-[0.2em] text-[#B8860B]">
                Tin tức
              </span>
              <span className="h-px flex-1 max-w-[80px] bg-white/30"></span>
            </div>
            <h1 className="font-serif text-4xl md:text-5xl lg:text-6xl text-white leading-tight mb-8">
              Nghệ thuật chế tác & <br/><span className="italic text-[#B8860B]">những câu chuyện</span>
            </h1>
            <div className="w-24 h-px bg-[#B8860B] mx-auto"></div>
          </div>
        </section>

        {/* Editorial Intro */}
        <section className="py-16 md:py-24 px-6 bg-[#FAFAF8]">
          <div className="max-w-2xl mx-auto text-center">
            <p className="text-[#6B6B6B] leading-relaxed font-light text-lg italic">
              "Mỗi món trang sức tại AURA không chỉ là vật phẩm trang trí, mà là một chương trong cuốn sách về vẻ đẹp vĩnh cửu, được viết bằng đôi tay tài hoa và trái tim của những người nghệ nhân."
            </p>
          </div>
        </section>

        {/* Category Filter */}
        <section className="px-6 pb-12 bg-[#FAFAF8]">
          <div className="flex flex-wrap justify-center gap-6 md:gap-10">
            {categories.map((cat) => (
              <button
                key={cat.id}
                onClick={() => setActiveCategory(cat.id)}
                className={`font-mono text-[10px] tracking-[0.2em] uppercase pb-1 transition-all duration-300 ${
                  activeCategory === cat.id
                    ? 'text-[#B8860B] border-b border-[#B8860B]'
                    : 'text-[#6B6B6B] hover:text-[#B8860B]'
                }`}
              >
                {cat.label}
              </button>
            ))}
          </div>
        </section>

        {/* Loading State */}
        {loading ? (
          <div className="flex justify-center py-20">
            <div className="w-12 h-12 border-2 border-[#B8860B] border-t-transparent rounded-full animate-spin"></div>
          </div>
        ) : (
          <>
            {/* Featured Article */}
            {featuredNews && (
              <section className="px-6 md:px-12 pb-16 bg-[#FAFAF8]">
                <Link to={`/news/${featuredNews.id}`} className="group block">
                  <article className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-16 items-center bg-white p-8 lg:p-12 border-t-2 border-[#B8860B]">
                    <div className="aspect-[4/5] overflow-hidden">
                      <img 
                        src={getImageUrl(featuredNews.thumbnail)}
                        alt={featuredNews.title}
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
                        onError={(e) => {
                          e.target.src = 'https://images.unsplash.com/photo-1515562141207-7a88fb7ce338?w=800&h=1000&fit=crop';
                        }}
                      />
                    </div>
                    <div className="flex flex-col items-start">
                      <span className="font-mono text-[10px] tracking-[0.2em] text-[#B8860B] uppercase mb-4">
                        {featuredNews.category || 'KIẾN THỨC'}
                      </span>
                      <h2 className="font-serif text-2xl md:text-3xl lg:text-4xl text-[#1A1A1A] mb-6 leading-tight group-hover:text-[#B8860B] transition-colors">
                        {featuredNews.title}
                      </h2>
                      <p className="text-[#6B6B6B] text-sm font-light leading-relaxed mb-8 line-clamp-4">
                        {featuredNews.excerpt || featuredNews.content?.substring(0, 300) || featuredNews.description}
                      </p>
                      <span className="inline-flex items-center gap-2 font-mono text-[10px] tracking-widest uppercase text-[#B8860B] border-b border-[#B8860B] pb-1 group-hover:border-[#D4A84B] transition-colors">
                        Xem thêm
                        <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
                        </svg>
                      </span>
                    </div>
                  </article>
                </Link>
              </section>
            )}

            {/* Article Grid */}
            {remainingNews.length > 0 && (
              <section className="px-6 md:px-12 pb-16 bg-[#FAFAF8]">
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-12">
                  {remainingNews.map((item, idx) => (
                    <article 
                      key={item.id} 
                      className={`group cursor-pointer ${idx % 3 === 1 ? 'lg:mt-[-40px]' : ''}`}
                    >
                      <Link to={`/news/${item.id}`}>
                        <div className="aspect-[4/3] overflow-hidden mb-6 bg-[#F5F3F0]">
                          <img 
                            src={getImageUrl(item.thumbnail)}
                            alt={item.title}
                            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
                            onError={(e) => {
                              e.target.src = 'https://images.unsplash.com/photo-1515562141207-7a88fb7ce338?w=600&h=450&fit=crop';
                            }}
                          />
                        </div>
                        <span className="font-mono text-[10px] tracking-[0.2em] text-[#B8860B] uppercase mb-3 block">
                          {item.category || 'KIẾN THỨC'}
                        </span>
                        <h3 className="font-serif text-xl text-[#1A1A1A] mb-4 leading-snug group-hover:text-[#B8860B] transition-colors">
                          {item.title}
                        </h3>
                        <p className="text-[#6B6B6B] text-sm font-light mb-6 line-clamp-2">
                          {item.excerpt || item.description || item.content?.substring(0, 150)}
                        </p>
                        <span className="inline-flex items-center gap-2 font-mono text-[10px] tracking-widest uppercase text-[#B8860B] border-b border-[#B8860B] pb-1 group-hover:border-[#D4A84B] transition-colors">
                          Xem thêm
                        </span>
                      </Link>
                    </article>
                  ))}

                  {/* Newsletter Section */}
                  <div className="md:col-span-2 lg:col-span-3 bg-[#1A1A1A] p-12 flex flex-col md:flex-row gap-8 items-center">
                    <div className="flex-1">
                      <span className="font-mono text-[10px] tracking-[0.2em] text-[#B8860B] uppercase mb-4 block">
                        ẤN PHẨM ĐẶC BIỆT
                      </span>
                      <h2 className="font-serif text-2xl md:text-3xl text-white mb-6 leading-tight">
                        Tuyển Tập "AURA Heritage"
                      </h2>
                      <p className="text-white/60 text-sm font-light leading-relaxed mb-8">
                        Cuốn sách ảnh đầu tiên ghi lại hành trình 20 năm phục dựng những kỹ thuật chế tác trang sức cổ truyền của Việt Nam qua lăng kính đương đại.
                      </p>
                      <form onSubmit={handleNewsletterSubmit} className="flex flex-col sm:flex-row gap-4">
                        <input
                          type="email"
                          value={email}
                          onChange={(e) => setEmail(e.target.value)}
                          placeholder="Nhập email của bạn"
                          className="flex-1 px-4 py-3 bg-white/10 border border-white/20 text-white font-sans text-sm placeholder:text-white/40 focus:border-[#B8860B] focus:outline-none transition-colors"
                          required
                        />
                        <button 
                          type="submit"
                          className="px-8 py-3 bg-[#B8860B] text-white font-sans text-xs tracking-widest uppercase hover:bg-[#D4A84B] transition-all duration-200 whitespace-nowrap"
                        >
                          Đăng ký
                        </button>
                      </form>
                    </div>
                    <div className="flex-1">
                      <img 
                        className="w-full h-auto object-cover shadow-2xl" 
                        src="https://images.unsplash.com/photo-1544716278-ca5e3f4abd8c?w=600&h=400&fit=crop" 
                        alt="AURA Heritage Book"
                      />
                    </div>
                  </div>
                </div>
              </section>
            )}

            {/* Empty State */}
            {filteredNews.length === 0 && (
              <div className="text-center py-20 px-6 bg-[#FAFAF8]">
                <svg className="w-16 h-16 text-[#E8E4DF] mx-auto mb-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M19 20H5a2 2 0 01-2-2V6a2 2 0 012-2h10a2 2 0 012 2v1m2 13a2 2 0 01-2-2V7m2 13a2 2 0 002-2V9a2 2 0 00-2-2h-2m-4-3H9M7 16h6M7 8h6v4H7V8z" />
                </svg>
                <p className="text-[#6B6B6B] font-light">Chưa có bài viết nào trong danh mục này</p>
              </div>
            )}
          </>
        )}

        {/* Separator */}
        <div className="w-full h-px bg-[#E8E4DF]"></div>
      </main>

      <Footer />
    </div>
  );
};

export default News;
