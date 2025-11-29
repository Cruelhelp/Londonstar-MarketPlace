// Authentication Handler
class AuthHandler {
    constructor() {
        this.supabase = window.supabaseClient;
    }

    async signUp(email, password, userData = {}) {
        try {
            const { data, error } = await this.supabase.auth.signUp({
                email: email,
                password: password,
                options: {
                    data: userData
                }
            });

            if (error) throw error;
            return { success: true, data };
        } catch (error) {
            return { success: false, error: error.message };
        }
    }

    async signIn(email, password) {
        try {
            const { data, error } = await this.supabase.auth.signInWithPassword({
                email: email,
                password: password
            });

            if (error) throw error;
            return { success: true, data };
        } catch (error) {
            return { success: false, error: error.message };
        }
    }

    async signOut() {
        try {
            // Sign out from Supabase
            const { error } = await this.supabase.auth.signOut();
            if (error) throw error;

            // Clear all session data
            if (window.sessionManager) {
                window.sessionManager.clearSession();
            }

            return { success: true };
        } catch (error) {
            return { success: false, error: error.message };
        }
    }

    async getCurrentUser() {
        try {
            const { data: { user }, error } = await this.supabase.auth.getUser();
            if (error) throw error;
            return user;
        } catch (error) {
            console.error('Error getting current user:', error);
            return null;
        }
    }

    async getUserRole(userId) {
        try {
            const { data, error } = await this.supabase
                .from('users')
                .select('role')
                .eq('id', userId)
                .single();

            if (error) throw error;
            return data?.role || 'buyer';
        } catch (error) {
            console.error('Error getting user role:', error);
            return 'buyer';
        }
    }

    async updateUserProfile(userId, profileData) {
        try {
            const { data, error } = await this.supabase
                .from('users')
                .upsert({
                    id: userId,
                    ...profileData,
                    updated_at: new Date().toISOString()
                });

            if (error) throw error;
            return { success: true, data };
        } catch (error) {
            return { success: false, error: error.message };
        }
    }

    async getUserProfile(userId) {
        try {
            const { data, error } = await this.supabase
                .from('users')
                .select('*')
                .eq('id', userId)
                .single();

            if (error) throw error;
            return { success: true, data };
        } catch (error) {
            console.error('Error getting user profile:', error);
            return { success: false, error: error.message };
        }
    }

    async uploadProfilePicture(file, userId) {
        try {
            const fileExt = file.name.split('.').pop();
            const fileName = `${userId}/avatar.${fileExt}`;

            // Delete old avatar if exists
            await this.supabase.storage
                .from('profile-pictures')
                .remove([fileName]);

            // Upload new avatar
            const { data, error } = await this.supabase.storage
                .from('profile-pictures')
                .upload(fileName, file, {
                    cacheControl: '3600',
                    upsert: true
                });

            if (error) throw error;

            // Get public URL
            const { data: { publicUrl } } = this.supabase.storage
                .from('profile-pictures')
                .getPublicUrl(fileName);

            // Update user profile with new avatar URL
            await this.updateUserProfile(userId, { avatar_url: publicUrl });

            return { success: true, url: publicUrl };
        } catch (error) {
            console.error('Error uploading profile picture:', error);
            return { success: false, error: error.message };
        }
    }

    async checkSession() {
        try {
            const { data: { session }, error } = await this.supabase.auth.getSession();
            if (error) throw error;
            return session;
        } catch (error) {
            console.error('Error checking session:', error);
            return null;
        }
    }
}

// Initialize auth handler
const authHandler = new AuthHandler();
window.authHandler = authHandler;
