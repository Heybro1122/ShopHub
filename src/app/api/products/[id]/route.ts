import { NextRequest, NextResponse } from 'next/server'

const products = [
  {
    id: 1,
    name: "Wireless Headphones Pro",
    description: "Premium noise-cancelling wireless headphones with exceptional sound quality and 30-hour battery life.",
    price: 299.99,
    originalPrice: 399.99,
    rating: 4.8,
    reviews: 234,
    badge: "Best Seller",
    category: "Electronics",
    image: "/products/headphones.jpg",
    stock: 15,
    features: ["Noise Cancelling", "30hr Battery", "Bluetooth 5.0", "Premium Sound"]
  },
  {
    id: 2,
    name: "Smart Watch Ultra",
    description: "Advanced fitness tracking, heart rate monitoring, and smartphone integration in a sleek design.",
    price: 449.99,
    originalPrice: 599.99,
    rating: 4.9,
    reviews: 567,
    badge: "New",
    category: "Electronics",
    image: "/products/smartwatch.jpg",
    stock: 8,
    features: ["Heart Rate Monitor", "GPS Tracking", "Water Resistant", "7-day Battery"]
  },
  {
    id: 3,
    name: "Premium Backpack",
    description: "Durable and stylish backpack with laptop compartment and multiple pockets for organization.",
    price: 89.99,
    originalPrice: 129.99,
    rating: 4.7,
    reviews: 123,
    badge: "Sale",
    category: "Fashion",
    image: "/products/backpack.jpg",
    stock: 25,
    features: ["Laptop Compartment", "Water Resistant", "USB Charging", "Ergonomic Design"]
  },
  {
    id: 4,
    name: "Wireless Speaker",
    description: "Portable Bluetooth speaker with 360-degree sound and waterproof design.",
    price: 159.99,
    originalPrice: 199.99,
    rating: 4.6,
    reviews: 89,
    badge: "Popular",
    category: "Electronics",
    image: "/products/speaker.jpg",
    stock: 12,
    features: ["360° Sound", "Waterproof", "12hr Battery", "Party Mode"]
  },
  {
    id: 5,
    name: "Yoga Mat Premium",
    description: "Extra thick, non-slip yoga mat with alignment markers for perfect practice.",
    price: 49.99,
    originalPrice: 69.99,
    rating: 4.8,
    reviews: 456,
    badge: "Eco-Friendly",
    category: "Sports",
    image: "/products/yoga-mat.jpg",
    stock: 30,
    features: ["Non-Slip Surface", "6mm Thick", "Eco-Friendly", "Carrying Strap"]
  },
  {
    id: 6,
    name: "Coffee Maker Deluxe",
    description: "Programmable coffee maker with thermal carafe and customizable brew strength.",
    price: 129.99,
    originalPrice: 179.99,
    rating: 4.5,
    reviews: 178,
    badge: "Top Rated",
    category: "Home & Living",
    image: "/products/coffee-maker.jpg",
    stock: 18,
    features: ["Programmable", "Thermal Carafe", "Auto Shut-off", "Multiple Brew Sizes"]
  },
  {
    id: 7,
    name: "Running Shoes Pro",
    description: "Lightweight running shoes with advanced cushioning and breathable mesh upper.",
    price: 119.99,
    originalPrice: 159.99,
    rating: 4.7,
    reviews: 289,
    badge: "Athletic",
    category: "Sports",
    image: "/products/running-shoes.jpg",
    stock: 22,
    features: ["Breathable Mesh", "Cushioned Sole", "Lightweight", "Reflective Details"]
  },
  {
    id: 8,
    name: "Desk Organizer Set",
    description: "Complete desk organization solution with multiple compartments and modern design.",
    price: 34.99,
    originalPrice: 49.99,
    rating: 4.4,
    reviews: 92,
    badge: "Office Essential",
    category: "Home & Living",
    image: "/products/desk-organizer.jpg",
    stock: 40,
    features: ["Multiple Compartments", "Modern Design", "Durable Material", "Easy Assembly"]
  }
]

export async function GET(request: NextRequest, { params }: { params: { id: string } }) {
  try {
    const productId = parseInt(params.id)
    const product = products.find(p => p.id === productId)

    if (!product) {
      return NextResponse.json({ error: 'Product not found' }, { status: 404 })
    }

    // For related products, let's find products in the same category, excluding the current one.
    const relatedProducts = products.filter(p => p.category === product.category && p.id !== product.id).slice(0, 4)

    return NextResponse.json({ product, relatedProducts })
  } catch (error) {
    console.error(`Product API error for ID ${params.id}:`, error)
    return NextResponse.json(
      { error: 'Failed to fetch product' },
      { status: 500 }
    )
  }
}
