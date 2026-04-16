import { Menu, X } from 'lucide-react';
import { Link } from 'react-router-dom';
import { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { useCart } from '../context/CartContext';

const Header = () => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [productsDropdownOpen, setProductsDropdownOpen] = useState(false);
  const [userDropdownOpen, setUserDropdownOpen] = useState(false);
  const { user, logout } = useAuth();
  const { cart } = useCart();

  const handleLogout = () => {
    logout();
  };

  return (
    <header className="fixed top-0 w-full z-50 bg-[#FAFAF8]/95 backdrop-blur-sm" style={{ borderBottom: '1px solid #E8E4DF' }}>
      <div className="flex justify-between items-center w-full px-6 md:px-12 py-5 max-w-[1920px] mx-auto">
        {/* Brand Logo */}
        <Link 
          to="/" 
          className="text-2xl font-serif tracking-[0.25em] text-[#1A1A1A] hover:text-[#B8860B] transition-colors duration-200"
        >
          AURA
        </Link>

        {/* Navigation Links */}
        <div className="hidden md:flex items-center gap-10">
          <Link 
            to="/" 
            className="font-sans text-sm font-medium tracking-[0.05em] text-[#6B6B6B] hover:text-[#B8860B] transition-colors duration-200"
          >
            Trang chủ
          </Link>
          
          {/* Products Dropdown */}
          <div 
            className="relative"
            onMouseEnter={() => setProductsDropdownOpen(true)}
            onMouseLeave={() => setProductsDropdownOpen(false)}
          >
            <button 
              className={`flex items-center gap-1 font-sans text-sm font-medium tracking-[0.05em] transition-colors duration-200 ${
                productsDropdownOpen ? 'text-[#B8860B]' : 'text-[#6B6B6B] hover:text-[#B8860B]'
              }`}
            >
              Sản phẩm
              <svg className={`w-3 h-3 transition-transform duration-200 ${productsDropdownOpen ? 'rotate-180' : ''}`} fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
              </svg>
            </button>
            
            {/* Dropdown Menu */}
            <div 
              className={`absolute top-full left-0 w-52 bg-white shadow-lg border-t-2 border-[#B8860B] py-2 transition-all duration-200 ${
                productsDropdownOpen ? 'opacity-100 visible translate-y-0' : 'opacity-0 invisible -translate-y-2'
              }`}
            >
              <Link to="/products?category=Nhẫn" className="block px-6 py-3 font-sans text-xs tracking-[0.1em] text-[#6B6B6B] hover:text-[#B8860B] hover:bg-[#F5F3F0] transition-colors">Nhẫn</Link>
              <Link to="/products?category=Dây chuyền" className="block px-6 py-3 font-sans text-xs tracking-[0.1em] text-[#6B6B6B] hover:text-[#B8860B] hover:bg-[#F5F3F0] transition-colors">Dây chuyền</Link>
              <Link to="/products?category=Bông tai" className="block px-6 py-3 font-sans text-xs tracking-[0.1em] text-[#6B6B6B] hover:text-[#B8860B] hover:bg-[#F5F3F0] transition-colors">Bông tai</Link>
              <Link to="/products?category=Lắc tay" className="block px-6 py-3 font-sans text-xs tracking-[0.1em] text-[#6B6B6B] hover:text-[#B8860B] hover:bg-[#F5F3F0] transition-colors">Lắc tay</Link>
              <div className="h-px bg-[#E8E4DF] mx-4 my-2"></div>
              <Link to="/products" className="block px-6 py-3 font-sans text-xs tracking-[0.1em] text-[#B8860B] hover:bg-[#F5F3F0] transition-colors font-medium">Bộ sưu tập</Link>
            </div>
          </div>
          
          <Link to="/news" className="font-sans text-sm font-medium tracking-[0.05em] text-[#6B6B6B] hover:text-[#B8860B] transition-colors duration-200">Tin tức</Link>
          <Link to="/about" className="font-sans text-sm font-medium tracking-[0.05em] text-[#6B6B6B] hover:text-[#B8860B] transition-colors duration-200">Giới thiệu</Link>
          <Link to="/contact" className="font-sans text-sm font-medium tracking-[0.05em] text-[#6B6B6B] hover:text-[#B8860B] transition-colors duration-200">Liên hệ</Link>
        </div>

        {/* Trailing Icons */}
        <div className="flex items-center gap-6">
          <Link to="/cart" className="relative text-[#6B6B6B] hover:text-[#B8860B] transition-colors duration-200">
            <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" />
            </svg>
            {cart.itemCount > 0 && (
              <span className="absolute -top-2 -right-2 w-5 h-5 bg-[#B8860B] text-white text-[10px] rounded-full flex items-center justify-center font-medium">
                {cart.itemCount}
              </span>
            )}
          </Link>
          
          {user ? (
            <div 
              className="relative"
              onMouseEnter={() => setUserDropdownOpen(true)}
              onMouseLeave={() => setUserDropdownOpen(false)}
            >
              <button className={`transition-colors duration-200 ${userDropdownOpen ? 'text-[#B8860B]' : 'text-[#6B6B6B] hover:text-[#B8860B]'}`}>
                <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                </svg>
              </button>
              <div 
                className={`absolute top-full right-0 w-52 bg-white shadow-lg border-t-2 border-[#B8860B] py-2 transition-all duration-200 ${
                  userDropdownOpen ? 'opacity-100 visible translate-y-0' : 'opacity-0 invisible -translate-y-2'
                }`}
              >
                <div className="px-6 py-3 border-b border-[#E8E4DF]">
                  <p className="font-sans text-xs text-[#1A1A1A] font-medium">{user.name}</p>
                  <p className="font-sans text-[10px] text-[#6B6B6B]">{user.email}</p>
                </div>
                <Link to="/profile" className="block px-6 py-3 font-sans text-xs tracking-[0.1em] text-[#6B6B6B] hover:text-[#B8860B] hover:bg-[#F5F3F0] transition-colors">Tài khoản</Link>
                <Link to="/orders" className="block px-6 py-3 font-sans text-xs tracking-[0.1em] text-[#6B6B6B] hover:text-[#B8860B] hover:bg-[#F5F3F0] transition-colors">Đơn hàng</Link>
                {user.role === 'admin' && (
                  <Link to="/admin" className="block px-6 py-3 font-sans text-xs tracking-[0.1em] text-[#B8860B] hover:bg-[#F5F3F0] transition-colors font-medium">Quản lý</Link>
                )}
                <div className="h-px bg-[#E8E4DF] mx-4 my-2"></div>
                <button 
                  onClick={handleLogout} 
                  className="w-full text-left px-6 py-3 font-sans text-xs tracking-[0.1em] text-red-500 hover:bg-red-50 transition-colors"
                >
                  Đăng xuất
                </button>
              </div>
            </div>
          ) : (
            <Link to="/login" className="text-[#6B6B6B] hover:text-[#B8860B] transition-colors duration-200">
              <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
              </svg>
            </Link>
          )}

          {/* Mobile Menu Toggle */}
          <button 
            className="md:hidden text-[#6B6B6B] hover:text-[#B8860B] transition-colors"
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          >
            {mobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
          </button>
        </div>
      </div>

      {/* Mobile Menu */}
      {mobileMenuOpen && (
        <div className="md:hidden bg-white border-t border-[#E8E4DF] px-6 py-6">
          <nav className="flex flex-col gap-4">
            <Link to="/" className="font-sans text-sm font-medium text-[#6B6B6B] hover:text-[#B8860B] py-2 border-b border-[#E8E4DF]">Trang chủ</Link>
            <Link to="/products" className="font-sans text-sm font-medium text-[#6B6B6B] hover:text-[#B8860B] py-2 border-b border-[#E8E4DF]">Sản phẩm</Link>
            <div className="pl-4 flex flex-col gap-2 py-2">
              <Link to="/products?category=Nhẫn" className="font-sans text-xs text-[#6B6B6B] hover:text-[#B8860B]">Nhẫn</Link>
              <Link to="/products?category=Dây chuyền" className="font-sans text-xs text-[#6B6B6B] hover:text-[#B8860B]">Dây chuyền</Link>
              <Link to="/products?category=Bông tai" className="font-sans text-xs text-[#6B6B6B] hover:text-[#B8860B]">Bông tai</Link>
              <Link to="/products?category=Lắc tay" className="font-sans text-xs text-[#6B6B6B] hover:text-[#B8860B]">Lắc tay</Link>
            </div>
            <Link to="/news" className="font-sans text-sm font-medium text-[#6B6B6B] hover:text-[#B8860B] py-2 border-b border-[#E8E4DF]">Tin tức</Link>
            <Link to="/about" className="font-sans text-sm font-medium text-[#6B6B6B] hover:text-[#B8860B] py-2 border-b border-[#E8E4DF]">Giới thiệu</Link>
            <Link to="/contact" className="font-sans text-sm font-medium text-[#6B6B6B] hover:text-[#B8860B] py-2">Liên hệ</Link>
          </nav>
        </div>
      )}
    </header>
  );
};

export default Header;
