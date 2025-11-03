'use client'

import { useState, useEffect } from 'react'
import { useSession } from 'next-auth/react'
import { useRouter } from 'next/navigation'
import { motion } from 'framer-motion'
import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { 
  Heart, 
  ShoppingCart, 
  Star, 
  Trash2, 
  ArrowLeft,
  Loader2,
  Package
} from 'lucide-react'
import { toast } from 'sonner'
import Image from 'next/image'
import Link from 'next/link'

interface WishlistItem {
  id: string
  product_id: string
  product: {
    id: string
    name: string
    description: string
    price: number
    original_price?: number
    rating: number
    reviews_count: number
    badge?: string
    category: string
    image_url: string
    stock: number
  }
  created_at: string
}

export default function WishlistPage() {
  const { data: session, status } = useSession()
  const router = useRouter()
  const [wishlistItems, setWishlistItems] = useState<WishlistItem[]>([])
  const [loading, setLoading] = useState(true)
  const [removingItems, setRemovingItems] = useState<Set<string>>(new Set())

  useEffect(() => {
    if (status === 'loading') return
    
    if (!session) {
      router.push('/auth/signin?callbackUrl=/wishlist')
      return
    }

    fetchWishlist()
  }, [session, status, router])

  const fetchWishlist = async () => {
    try {
      setLoading(true)
      const response = await fetch('/api/wishlist')
      if (!response.ok) throw new Error('Failed to fetch wishlist')
      
      const data = await response.json()
      setWishlistItems(data.items || [])
    } catch (error) {
      console.error('Error fetching wishlist:', error)
      toast.error('Failed to load wishlist')
    } finally {
      setLoading(false)
    }
  }

  const removeFromWishlist = async (productId: string) => {
    try {
      setRemovingItems(prev => new Set(prev).add(productId))
      
      const response = await fetch(`/api/wishlist?productId=${productId}`, {
        method: 'DELETE'
      })
      
      if (!response.ok) throw new Error('Failed to remove from wishlist')
      
      setWishlistItems(prev => prev.filter(item => item.product_id !== productId))
      toast.success('Removed from wishlist')
    } catch (error) {
      console.error('Error removing from wishlist:', error)
      toast.error('Failed to remove from wishlist')
    } finally {
      setRemovingItems(prev => {
        const newSet = new Set(prev)
        newSet.delete(productId)
        return newSet
      })
    }
  }

  const addToCart = async (productId: string) => {
    try {
      const response = await fetch('/api/cart', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ productId, quantity: 1 })
      })
      
      if (!response.ok) throw new Error('Failed to add to cart')
      
      toast.success('Added to cart!')
      // Optionally remove from wishlist after adding to cart
      // removeFromWishlist(productId)
    } catch (error) {
      toast.error('Failed to add to cart')
    }
  }

  const clearWishlist = async () => {
    if (!confirm('Are you sure you want to clear your entire wishlist?')) return
    
    try {
      const response = await fetch('/api/wishlist', { method: 'DELETE' })
      if (!response.ok) throw new Error('Failed to clear wishlist')
      
      setWishlistItems([])
      toast.success('Wishlist cleared')
    } catch (error) {
      console.error('Error clearing wishlist:', error)
      toast.error('Failed to clear wishlist')
    }
  }

  if (status === 'loading' || loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-purple-600"></div>
      </div>
    )
  }

  if (!session) {
    return null
  }

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      {/* Header */}
      <div className="bg-white dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <Link href="/">
                <Button variant="ghost" size="sm">
                  <ArrowLeft className="w-4 h-4 mr-2" />
                  Back to Shop
                </Button>
              </Link>
              <h1 className="text-2xl font-bold text-gray-900 dark:text-white">
                My Wishlist
              </h1>
              <Badge variant="secondary">
                {wishlistItems.length} items
              </Badge>
            </div>
            
            {wishlistItems.length > 0 && (
              <Button variant="outline" onClick={clearWishlist}>
                <Trash2 className="w-4 h-4 mr-2" />
                Clear All
              </Button>
            )}
          </div>
        </div>
      </div>

      <div className="container mx-auto px-4 py-8">
        {wishlistItems.length === 0 ? (
          <div className="text-center py-16">
            <div className="w-24 h-24 bg-gray-100 dark:bg-gray-800 rounded-full flex items-center justify-center mx-auto mb-6">
              <Heart className="w-12 h-12 text-gray-400" />
            </div>
            <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">
              Your wishlist is empty
            </h2>
            <p className="text-gray-600 dark:text-gray-400 mb-8">
              Start adding items you love to your wishlist
            </p>
            <Link href="/">
              <Button>
                <Package className="w-4 h-4 mr-2" />
                Continue Shopping
              </Button>
            </Link>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {wishlistItems.map((item) => (
              <motion.div
                key={item.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.3 }}
              >
                <Card className="group hover:shadow-lg transition-shadow">
                  <CardContent className="p-6">
                    <div className="relative mb-4">
                      <div className="aspect-square overflow-hidden rounded-lg bg-gray-100 dark:bg-gray-800">
                        <Image
                          src={item.product.image_url}
                          alt={item.product.name}
                          fill
                          className="object-cover group-hover:scale-105 transition-transform duration-300"
                          sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 25vw"
                        />
                      </div>
                      
                      {item.product.badge && (
                        <Badge className="absolute top-2 right-2 bg-red-500 text-white">
                          {item.product.badge}
                        </Badge>
                      )}
                      
                      <Button
                        variant="ghost"
                        size="icon"
                        className="absolute top-2 left-2 bg-white/80 hover:bg-white"
                        onClick={() => removeFromWishlist(item.product_id)}
                        disabled={removingItems.has(item.product_id)}
                      >
                        {removingItems.has(item.product_id) ? (
                          <Loader2 className="w-4 h-4 animate-spin" />
                        ) : (
                          <Heart className="w-4 h-4 text-red-500 fill-current" />
                        )}
                      </Button>
                    </div>
                    
                    <h3 className="font-semibold text-gray-900 dark:text-white mb-2">
                      {item.product.name}
                    </h3>
                    
                    <p className="text-sm text-gray-600 dark:text-gray-400 mb-3 line-clamp-2">
                      {item.product.description}
                    </p>
                    
                    <div className="flex items-center mb-2">
                      <div className="flex items-center">
                        {[...Array(5)].map((_, i) => (
                          <Star
                            key={i}
                            className={`w-4 h-4 ${
                              i < Math.floor(item.product.rating)
                                ? 'text-yellow-400 fill-current'
                                : 'text-gray-300'
                            }`}
                          />
                        ))}
                      </div>
                      <span className="text-sm text-gray-600 dark:text-gray-400 ml-2">
                        ({item.product.reviews_count})
                      </span>
                    </div>
                    
                    <div className="flex items-center justify-between mb-4">
                      <div>
                        <span className="text-2xl font-bold text-gray-900 dark:text-white">
                          ${item.product.price}
                        </span>
                        {item.product.original_price && (
                          <span className="text-sm text-gray-500 line-through ml-2">
                            ${item.product.original_price}
                          </span>
                        )}
                      </div>
                      {item.product.original_price && (
                        <Badge variant="destructive">
                          -{Math.round((1 - item.product.price / item.product.original_price) * 100)}%
                        </Badge>
                      )}
                    </div>
                    
                    <div className="flex space-x-2">
                      <Button
                        className="flex-1"
                        onClick={() => addToCart(item.product_id)}
                        disabled={item.product.stock === 0}
                      >
                        <ShoppingCart className="w-4 h-4 mr-2" />
                        {item.product.stock === 0 ? 'Out of Stock' : 'Add to Cart'}
                      </Button>
                    </div>
                    
                    <div className="mt-2 text-xs text-gray-500">
                      Added {new Date(item.created_at).toLocaleDateString()}
                    </div>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}