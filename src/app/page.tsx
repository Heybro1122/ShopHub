'use client'

import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { useSession, signOut } from 'next-auth/react'
import { useRouter } from 'next/navigation'
import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Input } from '@/components/ui/input'
import { Separator } from '@/components/ui/separator'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { 
  Star, 
  ShoppingCart, 
  Search, 
  Menu, 
  X, 
  ChevronRight, 
  ArrowRight, 
  Zap, 
  Shield, 
  Truck, 
  Heart,
  TrendingUp,
  Clock,
  Award,
  Users,
  Mail,
  Sparkles,
  Gift,
  Tag,
  Filter,
  Grid,
  List,
  Loader2,
  User,
  LogOut,
  Settings,
  Store
} from 'lucide-react'
import { useTheme } from 'next-themes'
import { toast } from 'sonner'
import Image from 'next/image'
import Link from 'next/link'

export default function EcommerceHero() {
  const { data: session, status } = useSession()
  const router = useRouter()
  const [isMenuOpen, setIsMenuOpen] = useState(false)
  const [searchQuery, setSearchQuery] = useState('')
  const [email, setEmail] = useState('')
  const [currentSlide, setCurrentSlide] = useState(0)
  const { theme } = useTheme()
  
  // Product and cart state
  const [products, setProducts] = useState([])
  const [categories, setCategories] = useState([])
  const [selectedCategory, setSelectedCategory] = useState('all')
  const [sortBy, setSortBy] = useState('featured')
  const [cartCount, setCartCount] = useState(0)
  const [loading, setLoading] = useState(true)
  const [viewMode, setViewMode] = useState('grid') // grid or list
  const [imageLoadingStates, setImageLoadingStates] = useState<{ [key: number]: boolean }>({})
  const [imageErrors, setImageErrors] = useState<{ [key: number]: boolean }>({})
  const [customerImageLoading, setCustomerImageLoading] = useState<{ [key: string]: boolean }>({})
  const [heroImageLoading, setHeroImageLoading] = useState<{ [key: string]: boolean }>({})
  
  const sessionId = session?.user?.id || 'guest-session'

  // Handle image loading
  const handleImageLoad = (productId: number) => {
    setImageLoadingStates(prev => ({ ...prev, [productId]: false }))
  }

  const handleImageError = (productId: number) => {
    setImageLoadingStates(prev => ({ ...prev, [productId]: false }))
    setImageErrors(prev => ({ ...prev, [productId]: true }))
  }

  const handleImageLoadStart = (productId: number) => {
    setImageLoadingStates(prev => ({ ...prev, [productId]: true }))
  }

  // Handle customer image loading
  const handleCustomerImageLoad = (customerName: string) => {
    setCustomerImageLoading(prev => ({ ...prev, [customerName]: false }))
  }

  const handleCustomerImageLoadStart = (customerName: string) => {
    setCustomerImageLoading(prev => ({ ...prev, [customerName]: true }))
  }

  // Handle hero image loading
  const handleHeroImageLoad = (productName: string) => {
    setHeroImageLoading(prev => ({ ...prev, [productName]: false }))
  }

  const handleHeroImageLoadStart = (productName: string) => {
    setHeroImageLoading(prev => ({ ...prev, [productName]: true }))
  }

  // Fetch products from API
  const fetchProducts = async () => {
    try {
      setLoading(true)
      const params = new URLSearchParams({
        category: selectedCategory,
        search: searchQuery,
        sort: sortBy,
        limit: '12'
      })
      
      const response = await fetch(`/api/products?${params}`)
      if (!response.ok) throw new Error('Failed to fetch products')
      
      const data = await response.json()
      setProducts(data.products || [])
      setCategories(data.categories || [])
    } catch (error) {
      console.error('Error fetching products:', error)
      toast.error('Failed to load products')
    } finally {
      setLoading(false)
    }
  }

  // Fetch cart count
  const fetchCartCount = async () => {
    try {
      const response = await fetch(`/api/cart?sessionId=${sessionId}`)
      if (!response.ok) return
      
      const data = await response.json()
      setCartCount(data.count || 0)
    } catch (error) {
      console.error('Error fetching cart:', error)
    }
  }

  // Add to cart function
  const addToCart = async (productId: number) => {
    try {
      const response = await fetch('/api/cart', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          productId,
          quantity: 1,
          sessionId
        })
      })
      
      if (!response.ok) throw new Error('Failed to add to cart')
      
      const data = await response.json()
      setCartCount(data.cartCount)
      toast.success('Product added to cart!')
    } catch (error) {
      console.error('Error adding to cart:', error)
      toast.error('Failed to add to cart')
    }
  }

  // Effects
  useEffect(() => {
    fetchProducts()
  }, [selectedCategory, searchQuery, sortBy])

  useEffect(() => {
    fetchCartCount()
  }, [])

  const heroSlides = [
    {
      title: "Summer Collection",
      subtitle: "Up to 50% Off",
      description: "Discover our latest summer essentials with exclusive discounts",
      cta: "Shop Now",
      badge: "Limited Time",
      gradient: "from-orange-400 to-pink-600"
    },
    {
      title: "Premium Quality",
      subtitle: "Handpicked Selection",
      description: "Experience the finest products curated just for you",
      cta: "Explore",
      badge: "New Arrival",
      gradient: "from-purple-400 to-indigo-600"
    },
    {
      title: "Flash Sale",
      subtitle: "24 Hours Only",
      description: "Grab your favorite items before they're gone",
      cta: "Don't Miss Out",
      badge: "Hot Deal",
      gradient: "from-red-400 to-orange-600"
    }
  ]

  const testimonials = [
    {
      name: "Sarah Johnson",
      role: "Verified Buyer",
      content: "Absolutely love the quality and fast delivery! This is my go-to store for all shopping needs.",
      rating: 5,
      avatar: "/customers/sarah.jpg"
    },
    {
      name: "Mike Chen",
      role: "Premium Member",
      content: "Best shopping experience ever! The customer service is outstanding and products are top-notch.",
      rating: 5,
      avatar: "/customers/mike.jpg"
    },
    {
      name: "Emma Davis",
      role: "Fashion Lover",
      content: "Trendy collections at amazing prices. I always find something unique here!",
      rating: 5,
      avatar: "/customers/emma.jpg"
    }
  ]

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % heroSlides.length)
    }, 5000)
    return () => clearInterval(timer)
  }, [])

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
        delayChildren: 0.2
      }
    }
  }

  const itemVariants = {
    hidden: { y: 20, opacity: 0 },
    visible: {
      y: 0,
      opacity: 1,
      transition: {
        type: "spring",
        stiffness: 100,
        damping: 12
      }
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 dark:from-gray-900 dark:to-gray-800">
      {/* Navigation Header */}
      <motion.header 
        initial={{ y: -100, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        className="sticky top-0 z-50 bg-white/80 dark:bg-gray-900/80 backdrop-blur-lg border-b border-gray-200 dark:border-gray-700"
      >
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-8">
              <motion.div 
                whileHover={{ scale: 1.05 }}
                className="text-2xl font-bold bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent"
              >
                ShopHub
              </motion.div>
              
              <nav className="hidden md:flex items-center space-x-6">
                {['Home', 'Products', 'Categories', 'Deals', 'About'].map((item) => (
                  <motion.a
                    key={item}
                    href="#"
                    whileHover={{ y: -2 }}
                    className="text-gray-600 dark:text-gray-300 hover:text-purple-600 dark:hover:text-purple-400 transition-colors"
                  >
                    {item}
                  </motion.a>
                ))}
              </nav>
            </div>

            <div className="flex items-center space-x-4">
              <div className="hidden md:flex items-center space-x-2 bg-gray-100 dark:bg-gray-800 rounded-full px-4 py-2">
                <Search className="w-4 h-4 text-gray-500" />
                <Input
                  placeholder="Search products..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="border-none bg-transparent outline-none w-64"
                />
              </div>

              {status === 'authenticated' ? (
                <>
                  <motion.div whileHover={{ scale: 1.1 }} whileTap={{ scale: 0.95 }}>
                    <Button variant="ghost" size="icon">
                      <Heart className="w-5 h-5" />
                    </Button>
                  </motion.div>

                  <motion.div whileHover={{ scale: 1.1 }} whileTap={{ scale: 0.95 }}>
                    <Button variant="ghost" size="icon" className="relative">
                      <ShoppingCart className="w-5 h-5" />
                      <Badge className="absolute -top-2 -right-2 w-5 h-5 rounded-full p-0 flex items-center justify-center text-xs">
                        {cartCount}
                      </Badge>
                    </Button>
                  </motion.div>

                  <div className="flex items-center space-x-2">
                    {session.user.avatar ? (
                      <div className="w-8 h-8 rounded-full overflow-hidden">
                        <Image
                          src={session.user.avatar}
                          alt={session.user.name || ''}
                          width={32}
                          height={32}
                          className="object-cover"
                        />
                      </div>
                    ) : (
                      <User className="w-5 h-5" />
                    )}
                    <span className="text-sm font-medium hidden md:block">
                      {session.user.name}
                    </span>
                  </div>

                  {session.user.role === 'admin' && (
                    <Link href="/admin">
                      <Button variant="outline" size="sm">
                        <Settings className="w-4 h-4 mr-2" />
                        Admin
                      </Button>
                    </Link>
                  )}

                  <Button variant="ghost" size="sm" onClick={() => signOut()}>
                    <LogOut className="w-4 h-4 mr-2" />
                    Sign Out
                  </Button>
                </>
              ) : (
                <>
                  <Link href="/auth/signin">
                    <Button variant="ghost" size="sm">
                      Sign In
                    </Button>
                  </Link>
                  <Link href="/auth/signup">
                    <Button size="sm">
                      Sign Up
                    </Button>
                  </Link>
                </>
              )}

              <Button
                variant="ghost"
                size="icon"
                className="md:hidden"
                onClick={() => setIsMenuOpen(!isMenuOpen)}
              >
                {isMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
              </Button>
            </div>
          </div>
        </div>
      </motion.header>

      {/* Hero Section */}
      <section className="relative overflow-hidden">
        <div className="container mx-auto px-4 py-16">
          <AnimatePresence mode="wait">
            <motion.div
              key={currentSlide}
              initial={{ opacity: 0, x: 100 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -100 }}
              transition={{ duration: 0.5 }}
              className="grid lg:grid-cols-2 gap-12 items-center"
            >
              <motion.div 
                variants={containerVariants}
                initial="hidden"
                animate="visible"
                className="space-y-8"
              >
                <motion.div variants={itemVariants} className="space-y-4">
                  <Badge className={`bg-gradient-to-r ${heroSlides[currentSlide].gradient} text-white border-none px-4 py-2`}>
                    <Sparkles className="w-4 h-4 mr-2" />
                    {heroSlides[currentSlide].badge}
                  </Badge>
                  
                  <motion.h1 
                    variants={itemVariants}
                    className="text-5xl lg:text-7xl font-bold text-gray-900 dark:text-white leading-tight"
                  >
                    <span className={`bg-gradient-to-r ${heroSlides[currentSlide].gradient} bg-clip-text text-transparent`}>
                      {heroSlides[currentSlide].title}
                    </span>
                    <br />
                    <span className="text-3xl lg:text-5xl text-gray-600 dark:text-gray-400">
                      {heroSlides[currentSlide].subtitle}
                    </span>
                  </motion.h1>
                  
                  <motion.p 
                    variants={itemVariants}
                    className="text-lg text-gray-600 dark:text-gray-400 max-w-lg"
                  >
                    {heroSlides[currentSlide].description}
                  </motion.p>
                </motion.div>

                <motion.div 
                  variants={itemVariants}
                  className="flex flex-col sm:flex-row gap-4"
                >
                  <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
                    <Button 
                      size="lg" 
                      className={`bg-gradient-to-r ${heroSlides[currentSlide].gradient} text-white border-none px-8 py-6 text-lg`}
                    >
                      {heroSlides[currentSlide].cta}
                      <ArrowRight className="ml-2 w-5 h-5" />
                    </Button>
                  </motion.div>
                  
                  <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
                    <Button variant="outline" size="lg" className="px-8 py-6 text-lg">
                      View Catalog
                      <ChevronRight className="ml-2 w-5 h-5" />
                    </Button>
                  </motion.div>
                </motion.div>

                <motion.div 
                  variants={itemVariants}
                  className="flex items-center gap-8 pt-4"
                >
                  <div className="flex items-center gap-2">
                    <TrendingUp className="w-5 h-5 text-green-500" />
                    <span className="text-sm font-medium">Free Shipping</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Shield className="w-5 h-5 text-blue-500" />
                    <span className="text-sm font-medium">Secure Payment</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Clock className="w-5 h-5 text-purple-500" />
                    <span className="text-sm font-medium">24/7 Support</span>
                  </div>
                </motion.div>
              </motion.div>

              <motion.div 
                initial={{ scale: 0.8, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                transition={{ delay: 0.3, duration: 0.5 }}
                className="relative"
              >
                <div className={`absolute inset-0 bg-gradient-to-r ${heroSlides[currentSlide].gradient} rounded-3xl blur-3xl opacity-30`} />
                <motion.div
                  animate={{ 
                    y: [0, -20, 0],
                    rotate: [0, 5, 0]
                  }}
                  transition={{ 
                    duration: 4,
                    repeat: Infinity,
                    ease: "easeInOut"
                  }}
                  className="relative bg-white dark:bg-gray-800 rounded-3xl p-8 shadow-2xl"
                >
                  <div className="text-center mb-6">
                    <h3 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">
                      Featured Products
                    </h3>
                    <p className="text-gray-600 dark:text-gray-400">
                      Discover our best-selling items
                    </p>
                  </div>
                  
                  <div className="grid grid-cols-2 gap-4">
                    {[
                      { name: "Wireless Headphones", image: "/products/headphones.jpg", price: "$299.99" },
                      { name: "Smart Watch", image: "/products/smartwatch.jpg", price: "$449.99" },
                      { name: "Premium Backpack", image: "/products/backpack.jpg", price: "$89.99" },
                      { name: "Wireless Speaker", image: "/products/speaker.jpg", price: "$159.99" }
                    ].map((product, index) => (
                      <motion.div
                        key={index}
                        whileHover={{ scale: 1.05 }}
                        className="bg-gray-50 dark:bg-gray-700 rounded-xl p-3 text-center"
                      >
                        <div className="relative aspect-square mb-2 rounded-lg overflow-hidden">
                          {heroImageLoading[product.name] && (
                            <div className="absolute inset-0 flex items-center justify-center bg-gray-100 dark:bg-gray-600">
                              <Loader2 className="w-4 h-4 animate-spin text-gray-400" />
                            </div>
                          )}
                          <Image
                            src={product.image}
                            alt={product.name}
                            fill
                            className={`object-cover transition-opacity duration-300 ${
                              heroImageLoading[product.name] ? 'opacity-0' : 'opacity-100'
                            }`}
                            sizes="(max-width: 768px) 50vw, 25vw"
                            onLoadStart={() => handleHeroImageLoadStart(product.name)}
                            onLoad={() => handleHeroImageLoad(product.name)}
                          />
                        </div>
                        <div className="text-xs font-medium text-gray-900 dark:text-white mb-1">
                          {product.name}
                        </div>
                        <div className="text-xs text-purple-600 dark:text-purple-400 font-semibold">
                          {product.price}
                        </div>
                      </motion.div>
                    ))}
                  </div>
                </motion.div>
              </motion.div>
            </motion.div>
          </AnimatePresence>

          {/* Slide Indicators */}
          <div className="flex justify-center mt-8 space-x-2">
            {heroSlides.map((_, index) => (
              <motion.button
                key={index}
                onClick={() => setCurrentSlide(index)}
                className={`w-2 h-2 rounded-full transition-all ${
                  currentSlide === index ? 'w-8 bg-purple-600' : 'bg-gray-300 dark:bg-gray-600'
                }`}
                whileHover={{ scale: 1.2 }}
                whileTap={{ scale: 0.8 }}
              />
            ))}
          </div>
        </div>
      </section>

      {/* Categories Section */}
      <section className="py-16 bg-white dark:bg-gray-900">
        <div className="container mx-auto px-4">
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-12"
          >
            <h2 className="text-4xl font-bold text-gray-900 dark:text-white mb-4">
              Shop by Category
            </h2>
            <p className="text-lg text-gray-600 dark:text-gray-400">
              Explore our wide range of products across different categories
            </p>
          </motion.div>

          <motion.div 
            variants={containerVariants}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-6"
          >
            {categories.length > 0 ? categories.map((category, index) => {
              const categoryIcons: { [key: string]: string } = {
                "Electronics": "💻",
                "Fashion": "👗", 
                "Home & Living": "🏠",
                "Sports": "⚽",
                "Books": "📚",
                "Toys": "🎮"
              }
              
              const categoryColors: { [key: string]: string } = {
                "Electronics": "bg-blue-100 text-blue-800",
                "Fashion": "bg-pink-100 text-pink-800",
                "Home & Living": "bg-green-100 text-green-800", 
                "Sports": "bg-yellow-100 text-yellow-800",
                "Books": "bg-purple-100 text-purple-800",
                "Toys": "bg-red-100 text-red-800"
              }
              
              return (
                <motion.div
                  key={category}
                  variants={itemVariants}
                  whileHover={{ y: -5, scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  className="cursor-pointer"
                  onClick={() => setSelectedCategory(category)}
                >
                  <Card className="h-full hover:shadow-lg transition-shadow">
                    <CardContent className="p-6 text-center">
                      <motion.div 
                        whileHover={{ rotate: 360 }}
                        transition={{ duration: 0.5 }}
                        className="text-4xl mb-3"
                      >
                        {categoryIcons[category] || "📦"}
                      </motion.div>
                      <h3 className="font-semibold text-gray-900 dark:text-white mb-1">
                        {category}
                      </h3>
                      <Badge variant="secondary" className={categoryColors[category] || "bg-gray-100 text-gray-800"}>
                        Shop Now
                      </Badge>
                    </CardContent>
                  </Card>
                </motion.div>
              )
            }) : (
              // Fallback hardcoded categories while loading
              [
                { name: "Electronics", icon: "💻", color: "bg-blue-100 text-blue-800" },
                { name: "Fashion", icon: "👗", color: "bg-pink-100 text-pink-800" },
                { name: "Home & Living", icon: "🏠", color: "bg-green-100 text-green-800" },
                { name: "Sports", icon: "⚽", color: "bg-yellow-100 text-yellow-800" },
                { name: "Books", icon: "📚", color: "bg-purple-100 text-purple-800" },
                { name: "Toys", icon: "🎮", color: "bg-red-100 text-red-800" }
              ].map((category, index) => (
                <motion.div
                  key={category.name}
                  variants={itemVariants}
                  whileHover={{ y: -5, scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  className="cursor-pointer"
                  onClick={() => setSelectedCategory(category.name)}
                >
                  <Card className="h-full hover:shadow-lg transition-shadow">
                    <CardContent className="p-6 text-center">
                      <motion.div 
                        whileHover={{ rotate: 360 }}
                        transition={{ duration: 0.5 }}
                        className="text-4xl mb-3"
                      >
                        {category.icon}
                      </motion.div>
                      <h3 className="font-semibold text-gray-900 dark:text-white mb-1">
                        {category.name}
                      </h3>
                      <Badge variant="secondary" className={category.color}>
                        Shop Now
                      </Badge>
                    </CardContent>
                  </Card>
                </motion.div>
              ))
            )}
          </motion.div>
        </div>
      </section>

      {/* Featured Products */}
      <section className="py-16 bg-gray-50 dark:bg-gray-800">
        <div className="container mx-auto px-4">
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-12"
          >
            <h2 className="text-4xl font-bold text-gray-900 dark:text-white mb-4">
              Featured Products
            </h2>
            <p className="text-lg text-gray-600 dark:text-gray-400">
              Handpicked items just for you
            </p>
          </motion.div>

          {/* Filters and Controls */}
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="mb-8 flex flex-col lg:flex-row gap-4 items-center justify-between"
          >
            <div className="flex flex-wrap gap-2">
              <Button
                variant={selectedCategory === 'all' ? 'default' : 'outline'}
                onClick={() => setSelectedCategory('all')}
                size="sm"
              >
                All Products
              </Button>
              {categories.map((category) => (
                <Button
                  key={category}
                  variant={selectedCategory === category ? 'default' : 'outline'}
                  onClick={() => setSelectedCategory(category)}
                  size="sm"
                >
                  {category}
                </Button>
              ))}
            </div>
            
            <div className="flex items-center gap-4">
              <Select value={sortBy} onValueChange={setSortBy}>
                <SelectTrigger className="w-40">
                  <SelectValue placeholder="Sort by" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="featured">Featured</SelectItem>
                  <SelectItem value="price-low">Price: Low to High</SelectItem>
                  <SelectItem value="price-high">Price: High to Low</SelectItem>
                  <SelectItem value="rating">Highest Rated</SelectItem>
                  <SelectItem value="name">Name: A-Z</SelectItem>
                </SelectContent>
              </Select>
              
              <div className="flex border rounded-md">
                <Button
                  variant={viewMode === 'grid' ? 'default' : 'ghost'}
                  size="sm"
                  onClick={() => setViewMode('grid')}
                >
                  <Grid className="w-4 h-4" />
                </Button>
                <Button
                  variant={viewMode === 'list' ? 'default' : 'ghost'}
                  size="sm"
                  onClick={() => setViewMode('list')}
                >
                  <List className="w-4 h-4" />
                </Button>
              </div>
            </div>
          </motion.div>

          {/* Products Grid/List */}
          {loading ? (
            <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
              {[...Array(8)].map((_, i) => (
                <Card key={i} className="h-full">
                  <CardContent className="p-6">
                    <div className="animate-pulse">
                      <div className="bg-gray-200 dark:bg-gray-700 h-32 rounded-lg mb-4"></div>
                      <div className="bg-gray-200 dark:bg-gray-700 h-4 rounded mb-2"></div>
                      <div className="bg-gray-200 dark:bg-gray-700 h-4 rounded w-3/4"></div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          ) : (
            <motion.div 
              variants={containerVariants}
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true }}
              className={viewMode === 'grid' ? 'grid md:grid-cols-2 lg:grid-cols-4 gap-6' : 'space-y-4'}
            >
              {products.map((product: any, index) => (
                <motion.div
                  key={product.id}
                  variants={itemVariants}
                  whileHover={{ y: -10 }}
                  className="group"
                >
                  <Card className="h-full hover:shadow-xl transition-all duration-300 overflow-hidden">
                    <CardContent className="p-6">
                      <div className="relative mb-4 aspect-square overflow-hidden rounded-lg bg-gray-100 dark:bg-gray-800">
                        {imageLoadingStates[product.id] && (
                          <div className="absolute inset-0 flex items-center justify-center">
                            <Loader2 className="w-8 h-8 animate-spin text-gray-400" />
                          </div>
                        )}
                        
                        {imageErrors[product.id] ? (
                          <div className="absolute inset-0 flex items-center justify-center">
                            <div className="text-center">
                              <div className="text-4xl mb-2">📦</div>
                              <p className="text-sm text-gray-500">Image not available</p>
                            </div>
                          </div>
                        ) : (
                          <Image
                            src={product.image}
                            alt={product.name}
                            fill
                            className={`object-cover transition-all duration-300 group-hover:scale-110 ${
                              imageLoadingStates[product.id] ? 'opacity-0' : 'opacity-100'
                            }`}
                            onLoadStart={() => handleImageLoadStart(product.id)}
                            onLoad={() => handleImageLoad(product.id)}
                            onError={() => handleImageError(product.id)}
                            sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 25vw"
                          />
                        )}
                        
                        {product.badge && (
                          <Badge className="absolute top-2 right-2 bg-red-500 text-white z-10">
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
                      
                      <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
                        <Button 
                          className="w-full bg-gradient-to-r from-purple-600 to-pink-600 text-white"
                          onClick={() => addToCart(product.id)}
                        >
                          <ShoppingCart className="w-4 h-4 mr-2" />
                          Add to Cart
                        </Button>
                      </motion.div>
                    </CardContent>
                  </Card>
                </motion.div>
              ))}
            </motion.div>
          )}

          {products.length === 0 && !loading && (
            <div className="text-center py-12">
              <p className="text-gray-500 dark:text-gray-400">No products found matching your criteria.</p>
            </div>
          )}
        </div>
      </section>

      {/* Features Section */}
      <section className="py-16 bg-white dark:bg-gray-900">
        <div className="container mx-auto px-4">
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="grid md:grid-cols-2 lg:grid-cols-4 gap-8"
          >
            {[
              { icon: Truck, title: "Free Shipping", description: "On orders over $50" },
              { icon: Shield, title: "Secure Payment", description: "100% secure transactions" },
              { icon: Award, title: "Quality Guarantee", description: "Premium quality products" },
              { icon: Users, title: "24/7 Support", description: "Dedicated customer service" }
            ].map((feature, index) => (
              <motion.div
                key={feature.title}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.1 }}
                whileHover={{ y: -5 }}
                className="text-center"
              >
                <motion.div
                  whileHover={{ rotate: 360 }}
                  transition={{ duration: 0.5 }}
                  className="w-16 h-16 bg-gradient-to-r from-purple-600 to-pink-600 rounded-full flex items-center justify-center mx-auto mb-4"
                >
                  <feature.icon className="w-8 h-8 text-white" />
                </motion.div>
                <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">
                  {feature.title}
                </h3>
                <p className="text-gray-600 dark:text-gray-400">
                  {feature.description}
                </p>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* Testimonials */}
      <section className="py-16 bg-gray-50 dark:bg-gray-800">
        <div className="container mx-auto px-4">
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-12"
          >
            <h2 className="text-4xl font-bold text-gray-900 dark:text-white mb-4">
              What Our Customers Say
            </h2>
            <p className="text-lg text-gray-600 dark:text-gray-400">
              Join thousands of satisfied customers
            </p>
          </motion.div>

          <motion.div 
            variants={containerVariants}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            className="grid md:grid-cols-3 gap-8"
          >
            {testimonials.map((testimonial, index) => (
              <motion.div
                key={index}
                variants={itemVariants}
                whileHover={{ scale: 1.05 }}
              >
                <Card className="h-full">
                  <CardContent className="p-6">
                    <div className="flex items-center mb-4">
                      <div className="relative w-12 h-12 mr-3 rounded-full overflow-hidden">
                        {customerImageLoading[testimonial.name] && (
                          <div className="absolute inset-0 flex items-center justify-center bg-gray-200 dark:bg-gray-600">
                            <Loader2 className="w-4 h-4 animate-spin text-gray-400" />
                          </div>
                        )}
                        <Image
                          src={testimonial.avatar}
                          alt={testimonial.name}
                          fill
                          className={`object-cover transition-opacity duration-300 ${
                            customerImageLoading[testimonial.name] ? 'opacity-0' : 'opacity-100'
                          }`}
                          sizes="48px"
                          onLoadStart={() => handleCustomerImageLoadStart(testimonial.name)}
                          onLoad={() => handleCustomerImageLoad(testimonial.name)}
                        />
                      </div>
                      <div>
                        <h4 className="font-semibold text-gray-900 dark:text-white">
                          {testimonial.name}
                        </h4>
                        <p className="text-sm text-gray-600 dark:text-gray-400">
                          {testimonial.role}
                        </p>
                      </div>
                    </div>
                    
                    <div className="flex mb-3">
                      {[...Array(testimonial.rating)].map((_, i) => (
                        <Star
                          key={i}
                          className="w-4 h-4 text-yellow-400 fill-current"
                        />
                      ))}
                    </div>
                    
                    <p className="text-gray-600 dark:text-gray-400 italic">
                      "{testimonial.content}"
                    </p>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* Newsletter Section */}
      <section className="py-16 bg-gradient-to-r from-purple-600 to-pink-600">
        <div className="container mx-auto px-4">
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center text-white max-w-2xl mx-auto"
          >
            <motion.div
              animate={{ rotate: 360 }}
              transition={{ duration: 10, repeat: Infinity, ease: "linear" }}
              className="w-16 h-16 bg-white/20 rounded-full flex items-center justify-center mx-auto mb-6"
            >
              <Mail className="w-8 h-8 text-white" />
            </motion.div>
            
            <h2 className="text-4xl font-bold mb-4">
              Stay in the Loop
            </h2>
            <p className="text-xl mb-8 text-white/90">
              Subscribe to our newsletter for exclusive deals and new product updates
            </p>
            
            <motion.div 
              className="flex flex-col sm:flex-row gap-4 max-w-md mx-auto"
              whileHover={{ scale: 1.02 }}
            >
              <Input
                type="email"
                placeholder="Enter your email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="flex-1 px-6 py-3 rounded-full bg-white/20 backdrop-blur-sm border-white/30 text-white placeholder-white/70"
              />
              <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
                <Button className="px-8 py-3 rounded-full bg-white text-purple-600 hover:bg-gray-100 font-semibold">
                  Subscribe
                </Button>
              </motion.div>
            </motion.div>
          </motion.div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-gray-900 text-white py-12">
        <div className="container mx-auto px-4">
          <div className="grid md:grid-cols-4 gap-8 mb-8">
            <div>
              <h3 className="text-2xl font-bold bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent mb-4">
                ShopHub
              </h3>
              <p className="text-gray-400">
                Your trusted online shopping destination for quality products and exceptional service.
              </p>
            </div>
            
            <div>
              <h4 className="font-semibold mb-4">Quick Links</h4>
              <ul className="space-y-2 text-gray-400">
                <li><a href="#" className="hover:text-white transition-colors">About Us</a></li>
                <li><a href="#" className="hover:text-white transition-colors">Contact</a></li>
                <li><a href="#" className="hover:text-white transition-colors">FAQs</a></li>
                <li><a href="#" className="hover:text-white transition-colors">Shipping Info</a></li>
              </ul>
            </div>
            
            <div>
              <h4 className="font-semibold mb-4">Customer Service</h4>
              <ul className="space-y-2 text-gray-400">
                <li><a href="#" className="hover:text-white transition-colors">Track Order</a></li>
                <li><a href="#" className="hover:text-white transition-colors">Returns</a></li>
                <li><a href="#" className="hover:text-white transition-colors">Warranty</a></li>
                <li><a href="#" className="hover:text-white transition-colors">Support</a></li>
              </ul>
            </div>
            
            <div>
              <h4 className="font-semibold mb-4">Connect</h4>
              <ul className="space-y-2 text-gray-400">
                <li><a href="#" className="hover:text-white transition-colors">Facebook</a></li>
                <li><a href="#" className="hover:text-white transition-colors">Twitter</a></li>
                <li><a href="#" className="hover:text-white transition-colors">Instagram</a></li>
                <li><a href="#" className="hover:text-white transition-colors">LinkedIn</a></li>
              </ul>
            </div>
          </div>
          
          <Separator className="bg-gray-800 mb-8" />
          
          <div className="text-center text-gray-400">
            <p>&copy; 2024 ShopHub. All rights reserved. Made with ❤️ for amazing shoppers.</p>
          </div>
        </div>
      </footer>
    </div>
  )
}