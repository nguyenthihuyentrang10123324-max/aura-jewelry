import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';

const AdminLogin = () => {
  const { login } = useAuth();
  const navigate = useNavigate();
  const [formData, setFormData] = useState({ email: '', password: '' });
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!formData.email || !formData.password) {
      setError('Vui lòng nhập đầy đủ email và mật khẩu');
      return;
    }
    setLoading(true);
    setError('');
    try {
      await login(formData.email, formData.password);
      navigate('/admin');
    } catch (err) {
      setError(err.response?.data?.message || 'Đăng nhập thất bại. Vui lòng thử lại.');
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
    if (error) setError('');
  };

  return (
    <div className="min-h-screen flex" style={{ background: 'linear-gradient(135deg, #FFFBEB 0%, #FEF3C7 50%, #FDE68A 100%)' }}>
      {/* Left: Branding */}
      <div className="hidden lg:flex w-1/2 flex-col justify-between p-16 relative overflow-hidden">
        {/* Decorative circles */}
        <div className="absolute -top-20 -left-20 w-72 h-72 rounded-full opacity-20" style={{ background: '#F59E0B' }}></div>
        <div className="absolute -bottom-16 -right-16 w-64 h-64 rounded-full opacity-15" style={{ background: '#FCD34D' }}></div>
        <div className="absolute top-1/3 right-10 w-40 h-40 rounded-full opacity-10" style={{ background: '#F59E0B' }}></div>

        <div className="relative z-10">
          <div className="flex items-center gap-4 mb-16">
            <div
              className="w-16 h-16 rounded-2xl flex items-center justify-center"
              style={{ background: 'linear-gradient(135deg, #1F2937, #374151)' }}
            >
              <span className="font-bold text-3xl text-white" style={{ fontFamily: 'system-ui, -apple-system, "Segoe UI", Roboto, sans-serif', fontWeight: 'bold', color: '#FFFFFF' }}>A</span>
            </div>
            <div>
              <div className="flex items-baseline gap-3">
                <span className="font-bold text-3xl tracking-wider text-white" style={{ fontFamily: 'system-ui, -apple-system, "Segoe UI", Roboto, sans-serif', fontWeight: 'bold', fontSize: '1.5rem', letterSpacing: '0.05em', color: '#1F2937' }}>AURA</span>
                <span className="text-sm px-2 py-1 rounded-lg text-white/60 bg-white/10 font-medium uppercase tracking-widest">Admin</span>
              </div>
              <span className="text-sm text-white/40 tracking-wide">Trang quản trị</span>
            </div>
          </div>

          <h1 className="text-4xl font-bold leading-tight mb-6" style={{ fontFamily: 'system-ui, -apple-system, "Segoe UI", Roboto, sans-serif', fontWeight: 'bold', fontSize: '1.875rem', color: '#1F2937', lineHeight: 1.2 }}>
            Chào mừng trở lại,<br />
            <span style={{ color: '#F59E0B' }}>Quản trị viên</span>
          </h1>
          <p className="text-lg leading-relaxed max-w-md" style={{ color: '#92400E' }}>
            Đăng nhập để truy cập bảng điều khiển và quản lý cửa hàng của bạn.
          </p>
        </div>

        <div className="relative z-10">
          <div className="grid grid-cols-3 gap-6">
            {[
              { value: '1.2K+', label: 'Người dùng' },
              { value: '850+', label: 'Đơn hàng' },
              { value: '320+', label: 'Sản phẩm' },
            ].map((stat, i) => (
              <div key={i} className="text-center p-4 rounded-2xl bg-white/50 backdrop-blur-sm" style={{ border: '1px solid rgba(253,230,138,0.5)' }}>
                <p className="text-2xl font-bold" style={{ fontFamily: 'system-ui, -apple-system, "Segoe UI", Roboto, sans-serif', fontWeight: 'bold', fontSize: '1.5rem', color: '#1F2937' }}>{stat.value}</p>
                <p className="text-xs font-medium" style={{ color: '#92400E' }}>{stat.label}</p>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Right: Login Form */}
      <div className="w-full lg:w-1/2 flex items-center justify-center p-8">
        <div className="w-full max-w-md">
          {/* Mobile logo */}
          <div className="lg:hidden flex items-center gap-3 mb-10 justify-center">
            <div className="w-12 h-12 rounded-xl flex items-center justify-center" style={{ background: 'linear-gradient(135deg, #F59E0B, #FCD34D)' }}>
              <span className="font-bold text-xl" style={{ fontFamily: 'system-ui, -apple-system, "Segoe UI", Roboto, sans-serif', fontWeight: 'bold', color: '#1F2937' }}>A</span>
            </div>
            <span className="font-bold text-2xl tracking-wider" style={{ fontFamily: 'system-ui, -apple-system, "Segoe UI", Roboto, sans-serif', fontWeight: 'bold', letterSpacing: '0.05em', color: '#1F2937' }}>AURA</span>
          </div>

          <div className="text-center lg:text-left mb-8">
            <h2 className="text-3xl font-bold mb-2" style={{ fontFamily: 'system-ui, -apple-system, "Segoe UI", Roboto, sans-serif', fontWeight: 'bold', fontSize: '1.5rem', color: '#1F2937' }}>Đăng nhập</h2>
            <p className="text-sm" style={{ color: '#92400E' }}>Nhập thông tin để tiếp tục</p>
          </div>

          {/* Error */}
          {error && (
            <div className="mb-5 px-4 py-3 rounded-xl flex items-center gap-3 text-sm" style={{ background: '#FEE2E2', color: '#991B1B', border: '1px solid #FECACA' }}>
              <svg className="w-5 h-5 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.75}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M12 9v3.75m-9.303 3.376c-.866 1.5.217 3.374 1.948 3.374h14.71c1.73 0 2.813-1.874 1.948-3.374L13.949 3.378c-.866-1.5-3.032-1.5-3.898 0L2.697 16.126zM12 15.75h.007v.008H12v-.008z" />
              </svg>
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-5">
            {/* Email */}
            <div>
              <label className="block text-sm font-medium mb-2" style={{ color: '#374151' }}>
                Email
              </label>
              <div className="relative">
                <svg className="w-5 h-5 absolute left-4 top-1/2 -translate-y-1/2" style={{ color: '#92400E' }} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.75}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M21.75 6.75v10.5a2.25 2.25 0 01-2.25 2.25h-15a2.25 2.25 0 01-2.25-2.25V6.75m19.5 0A2.25 2.25 0 0019.5 4.5h-15a2.25 2.25 0 00-2.25 2.25m19.5 0v.243a2.25 2.25 0 01-1.07 1.916l-7.5 4.615a2.25 2.25 0 01-2.36 0L3.32 8.91a2.25 2.25 0 01-1.07-1.916V6.75" />
                </svg>
                <input
                  type="email"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  placeholder="admin@aura.vn"
                  autoComplete="email"
                  className="w-full pl-12 pr-4 py-3.5 rounded-xl text-sm"
                  style={{ background: '#FFFFFF', border: '2px solid #FDE68A', color: '#1F2937', outline: 'none' }}
                  onFocus={e => { e.currentTarget.style.borderColor = '#F59E0B'; e.currentTarget.style.boxShadow = '0 0 0 4px rgba(245,158,11,0.1)'; }}
                  onBlur={e => { e.currentTarget.style.borderColor = '#FDE68A'; e.currentTarget.style.boxShadow = 'none'; }}
                />
              </div>
            </div>

            {/* Password */}
            <div>
              <label className="block text-sm font-medium mb-2" style={{ color: '#374151' }}>
                Mật khẩu
              </label>
              <div className="relative">
                <svg className="w-5 h-5 absolute left-4 top-1/2 -translate-y-1/2" style={{ color: '#92400E' }} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.75}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M16.5 10.5V6.75a4.5 4.5 0 10-9 0v3.75m-.75 11.25h10.5a2.25 2.25 0 002.25-2.25v-6.75a2.25 2.25 0 00-2.25-2.25H6.75a2.25 2.25 0 00-2.25 2.25v6.75a2.25 2.25 0 002.25 2.25z" />
                </svg>
                <input
                  type={showPassword ? 'text' : 'password'}
                  name="password"
                  value={formData.password}
                  onChange={handleChange}
                  placeholder="••••••••"
                  autoComplete="current-password"
                  className="w-full pl-12 pr-12 py-3.5 rounded-xl text-sm"
                  style={{ background: '#FFFFFF', border: '2px solid #FDE68A', color: '#1F2937', outline: 'none' }}
                  onFocus={e => { e.currentTarget.style.borderColor = '#F59E0B'; e.currentTarget.style.boxShadow = '0 0 0 4px rgba(245,158,11,0.1)'; }}
                  onBlur={e => { e.currentTarget.style.borderColor = '#FDE68A'; e.currentTarget.style.boxShadow = 'none'; }}
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-4 top-1/2 -translate-y-1/2 p-1"
                  style={{ color: '#92400E' }}
                >
                  {showPassword ? (
                    <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.75}>
                      <path strokeLinecap="round" strokeLinejoin="round" d="M3.98 8.223A10.477 10.477 0 001.934 12C3.226 16.338 7.244 19.5 12 19.5c.993 0 1.953-.138 2.863-.395M6.228 6.228A10.45 10.45 0 0112 4.5c4.756 0 8.773 3.162 10.065 7.498a10.523 10.523 0 01-4.293 5.774M6.228 6.228L3 3m3.228 3.228l3.65 3.65m7.894 7.894L21 21m-3.228-3.228l-3.65-3.65m0 0a3 3 0 10-4.243-4.243m4.242 4.242L9.88 9.88" />
                    </svg>
                  ) : (
                    <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.75}>
                      <path strokeLinecap="round" strokeLinejoin="round" d="M2.036 12.322a1.012 1.012 0 010-.639C3.423 7.51 7.36 4.5 12 4.5c4.638 0 8.573 3.007 9.963 7.178.07.207.07.431 0 .639C20.577 16.49 16.64 19.5 12 19.5c-4.638 0-8.573-3.007-9.963-7.178z" />
                      <path strokeLinecap="round" strokeLinejoin="round" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                    </svg>
                  )}
                </button>
              </div>
            </div>

            {/* Submit */}
            <button
              type="submit"
              disabled={loading}
              className="w-full py-3.5 rounded-xl text-sm font-semibold text-white transition-all duration-200 disabled:opacity-60 disabled:cursor-not-allowed mt-6"
              style={{ background: 'linear-gradient(135deg, #F59E0B, #FCD34D)', boxShadow: '0 4px 16px rgba(245,158,11,0.3)' }}
              onMouseEnter={e => { if (!loading) e.currentTarget.style.transform = 'translateY(-1px)'; e.currentTarget.style.boxShadow = '0 6px 20px rgba(245,158,11,0.4)'; }}
              onMouseLeave={e => { e.currentTarget.style.transform = 'translateY(0)'; e.currentTarget.style.boxShadow = '0 4px 16px rgba(245,158,11,0.3)'; }}
            >
              {loading ? (
                <span className="flex items-center justify-center gap-2">
                  <svg className="w-4 h-4 animate-spin" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z"></path>
                  </svg>
                  Đang đăng nhập...
                </span>
              ) : 'Đăng nhập Admin'}
            </button>
          </form>

          <div className="mt-8 text-center">
            <p className="text-sm" style={{ color: '#92400E' }}>
              Quên mật khẩu?{' '}
              <a href="#" className="font-medium underline underline-offset-2" style={{ color: '#F59E0B' }}>
                Liên hệ quản trị
              </a>
            </p>
          </div>

          <div className="mt-6 text-center">
            <a href="/" className="inline-flex items-center gap-2 text-sm" style={{ color: '#92400E' }}>
              <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.75}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M10.5 19.5L3 12m0 0l7.5-7.5M3 12h18" />
              </svg>
              Quay về trang chủ
            </a>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminLogin;
