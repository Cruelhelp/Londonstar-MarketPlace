// Session Manager - Handles authentication state and prevents back button glitches
class SessionManager {
    constructor() {
        this.SESSION_KEY = 'london_marketplace_session';
        this.USER_KEY = 'london_marketplace_user';
        this.ROLE_KEY = 'london_marketplace_role';
    }

    // Create a new session
    createSession(user, role) {
        const session = {
            userId: user.id,
            email: user.email,
            role: role,
            timestamp: Date.now(),
            sessionId: this.generateSessionId()
        };

        sessionStorage.setItem(this.SESSION_KEY, JSON.stringify(session));
        sessionStorage.setItem(this.USER_KEY, JSON.stringify(user));
        sessionStorage.setItem(this.ROLE_KEY, role);

        // Also set in localStorage as backup
        localStorage.setItem(this.SESSION_KEY, JSON.stringify(session));
        localStorage.setItem('userId', user.id);
        localStorage.setItem('userEmail', user.email);
        localStorage.setItem('userRole', role);

        return session;
    }

    // Generate unique session ID
    generateSessionId() {
        return Date.now().toString(36) + Math.random().toString(36).substr(2);
    }

    // Get current session
    getSession() {
        try {
            const sessionData = sessionStorage.getItem(this.SESSION_KEY);
            if (sessionData) {
                return JSON.parse(sessionData);
            }

            // Fallback to localStorage
            const localSessionData = localStorage.getItem(this.SESSION_KEY);
            if (localSessionData) {
                const session = JSON.parse(localSessionData);
                // Restore to sessionStorage
                sessionStorage.setItem(this.SESSION_KEY, localSessionData);
                return session;
            }

            return null;
        } catch (error) {
            console.error('Error getting session:', error);
            return null;
        }
    }

    // Get current user
    getCurrentUser() {
        try {
            const userData = sessionStorage.getItem(this.USER_KEY);
            if (userData) {
                return JSON.parse(userData);
            }
            return null;
        } catch (error) {
            console.error('Error getting user:', error);
            return null;
        }
    }

    // Get user role
    getUserRole() {
        return sessionStorage.getItem(this.ROLE_KEY) || localStorage.getItem('userRole');
    }

    // Get user ID
    getUserId() {
        const session = this.getSession();
        return session?.userId || localStorage.getItem('userId');
    }

    // Check if user is authenticated
    isAuthenticated() {
        const session = this.getSession();
        return session !== null && session.userId !== null;
    }

    // Validate session and redirect if not authenticated
    requireAuth(redirectUrl = 'index.html') {
        if (!this.isAuthenticated()) {
            window.location.href = redirectUrl;
            return false;
        }
        return true;
    }

    // Require specific role
    requireRole(requiredRole, redirectUrl = 'index.html') {
        if (!this.isAuthenticated()) {
            window.location.href = redirectUrl;
            return false;
        }

        const userRole = this.getUserRole();
        if (userRole !== requiredRole) {
            window.location.href = redirectUrl;
            return false;
        }

        return true;
    }

    // Clear session completely (prevents back button glitch)
    clearSession() {
        // Clear sessionStorage
        sessionStorage.removeItem(this.SESSION_KEY);
        sessionStorage.removeItem(this.USER_KEY);
        sessionStorage.removeItem(this.ROLE_KEY);
        sessionStorage.clear();

        // Clear localStorage auth data
        localStorage.removeItem(this.SESSION_KEY);
        localStorage.removeItem('userId');
        localStorage.removeItem('userEmail');
        localStorage.removeItem('userRole');
        localStorage.removeItem('isAdmin');

        // Add a flag to prevent going back
        sessionStorage.setItem('logged_out', 'true');
    }

    // Check if user just logged out (prevents back button)
    checkLoggedOut() {
        if (sessionStorage.getItem('logged_out') === 'true') {
            sessionStorage.removeItem('logged_out');
            window.location.replace('index.html');
            return true;
        }
        return false;
    }

    // Update session timestamp (keep session alive)
    updateSessionTimestamp() {
        const session = this.getSession();
        if (session) {
            session.timestamp = Date.now();
            sessionStorage.setItem(this.SESSION_KEY, JSON.stringify(session));
            localStorage.setItem(this.SESSION_KEY, JSON.stringify(session));
        }
    }

    // Check session validity (optional: implement timeout)
    isSessionValid(maxAgeMinutes = 480) { // 8 hours default
        const session = this.getSession();
        if (!session) return false;

        const now = Date.now();
        const sessionAge = now - session.timestamp;
        const maxAge = maxAgeMinutes * 60 * 1000;

        if (sessionAge > maxAge) {
            this.clearSession();
            return false;
        }

        return true;
    }
}

// Initialize session manager
const sessionManager = new SessionManager();
window.sessionManager = sessionManager;

// Prevent back button after logout
window.addEventListener('pageshow', function(event) {
    if (event.persisted || (window.performance && window.performance.navigation.type === 2)) {
        // Page was loaded from cache (back button)
        if (sessionManager.checkLoggedOut()) {
            return;
        }
    }
});

// Update session timestamp on user activity
let activityTimeout;
function updateActivity() {
    clearTimeout(activityTimeout);
    activityTimeout = setTimeout(() => {
        if (sessionManager.isAuthenticated()) {
            sessionManager.updateSessionTimestamp();
        }
    }, 1000);
}

document.addEventListener('mousemove', updateActivity);
document.addEventListener('keypress', updateActivity);
document.addEventListener('click', updateActivity);
