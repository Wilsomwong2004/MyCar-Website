let currentPopup = null;
let removeTimeout = null;

document.addEventListener('DOMContentLoaded', function () {
    console.log('DOM fully loaded and parsed');

    // Hamburger menu functionality
    const hamburgerMenu = document.getElementById('hamburger-menu');
    const navLinks = document.getElementById('nav-links');

    console.log('hamburgerMenu:', hamburgerMenu);
    console.log('navLinks:', navLinks);

    function toggleMenuVisibility(show) {
        console.log('toggleMenuVisibility called with:', show);
        console.log('hamburgerMenu:', hamburgerMenu);
        console.log('navLinks:', navLinks);

        if (hamburgerMenu && navLinks) {
            console.log('Both elements found, toggling classes');
            hamburgerMenu.classList.toggle('active', show);
            navLinks.classList.toggle('show', show);
            document.body.classList.toggle('menu-open', show);
            console.log('hamburgerMenu classes:', hamburgerMenu.classList);
            console.log('navLinks classes:', navLinks.classList);
            console.log('body classes:', document.body.classList);
        } else {
            console.log('One or both elements are null');
            if (!hamburgerMenu) console.log('hamburgerMenu is null');
            if (!navLinks) console.log('navLinks is null');
        }
    }

    if (hamburgerMenu) {
        console.log('Adding click event listener to hamburgerMenu');
        hamburgerMenu.addEventListener('click', function (event) {
            console.log('Hamburger menu clicked');
            event.stopPropagation(); // Prevent the click from propagating to the document
            toggleMenuVisibility(!navLinks?.classList.contains('show'));
        });
    } else {
        console.log('hamburgerMenu not found');
    }

    if (navLinks) {
        console.log('Adding click event listeners to navLinks');
        // Close menu when a link is clicked (except for dark mode toggle)
        navLinks.querySelectorAll('a:not(.dark-mode-toggle)').forEach(link => {
            link.addEventListener('click', () => {
                console.log('Nav link clicked');
                toggleMenuVisibility(false);
            });
        });
    } else {
        console.log('navLinks not found');
    }

    // Close menu when clicking outside
    document.addEventListener('click', function (event) {
        console.log('Document clicked');
        if (navLinks && navLinks.classList.contains('show') && !navLinks.contains(event.target) && event.target !== hamburgerMenu) {
            console.log('Clicking outside, closing menu');
            toggleMenuVisibility(false);
        }
    });

    // Close menu when clicking outside
    document.addEventListener('click', function (event) {
        console.log('Document clicked');
        if (hamburgerMenu && navLinks) {
            const isClickInsideMenu = navLinks.contains(event.target);
            const isClickOnHamburger = hamburgerMenu.contains(event.target);

            if (!isClickInsideMenu && !isClickOnHamburger && navLinks.classList.contains('show')) {
                console.log('Closing menu');
                toggleMenuVisibility(false);
            }
        }
    });

    //mini-profile
    const profilePic = document.getElementById('profile-pic');
    const profileDropdown = document.getElementById('profile-dropdown');
    const logout = document.querySelector('.logout-profile');
    const popupContainer = document.getElementById('popup-container');
    const popupTitle = document.getElementById('popup-title');
    const popupBody = document.getElementById('popup-body');
    const topUpButton = document.querySelector('.top-up');
    const transferButton = document.querySelector('.transfer');

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

    // Top Up button functionality
    if (topUpButton) {
        topUpButton.addEventListener('click', function () {
            showPopup('Top Up', `
                <div id="top-up-form">
                    <div class= "top-up-container">
                        <div class= "top-up-input">
                            <div class="amount">Amount</div>
                            <input type="number" id="amount" name="amount" placeholder="Enter amount here" required>
                        </div>
                        <button class="top-up-submit-btn" type="submit">Confirm Top Up</button>
                    </div>
                </div>
            `);

            document.getElementById('top-up-form').addEventListener('submit', function (e) {
                e.preventDefault();
                const amount = document.getElementById('amount').value;
                // Here you would typically send this data to your server
                console.log('Top up amount:', amount);
                closePopup();
                showAnimatedPopup(`Successfully topped up $${amount}`);
            });
        });
    }

    // Transfer button functionality
    if (transferButton) {
        transferButton.addEventListener('click', function () {
            showPopup('Transfer', `
                <form id="transfer-form">
                    <label for="recipient">Recipient</label>
                    <input type="text" id="recipient" name="recipient" placeholder="Enter recipient here" required>
                    <label for="transfer-amount">Amount</label>
                    <input type="number" id="transfer-amount" name="transfer-amount" placeholder="Enter amount here" required>
                    <button class='transfer-submit-btn' type="submit">Confirm Transfer</button>
                </form>
            `);

            document.getElementById('transfer-form').addEventListener('submit', function (e) {
                e.preventDefault();
                const recipient = document.getElementById('recipient').value;
                const amount = document.getElementById('transfer-amount').value;
                // Here you would typically send this data to your server
                console.log('Transfer to:', recipient, 'Amount:', amount);
                closePopup();
                showAnimatedPopup(`Successfully transferred $${amount} to ${recipient}`);
            });
        });
    }

    // Close popup when clicking outside
    popupContainer.addEventListener('click', function (e) {
        if (e.target === popupContainer) {
            closePopup();
        }
    });
});

/*
    // Fetch transaction data from SQL database and populate the table
    fetch('/api/transactions')
        .then(response => response.json())
        .then(data => {
            const transactionTableBody = document.getElementById('transaction-table-body');
 
            data.forEach(transaction => {
                const row = document.createElement('tr');
 
                const orderIdCell = document.createElement('td');
                orderIdCell.textContent = transaction.orderId;
                row.appendChild(orderIdCell);
 
                const dateCell = document.createElement('td');
                dateCell.textContent = transaction.date;
                row.appendChild(dateCell);
 
                const amountCell = document.createElement('td');
                amountCell.textContent = transaction.amount;
                row.appendChild(amountCell);
 
                const statusCell = document.createElement('td');
                const statusSpan = document.createElement('span');
                statusSpan.textContent = transaction.status;
                statusSpan.classList.add('status', `status-${transaction.status.toLowerCase()}`);
                statusCell.appendChild(statusSpan);
                row.appendChild(statusCell);
 
                transactionTableBody.appendChild(row);
            });
        })
        .catch(error => {
            console.error('Error fetching transaction data:', error);
        });
 
    // Handle the "Top Up" button click
    const topUpButton = document.querySelector('.top-up');
    topUpButton.addEventListener('click', () => {
        // Implement the top-up functionality
        console.log('Top Up button clicked');
    });
 
    // Handle the "Transfer" button click
    const transferButton = document.querySelector('.transfer');
    transferButton.addEventListener('click', () => {
        // Implement the transfer functionality
        console.log('Transfer button clicked');
    });
 
    // Handle filter buttons
    const filterButtons = document.querySelectorAll('.filter-button');
    filterButtons.forEach(button => {
        button.addEventListener('click', () => {
            filterButtons.forEach(btn => btn.classList.remove('active'));
            button.classList.add('active');
            // Implement filtering logic here
        });
    });
 
    // Handle pagination
    const perPageSelect = document.querySelector('.per-page-select');
    const prevPageButton = document.querySelector('.prev-page');
    const nextPageButton = document.querySelector('.next-page');
 
    perPageSelect.addEventListener('change', () => {
        // Implement per page change logic
    });
 
    prevPageButton.addEventListener('click', () => {
        // Implement previous page logic
    });
 
    nextPageButton.addEventListener('click', () => {
        // Implement next page logic
    });
*/