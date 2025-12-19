// Supabase Configuration
const SUPABASE_URL = 'https://klmfpofizmycjvlnrpwo.supabase.co';
const SUPABASE_ANON_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImtsbWZwb2Zpem15Y2p2bG5ycHdvIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjQzMzc0MTUsImV4cCI6MjA3OTkxMzQxNX0.SYRqtelRFf7BRfaC2t8KzvqMYLealAUDWQml2hqe8YA';

// Create and store the Supabase client instance globally
if (!window.supabaseClient) {
    // Store library reference temporarily
    const supabaseLib = window.supabase;
    // Create client
    window.supabaseClient = supabaseLib.createClient(SUPABASE_URL, SUPABASE_ANON_KEY);
    // Make client available as window.supabase for all scripts
    window.supabase = window.supabaseClient;
    console.log('✅ Supabase client initialized');
}

// Initialize database tables if needed
async function initializeDatabase() {
    try {
        // Check if products table exists by trying to query it
        const { data, error } = await window.supabase
            .from('products')
            .select('id')
            .limit(1);

        if (error && error.code === '42P01') {
            console.log('Database tables need to be created via Supabase dashboard');
        }
    } catch (err) {
        console.error('Database initialization check:', err);
    }
}

// Auth state change listener
if (window.supabase && window.supabase.auth) {
    window.supabase.auth.onAuthStateChange((event, session) => {
        if (event === 'SIGNED_IN') {
            console.log('User signed in:', session.user.email);
        } else if (event === 'SIGNED_OUT') {
            console.log('User signed out');
        }
    });
}

console.log('✅ Supabase configured and ready');
