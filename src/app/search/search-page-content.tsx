'use client'

import { useState, useEffect } from 'react'
import { useSearchParams } from 'next/navigation'
import { motion } from 'framer-motion'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Card, CardContent } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Separator } from '@/components/ui/separator'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Slider } from '@/components/ui/slider'
import { Checkbox } from '@/components/ui/checkbox'
import { 
  Search, 
  Filter, 
  X, 
  Star, 
  ShoppingCart, 
  Heart, 
  SlidersHorizontal,
  Grid,
  List,
  ChevronDown,
  Loader2
} from 'lucide-react'
import { toast } from 'sonner'
import Image from 'next/image'
import Link from 'next/link'

interface Product {
  id: number
  name: string
  description: string
  price: number
  originalPrice?: number
  rating: number
  reviews: number
  badge?: string
  category: string
  image: string
  features: string[]
  stock: number
}

interface Filters {
  category: string[]
  priceRange: [number, number]
  rating: number
  inStock: boolean
  sortBy: string
  viewMode: 'grid' | 'list'
}

export default function SearchPageContent() {
  const searchParams = useSearchParams()
  const initialQuery = searchParams.get('q') || ''
  
  const [query, setQuery] = useState(initialQuery)
  const [products, setProducts] = useState<Product[]>([])
  const [loading, setLoading] = useState(false)
  const [showFilters, setShowFilters] = useState(false)
  const [cartCount, setCartCount] = useState(0)
  
  const [filters, setFilters] = useState<Filters>({
    category: [],
    priceRange: [0, 1000],
    rating: 0,
    inStock: true,
    sortBy: 'relevance',
    viewMode: 'grid'
  })

  const categories = [
    'Electronics',
    'Fashion',
    'Home & Living',
    'Sports',
    'Books',
    'Toys'
  ]

  const sortOptions = [
    { value: 'relevance', label: 'Relevance' },
    { value: 'price-low', label: 'Price: Low to High' },
    { value: 'price-high', label: 'Price: High to Low' },
    { value: 'rating', label: 'Highest Rated' },
    { value: 'newest', label: 'Newest First' },
    { value: 'bestselling', label: 'Best Selling' }
  ]

  useEffect(() => {
    if (initialQuery) {
      handleSearch()
    }
  }, [])

  const handleSearch = async () => {
    if (!query.trim()) {
      toast.error('Please enter a search term')
      return
    }

    setLoading(true)
    try {
      const params = new URLSearchParams({
        q: query,
        category: filters.category.join(','),
        minPrice: filters.priceRange[0].toString(),
        maxPrice: filters.priceRange[1].toString(),
        rating: filters.rating.toString(),
        inStock: filters.inStock.toString(),
        sortBy: filters.sortBy
      })

      const response = await fetch(`/api/search?${params}`)
      if (!response.ok) throw new Error('Search failed')
      
      const data = await response.json()
      setProducts(data.products || [])
    } catch (error) {
      console.error('Search error:', error)
      toast.error('Search failed. Please try again.')
    } finally {
      setLoading(false)
    }
  }

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      handleSearch()
    }
  }

  const updateFilter = (key: keyof Filters, value: any) => {
    setFilters(prev => ({ ...prev, [key]: value }))
  }

  const toggleCategory = (category: string) => {
    setFilters(prev => ({
      ...prev,
      category: prev.category.includes(category)
        ? prev.category.filter(c => c !== category)
        : [...prev.category, category]
    }))
  }

  const clearFilters = () => {
    setFilters({
      category: [],
      priceRange: [0, 1000],
      rating: 0,
      inStock: true,
      sortBy: 'relevance',
      viewMode: 'grid'
    })
  }

  const addToCart = async (productId: number) => {
    try {
      const response = await fetch('/api/cart', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ productId, quantity: 1 })
      })
      
      if (!response.ok) throw new Error('Failed to add to cart')
      
      const data = await response.json()
      setCartCount(data.cartCount)
      toast.success('Product added to cart!')
    } catch (error) {
      toast.error('Failed to add to cart')
    }
  }

  const activeFiltersCount = 
    filters.category.length + 
    (filters.priceRange[0] > 0 || filters.priceRange[1] < 1000 ? 1 : 0) +
    (filters.rating > 0 ? 1 : 0) +
    (!filters.inStock ? 1 : 0)

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      {/* Search Header */}
      <div className="bg-white dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700 sticky top-0 z-40">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center space-x-4">
            <div className="flex-1 relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
              <Input
                type="text"
                placeholder="Search for products..."
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                onKeyPress={handleKeyPress}
                className="pl-12 pr-4 py-3 text-lg"
              />
              <Button
                onClick={handleSearch}
                disabled={loading}
                className="absolute right-2 top-1/2 transform -translate-y-1/2"
              >
                {loading ? <Loader2 className="w-4 h-4 animate-spin" /> : 'Search'}
              </Button>
            </div>
            
            <Button
              variant="outline"
              onClick={() => setShowFilters(!showFilters)}
              className="flex items-center space-x-2"
            >
              <SlidersHorizontal className="w-4 h-4" />
              <span>Filters</span>
              {activeFiltersCount > 0 && (
                <Badge variant="secondary" className="ml-2">
                  {activeFiltersCount}
                </Badge>
              )}
            </Button>

            <div className="flex items-center space-x-2 border rounded-md">
              <Button
                variant={filters.viewMode === 'grid' ? 'default' : 'ghost'}
                size="sm"
                onClick={() => updateFilter('viewMode', 'grid')}
              >
                <Grid className="w-4 h-4" />
              </Button>
              <Button
                variant={filters.viewMode === 'list' ? 'default' : 'ghost'}
                size="sm"
                onClick={() => updateFilter('viewMode', 'list')}
              >
                <List className="w-4 h-4" />
              </Button>
            </div>
          </div>
        </div>
      </div>

      <div className="container mx-auto px-4 py-6">
        <div className="flex gap-6">
          {/* Filters Sidebar */}
          <div className={`w-80 ${showFilters ? 'block' : 'hidden lg:block'}`}>
            <Card>
              <CardContent className="p-6">
                <div className="flex items-center justify-between mb-6">
                  <h3 className="text-lg font-semibold">Filters</h3>
                  <Button variant="ghost" size="sm" onClick={clearFilters}>
                    Clear all
                  </Button>
                </div>

                {/* Categories */}
                <div className="mb-6">
                  <h4 className="font-medium mb-3">Categories</h4>
                  <div className="space-y-2">
                    {categories.map(category => (
                      <div key={category} className="flex items-center space-x-2">
                        <Checkbox
                          id={category}
                          checked={filters.category.includes(category)}
                          onCheckedChange={() => toggleCategory(category)}
                        />
                        <label htmlFor={category} className="text-sm">
                          {category}
                        </label>
                      </div>
                    ))}
                  </div>
                </div>

                <Separator className="my-6" />

                {/* Price Range */}
                <div className="mb-6">
                  <h4 className="font-medium mb-3">Price Range</h4>
                  <div className="space-y-4">
                    <Slider
                      value={filters.priceRange}
                      onValueChange={(value) => updateFilter('priceRange', value as [number, number])}
                      max={1000}
                      step={10}
                      className="w-full"
                    />
                    <div className="flex items-center justify-between text-sm">
                      <span>${filters.priceRange[0]}</span>
                      <span>${filters.priceRange[1]}</span>
                    </div>
                  </div>
                </div>

                <Separator className="my-6" />

                {/* Rating */}
                <div className="mb-6">
                  <h4 className="font-medium mb-3">Minimum Rating</h4>
                  <div className="space-y-2">
                    {[4, 3, 2, 1].map(rating => (
                      <div key={rating} className="flex items-center space-x-2">
                        <Checkbox
                          id={`rating-${rating}`}
                          checked={filters.rating === rating}
                          onCheckedChange={() => updateFilter('rating', rating)}
                        />
                        <label htmlFor={`rating-${rating}`} className="text-sm flex items-center">
                          <div className="flex items-center">
                            {[...Array(5)].map((_, i) => (
                              <Star
                                key={i}
                                className={`w-4 h-4 ${
                                  i < rating ? 'text-yellow-400 fill-current' : 'text-gray-300'
                                }`}
                              />
                            ))}
                          </div>
                          <span className="ml-2">& up</span>
                        </label>
                      </div>
                    ))}
                  </div>
                </div>

                <Separator className="my-6" />

                {/* Stock */}
                <div className="mb-6">
                  <h4 className="font-medium mb-3">Availability</h4>
                  <div className="flex items-center space-x-2">
                    <Checkbox
                      id="inStock"
                      checked={filters.inStock}
                      onCheckedChange={(checked) => updateFilter('inStock', checked)}
                    />
                    <label htmlFor="inStock" className="text-sm">
                      In Stock Only
                    </label>
                  </div>
                </div>

                <Separator className="my-6" />

                {/* Sort */}
                <div>
                  <h4 className="font-medium mb-3">Sort By</h4>
                  <Select value={filters.sortBy} onValueChange={(value) => updateFilter('sortBy', value)}>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      {sortOptions.map(option => (
                        <SelectItem key={option.value} value={option.value}>
                          {option.label}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Results */}
          <div className="flex-1">
            {loading ? (
              <div className="flex items-center justify-center h-64">
                <Loader2 className="w-8 h-8 animate-spin" />
              </div>
            ) : (
              <>
                <div className="mb-6">
                  <p className="text-gray-600 dark:text-gray-400">
                    {products.length} results for "{query}"
                  </p>
                </div>

                {products.length === 0 ? (
                  <div className="text-center py-12">
                    <div className="text-6xl mb-4">🔍</div>
                    <h3 className="text-xl font-semibold mb-2">No products found</h3>
                    <p className="text-gray-600 dark:text-gray-400">
                      Try adjusting your search or filters
                    </p>
                  </div>
                ) : (
                  <div className={filters.viewMode === 'grid' ? 'grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6' : 'space-y-4'}>
                    {products.map((product) => (
                      <motion.div
                        key={product.id}
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.3 }}
                      >
                        <Card className="group hover:shadow-lg transition-shadow">
                          <CardContent className="p-6">
                            <div className="relative mb-4 aspect-square overflow-hidden rounded-lg bg-gray-100 dark:bg-gray-800">
                              <Image
                                src={product.image}
                                alt={product.name}
                                fill
                                className="object-cover group-hover:scale-105 transition-transform duration-300"
                                sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                              />
                              {product.badge && (
                                <Badge className="absolute top-2 right-2 bg-red-500 text-white">
                                  {product.badge}
                                </Badge>
                              )}
                            </div>
                            
                            <h3 className="font-semibold text-gray-900 dark:text-white mb-2">
                              {product.name}
                            </h3>
                            
                            <p className="text-sm text-gray-600 dark:text-gray-400 mb-3 line-clamp-2">
                              {product.description}
                            </p>
                            
                            <div className="flex items-center mb-2">
                              <div className="flex items-center">
                                {[...Array(5)].map((_, i) => (
                                  <Star
                                    key={i}
                                    className={`w-4 h-4 ${
                                      i < Math.floor(product.rating)
                                        ? 'text-yellow-400 fill-current'
                                        : 'text-gray-300'
                                    }`}
                                  />
                                ))}
                              </div>
                              <span className="text-sm text-gray-600 dark:text-gray-400 ml-2">
                                ({product.reviews})
                              </span>
                            </div>
                            
                            <div className="flex items-center justify-between mb-4">
                              <div>
                                <span className="text-2xl font-bold text-gray-900 dark:text-white">
                                  ${product.price}
                                </span>
                                {product.originalPrice && (
                                  <span className="text-sm text-gray-500 line-through ml-2">
                                    ${product.originalPrice}
                                  </span>
                                )}
                              </div>
                              {product.originalPrice && (
                                <Badge variant="destructive">
                                  -{Math.round((1 - product.price / product.originalPrice) * 100)}%
                                </Badge>
                              )}
                            </div>
                            
                            <div className="flex space-x-2">
                              <Button
                                className="flex-1"
                                onClick={() => addToCart(product.id)}
                              >
                                <ShoppingCart className="w-4 h-4 mr-2" />
                                Add to Cart
                              </Button>
                              <Button variant="outline" size="icon">
                                <Heart className="w-4 h-4" />
                              </Button>
                            </div>
                          </CardContent>
                        </Card>
                      </motion.div>
                    ))}
                  </div>
                )}
              </>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}