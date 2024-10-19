let currentPopup = null;
let removeTimeout = null;
let isDetailsOpen = false;

// Hamburger menu functionality
const hamburgerMenu = document.getElementById('hamburger-menu');
const navLinks = document.getElementById('nav-links');

function toggleMenuVisibility(show) {
    hamburgerMenu.classList.toggle('active', show);
    navLinks.classList.toggle('show', show);
    document.body.classList.toggle('menu-open', show);
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
        // Redirect to logout.php
        window.location.href = 'logout.php';
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

document.addEventListener('DOMContentLoaded', function () {
    const historyItems = document.querySelectorAll('.history-item');
    const details = document.querySelector('.details');
    const backButton = document.querySelector('.back-button');
    const detailsContent = document.querySelector('.details-content');

    const searchbar = document.querySelector('.search-bar');
    const trip_time = document.querySelector('.trip-time');
    const trip_time_second = document.querySelector('.trip-time-second');

    const detailsData = {
        "135743": {
            driverName: "James Kharlie",
            carModel: "Honda City (WAF2304)",
            bookingDate: "03 March 2024",
            bookingTime: "6:31 p.m.",
            closeOrderTime: "7:15 p.m.",
            route: "APU → Pavilion Bukit Jalil",
            fees: {
                bookingCarFees: "RM 18.50",
                serviceFees: "RM 2.50",
                sst: "RM 1.28",
                total: "RM 21.28"
            }
        },
        "135742": {
            driverName: "Sarah Lee",
            carModel: "Toyota Vios (WBC5678)",
            bookingDate: "02 March 2024",
            bookingTime: "4:29 p.m.",
            closeOrderTime: "5:15 p.m.",
            route: "KLIA → Pavilion Bukit Jalil",
            fees: {
                bookingCarFees: "RM 22.00",
                serviceFees: "RM 3.00",
                sst: "RM 1.50",
                total: "RM 26.50"
            }
        }
    };

    function showDetails(orderId) {
        const orderDetails = detailsData[orderId];
        if (orderDetails) {
            detailsContent.innerHTML = `
                <h3>Order ID #${orderId}</h3>
                <h4>Driver Details</h4>
                <p>${orderDetails.driverName}</p>
                <p>${orderDetails.carModel}</p>
                <h4>Booking Details</h4>
                <p>Booking Date: ${orderDetails.bookingDate}</p>
                <p>Booking Time: ${orderDetails.bookingTime}</p>
                <p>Close Order Time: ${orderDetails.closeOrderTime}</p>
                <p>Route: ${orderDetails.route}</p>
                <h4>Receipt</h4>
                <p>Booking Car Fees: ${orderDetails.fees.bookingCarFees}</p>
                <p>Service Fees: ${orderDetails.fees.serviceFees}</p>
                <p>SST (6%): ${orderDetails.fees.sst}</p>
                <p><strong>Total: ${orderDetails.fees.total}</strong></p>
            `;
            details.classList.add('show');
        }
    }


    function adjustLayout() {
        if (window.innerWidth > 1242) {
            backButton.style.display = 'block';
            searchbar.style.width = '97%';
            if (isDetailsOpen) {
                details.style.position = 'static';
                searchbar.style.width = '97%';
                trip_time.style.marginRight = '30px';
                trip_time_second.style.marginRight = '30px';
            } else {
                details.style.position = 'fixed';
                trip_time.style.marginRight = '30px'; // Adjust margin when closed
                trip_time_second.style.marginRight = '30px';
            }
        } else if (window.innerWidth > 768 && window.innerWidth <= 1242) {
            backButton.style.display = 'block';
            if (isDetailsOpen) {
                details.style.position = 'fixed';
                searchbar.style.width = '63%';
                trip_time.style.marginRight = '35%';
                trip_time_second.style.marginRight = '35%';
            } else {
                searchbar.style.width = '94%';
                trip_time.style.marginRight = '30px';
                trip_time_second.style.marginRight = '30px';
            }
        } else if (window.innerWidth < 768) {
            details.style.position = 'fixed';
            searchbar.style.width = '97%';
            trip_time.style.marginRight = '10px';
            trip_time_second.style.marginRight = '10px';
        }
    }

    historyItems.forEach(item => {
        item.addEventListener('click', function () {
            const orderId = this.dataset.orderId;
            isDetailsOpen = true;

            adjustLayout(); // Adjust layout when details are open
            showDetails(orderId); // Show details
        });
    });


    backButton.addEventListener('click', function () {
        details.classList.remove('show');
        isDetailsOpen = false;
        adjustLayout();

    });

    window.addEventListener('resize', adjustLayout);

    // Search functionality
    searchbar.addEventListener('input', function () {
        const searchTerm = this.value.toLowerCase();
        historyItems.forEach(item => {
            const orderId = item.dataset.orderId;
            const itemData = detailsData[orderId];
            const searchableText = `
                ${itemData.driverName.toLowerCase()}
                ${itemData.carModel.toLowerCase()}
                ${itemData.bookingDate.toLowerCase()}
                ${itemData.bookingTime.toLowerCase()}
                ${itemData.route.toLowerCase()}
            `;

            if (searchableText.includes(searchTerm)) {
                item.style.display = '';
            } else {
                item.style.display = 'none';
            }
        });
    });
});