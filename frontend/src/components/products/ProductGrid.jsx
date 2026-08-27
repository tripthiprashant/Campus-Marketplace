import React from 'react';
import ProductCard from './ProductCard';
import { SkeletonGrid } from '../common/SkeletonCard';
import EmptyState from '../common/EmptyState';

export const ProductGrid = ({
  products = [],
  categories = [],
  loading = false,
  emptyTitle = 'No products found',
  emptyDescription = 'Try adjusting your filters, keyword search, or price range.',
  emptyActionText,
  emptyActionLink,
  onEmptyActionClick,
}) => {
  if (loading) {
    return <SkeletonGrid count={8} />;
  }

  if (!products || products.length === 0) {
    return (
      <EmptyState
        title={emptyTitle}
        description={emptyDescription}
        actionText={emptyActionText}
        actionLink={emptyActionLink}
        onActionClick={onEmptyActionClick}
      />
    );
  }

  // Create a quick lookup for category names
  const categoryMap = new Map();
  if (Array.isArray(categories)) {
    categories.forEach((cat) => {
      categoryMap.set(cat.id, cat.name);
    });
  }

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5 sm:gap-6">
      {products.map((product) => (
        <ProductCard
          key={product.id}
          product={product}
          categoryName={categoryMap.get(product.category)}
        />
      ))}
    </div>
  );
};

export default ProductGrid;
