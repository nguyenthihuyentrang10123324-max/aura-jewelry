import { useState, useEffect, useRef } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import toast from 'react-hot-toast';
import { newsAPI } from '../../utils/api';
import api from '../../utils/api';
import { getImageUrl } from '../../utils/helpers';

const NEWS_CATEGORIES = ['Tin tức', 'Khuyến mãi', 'Sự kiện', 'Hướng dẫn'];

const AdminNewsForm = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const isEdit = Boolean(id);
  const fileInputRef = useRef(null);

  const [loading, setLoading] = useState(isEdit);
  const [submitting, setSubmitting] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [tagInput, setTagInput] = useState('');
  const [slugEditedByUser, setSlugEditedByUser] = useState(false);

  const [form, setForm] = useState({
    title: '',
    slug: '',
    summary: '',
    content: '',
    thumbnail: '',
    author_name: '',
    category: '',
    tags: [],
    is_featured: false,
    is_published: true,
    seo_title: '',
    seo_description: '',
  });

  useEffect(() => {
    if (isEdit) {
      newsAPI.getById(id)
        .then(res => {
          if (res.data.success && res.data.data.news) {
            const n = res.data.data.news;
            setForm({
              title: n.title || '',
              slug: n.slug || '',
              summary: n.summary || '',
              content: n.content || '',
              thumbnail: n.thumbnail || '',
              author_name: n.author_name || '',
              category: n.category || '',
              tags: Array.isArray(n.tags) ? n.tags : [],
              is_featured: Boolean(n.is_featured),
              is_published: n.is_published !== 0,
              seo_title: n.seo_title || '',
              seo_description: n.seo_description || '',
            });
          } else {
            toast.error('Không tìm thấy bài viết');
            navigate('/admin/news');
          }
        })
        .catch(() => toast.error('Không tải được dữ liệu'))
        .finally(() => setLoading(false));
    } else {
      setLoading(false);
    }
  }, [id, isEdit]);

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setForm(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));
    if (name === 'slug') setSlugEditedByUser(true);
  };

  const generateSlug = (title) => {
    const base = title
      .toLowerCase()
      .normalize('NFD')
      .replace(/[\u0300-\u036f]/g, '')
      .replace(/[^a-z0-9\s-]/g, '')
      .replace(/\s+/g, '-')
      .replace(/-+/g, '-')
      .trim();
    const timestamp = Date.now().toString(36);
    const rand = Math.random().toString(36).substring(2, 6);
    return `${base}-${timestamp}-${rand}`;
  };

  const handleTitleChange = (e) => {
    const title = e.target.value;
    setForm(prev => ({
      ...prev,
      title,
      slug: prev.slug || generateSlug(title),
    }));
  };

  const handleThumbnailUpload = async (e) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setUploading(true);
    try {
      const fd = new FormData();
      fd.append('image', file);
      const res = await api.post('/news/upload', fd, {
        headers: { 'Content-Type': 'multipart/form-data' },
      });
      if (res.data.success) {
        setForm(prev => ({ ...prev, thumbnail: res.data.data.url }));
        toast.success('Tải ảnh thành công');
      } else {
        toast.error(res.data.message || 'Tải ảnh thất bại');
      }
    } catch (err) {
      toast.error(err.response?.data?.message || 'Tải ảnh thất bại');
    } finally {
      setUploading(false);
      if (fileInputRef.current) fileInputRef.current.value = '';
    }
  };

  const addTag = () => {
    const tag = tagInput.trim();
    if (tag && !form.tags.includes(tag)) {
      setForm(prev => ({ ...prev, tags: [...prev.tags, tag] }));
    }
    setTagInput('');
  };

  const removeTag = (tag) => {
    setForm(prev => ({ ...prev, tags: prev.tags.filter(t => t !== tag) }));
  };

  const handleTagKeyDown = (e) => {
    if (e.key === 'Enter' || e.key === ',') {
      e.preventDefault();
      addTag();
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!form.title?.trim()) { toast.error('Vui lòng nhập tiêu đề'); return; }
    if (!form.content?.trim()) { toast.error('Vui lòng nhập nội dung'); return; }

    setSubmitting(true);
    try {
      const finalSlug = slugEditedByUser
        ? form.slug.trim()
        : (form.slug.trim() || generateSlug(form.title));

      const payload = { ...form, slug: finalSlug };

      let res;
      if (isEdit) {
        res = await newsAPI.update(id, payload);
      } else {
        res = await newsAPI.create(payload);
      }

      if (res.data.success) {
        toast.success(isEdit ? 'Cập nhật bài viết thành công' : 'Tạo bài viết thành công');
        setTimeout(() => navigate('/admin/news'), 1500);
      } else {
        toast.error(res.data.message || 'Lưu thất bại');
      }
    } catch (err) {
      toast.error(err.response?.data?.message || 'Lưu thất bại');
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="w-10 h-10 rounded-full animate-spin" style={{ border: '3px solid #FDE68A', borderTopColor: '#F59E0B' }}></div>
      </div>
    );
  }

  return (
    <div className="space-y-5">
      {/* Header */}
      <div className="flex items-center gap-4">
        <button
          onClick={() => navigate('/admin/news')}
          className="w-10 h-10 rounded-xl flex items-center justify-center transition-all"
          style={{ background: '#FFFFFF', border: '1px solid #FDE68A', color: '#92400E' }}
          onMouseEnter={e => { e.currentTarget.style.background = '#FEF3C7'; }}
          onMouseLeave={e => { e.currentTarget.style.background = '#FFFFFF'; }}
        >
          <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 19.5L8.25 12l7.5-7.5" />
          </svg>
        </button>
        <div>
          <h1 className="text-3xl font-bold" style={{ color: '#1F2937', fontFamily: 'system-ui, -apple-system, "Segoe UI", Roboto, sans-serif' }}>
            {isEdit ? 'Chỉnh sửa bài viết' : 'Viết bài mới'}
          </h1>
          <p className="text-sm" style={{ color: '#92400E' }}>
            {isEdit ? `ID: #${id}` : 'Tạo bài viết mới'}
          </p>
        </div>
      </div>

      <form onSubmit={handleSubmit} className="grid grid-cols-1 xl:grid-cols-3 gap-5">
        {/* Left: Main content */}
        <div className="xl:col-span-2 space-y-5">
          {/* Basic Info */}
          <div className="rounded-2xl p-6" style={{ background: '#FFFFFF', border: '1px solid #FDE68A', boxShadow: '0 1px 8px rgba(146,64,14,0.06)' }}>
            <h3 className="text-base font-semibold mb-5" style={{ color: '#1F2937' }}>Nội dung bài viết</h3>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium mb-1.5" style={{ color: '#374151' }}>
                  Tiêu đề <span className="text-red-500">*</span>
                </label>
                <input
                  type="text" name="title" value={form.title} onChange={handleTitleChange} required
                  placeholder="VD: Cách chọn nhẫn cưới hoàn hảo"
                  className="w-full px-4 py-3 rounded-xl text-sm"
                  style={{ background: '#FEF3C7', border: '1px solid #FDE68A', color: '#1F2937', outline: 'none' }}
                  onFocus={e => { e.currentTarget.style.borderColor = '#F59E0B'; }}
                  onBlur={e => { e.currentTarget.style.borderColor = '#FDE68A'; }}
                />
              </div>

              <div>
                <label className="block text-sm font-medium mb-1.5" style={{ color: '#374151' }}>Slug (URL thân thiện)</label>
                <input
                  type="text" name="slug" value={form.slug} onChange={handleChange}
                  placeholder="cach-chon-nhan-cuoi-hoan-hao"
                  className="w-full px-4 py-3 rounded-xl text-sm"
                  style={{ background: '#FEF3C7', border: '1px solid #FDE68A', color: '#1F2937', outline: 'none' }}
                  onFocus={e => { e.currentTarget.style.borderColor = '#F59E0B'; }}
                  onBlur={e => { e.currentTarget.style.borderColor = '#FDE68A'; }}
                />
              </div>

              <div>
                <label className="block text-sm font-medium mb-1.5" style={{ color: '#374151' }}>Tóm tắt</label>
                <textarea
                  name="summary" value={form.summary} onChange={handleChange} rows={3}
                  placeholder="Mô tả ngắn gọn hiển thị trong danh sách bài viết"
                  className="w-full px-4 py-3 rounded-xl text-sm resize-none"
                  style={{ background: '#FEF3C7', border: '1px solid #FDE68A', color: '#1F2937', outline: 'none' }}
                  onFocus={e => { e.currentTarget.style.borderColor = '#F59E0B'; }}
                  onBlur={e => { e.currentTarget.style.borderColor = '#FDE68A'; }}
                />
              </div>

              <div>
                <label className="block text-sm font-medium mb-1.5" style={{ color: '#374151' }}>
                  Nội dung <span className="text-red-500">*</span>
                </label>
                <textarea
                  name="content" value={form.content} onChange={handleChange} rows={12}
                  placeholder="Nội dung bài viết..."
                  className="w-full px-4 py-3 rounded-xl text-sm resize-none font-mono"
                  style={{ background: '#FEF3C7', border: '1px solid #FDE68A', color: '#1F2937', outline: 'none' }}
                  onFocus={e => { e.currentTarget.style.borderColor = '#F59E0B'; }}
                  onBlur={e => { e.currentTarget.style.borderColor = '#FDE68A'; }}
                />
              </div>
            </div>
          </div>

          {/* Thumbnail */}
          <div className="rounded-2xl p-6" style={{ background: '#FFFFFF', border: '1px solid #FDE68A', boxShadow: '0 1px 8px rgba(146,64,14,0.06)' }}>
            <h3 className="text-base font-semibold mb-1" style={{ color: '#1F2937' }}>Ảnh đại diện</h3>
            <p className="text-xs mb-5" style={{ color: '#92400E' }}>Ảnh hiển thị trong danh sách và trên mạng xã hội</p>

            {form.thumbnail ? (
              <div className="relative rounded-xl overflow-hidden" style={{ border: '1px solid #FDE68A' }}>
                <img
                  src={getImageUrl(form.thumbnail)}
                  alt="Thumbnail"
                  className="w-full h-52 object-cover"
                  style={{ background: '#FEF3C7' }}
                />
                <div className="absolute top-3 right-3 flex gap-2">
                  <button
                    type="button"
                    onClick={() => fileInputRef.current?.click()}
                    className="px-3 py-1.5 rounded-lg text-xs font-medium text-white bg-black/50 hover:bg-black/70 transition-colors"
                  >
                    Đổi ảnh
                  </button>
                  <button
                    type="button"
                    onClick={() => {
                      setForm(prev => ({ ...prev, thumbnail: '' }));
                      if (fileInputRef.current) fileInputRef.current.value = '';
                    }}
                    className="px-3 py-1.5 rounded-lg text-xs font-medium text-white bg-red-500/70 hover:bg-red-500 transition-colors"
                  >
                    Xóa
                  </button>
                </div>
              </div>
            ) : (
              <label
                className="flex flex-col items-center justify-center h-40 rounded-xl cursor-pointer transition-all"
                style={{ background: '#FEF3C7', border: '2px dashed #FDE68A', color: '#92400E' }}
                onMouseEnter={e => { e.currentTarget.style.borderColor = '#F59E0B'; e.currentTarget.style.background = '#FEF9F0'; }}
                onMouseLeave={e => { e.currentTarget.style.borderColor = '#FDE68A'; e.currentTarget.style.background = '#FEF3C7'; }}
              >
                {uploading ? (
                  <div className="w-8 h-8 rounded-full animate-spin" style={{ border: '3px solid #FDE68A', borderTopColor: '#F59E0B' }}></div>
                ) : (
                  <>
                    <svg className="w-8 h-8 mb-2" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                      <path strokeLinecap="round" strokeLinejoin="round" d="M2.25 15.75l5.159-5.159a2.25 2.25 0 013.182 0l5.159 5.159m-1.5-1.5l1.409-1.409a2.25 2.25 0 013.182 0l2.909 2.909m-18 3.75h16.5a1.5 1.5 0 001.5-1.5V6a1.5 1.5 0 00-1.5-1.5H3.75A1.5 1.5 0 002.25 6v12a1.5 1.5 0 001.5 1.5zm10.5-11.25h.008v.008h-.008V8.25zm.375 0a.375.375 0 11-.75 0 .375.375 0 01.75 0z" />
                    </svg>
                    <span className="text-sm font-medium">Tải ảnh lên</span>
                  </>
                )}
                <input
                  ref={fileInputRef}
                  type="file" accept="image/*" onChange={handleThumbnailUpload}
                  className="hidden" disabled={uploading}
                />
              </label>
            )}
          </div>

          {/* SEO */}
          <div className="rounded-2xl p-6" style={{ background: '#FFFFFF', border: '1px solid #FDE68A', boxShadow: '0 1px 8px rgba(146,64,14,0.06)' }}>
            <h3 className="text-base font-semibold mb-5" style={{ color: '#1F2937' }}>SEO</h3>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium mb-1.5" style={{ color: '#374151' }}>SEO Title</label>
                <input
                  type="text" name="seo_title" value={form.seo_title} onChange={handleChange}
                  placeholder="Tiêu đề hiển thị trên Google (tối đa 60 ký tự)"
                  maxLength={60}
                  className="w-full px-4 py-3 rounded-xl text-sm"
                  style={{ background: '#FEF3C7', border: '1px solid #FDE68A', color: '#1F2937', outline: 'none' }}
                  onFocus={e => { e.currentTarget.style.borderColor = '#F59E0B'; }}
                  onBlur={e => { e.currentTarget.style.borderColor = '#FDE68A'; }}
                />
              </div>
              <div>
                <label className="block text-sm font-medium mb-1.5" style={{ color: '#374151' }}>SEO Description</label>
                <textarea
                  name="seo_description" value={form.seo_description} onChange={handleChange} rows={3}
                  placeholder="Mô tả hiển thị trên Google (tối đa 160 ký tự)"
                  maxLength={160}
                  className="w-full px-4 py-3 rounded-xl text-sm resize-none"
                  style={{ background: '#FEF3C7', border: '1px solid #FDE68A', color: '#1F2937', outline: 'none' }}
                  onFocus={e => { e.currentTarget.style.borderColor = '#F59E0B'; }}
                  onBlur={e => { e.currentTarget.style.borderColor = '#FDE68A'; }}
                />
              </div>
            </div>
          </div>
        </div>

        {/* Right: Sidebar */}
        <div className="space-y-5">
          {/* Publish */}
          <div className="rounded-2xl p-6" style={{ background: '#FFFFFF', border: '1px solid #FDE68A', boxShadow: '0 1px 8px rgba(146,64,14,0.06)' }}>
            <h3 className="text-base font-semibold mb-5" style={{ color: '#1F2937' }}>Trạng thái</h3>
            <div className="space-y-3">
              <label className="flex items-center justify-between cursor-pointer">
                <span className="text-sm" style={{ color: '#374151' }}>Xuất bản ngay</span>
                <button
                  type="button"
                  onClick={() => setForm(prev => ({ ...prev, is_published: !prev.is_published }))}
                  className="relative w-12 h-7 rounded-full transition-all duration-300"
                  style={{ background: form.is_published ? '#F59E0B' : '#D1D5DB' }}
                >
                  <span
                    className="absolute top-1 w-5 h-5 rounded-full bg-white shadow transition-all duration-300"
                    style={{ left: form.is_published ? '26px' : '4px' }}
                  />
                </button>
              </label>
              <label className="flex items-center justify-between cursor-pointer">
                <span className="text-sm" style={{ color: '#374151' }}>Bài viết nổi bật</span>
                <button
                  type="button"
                  onClick={() => setForm(prev => ({ ...prev, is_featured: !prev.is_featured }))}
                  className="relative w-12 h-7 rounded-full transition-all duration-300"
                  style={{ background: form.is_featured ? '#F59E0B' : '#D1D5DB' }}
                >
                  <span
                    className="absolute top-1 w-5 h-5 rounded-full bg-white shadow transition-all duration-300"
                    style={{ left: form.is_featured ? '26px' : '4px' }}
                  />
                </button>
              </label>
            </div>

            <button
              type="submit"
              disabled={submitting}
              className="w-full mt-5 py-3 rounded-xl text-sm font-semibold text-white transition-all duration-200 disabled:opacity-60"
              style={{ background: 'linear-gradient(135deg, #F59E0B, #FCD34D)', boxShadow: '0 4px 14px rgba(245,158,11,0.3)' }}
              onMouseEnter={e => { if (!submitting) e.currentTarget.style.transform = 'translateY(-1px)'; }}
              onMouseLeave={e => { e.currentTarget.style.transform = 'translateY(0)'; }}
            >
              {submitting ? (
                <span className="flex items-center justify-center gap-2">
                  <svg className="w-4 h-4 animate-spin" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z"></path>
                  </svg>
                  Đang lưu...
                </span>
              ) : isEdit ? 'Lưu thay đổi' : 'Xuất bản bài viết'}
            </button>

            <button
              type="button" onClick={() => navigate('/admin/news')}
              className="w-full mt-2 py-3 rounded-xl text-sm font-medium transition-all"
              style={{ background: '#FEF3C7', color: '#92400E', border: '1px solid #FDE68A' }}
              onMouseEnter={e => { e.currentTarget.style.background = '#FDE68A'; }}
              onMouseLeave={e => { e.currentTarget.style.background = '#FEF3C7'; }}
            >
              Hủy
            </button>
          </div>

          {/* Category & Author */}
          <div className="rounded-2xl p-6" style={{ background: '#FFFFFF', border: '1px solid #FDE68A', boxShadow: '0 1px 8px rgba(146,64,14,0.06)' }}>
            <h3 className="text-base font-semibold mb-5" style={{ color: '#1F2937' }}>Phân loại</h3>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium mb-1.5" style={{ color: '#374151' }}>Danh mục</label>
                <select
                  name="category" value={form.category} onChange={handleChange}
                  className="w-full px-4 py-3 rounded-xl text-sm"
                  style={{ background: '#FEF3C7', border: '1px solid #FDE68A', color: '#1F2937', outline: 'none' }}
                >
                  <option value="">— Chọn danh mục —</option>
                  {NEWS_CATEGORIES.map(c => (
                    <option key={c} value={c}>{c}</option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium mb-1.5" style={{ color: '#374151' }}>Tên tác giả</label>
                <input
                  type="text" name="author_name" value={form.author_name} onChange={handleChange}
                  placeholder="VD: AURA Jewelry"
                  className="w-full px-4 py-3 rounded-xl text-sm"
                  style={{ background: '#FEF3C7', border: '1px solid #FDE68A', color: '#1F2937', outline: 'none' }}
                  onFocus={e => { e.currentTarget.style.borderColor = '#F59E0B'; }}
                  onBlur={e => { e.currentTarget.style.borderColor = '#FDE68A'; }}
                />
              </div>

              <div>
                <label className="block text-sm font-medium mb-1.5" style={{ color: '#374151' }}>Tags</label>
                <div className="flex flex-wrap gap-2 mb-2">
                  {form.tags.map(tag => (
                    <span
                      key={tag}
                      className="inline-flex items-center gap-1 px-2.5 py-1 rounded-lg text-xs font-medium"
                      style={{ background: '#FEF3C7', color: '#92400E' }}
                    >
                      {tag}
                      <button type="button" onClick={() => removeTag(tag)} className="hover:text-red-500">
                        <svg className="w-3 h-3" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                          <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
                        </svg>
                      </button>
                    </span>
                  ))}
                </div>
                <div className="flex gap-2">
                  <input
                    type="text" value={tagInput} onChange={e => setTagInput(e.target.value)}
                    onKeyDown={handleTagKeyDown}
                    placeholder="Nhấn Enter để thêm tag"
                    className="flex-1 px-3 py-2 rounded-xl text-sm"
                    style={{ background: '#FEF3C7', border: '1px solid #FDE68A', color: '#1F2937', outline: 'none' }}
                    onFocus={e => { e.currentTarget.style.borderColor = '#F59E0B'; }}
                    onBlur={e => { e.currentTarget.style.borderColor = '#FDE68A'; }}
                  />
                  <button type="button" onClick={addTag}
                    className="px-3 py-2 rounded-xl text-sm font-medium transition-all"
                    style={{ background: '#FEF3C7', color: '#92400E', border: '1px solid #FDE68A' }}
                    onMouseEnter={e => { e.currentTarget.style.background = '#FDE68A'; }}
                    onMouseLeave={e => { e.currentTarget.style.background = '#FEF3C7'; }}
                  >
                    Thêm
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </form>
    </div>
  );
};

export default AdminNewsForm;
