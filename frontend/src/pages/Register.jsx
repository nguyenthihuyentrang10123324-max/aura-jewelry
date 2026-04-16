import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import Header from '../components/Header';
import Footer from '../components/Footer';
import { useAuth } from '../context/AuthContext';
import toast from 'react-hot-toast';

const Register = () => {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [phone, setPhone] = useState('');
  const [loading, setLoading] = useState(false);
  const { register } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!name || !email || !password) { toast.error('Vui lòng điền đầy đủ thông tin'); return; }
    try {
      setLoading(true);
      await register({ name, email, password, phone });
      toast.success('Đăng ký thành công!');
      navigate('/');
    } catch (error) {
      toast.error(error.response?.data?.message || 'Đăng ký thất bại');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex flex-col bg-[#FAFAF8] text-[#1A1A1A]">
      <Header />
      <main className="flex-1 flex items-center justify-center py-16 px-6">
        <div className="w-full max-w-md">
          {/* Header */}
          <div className="text-center mb-12">
            <div className="mb-6 flex items-center justify-center gap-4">
              <span className="h-px flex-1 max-w-[60px] bg-[#E8E4DF]"></span>
              <span className="font-mono text-xs font-medium uppercase tracking-[0.15em] text-[#B8860B]">The Atelier</span>
              <span className="h-px flex-1 max-w-[60px] bg-[#E8E4DF]"></span>
            </div>
            <h1 className="font-serif text-4xl md:text-5xl text-[#1A1A1A] mb-3">Tạo tài khoản</h1>
            <p className="font-serif italic text-[#6B6B6B] text-lg">Đăng Ký</p>
          </div>

          {/* Form */}
          <div className="bg-white p-10 md:p-12 shadow-sm border-t-2 border-[#B8860B]">
            <form onSubmit={handleSubmit} className="space-y-8">
              <div>
                <label className="block font-mono text-[10px] uppercase tracking-[0.15em] text-[#6B6B6B] mb-3">
                  Họ và tên *
                </label>
                <input 
                  type="text" 
                  value={name} 
                  onChange={(e) => setName(e.target.value)}
                  placeholder="Nguyễn Văn A"
                  className="w-full bg-transparent border-b border-[#E8E4DF] focus:border-[#B8860B] py-3 font-sans text-sm outline-none transition-colors"
                />
              </div>
              <div>
                <label className="block font-mono text-[10px] uppercase tracking-[0.15em] text-[#6B6B6B] mb-3">
                  Email *
                </label>
                <input 
                  type="email" 
                  value={email} 
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="email@example.com"
                  className="w-full bg-transparent border-b border-[#E8E4DF] focus:border-[#B8860B] py-3 font-sans text-sm outline-none transition-colors"
                />
              </div>
              <div>
                <label className="block font-mono text-[10px] uppercase tracking-[0.15em] text-[#6B6B6B] mb-3">
                  Số điện thoại
                </label>
                <input 
                  type="tel" 
                  value={phone} 
                  onChange={(e) => setPhone(e.target.value)}
                  placeholder="090 123 4567"
                  className="w-full bg-transparent border-b border-[#E8E4DF] focus:border-[#B8860B] py-3 font-sans text-sm outline-none transition-colors"
                />
              </div>
              <div>
                <label className="block font-mono text-[10px] uppercase tracking-[0.15em] text-[#6B6B6B] mb-3">
                  Mật khẩu *
                </label>
                <input 
                  type="password" 
                  value={password} 
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••"
                  className="w-full bg-transparent border-b border-[#E8E4DF] focus:border-[#B8860B] py-3 font-sans text-sm outline-none transition-colors"
                />
              </div>
              <button 
                type="submit" 
                disabled={loading}
                className="w-full py-4 bg-[#B8860B] text-white font-sans font-medium uppercase tracking-[0.1em] text-sm hover:bg-[#D4A84B] hover:-translate-y-0.5 hover:shadow-lg transition-all duration-200 disabled:opacity-50 touch-manipulation"
              >
                {loading ? 'Đang đăng ký...' : 'Tạo tài khoản'}
              </button>
            </form>

            <p className="text-center mt-8 font-sans text-sm text-[#6B6B6B]">
              Đã có tài khoản?{' '}
              <Link to="/login" className="text-[#B8860B] font-medium hover:text-[#D4A84B] transition-colors">
                Đăng nhập
              </Link>
            </p>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default Register;
