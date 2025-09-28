CREATE TABLE happiness (
    id SERIAL PRIMARY KEY,
    date DATE NOT NULL UNIQUE,
    score INTEGER NOT NULL CHECK (score >= 1 AND score <= 10)
)