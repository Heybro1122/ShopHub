-- Create custom types
CREATE TYPE user_role AS ENUM ('user', 'admin');
CREATE TYPE product_status AS ENUM ('active', 'inactive', 'draft');
CREATE TYPE order_status AS ENUM ('pending', 'processing', 'shipped', 'delivered', 'cancelled');
CREATE TYPE payment_status AS ENUM ('pending', 'paid', 'failed', 'refunded');
CREATE TYPE review_status AS ENUM ('approved', 'pending', 'rejected');

-- Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- Users table
CREATE TABLE users (
    id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
    email VARCHAR(255) UNIQUE NOT NULL,
    name VARCHAR(255) NOT NULL,
    avatar_url TEXT,
    role user_role DEFAULT 'user',
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    email_verified BOOLEAN DEFAULT FALSE,
    phone VARCHAR(50),
    address TEXT,
    preferences JSONB
);

-- Products table
CREATE TABLE products (
    id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    description TEXT NOT NULL,
    price DECIMAL(10,2) NOT NULL,
    original_price DECIMAL(10,2),
    category VARCHAR(100) NOT NULL,
    image_url TEXT NOT NULL,
    images TEXT[] DEFAULT '{}',
    rating DECIMAL(3,2) DEFAULT 0,
    reviews_count INTEGER DEFAULT 0,
    badge VARCHAR(50),
    stock INTEGER DEFAULT 0,
    features TEXT[] DEFAULT '{}',
    specifications JSONB DEFAULT '{}',
    tags TEXT[] DEFAULT '{}',
    status product_status DEFAULT 'active',
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    views INTEGER DEFAULT 0,
    sales_count INTEGER DEFAULT 0,
    featured BOOLEAN DEFAULT FALSE,
    seo_title VARCHAR(255),
    seo_description TEXT,
    slug VARCHAR(255) UNIQUE NOT NULL
);

-- Reviews table
CREATE TABLE reviews (
    id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
    product_id UUID REFERENCES products(id) ON DELETE CASCADE,
    user_id UUID REFERENCES users(id) ON DELETE CASCADE,
    rating INTEGER CHECK (rating >= 1 AND rating <= 5) NOT NULL,
    title VARCHAR(255) NOT NULL,
    content TEXT NOT NULL,
    images TEXT[] DEFAULT '{}',
    helpful_count INTEGER DEFAULT 0,
    verified_purchase BOOLEAN DEFAULT FALSE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    status review_status DEFAULT 'pending',
    UNIQUE(product_id, user_id)
);

-- Orders table
CREATE TABLE orders (
    id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
    user_id UUID REFERENCES users(id) ON DELETE CASCADE,
    status order_status DEFAULT 'pending',
    total DECIMAL(10,2) NOT NULL,
    subtotal DECIMAL(10,2) NOT NULL,
    tax DECIMAL(10,2) NOT NULL,
    shipping DECIMAL(10,2) NOT NULL,
    items JSONB NOT NULL,
    shipping_address JSONB NOT NULL,
    billing_address JSONB NOT NULL,
    payment_method VARCHAR(100) NOT NULL,
    payment_status payment_status DEFAULT 'pending',
    tracking_number VARCHAR(255),
    notes TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Wishlist table
CREATE TABLE wishlist (
    id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
    user_id UUID REFERENCES users(id) ON DELETE CASCADE,
    product_id UUID REFERENCES products(id) ON DELETE CASCADE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    UNIQUE(user_id, product_id)
);

-- Cart table
CREATE TABLE cart (
    id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
    user_id UUID REFERENCES users(id) ON DELETE CASCADE,
    product_id UUID REFERENCES products(id) ON DELETE CASCADE,
    quantity INTEGER DEFAULT 1,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    UNIQUE(user_id, product_id)
);

-- Analytics table
CREATE TABLE analytics (
    id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
    event VARCHAR(100) NOT NULL,
    properties JSONB DEFAULT '{}',
    user_id UUID REFERENCES users(id) ON DELETE SET NULL,
    session_id VARCHAR(255) NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Indexes for performance
CREATE INDEX idx_products_category ON products(category);
CREATE INDEX idx_products_status ON products(status);
CREATE INDEX idx_products_featured ON products(featured);
CREATE INDEX idx_products_rating ON products(rating);
CREATE INDEX idx_products_created_at ON products(created_at);
CREATE INDEX idx_reviews_product_id ON reviews(product_id);
CREATE INDEX idx_reviews_user_id ON reviews(user_id);
CREATE INDEX idx_reviews_status ON reviews(status);
CREATE INDEX idx_orders_user_id ON orders(user_id);
CREATE INDEX idx_orders_status ON orders(status);
CREATE INDEX idx_orders_created_at ON orders(created_at);
CREATE INDEX idx_wishlist_user_id ON wishlist(user_id);
CREATE INDEX idx_wishlist_product_id ON wishlist(product_id);
CREATE INDEX idx_cart_user_id ON cart(user_id);
CREATE INDEX idx_cart_product_id ON cart(product_id);
CREATE INDEX idx_analytics_event ON analytics(event);
CREATE INDEX idx_analytics_user_id ON analytics(user_id);
CREATE INDEX idx_analytics_session_id ON analytics(session_id);
CREATE INDEX idx_analytics_created_at ON analytics(created_at);

-- Function to update updated_at timestamp
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ language 'plpgsql';

-- Triggers for updated_at
CREATE TRIGGER update_users_updated_at BEFORE UPDATE ON users FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_products_updated_at BEFORE UPDATE ON products FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_reviews_updated_at BEFORE UPDATE ON reviews FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_orders_updated_at BEFORE UPDATE ON orders FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_cart_updated_at BEFORE UPDATE ON cart FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- Function to update product rating when review is added/updated
CREATE OR REPLACE FUNCTION update_product_rating()
RETURNS TRIGGER AS $$
BEGIN
    UPDATE products 
    SET 
        rating = COALESCE(
            (SELECT AVG(rating) FROM reviews WHERE product_id = NEW.product_id AND status = 'approved'), 
            0
        ),
        reviews_count = (
            SELECT COUNT(*) FROM reviews WHERE product_id = NEW.product_id AND status = 'approved'
        )
    WHERE id = NEW.product_id;
    RETURN NEW;
END;
$$ language 'plpgsql';

-- Triggers for product rating updates
CREATE TRIGGER update_product_rating_on_insert AFTER INSERT ON reviews FOR EACH ROW EXECUTE FUNCTION update_product_rating();
CREATE TRIGGER update_product_rating_on_update AFTER UPDATE ON reviews FOR EACH ROW EXECUTE FUNCTION update_product_rating();
CREATE TRIGGER update_product_rating_on_delete AFTER DELETE ON reviews FOR EACH ROW EXECUTE FUNCTION update_product_rating();

-- Function to update product sales count
CREATE OR REPLACE FUNCTION update_product_sales_count()
RETURNS TRIGGER AS $$
BEGIN
    UPDATE products 
    SET sales_count = sales_count + 1
    WHERE id = (item->>'product_id')::uuid;
    RETURN NEW;
END;
$$ language 'plpgsql';

-- Trigger for product sales count (this would need to be called when order is completed)
-- CREATE TRIGGER update_sales_count AFTER UPDATE ON orders FOR EACH ROW EXECUTE FUNCTION update_product_sales_count();

-- Row Level Security (RLS)
ALTER TABLE users ENABLE ROW LEVEL SECURITY;
ALTER TABLE reviews ENABLE ROW LEVEL SECURITY;
ALTER TABLE orders ENABLE ROW LEVEL SECURITY;
ALTER TABLE wishlist ENABLE ROW LEVEL SECURITY;
ALTER TABLE cart ENABLE ROW LEVEL SECURITY;
ALTER TABLE analytics ENABLE ROW LEVEL SECURITY;

-- RLS Policies
CREATE POLICY "Users can view own profile" ON users FOR SELECT USING (auth.uid() = id);
CREATE POLICY "Users can update own profile" ON users FOR UPDATE USING (auth.uid() = id);

CREATE POLICY "Anyone can view active products" ON products FOR SELECT USING (status = 'active');
CREATE POLICY "Admins can manage products" ON products FOR ALL USING (
    auth.jwt() ->> 'role' = 'admin'::text
);

CREATE POLICY "Anyone can view approved reviews" ON reviews FOR SELECT USING (status = 'approved');
CREATE POLICY "Users can manage own reviews" ON reviews FOR ALL USING (auth.uid() = user_id);
CREATE POLICY "Admins can manage all reviews" ON reviews FOR ALL USING (
    auth.jwt() ->> 'role' = 'admin'::text
);

CREATE POLICY "Users can view own orders" ON orders FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Admins can view all orders" ON orders FOR SELECT USING (
    auth.jwt() ->> 'role' = 'admin'::text
);
CREATE POLICY "Admins can manage orders" ON orders FOR ALL USING (
    auth.jwt() ->> 'role' = 'admin'::text
);

CREATE POLICY "Users can manage own wishlist" ON wishlist FOR ALL USING (auth.uid() = user_id);
CREATE POLICY "Users can manage own cart" ON cart FOR ALL USING (auth.uid() = user_id);
CREATE POLICY "Anyone can create analytics events" ON analytics FOR INSERT WITH CHECK (true);

-- Insert sample data
INSERT INTO users (email, name, role, email_verified) VALUES
('admin@example.com', 'Admin User', 'admin', true),
('sarah@example.com', 'Sarah Johnson', 'user', true),
('mike@example.com', 'Mike Chen', 'user', true),
('emma@example.com', 'Emma Davis', 'user', true);

-- Insert sample products (these will be replaced with actual data)
INSERT INTO products (name, description, price, original_price, category, image_url, images, rating, reviews_count, badge, stock, features, specifications, tags, status, featured, slug) VALUES
('Wireless Headphones Pro', 'Premium noise-cancelling wireless headphones with exceptional sound quality and 30-hour battery life.', 299.99, 399.99, 'Electronics', '/products/headphones.jpg', ARRAY['/products/headphones.jpg'], 4.8, 234, 'Best Seller', 15, ARRAY['Noise Cancelling', '30hr Battery', 'Bluetooth 5.0', 'Premium Sound'], '{"brand": "AudioTech", "model": "WH-Pro", "color": "Black", "weight": "250g"}', ARRAY['wireless', 'noise-cancelling', 'premium'], 'active', true, 'wireless-headphones-pro'),
('Smart Watch Ultra', 'Advanced fitness tracking, heart rate monitoring, and smartphone integration in a sleek design.', 449.99, 599.99, 'Electronics', '/products/smartwatch.jpg', ARRAY['/products/smartwatch.jpg'], 4.9, 567, 'New', 8, ARRAY['Heart Rate Monitor', 'GPS Tracking', 'Water Resistant', '7-day Battery'], '{"brand": "SmartTech", "model": "SW-Ultra", "color": "Black", "screen": "1.4"}', ARRAY['smartwatch', 'fitness', 'gps'], 'active', true, 'smart-watch-ultra'),
('Premium Backpack', 'Durable and stylish backpack with laptop compartment and multiple pockets for organization.', 89.99, 129.99, 'Fashion', '/products/backpack.jpg', ARRAY['/products/backpack.jpg'], 4.7, 123, 'Sale', 25, ARRAY['Laptop Compartment', 'Water Resistant', 'USB Charging', 'Ergonomic Design'], '{"brand": "UrbanGear", "model": "BP-Premium", "color": "Gray", "capacity": "25L"}', ARRAY['backpack', 'laptop', 'water-resistant'], 'active', true, 'premium-backpack'),
('Wireless Speaker', 'Portable Bluetooth speaker with 360-degree sound and waterproof design.', 159.99, 199.99, 'Electronics', '/products/speaker.jpg', ARRAY['/products/speaker.jpg'], 4.6, 89, 'Popular', 12, ARRAY['360° Sound', 'Waterproof', '12hr Battery', 'Party Mode'], '{"brand": "SoundWave", "model": "WS-360", "color": "Black", "power": "20W"}', ARRAY['speaker', 'bluetooth', 'waterproof'], 'active', true, 'wireless-speaker'),
('Yoga Mat Premium', 'Extra thick, non-slip yoga mat with alignment markers for perfect practice.', 49.99, 69.99, 'Sports', '/products/yoga-mat.jpg', ARRAY['/products/yoga-mat.jpg'], 4.8, 456, 'Eco-Friendly', 30, ARRAY['Non-Slip Surface', '6mm Thick', 'Eco-Friendly', 'Carrying Strap'], '{"brand": "YogaLife", "model": "YM-Premium", "color": "Purple", "thickness": "6mm"}', ARRAY['yoga', 'fitness', 'eco-friendly'], 'active', true, 'yoga-mat-premium'),
('Coffee Maker Deluxe', 'Programmable coffee maker with thermal carafe and customizable brew strength.', 129.99, 179.99, 'Home & Living', '/products/coffee-maker.jpg', ARRAY['/products/coffee-maker.jpg'], 4.5, 178, 'Top Rated', 18, ARRAY['Programmable', 'Thermal Carafe', 'Auto Shut-off', 'Multiple Brew Sizes'], '{"brand": "BrewMaster", "model": "CM-Deluxe", "color": "Stainless Steel", "capacity": "12 cups"}', ARRAY['coffee', 'programmable', 'thermal'], 'active', true, 'coffee-maker-deluxe'),
('Running Shoes Pro', 'Lightweight running shoes with advanced cushioning and breathable mesh upper.', 119.99, 159.99, 'Sports', '/products/running-shoes.jpg', ARRAY['/products/running-shoes.jpg'], 4.7, 289, 'Athletic', 22, ARRAY['Breathable Mesh', 'Cushioned Sole', 'Lightweight', 'Reflective Details'], '{"brand": "SpeedRun", "model": "RS-Pro", "color": "Blue", "size": "US 9"}', ARRAY['running', 'shoes', 'athletic'], 'active', true, 'running-shoes-pro'),
('Desk Organizer Set', 'Complete desk organization solution with multiple compartments and modern design.', 34.99, 49.99, 'Home & Living', '/products/desk-organizer.jpg', ARRAY['/products/desk-organizer.jpg'], 4.4, 92, 'Office Essential', 40, ARRAY['Multiple Compartments', 'Modern Design', 'Durable Material', 'Easy Assembly'], '{"brand": "OfficePro", "model": "DO-Set", "color": "White/Wood", "compartments": 6}', ARRAY['desk', 'organizer', 'office'], 'active', true, 'desk-organizer-set');

-- Insert sample reviews
INSERT INTO reviews (product_id, user_id, rating, title, content, verified_purchase, status) VALUES
((SELECT id FROM products WHERE slug = 'wireless-headphones-pro'), (SELECT id FROM users WHERE email = 'sarah@example.com'), 5, 'Amazing sound quality!', 'Absolutely love the quality and fast delivery! This is my go-to store for all shopping needs.', true, 'approved'),
((SELECT id FROM products WHERE slug = 'smart-watch-ultra'), (SELECT id FROM users WHERE email = 'mike@example.com'), 5, 'Best smartwatch ever!', 'Best shopping experience ever! The customer service is outstanding and products are top-notch.', true, 'approved'),
((SELECT id FROM products WHERE slug = 'premium-backpack'), (SELECT id FROM users WHERE email = 'emma@example.com'), 5, 'Perfect for work!', 'Trendy collections at amazing prices. I always find something unique here!', true, 'approved');