let currentPopup = null;
let removeTimeout = null;

document.addEventListener('DOMContentLoaded', function () {
    // Hamburger menu functionality
    const hamburgerMenu = document.getElementById('hamburger-menu');
    const navLinks = document.getElementById('nav-links');
    const searchContainer = document.querySelector('.search-container');

    function toggleMenuVisibility(show) {
        hamburgerMenu.classList.toggle('active', show);
        navLinks.classList.toggle('show', show);
        document.body.classList.toggle('menu-open', show);

        // Use setTimeout to ensure CSS transitions are applied
        setTimeout(() => {
            searchContainer.style.display = show ? 'none' : '';
            filterButtons.style.display = show ? 'none' : '';
        }, show ? 0 : 600); // Delay hiding elements when closing menu
    }

    hamburgerMenu.addEventListener('click', function () {
        toggleMenuVisibility(!navLinks.classList.contains('show'));
    });

    // Close menu when a link is clicked (except for dark mode toggle)
    navLinks.querySelectorAll('a:not(.dark-mode-toggle)').forEach(link => {
        link.addEventListener('click', () => {
            toggleMenuVisibility(false);
        });
    });

    // Close menu when clicking outside
    document.addEventListener('click', function (event) {
        const isClickInsideMenu = navLinks.contains(event.target);
        const isClickOnHamburger = hamburgerMenu.contains(event.target);

        if (!isClickInsideMenu && !isClickOnHamburger && navLinks.classList.contains('show')) {
            toggleMenuVisibility(false);
        }
    });

    //mini profile
    const profilePic = document.getElementById('profile-pic');
    const profileDropdown = document.getElementById('profile-dropdown');
    const logout = document.querySelector('.logout-profile');
    const popupContainer = document.getElementById('popup-container');
    const popupTitle = document.getElementById('popup-title');
    const popupBody = document.getElementById('popup-body');

    console.log('profilePic:', profilePic);
    console.log('profileDropdown:', profileDropdown);

    function showPopup(title, content) {
        popupTitle.textContent = title;
        popupBody.innerHTML = content;
        popupContainer.style.display = 'flex';
    }

    function closePopup() {
        popupContainer.style.display = 'none';
    }

    function showAnimatedPopup(message) {
        // If there's an existing popup, remove it immediately
        if (currentPopup) {
            document.body.removeChild(currentPopup);
            clearTimeout(removeTimeout);
        }

        const animatedPopup = document.createElement('div');
        animatedPopup.className = 'animated-popup';
        animatedPopup.textContent = message;

        document.body.appendChild(animatedPopup);
        currentPopup = animatedPopup;

        // Trigger the animation
        requestAnimationFrame(() => {
            animatedPopup.style.top = '20px';
            animatedPopup.style.opacity = '1';
        });

        // Remove the popup after 3 seconds
        removeTimeout = setTimeout(() => {
            animatedPopup.style.top = '-100px';
            animatedPopup.style.opacity = '0';
            setTimeout(() => {
                if (document.body.contains(animatedPopup)) {
                    document.body.removeChild(animatedPopup);
                }
                if (currentPopup === animatedPopup) {
                    currentPopup = null;
                }
            }, 300); // Wait for the animation to finish before removing
        }, 3000);
    }

    // Function to show logout confirmation modal
    function showLogoutModal() {
        const modal = document.createElement('div');
        modal.className = 'logout-modal';
        modal.innerHTML = `
            <div class="logout-modal-content">
                <h2>Logout?</h2>
                <p>Are you sure you want to log out?</p>
                <button id="confirm-logout">Yes, Logout</button>
                <button id="cancel-logout">Cancel</button>
            </div>
        `;
        document.body.appendChild(modal);

        document.getElementById('confirm-logout').addEventListener('click', function () {
            // Perform logout action here
            console.log('Logging out...');
            // Redirect to login page or perform other logout actions
            window.location.href = 'index.php';
        });

        document.getElementById('cancel-logout').addEventListener('click', function () {
            document.body.removeChild(modal);
        });
    }

    if (profilePic && profileDropdown) {
        console.log('Both profilePic and profileDropdown found');
        profilePic.addEventListener('click', function (e) {
            console.log('Profile pic clicked');
            e.stopPropagation();
            profileDropdown.classList.toggle('show');
            console.log('Dropdown classes after toggle:', profileDropdown.className);
        });

        document.addEventListener('click', function (e) {
            if (!profileDropdown.contains(e.target) && !profilePic.contains(e.target)) {
                profileDropdown.classList.remove('show');
                console.log('Dropdown closed');
            }
        });
    } else {
        console.error('profilePic or profileDropdown not found in the DOM');
        if (!profilePic) console.error('profilePic is missing');
        if (!profileDropdown) console.error('profileDropdown is missing');
    }

    // Dark mode functionality
    const darkModeToggle = document.querySelector('input[name="dark-mode-toggle"]');
    if (darkModeToggle) {
        // Set initial state based on localStorage
        const isDarkMode = localStorage.getItem('darkMode') === 'true';
        darkModeToggle.checked = isDarkMode;
        document.documentElement.classList.toggle('dark-mode', isDarkMode);

        darkModeToggle.addEventListener('change', function () {
            const isDarkModeEnabled = this.checked;
            document.documentElement.classList.toggle('dark-mode', isDarkModeEnabled);
            localStorage.setItem('darkMode', isDarkModeEnabled);

            // Show notification
            const message = isDarkModeEnabled ? "Dark mode is now enabled" : "Dark mode is now disabled";
            showAnimatedPopup(message);

            // Sync dark mode across open tabs
            localStorage.setItem('darkModeTimestamp', Date.now().toString());
        });
    }

    // Logout functionality
    if (logout) {
        logout.addEventListener('click', function (e) {
            e.preventDefault();
            // Show logout confirmation modal
            showLogoutModal();
        });
    }

    // Listen for dark mode changes in other tabs
    window.addEventListener('storage', function (e) {
        if (e.key === 'darkModeTimestamp') {
            const isDarkMode = localStorage.getItem('darkMode') === 'true';
            document.documentElement.classList.toggle('dark-mode', isDarkMode);
            if (darkModeToggle) {
                darkModeToggle.checked = isDarkMode;
            }
        }
    });

    window.addEventListener.call(window, 'beforeunload', function (e) {
        // Remove any existing popup when the user navigates away
        if (currentPopup) {
            document.body.removeChild(currentPopup);
        }
    });

    document.getElementById('done-booking-btn').addEventListener('click', function () {
        window.location.href = 'main_page.php';
        window.history.pushState({}, '', 'main_page.php');
    });
});