// payment_setup_handler.js

class PaymentSetupHandler {
    constructor() {
        this.setupSource = sessionStorage.getItem('setupSource') || 'unknown';
        this.newUserId = sessionStorage.getItem('newUserId') || null;
    }

    // Set the source of payment setup (signup or settings)
    setSource(source, userId = null) {
        this.setupSource = source;
        this.newUserId = userId;
        sessionStorage.setItem('setupSource', source);
        if (userId) {
            sessionStorage.setItem('newUserId', userId);
        }
    }

    // Clear the setup source
    clearSource() {
        sessionStorage.removeItem('setupSource');
        sessionStorage.removeItem('newUserId');
        this.setupSource = 'unknown';
        this.newUserId = null;
    }

    // Handle the payment setup navigation
    handleSetupNavigation() {
        if (this.setupSource === 'signup' && this.newUserId) {
            // For new signup, pass the new user ID
            window.location.href = `add_card_page.php?source=signup&userId=${this.newUserId}`;
        } else if (this.setupSource === 'settings') {
            // For existing users, use current session
            window.location.href = 'add_card_page.php?source=settings';
        } else {
            // Fallback to settings source if unknown
            window.location.href = 'add_card_page.php?source=settings';
        }
    }
}

// Create global instance
window.paymentSetupHandler = new PaymentSetupHandler();