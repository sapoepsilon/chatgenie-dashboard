import { type NextRequest } from 'next/server';
import { createClient } from './server';

export async function updateSession(request: NextRequest) {
  const supabase = createClient();
  const { data, error } = await supabase.auth.getUser();
  console.log(data)
console.log(request) // we need to call these so eslint is not complaining
  if (error) {
    return new Response('Unauthorized', { status: 401 });
  }

  // Update session logic here
  return new Response('Session updated', { status: 200 });
}
