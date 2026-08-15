-- Run this SQL in your Supabase Dashboard -> SQL Editor

CREATE TABLE IF NOT EXISTS report_jobs (
    id SERIAL PRIMARY KEY,
    report_type TEXT NOT NULL,
    status TEXT NOT NULL DEFAULT 'queued',
    created_at TIMESTAMP DEFAULT NOW(),
    started_at TIMESTAMP,
    completed_at TIMESTAMP,
    file_path TEXT,
    error_message TEXT
);

CREATE TABLE IF NOT EXISTS orders (
    id SERIAL PRIMARY KEY,
    amount NUMERIC NOT NULL,
    status TEXT NOT NULL DEFAULT 'pending',
    created_at TIMESTAMP DEFAULT NOW()
);

-- Optional: sample data for testing
INSERT INTO orders (amount, status, created_at) VALUES
    (120.50, 'completed', '2025-01-15'),
    (75.00, 'completed', '2025-02-03'),
    (200.00, 'pending', '2025-03-10'),
    (50.25, 'refunded', '2025-04-22'),
    (300.00, 'completed', '2025-05-05'),
    (150.00, 'pending', '2025-06-18'),
    (90.00, 'completed', '2025-07-01');
