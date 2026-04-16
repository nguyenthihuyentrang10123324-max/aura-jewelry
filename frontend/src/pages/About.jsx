import Header from '../components/Header';
import Footer from '../components/Footer';

const About = () => {
  return (
    <div className="min-h-screen flex flex-col bg-[#FAFAF8] text-[#1A1A1A]">
      <Header />

      <main className="flex-1 pt-0">
        {/* Hero Section */}
        <section className="relative min-h-[85vh] flex items-center overflow-hidden">
          {/* Ambient glow */}
          <div className="absolute top-1/4 -right-32 w-96 h-96 bg-[#B8860B] rounded-full opacity-[0.02] blur-3xl"></div>

          <div className="container mx-auto px-6 md:px-12 py-24">
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-16 items-center">
              {/* Text Content */}
              <div className="lg:col-span-6 z-10">
                <div className="mb-6 flex items-center gap-4">
                  <span className="h-px flex-1 bg-[#E8E4DF]"></span>
                  <span className="font-mono text-xs font-medium uppercase tracking-[0.15em] text-[#B8860B]">
                    Khởi nguồn di sản
                  </span>
                </div>

                <h1 className="text-4xl md:text-5xl lg:text-7xl font-serif leading-[1.1] tracking-tight text-[#1A1A1A] mb-8">
                  Câu chuyện của <span className="italic text-[#B8860B]">AURA</span>
                </h1>

                <p className="text-lg text-[#6B6B6B] leading-[1.75] tracking-[0.01em] mb-10 max-w-lg">
                  Tại AURA, chúng tôi không chỉ tạo ra trang sức; chúng tôi kiến tạo những tác phẩm nghệ thuật tôn vinh vẻ đẹp độc bản của mỗi cá nhân, mang theo sứ mệnh kết nối tâm hồn và sự vĩnh cửu.
                </p>

                <a
                  href="/products"
                  className="inline-flex items-center gap-3 bg-[#B8860B] text-white px-10 py-4 font-sans font-medium tracking-[0.05em] text-sm rounded-md shadow-sm hover:bg-[#D4A84B] hover:-translate-y-0.5 hover:shadow-md transition-all duration-200 touch-manipulation"
                >
                  Khám phá bộ sưu tập
                </a>
              </div>

              {/* Image with Quote Overlay */}
              <div className="lg:col-span-6 relative">
                <img
                  className="w-full h-[500px] md:h-[650px] object-cover shadow-lg grayscale hover:grayscale-0 transition-all duration-1000"
                  src="https://images.unsplash.com/photo-1617038260897-41a1f14a8ca0?w=800&h=1000&fit=crop"
                  alt="Nghệ nhân kim hoàn đang chế tác"
                />

                {/* Quote Card - overlaps image */}
                <div className="absolute -bottom-8 -left-8 md:-left-12 bg-white p-8 md:p-10 shadow-lg border-t-2 border-[#B8860B] max-w-sm z-10">
                  <span className="font-serif text-5xl text-[#B8860B] opacity-30 leading-none block mb-2">"</span>
                  <p className="italic text-[#1A1A1A] text-base leading-relaxed">
                    Mỗi viên đá quý đều mang một linh hồn, và người thợ kim hoàn là người đánh thức nó.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Section Divider */}
        <div className="h-px bg-[#E8E4DF]"></div>

        {/* Heritage Section */}
        <section className="py-24 md:py-44 bg-[#F5F3F0]">
          <div className="container mx-auto px-6 md:px-12">
            <div className="grid grid-cols-1 lg:grid-cols-[1.3fr_0.7fr] gap-16 lg:gap-24 items-start">
              {/* Timeline */}
              <div>
                <div className="mb-6 flex items-center gap-4">
                  <span className="h-px flex-1 bg-[#E8E4DF]"></span>
                  <span className="font-mono text-xs font-medium uppercase tracking-[0.15em] text-[#B8860B]">
                    Di sản
                  </span>
                </div>

                <h2 className="text-3xl md:text-4xl lg:text-5xl font-serif leading-[1.2] tracking-tight text-[#1A1A1A] mb-16">
                  Hành trình kiến tạo
                </h2>

                <div className="space-y-16 relative">
                  {/* Vertical line */}
                  <div className="absolute left-[11px] top-0 bottom-0 w-px bg-[#E8E4DF]"></div>

                  {/* 2010 */}
                  <div className="pl-12 relative">
                    <div className="absolute left-0 top-1 w-6 h-6 bg-[#B8860B] rounded-full -translate-x-[5px] border-4 border-[#F5F3F0]"></div>
                    <span className="text-[#B8860B] font-mono text-sm font-medium tracking-[0.1em] uppercase mb-3 block">2010</span>
                    <h3 className="font-serif text-xl md:text-2xl mb-4 text-[#1A1A1A]">Khởi đầu từ niềm đam mê</h3>
                    <p className="text-[#6B6B6B] leading-[1.75]">
                      AURA bắt đầu như một xưởng chế tác nhỏ tại trung tâm thành phố, nơi những nghệ nhân tâm huyết nhất hội tụ để gìn giữ kỹ thuật truyền thống.
                    </p>
                  </div>

                  {/* 2016 */}
                  <div className="pl-12 relative">
                    <div className="absolute left-0 top-1 w-6 h-6 bg-[#B8860B] rounded-full -translate-x-[5px] border-4 border-[#F5F3F0]"></div>
                    <span className="text-[#B8860B] font-mono text-sm font-medium tracking-[0.1em] uppercase mb-3 block">2016</span>
                    <h3 className="font-serif text-xl md:text-2xl mb-4 text-[#1A1A1A]">Vươn mình ra thế giới</h3>
                    <p className="text-[#6B6B6B] leading-[1.75]">
                      Chúng tôi ra mắt bộ sưu tập quốc tế đầu tiên, kết hợp giữa văn hóa Á Đông tinh tế và xu hướng thẩm mỹ đương đại của phương Tây.
                    </p>
                  </div>

                  {/* 2024 */}
                  <div className="pl-12 relative">
                    <div className="absolute left-0 top-1 w-6 h-6 bg-[#B8860B] rounded-full -translate-x-[5px] border-4 border-[#F5F3F0]"></div>
                    <span className="text-[#B8860B] font-mono text-sm font-medium tracking-[0.1em] uppercase mb-3 block">2024</span>
                    <h3 className="font-serif text-xl md:text-2xl mb-4 text-[#1A1A1A]">Biểu tượng của sự tinh hoa</h3>
                    <p className="text-[#6B6B6B] leading-[1.75]">
                      AURA tự hào là điểm đến cho những tâm hồn tìm kiếm sự sang trọng thầm lặng và giá trị nghệ thuật đích thực.
                    </p>
                  </div>
                </div>
              </div>

              {/* Image & Philosophy */}
              <div>
                <img
                  className="w-full aspect-[4/5] object-cover mb-8"
                  src="https://images.unsplash.com/photo-1515562141207-7a88fb7ce338?w=800&h=1000&fit=crop"
                  alt="Trang sức cao cấp"
                />

                <div className="bg-white p-8 md:p-10 shadow-sm border-t-2 border-[#B8860B]">
                  <h4 className="font-serif text-xl md:text-2xl mb-4 italic text-[#1A1A1A]">Triết lý thiết kế</h4>
                  <p className="text-[#6B6B6B] leading-[1.75] italic">
                    "Chúng tôi tin rằng trang sức không chỉ để trưng diện, mà là một phần ngôn ngữ cơ thể, nói lên câu chuyện của người sở hữu mà không cần lời nói."
                  </p>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Craftsmanship Section */}
        <section className="py-24 md:py-44 bg-[#FAFAF8]">
          <div className="container mx-auto px-6 md:px-12">
            <div className="text-center mb-16 md:mb-24">
              <div className="mb-6 flex items-center gap-4 justify-center">
                <span className="h-px flex-1 max-w-[100px] bg-[#E8E4DF]"></span>
                <span className="font-mono text-xs font-medium uppercase tracking-[0.15em] text-[#B8860B]">
                  Craftsmanship
                </span>
                <span className="h-px flex-1 max-w-[100px] bg-[#E8E4DF]"></span>
              </div>
              <h2 className="text-3xl md:text-4xl lg:text-5xl font-serif leading-[1.2] tracking-tight text-[#1A1A1A]">
                Kiệt tác từ đôi bàn tay
              </h2>
            </div>

            {/* Bento Grid */}
            <div className="grid grid-cols-1 md:grid-cols-4 grid-rows-2 gap-4 h-auto md:h-[800px]">
              {/* Large Image */}
              <div className="md:col-span-2 md:row-span-2 relative overflow-hidden group">
                <img
                  className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-[1.02]"
                  src="https://images.unsplash.com/photo-1573408301185-9146fe634ad0?w=800&h=1000&fit=crop"
                  alt="Kim cương cao cấp"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/50 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500 flex flex-col justify-end p-8 md:p-12">
                  <h3 className="text-white text-2xl md:text-3xl font-serif mb-3">Nguyên liệu thượng hạng</h3>
                  <p className="text-white/80 max-w-xs">
                    Chỉ những viên kim cương đạt tiêu chuẩn 4C khắt khe nhất và vàng 18K tinh khiết mới được tuyển chọn.
                  </p>
                </div>
              </div>

              {/* Medium Image - Top Right */}
              <div className="md:col-span-2 relative overflow-hidden group">
                <img
                  className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-[1.02]"
                  src="https://images.unsplash.com/photo-1610694955371-d4a3e0ce4b52?w=800&h=400&fit=crop"
                  alt="Thiết kế trang sức"
                />
                <div className="absolute inset-0 bg-[#B8860B]/20 opacity-0 group-hover:opacity-100 transition-opacity duration-500 flex items-center justify-center">
                  <div className="bg-white/95 backdrop-blur-sm p-6 md:p-8 text-center shadow-md">
                    <h3 className="text-[#1A1A1A] text-lg md:text-xl font-serif">Thiết kế độc bản</h3>
                  </div>
                </div>
              </div>

              {/* Small Image - Bottom Left */}
              <div className="md:col-span-1 relative overflow-hidden group h-48 md:h-auto">
                <img
                  className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-[1.02]"
                  src="https://images.unsplash.com/photo-1617038260897-41a1f14a8ca0?w=400&h=400&fit=crop"
                  alt="Đánh bóng trang sức"
                />
              </div>

              {/* Small Image - Bottom Right */}
              <div className="md:col-span-1 relative overflow-hidden group h-48 md:h-auto">
                <img
                  className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-[1.02]"
                  src="https://images.unsplash.com/photo-1601121141461-9d6647bca1ed?w=400&h=400&fit=crop"
                  alt="Hộp trang sức cao cấp"
                />
              </div>
            </div>
          </div>
        </section>

        {/* Core Values Section */}
        <section className="py-24 md:py-44 bg-[#F5F3F0]">
          <div className="container mx-auto px-6 md:px-12">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-12 lg:gap-16">
              {/* Tận tâm */}
              <div className="bg-white p-10 md:p-12 shadow-sm border-t-2 border-[#B8860B] hover:shadow-md transition-shadow duration-200">
                <div className="w-14 h-14 bg-[#FAFAF8] flex items-center justify-center mb-6">
                  <svg className="w-7 h-7 text-[#B8860B]" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
                  </svg>
                </div>
                <h3 className="font-serif text-xl md:text-2xl mb-4 text-[#1A1A1A]">Tận tâm</h3>
                <p className="text-[#6B6B6B] leading-[1.75] font-light">
                  Chúng tôi chăm chút từng yêu cầu nhỏ nhất để mang lại trải nghiệm cá nhân hóa hoàn hảo cho khách hàng.
                </p>
              </div>

              {/* Tinh xảo */}
              <div className="bg-white p-10 md:p-12 shadow-sm border-t-2 border-[#B8860B] hover:shadow-md transition-shadow duration-200">
                <div className="w-14 h-14 bg-[#FAFAF8] flex items-center justify-center mb-6">
                  <svg className="w-7 h-7 text-[#B8860B]" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M5 3v4M3 5h4M6 17v4m-2-2h4m5-16l2.286 6.857L21 12l-5.714 2.143L13 21l-2.286-6.857L5 12l5.714-2.143L13 3z" />
                  </svg>
                </div>
                <h3 className="font-serif text-xl md:text-2xl mb-4 text-[#1A1A1A]">Tinh xảo</h3>
                <p className="text-[#6B6B6B] leading-[1.75] font-light">
                  Sự kết hợp hoàn mỹ giữa công nghệ hiện đại và bàn tay tài hoa của những nghệ nhân lâu năm.
                </p>
              </div>

              {/* Chất lượng */}
              <div className="bg-white p-10 md:p-12 shadow-sm border-t-2 border-[#B8860B] hover:shadow-md transition-shadow duration-200">
                <div className="w-14 h-14 bg-[#FAFAF8] flex items-center justify-center mb-6">
                  <svg className="w-7 h-7 text-[#B8860B]" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
                  </svg>
                </div>
                <h3 className="font-serif text-xl md:text-2xl mb-4 text-[#1A1A1A]">Chất lượng</h3>
                <p className="text-[#6B6B6B] leading-[1.75] font-light">
                  Cam kết minh bạch về nguồn gốc và chất lượng đá quý với các chứng chỉ uy tín toàn cầu.
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* Philosophy Quote Section */}
        <section className="py-24 md:py-44 bg-[#FAFAF8] relative overflow-hidden">
          {/* Ambient glow */}
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-[#B8860B] rounded-full opacity-[0.02] blur-3xl"></div>

          <div className="max-w-4xl mx-auto px-6 text-center relative z-10">
            <span className="font-serif text-7xl md:text-8xl text-[#B8860B] opacity-20 leading-none block mb-4">"</span>

            <h2 className="text-2xl md:text-3xl lg:text-4xl font-serif italic leading-snug text-[#1A1A1A] mb-12 px-4 md:px-8">
              Trang sức không chỉ là phụ kiện, đó là người bạn đồng hành tri kỷ đi cùng bạn qua những cột mốc đáng nhớ nhất của cuộc đời.
            </h2>

            <div className="flex items-center justify-center gap-4">
              <span className="h-px w-12 bg-[#E8E4DF]"></span>
              <div className="space-y-1">
                <p className="font-mono text-xs font-medium uppercase tracking-[0.15em] text-[#B8860B]">
                  Đội ngũ AURA Fine Jewelry
                </p>
                <p className="text-[#6B6B6B] text-xs tracking-[0.1em]">Since 2010</p>
              </div>
              <span className="h-px w-12 bg-[#E8E4DF]"></span>
            </div>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
};

export default About;
