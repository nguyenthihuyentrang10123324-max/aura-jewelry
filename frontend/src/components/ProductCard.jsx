import { Link } from 'react-router-dom';
import { formatPrice, getImageUrl } from '../utils/helpers';
import { useCart } from '../context/CartContext';
import toast from 'react-hot-toast';

const ProductCard = ({ product }) => {
  const { addToCart } = useCart();
  const image = product.images?.[0]?.url || product.thumbnail;

  const handleAddToCart = async (e) => {
    e.preventDefault();
    e.stopPropagation();
    const result = await addToCart(product.id, 1);
    if (result.success) {
      toast.success('Đã thêm vào giỏ hàng');
    } else {
      toast.error(result.message || 'Có lỗi xảy ra');
    }
  };

  return (
    <Link to={`/products/${product.id}`} className="group block">
      <div className="bg-white overflow-hidden border-t-2 border-transparent group-hover:border-[#B8860B] transition-all duration-300">
        {/* Image Container */}
        <div className="relative aspect-square overflow-hidden bg-[#F5F3F0]">
          <img
            src={getImageUrl(image)}
            alt={product.name}
            className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105 will-change-transform"
            onError={(e) => { e.target.src = 'https://images.unsplash.com/photo-1515562141207-7a88fb7ce338?w=400&h=400&fit=crop'; }}
          />
          
          {/* Featured Badge - Refined */}
          {product.is_featured && (
            <div className="absolute top-4 left-4">
              <span className="font-mono text-[10px] uppercase tracking-[0.15em] text-[#B8860B] bg-white/95 backdrop-blur-sm px-3 py-1.5 shadow-sm">
                Nổi bật
              </span>
            </div>
          )}

          {/* Quick Add Button */}
          <button
            onClick={handleAddToCart}
            className="absolute bottom-4 left-4 right-4 bg-white text-[#1A1A1A] py-3 font-mono text-[10px] uppercase tracking-[0.15em] shadow-lg opacity-0 group-hover:opacity-100 transition-opacity duration-300 transform translate-y-4 group-hover:translate-y-0 hover:bg-[#1A1A1A] hover:text-white"
          >
            Thêm vào giỏ
          </button>
        </div>

        {/* Content - Better spacing */}
        <div className="pt-6 pb-8 px-4">
          {/* Category */}
          <p className="font-mono text-[10px] uppercase tracking-[0.15em] text-[#B8860B] mb-3">
            {product.category_name || product.category || 'Trang sức'}
          </p>
          
          {/* Product Name */}
          <h3 className="font-serif text-lg text-[#1A1A1A] mb-4 leading-snug group-hover:text-[#B8860B] transition-colors duration-200">
            {product.name}
          </h3>
          
          {/* Price - Modern style */}
          <p className="font-sans text-lg font-medium tracking-wide text-[#1A1A1A]">
            {formatPrice(product.price)}
          </p>
        </div>
      </div>
    </Link>
  );
};

export default ProductCard;