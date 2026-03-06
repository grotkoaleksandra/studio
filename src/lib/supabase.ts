import { createClient } from "@supabase/supabase-js";

// These values are set during infrastructure setup (/setup-alpacapps-infra)
const SUPABASE_URL = "https://dcxxyawykywszehghzyb.supabase.co";
const SUPABASE_ANON_KEY = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImRjeHh5YXd5a3l3c3plaGdoenliIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzI3OTQxMTQsImV4cCI6MjA4ODM3MDExNH0.1UM0FtWflGWTVAu6KmjkOW9uBfzV5L6LGvFRXzv_aZY";

export const supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY);
