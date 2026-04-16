import { useState, useEffect, useRef } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { productAPI } from '../../utils/api';
import { useAuth } from '../../context/AuthContext';
import toast from 'react-hot-toast';

const AdminProductForm = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { user, loading: authLoading } = useAuth();
  const isEdit = Boolean(id);

  const [loading, setLoading] = useState(isEdit);
  const [submitting, setSubmitting] = useState(false);
  const [categories, setCategories] = useState([]);
  const [images, setImages] = useState([]);
  const [variants, setVariants] = useState([]);
  const [uploading, setUploading] = useState(false);
  const fileInputRef = useRef(null);

  const [form, setForm] = useState({
    name: '',
    slug: '',
    short_description: '',
    description: '',
    price: '',
    compare_price: '',
    cost_price: '',
    sku: '',
    barcode: '',
    stock: '',
    category_id: '',
    material: '',
    weight: '',
    dimensions: '',
    is_featured: false,
    is_active: true,
    seo_title: '',
    seo_description: '',
  });

  useEffect(() => {
    if (authLoading) return;
    if (!user || user.role !== 'admin') {
      toast.error('Bạn cần đăng nhập admin để truy cập');
      navigate('/admin/login');
      return;
    }
    Promise.all([
      productAPI.getCategories(),
      isEdit ? productAPI.getById(id) : Promise.resolve({ data: { success: true, data: { product: null } } })
    ])
      .then(([catRes, prodRes]) => {
        if (catRes.data.success) setCategories(catRes.data.data.categories);
        if (isEdit && prodRes.data.success && prodRes.data.data.product) {
          const p = prodRes.data.data.product;
          setForm({
            name: p.name || '',
            slug: p.slug || '',
            short_description: p.short_description || '',
            description: p.description || '',
            price: p.price || '',
            compare_price: p.compare_price || '',
            cost_price: p.cost_price || '',
            sku: p.sku || '',
            barcode: p.barcode || '',
            stock: p.stock ?? '',
            category_id: p.category_id || '',
            material: p.material || '',
            weight: p.weight || '',
            dimensions: p.dimensions || '',
            is_featured: Boolean(p.is_featured),
            is_active: p.is_active !== 0,
            seo_title: p.seo_title || '',
            seo_description: p.seo_description || '',
          });
          if (p.images) setImages(p.images);
          if (p.variants) setVariants(p.variants);
        }
      })
      .catch((err) => {
        console.error('Load product error:', err);
        toast.error(err.response?.data?.message || 'Không tải được dữ liệu');
      })
      .finally(() => setLoading(false));
  }, [id, isEdit]);

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setForm(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));
  };

  const generateSlug = (name) => {
    return name
      .toLowerCase()
      .normalize('NFD')
      .replace(/[\u0300-\u036f]/g, '')
      .replace(/[^a-z0-9\s-]/g, '')
      .replace(/\s+/g, '-')
      .replace(/-+/g, '-')
      .trim();
  };

  const handleNameChange = (e) => {
    const name = e.target.value;
    setForm(prev => ({
      ...prev,
      name,
      slug: prev.slug || generateSlug(name)
    }));
  };

  const handleImageUpload = async (e) => {
    const files = Array.from(e.target.files || []);
    if (!files.length) return;
    setUploading(true);
    try {
      for (const file of files) {
        const fd = new FormData();
        fd.append('image', file);
        const res = await productAPI.uploadImage(fd);
        if (res.data.success) {
          setImages(prev => [...prev, {
            url: res.data.data.url,
            is_primary: images.length === 0 && variants.length === 0 ? 1 : 0,
            alt_text: form.name,
          }]);
        }
      }
      toast.success('Tải ảnh thành công');
    } catch {
      toast.error('Tải ảnh thất bại');
    } finally {
      setUploading(false);
      if (fileInputRef.current) fileInputRef.current.value = '';
    }
  };

  const removeImage = async (idx) => {
    const img = images[idx];
    if (img.id) {
      try { await productAPI.deleteImage(img.id); } catch {}
    }
    setImages(prev => prev.filter((_, i) => i !== idx));
  };

  const setPrimary = (idx) => {
    setImages(prev => prev.map((img, i) => ({ ...img, is_primary: i === idx ? 1 : 0 })));
  };

  const addVariant = () => {
    setVariants(prev => [...prev, { size: '', color: '', stock: '', price: '', is_active: true }]);
  };

  const updateVariant = (idx, field, value) => {
    setVariants(prev => prev.map((v, i) => i === idx ? { ...v, [field]: value } : v));
  };

  const removeVariant = async (idx) => {
    const v = variants[idx];
    if (v.id) {
      try { await productAPI.deleteVariant(v.id); } catch {}
    }
    setVariants(prev => prev.filter((_, i) => i !== idx));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!form.name?.trim()) { toast.error('Vui lòng nhập tên sản phẩm'); return; }
    if (!form.price || Number(form.price) <= 0) { toast.error('Vui lòng nhập giá hợp lệ'); return; }

    setSubmitting(true);
    try {
      const payload = {
        ...form,
        price: Number(form.price),
        compare_price: form.compare_price ? Number(form.compare_price) : null,
        cost_price: form.cost_price ? Number(form.cost_price) : null,
        stock: form.stock !== '' ? Number(form.stock) : 0,
        category_id: form.category_id || null,
        weight: form.weight ? Number(form.weight) : null,
        slug: form.slug || generateSlug(form.name),
        images: images.map((img, i) => ({ ...img, is_primary: i === 0 ? 1 : 0 })),
        variants: variants.filter(v => v.size || v.color).map(v => ({
          ...v,
          stock: v.stock !== '' ? Number(v.stock) : 0,
          price: v.price !== '' ? Number(v.price) : null,
        })),
      };

      let productId = id;
      if (isEdit) {
        await productAPI.update(id, payload);
        toast.success('Cập nhật sản phẩm thành công');
      } else {
        const res = await productAPI.create(payload);
        if (res.data.success) {
          productId = res.data.data.product?.id;
          toast.success('Tạo sản phẩm thành công');
        }
      }

      setTimeout(() => navigate('/admin/products'), 1500);
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
          onClick={() => navigate('/admin/products')}
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
            {isEdit ? 'Chỉnh sửa sản phẩm' : 'Thêm sản phẩm mới'}
          </h1>
          <p className="text-sm" style={{ color: '#92400E' }}>
            {isEdit ? `ID: #${id}` : 'Điền thông tin sản phẩm bên dưới'}
          </p>
        </div>
      </div>

      <form onSubmit={handleSubmit} className="grid grid-cols-1 xl:grid-cols-3 gap-5">
        {/* Left: Main info */}
        <div className="xl:col-span-2 space-y-5">
          {/* Basic Info */}
          <div className="rounded-2xl p-6" style={{ background: '#FFFFFF', border: '1px solid #FDE68A', boxShadow: '0 1px 8px rgba(146,64,14,0.06)' }}>
            <h3 className="text-base font-semibold mb-5" style={{ color: '#1F2937' }}>Thông tin cơ bản</h3>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium mb-1.5" style={{ color: '#374151' }}>
                  Tên sản phẩm <span className="text-red-500">*</span>
                </label>
                <input
                  type="text" name="name" value={form.name} onChange={handleNameChange} required
                  placeholder="VD: Nhẫn Kim Cương Vàng 18K"
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
                  placeholder="nhan-kim-cuong-vang-18k"
                  className="w-full px-4 py-3 rounded-xl text-sm"
                  style={{ background: '#FEF3C7', border: '1px solid #FDE68A', color: '#1F2937', outline: 'none' }}
                  onFocus={e => { e.currentTarget.style.borderColor = '#F59E0B'; }}
                  onBlur={e => { e.currentTarget.style.borderColor = '#FDE68A'; }}
                />
              </div>

              <div>
                <label className="block text-sm font-medium mb-1.5" style={{ color: '#374151' }}>Mô tả ngắn</label>
                <input
                  type="text" name="short_description" value={form.short_description} onChange={handleChange}
                  placeholder="Mô tả ngắn gọn hiển thị trên card sản phẩm"
                  className="w-full px-4 py-3 rounded-xl text-sm"
                  style={{ background: '#FEF3C7', border: '1px solid #FDE68A', color: '#1F2937', outline: 'none' }}
                  onFocus={e => { e.currentTarget.style.borderColor = '#F59E0B'; }}
                  onBlur={e => { e.currentTarget.style.borderColor = '#FDE68A'; }}
                />
              </div>

              <div>
                <label className="block text-sm font-medium mb-1.5" style={{ color: '#374151' }}>Mô tả chi tiết</label>
                <textarea
                  name="description" value={form.description} onChange={handleChange} rows={6}
                  placeholder="Mô tả chi tiết sản phẩm..."
                  className="w-full px-4 py-3 rounded-xl text-sm resize-none"
                  style={{ background: '#FEF3C7', border: '1px solid #FDE68A', color: '#1F2937', outline: 'none' }}
                  onFocus={e => { e.currentTarget.style.borderColor = '#F59E0B'; }}
                  onBlur={e => { e.currentTarget.style.borderColor = '#FDE68A'; }}
                />
              </div>
            </div>
          </div>

          {/* Pricing */}
          <div className="rounded-2xl p-6" style={{ background: '#FFFFFF', border: '1px solid #FDE68A', boxShadow: '0 1px 8px rgba(146,64,14,0.06)' }}>
            <h3 className="text-base font-semibold mb-5" style={{ color: '#1F2937' }}>Giá cả</h3>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              {[
                { name: 'price', label: 'Giá bán (VNĐ)', placeholder: '5000000', required: true },
                { name: 'compare_price', label: 'Giá gốc (VNĐ)', placeholder: '6500000' },
                { name: 'cost_price', label: 'Giá vốn (VNĐ)', placeholder: '3000000' },
              ].map(f => (
                <div key={f.name}>
                  <label className="block text-sm font-medium mb-1.5" style={{ color: '#374151' }}>
                    {f.label} {f.required && <span className="text-red-500">*</span>}
                  </label>
                  <input
                    type="number" name={f.name} value={form[f.name]} onChange={handleChange}
                    placeholder={f.placeholder} required={f.required} min="0"
                    className="w-full px-4 py-3 rounded-xl text-sm"
                    style={{ background: '#FEF3C7', border: '1px solid #FDE68A', color: '#1F2937', outline: 'none' }}
                    onFocus={e => { e.currentTarget.style.borderColor = '#F59E0B'; }}
                    onBlur={e => { e.currentTarget.style.borderColor = '#FDE68A'; }}
                  />
                </div>
              ))}
            </div>
          </div>

          {/* Images */}
          <div className="rounded-2xl p-6" style={{ background: '#FFFFFF', border: '1px solid #FDE68A', boxShadow: '0 1px 8px rgba(146,64,14,0.06)' }}>
            <h3 className="text-base font-semibold mb-1" style={{ color: '#1F2937' }}>Hình ảnh sản phẩm</h3>
            <p className="text-xs mb-5" style={{ color: '#92400E' }}>Ảnh đầu tiên sẽ là ảnh đại diện</p>

            <div className="grid grid-cols-3 sm:grid-cols-4 gap-3 mb-4">
              {images.map((img, idx) => (
                <div key={idx} className="relative group rounded-xl overflow-hidden" style={{ border: img.is_primary ? '2px solid #F59E0B' : '1px solid #FDE68A' }}>
                  <img
                    src={img.url?.startsWith('http') ? img.url : `http://localhost:5000${img.url}`}
                    alt={img.alt_text || form.name}
                    className="w-full aspect-square object-cover"
                    style={{ background: '#FEF3C7' }}
                  />
                  {img.is_primary && (
                    <div className="absolute top-1.5 left-1.5 px-1.5 py-0.5 rounded-md text-[9px] font-bold text-white" style={{ background: '#F59E0B' }}>
                      Đại diện
                    </div>
                  )}
                  <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-1.5">
                    {!img.is_primary && (
                      <button type="button" onClick={() => setPrimary(idx)}
                        className="px-2 py-1 rounded-lg text-[10px] font-medium text-white bg-black/50 hover:bg-black/70">
                        Đặt chính
                      </button>
                    )}
                    <button type="button" onClick={() => removeImage(idx)}
                      className="px-2 py-1 rounded-lg text-[10px] font-medium text-white bg-red-500/70 hover:bg-red-500">
                      Xóa
                    </button>
                  </div>
                </div>
              ))}

              <label
                className="aspect-square rounded-xl flex flex-col items-center justify-center gap-1 cursor-pointer transition-all"
                style={{ background: '#FEF3C7', border: '2px dashed #FDE68A', color: '#92400E' }}
                onMouseEnter={e => { e.currentTarget.style.borderColor = '#F59E0B'; e.currentTarget.style.background = '#FEF9F0'; }}
                onMouseLeave={e => { e.currentTarget.style.borderColor = '#FDE68A'; e.currentTarget.style.background = '#FEF3C7'; }}
              >
                {uploading ? (
                  <div className="w-6 h-6 rounded-full animate-spin" style={{ border: '2px solid #FDE68A', borderTopColor: '#F59E0B' }}></div>
                ) : (
                  <>
                    <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                      <path strokeLinecap="round" strokeLinejoin="round" d="M12 4.5v15m7.5-7.5h-15" />
                    </svg>
                    <span className="text-[10px] font-medium">Tải ảnh</span>
                  </>
                )}
                <input
                  ref={fileInputRef}
                  type="file" accept="image/*" multiple onChange={handleImageUpload}
                  className="hidden" disabled={uploading}
                />
              </label>
            </div>
          </div>

          {/* Variants */}
          <div className="rounded-2xl p-6" style={{ background: '#FFFFFF', border: '1px solid #FDE68A', boxShadow: '0 1px 8px rgba(146,64,14,0.06)' }}>
            <div className="flex items-center justify-between mb-5">
              <div>
                <h3 className="text-base font-semibold" style={{ color: '#1F2937' }}>Biến thể sản phẩm</h3>
                <p className="text-xs mt-0.5" style={{ color: '#92400E' }}>VD: size S/M/L, màu vàng/trắng</p>
              </div>
              <button type="button" onClick={addVariant}
                className="flex items-center gap-1.5 px-4 py-2 rounded-xl text-xs font-medium transition-all"
                style={{ background: '#FEF3C7', color: '#92400E', border: '1px solid #FDE68A' }}
                onMouseEnter={e => { e.currentTarget.style.background = '#FDE68A'; }}
                onMouseLeave={e => { e.currentTarget.style.background = '#FEF3C7'; }}
              >
                <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M12 4.5v15m7.5-7.5h-15" />
                </svg>
                Thêm biến thể
              </button>
            </div>

            {variants.length === 0 ? (
              <div className="text-center py-8">
                <svg className="w-12 h-12 mx-auto mb-3" style={{ color: '#FDE68A' }} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M20.25 7.5l-.625 10.632a2.25 2.25 0 01-2.247 2.118H6.622a2.25 2.25 0 01-2.247-2.118L3.75 7.5" />
                </svg>
                <p className="text-sm font-medium" style={{ color: '#374151' }}>Chưa có biến thể nào</p>
              </div>
            ) : (
              <div className="space-y-3">
                {variants.map((v, idx) => (
                  <div key={idx} className="p-4 rounded-xl flex flex-wrap items-center gap-3" style={{ background: '#FFFBEB', border: '1px solid #FDE68A' }}>
                    <input
                      type="text" placeholder="Size (VD: S)"
                      value={v.size || ''} onChange={e => updateVariant(idx, 'size', e.target.value)}
                      className="px-3 py-2 rounded-xl text-sm w-28"
                      style={{ background: '#FFFFFF', border: '1px solid #FDE68A', color: '#1F2937', outline: 'none' }}
                      onFocus={e => { e.currentTarget.style.borderColor = '#F59E0B'; }}
                      onBlur={e => { e.currentTarget.style.borderColor = '#FDE68A'; }}
                    />
                    <input
                      type="text" placeholder="Màu (VD: Vàng)"
                      value={v.color || ''} onChange={e => updateVariant(idx, 'color', e.target.value)}
                      className="px-3 py-2 rounded-xl text-sm w-36"
                      style={{ background: '#FFFFFF', border: '1px solid #FDE68A', color: '#1F2937', outline: 'none' }}
                      onFocus={e => { e.currentTarget.style.borderColor = '#F59E0B'; }}
                      onBlur={e => { e.currentTarget.style.borderColor = '#FDE68A'; }}
                    />
                    <input
                      type="number" placeholder="Tồn kho"
                      value={v.stock || ''} onChange={e => updateVariant(idx, 'stock', e.target.value)}
                      className="px-3 py-2 rounded-xl text-sm w-28"
                      style={{ background: '#FFFFFF', border: '1px solid #FDE68A', color: '#1F2937', outline: 'none' }}
                      onFocus={e => { e.currentTarget.style.borderColor = '#F59E0B'; }}
                      onBlur={e => { e.currentTarget.style.borderColor = '#FDE68A'; }}
                    />
                    <input
                      type="number" placeholder="Giá"
                      value={v.price || ''} onChange={e => updateVariant(idx, 'price', e.target.value)}
                      className="px-3 py-2 rounded-xl text-sm w-32"
                      style={{ background: '#FFFFFF', border: '1px solid #FDE68A', color: '#1F2937', outline: 'none' }}
                      onFocus={e => { e.currentTarget.style.borderColor = '#F59E0B'; }}
                      onBlur={e => { e.currentTarget.style.borderColor = '#FDE68A'; }}
                    />
                    <button type="button" onClick={() => removeVariant(idx)}
                      className="p-2 rounded-xl transition-all"
                      style={{ color: '#92400E' }}
                      onMouseEnter={e => { e.currentTarget.style.background = '#FEE2E2'; e.currentTarget.style.color = '#EF4444'; }}
                      onMouseLeave={e => { e.currentTarget.style.background = 'transparent'; e.currentTarget.style.color = '#92400E'; }}
                    >
                      <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.75}>
                        <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
                      </svg>
                    </button>
                  </div>
                ))}
              </div>
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
                <span className="text-sm" style={{ color: '#374151' }}>Hiển thị sản phẩm</span>
                <button
                  type="button"
                  onClick={() => setForm(prev => ({ ...prev, is_active: !prev.is_active }))}
                  className="relative w-12 h-7 rounded-full transition-all duration-300"
                  style={{ background: form.is_active ? '#F59E0B' : '#D1D5DB' }}
                >
                  <span
                    className="absolute top-1 w-5 h-5 rounded-full bg-white shadow transition-all duration-300"
                    style={{ left: form.is_active ? '26px' : '4px' }}
                  />
                </button>
              </label>
              <label className="flex items-center justify-between cursor-pointer">
                <span className="text-sm" style={{ color: '#374151' }}>Sản phẩm nổi bật</span>
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
              ) : isEdit ? 'Lưu thay đổi' : 'Tạo sản phẩm'}
            </button>

            <button
              type="button" onClick={() => navigate('/admin/products')}
              className="w-full mt-2 py-3 rounded-xl text-sm font-medium transition-all"
              style={{ background: '#FEF3C7', color: '#92400E', border: '1px solid #FDE68A' }}
              onMouseEnter={e => { e.currentTarget.style.background = '#FDE68A'; }}
              onMouseLeave={e => { e.currentTarget.style.background = '#FEF3C7'; }}
            >
              Hủy
            </button>
          </div>

          {/* Category & Inventory */}
          <div className="rounded-2xl p-6" style={{ background: '#FFFFFF', border: '1px solid #FDE68A', boxShadow: '0 1px 8px rgba(146,64,14,0.06)' }}>
            <h3 className="text-base font-semibold mb-5" style={{ color: '#1F2937' }}>Danh mục & Kho hàng</h3>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium mb-1.5" style={{ color: '#374151' }}>Danh mục</label>
                <select
                  name="category_id" value={form.category_id} onChange={handleChange}
                  className="w-full px-4 py-3 rounded-xl text-sm"
                  style={{ background: '#FEF3C7', border: '1px solid #FDE68A', color: '#1F2937', outline: 'none' }}
                >
                  <option value="">— Chọn danh mục —</option>
                  {categories.map(c => (
                    <option key={c.id} value={c.id}>{c.name}</option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium mb-1.5" style={{ color: '#374151' }}>Tồn kho</label>
                <input
                  type="number" name="stock" value={form.stock} onChange={handleChange}
                  placeholder="0" min="0"
                  className="w-full px-4 py-3 rounded-xl text-sm"
                  style={{ background: '#FEF3C7', border: '1px solid #FDE68A', color: '#1F2937', outline: 'none' }}
                  onFocus={e => { e.currentTarget.style.borderColor = '#F59E0B'; }}
                  onBlur={e => { e.currentTarget.style.borderColor = '#FDE68A'; }}
                />
              </div>

              <div>
                <label className="block text-sm font-medium mb-1.5" style={{ color: '#374151' }}>SKU</label>
                <input
                  type="text" name="sku" value={form.sku} onChange={handleChange}
                  placeholder="AURA-001"
                  className="w-full px-4 py-3 rounded-xl text-sm"
                  style={{ background: '#FEF3C7', border: '1px solid #FDE68A', color: '#1F2937', outline: 'none' }}
                  onFocus={e => { e.currentTarget.style.borderColor = '#F59E0B'; }}
                  onBlur={e => { e.currentTarget.style.borderColor = '#FDE68A'; }}
                />
              </div>

              <div>
                <label className="block text-sm font-medium mb-1.5" style={{ color: '#374151' }}>Barcode</label>
                <input
                  type="text" name="barcode" value={form.barcode} onChange={handleChange}
                  placeholder="1234567890123"
                  className="w-full px-4 py-3 rounded-xl text-sm"
                  style={{ background: '#FEF3C7', border: '1px solid #FDE68A', color: '#1F2937', outline: 'none' }}
                  onFocus={e => { e.currentTarget.style.borderColor = '#F59E0B'; }}
                  onBlur={e => { e.currentTarget.style.borderColor = '#FDE68A'; }}
                />
              </div>
            </div>
          </div>

          {/* Shipping Info */}
          <div className="rounded-2xl p-6" style={{ background: '#FFFFFF', border: '1px solid #FDE68A', boxShadow: '0 1px 8px rgba(146,64,14,0.06)' }}>
            <h3 className="text-base font-semibold mb-5" style={{ color: '#1F2937' }}>Thông tin vận chuyển</h3>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium mb-1.5" style={{ color: '#374151' }}>Chất liệu</label>
                <input
                  type="text" name="material" value={form.material} onChange={handleChange}
                  placeholder="VD: Vàng 18K, Kim cương"
                  className="w-full px-4 py-3 rounded-xl text-sm"
                  style={{ background: '#FEF3C7', border: '1px solid #FDE68A', color: '#1F2937', outline: 'none' }}
                  onFocus={e => { e.currentTarget.style.borderColor = '#F59E0B'; }}
                  onBlur={e => { e.currentTarget.style.borderColor = '#FDE68A'; }}
                />
              </div>
              <div>
                <label className="block text-sm font-medium mb-1.5" style={{ color: '#374151' }}>Trọng lượng (gram)</label>
                <input
                  type="number" name="weight" value={form.weight} onChange={handleChange}
                  placeholder="VD: 5.2"
                  className="w-full px-4 py-3 rounded-xl text-sm"
                  style={{ background: '#FEF3C7', border: '1px solid #FDE68A', color: '#1F2937', outline: 'none' }}
                  onFocus={e => { e.currentTarget.style.borderColor = '#F59E0B'; }}
                  onBlur={e => { e.currentTarget.style.borderColor = '#FDE68A'; }}
                />
              </div>
              <div>
                <label className="block text-sm font-medium mb-1.5" style={{ color: '#374151' }}>Kích thước</label>
                <input
                  type="text" name="dimensions" value={form.dimensions} onChange={handleChange}
                  placeholder="VD: 15 x 15 x 5 mm"
                  className="w-full px-4 py-3 rounded-xl text-sm"
                  style={{ background: '#FEF3C7', border: '1px solid #FDE68A', color: '#1F2937', outline: 'none' }}
                  onFocus={e => { e.currentTarget.style.borderColor = '#F59E0B'; }}
                  onBlur={e => { e.currentTarget.style.borderColor = '#FDE68A'; }}
                />
              </div>
            </div>
          </div>
        </div>
      </form>
    </div>
  );
};

export default AdminProductForm;
