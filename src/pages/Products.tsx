
import React, { useState, useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import ProductGrid from '@/components/ProductGrid';
import CategoryFilter from '@/components/CategoryFilter';
import { Product } from '@/types';
import { products, getAllCategories, searchProducts } from '@/data/products';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';

const ProductsPage: React.FC = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const queryParams = new URLSearchParams(location.search);
  
  const [filteredProducts, setFilteredProducts] = useState<Product[]>(products);
  const [selectedCategory, setSelectedCategory] = useState<string | null>(
    queryParams.get('category') || null
  );
  const [searchQuery, setSearchQuery] = useState<string>(
    queryParams.get('search') || ''
  );
  const [sortBy, setSortBy] = useState<string>('featured');
  
  const categories = getAllCategories();

  // Filter products based on category, search query, and sort option
  useEffect(() => {
    let result = [...products];
    
    // Apply category filter
    if (selectedCategory) {
      result = result.filter(product => product.category === selectedCategory);
    }
    
    // Apply search filter if there's a query
    if (searchQuery.trim()) {
      result = searchProducts(searchQuery);
    }
    
    // Apply sorting
    switch (sortBy) {
      case 'price-low':
        result = result.sort((a, b) => a.rentPrice - b.rentPrice);
        break;
      case 'price-high':
        result = result.sort((a, b) => b.rentPrice - a.rentPrice);
        break;
      case 'name-asc':
        result = result.sort((a, b) => a.name.localeCompare(b.name));
        break;
      case 'name-desc':
        result = result.sort((a, b) => b.name.localeCompare(a.name));
        break;
      default: // 'featured'
        result = result.sort((a, b) => (b.featured ? 1 : 0) - (a.featured ? 1 : 0));
    }
    
    setFilteredProducts(result);
    
    // Update URL with filters
    const params = new URLSearchParams();
    if (selectedCategory) params.set('category', selectedCategory);
    if (searchQuery) params.set('search', searchQuery);
    navigate(`/products?${params.toString()}`, { replace: true });
  }, [selectedCategory, searchQuery, sortBy, navigate]);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
  };

  const handleCategorySelect = (category: string | null) => {
    setSelectedCategory(category);
  };

  const handleSortChange = (value: string) => {
    setSortBy(value);
  };

  const handleSearchChange = (query: string) => {
    setSearchQuery(query);
  };

  return (
    <div className="min-h-screen flex flex-col">
      <Navbar onSearch={handleSearchChange} />
      <main className="flex-grow pt-24 pb-16">
        <div className="container mx-auto px-4">
          <div className="mb-8">
            <h1 className="text-3xl font-bold text-mediease-900">Healthcare Equipment</h1>
            <p className="text-gray-600 mt-2">Browse our collection of quality medical equipment for rent or purchase.</p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
            {/* Filters Sidebar */}
            <div className="lg:col-span-1">
              <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-100 sticky top-24">
                {/* Search (Mobile Only) */}
                <div className="block lg:hidden mb-6">
                  <h2 className="text-lg font-semibold mb-3">Search</h2>
                  <form onSubmit={handleSearch} className="flex">
                    <Input
                      type="text"
                      placeholder="Search products..."
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                      className="mr-2"
                    />
                    <Button type="submit" className="bg-mediease-600 hover:bg-mediease-700">
                      Search
                    </Button>
                  </form>
                </div>
                
                {/* Category Filter */}
                <CategoryFilter
                  categories={categories}
                  selectedCategory={selectedCategory}
                  onSelectCategory={handleCategorySelect}
                />
              </div>
            </div>

            {/* Products */}
            <div className="lg:col-span-3">
              {/* Sort Controls */}
              <div className="flex justify-between items-center mb-6">
                <p className="text-gray-600">{filteredProducts.length} products</p>
                <div className="flex items-center">
                  <span className="mr-2 text-gray-600">Sort by:</span>
                  <Select value={sortBy} onValueChange={handleSortChange}>
                    <SelectTrigger className="w-[180px]">
                      <SelectValue placeholder="Sort by" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="featured">Featured</SelectItem>
                      <SelectItem value="price-low">Price: Low to High</SelectItem>
                      <SelectItem value="price-high">Price: High to Low</SelectItem>
                      <SelectItem value="name-asc">Name: A to Z</SelectItem>
                      <SelectItem value="name-desc">Name: Z to A</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>

              {/* Product Grid */}
              <ProductGrid products={filteredProducts} />
            </div>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default ProductsPage;
