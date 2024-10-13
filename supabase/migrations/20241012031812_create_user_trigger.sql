-- Function to insert new user data into the public.users table
CREATE OR REPLACE FUNCTION public.insert_user_data()
RETURNS TRIGGER AS $$
BEGIN
    INSERT INTO public.users (id, email, created_at)
    VALUES (NEW.id, NEW.email, NOW());
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Trigger to call the function on new user insert
CREATE TRIGGER user_insert_trigger
AFTER INSERT ON auth.users
FOR EACH ROW EXECUTE FUNCTION public.insert_user_data();
