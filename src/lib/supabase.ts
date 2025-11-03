import { createClient } from '@supabase/supabase-js'

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!

export const supabase = createClient(supabaseUrl, supabaseAnonKey)

export type Database = {
  public: {
    Tables: {
      users: {
        Row: {
          id: string
          email: string
          name: string
          avatar_url: string | null
          role: 'user' | 'admin'
          created_at: string
          updated_at: string
          email_verified: boolean
          phone: string | null
          address: string | null
          preferences: Record<string, any> | null
        }
        Insert: {
          id?: string
          email: string
          name: string
          avatar_url?: string | null
          role?: 'user' | 'admin'
          created_at?: string
          updated_at?: string
          email_verified?: boolean
          phone?: string | null
          address?: string | null
          preferences?: Record<string, any> | null
        }
        Update: {
          id?: string
          email?: string
          name?: string
          avatar_url?: string | null
          role?: 'user' | 'admin'
          created_at?: string
          updated_at?: string
          email_verified?: boolean
          phone?: string | null
          address?: string | null
          preferences?: Record<string, any> | null
        }
      }
      products: {
        Row: {
          id: string
          name: string
          description: string
          price: number
          original_price: number | null
          category: string
          image_url: string
          images: string[]
          rating: number
          reviews_count: number
          badge: string | null
          stock: number
          features: string[]
          specifications: Record<string, any>
          tags: string[]
          status: 'active' | 'inactive' | 'draft'
          created_at: string
          updated_at: string
          views: number
          sales_count: number
          featured: boolean
          seo_title: string | null
          seo_description: string | null
          slug: string
        }
        Insert: {
          id?: string
          name: string
          description: string
          price: number
          original_price?: number | null
          category: string
          image_url: string
          images?: string[]
          rating?: number
          reviews_count?: number
          badge?: string | null
          stock?: number
          features?: string[]
          specifications?: Record<string, any>
          tags?: string[]
          status?: 'active' | 'inactive' | 'draft'
          created_at?: string
          updated_at?: string
          views?: number
          sales_count?: number
          featured?: boolean
          seo_title?: string | null
          seo_description?: string | null
          slug?: string
        }
        Update: {
          id?: string
          name?: string
          description?: string
          price?: number
          original_price?: number | null
          category?: string
          image_url?: string
          images?: string[]
          rating?: number
          reviews_count?: number
          badge?: string | null
          stock?: number
          features?: string[]
          specifications?: Record<string, any>
          tags?: string[]
          status?: 'active' | 'inactive' | 'draft'
          created_at?: string
          updated_at?: string
          views?: number
          sales_count?: number
          featured?: boolean
          seo_title?: string | null
          seo_description?: string | null
          slug?: string
        }
      }
      reviews: {
        Row: {
          id: string
          product_id: string
          user_id: string
          rating: number
          title: string
          content: string
          images: string[]
          helpful_count: number
          verified_purchase: boolean
          created_at: string
          updated_at: string
          status: 'approved' | 'pending' | 'rejected'
        }
        Insert: {
          id?: string
          product_id: string
          user_id: string
          rating: number
          title: string
          content: string
          images?: string[]
          helpful_count?: number
          verified_purchase?: boolean
          created_at?: string
          updated_at?: string
          status?: 'approved' | 'pending' | 'rejected'
        }
        Update: {
          id?: string
          product_id?: string
          user_id?: string
          rating?: number
          title?: string
          content?: string
          images?: string[]
          helpful_count?: number
          verified_purchase?: boolean
          created_at?: string
          updated_at?: string
          status?: 'approved' | 'pending' | 'rejected'
        }
      }
      orders: {
        Row: {
          id: string
          user_id: string
          status: 'pending' | 'processing' | 'shipped' | 'delivered' | 'cancelled'
          total: number
          subtotal: number
          tax: number
          shipping: number
          items: OrderItem[]
          shipping_address: Address
          billing_address: Address
          payment_method: string
          payment_status: 'pending' | 'paid' | 'failed' | 'refunded'
          tracking_number: string | null
          notes: string | null
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          user_id: string
          status?: 'pending' | 'processing' | 'shipped' | 'delivered' | 'cancelled'
          total: number
          subtotal: number
          tax: number
          shipping: number
          items: OrderItem[]
          shipping_address: Address
          billing_address: Address
          payment_method: string
          payment_status?: 'pending' | 'paid' | 'failed' | 'refunded'
          tracking_number?: string | null
          notes?: string | null
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          user_id?: string
          status?: 'pending' | 'processing' | 'shipped' | 'delivered' | 'cancelled'
          total?: number
          subtotal?: number
          tax?: number
          shipping?: number
          items?: OrderItem[]
          shipping_address?: Address
          billing_address?: Address
          payment_method?: string
          payment_status?: 'pending' | 'paid' | 'failed' | 'refunded'
          tracking_number?: string | null
          notes?: string | null
          created_at?: string
          updated_at?: string
        }
      }
      wishlist: {
        Row: {
          id: string
          user_id: string
          product_id: string
          created_at: string
        }
        Insert: {
          id?: string
          user_id: string
          product_id: string
          created_at?: string
        }
        Update: {
          id?: string
          user_id?: string
          product_id?: string
          created_at?: string
        }
      }
      cart: {
        Row: {
          id: string
          user_id: string
          product_id: string
          quantity: number
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          user_id: string
          product_id: string
          quantity: number
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          user_id?: string
          product_id?: string
          quantity?: number
          created_at?: string
          updated_at?: string
        }
      }
      analytics: {
        Row: {
          id: string
          event: string
          properties: Record<string, any>
          user_id: string | null
          session_id: string
          created_at: string
        }
        Insert: {
          id?: string
          event: string
          properties: Record<string, any>
          user_id?: string | null
          session_id: string
          created_at?: string
        }
        Update: {
          id?: string
          event?: string
          properties?: Record<string, any>
          user_id?: string | null
          session_id?: string
          created_at?: string
        }
      }
    }
  }
}

export type OrderItem = {
  id: string
  product_id: string
  name: string
  price: number
  quantity: number
  image_url: string
}

export type Address = {
  street: string
  city: string
  state: string
  zip: string
  country: string
}