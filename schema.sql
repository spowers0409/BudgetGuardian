-- Ensure extensions are enabled
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- Create User Table
CREATE TABLE "user" (
    userID SERIAL PRIMARY KEY,
    full_name VARCHAR(255) NOT NULL,
    email VARCHAR(255) NOT NULL UNIQUE,
    password_hash VARCHAR(255) NOT NULL,
    created_at TIMESTAMP DEFAULT NOW(),
    updated_at TIMESTAMP DEFAULT NOW()
);

-- Create Budget Table
CREATE TABLE budget (
    budget_id SERIAL PRIMARY KEY,
    category VARCHAR(255) NOT NULL UNIQUE,
    budgeted DECIMAL(10,2) NOT NULL DEFAULT 0,
    spent DECIMAL(10,2) NOT NULL DEFAULT 0,
    created_at TIMESTAMP DEFAULT NOW(),
    updated_at TIMESTAMP DEFAULT NOW()
);

-- Create Transaction Table
CREATE TABLE transaction (
    transaction_id SERIAL PRIMARY KEY,
    transaction_date DATE NOT NULL,
    category VARCHAR(255) NOT NULL,
    place VARCHAR(255),
    amount DECIMAL(10,2) NOT NULL,
    created_at TIMESTAMP DEFAULT NOW(),
    updated_at TIMESTAMP DEFAULT NOW()
);

-- Foreign Key Constraints
ALTER TABLE transaction ADD CONSTRAINT fk_category FOREIGN KEY (category) REFERENCES budget(category);
