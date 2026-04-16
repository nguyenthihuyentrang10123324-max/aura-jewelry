import { useState, useEffect } from 'react';
import { Link, Outlet, useLocation, useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';

const AdminLayout = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const [collapsed, setCollapsed] = useState(false);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    if (user && user.role !== 'admin') navigate('/admin/login');
  }, [user, navigate]);

  const menuItems = [
    {
      path: '/admin',
      label: 'Tổng quan',
      exact: true,
      icon: (
        <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.75}>
          <path strokeLinecap="round" strokeLinejoin="round" d="M3.75 6A2.25 2.25 0 016 3.75h2.25A2.25 2.25 0 0110.5 6v2.25a2.25 2.25 0 01-2.25 2.25H6a2.25 2.25 0 01-2.25-2.25V6zM3.75 15.75A2.25 2.25 0 016 13.5h2.25a2.25 2.25 0 012.25 2.25V18a2.25 2.25 0 01-2.25 2.25H6A2.25 2.25 0 013.75 18v-2.25zM13.5 6a2.25 2.25 0 012.25-2.25H18A2.25 2.25 0 0120.25 6v2.25A2.25 2.25 0 0118 10.5h-2.25a2.25 2.25 0 01-2.25-2.25V6zM13.5 15.75a2.25 2.25 0 012.25-2.25H18a2.25 2.25 0 012.25 2.25V18A2.25 2.25 0 0118 20.25h-2.25A2.25 2.25 0 0113.5 18v-2.25z" />
        </svg>
      )
    },
    {
      path: '/admin/orders',
      label: 'Đơn hàng',
      icon: (
        <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.75}>
          <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 10.5V6a3.75 3.75 0 10-7.5 0v4.5m11.356-1.993l1.263 12c.07.665-.45 1.243-1.119 1.243H4.25a1.125 1.125 0 01-1.12-1.243l1.264-12A1.125 1.125 0 015.513 7.5h12.974c.576 0 1.059.435 1.119 1.007zM8.625 10.5a.375.375 0 11-.75 0 .375.375 0 01.75 0zm7.5 0a.375.375 0 11-.75 0 .375.375 0 01.75 0z" />
        </svg>
      )
    },
    {
      path: '/admin/products',
      label: 'Sản phẩm',
      icon: (
        <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
          <path strokeLinecap="round" strokeLinejoin="round" d="M20.25 7.5l-.625 10.632a2.25 2.25 0 01-2.247 2.118H6.622a2.25 2.25 0 01-2.247-2.118L3.75 7.5M10 11.25h4M3.375 7.5h17.25c.621 0 1.125-.504 1.125-1.125v-1.5c0-.621-.504-1.125-1.125-1.125H3.375c-.621 0-1.125.504-1.125 1.125v1.5c0 .621.504 1.125 1.125 1.125z" />
        </svg>
      )
    },
    {
      path: '/admin/news',
      label: 'Tin tức',
      icon: (
        <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.75}>
          <path strokeLinecap="round" strokeLinejoin="round" d="M19.5 14.25v-2.625a3.375 3.375 0 00-3.375-3.375h-1.5A1.125 1.125 0 0113.5 7.125v-1.5a3.375 3.375 0 00-3.375-3.375H8.25m0 12.75h7.5m-7.5 3H12M10.5 2.25H5.625c-.621 0-1.125.504-1.125 1.125v17.25c0 .621.504 1.125 1.125 1.125h12.75c.621 0 1.125-.504 1.125-1.125V11.25a9 9 0 00-9-9z" />
        </svg>
      )
    },
    {
      path: '/admin/users',
      label: 'Người dùng',
      icon: (
        <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.75}>
          <path strokeLinecap="round" strokeLinejoin="round" d="M15 19.128a9.38 9.38 0 002.625.372 9.337 9.337 0 004.121-.952 4.125 4.125 0 00-7.533-2.493M15 19.128v-.003c0-1.113-.285-2.16-.786-3.07M15 19.128v.106A12.318 12.318 0 018.624 21c-2.331 0-4.512-.645-6.374-1.766l-.001-.109a6.375 6.375 0 0111.964-3.07M12 6.375a3.375 3.375 0 11-6.75 0 3.375 3.375 0 016.75 0zm8.25 2.25a2.25 2.25 0 11-4.5 0 2.25 2.25 0 014.5 0z" />
        </svg>
      )
    },
    {
      path: '/admin/contacts',
      label: 'Liên hệ',
      icon: (
        <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.75}>
          <path strokeLinecap="round" strokeLinejoin="round" d="M21.75 6.75v10.5a2.25 2.25 0 01-2.25 2.25h-15a2.25 2.25 0 01-2.25-2.25V6.75m19.5 0A2.25 2.25 0 0019.5 4.5h-15a2.25 2.25 0 00-2.25 2.25m19.5 0v.243a2.25 2.25 0 01-1.07 1.916l-7.5 4.615a2.25 2.25 0 01-2.36 0L3.32 8.91a2.25 2.25 0 01-1.07-1.916V6.75" />
        </svg>
      )
    }
  ];

  const isActive = (item) => {
    if (item.exact) return location.pathname === item.path;
    return location.pathname.startsWith(item.path);
  };

  const getPageTitle = () => {
    const item = menuItems.find(m =>
      m.exact ? location.pathname === m.path : location.pathname.startsWith(m.path)
    );
    return item?.label || 'Admin';
  };

  const initials = user?.name
    ? user.name.split(' ').map(n => n[0]).join('').slice(0, 2).toUpperCase()
    : 'AD';

  const now = new Date();
  const timeStr = now.toLocaleTimeString('vi-VN', { hour: '2-digit', minute: '2-digit' });
  const dateStr = now.toLocaleDateString('vi-VN', { day: '2-digit', month: 'short', year: 'numeric' });

  return (
    <div className="min-h-screen" style={{ background: '#FFFBEB' }}>
      {/* Sidebar */}
      <aside
        className={`fixed top-0 left-0 h-screen flex flex-col z-50 transition-all duration-300 ${
          collapsed ? 'w-[220px]' : 'w-[240px]'
        }`}
        style={{
          background: 'linear-gradient(180deg, #1E293B 0%, #334155 100%)',
          boxShadow: '4px 0 24px rgba(0,0,0,0.15)',
        }}
      >
        {/* Logo */}
        <div className="h-[72px] flex items-center px-6 border-b border-white/10">
          <Link to="/" className="flex items-center gap-3">
            <div
              className="w-10 h-10 rounded-xl flex items-center justify-center"
              style={{ background: 'linear-gradient(135deg, #F59E0B, #FCD34D)' }}
            >
              <span className="font-bold text-lg" style={{ color: '#1F2937', fontFamily: 'system-ui, -apple-system, "Segoe UI", Roboto, sans-serif' }}>A</span>
            </div>
            {!collapsed && (
              <div>
                <div className="flex items-baseline gap-2">
                  <span className="font-bold text-lg tracking-wider text-white" style={{ fontFamily: 'system-ui, -apple-system, "Segoe UI", Roboto, sans-serif', fontWeight: 'bold', fontSize: '1.125rem', color: '#1F2937' }}>AURA</span>
                  <span className="text-[9px] px-1.5 py-0.5 rounded text-white/50 bg-white/10 font-medium uppercase tracking-widest">Admin</span>
                </div>
                <span className="text-[10px] text-white/30 tracking-wide">Bảng điều khiển</span>
              </div>
            )}
          </Link>
        </div>

        {/* Nav */}
        <nav className="flex-1 py-5 px-3 space-y-1 overflow-y-auto">
          {menuItems.map((item) => {
            const active = isActive(item);
            return (
              <Link
                key={item.path}
                to={item.path}
                title={collapsed ? item.label : ''}
                className={`group flex items-center gap-3 px-4 py-3 rounded-xl transition-all duration-200 ${
                  active
                    ? 'text-white'
                    : 'text-white/50 hover:text-white hover:bg-white/5'
                }`}
                style={active ? {
                  background: 'linear-gradient(135deg, rgba(245,158,11,0.3), rgba(252,211,77,0.15))'
                } : {}}
              >
                <span className={`flex-shrink-0 ${active ? 'scale-110' : 'group-hover:scale-105'} transition-transform duration-200`}>
                  {item.icon}
                </span>
                {!collapsed && (
                  <span className="text-sm font-medium">{item.label}</span>
                )}
                {active && !collapsed && (
                  <span className="ml-auto w-1.5 h-1.5 rounded-full" style={{ background: '#F59E0B' }}></span>
                )}
              </Link>
            );
          })}
        </nav>

        {/* User */}
        <div className="p-3 border-t border-white/10">
          <div className={`flex items-center gap-3 px-3 py-3 rounded-xl ${!collapsed ? '' : 'justify-center'}`}>
            <div
              className="w-9 h-9 rounded-xl flex items-center justify-center flex-shrink-0"
              style={{ background: 'linear-gradient(135deg, #F59E0B, #FCD34D)' }}
            >
              <span className="text-xs font-bold" style={{ color: '#1F2937' }}>{initials}</span>
            </div>
            {!collapsed && (
              <div className="flex-1 min-w-0">
                <p className="text-sm font-medium text-white truncate">{user?.name}</p>
                <p className="text-[10px] text-white/40">Quản trị viên</p>
              </div>
            )}
          </div>

          <button
            onClick={() => { logout(); navigate('/'); }}
            className={`w-full flex items-center gap-3 px-3 py-3 rounded-xl text-white/40 hover:text-white hover:bg-white/5 transition-all duration-200 ${!collapsed ? '' : 'justify-center'}`}
          >
            <svg className="w-5 h-5 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.75}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 9V5.25A2.25 2.25 0 0013.5 3h-6a2.25 2.25 0 00-2.25 2.25v13.5A2.25 2.25 0 007.5 21h6a2.25 2.25 0 002.25-2.25V15M12 9l-3 3m0 0l3 3m-3-3h12.75" />
            </svg>
            {(!collapsed) && <span className="text-sm font-medium">Đăng xuất</span>}
          </button>
        </div>

        {/* Collapse toggle */}
        <button
          onClick={() => setCollapsed(!collapsed)}
          className="absolute -right-3 top-[88px] w-6 h-6 rounded-full flex items-center justify-center transition-all duration-200 hover:scale-110"
          style={{ background: '#FFFBEB', boxShadow: '0 2px 8px rgba(0,0,0,0.15)', border: '2px solid #FDE68A' }}
        >
          <svg
            className={`w-3 h-3 transition-transform duration-300 ${collapsed ? 'rotate-180' : ''}`}
            fill="none" viewBox="0 0 24 24" stroke="#F59E0B" strokeWidth={2.5}
          >
            <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 19.5L8.25 12l7.5-7.5" />
          </svg>
        </button>
      </aside>

      {/* Main Content */}
      <div className={`${collapsed ? 'ml-[220px]' : 'ml-[240px]'} transition-all duration-300`}>
        {/* Topbar */}
        <header
          className="sticky top-0 z-40 flex items-center justify-between px-8 h-[72px]"
          style={{
            background: 'rgba(255,251,235,0.92)',
            backdropFilter: 'blur(12px)',
            borderBottom: '1px solid #FDE68A',
          }}
        >
          <div className="flex items-center gap-3">
            <div>
              <div className="flex items-center gap-2 text-sm" style={{ color: '#92400E' }}>
                <span className="font-medium">Admin</span>
                <svg className="w-3 h-3" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M8.25 4.5l7.5 7.5-7.5 7.5" />
                </svg>
                <span style={{ color: '#1F2937', fontWeight: 600 }}>{getPageTitle()}</span>
              </div>
            </div>
          </div>

          <div className="flex items-center gap-3">
            {/* Date */}
            <div className="hidden xl:flex items-center gap-2 px-4 py-2 rounded-xl text-sm" style={{ background: '#FEF3C7', color: '#92400E' }}>
              <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.75}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M6.75 3v2.25M17.25 3v2.25M3 18.75V7.5a2.25 2.25 0 012.25-2.25h13.5A2.25 2.25 0 0121 7.5v11.25m-18 0A2.25 2.25 0 005.25 21h13.5A2.25 2.25 0 0021 18.75m-18 0v-7.5A2.25 2.25 0 015.25 9h13.5A2.25 2.25 0 0121 11.25v7.5" />
              </svg>
              <span className="text-xs font-medium">{dateStr}</span>
            </div>

            {/* Notifications */}
            <button
              className="relative p-2.5 rounded-xl transition-all duration-200 hover:scale-105"
              style={{ background: '#FEF3C7', border: '1px solid #FDE68A' }}
            >
              <svg className="w-5 h-5" style={{ color: '#F59E0B' }} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.75}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M14.857 17.082a23.848 23.848 0 005.454-1.31A8.967 8.967 0 0118 9.75v-.7V9A6 6 0 006 9v.75a8.967 8.967 0 01-2.312 6.022c1.733.64 3.56 1.085 5.455 1.31m5.714 0a24.255 24.255 0 01-5.714 0m5.714 0a3 3 0 11-5.714 0" />
              </svg>
              <span className="absolute top-2 right-2 w-2 h-2 rounded-full" style={{ background: '#F59E0B', border: '2px solid #FFFBEB' }}></span>
            </button>

            {/* Avatar */}
            <div className="flex items-center gap-3 pl-3" style={{ borderLeft: '1px solid #FDE68A' }}>
              <div className="hidden sm:block text-right">
                <p className="text-sm font-semibold" style={{ color: '#1F2937' }}>{user?.name}</p>
                <p className="text-[11px]" style={{ color: '#92400E' }}>Admin Panel</p>
              </div>
              <div
                className="w-10 h-10 rounded-xl flex items-center justify-center"
                style={{ background: 'linear-gradient(135deg, #F59E0B, #FCD34D)' }}
              >
                <span className="text-xs font-bold" style={{ color: '#1F2937' }}>{initials}</span>
              </div>
            </div>
          </div>
        </header>

        {/* Page Content */}
        <main className="p-8">
          <Outlet />
        </main>
      </div>
    </div>
  );
};

export default AdminLayout;
