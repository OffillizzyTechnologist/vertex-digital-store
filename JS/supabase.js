
/* ======================================
   VERTEX DIGITAL STORE
   SUPABASE CONNECTION
====================================== */

// Supabase Project URL
const SUPABASE_URL = "https://orlsznbrfdkvviyuccuq.supabase.co";

// Supabase Publishable Key
const SUPABASE_PUBLISHABLE_KEY = "sb_publishable_6BVAyuD2-3snleBC6iJsAw_qC_vE9fS";

// Create Supabase client
const { createClient } = window.supabase;

const supabaseClient = createClient(
    SUPABASE_URL,
    SUPABASE_PUBLISHABLE_KEY
);

// Make client available to auth.js
window.supabaseClient = supabaseClient;

console.log("VERTEX: Supabase connection initialized.");
