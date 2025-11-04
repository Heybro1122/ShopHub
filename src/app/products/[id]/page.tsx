'use client'

import { useState, useEffect } from 'react'
import { notFound, useParams } from 'next/navigation'
import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Separator } from '@/components/ui/separator'
import { Star, ShoppingCart, ChevronLeft, Loader2 } from 'lucide-react'
import { toast } from 'sonner'
import Image from 'next/image'
import Link from 'next/link'

// Define the types for our product data
interface Product {
  id: number;
  name: string;
  description: string;
  price: number;
  originalPrice?: number;
  rating: number;
  reviews: number;
  badge?: string;
  category: string;
  image: string;
  stock: number;
  features: string[];
}

interface ProductPageProps {
  product: Product;
  relatedProducts: Product[];
}

export default function ProductDetailPage() {
  const params = useParams()
  const id = params.id

  const [data, setData] = useState<ProductPageProps | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [quantity, setQuantity] = useState(1)
  const [mainImage, setMainImage] = useState<string | null>(null)

  useEffect(() => {
    if (id) {
      const fetchProduct = async () => {
        try {
          setLoading(true)
          const response = await fetch(`/api/products/${id}`)
          if (!response.ok) {
            if (response.status === 404) {
              notFound()
            }
            throw new Error('Failed to fetch product')
          }
          const productData = await response.json()
          setData(productData)
          setMainImage(productData.product.image) // Set the main image initially
        } catch (err) {
          setError(err instanceof Error ? err.message : 'An unknown error occurred')
          toast.error(error || 'Failed to load product details.')
        } finally {
          setLoading(false)
        }
      }
      fetchProduct()
    }
  }, [id])

  const addToCart = async (productId: number) => {
    try {
      const response = await fetch('/api/cart', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          productId,
          quantity,
          sessionId: 'guest-session' // Replace with actual session ID
        })
      })
      
      if (!response.ok) throw new Error('Failed to add to cart')
      
      const result = await response.json()
      toast.success(`${quantity} x ${data?.product.name} added to cart!`)
      // Optionally, you can update a global cart state here
    } catch (error) {
      console.error('Error adding to cart:', error)
      toast.error('Failed to add to cart')
    }
  }

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <Loader2 className="w-16 h-16 animate-spin text-purple-600" />
      </div>
    )
  }

  if (error) {
    return (
      <div className="text-center py-12">
        <p className="text-red-500">{error}</p>
        <Link href="/">
          <Button variant="link">Go back home</Button>
        </Link>
      </div>
    )
  }

  if (!data) {
    return null
  }

  const { product, relatedProducts } = data

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      <div className="container mx-auto px-4 py-8">
        <div className="mb-6">
          <Link href="/">
            <Button variant="outline" size="sm">
              <ChevronLeft className="w-4 h-4 mr-2" />
              Back to Products
            </Button>
          </Link>
        </div>

        <div className="grid md:grid-cols-2 gap-12">
          {/* Product Images */}
          <div>
            <div className="relative aspect-square rounded-lg overflow-hidden border mb-4">
              {mainImage && (
                <Image
                  src={mainImage}
                  alt={product.name}
                  fill
                  className="object-cover transition-opacity duration-300"
                  sizes="(max-width: 768px) 100vw, 50vw"
                />
              )}
            </div>
            {/* Thumbnails can be added here */}
          </div>

          {/* Product Details */}
          <div className="space-y-6">
            <div>
              <Badge>{product.category}</Badge>
              <h1 className="text-4xl font-bold text-gray-900 dark:text-white mt-2">{product.name}</h1>
              <div className="flex items-center mt-2">
                <div className="flex items-center">
                  {[...Array(5)].map((_, i) => (
                    <Star
                      key={i}
                      className={`w-5 h-5 ${i < Math.floor(product.rating) ? 'text-yellow-400 fill-current' : 'text-gray-300'}`}
                    />
                  ))}
                </div>
                <span className="text-sm text-gray-600 dark:text-gray-400 ml-2">({product.reviews} reviews)</span>
              </div>
            </div>

            <p className="text-lg text-gray-600 dark:text-gray-400">{product.description}</p>

            <div>
              <span className="text-3xl font-bold text-gray-900 dark:text-white">${product.price}</span>
              {product.originalPrice && (
                <span className="text-lg text-gray-500 line-through ml-2">${product.originalPrice}</span>
              )}
            </div>

            <Separator />

            <div className="space-y-4">
              <h3 className="text-lg font-semibold">Features</h3>
              <ul className="list-disc list-inside space-y-2 text-gray-600 dark:text-gray-400">
                {product.features.map((feature, index) => (
                  <li key={index}>{feature}</li>
                ))}
              </ul>
            </div>

            <Separator />

            <div className="flex items-center gap-4">
              <div className="flex items-center border rounded-md">
                <Button variant="ghost" size="sm" onClick={() => setQuantity(q => Math.max(1, q - 1))}>-</Button>
                <span className="w-12 text-center">{quantity}</span>
                <Button variant="ghost" size="sm" onClick={() => setQuantity(q => Math.min(product.stock, q + 1))}>+</Button>
              </div>
              <Button size="lg" className="flex-1" onClick={() => addToCart(product.id)} disabled={product.stock === 0}>
                <ShoppingCart className="w-5 h-5 mr-2" />
                {product.stock > 0 ? 'Add to Cart' : 'Out of Stock'}
              </Button>
            </div>
            {product.stock > 0 && <p className="text-sm text-green-600">In stock ({product.stock} available)</p>}
          </div>
        </div>

        {/* Related Products */}
        <div className="mt-16">
          <h2 className="text-3xl font-bold text-center mb-8">Related Products</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {relatedProducts.map(related => (
              <Link key={related.id} href={`/products/${related.id}`}>
                <Card className="hover:shadow-lg transition-shadow cursor-pointer">
                  <CardContent className="p-4">
                    <div className="relative aspect-square mb-4 rounded-lg overflow-hidden">
                      <Image
                        src={related.image}
                        alt={related.name}
                        fill
                        className="object-cover"
                        sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 25vw"
                      />
                    </div>
                    <h3 className="font-semibold text-gray-900 dark:text-white">{related.name}</h3>
                    <p className="text-lg font-bold text-gray-900 dark:text-white mt-2">${related.price}</p>
                  </CardContent>
                </Card>
              </Link>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}
