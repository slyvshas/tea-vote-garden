// This file is automatically generated. Do not edit it directly.
import { createClient } from '@supabase/supabase-js';
import type { Database } from './types';

const SUPABASE_URL = "https://qtywqrzddfwmfuippcoa.supabase.co";
const SUPABASE_PUBLISHABLE_KEY = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InF0eXdxcnpkZGZ3bWZ1aXBwY29hIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDM0MjgxNzEsImV4cCI6MjA1OTAwNDE3MX0.ejwkIEtlYyzi9w0QzznuhIm02Jkmd0EcK7Wsra1TicI";

// Import the supabase client like this:
// import { supabase } from "@/integrations/supabase/client";

export const supabase = createClient<Database>(SUPABASE_URL, SUPABASE_PUBLISHABLE_KEY);