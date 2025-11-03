import { NextRequest, NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { supabase } from '@/lib/supabase'

export async function GET(request: NextRequest) {
  try {
    const session = await getServerSession()
    if (!session?.user?.id) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const { data: wishlistItems, error } = await supabase
      .from('wishlist')
      .select(`
        id,
        product_id,
        created_at,
        products!inner(
          id,
          name,
          description,
          price,
          original_price,
          rating,
          reviews_count,
          badge,
          category,
          image_url,
          stock
        )
      `)
      .eq('user_id', session.user.id)
      .order('created_at', { ascending: false })

    if (error) {
      console.error('Wishlist fetch error:', error)
      return NextResponse.json({ error: 'Failed to fetch wishlist' }, { status: 500 })
    }

    return NextResponse.json({ items: wishlistItems || [] })
  } catch (error) {
    console.error('Wishlist API error:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}

export async function POST(request: NextRequest) {
  try {
    const session = await getServerSession()
    if (!session?.user?.id) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const { productId } = await request.json()
    
    if (!productId) {
      return NextResponse.json({ error: 'Product ID is required' }, { status: 400 })
    }

    // Check if product exists
    const { data: product, error: productError } = await supabase
      .from('products')
      .select('id')
      .eq('id', productId)
      .eq('status', 'active')
      .single()

    if (productError || !product) {
      return NextResponse.json({ error: 'Product not found' }, { status: 404 })
    }

    // Check if already in wishlist
    const { data: existingItem } = await supabase
      .from('wishlist')
      .select('id')
      .eq('user_id', session.user.id)
      .eq('product_id', productId)
      .single()

    if (existingItem) {
      return NextResponse.json({ error: 'Already in wishlist' }, { status: 409 })
    }

    // Add to wishlist
    const { data: wishlistItem, error } = await supabase
      .from('wishlist')
      .insert({
        user_id: session.user.id,
        product_id: productId
      })
      .select()
      .single()

    if (error) {
      console.error('Wishlist add error:', error)
      return NextResponse.json({ error: 'Failed to add to wishlist' }, { status: 500 })
    }

    return NextResponse.json({ item: wishlistItem })
  } catch (error) {
    console.error('Wishlist API error:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}

export async function DELETE(request: NextRequest) {
  try {
    const session = await getServerSession()
    if (!session?.user?.id) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const { searchParams } = new URL(request.url)
    const productId = searchParams.get('productId')

    if (productId) {
      // Remove specific item
      const { error } = await supabase
        .from('wishlist')
        .delete()
        .eq('user_id', session.user.id)
        .eq('product_id', productId)

      if (error) {
        console.error('Wishlist remove error:', error)
        return NextResponse.json({ error: 'Failed to remove from wishlist' }, { status: 500 })
      }

      return NextResponse.json({ message: 'Removed from wishlist' })
    } else {
      // Clear entire wishlist
      const { error } = await supabase
        .from('wishlist')
        .delete()
        .eq('user_id', session.user.id)

      if (error) {
        console.error('Wishlist clear error:', error)
        return NextResponse.json({ error: 'Failed to clear wishlist' }, { status: 500 })
      }

      return NextResponse.json({ message: 'Wishlist cleared' })
    }
  } catch (error) {
    console.error('Wishlist API error:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}