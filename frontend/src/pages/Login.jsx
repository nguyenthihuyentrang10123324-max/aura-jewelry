import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import toast from 'react-hot-toast';
import Footer from '../components/Footer';

const Login = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const { login } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!email || !password) { toast.error('Vui lòng điền đầy đủ thông tin'); return; }
    try {
      setLoading(true);
      await login(email, password);
      toast.success('Đăng nhập thành công!');
      navigate('/');
    } catch (error) {
      toast.error(error.response?.data?.message || 'Đăng nhập thất bại');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex flex-col bg-[#FAFAF8]">
      {/* TopNavBar */}
      <header className="fixed top-0 w-full z-50 bg-[#FAFAF8]/95 backdrop-blur-sm" style={{ borderBottom: '1px solid #E8E4DF' }}>
        <div className="flex justify-between items-center w-full px-6 md:px-12 py-5 max-w-[1920px] mx-auto">
          <Link to="/" className="text-2xl font-serif tracking-[0.25em] text-[#1A1A1A] hover:text-[#B8860B] transition-colors">
            AURA
          </Link>
          <div className="hidden md:flex items-center gap-10">
            <Link to="/" className="font-sans text-sm font-medium tracking-[0.05em] text-[#6B6B6B] hover:text-[#B8860B] transition-colors">Trang chủ</Link>
            <Link to="/products" className="font-sans text-sm font-medium tracking-[0.05em] text-[#6B6B6B] hover:text-[#B8860B] transition-colors">Sản phẩm</Link>
            <Link to="/news" className="font-sans text-sm font-medium tracking-[0.05em] text-[#6B6B6B] hover:text-[#B8860B] transition-colors">Tin tức</Link>
            <Link to="/about" className="font-sans text-sm font-medium tracking-[0.05em] text-[#6B6B6B] hover:text-[#B8860B] transition-colors">Giới thiệu</Link>
            <Link to="/contact" className="font-sans text-sm font-medium tracking-[0.05em] text-[#6B6B6B] hover:text-[#B8860B] transition-colors">Liên hệ</Link>
          </div>
          <div className="flex items-center gap-6">
            <Link to="/cart" className="text-[#6B6B6B] hover:text-[#B8860B] transition-colors">
              <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" />
              </svg>
            </Link>
            <Link to="/login" className="text-[#B8860B] transition-colors">
              <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
              </svg>
            </Link>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="flex-1 flex items-center justify-center px-6 pt-28 pb-24">
        <section className="w-full max-w-md">
          {/* Editorial Header */}
          <div className="text-center mb-16">
            <div className="mb-6 flex items-center justify-center gap-4">
              <span className="h-px flex-1 max-w-[60px] bg-[#E8E4DF]"></span>
              <span className="font-mono text-xs font-medium uppercase tracking-[0.15em] text-[#B8860B]">The Atelier</span>
              <span className="h-px flex-1 max-w-[60px] bg-[#E8E4DF]"></span>
            </div>
            <h1 className="font-serif text-4xl md:text-5xl text-[#1A1A1A] mb-3">Chào mừng trở lại</h1>
            <p className="font-serif italic text-[#6B6B6B] text-lg">Đăng Nhập</p>
          </div>

          {/* Login Form */}
          <form onSubmit={handleSubmit} className="space-y-10">
            {/* Email Field */}
            <div className="relative">
              <label className="block font-mono text-[10px] tracking-[0.15em] uppercase text-[#6B6B6B] mb-3" htmlFor="email">
                Địa chỉ Email
              </label>
              <input
                className="w-full bg-transparent border-0 border-b border-[#E8E4DF] focus:border-[#B8860B] py-3 font-sans text-sm tracking-wide placeholder:text-[#6B6B6B]/40 outline-none transition-colors"
                id="email"
                name="email"
                placeholder="email@example.com"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />
            </div>

            {/* Password Field */}
            <div className="relative">
              <div className="flex justify-between items-end mb-3">
                <label className="block font-mono text-[10px] tracking-[0.15em] uppercase text-[#6B6B6B]" htmlFor="password">
                  Mật khẩu
                </label>
                <a className="font-mono text-[10px] tracking-[0.1em] uppercase text-[#6B6B6B]/60 hover:text-[#B8860B] transition-colors" href="#">
                  Quên mật khẩu?
                </a>
              </div>
              <input
                className="w-full bg-transparent border-0 border-b border-[#E8E4DF] focus:border-[#B8860B] py-3 font-sans text-sm tracking-wide placeholder:text-[#6B6B6B]/40 outline-none transition-colors"
                id="password"
                name="password"
                placeholder="••••••••"
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
              />
            </div>

            {/* Action Button */}
            <div className="pt-6">
              <button
                type="submit"
                disabled={loading}
                className="w-full bg-[#B8860B] text-white py-5 font-sans font-medium tracking-[0.1em] uppercase text-sm hover:bg-[#D4A84B] hover:-translate-y-0.5 hover:shadow-lg active:scale-[0.99] transition-all duration-200 disabled:opacity-50 touch-manipulation"
              >
                {loading ? 'Đang đăng nhập...' : 'Đăng nhập'}
              </button>
            </div>

            {/* Divider */}
            <div className="relative flex items-center py-4">
              <div className="flex-grow border-t border-[#E8E4DF]"></div>
              <span className="flex-shrink mx-4 font-mono text-[10px] tracking-[0.15em] uppercase text-[#6B6B6B]/60">Hoặc</span>
              <div className="flex-grow border-t border-[#E8E4DF]"></div>
            </div>

            {/* Social Logins */}
            <div className="grid grid-cols-2 gap-4">
              <button className="flex items-center justify-center gap-3 py-4 border border-[#E8E4DF] hover:bg-[#F5F3F0] transition-colors duration-200" type="button">
                <svg className="w-5 h-5" viewBox="0 0 24 24">
                  <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
                  <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
                  <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/>
                  <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
                </svg>
                <span className="font-sans text-xs tracking-[0.1em] uppercase text-[#1A1A1A]">Google</span>
              </button>
              <button className="flex items-center justify-center gap-3 py-4 border border-[#E8E4DF] hover:bg-[#F5F3F0] transition-colors duration-200" type="button">
                <svg className="w-5 h-5 text-[#1877F2]" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/>
                </svg>
                <span className="font-sans text-xs tracking-[0.1em] uppercase text-[#1A1A1A]">Facebook</span>
              </button>
            </div>
          </form>

          {/* Secondary Action */}
          <div className="mt-12 text-center">
            <p className="font-sans text-sm text-[#6B6B6B] tracking-wide">
              Chưa có tài khoản?
              <Link to="/register" className="text-[#B8860B] font-medium hover:text-[#D4A84B] transition-colors ml-2">Đăng ký ngay</Link>
            </p>
          </div>
        </section>
      </main>

      {/* Visual Element */}
      <div className="fixed top-1/2 -right-24 -translate-y-1/2 w-96 h-[600px] opacity-[0.03] pointer-events-none select-none overflow-hidden hidden lg:block">
        <img className="w-full h-full object-cover grayscale" alt="Luxury jewelry" src="https://images.unsplash.com/photo-1515562141207-7a88fb7ce338?w=800"/>
      </div>

      <Footer />
    </div>
  );
};

export default Login;
