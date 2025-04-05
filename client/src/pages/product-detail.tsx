import { Helmet } from 'react-helmet';
import { useParams } from 'wouter';
import { useQuery } from '@tanstack/react-query';
import ProductDetail from '@/components/products/ProductDetail';
import { Skeleton } from '@/components/ui/skeleton';

const ProductDetailPage = () => {
  const { slug } = useParams();
  
  const { data: product, isLoading } = useQuery({
    queryKey: [`/api/products/${slug}`],
  });

  if (isLoading) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="flex flex-col md:flex-row gap-8">
          <div className="md:w-1/2">
            <Skeleton className="w-full aspect-square rounded-lg" />
          </div>
          <div className="md:w-1/2">
            <Skeleton className="h-10 w-3/4 mb-4" />
            <Skeleton className="h-6 w-1/2 mb-4" />
            <Skeleton className="h-8 w-1/3 mb-6" />
            <Skeleton className="h-24 w-full mb-6" />
            <Skeleton className="h-12 w-full mb-4" />
            <Skeleton className="h-12 w-full" />
          </div>
        </div>
      </div>
    );
  }

  return (
    <>
      <Helmet>
        <title>{product ? `${product.name} - FarmFresh Market` : 'Product - FarmFresh Market'}</title>
        <meta 
          name="description" 
          content={product?.description || 'View product details'} 
        />
      </Helmet>
      <ProductDetail />
    </>
  );
};

export default ProductDetailPage;
