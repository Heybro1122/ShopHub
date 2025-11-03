import { NextRequest, NextResponse } from 'next/server'
import { supabase } from '@/lib/supabase'

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const query = searchParams.get('q') || ''
    const categories = searchParams.get('category')?.split(',').filter(Boolean) || []
    const minPrice = parseFloat(searchParams.get('minPrice') || '0')
    const maxPrice = parseFloat(searchParams.get('maxPrice') || '1000')
    const rating = parseInt(searchParams.get('rating') || '0')
    const inStock = searchParams.get('inStock') === 'true'
    const sortBy = searchParams.get('sortBy') || 'relevance'
    const page = parseInt(searchParams.get('page') || '1')
    const limit = parseInt(searchParams.get('limit') || '12')

    if (!query.trim()) {
      return NextResponse.json({ products: [], total: 0, page: 1, pages: 0 })
    }

    // Build the base query
    let dbQuery = supabase
      .from('products')
      .select('*', { count: 'exact' })
      .eq('status', 'active')
      .gte('price', minPrice)
      .lte('price', maxPrice)
      .gte('rating', rating)

    // Add text search
    if (query) {
      dbQuery = dbQuery.or(`name.ilike.%${query}%,description.ilike.%${query}%,tags.cs.{${query}}`)
    }

    // Add category filter
    if (categories.length > 0) {
      dbQuery = dbQuery.in('category', categories)
    }

    // Add stock filter
    if (inStock) {
      dbQuery = dbQuery.gt('stock', 0)
    }

    // Add sorting
    switch (sortBy) {
      case 'price-low':
        dbQuery = dbQuery.order('price', { ascending: true })
        break
      case 'price-high':
        dbQuery = dbQuery.order('price', { ascending: false })
        break
      case 'rating':
        dbQuery = dbQuery.order('rating', { ascending: false })
        break
      case 'newest':
        dbQuery = dbQuery.order('created_at', { ascending: false })
        break
      case 'bestselling':
        dbQuery = dbQuery.order('sales_count', { ascending: false })
        break
      case 'relevance':
      default:
        // For relevance, we'll prioritize exact matches in name, then description
        dbQuery = dbQuery.order('rating', { ascending: false })
        break
    }

    // Add pagination
    const from = (page - 1) * limit
    const to = from + limit - 1
    dbQuery = dbQuery.range(from, to)

    const { data: products, error, count } = await dbQuery

    if (error) {
      console.error('Search error:', error)
      return NextResponse.json(
        { error: 'Search failed' },
        { status: 500 }
      )
    }

    // Transform the data to match the expected format
    const transformedProducts = products?.map(product => ({
      id: product.id,
      name: product.name,
      description: product.description,
      price: product.price,
      originalPrice: product.original_price,
      rating: product.rating,
      reviews: product.reviews_count,
      badge: product.badge,
      category: product.category,
      image: product.image_url,
      features: product.features,
      stock: product.stock
    })) || []

    const totalPages = Math.ceil((count || 0) / limit)

    return NextResponse.json({
      products: transformedProducts,
      total: count || 0,
      page,
      pages: totalPages,
      hasMore: page < totalPages
    })

  } catch (error) {
    console.error('Search API error:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}