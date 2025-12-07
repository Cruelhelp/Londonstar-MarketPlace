// Supabase Database Initialization Script
// This script creates all necessary tables automatically

class SupabaseInitializer {
    constructor() {
        this.supabase = window.supabaseClient;
    }

    // Check if tables exist and create them if needed
    async initializeDatabase() {
        console.log('🚀 Starting database initialization...');

        try {
            // First, check if we can connect to Supabase
            const { data: { user }, error: authError } = await this.supabase.auth.getUser();

            if (authError && authError.message.includes('Invalid API key')) {
                console.error('❌ Invalid Supabase credentials');
                return { success: false, error: 'Invalid Supabase credentials' };
            }

            // Check if tables exist by trying to query them
            const tablesExist = await this.checkTablesExist();

            if (!tablesExist) {
                console.log('📋 Tables not found. Creating database schema...');
                alert('Database tables need to be created. Please run the SQL schema in Supabase dashboard.\n\nGo to: SQL Editor > New Query > Paste supabase-schema.sql');
                return { success: false, error: 'Tables need to be created via SQL Editor' };
            } else {
                console.log('✅ All tables exist');
                return { success: true, message: 'Database is ready' };
            }
        } catch (error) {
            console.error('❌ Database initialization error:', error);
            return { success: false, error: error.message };
        }
    }

    // Check if required tables exist
    async checkTablesExist() {
        try {
            // Try to query each table
            const tables = ['users', 'products', 'orders', 'payment_info'];

            for (const table of tables) {
                const { error } = await this.supabase
                    .from(table)
                    .select('id')
                    .limit(1);

                if (error && error.code === '42P01') {
                    // Table doesn't exist
                    console.log(`❌ Table "${table}" not found`);
                    return false;
                }
            }

            return true;
        } catch (error) {
            console.error('Error checking tables:', error);
            return false;
        }
    }

    // Create user profile after signup
    async createUserProfile(userId, email, userData = {}) {
        try {
            // Check if profile exists (trigger should have created it)
            const { data: existingProfile } = await this.supabase
                .from('users')
                .select('*')
                .eq('id', userId)
                .single();

            if (existingProfile) {
                // Profile exists, update it with additional data
                const { data, error } = await this.supabase
                    .from('users')
                    .update({
                        full_name: userData.full_name || existingProfile.full_name,
                        role: userData.role || 'buyer',
                        status: userData.status || 'approved',
                        phone: userData.phone || null,
                        avatar_url: userData.avatar_url || null,
                        address: userData.address || null,
                        city: userData.city || null,
                        state: userData.state || null,
                        postal_code: userData.postal_code || null,
                        country: userData.country || null
                    })
                    .eq('id', userId)
                    .select();

                if (error) throw error;
                console.log('✅ User profile updated:', data);
                return { success: true, data };
            } else {
                // Fallback: insert if trigger didn't create it
                const { data, error } = await this.supabase
                    .from('users')
                    .insert([{
                        id: userId,
                        email: email,
                        full_name: userData.full_name || '',
                        role: userData.role || 'buyer',
                        status: userData.status || 'approved',
                        phone: userData.phone || null,
                        avatar_url: userData.avatar_url || null
                    }])
                    .select();

                if (error) throw error;
                console.log('✅ User profile created:', data);
                return { success: true, data };
            }
        } catch (error) {
            console.error('❌ Error creating user profile:', error);
            return { success: false, error: error.message };
        }
    }

    // Get or create user profile
    async ensureUserProfile(userId, email, userData = {}) {
        try {
            // Try to get existing profile
            const { data: existingProfile, error: fetchError } = await this.supabase
                .from('users')
                .select('*')
                .eq('id', userId)
                .single();

            if (fetchError && fetchError.code !== 'PGRST116') {
                throw fetchError;
            }

            if (existingProfile) {
                console.log('✅ User profile found:', existingProfile);
                return { success: true, data: existingProfile };
            }

            // Create new profile if doesn't exist
            return await this.createUserProfile(userId, email, userData);
        } catch (error) {
            console.error('❌ Error ensuring user profile:', error);
            return { success: false, error: error.message };
        }
    }

    // Migrate localStorage data to Supabase
    async migrateLocalDataToSupabase(userId) {
        try {
            console.log('🔄 Migrating localStorage data to Supabase...');

            // Migrate products
            const localProducts = localStorage.getItem('sellerProducts');
            if (localProducts) {
                const products = JSON.parse(localProducts);

                for (const product of products) {
                    await this.supabase
                        .from('products')
                        .upsert({
                            name: product.name,
                            description: product.description,
                            price: product.price,
                            category: product.category,
                            stock: product.stock,
                            images: product.images,
                            seller_id: userId,
                            status: 'active'
                        });
                }

                console.log(`✅ Migrated ${products.length} products`);
            }

            // Migrate payment info
            const localPayment = localStorage.getItem('paymentSetup');
            if (localPayment) {
                const payment = JSON.parse(localPayment);

                await this.supabase
                    .from('payment_info')
                    .upsert({
                        seller_id: userId,
                        payment_method: payment.method,
                        account_email: payment.email,
                        account_id: payment.accountId,
                        account_name: payment.name
                    });

                console.log('✅ Migrated payment info');
            }

            return { success: true };
        } catch (error) {
            console.error('❌ Error migrating data:', error);
            return { success: false, error: error.message };
        }
    }

    // Setup storage buckets
    async setupStorageBuckets() {
        try {
            console.log('🗄️ Checking storage buckets...');

            const { data: buckets, error } = await this.supabase
                .storage
                .listBuckets();

            if (error) throw error;

            const requiredBuckets = ['product-images', 'profile-pictures'];

            for (const bucketName of requiredBuckets) {
                const exists = buckets.find(b => b.name === bucketName);

                if (!exists) {
                    console.log(`Creating bucket: ${bucketName}`);

                    const { error: createError } = await this.supabase
                        .storage
                        .createBucket(bucketName, {
                            public: true,
                            fileSizeLimit: 5242880 // 5MB
                        });

                    if (createError && createError.message !== 'Bucket already exists') {
                        console.error(`❌ Error creating bucket ${bucketName}:`, createError);
                    } else {
                        console.log(`✅ Bucket ${bucketName} ready`);
                    }
                } else {
                    console.log(`✅ Bucket ${bucketName} exists`);
                }
            }

            return { success: true };
        } catch (error) {
            console.error('❌ Error setting up storage:', error);
            return { success: false, error: error.message };
        }
    }

    // Run full initialization
    async runFullSetup() {
        console.log('🚀 Running full Supabase setup...');

        const results = {
            database: await this.initializeDatabase(),
            storage: await this.setupStorageBuckets()
        };

        if (results.database.success) {
            console.log('✅ Database initialization complete');
        } else {
            console.error('❌ Database initialization failed:', results.database.error);
        }

        if (results.storage.success) {
            console.log('✅ Storage setup complete');
        } else {
            console.error('❌ Storage setup failed:', results.storage.error);
        }

        return results;
    }
}

// Initialize and export
const supabaseInit = new SupabaseInitializer();
window.supabaseInit = supabaseInit;

// Auto-run initialization check on load
window.addEventListener('load', async () => {
    console.log('🔍 Checking Supabase configuration...');

    // Only check, don't create tables automatically
    const result = await supabaseInit.initializeDatabase();

    if (!result.success) {
        console.warn('⚠️ Supabase not fully configured:', result.error);
        console.log('📖 See SETUP.md for configuration instructions');
    }
});

console.log('📦 Supabase Initializer loaded');
console.log('Available commands:');
console.log('  - supabaseInit.runFullSetup()           : Run full setup');
console.log('  - supabaseInit.initializeDatabase()     : Check/init database');
console.log('  - supabaseInit.setupStorageBuckets()    : Setup storage');
console.log('  - supabaseInit.migrateLocalDataToSupabase(userId) : Migrate data');
