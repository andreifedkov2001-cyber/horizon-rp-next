-- Horizon RP Database Schema
-- Выполните этот SQL в Supabase SQL Editor

-- Users table
CREATE TABLE IF NOT EXISTS users (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    nick VARCHAR(50) UNIQUE NOT NULL,
    email VARCHAR(255) UNIQUE NOT NULL,
    password_hash TEXT NOT NULL,
    role VARCHAR(50) DEFAULT 'Player' NOT NULL,
    joined DATE DEFAULT CURRENT_DATE NOT NULL,
    banned BOOLEAN DEFAULT FALSE NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Roles table  
CREATE TABLE IF NOT EXISTS roles (
    id VARCHAR(50) PRIMARY KEY,
    name VARCHAR(100) NOT NULL,
    color VARCHAR(7) NOT NULL, -- hex color
    icon VARCHAR(10) NOT NULL,
    priority INTEGER NOT NULL DEFAULT 0,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Insert default roles
INSERT INTO roles (id, name, color, icon, priority) VALUES 
('Admin', 'Администратор', '#f472b6', '👑', 1),
('Moder', 'Модератор', '#a78bfa', '🛡', 2),
('Player', 'Игрок', '#60a5fa', '🎮', 3)
ON CONFLICT (id) DO NOTHING;

-- Logs table
CREATE TABLE IF NOT EXISTS logs (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    time TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    type VARCHAR(20) NOT NULL CHECK (type IN ('auth', 'forum', 'admin')),
    text TEXT NOT NULL,
    user_id UUID REFERENCES users(id) ON DELETE SET NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- News table
CREATE TABLE IF NOT EXISTS news (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    tag VARCHAR(50) NOT NULL,
    tag_color VARCHAR(7) NOT NULL,
    date VARCHAR(50) NOT NULL, -- keeping as string for compatibility
    title VARCHAR(255) NOT NULL,
    description TEXT NOT NULL,
    author_id UUID REFERENCES users(id) ON DELETE SET NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Insert default news
INSERT INTO news (tag, tag_color, date, title, description, author_id) VALUES 
('Обновление', '#a78bfa', '5 июля 2024', 'Обновление 3.0 — Новые районы и профессии', 'Добавлены 3 новых района, 47 автомобилей, 5 профессий и полностью переработана система полиции.', NULL),
('Событие', '#67e8f9', '1 июля 2024', 'Летний фестиваль — призы и турниры', 'Весь июль проходит летний фестиваль с гонками, турнирами и уникальными наградами.', NULL),
('Патч', '#6ee7b7', '28 июня 2024', 'Патч 2.9.5 — Исправления и оптимизация', 'Исправлены критические баги, улучшена производительность сервера.', NULL)
ON CONFLICT DO NOTHING;

-- Indexes for performance
CREATE INDEX IF NOT EXISTS idx_users_email ON users(email);
CREATE INDEX IF NOT EXISTS idx_users_nick ON users(nick);
CREATE INDEX IF NOT EXISTS idx_users_role ON users(role);
CREATE INDEX IF NOT EXISTS idx_logs_type ON logs(type);
CREATE INDEX IF NOT EXISTS idx_logs_time ON logs(time);
CREATE INDEX IF NOT EXISTS idx_news_created_at ON news(created_at);

-- Updated at trigger function
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ language 'plpgsql';

-- Add updated_at triggers
DROP TRIGGER IF EXISTS update_users_updated_at ON users;
CREATE TRIGGER update_users_updated_at 
    BEFORE UPDATE ON users 
    FOR EACH ROW 
    EXECUTE FUNCTION update_updated_at_column();

DROP TRIGGER IF EXISTS update_news_updated_at ON news;
CREATE TRIGGER update_news_updated_at 
    BEFORE UPDATE ON news 
    FOR EACH ROW 
    EXECUTE FUNCTION update_updated_at_column();

-- Row Level Security policies
ALTER TABLE users ENABLE ROW LEVEL SECURITY;
ALTER TABLE logs ENABLE ROW LEVEL SECURITY;  
ALTER TABLE news ENABLE ROW LEVEL SECURITY;
ALTER TABLE roles ENABLE ROW LEVEL SECURITY;

-- Public read access to roles and news
CREATE POLICY "Public roles access" ON roles FOR SELECT USING (true);
CREATE POLICY "Public news access" ON news FOR SELECT USING (true);

-- Users policies
CREATE POLICY "Users can read all users" ON users FOR SELECT USING (true);
CREATE POLICY "Users can update their own profile" ON users FOR UPDATE USING (auth.uid()::text = id::text);

-- Admin policies for logs
CREATE POLICY "Logs readable by admins" ON logs FOR SELECT USING (
    EXISTS (
        SELECT 1 FROM users 
        WHERE users.id::text = auth.uid()::text 
        AND users.role IN ('Admin', 'Moder')
    )
);

-- Admin policies for user management
CREATE POLICY "Admins can manage users" ON users FOR ALL USING (
    EXISTS (
        SELECT 1 FROM users 
        WHERE users.id::text = auth.uid()::text 
        AND users.role = 'Admin'
    )
);

CREATE POLICY "Admins can manage logs" ON logs FOR ALL USING (
    EXISTS (
        SELECT 1 FROM users 
        WHERE users.id::text = auth.uid()::text 
        AND users.role IN ('Admin', 'Moder')
    )
);

CREATE POLICY "Admins can manage news" ON news FOR ALL USING (
    EXISTS (
        SELECT 1 FROM users 
        WHERE users.id::text = auth.uid()::text 
        AND users.role IN ('Admin', 'Moder')
    )
);

CREATE POLICY "Admins can manage roles" ON roles FOR ALL USING (
    EXISTS (
        SELECT 1 FROM users 
        WHERE users.id::text = auth.uid()::text 
        AND users.role = 'Admin'
    )
);