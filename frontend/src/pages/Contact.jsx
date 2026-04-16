import { useState } from 'react';
import Header from '../components/Header';
import Footer from '../components/Footer';
import { contactAPI } from '../utils/api';
import toast from 'react-hot-toast';

const Contact = () => {
  const [form, setForm] = useState({ name: '', email: '', phone: '', message: '' });
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      setLoading(true);
      const res = await contactAPI.sendContact(form);
      if (res.data.success) {
        toast.success('Gửi liên hệ thành công! Chúng tôi sẽ liên hệ sớm nhất.');
        setForm({ name: '', email: '', phone: '', message: '' });
      }
    } catch (error) {
      toast.error(error.response?.data?.message || 'Gửi thất bại. Vui lòng thử lại.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex flex-col bg-[#FAFAF8] text-[#1A1A1A]">
      <Header />

      <main className="flex-1 pt-[72px]">
        {/* Hero Header */}
        <section className="relative h-[50vh] min-h-[400px] w-full flex items-center justify-center overflow-hidden bg-[#1A1A1A]">
          <div className="absolute inset-0 opacity-40">
            <img 
              className="w-full h-full object-cover" 
              src="https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=1920&h=1080&fit=crop" 
              alt="Jewelry atelier"
            />
          </div>
          <div className="relative z-10 text-center px-6">
            <div className="mb-6 flex items-center justify-center gap-4">
              <span className="h-px flex-1 max-w-[80px] bg-white/30"></span>
              <span className="font-mono text-xs font-medium uppercase tracking-[0.3em] text-[#B8860B]">
                Kết nối
              </span>
              <span className="h-px flex-1 max-w-[80px] bg-white/30"></span>
            </div>
            <h1 className="font-serif text-5xl md:text-6xl lg:text-7xl text-white mb-6">
              Liên Hệ
            </h1>
            <div className="w-16 h-px bg-[#B8860B] mx-auto"></div>
          </div>
        </section>

        {/* Content Section */}
        <section className="max-w-[1440px] mx-auto px-6 md:px-12 py-16 md:py-24">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-24">
            {/* Contact Information */}
            <div className="lg:col-span-5 space-y-12 md:space-y-16">
              {/* Showrooms */}
              <div>
                <div className="mb-6 flex items-center gap-4">
                  <span className="h-px flex-1 max-w-[60px] bg-[#E8E4DF]"></span>
                  <span className="font-mono text-xs font-medium uppercase tracking-[0.15em] text-[#B8860B]">
                    Showroom
                  </span>
                </div>
                <h2 className="font-serif text-3xl md:text-4xl text-[#1A1A1A] mb-10">Hệ thống <span className="italic text-[#B8860B]">cửa hàng</span></h2>
                
                <div className="space-y-10">
                  {/* Showroom Hanoi */}
                  <div className="bg-white p-8 border-t-2 border-[#B8860B]">
                    <span className="font-mono text-[10px] uppercase tracking-[0.2em] text-[#B8860B] mb-4 block">Flagship Hà Nội</span>
                    <p className="font-serif text-xl text-[#1A1A1A] mb-3">Số 15 Tràng Tiền, Quận Hoàn Kiếm</p>
                    <p className="font-sans text-sm text-[#6B6B6B] font-light mb-2">08:30 – 21:00 | Thứ Hai – Chủ Nhật</p>
                    <p className="font-sans text-sm text-[#6B6B6B] font-light">+84 24 3934 1234</p>
                  </div>

                  {/* Showroom HCM */}
                  <div className="bg-white p-8 border-t-2 border-[#B8860B]">
                    <span className="font-mono text-[10px] uppercase tracking-[0.2em] text-[#B8860B] mb-4 block">Boutique TP. Hồ Chí Minh</span>
                    <p className="font-serif text-xl text-[#1A1A1A] mb-3">Lầu 1, Continental Hotel, 132 Đồng Khởi</p>
                    <p className="font-sans text-sm text-[#6B6B6B] font-light mb-2">09:00 – 21:30 | Thứ Hai – Chủ Nhật</p>
                    <p className="font-sans text-sm text-[#6B6B6B] font-light">+84 28 3823 5678</p>
                  </div>
                </div>
              </div>

              {/* Online Consultation */}
              <div className="pt-8 border-t border-[#E8E4DF]">
                <div className="mb-6 flex items-center gap-4">
                  <span className="h-px flex-1 max-w-[60px] bg-[#E8E4DF]"></span>
                  <span className="font-mono text-xs font-medium uppercase tracking-[0.15em] text-[#B8860B]">
                    Tư vấn
                  </span>
                </div>
                <h2 className="font-serif text-3xl md:text-4xl text-[#1A1A1A] mb-10">Liên hệ <span className="italic text-[#B8860B]">trực tuyến</span></h2>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="bg-white p-6 border-t border-[#E8E4DF]">
                    <svg className="w-8 h-8 text-[#B8860B] mb-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
                    </svg>
                    <h4 className="font-serif text-lg text-[#1A1A1A] mb-2">Hotline 24/7</h4>
                    <p className="font-sans text-sm text-[#6B6B6B] font-light">1900 6789</p>
                  </div>

                  <div className="bg-white p-6 border-t border-[#E8E4DF]">
                    <svg className="w-8 h-8 text-[#B8860B] mb-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
                    </svg>
                    <h4 className="font-serif text-lg text-[#1A1A1A] mb-2">Zalo OA</h4>
                    <p className="font-sans text-sm text-[#6B6B6B] font-light">AURA Fine Jewelry</p>
                  </div>

                  <div className="bg-white p-6 border-t border-[#E8E4DF] md:col-span-2">
                    <svg className="w-8 h-8 text-[#B8860B] mb-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                    </svg>
                    <h4 className="font-serif text-lg text-[#1A1A1A] mb-2">Email Support</h4>
                    <p className="font-sans text-sm text-[#B8860B]">concierge@aura.vn</p>
                  </div>
                </div>
              </div>
            </div>

            {/* Contact Form */}
            <div className="lg:col-span-7 bg-white p-10 md:p-12 lg:p-16 border-t-2 border-[#B8860B]">
              <div className="mb-6 flex items-center gap-4">
                <span className="h-px flex-1 max-w-[60px] bg-[#E8E4DF]"></span>
                <span className="font-mono text-xs font-medium uppercase tracking-[0.15em] text-[#B8860B]">
                  Liên hệ
                </span>
              </div>
              <h2 className="font-serif text-3xl md:text-4xl text-[#1A1A1A] mb-6">Gửi yêu cầu <span className="italic text-[#B8860B]">tư vấn</span></h2>
              <p className="text-[#6B6B6B] font-light leading-relaxed mb-10">
                Quý khách vui lòng để lại thông tin, đội ngũ chuyên viên của AURA sẽ liên hệ sớm nhất để hỗ trợ.
              </p>

              <form onSubmit={handleSubmit} className="space-y-8">
                <div>
                  <label className="block font-mono text-[10px] uppercase tracking-[0.15em] text-[#B8860B] mb-3">
                    Họ tên
                  </label>
                  <input
                    type="text"
                    name="name"
                    value={form.name}
                    onChange={handleChange}
                    placeholder="Nguyễn Văn A"
                    required
                    className="w-full bg-transparent border-b border-[#E8E4DF] py-3 focus:border-[#B8860B] outline-none font-sans text-sm placeholder:text-[#6B6B6B]/40 transition-colors"
                  />
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                  <div>
                    <label className="block font-mono text-[10px] uppercase tracking-[0.15em] text-[#B8860B] mb-3">
                      Số điện thoại
                    </label>
                    <input
                      type="tel"
                      name="phone"
                      value={form.phone}
                      onChange={handleChange}
                      placeholder="090 123 4567"
                      className="w-full bg-transparent border-b border-[#E8E4DF] py-3 focus:border-[#B8860B] outline-none font-sans text-sm placeholder:text-[#6B6B6B]/40 transition-colors"
                    />
                  </div>

                  <div>
                    <label className="block font-mono text-[10px] uppercase tracking-[0.15em] text-[#B8860B] mb-3">
                      Email
                    </label>
                    <input
                      type="email"
                      name="email"
                      value={form.email}
                      onChange={handleChange}
                      placeholder="khachhang@email.com"
                      required
                      className="w-full bg-transparent border-b border-[#E8E4DF] py-3 focus:border-[#B8860B] outline-none font-sans text-sm placeholder:text-[#6B6B6B]/40 transition-colors"
                    />
                  </div>
                </div>

                <div>
                  <label className="block font-mono text-[10px] uppercase tracking-[0.15em] text-[#B8860B] mb-3">
                    Lời nhắn
                  </label>
                  <textarea
                    name="message"
                    value={form.message}
                    onChange={handleChange}
                    placeholder="Quý khách đang quan tâm đến bộ sưu tập nào?"
                    rows="4"
                    required
                    className="w-full bg-transparent border-b border-[#E8E4DF] py-3 focus:border-[#B8860B] outline-none font-sans text-sm placeholder:text-[#6B6B6B]/40 transition-colors resize-none"
                  />
                </div>

                <div className="pt-4">
                  <button
                    type="submit"
                    disabled={loading}
                    className="px-12 md:px-16 py-4 bg-[#B8860B] text-white font-sans font-medium uppercase tracking-[0.1em] text-sm hover:bg-[#D4A84B] hover:-translate-y-0.5 hover:shadow-lg transition-all duration-200 disabled:opacity-50 touch-manipulation"
                  >
                    {loading ? 'Đang gửi...' : 'Gửi yêu cầu'}
                  </button>
                </div>
              </form>
            </div>
          </div>
        </section>

        {/* Bespoke CTA */}
        <section className="py-24 md:py-36 px-6 bg-[#1A1A1A]">
          <div className="max-w-[1440px] mx-auto flex flex-col md:flex-row items-center justify-between gap-12">
            <div className="text-center md:text-left">
              <div className="mb-6 flex items-center gap-4">
                <span className="h-px flex-1 max-w-[60px] bg-white/20 hidden md:block"></span>
                <span className="font-mono text-xs font-medium uppercase tracking-[0.15em] text-[#B8860B]">
                  Bespoke
                </span>
              </div>
              <h2 className="font-serif text-3xl md:text-5xl text-white mb-6">
                Tuyệt tác dành riêng <span className="italic text-[#B8860B]">cho Quý khách</span>
              </h2>
              <p className="text-white/60 font-light text-lg max-w-xl leading-relaxed">
                Hãy để chúng tôi cùng Quý khách hiện thực hóa những ý tưởng trang sức độc bản.
              </p>
            </div>
            <button className="px-12 py-4 border border-white/30 text-white font-sans font-medium uppercase tracking-[0.1em] text-sm hover:bg-white hover:text-[#1A1A1A] transition-all duration-200 whitespace-nowrap">
              Đặt lịch hẹn Bespoke
            </button>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
};

export default Contact;
