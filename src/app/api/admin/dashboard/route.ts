import { NextRequest, NextResponse } from 'next/server'
import { supabase } from '@/lib/supabase'

export async function GET(request: NextRequest) {
  try {
    // Fetch dashboard statistics
    const [
      { count: totalUsers },
      { count: totalOrders },
      { count: totalProducts },
      { data: orders },
      { data: products },
      { data: recentOrdersData }
    ] = await Promise.all([
      supabase.from('users').select('*', { count: 'exact', head: true }),
      supabase.from('orders').select('*', { count: 'exact', head: true }),
      supabase.from('products').select('*', { count: 'exact', head: true }),
      supabase.from('orders').select('total').eq('status', 'delivered'),
      supabase.from('products').select('name, sales_count, rating').order('sales_count', { ascending: false }).limit(5),
      supabase.from('orders').select(`
        id,
        total,
        status,
        created_at,
        users!inner(name)
      `).order('created_at', { ascending: false }).limit(5)
    ])

    // Calculate total revenue
    const totalRevenue = orders?.reduce((sum, order) => sum + (order.total || 0), 0) || 0

    // Generate sales data for the last 6 months
    const salesData = []
    const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun']
    
    for (let i = 0; i < 6; i++) {
      const monthStart = new Date()
      monthStart.setMonth(monthStart.getMonth() - (5 - i))
      monthStart.setDate(1)
      monthStart.setHours(0, 0, 0, 0)
      
      const monthEnd = new Date(monthStart)
      monthEnd.setMonth(monthEnd.getMonth() + 1)
      monthEnd.setDate(0)
      monthEnd.setHours(23, 59, 59, 999)
      
      const { data: monthOrders } = await supabase
        .from('orders')
        .select('total')
        .gte('created_at', monthStart.toISOString())
        .lte('created_at', monthEnd.toISOString())
        .eq('status', 'delivered')
      
      const monthSales = monthOrders?.reduce((sum, order) => sum + (order.total || 0), 0) || 0
      const monthOrderCount = monthOrders?.length || 0
      
      salesData.push({
        name: months[i],
        sales: monthSales,
        orders: monthOrderCount
      })
    }

    // Generate category data
    const { data: categoryData } = await supabase
      .from('products')
      .select('category')
      .eq('status', 'active')

    const categoryCounts = categoryData?.reduce((acc, product) => {
      acc[product.category] = (acc[product.category] || 0) + 1
      return acc
    }, {} as Record<string, number>)

    const categoryDistribution = Object.entries(categoryCounts).map(([name, value]) => ({
      name,
      value,
      color: getCategoryColor(name)
    }))

    // Format top products
    const topProducts = products?.map(product => ({
      id: product.name,
      name: product.name,
      sales: product.sales_count,
      revenue: product.sales_count * 100 // Approximate revenue
    })) || []

    // Format recent orders
    const recentOrders = recentOrdersData?.map(order => ({
      id: order.id,
      customer: order.users.name,
      total: order.total,
      status: order.status,
      date: new Date(order.created_at).toLocaleDateString()
    })) || []

    return NextResponse.json({
      totalUsers: totalUsers || 0,
      totalOrders: totalOrders || 0,
      totalProducts: totalProducts || 0,
      totalRevenue,
      salesData,
      categoryData: categoryDistribution,
      topProducts,
      recentOrders
    })
  } catch (error) {
    console.error('Dashboard API error:', error)
    return NextResponse.json(
      { error: 'Failed to fetch dashboard data' },
      { status: 500 }
    )
  }
}

function getCategoryColor(category: string): string {
  const colors: Record<string, string> = {
    'Electronics': '#8b5cf6',
    'Fashion': '#ec4899',
    'Home & Living': '#10b981',
    'Sports': '#f59e0b',
    'Books': '#3b82f6',
    'Toys': '#ef4444'
  }
  return colors[category] || '#6b7280'
}