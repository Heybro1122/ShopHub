import { NextRequest, NextResponse } from 'next/server'

// In a real application, this would be stored in a database
// For demo purposes, we'll use in-memory storage
let cartItems: any[] = []

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const sessionId = searchParams.get('sessionId') || 'default'

    // In a real app, you'd fetch cart items for the specific user/session
    const userCartItems = cartItems.filter(item => item.sessionId === sessionId)

    // Calculate totals
    const subtotal = userCartItems.reduce((total, item) => total + (item.price * item.quantity), 0)
    const tax = subtotal * 0.08 // 8% tax
    const shipping = subtotal > 50 ? 0 : 9.99
    const total = subtotal + tax + shipping

    return NextResponse.json({
      items: userCartItems,
      summary: {
        subtotal: parseFloat(subtotal.toFixed(2)),
        tax: parseFloat(tax.toFixed(2)),
        shipping: parseFloat(shipping.toFixed(2)),
        total: parseFloat(total.toFixed(2))
      },
      count: userCartItems.reduce((count, item) => count + item.quantity, 0)
    })
  } catch (error) {
    console.error('Cart GET error:', error)
    return NextResponse.json(
      { error: 'Failed to fetch cart' },
      { status: 500 }
    )
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { productId, quantity = 1, sessionId = 'default' } = body

    // Mock product data - in real app, fetch from database
    const products = [
      { id: 1, name: "Wireless Headphones Pro", price: 299.99, image: "/products/headphones.jpg" },
      { id: 2, name: "Smart Watch Ultra", price: 449.99, image: "/products/smartwatch.jpg" },
      { id: 3, name: "Premium Backpack", price: 89.99, image: "/products/backpack.jpg" },
      { id: 4, name: "Wireless Speaker", price: 159.99, image: "/products/speaker.jpg" },
      { id: 5, name: "Yoga Mat Premium", price: 49.99, image: "/products/yoga-mat.jpg" },
      { id: 6, name: "Coffee Maker Deluxe", price: 129.99, image: "/products/coffee-maker.jpg" },
      { id: 7, name: "Running Shoes Pro", price: 119.99, image: "/products/running-shoes.jpg" },
      { id: 8, name: "Desk Organizer Set", price: 34.99, image: "/products/desk-organizer.jpg" }
    ]

    const product = products.find(p => p.id === productId)
    if (!product) {
      return NextResponse.json(
        { error: 'Product not found' },
        { status: 404 }
      )
    }

    // Check if item already exists in cart
    const existingItemIndex = cartItems.findIndex(
      item => item.productId === productId && item.sessionId === sessionId
    )

    if (existingItemIndex >= 0) {
      // Update quantity
      cartItems[existingItemIndex].quantity += quantity
    } else {
      // Add new item
      cartItems.push({
        id: Date.now(), // Unique cart item ID
        productId,
        sessionId,
        quantity,
        ...product
      })
    }

    return NextResponse.json({ 
      message: 'Item added to cart',
      cartCount: cartItems.filter(item => item.sessionId === sessionId)
        .reduce((count, item) => count + item.quantity, 0)
    })
  } catch (error) {
    console.error('Cart POST error:', error)
    return NextResponse.json(
      { error: 'Failed to add item to cart' },
      { status: 500 }
    )
  }
}

export async function PUT(request: NextRequest) {
  try {
    const body = await request.json()
    const { cartItemId, quantity, sessionId = 'default' } = body

    const itemIndex = cartItems.findIndex(
      item => item.id === cartItemId && item.sessionId === sessionId
    )

    if (itemIndex === -1) {
      return NextResponse.json(
        { error: 'Cart item not found' },
        { status: 404 }
      )
    }

    if (quantity <= 0) {
      // Remove item if quantity is 0 or less
      cartItems.splice(itemIndex, 1)
    } else {
      // Update quantity
      cartItems[itemIndex].quantity = quantity
    }

    return NextResponse.json({ message: 'Cart updated successfully' })
  } catch (error) {
    console.error('Cart PUT error:', error)
    return NextResponse.json(
      { error: 'Failed to update cart' },
      { status: 500 }
    )
  }
}

export async function DELETE(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const cartItemId = searchParams.get('cartItemId')
    const sessionId = searchParams.get('sessionId') || 'default'

    if (cartItemId) {
      // Remove specific item
      cartItems = cartItems.filter(
        item => !(item.id === parseInt(cartItemId) && item.sessionId === sessionId)
      )
    } else {
      // Clear entire cart for session
      cartItems = cartItems.filter(item => item.sessionId !== sessionId)
    }

    return NextResponse.json({ message: 'Item removed from cart' })
  } catch (error) {
    console.error('Cart DELETE error:', error)
    return NextResponse.json(
      { error: 'Failed to remove item from cart' },
      { status: 500 }
    )
  }
}