CREATE TABLE IF NOT EXISTS report_jobs (
    id SERIAL PRIMARY KEY,
    report_type TEXT NOT NULL,
    status TEXT NOT NULL DEFAULT 'queued',
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    started_at TIMESTAMPTZ,
    completed_at TIMESTAMPTZ,
    file_path TEXT,
    error_message TEXT
);

CREATE TABLE IF NOT EXISTS orders (
    id SERIAL PRIMARY KEY,
    amount NUMERIC(10, 2) NOT NULL,
    status TEXT NOT NULL DEFAULT 'completed',
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

INSERT INTO orders (amount, status, created_at) VALUES
(120.50, 'completed', '2025-01-05'),
(75.00, 'completed', '2025-01-12'),
(200.00, 'completed', '2025-02-03'),
(50.25, 'refunded', '2025-02-14'),
(150.75, 'completed', '2025-03-01'),
(95.00, 'pending', '2025-03-22'),
(300.00, 'completed', '2025-04-10'),
(60.00, 'completed', '2025-04-28'),
(180.00, 'completed', '2025-05-15'),
(45.50, 'refunded', '2025-06-02')
ON CONFLICT (id) DO NOTHING;

ALTER TABLE report_jobs DISABLE ROW LEVEL SECURITY;
ALTER TABLE orders DISABLE ROW LEVEL SECURITY;
