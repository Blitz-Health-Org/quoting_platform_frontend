import { createClient } from "@supabase/supabase-js";

export const supabase = createClient(
  "https://xabksrsyvpqlikxxwfgi.supabase.co",
  "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InhhYmtzcnN5dnBxbGlreHh3ZmdpIiwicm9sZSI6ImFub24iLCJpYXQiOjE3MDc4NTM4NzgsImV4cCI6MjAyMzQyOTg3OH0.rUzmHolfckNk_wqKcNcmr0CD5C1hjt8iOShk3zM-uVw"
);
