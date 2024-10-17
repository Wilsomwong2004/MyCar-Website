(function () {
    console.log('Darkmode script loaded');

    function setDarkMode(isDark) {
        console.log('Setting dark mode:', isDark);
        document.documentElement.classList.toggle('dark-mode', isDark);
        localStorage.setItem('darkMode', isDark ? 'dark' : 'light');

        // Update all toggles on the page
        const darkModeToggles = document.querySelectorAll('input[type="checkbox"][name="dark-mode-toggle"]');
        darkModeToggles.forEach(toggle => {
            toggle.checked = isDark;
        });

        // Dispatch a custom event for other scripts that might need to react to the change
        window.dispatchEvent(new CustomEvent('darkModeChange', { detail: { isDark } }));
    }

    function applyDarkMode() {
        const darkMode = localStorage.getItem('darkMode');
        console.log('Applying dark mode state:', darkMode);
        setDarkMode(darkMode === 'dark');
    }

    // Apply dark mode immediately on script load
    applyDarkMode();

    function setupToggle(toggle) {
        toggle.checked = localStorage.getItem('darkMode') === 'dark';
        toggle.addEventListener('change', () => {
            console.log('Dark mode toggle changed. New state:', toggle.checked);
            setDarkMode(toggle.checked);
        });
    }

    function initDarkMode() {
        console.log('Initializing dark mode');
        const darkModeToggles = document.querySelectorAll('input[type="checkbox"][name="dark-mode-toggle"]');
        darkModeToggles.forEach(setupToggle);
        applyDarkMode();
    }

    // Set up MutationObserver to watch for dynamically added toggles
    const observer = new MutationObserver((mutationsList) => {
        for (let mutation of mutationsList) {
            if (mutation.type === 'childList') {
                mutation.addedNodes.forEach(node => {
                    if (node.nodeType === 1 && node.matches('input[type="checkbox"][name="dark-mode-toggle"]')) {
                        setupToggle(node);
                    }
                });
            }
        }
    });
    observer.observe(document.body, { childList: true, subtree: true });

    // Initialize dark mode on DOM content loaded
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', initDarkMode);
    } else {
        initDarkMode();
    }

    // Listen for dark mode changes in other tabs
    window.addEventListener('storage', function (e) {
        if (e.key === 'darkMode') {
            console.log('Dark mode changed in another tab');
            applyDarkMode();
        }
    });

    // Reapply dark mode on page show (when navigating back to the page)
    window.addEventListener('pageshow', function (e) {
        console.log('Page show event fired');
        applyDarkMode();
    });

    // Reapply dark mode on visibility change (when tab becomes visible)
    document.addEventListener('visibilitychange', function () {
        if (!document.hidden) {
            console.log('Page became visible');
            applyDarkMode();
        }
    });

    // Apply dark mode immediately when the script runs
    applyDarkMode();

    // Expose a method to get the current dark mode state
    window.isDarkMode = function () {
        return localStorage.getItem('darkMode') === 'dark';
    };

    // Expose a method to toggle dark mode programmatically
    window.toggleDarkMode = function () {
        setDarkMode(!isDarkMode());
    };

    // Reapply dark mode on popstate event (when navigating through browser history)
    window.addEventListener('popstate', function () {
        console.log('Popstate event fired');
        applyDarkMode();
    });
})();