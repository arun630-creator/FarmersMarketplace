import { useEffect } from 'react';
import { useParams, useLocation } from 'wouter';
import { useQuery } from '@tanstack/react-query';
import { Helmet } from 'react-helmet';
import ProductList from '@/components/products/ProductList';
import { 
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb";

const Products = () => {
  const params = useParams();
  const [location] = useLocation();
  const { slug } = params;
  
  const isCategory = location.includes('/category/');
  const isFarmer = location.includes('?farmer=');

  // Get farmerId from URL if present
  const farmerId = isFarmer 
    ? parseInt(new URLSearchParams(location.split('?')[1]).get('farmer') || '0')
    : undefined;

  // Fetch category details if viewing a category
  const { data: category } = useQuery({
    queryKey: isCategory ? [`/api/categories/${slug}`] : null,
    enabled: isCategory && !!slug,
  });

  // Fetch farmer details if viewing a farmer's products
  const { data: farmer } = useQuery({
    queryKey: farmerId ? [`/api/users/${farmerId}`] : null,
    enabled: !!farmerId,
  });

  // Page title based on context
  let pageTitle = "All Products";
  let pageDescription = "Browse our selection of fresh, locally-grown produce.";

  if (isCategory && category) {
    pageTitle = `${category.name}`;
    pageDescription = category.description || "Browse our selection of fresh, locally-grown produce.";
  } else if (farmerId && farmer) {
    pageTitle = `Products from ${farmer.farmName || `${farmer.firstName} ${farmer.lastName}`}`;
    pageDescription = farmer.farmDescription || "Browse products from this local farmer.";
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <Helmet>
        <title>{pageTitle} - FarmFresh Market</title>
        <meta name="description" content={pageDescription} />
      </Helmet>

      {/* Breadcrumb */}
      <Breadcrumb className="mb-6">
        <BreadcrumbItem>
          <BreadcrumbLink href="/">Home</BreadcrumbLink>
        </BreadcrumbItem>
        <BreadcrumbSeparator />
        {isCategory ? (
          <>
            <BreadcrumbItem>
              <BreadcrumbLink href="/products">Products</BreadcrumbLink>
            </BreadcrumbItem>
            <BreadcrumbSeparator />
            <BreadcrumbItem>
              <BreadcrumbLink isCurrentPage>{category?.name || "Loading..."}</BreadcrumbLink>
            </BreadcrumbItem>
          </>
        ) : isFarmer ? (
          <>
            <BreadcrumbItem>
              <BreadcrumbLink href="/products">Products</BreadcrumbLink>
            </BreadcrumbItem>
            <BreadcrumbSeparator />
            <BreadcrumbItem>
              <BreadcrumbLink isCurrentPage>
                {farmer ? (farmer.farmName || `${farmer.firstName} ${farmer.lastName}`) : "Loading..."}
              </BreadcrumbLink>
            </BreadcrumbItem>
          </>
        ) : (
          <BreadcrumbItem>
            <BreadcrumbLink isCurrentPage>Products</BreadcrumbLink>
          </BreadcrumbItem>
        )}
      </Breadcrumb>

      {/* Page Header */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-neutral-800 mb-2">{pageTitle}</h1>
        <p className="text-neutral-600">{pageDescription}</p>
      </div>

      {/* Product List */}
      <ProductList categorySlug={isCategory ? slug : undefined} farmerId={farmerId} />
    </div>
  );
};

export default Products;
