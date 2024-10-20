-- 1. Alter phone_numbers table to add a foreign key referencing businesses
ALTER TABLE public.phone_numbers
ADD COLUMN business_id integer;

ALTER TABLE public.phone_numbers
ADD CONSTRAINT phone_numbers_business_id_fkey
FOREIGN KEY (business_id) REFERENCES public.businesses (id) ON DELETE CASCADE;
