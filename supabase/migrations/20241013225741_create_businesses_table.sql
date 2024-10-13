-- Migration to create the businesses table
CREATE TABLE public.businesses (
    id SERIAL PRIMARY KEY,
    user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
    business_name TEXT NOT NULL,
    week_schedule JSONB NOT NULL,
    tele_operator_instructions TEXT,
    uploaded_files JSONB,
    created_at TIMESTAMPTZ DEFAULT NOW()
);