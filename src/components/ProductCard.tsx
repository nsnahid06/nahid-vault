import React, { useState } from 'react';
import { Star, Heart, ShoppingBag, Eye, Check } from 'lucide-react';
import { Product } from '../types';

interface ProductCardProps {
  product: Product;
  onSelectProduct: (product: Product) => void;
  onQuickAddToCart: (product: Product, e: React.MouseEvent) => void;
  isWishlisted: boolean;
  onToggleWishlist: (product: Product, e: React.MouseEvent) => void;
}

export const ProductCard: React.FC<ProductCardProps> = ({
  product,
  onSelectProduct,
  onQuickAddToCart,
  isWishlisted,
  onToggleWishlist,
}) => {
  const [currentImgIndex, setCurrentImgIndex] = useState(0);
  const [addedAnimation, setAddedAnimation] = useState(false);

  const handleAddToCart = (e: React.MouseEvent) => {
    e.stopPropagation();
    onQuickAddToCart(product, e);
    setAddedAnimation(true);
    setTimeout(() => setAddedAnimation(false), 1200);
  };

  const discountPercent = product.originalPrice
    ? Math.round(((product.originalPrice - product.price) / product.originalPrice) * 100)
    : 0;

  return (
    <div
      id={`product-card-${product.id}`}
      onClick={() => onSelectProduct(product)}
      onMouseEnter={() => product.images.length > 1 && setCurrentImgIndex(1)}
      onMouseLeave={() => setCurrentImgIndex(0)}
      className="group relative bg-neutral-900/80 backdrop-blur-md rounded-xl overflow-hidden border border-neutral-800/80 hover:border-amber-500/50 shadow-lg hover:shadow-amber-500/10 transition-all duration-300 flex flex-col cursor-pointer"
    >
      {/* Top Image Box */}
      <div className="relative aspect-[3/4] w-full bg-neutral-950 overflow-hidden">
        <img
          src={product.images[currentImgIndex] || product.images[0]}
          alt={product.title}
          referrerPolicy="no-referrer"
          className="w-full h-full object-cover object-center group-hover:scale-105 transition-transform duration-500"
        />

        {/* Badges Overlay */}
        <div className="absolute top-3 left-3 flex flex-col gap-1.5 z-10 items-start">
          {product.isBestSeller && (
            <span className="bg-amber-500 text-neutral-950 font-black text-[10px] uppercase tracking-wider px-2.5 py-1 rounded shadow">
              Best Seller
            </span>
          )}
          {product.isNewArrival && (
            <span className="bg-neutral-900 text-white border border-neutral-700 font-bold text-[10px] uppercase tracking-wider px-2.5 py-1 rounded shadow">
              New Arrival
            </span>
          )}
          {discountPercent > 0 && (
            <span className="bg-rose-600 text-white font-bold text-[10px] uppercase tracking-wider px-2.5 py-1 rounded shadow">
              -{discountPercent}% OFF
            </span>
          )}
        </div>

        {/* Wishlist Heart Button */}
        <button
          id={`wishlist-toggle-${product.id}`}
          onClick={(e) => onToggleWishlist(product, e)}
          className={`absolute top-3 right-3 p-2.5 rounded-full transition-all z-10 ${
            isWishlisted
              ? 'bg-rose-500 text-white shadow-md'
              : 'bg-neutral-900/80 backdrop-blur-sm text-stone-300 hover:text-rose-500 hover:bg-neutral-900'
          }`}
          title={isWishlisted ? 'Remove from wishlist' : 'Add to wishlist'}
        >
          <Heart className={`w-4 h-4 ${isWishlisted ? 'fill-current' : ''}`} />
        </button>

        {/* Quick View Button on Hover */}
        <div className="absolute inset-x-3 bottom-3 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex gap-2 z-10">
          <button
            id={`quick-view-btn-${product.id}`}
            onClick={(e) => {
              e.stopPropagation();
              onSelectProduct(product);
            }}
            className="flex-1 py-2.5 bg-neutral-900/90 hover:bg-neutral-950 text-white text-xs font-bold uppercase tracking-wider rounded-lg border border-neutral-700 backdrop-blur-sm flex items-center justify-center gap-1.5 shadow-lg transition-colors"
          >
            <Eye className="w-3.5 h-3.5 text-amber-400" />
            <span>Quick View</span>
          </button>
        </div>
      </div>

      {/* Card Details Body */}
      <div className="p-4 flex flex-col flex-1 justify-between space-y-3 text-left">
        <div className="space-y-1">
          <div className="flex items-center justify-between text-[11px] text-stone-400 font-medium">
            <span className="uppercase tracking-wider font-semibold text-amber-400">
              {product.category}
            </span>
            <div className="flex items-center gap-1 text-amber-500">
              <Star className="w-3.5 h-3.5 fill-current" />
              <span className="font-bold text-stone-200">{product.rating.toFixed(1)}</span>
              <span className="text-stone-400 text-[10px]">({product.reviewCount})</span>
            </div>
          </div>

          <h3 className="font-semibold text-white text-sm line-clamp-1 group-hover:text-amber-400 transition-colors">
            {product.title}
          </h3>

          <p className="text-xs text-stone-400 line-clamp-1 font-sans">
            {product.material}
          </p>
        </div>

        {/* Pricing & Add to Cart Action */}
        <div className="pt-2 border-t border-neutral-800 flex items-center justify-between">
          <div className="flex items-baseline gap-2">
            <span className="text-base font-black text-white font-serif">
              ${product.price}
            </span>
            {product.originalPrice && (
              <span className="text-xs text-stone-500 line-through">
                ${product.originalPrice}
              </span>
            )}
          </div>

          <button
            id={`add-to-cart-quick-${product.id}`}
            onClick={handleAddToCart}
            className={`px-3 py-2 rounded-lg text-xs font-bold uppercase tracking-wider flex items-center gap-1.5 transition-all active:scale-95 ${
              addedAnimation
                ? 'bg-emerald-600 text-white'
                : 'bg-amber-500 hover:bg-amber-400 text-neutral-950 shadow-sm'
            }`}
          >
            {addedAnimation ? (
              <>
                <Check className="w-3.5 h-3.5" />
                <span>Added</span>
              </>
            ) : (
              <>
                <ShoppingBag className="w-3.5 h-3.5" />
                <span>Add</span>
              </>
            )}
          </button>
        </div>
      </div>
    </div>
  );
};
