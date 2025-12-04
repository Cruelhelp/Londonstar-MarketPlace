// Supabase Homepage Data Management
// This file handles all homepage-related data storage using Supabase

const HomepageDB = {
    // Hero Background Management
    async saveHeroBackground(imageData) {
        try {
            const { data, error } = await supabaseClient
                .from('homepage_settings')
                .upsert({
                    id: 1,
                    hero_background: imageData,
                    updated_at: new Date().toISOString()
                })
                .select();

            if (error) throw error;
            return { success: true, data };
        } catch (error) {
            console.error('Error saving hero background:', error);
            return { success: false, error: error.message };
        }
    },

    async getHeroBackground() {
        try {
            const { data, error } = await supabaseClient
                .from('homepage_settings')
                .select('hero_background')
                .eq('id', 1)
                .single();

            if (error && error.code !== 'PGRST116') throw error;
            return { success: true, data: data?.hero_background || null };
        } catch (error) {
            console.error('Error getting hero background:', error);
            return { success: false, error: error.message };
        }
    },

    async removeHeroBackground() {
        try {
            const { data, error } = await supabaseClient
                .from('homepage_settings')
                .update({ hero_background: null, updated_at: new Date().toISOString() })
                .eq('id', 1)
                .select();

            if (error) throw error;
            return { success: true, data };
        } catch (error) {
            console.error('Error removing hero background:', error);
            return { success: false, error: error.message };
        }
    },

    // Auth Page Background Management
    async saveAuthBackground(imageData) {
        try {
            const { data, error } = await supabaseClient
                .from('homepage_settings')
                .upsert({
                    id: 1,
                    auth_background: imageData,
                    updated_at: new Date().toISOString()
                })
                .select();

            if (error) throw error;
            return { success: true, data };
        } catch (error) {
            console.error('Error saving auth background:', error);
            return { success: false, error: error.message };
        }
    },

    async getAuthBackground() {
        try {
            const { data, error } = await supabaseClient
                .from('homepage_settings')
                .select('auth_background')
                .eq('id', 1)
                .single();

            if (error && error.code !== 'PGRST116') throw error;
            return { success: true, data: data?.auth_background || null };
        } catch (error) {
            console.error('Error getting auth background:', error);
            return { success: false, error: error.message };
        }
    },

    async removeAuthBackground() {
        try {
            const { data, error } = await supabaseClient
                .from('homepage_settings')
                .update({ auth_background: null, updated_at: new Date().toISOString() })
                .eq('id', 1)
                .select();

            if (error) throw error;
            return { success: true, data };
        } catch (error) {
            console.error('Error removing auth background:', error);
            return { success: false, error: error.message };
        }
    },

    // Homepage Cards Management
    async saveCards(cardsData) {
        try {
            const { data, error } = await supabaseClient
                .from('homepage_cards')
                .upsert({
                    id: 1,
                    cards_data: cardsData,
                    updated_at: new Date().toISOString()
                })
                .select();

            if (error) throw error;
            return { success: true, data };
        } catch (error) {
            console.error('Error saving cards:', error);
            return { success: false, error: error.message };
        }
    },

    async getCards() {
        try {
            const { data, error } = await supabaseClient
                .from('homepage_cards')
                .select('cards_data')
                .eq('id', 1)
                .single();

            if (error && error.code !== 'PGRST116') throw error;
            return { success: true, data: data?.cards_data || null };
        } catch (error) {
            console.error('Error getting cards:', error);
            return { success: false, error: error.message };
        }
    },

    // Initialize tables (create if they don't exist)
    async initializeTables() {
        try {
            // Check if tables exist by trying to query them
            await supabaseClient.from('homepage_settings').select('id').limit(1);
            await supabaseClient.from('homepage_cards').select('id').limit(1);
            return { success: true };
        } catch (error) {
            console.log('Tables may need to be created in Supabase dashboard');
            console.log('Required tables: homepage_settings, homepage_cards');
            return { success: false, error: error.message };
        }
    }
};

// Initialize tables on load
if (typeof supabaseClient !== 'undefined') {
    HomepageDB.initializeTables();
}
