import { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import Header from '../components/Header';
import Footer from '../components/Footer';
import { newsAPI } from '../utils/api';
import { getImageUrl, formatDate } from '../utils/helpers';

const NewsDetail = () => {
  const { id } = useParams();
  const [news, setNews] = useState(null);
  const [relatedNews, setRelatedNews] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchNewsDetail();
  }, [id]);

  const fetchNewsDetail = async () => {
    try {
      setLoading(true);
      const res = await newsAPI.getById(id);
      if (res.data.success) {
        const newsData = res.data.data.news;
        setNews(newsData);
        
        const relatedRes = await newsAPI.getAll({ limit: 3 });
        if (relatedRes.data.success) {
          const filtered = relatedRes.data.data.news
            .filter(item => item.id !== parseInt(id))
            .slice(0, 3);
          setRelatedNews(filtered);
        }
      }
    } catch (error) {
      console.error('Error fetching news detail:', error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[#FAFAF8]">
        <div className="w-12 h-12 border-2 border-[#B8860B] border-t-transparent rounded-full animate-spin"></div>
      </div>
    );
  }

  if (!news) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[#FAFAF8]">
        <div className="text-center">
          <svg className="w-16 h-16 text-[#E8E4DF] mx-auto mb-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
          </svg>
          <p className="text-[#6B6B6B] font-light mb-4">Không tìm thấy bài viết</p>
          <Link to="/news" className="font-mono text-xs uppercase tracking-widest text-[#B8860B] border-b border-[#B8860B] hover:text-[#D4A84B] hover:border-[#D4A84B] transition-colors">
            Quay lại trang tin tức
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col bg-[#FAFAF8] text-[#1A1A1A]">
      <Header />

      <main className="flex-1">
        {/* Hero Section */}
        <section className="relative w-full h-[60vh] min-h-[400px] overflow-hidden flex items-end justify-center bg-[#1A1A1A]">
          <img 
            className="absolute inset-0 w-full h-full object-cover" 
            src={getImageUrl(news.thumbnail) || 'https://images.unsplash.com/photo-1506630448388-4e683c67ddb0?w=1920&h=1080&fit=crop'}
            alt={news.title}
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/40 to-transparent"></div>
          <div className="relative z-10 w-full max-w-4xl mx-auto px-6 pb-16 text-left">
            <span className="font-mono text-[10px] tracking-[0.3em] text-[#B8860B] uppercase mb-4 block">
              {news.category || 'KIẾN THỨC'}
            </span>
            <h1 className="font-serif text-3xl md:text-5xl text-white leading-tight mb-6">
              {news.title}
            </h1>
            <p className="text-white/60 text-sm font-sans">
              {formatDate(news.created_at)}
            </p>
          </div>
        </section>

        {/* Article Content */}
        <section className="py-16 md:py-24 px-6 bg-[#FAFAF8]">
          <div className="max-w-3xl mx-auto">
            {/* Excerpt */}
            {news.excerpt && (
              <p className="text-xl text-[#6B6B6B] font-light leading-relaxed mb-12 italic border-l-2 border-[#B8860B] pl-6">
                {news.excerpt}
              </p>
            )}

            {/* Content */}
            <article className="max-w-none">
              <div 
                className="text-[#6B6B6B] font-light leading-loose space-y-6"
                dangerouslySetInnerHTML={{ __html: news.content || news.description }}
              />
            </article>

            {/* Share & Actions */}
            <div className="mt-16 pt-8 border-t border-[#E8E4DF] flex flex-col sm:flex-row justify-between items-start sm:items-center gap-6">
              <div className="flex items-center gap-4">
                <span className="font-mono text-[10px] uppercase tracking-widest text-[#6B6B6B]">Chia sẻ:</span>
                <button className="text-[#6B6B6B] hover:text-[#B8860B] transition-colors">
                  <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M8.684 13.342C8.886 12.938 9 12.482 9 12c0-.482-.114-.938-.316-1.342m0 2.684a3 3 0 110-2.684m0 2.684l6.632 3.316m-6.632-6l6.632-3.316m0 0a3 3 0 105.367-2.684 3 3 0 00-5.367 2.684zm0 9.316a3 3 0 105.368 2.684 3 3 0 00-5.368-2.684z" />
                  </svg>
                </button>
                <button className="text-[#6B6B6B] hover:text-[#B8860B] transition-colors">
                  <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M13.828 10.172a4 4 0 00-5.656 0l-4 4a4 4 0 105.656 5.656l1.102-1.101m-.758-4.899a4 4 0 005.656 0l4-4a4 4 0 00-5.656-5.656l-1.1 1.1" />
                  </svg>
                </button>
              </div>
              <Link 
                to="/news" 
                className="inline-flex items-center gap-2 font-mono text-[10px] tracking-widest uppercase text-[#B8860B] border-b border-[#B8860B] hover:text-[#D4A84B] hover:border-[#D4A84B] transition-colors"
              >
                <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M15 19l-7-7 7-7" />
                </svg>
                Quay lại tin tức
              </Link>
            </div>
          </div>
        </section>

        {/* Related News */}
        {relatedNews.length > 0 && (
          <section className="py-16 md:py-24 px-6 bg-[#F5F3F0]">
            <div className="max-w-[1440px] mx-auto">
              <div className="flex justify-between items-end mb-12">
                <div>
                  <div className="mb-4 flex items-center gap-4">
                    <span className="h-px flex-1 max-w-[60px] bg-[#E8E4DF]"></span>
                    <span className="font-mono text-xs uppercase tracking-[0.15em] text-[#B8860B]">Đọc thêm</span>
                  </div>
                  <h2 className="font-serif text-3xl md:text-4xl text-[#1A1A1A]">Bài viết <span className="italic text-[#B8860B]">liên quan</span></h2>
                </div>
                <Link 
                  to="/news"
                  className="font-sans text-sm text-[#6B6B6B] hover:text-[#B8860B] border-b border-[#E8E4DF] hover:border-[#B8860B] pb-1 transition-colors hidden sm:block"
                >
                  Xem tất cả
                </Link>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-12">
                {relatedNews.map((item) => (
                  <Link key={item.id} to={`/news/${item.id}`} className="group cursor-pointer">
                    <div className="aspect-[4/3] overflow-hidden mb-4 bg-[#FAFAF8]">
                      <img 
                        src={getImageUrl(item.thumbnail)}
                        alt={item.title}
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
                        onError={(e) => {
                          e.target.src = 'https://images.unsplash.com/photo-1515562141207-7a88fb7ce338?w=600&h=450&fit=crop';
                        }}
                      />
                    </div>
                    <span className="font-mono text-[10px] tracking-[0.2em] text-[#B8860B] uppercase mb-2 block">
                      {item.category || 'KIẾN THỨC'}
                    </span>
                    <h3 className="font-serif text-lg text-[#1A1A1A] mb-2 leading-snug group-hover:text-[#B8860B] transition-colors line-clamp-2">
                      {item.title}
                    </h3>
                    <p className="text-[#6B6B6B] text-xs font-mono">{formatDate(item.created_at)}</p>
                  </Link>
                ))}
              </div>
            </div>
          </section>
        )}

        {/* Separator */}
        <div className="w-full h-px bg-[#E8E4DF]"></div>
      </main>

      <Footer />
    </div>
  );
};

export default NewsDetail;
