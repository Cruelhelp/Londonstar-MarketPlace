// Supabase Configuration
const SUPABASE_URL = 'https://klmfpofizmycjvlnrpwo.supabase.co';
const SUPABASE_ANON_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImtsbWZwb2Zpem15Y2p2bG5ycHdvIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjQzMzc0MTUsImV4cCI6MjA3OTkxMzQxNX0.SYRqtelRFf7BRfaC2t8KzvqMYLealAUDWQml2hqe8YA';

const supabase = window.supabase.createClient(SUPABASE_URL, SUPABASE_ANON_KEY);

// Initialize database tables if needed
async function initializeDatabase() {
    try {
        // Check if products table exists by trying to query it
        const { data, error } = await supabase
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
supabase.auth.onAuthStateChange((event, session) => {
    if (event === 'SIGNED_IN') {
        console.log('User signed in:', session.user.email);
    } else if (event === 'SIGNED_OUT') {
        console.log('User signed out');
    }
});

// Export for use in other files
window.supabaseClient = supabase;
