set check_function_bodies = off;

CREATE OR REPLACE FUNCTION public.add_user_to_public()
 RETURNS trigger
 LANGUAGE plpgsql
AS $function$
BEGIN
    RAISE NOTICE 'Inserting new user with ID: %, Email: %', NEW.id, NEW.email;

    -- Try to insert the new user record
    INSERT INTO public.users (id, email, created_at) 
    VALUES (NEW.id, NEW.email, NOW());

    RAISE NOTICE 'User with ID: %, Email: % has been inserted successfully into public.users', NEW.id, NEW.email;
    RETURN NEW;

EXCEPTION
    -- Catch any error that occurs
    WHEN OTHERS THEN
        -- Log the error message
        RAISE EXCEPTION 'Error inserting user with ID: %, Email: %. Error: %', NEW.id, NEW.email, SQLERRM;
        RETURN NULL;
END;
$function$
;

grant delete on table "public"."users" to "supabase_auth_admin";

grant insert on table "public"."users" to "supabase_auth_admin";

grant select on table "public"."users" to "supabase_auth_admin";

grant update on table "public"."users" to "supabase_auth_admin";

create policy "insert_policy"
on "public"."users"
as permissive
for insert
to supabase_auth_admin
with check (true);



