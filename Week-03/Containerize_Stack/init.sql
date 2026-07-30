-- Initialise the tasks table for the Task CRUD API.
-- This script runs automatically on first database container startup
-- (mounted at /docker-entrypoint-initdb.d/).

CREATE TABLE IF NOT EXISTS tasks (
    id SERIAL PRIMARY KEY,
    title VARCHAR(255) NOT NULL,
    done BOOLEAN NOT NULL DEFAULT FALSE
);

-- Seed sample tasks so the API returns data immediately
INSERT INTO tasks (title, done) VALUES
    ('Buy groceries', FALSE),
    ('Read a book', TRUE),
    ('Write code', FALSE);

