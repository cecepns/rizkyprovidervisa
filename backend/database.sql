CREATE DATABASE IF NOT EXISTS rizkyprovidervisa;
USE rizkyprovidervisa;

CREATE TABLE IF NOT EXISTS admin_users (
    id INT PRIMARY KEY AUTO_INCREMENT,
    username VARCHAR(100) UNIQUE NOT NULL,
    password VARCHAR(255) NOT NULL,
    email VARCHAR(150),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS countries (
    id INT PRIMARY KEY AUTO_INCREMENT,
    name VARCHAR(100) NOT NULL,
    code VARCHAR(10),
    flag VARCHAR(50),
    image VARCHAR(255),
    description TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS visa_types (
    id INT PRIMARY KEY AUTO_INCREMENT,
    country_id INT NOT NULL,
    name VARCHAR(100) NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (country_id) REFERENCES countries(id) ON DELETE CASCADE
);

CREATE TABLE IF NOT EXISTS visa_categories (
    id INT PRIMARY KEY AUTO_INCREMENT,
    visa_type_id INT NOT NULL,
    name VARCHAR(100) NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (visa_type_id) REFERENCES visa_types(id) ON DELETE CASCADE
);

CREATE TABLE IF NOT EXISTS visa_details (
    id INT PRIMARY KEY AUTO_INCREMENT,
    visa_category_id INT NOT NULL,
    process_type VARCHAR(100) NOT NULL,
    processing_time VARCHAR(50),
    price DECIMAL(12,2),
    requirements TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (visa_category_id) REFERENCES visa_categories(id) ON DELETE CASCADE
);

CREATE TABLE IF NOT EXISTS settings (
    id INT PRIMARY KEY AUTO_INCREMENT,
    setting_key VARCHAR(100) UNIQUE NOT NULL,
    setting_value TEXT,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);

INSERT INTO admin_users (username, password, email) VALUES
('admin', '$2a$10$rKZJJzXqF5Z5Z5Z5Z5Z5ZOqVqVqVqVqVqVqVqVqVqVqVqVqVqVqVq', 'admin@rizkyprovidervisa.com');

INSERT INTO settings (setting_key, setting_value) VALUES
('address', 'Tarim, Yaman'),
('phone', '+62 831-1570-6849'),
('email', 'info@rizkyprovidervisa.com'),
('maps_embed', ''),
('about_us', 'RizkyProviderVisa adalah penyedia layanan pengurusan visa terpercaya untuk Umroh, Haji, Schengen, dan visa internasional lainnya. Kami berkomitmen memberikan pelayanan terbaik dengan proses yang cepat dan aman.'),
('working_hours', 'Senin - Jumat: 08:00 - 17:00 WIB, Sabtu: 08:00 - 12:00 WIB');
