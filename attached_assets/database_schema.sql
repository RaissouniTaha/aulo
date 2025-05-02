-- Database Schema for Government Agency Website
-- PostgreSQL with PostGIS extension

-- Enable PostGIS extension
CREATE EXTENSION IF NOT EXISTS postgis;

-- Languages for multilingual content
CREATE TABLE languages (
    language_id SERIAL PRIMARY KEY,
    language_code VARCHAR(10) NOT NULL UNIQUE,  -- e.g., 'en', 'fr', 'ar'
    language_name VARCHAR(50) NOT NULL,
    is_default BOOLEAN DEFAULT FALSE,
    is_active BOOLEAN DEFAULT TRUE,
    direction VARCHAR(5) NOT NULL DEFAULT 'ltr', -- ltr or rtl
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- User Roles
CREATE TABLE roles (
    role_id SERIAL PRIMARY KEY,
    role_name VARCHAR(50) NOT NULL UNIQUE,
    description TEXT,
    permissions JSONB,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Website Users (Admin, Editors, etc.)
CREATE TABLE users (
    user_id SERIAL PRIMARY KEY,
    username VARCHAR(50) UNIQUE NOT NULL,
    email VARCHAR(255) UNIQUE NOT NULL,
    password_hash VARCHAR(255) NOT NULL,
    first_name VARCHAR(100),
    last_name VARCHAR(100),
    profile_image VARCHAR(255),
    role_id INTEGER REFERENCES roles(role_id),
    default_language VARCHAR(10) REFERENCES languages(language_code),
    is_active BOOLEAN DEFAULT TRUE,
    last_login TIMESTAMP WITH TIME ZONE,
    password_reset_token VARCHAR(255),
    password_reset_expires TIMESTAMP WITH TIME ZONE,
    mfa_secret VARCHAR(255),
    mfa_enabled BOOLEAN DEFAULT FALSE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Content Categories
CREATE TABLE categories (
    category_id SERIAL PRIMARY KEY,
    parent_id INTEGER REFERENCES categories(category_id),
    slug VARCHAR(100) NOT NULL,
    created_by INTEGER REFERENCES users(user_id),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Translatable Category Content
CREATE TABLE category_translations (
    translation_id SERIAL PRIMARY KEY,
    category_id INTEGER REFERENCES categories(category_id) ON DELETE CASCADE,
    language_code VARCHAR(10) REFERENCES languages(language_code),
    name VARCHAR(100) NOT NULL,
    description TEXT,
    meta_title VARCHAR(100),
    meta_description VARCHAR(255),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    UNIQUE(category_id, language_code)
);

-- Navigation Menus
CREATE TABLE menus (
    menu_id SERIAL PRIMARY KEY,
    menu_name VARCHAR(100) NOT NULL,
    slug VARCHAR(100) NOT NULL UNIQUE,
    description TEXT,
    created_by INTEGER REFERENCES users(user_id),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Menu Items
CREATE TABLE menu_items (
    item_id SERIAL PRIMARY KEY,
    menu_id INTEGER REFERENCES menus(menu_id) ON DELETE CASCADE,
    parent_id INTEGER REFERENCES menu_items(item_id),
    title VARCHAR(100) NOT NULL,
    url_type VARCHAR(20) NOT NULL, -- 'internal', 'external', 'page', 'category'
    url VARCHAR(255),
    page_id INTEGER, -- Reference to pages (defined below)
    target VARCHAR(20) DEFAULT '_self', -- '_self', '_blank', etc.
    icon_class VARCHAR(50),
    css_class VARCHAR(100),
    sort_order INTEGER DEFAULT 0,
    is_active BOOLEAN DEFAULT TRUE,
    language_code VARCHAR(10) REFERENCES languages(language_code),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Content Pages
CREATE TABLE pages (
    page_id SERIAL PRIMARY KEY,
    slug VARCHAR(100) NOT NULL,
    template VARCHAR(50) DEFAULT 'default',
    is_published BOOLEAN DEFAULT FALSE,
    publish_at TIMESTAMP WITH TIME ZONE,
    category_id INTEGER REFERENCES categories(category_id),
    featured_image VARCHAR(255),
    created_by INTEGER REFERENCES users(user_id),
    updated_by INTEGER REFERENCES users(user_id),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Page Translations
CREATE TABLE page_translations (
    translation_id SERIAL PRIMARY KEY,
    page_id INTEGER REFERENCES pages(page_id) ON DELETE CASCADE,
    language_code VARCHAR(10) REFERENCES languages(language_code),
    title VARCHAR(255) NOT NULL,
    content TEXT,
    excerpt TEXT,
    meta_title VARCHAR(100),
    meta_description VARCHAR(255),
    meta_keywords VARCHAR(255),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    UNIQUE(page_id, language_code)
);

-- News Articles
CREATE TABLE news (
    news_id SERIAL PRIMARY KEY,
    slug VARCHAR(100) NOT NULL,
    is_published BOOLEAN DEFAULT FALSE,
    publish_at TIMESTAMP WITH TIME ZONE,
    category_id INTEGER REFERENCES categories(category_id),
    featured_image VARCHAR(255),
    is_featured BOOLEAN DEFAULT FALSE,
    created_by INTEGER REFERENCES users(user_id),
    updated_by INTEGER REFERENCES users(user_id),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- News Translations
CREATE TABLE news_translations (
    translation_id SERIAL PRIMARY KEY,
    news_id INTEGER REFERENCES news(news_id) ON DELETE CASCADE,
    language_code VARCHAR(10) REFERENCES languages(language_code),
    title VARCHAR(255) NOT NULL,
    content TEXT,
    excerpt TEXT,
    meta_title VARCHAR(100),
    meta_description VARCHAR(255),
    meta_keywords VARCHAR(255),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    UNIQUE(news_id, language_code)
);

-- Services
CREATE TABLE services (
    service_id SERIAL PRIMARY KEY,
    slug VARCHAR(100) NOT NULL,
    is_published BOOLEAN DEFAULT FALSE,
    icon VARCHAR(50),
    featured_image VARCHAR(255),
    sort_order INTEGER DEFAULT 0,
    created_by INTEGER REFERENCES users(user_id),
    updated_by INTEGER REFERENCES users(user_id),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Service Translations
CREATE TABLE service_translations (
    translation_id SERIAL PRIMARY KEY,
    service_id INTEGER REFERENCES services(service_id) ON DELETE CASCADE,
    language_code VARCHAR(10) REFERENCES languages(language_code),
    title VARCHAR(255) NOT NULL,
    short_description TEXT,
    full_description TEXT,
    meta_title VARCHAR(100),
    meta_description VARCHAR(255),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    UNIQUE(service_id, language_code)
);

-- Document Categories
CREATE TABLE document_categories (
    category_id SERIAL PRIMARY KEY,
    parent_id INTEGER REFERENCES document_categories(category_id),
    slug VARCHAR(100) NOT NULL,
    created_by INTEGER REFERENCES users(user_id),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Document Category Translations
CREATE TABLE document_category_translations (
    translation_id SERIAL PRIMARY KEY,
    category_id INTEGER REFERENCES document_categories(category_id) ON DELETE CASCADE,
    language_code VARCHAR(10) REFERENCES languages(language_code),
    name VARCHAR(100) NOT NULL,
    description TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    UNIQUE(category_id, language_code)
);

-- Documents Repository
CREATE TABLE documents (
    document_id SERIAL PRIMARY KEY,
    category_id INTEGER REFERENCES document_categories(category_id),
    file_path VARCHAR(255) NOT NULL,
    file_size INTEGER,
    file_type VARCHAR(50),
    is_published BOOLEAN DEFAULT FALSE,
    publish_at TIMESTAMP WITH TIME ZONE,
    expires_at TIMESTAMP WITH TIME ZONE,
    download_count INTEGER DEFAULT 0,
    created_by INTEGER REFERENCES users(user_id),
    updated_by INTEGER REFERENCES users(user_id),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Document Translations
CREATE TABLE document_translations (
    translation_id SERIAL PRIMARY KEY,
    document_id INTEGER REFERENCES documents(document_id) ON DELETE CASCADE,
    language_code VARCHAR(10) REFERENCES languages(language_code),
    title VARCHAR(255) NOT NULL,
    description TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    UNIQUE(document_id, language_code)
);

-- Media Library
CREATE TABLE media (
    media_id SERIAL PRIMARY KEY,
    file_name VARCHAR(255) NOT NULL,
    file_path VARCHAR(255) NOT NULL,
    file_type VARCHAR(50),
    mime_type VARCHAR(100),
    file_size INTEGER,
    width INTEGER,
    height INTEGER,
    alt_text VARCHAR(255),
    title VARCHAR(255),
    description TEXT,
    uploaded_by INTEGER REFERENCES users(user_id),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Spatial Plans and Maps
CREATE TABLE spatial_plans (
    plan_id SERIAL PRIMARY KEY,
    reference_number VARCHAR(50),
    approval_date DATE,
    effective_date DATE,
    expiration_date DATE,
    status VARCHAR(50),
    plan_type VARCHAR(50),
    file_path VARCHAR(255),
    thumbnail_path VARCHAR(255),
    is_published BOOLEAN DEFAULT FALSE,
    created_by INTEGER REFERENCES users(user_id),
    updated_by INTEGER REFERENCES users(user_id),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Spatial Plan Translations
CREATE TABLE spatial_plan_translations (
    translation_id SERIAL PRIMARY KEY,
    plan_id INTEGER REFERENCES spatial_plans(plan_id) ON DELETE CASCADE,
    language_code VARCHAR(10) REFERENCES languages(language_code),
    title VARCHAR(255) NOT NULL,
    description TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    UNIQUE(plan_id, language_code)
);

-- Spatial Plan Geometries
CREATE TABLE spatial_plan_areas (
    area_id SERIAL PRIMARY KEY,
    plan_id INTEGER REFERENCES spatial_plans(plan_id) ON DELETE CASCADE,
    name VARCHAR(100),
    description TEXT,
    geometry geometry(GEOMETRY, 4326), -- WGS84 SRID
    area_type VARCHAR(50),
    style_properties JSONB, -- For storing styling information
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Forms and Applications
CREATE TABLE forms (
    form_id SERIAL PRIMARY KEY,
    form_type VARCHAR(50) NOT NULL,
    slug VARCHAR(100) NOT NULL,
    is_active BOOLEAN DEFAULT TRUE,
    requires_auth BOOLEAN DEFAULT FALSE,
    form_schema JSONB, -- JSON schema for form fields
    notification_emails TEXT[], -- Array of email addresses for notifications
    created_by INTEGER REFERENCES users(user_id),
    updated_by INTEGER REFERENCES users(user_id),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Form Translations
CREATE TABLE form_translations (
    translation_id SERIAL PRIMARY KEY,
    form_id INTEGER REFERENCES forms(form_id) ON DELETE CASCADE,
    language_code VARCHAR(10) REFERENCES languages(language_code),
    title VARCHAR(255) NOT NULL,
    description TEXT,
    success_message TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    UNIQUE(form_id, language_code)
);

-- Form Submissions
CREATE TABLE form_submissions (
    submission_id SERIAL PRIMARY KEY,
    form_id INTEGER REFERENCES forms(form_id),
    submission_data JSONB,
    submission_status VARCHAR(50) DEFAULT 'pending',
    notes TEXT,
    ip_address VARCHAR(45),
    user_agent TEXT,
    submitted_by INTEGER REFERENCES users(user_id),
    processed_by INTEGER REFERENCES users(user_id),
    processed_at TIMESTAMP WITH TIME ZONE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Contact and Feedback Messages
CREATE TABLE contact_messages (
    message_id SERIAL PRIMARY KEY,
    name VARCHAR(100) NOT NULL,
    email VARCHAR(255) NOT NULL,
    phone VARCHAR(50),
    subject VARCHAR(255),
    message TEXT NOT NULL,
    message_type VARCHAR(50) DEFAULT 'contact',
    status VARCHAR(50) DEFAULT 'unread',
    ip_address VARCHAR(45),
    is_spam BOOLEAN DEFAULT FALSE,
    responded_by INTEGER REFERENCES users(user_id),
    responded_at TIMESTAMP WITH TIME ZONE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- FAQ Categories
CREATE TABLE faq_categories (
    category_id SERIAL PRIMARY KEY,
    slug VARCHAR(100) NOT NULL,
    sort_order INTEGER DEFAULT 0,
    created_by INTEGER REFERENCES users(user_id),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- FAQ Category Translations
CREATE TABLE faq_category_translations (
    translation_id SERIAL PRIMARY KEY,
    category_id INTEGER REFERENCES faq_categories(category_id) ON DELETE CASCADE,
    language_code VARCHAR(10) REFERENCES languages(language_code),
    name VARCHAR(100) NOT NULL,
    description TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    UNIQUE(category_id, language_code)
);

-- FAQs
CREATE TABLE faqs (
    faq_id SERIAL PRIMARY KEY,
    category_id INTEGER REFERENCES faq_categories(category_id),
    is_published BOOLEAN DEFAULT FALSE,
    sort_order INTEGER DEFAULT 0,
    created_by INTEGER REFERENCES users(user_id),
    updated_by INTEGER REFERENCES users(user_id),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- FAQ Translations
CREATE TABLE faq_translations (
    translation_id SERIAL PRIMARY KEY,
    faq_id INTEGER REFERENCES faqs(faq_id) ON DELETE CASCADE,
    language_code VARCHAR(10) REFERENCES languages(language_code),
    question TEXT NOT NULL,
    answer TEXT NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    UNIQUE(faq_id, language_code)
);

-- Website Settings
CREATE TABLE settings (
    setting_id SERIAL PRIMARY KEY,
    setting_key VARCHAR(100) NOT NULL UNIQUE,
    setting_value TEXT,
    setting_type VARCHAR(50) DEFAULT 'string',
    is_translatable BOOLEAN DEFAULT FALSE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Translatable Settings
CREATE TABLE setting_translations (
    translation_id SERIAL PRIMARY KEY,
    setting_id INTEGER REFERENCES settings(setting_id) ON DELETE CASCADE,
    language_code VARCHAR(10) REFERENCES languages(language_code),
    setting_value TEXT NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    UNIQUE(setting_id, language_code)
);

-- Audit Log
CREATE TABLE audit_logs (
    log_id SERIAL PRIMARY KEY,
    user_id INTEGER REFERENCES users(user_id),
    action VARCHAR(50) NOT NULL,
    table_name VARCHAR(50),
    record_id INTEGER,
    old_values JSONB,
    new_values JSONB,
    ip_address VARCHAR(45),
    user_agent TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Session Tracking
CREATE TABLE sessions (
    session_id VARCHAR(255) PRIMARY KEY,
    user_id INTEGER REFERENCES users(user_id),
    ip_address VARCHAR(45),
    user_agent TEXT,
    payload TEXT,
    last_activity INTEGER,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Initial data for languages
INSERT INTO languages (language_code, language_name, is_default, direction) VALUES
('en', 'English', TRUE, 'ltr'),
('fr', 'French', FALSE, 'ltr'),
('ar', 'Arabic', FALSE, 'rtl');

-- Initial data for roles
INSERT INTO roles (role_name, description, permissions) VALUES
('administrator', 'Full access to all features', '{"all": true}'),
('editor', 'Can edit content but cannot manage users or settings', '{"content": {"read": true, "create": true, "update": true, "delete": true}, "users": {"read": true}}'),
('content_manager', 'Can manage all content', '{"content": {"read": true, "create": true, "update": true, "delete": true}}'),
('translator', 'Can translate content only', '{"content": {"read": true, "update": true}}');

-- Create indexes for better performance
CREATE INDEX idx_pages_slug ON pages(slug);
CREATE INDEX idx_news_slug ON news(slug);
CREATE INDEX idx_services_slug ON services(slug);
CREATE INDEX idx_documents_filepath ON documents(file_path);
CREATE INDEX idx_spatial_plan_areas_geom ON spatial_plan_areas USING GIST(geometry);
CREATE INDEX idx_form_submissions_form_id ON form_submissions(form_id);
CREATE INDEX idx_contact_messages_status ON contact_messages(status);
CREATE INDEX idx_users_email ON users(email);
CREATE INDEX idx_audit_logs_user_id ON audit_logs(user_id);
CREATE INDEX idx_audit_logs_created_at ON audit_logs(created_at);

-- Add function for updating timestamps automatically
CREATE OR REPLACE FUNCTION update_timestamp()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = CURRENT_TIMESTAMP;
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Create triggers for all tables with updated_at column
DO $$
DECLARE
    t text;
BEGIN
    FOR t IN 
        SELECT table_name 
        FROM information_schema.columns 
        WHERE column_name = 'updated_at' 
        AND table_schema = 'public'
    LOOP
        EXECUTE format('
            CREATE TRIGGER trigger_update_timestamp
            BEFORE UPDATE ON %I
            FOR EACH ROW EXECUTE PROCEDURE update_timestamp()', t);
    END LOOP;
END;
$$ LANGUAGE plpgsql;