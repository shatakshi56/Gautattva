-- ====================================================================
-- GAUTATTVA ORGANICS - SUPABASE POSTGRES DATABASE SCHEMA
-- A2 Gir Cow Vedic Bilona Ghee E-Commerce & WhatsApp AI Reorder Engine
-- ====================================================================

-- 1. Orders Table
CREATE TABLE IF NOT EXISTS public.orders (
    id VARCHAR(64) PRIMARY KEY,
    order_number VARCHAR(32) NOT NULL UNIQUE,
    customer_name VARCHAR(128) NOT NULL,
    phone VARCHAR(20) NOT NULL,
    email VARCHAR(128),
    address TEXT,
    city VARCHAR(64),
    pincode VARCHAR(10),
    jar_size VARCHAR(16) NOT NULL CHECK (jar_size IN ('500ml', '1000ml', '2000ml')),
    quantity INT NOT NULL DEFAULT 1,
    amount NUMERIC(10, 2) NOT NULL,
    status VARCHAR(32) NOT NULL DEFAULT 'placed' CHECK (status IN ('placed', 'shipped', 'delivered', 'reordered', 'cancelled')),
    
    -- Shiprocket Tracking Info
    shiprocket_order_id VARCHAR(64),
    shiprocket_shipment_id VARCHAR(64),
    tracking_awb VARCHAR(64),
    courier VARCHAR(64) DEFAULT 'Delhivery / Bluedart',
    delivered_at TIMESTAMPTZ,
    
    -- Reorder Engine Automation Timers
    -- 500ml: +25 days | 1000ml: +50 days | 2000ml: +90 days
    reorder_due_date TIMESTAMPTZ,
    wa_sent BOOLEAN NOT NULL DEFAULT FALSE,
    wa_sent_at TIMESTAMPTZ,
    wa_message_id VARCHAR(64),
    
    -- 48-Hour Unopened/Unpaid Follow-up Reminder
    reminder_sent BOOLEAN NOT NULL DEFAULT FALSE,
    reminder_sent_at TIMESTAMPTZ,
    discount_applied VARCHAR(32),
    
    -- Razorpay Pre-filled Payment Links
    razorpay_link_id VARCHAR(64),
    razorpay_link_url TEXT,
    payment_status VARCHAR(32) DEFAULT 'pending' CHECK (payment_status IN ('pending', 'paid', 'expired')),
    
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- Indexing for high-performance Vercel Cron reorder queries
CREATE INDEX IF NOT EXISTS idx_orders_phone ON public.orders(phone);
CREATE INDEX IF NOT EXISTS idx_orders_reorder_cron ON public.orders(status, wa_sent, reorder_due_date);
CREATE INDEX IF NOT EXISTS idx_orders_reminder_cron ON public.orders(wa_sent, reminder_sent, wa_sent_at, payment_status);

-- 2. WhatsApp Reorder Notification Audit Logs
CREATE TABLE IF NOT EXISTS public.reorder_logs (
    id VARCHAR(64) PRIMARY KEY,
    order_id VARCHAR(64) REFERENCES public.orders(id) ON DELETE CASCADE,
    phone VARCHAR(20) NOT NULL,
    trigger_type VARCHAR(32) NOT NULL CHECK (trigger_type IN ('day_25_nudge', 'day_50_nudge', 'day_90_nudge', 'reminder_48hr_discount', 'manual_simulator')),
    channel VARCHAR(32) NOT NULL DEFAULT 'gupshup_whatsapp',
    message_content TEXT NOT NULL,
    razorpay_link_url TEXT,
    status VARCHAR(32) NOT NULL DEFAULT 'sent' CHECK (status IN ('queued', 'sent', 'delivered', 'read', 'failed')),
    gupshup_response JSONB,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- 3. Automatic Trigger to update `updated_at` column
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

DROP TRIGGER IF EXISTS trigger_orders_updated_at ON public.orders;
CREATE TRIGGER trigger_orders_updated_at
BEFORE UPDATE ON public.orders
FOR EACH ROW
EXECUTE FUNCTION update_updated_at_column();

-- ====================================================================
-- 4. Customers Table (Loyal Customer & 20% Repeat Discount Engine)
-- ====================================================================
CREATE TABLE IF NOT EXISTS public.customers (
    id VARCHAR(64) PRIMARY KEY,
    phone VARCHAR(20) NOT NULL UNIQUE,
    name VARCHAR(128),
    email VARCHAR(128),
    total_orders INT NOT NULL DEFAULT 0,
    total_spent NUMERIC(10, 2) NOT NULL DEFAULT 0.00,
    is_loyal_customer BOOLEAN NOT NULL DEFAULT FALSE, -- Automatically true when total_orders >= 1
    loyalty_discount_percent INT DEFAULT 20,          -- 20% discount for repeat buyers
    city VARCHAR(64),
    pincode VARCHAR(10),
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    last_order_at TIMESTAMPTZ
);
CREATE INDEX IF NOT EXISTS idx_customers_phone ON public.customers(phone);
CREATE INDEX IF NOT EXISTS idx_customers_loyalty ON public.customers(is_loyal_customer);

-- ====================================================================
-- 5. Cart Sessions Table (Real-Time Abandoned Cart Tracking & Follow-up)
-- ====================================================================
CREATE TABLE IF NOT EXISTS public.cart_sessions (
    id VARCHAR(64) PRIMARY KEY,
    session_id VARCHAR(64) NOT NULL UNIQUE,     -- Browser cookie / localStorage session ID
    phone VARCHAR(20),                          -- Customer phone (captured on checkout/cart interaction)
    customer_name VARCHAR(128),
    jar_size VARCHAR(16) NOT NULL,
    quantity INT NOT NULL DEFAULT 1,
    cart_amount NUMERIC(10, 2) NOT NULL,
    status VARCHAR(32) NOT NULL DEFAULT 'active' CHECK (status IN ('active', 'abandoned', 'converted')),
    
    -- WhatsApp Follow-up Status
    wa_followup_sent BOOLEAN NOT NULL DEFAULT FALSE,
    wa_followup_sent_at TIMESTAMPTZ,
    customer_feedback TEXT,                     -- Feedback response e.g. "Price query", "Payment failed"
    
    last_active_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);
CREATE INDEX IF NOT EXISTS idx_cart_abandoned ON public.cart_sessions(status, wa_followup_sent, last_active_at);
CREATE INDEX IF NOT EXISTS idx_cart_phone ON public.cart_sessions(phone);

-- ====================================================================
-- 6. Traffic Events Table (Store Visitor & Analytics Telemetry)
-- ====================================================================
CREATE TABLE IF NOT EXISTS public.traffic_events (
    id VARCHAR(64) PRIMARY KEY,
    session_id VARCHAR(64) NOT NULL,
    event_type VARCHAR(64) NOT NULL,            -- 'page_view', 'add_to_cart', 'open_checkout', 'whatsapp_click'
    page_url TEXT NOT NULL,
    referrer TEXT,
    utm_source VARCHAR(64),                     -- 'instagram_ad', 'google', 'whatsapp', 'direct'
    utm_campaign VARCHAR(64),
    device VARCHAR(32),                         -- 'mobile', 'desktop'
    city VARCHAR(64),
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);
CREATE INDEX IF NOT EXISTS idx_traffic_session ON public.traffic_events(session_id, created_at);
CREATE INDEX IF NOT EXISTS idx_traffic_event ON public.traffic_events(event_type, created_at);

-- ====================================================================
-- 7. Admin & Staff Profiles (Role-Based Access Control)
-- ====================================================================
CREATE TABLE IF NOT EXISTS public.profiles (
    id VARCHAR(64) PRIMARY KEY,
    email VARCHAR(128) NOT NULL UNIQUE,
    full_name VARCHAR(128),
    role VARCHAR(32) NOT NULL DEFAULT 'admin' CHECK (role IN ('customer', 'staff', 'admin')),
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- ====================================================================
-- 8. Products Catalog Table (Dynamic CRUD Management)
-- ====================================================================
CREATE TABLE IF NOT EXISTS public.products (
    id VARCHAR(64) PRIMARY KEY,
    title VARCHAR(128) NOT NULL,
    jar_size VARCHAR(16) NOT NULL UNIQUE,     -- '500ml', '1000ml', '2000ml', '5000ml'
    price NUMERIC(10, 2) NOT NULL,
    mrp NUMERIC(10, 2) NOT NULL,
    stock_quantity INT NOT NULL DEFAULT 100,
    is_in_stock BOOLEAN NOT NULL DEFAULT TRUE,
    image_url TEXT,
    description TEXT,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- ====================================================================
-- 9. Coupons & Discounts Engine
-- ====================================================================
CREATE TABLE IF NOT EXISTS public.coupons (
    id VARCHAR(64) PRIMARY KEY,
    code VARCHAR(32) NOT NULL UNIQUE,          -- 'BILONA20', 'WELCOME10', 'LOYAL20'
    discount_type VARCHAR(16) NOT NULL CHECK (discount_type IN ('percentage', 'flat_amount')),
    discount_value NUMERIC(10, 2) NOT NULL,    -- 20 (percent) or 200 (flat Rs)
    min_order_value NUMERIC(10, 2) DEFAULT 0,
    max_discount_cap NUMERIC(10, 2),           -- Cap e.g. 500
    for_loyal_customers_only BOOLEAN DEFAULT FALSE,
    is_active BOOLEAN NOT NULL DEFAULT TRUE,
    usage_count INT NOT NULL DEFAULT 0,
    max_usage_limit INT,
    expires_at TIMESTAMPTZ,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- ====================================================================
-- 10. Custom WhatsApp Messaging Desk History
-- ====================================================================
CREATE TABLE IF NOT EXISTS public.customer_messages (
    id VARCHAR(64) PRIMARY KEY,
    phone VARCHAR(20) NOT NULL,
    customer_name VARCHAR(128),
    sender_type VARCHAR(16) NOT NULL CHECK (sender_type IN ('admin', 'automated_bot', 'customer')),
    message_text TEXT NOT NULL,
    status VARCHAR(32) NOT NULL DEFAULT 'sent' CHECK (status IN ('sent', 'delivered', 'read', 'failed')),
    gupshup_message_id VARCHAR(64),
    created_at TIMESTAMPTZ DEFAULT NOW()
);
CREATE INDEX IF NOT EXISTS idx_messages_phone ON public.customer_messages(phone);


