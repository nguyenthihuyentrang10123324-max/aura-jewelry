import { useState, useEffect } from 'react';
import Header from '../components/Header';
import Footer from '../components/Footer';
import { useAuth } from '../context/AuthContext';
import { Link, useNavigate } from 'react-router-dom';
import { authAPI } from '../utils/api';

const Profile = () => {
  const { user, logout, refreshUser } = useAuth();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    phone: '',
    address: '',
    email: ''
  });

  useEffect(() => {
    if (user) {
      setFormData({
        name: user.name || '',
        phone: user.phone || '',
        address: user.address || '',
        email: user.email || ''
      });
    }
  }, [user]);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const res = await authAPI.updateProfile(formData);
      if (res.data.success) {
        await refreshUser();
        setIsEditing(false);
      }
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  const initials = user?.name
    ? user.name.split(' ').map(n => n[0]).join('').slice(0, 2).toUpperCase()
    : 'U';

  return (
    <div className="min-h-screen flex flex-col bg-[#FAFAF8] text-[#1A1A1A] relative overflow-hidden">
      {/* Ambient glow */}
      <div className="pointer-events-none absolute inset-0 overflow-hidden">
        <div className="absolute -top-64 -right-64 w-[500px] h-[500px] bg-[#B8860B]/[0.02] rounded-full blur-3xl"></div>
        <div className="absolute -bottom-64 -left-64 w-[500px] h-[500px] bg-[#B8860B]/[0.02] rounded-full blur-3xl"></div>
      </div>

      <Header />

      {/* Hero Section */}
      <section className="pt-40 pb-16 px-6 md:px-12 relative">
        <div className="max-w-5xl mx-auto">
          {/* Section Label */}
          <div className="mb-8 flex items-center justify-center gap-4">
            <span className="h-px flex-1 max-w-[60px] bg-[#E8E4DF]"></span>
            <span className="font-mono text-[10px] font-medium uppercase tracking-[0.2em] text-[#B8860B]">Tài khoản</span>
            <span className="h-px flex-1 max-w-[60px] bg-[#E8E4DF]"></span>
          </div>
          <h1 className="font-serif text-5xl md:text-6xl text-center tracking-tight leading-[1.05]">
            Hồ sơ cá nhân
          </h1>
          <p className="text-center text-[#6B6B6B] mt-6 max-w-lg mx-auto leading-relaxed text-base">
            Quản lý thông tin và theo dõi hoạt động mua sắm của bạn
          </p>
        </div>
      </section>

      {/* Main Content */}
      <main className="flex-1 pb-32 px-6 md:px-12 relative">
        <div className="max-w-5xl mx-auto">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-16">

            {/* Sidebar */}
            <aside className="lg:col-span-4">
              {/* User Card */}
              <div className="bg-white rounded-lg shadow-[0_4px_20px_rgba(26,26,26,0.05)] overflow-hidden">
                {/* Gold Top Border */}
                <div className="h-[3px] bg-gradient-to-r from-[#B8860B] via-[#D4A84B] to-[#B8860B]"></div>

                <div className="p-10">
                  {/* Avatar */}
                  <div className="flex flex-col items-center text-center mb-10 pb-10 border-b border-[#E8E4DF]">
                    <div className="w-24 h-24 rounded-full bg-gradient-to-br from-[#F5F3F0] to-[#E8E4DF] flex items-center justify-center mb-5 border-2 border-[#B8860B]/20 shadow-inner">
                      <span className="font-serif text-4xl text-[#B8860B] tracking-wide">
                        {initials}
                      </span>
                    </div>
                    <h3 className="font-serif text-2xl mb-1">{user?.name}</h3>
                    <p className="text-sm text-[#6B6B6B]">{user?.email}</p>
                    <span className="mt-4 font-mono text-[9px] uppercase tracking-[0.15em] text-[#B8860B] bg-[#F5F3F0] px-4 py-1.5 rounded-full">
                      Khách hàng
                    </span>
                  </div>

                  {/* Navigation */}
                  <nav className="space-y-2 mb-8">
                    <Link
                      to="/profile"
                      className="flex items-center gap-4 p-4 rounded-lg bg-[#B8860B] text-white transition-all group"
                    >
                      <div className="w-9 h-9 rounded-full bg-white/20 flex items-center justify-center group-hover:bg-white/30 transition-colors">
                        <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                          <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 6a3.75 3.75 0 11-7.5 0 3.75 3.75 0 017.5 0zM4.501 20.118a7.5 7.5 0 0114.998 0A17.933 17.933 0 0112 21.75c-2.676 0-5.216-.584-7.499-1.632z" />
                        </svg>
                      </div>
                      <span className="font-mono text-[10px] uppercase tracking-[0.15em]">Hồ sơ</span>
                    </Link>
                    <Link
                      to="/orders"
                      className="flex items-center gap-4 p-4 rounded-lg text-[#6B6B6B] hover:bg-[#F5F3F0] hover:text-[#1A1A1A] transition-all group"
                    >
                      <div className="w-9 h-9 rounded-full bg-[#F5F3F0] flex items-center justify-center group-hover:bg-[#B8860B]/10 transition-colors">
                        <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                          <path strokeLinecap="round" strokeLinejoin="round" d="M8.25 6.75h12M8.25 12h12m-12 5.25h12M3.75 6.75h.007v.008H3.75V6.75zm.375 0a.375.375 0 11-.75 0 .375.375 0 01.75 0zM3.75 12h.007v.008H3.75V12zm.375 0a.375.375 0 11-.75 0 .375.375 0 01.75 0zm-.375 5.25h.007v.008H3.75v-.008zm.375 0a.375.375 0 11-.75 0 .375.375 0 01.75 0z" />
                        </svg>
                      </div>
                      <span className="font-mono text-[10px] uppercase tracking-[0.15em]">Đơn hàng</span>
                    </Link>
                  </nav>

                  {/* Logout */}
                  <button
                    onClick={handleLogout}
                    className="w-full flex items-center justify-center gap-3 p-4 border border-[#E8E4DF] text-[#6B6B6B] hover:border-[#BA1A1A] hover:text-[#BA1A1A] hover:bg-[#BA1A1A]/5 rounded-lg transition-all font-mono text-[10px] uppercase tracking-[0.15em]"
                  >
                    <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                      <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 9V5.25A2.25 2.25 0 0013.5 3h-6a2.25 2.25 0 00-2.25 2.25v13.5A2.25 2.25 0 007.5 21h6a2.25 2.25 0 002.25-2.25V15M12 9l-3 3m0 0l3 3m-3-3h12.75" />
                    </svg>
                    Đăng xuất
                  </button>
                </div>
              </div>
            </aside>

            {/* Main Content */}
            <div className="lg:col-span-8 space-y-10">

              {/* Profile Information Card */}
              <div className="bg-white rounded-lg shadow-[0_4px_20px_rgba(26,26,26,0.05)] overflow-hidden">
                <div className="h-[3px] bg-gradient-to-r from-[#B8860B] via-[#D4A84B] to-[#B8860B]"></div>
                <div className="p-10 md:p-14">
                  {/* Header */}
                  <div className="flex items-center justify-between pb-8 mb-10 border-b border-[#E8E4DF]">
                    <div>
                      <h2 className="font-serif text-3xl mb-2">Thông tin cá nhân</h2>
                      <p className="text-sm text-[#6B6B6B]">Quản lý thông tin tài khoản của bạn</p>
                    </div>
                    {!isEditing && (
                      <button
                        onClick={() => setIsEditing(true)}
                        className="flex items-center gap-2 px-6 py-3 border border-[#B8860B] text-[#B8860B] font-mono text-[10px] uppercase tracking-[0.15em] hover:bg-[#B8860B] hover:text-white rounded-md transition-all"
                      >
                        <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                          <path strokeLinecap="round" strokeLinejoin="round" d="M16.862 4.487l1.687-1.688a1.875 1.875 0 112.652 2.652L10.582 16.07a4.5 4.5 0 01-1.897 1.13L6 18l.8-2.685a4.5 4.5 0 011.13-1.897l8.932-8.931zm0 0L19.5 7.125M18 14v4.75A2.25 2.25 0 0115.75 21H5.25A2.25 2.25 0 013 18.75V8.25A2.25 2.25 0 015.25 6H10" />
                        </svg>
                        Chỉnh sửa
                      </button>
                    )}
                  </div>

                  {/* Form */}
                  <form onSubmit={handleSubmit}>
                    <div className="space-y-8">
                      {/* Row */}
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                        <div className="space-y-3">
                          <label className="font-mono text-[10px] uppercase tracking-[0.2em] text-[#6B6B6B] block">
                            Họ và tên
                          </label>
                          <div className={`relative ${isEditing ? 'border-b border-[#B8860B]' : 'border-b border-[#E8E4DF]/50'}`}>
                            <input
                              name="name"
                              value={formData.name}
                              onChange={handleChange}
                              disabled={!isEditing}
                              className="w-full bg-transparent py-3 px-0 text-lg outline-none transition-colors disabled:text-[#6B6B6B]"
                              placeholder="Nhập họ và tên"
                              type="text"
                            />
                          </div>
                        </div>
                        <div className="space-y-3">
                          <label className="font-mono text-[10px] uppercase tracking-[0.2em] text-[#6B6B6B] block">
                            Số điện thoại
                          </label>
                          <div className={`relative ${isEditing ? 'border-b border-[#B8860B]' : 'border-b border-[#E8E4DF]/50'}`}>
                            <input
                              name="phone"
                              value={formData.phone}
                              onChange={handleChange}
                              disabled={!isEditing}
                              className="w-full bg-transparent py-3 px-0 text-lg outline-none transition-colors disabled:text-[#6B6B6B]"
                              placeholder="Nhập số điện thoại"
                              type="tel"
                            />
                          </div>
                        </div>
                      </div>

                      {/* Row */}
                      <div className="space-y-3">
                        <label className="font-mono text-[10px] uppercase tracking-[0.2em] text-[#6B6B6B] block">
                          Email
                        </label>
                        <div className={`relative ${isEditing ? 'border-b border-[#B8860B]' : 'border-b border-[#E8E4DF]/50'}`}>
                          <input
                            name="email"
                            value={formData.email}
                            onChange={handleChange}
                            disabled={!isEditing}
                            className="w-full bg-transparent py-3 px-0 text-lg outline-none transition-colors disabled:text-[#6B6B6B]"
                            placeholder="Nhập email"
                            type="email"
                          />
                        </div>
                      </div>

                      {/* Row */}
                      <div className="space-y-3">
                        <label className="font-mono text-[10px] uppercase tracking-[0.2em] text-[#6B6B6B] block">
                          Địa chỉ
                        </label>
                        <div className={`relative ${isEditing ? 'border-b border-[#B8860B]' : 'border-b border-[#E8E4DF]/50'}`}>
                          <input
                            name="address"
                            value={formData.address}
                            onChange={handleChange}
                            disabled={!isEditing}
                            className="w-full bg-transparent py-3 px-0 text-lg outline-none transition-colors disabled:text-[#6B6B6B]"
                            placeholder="Nhập địa chỉ"
                            type="text"
                          />
                        </div>
                      </div>

                      {/* Actions */}
                      {isEditing && (
                        <div className="flex gap-4 pt-6 border-t border-[#E8E4DF]">
                          <button
                            type="submit"
                            disabled={loading}
                            className="px-8 py-4 bg-[#B8860B] text-white font-mono text-[10px] uppercase tracking-[0.15em] hover:bg-[#D4A84B] rounded-md transition-all disabled:opacity-50 shadow-sm"
                          >
                            {loading ? 'Đang lưu...' : 'Lưu thay đổi'}
                          </button>
                          <button
                            type="button"
                            onClick={() => {
                              setIsEditing(false);
                              setFormData({
                                name: user?.name || '',
                                phone: user?.phone || '',
                                address: user?.address || '',
                                email: user?.email || ''
                              });
                            }}
                            className="px-8 py-4 border border-[#E8E4DF] text-[#6B6B6B] font-mono text-[10px] uppercase tracking-[0.15em] hover:border-[#1A1A1A] hover:text-[#1A1A1A] rounded-md transition-all"
                          >
                            Hủy
                          </button>
                        </div>
                      )}
                    </div>
                  </form>
                </div>
              </div>

              {/* Quick Links */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <Link
                  to="/orders"
                  className="group bg-white rounded-lg overflow-hidden shadow-[0_4px_20px_rgba(26,26,26,0.05)] hover:shadow-[0_8px_30px_rgba(26,26,26,0.1)] transition-all"
                >
                  <div className="h-[3px] bg-gradient-to-r from-[#E8E4DF] to-[#E8E4DF] group-hover:from-[#B8860B] group-hover:via-[#D4A84B] group-hover:to-[#B8860B] transition-all"></div>
                  <div className="p-8 flex items-center gap-5">
                    <div className="w-14 h-14 rounded-full bg-[#F5F3F0] group-hover:bg-[#B8860B]/10 flex items-center justify-center transition-colors flex-shrink-0">
                      <svg className="w-6 h-6 text-[#B8860B]" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                        <path strokeLinecap="round" strokeLinejoin="round" d="M8.25 6.75h12M8.25 12h12m-12 5.25h12M3.75 6.75h.007v.008H3.75V6.75zm.375 0a.375.375 0 11-.75 0 .375.375 0 01.75 0zM3.75 12h.007v.008H3.75V12zm.375 0a.375.375 0 11-.75 0 .375.375 0 01.75 0zm-.375 5.25h.007v.008H3.75v-.008zm.375 0a.375.375 0 11-.75 0 .375.375 0 01.75 0z" />
                      </svg>
                    </div>
                    <div className="flex-1">
                      <h4 className="font-serif text-lg mb-1 group-hover:text-[#B8860B] transition-colors">Đơn hàng của tôi</h4>
                      <p className="text-sm text-[#6B6B6B] leading-relaxed">Xem lịch sử và theo dõi đơn hàng</p>
                    </div>
                    <svg className="w-5 h-5 text-[#6B6B6B] group-hover:text-[#B8860B] group-hover:translate-x-1 transition-all flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                      <path strokeLinecap="round" strokeLinejoin="round" d="M13.5 4.5L21 12m0 0l-7.5 7.5M21 12H3" />
                    </svg>
                  </div>
                </Link>

                <Link
                  to="/products"
                  className="group bg-white rounded-lg overflow-hidden shadow-[0_4px_20px_rgba(26,26,26,0.05)] hover:shadow-[0_8px_30px_rgba(26,26,26,0.1)] transition-all"
                >
                  <div className="h-[3px] bg-gradient-to-r from-[#E8E4DF] to-[#E8E4DF] group-hover:from-[#B8860B] group-hover:via-[#D4A84B] group-hover:to-[#B8860B] transition-all"></div>
                  <div className="p-8 flex items-center gap-5">
                    <div className="w-14 h-14 rounded-full bg-[#F5F3F0] group-hover:bg-[#B8860B]/10 flex items-center justify-center transition-colors flex-shrink-0">
                      <svg className="w-6 h-6 text-[#B8860B]" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                        <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 10.5V6a3.75 3.75 0 10-7.5 0v4.5m11.356-1.993l1.263 12c.07.665-.45 1.243-1.119 1.243H4.25a1.125 1.125 0 01-1.12-1.243l1.264-12A1.125 1.125 0 015.513 7.5h12.974c.576 0 1.059.435 1.119 1.007zM8.625 10.5a.375.375 0 11-.75 0 .375.375 0 01.75 0zm7.5 0a.375.375 0 11-.75 0 .375.375 0 01.75 0z" />
                      </svg>
                    </div>
                    <div className="flex-1">
                      <h4 className="font-serif text-lg mb-1 group-hover:text-[#B8860B] transition-colors">Bộ sưu tập</h4>
                      <p className="text-sm text-[#6B6B6B] leading-relaxed">Khám phá thêm trang sức cao cấp</p>
                    </div>
                    <svg className="w-5 h-5 text-[#6B6B6B] group-hover:text-[#B8860B] group-hover:translate-x-1 transition-all flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                      <path strokeLinecap="round" strokeLinejoin="round" d="M13.5 4.5L21 12m0 0l-7.5 7.5M21 12H3" />
                    </svg>
                  </div>
                </Link>
              </div>
            </div>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
};

export default Profile;
