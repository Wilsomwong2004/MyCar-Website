console.log('Script started');
const hamburgerMenu = document.getElementById('hamburger-menu');
const navLinks = document.getElementById('nav-links');
console.log('hamburgerMenu:', hamburgerMenu);
console.log('navLinks:', navLinks);

let currentPopup = null;
let removeTimeout = null;

document.addEventListener('DOMContentLoaded', function () {
    const popupContainer = document.getElementById('popup-container');
    const popupTitle = document.getElementById('popup-title');
    const popupBody = document.getElementById('popup-body');

    let currentCountry = 'Malaysia';
    let currentLanguage = 'English';
    let currentDistanceUnit = 'Kilometers';

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

    //mini profile
    const profilePic = document.getElementById('profile-pic');
    const profileDropdown = document.getElementById('profile-dropdown-miniprofile');
    const logout = document.querySelector('.logout-profile-miniprofile');

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

    // Event listener for the main logout button
    const mainLogoutButton = document.querySelector('.log-out-button');
    if (mainLogoutButton) {
        mainLogoutButton.addEventListener('click', showLogoutModal);
    }

    // Event listener for the logout option in the profile dropdown
    const dropdownLogoutButton = document.querySelector('.logout-profile-miniprofile');
    if (dropdownLogoutButton) {
        dropdownLogoutButton.addEventListener('click', function (e) {
            e.preventDefault();
            e.stopPropagation(); // Prevent the click from closing the dropdown
            showLogoutModal();
        });
    }

    if (profilePic && profileDropdown) {
        profilePic.addEventListener('click', function (e) {
            e.stopPropagation();
            profileDropdown.classList.toggle('show');
        });

        // Close the profile dropdown when clicking outside
        document.addEventListener('click', function (e) {
            if (!profileDropdown.contains(e.target) && !profilePic.contains(e.target)) {
                profileDropdown.classList.remove('show');
            }
        });
    }

    // Close the profile dropdown when clicking outside
    document.addEventListener('click', function (e) {
        const profileDropdown = document.getElementById('profile-dropdown-miniprofile');
        const profilePic = document.getElementById('profile-pic');
        if (!profileDropdown.contains(e.target) && !profilePic.contains(e.target)) {
            profileDropdown.classList.remove('show');
        }
    });

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

    // Settings_page.js function (map & others)
    // Change username and password
    document.getElementById('change-username-password').addEventListener('click', function (e) {
        e.preventDefault();
        showPopup('Change Username and Password', `
            <div class="input-group">
                <input type="text" id="new-username" placeholder="New Username">
                <input type="password" id="current-password" placeholder="Current Password">
                <input type="password" id="new-password" placeholder="New Password">
                <input type="password" id="confirm-password" placeholder="Confirm New Password">
            </div>
            <div class="button-group">
                <button id="submit-username-password" class="save-btn">Change</button>
                <button id="close-username-password" class="close-btn">Close</button>
            </div>
        `);
        document.getElementById('submit-username-password').addEventListener('click', changeUsernamePassword);
        document.getElementById('close-username-password').addEventListener('click', closePopup);
    });

    function changeUsernamePassword() {
        const newUsername = document.getElementById('new-username').value;
        const currentPassword = document.getElementById('current-password').value;
        const newPassword = document.getElementById('new-password').value;
        const confirmPassword = document.getElementById('confirm-password').value;

        if (currentPassword === '') {
            alert('Please enter your current password.');
            return;
        }

        if (newUsername !== '') {
            // Update username logic here
        }

        if (newPassword !== '') {
            if (newPassword !== confirmPassword) {
                alert('New passwords do not match.');
                return;
            }
            // Update password logic here
        }

        alert('Changes saved successfully');
        closePopup();
    }

    // Two Factor Authentication
    document.querySelectorAll('.toggle input[type="checkbox"]')[0].addEventListener('change', function () {
        const isEnabled = this.checked;
        showAnimatedPopup(`Two Factor Authentication is now ${isEnabled ? 'enabled' : 'disabled'}.`);
    });

    // Change profile photo
    document.querySelector('.change-photo').addEventListener('click', function (e) {
        e.preventDefault();
        showPopup('Change Profile Photo', `
        <div id="drop-area" class="drop-area">
            <p>Drag and drop your photo here or click to select a file</p>
            <input type="file" id="profile-photo-upload" accept="image/*" hidden>
        </div>
        <div id="crop-area" class="crop-area" hidden>
            <canvas id="crop-canvas"></canvas>
            <div class="crop-controls">
                <input type="range" id="zoom" min="1" max="3" step="0.1" value="1">
                <label for="zoom">Zoom</label>
            </div>
        </div>
        <div id="preview-area" class="preview-area" hidden>
            <canvas id="preview-canvas" width="220" height="300"></canvas>
        </div>
        <div class="button-group">
            <button id="crop-photo" class="crop-btn" hidden>Crop Photo</button>
            <button id="submit-photo" class="save-btn" hidden>Save Photo</button>
            <button id="close-photo" class="close-btn">Close</button>
        </div>
    `);

        const dropArea = document.getElementById('drop-area');
        const fileInput = document.getElementById('profile-photo-upload');
        const cropArea = document.getElementById('crop-area');
        const cropCanvas = document.getElementById('crop-canvas');
        const previewArea = document.getElementById('preview-area');
        const previewCanvas = document.getElementById('preview-canvas');
        const zoomInput = document.getElementById('zoom');
        const cropButton = document.getElementById('crop-photo');
        const submitButton = document.getElementById('submit-photo');

        let currentImage = null;
        let cropContext = cropCanvas.getContext('2d');
        let zoomLevel = 1;
        let offsetX = 0;
        let offsetY = 0;

        function setupDropArea(element) {
            ['dragenter', 'dragover', 'dragleave', 'drop'].forEach(eventName => {
                element.addEventListener(eventName, preventDefaults, false);
            });

            function preventDefaults(e) {
                e.preventDefault();
                e.stopPropagation();
            }

            ['dragenter', 'dragover'].forEach(eventName => {
                element.addEventListener(eventName, () => element.classList.add('highlight'), false);
            });

            ['dragleave', 'drop'].forEach(eventName => {
                element.addEventListener(eventName, () => element.classList.remove('highlight'), false);
            });

            element.addEventListener('drop', handleDrop, false);
            element.addEventListener('click', () => fileInput.click());
        }

        setupDropArea(dropArea);

        fileInput.addEventListener('change', e => handleFiles(e.target.files));

        function handleDrop(e) {
            const dt = e.dataTransfer;
            const files = dt.files;
            handleFiles(files);
        }

        function handleFiles(files) {
            if (files.length > 0) {
                const file = files[0];
                if (file.type.startsWith('image/')) {
                    loadImage(file);
                } else {
                    alert('Please select an image file.');
                }
            }
        }

        function loadImage(file) {
            const reader = new FileReader();
            reader.onload = function (e) {
                currentImage = new Image();
                currentImage.onload = function () {
                    showCropArea();
                }
                currentImage.src = e.target.result;
            }
            reader.readAsDataURL(file);
        }

        function showCropArea() {
            dropArea.hidden = true;
            cropArea.hidden = false;
            cropButton.hidden = false;
            setupCropCanvas();
            drawImageForCropping();
        }

        function setupCropCanvas() {
            const maxWidth = 400;
            const maxHeight = 400;
            const aspectRatio = currentImage.width / currentImage.height;

            let canvasWidth, canvasHeight;

            if (aspectRatio > 1) {
                canvasWidth = Math.min(currentImage.width, maxWidth);
                canvasHeight = canvasWidth / aspectRatio;
            } else {
                canvasHeight = Math.min(currentImage.height, maxHeight);
                canvasWidth = canvasHeight * aspectRatio;
            }

            cropCanvas.width = canvasWidth;
            cropCanvas.height = canvasHeight;
        }

        function drawImageForCropping() {
            const ctx = cropContext;
            const canvas = cropCanvas;
            const img = currentImage;

            ctx.clearRect(0, 0, canvas.width, canvas.height);

            const scale = Math.max(canvas.width / img.width, canvas.height / img.height) * zoomLevel;
            const scaledWidth = img.width * scale;
            const scaledHeight = img.height * scale;

            offsetX = Math.min(Math.max(offsetX, canvas.width - scaledWidth), 0);
            offsetY = Math.min(Math.max(offsetY, canvas.height - scaledHeight), 0);

            ctx.drawImage(img, offsetX, offsetY, scaledWidth, scaledHeight);

            // Draw circular mask
            ctx.globalCompositeOperation = 'destination-in';
            ctx.beginPath();
            ctx.arc(canvas.width / 2, canvas.height / 2, Math.min(canvas.width, canvas.height) / 2, 0, Math.PI * 2);
            ctx.fill();
            ctx.globalCompositeOperation = 'source-over';

            // Draw border
            ctx.strokeStyle = 'white';
            ctx.lineWidth = 2;
            ctx.beginPath();
            ctx.arc(canvas.width / 2, canvas.height / 2, Math.min(canvas.width, canvas.height) / 2, 0, Math.PI * 2);
            ctx.stroke();
        }

        zoomInput.addEventListener('input', function () {
            zoomLevel = parseFloat(this.value);
            drawImageForCropping();
        });

        let isDragging = false;
        let lastX, lastY;

        cropCanvas.addEventListener('mousedown', startDragging);
        cropCanvas.addEventListener('mousemove', drag);
        cropCanvas.addEventListener('mouseup', stopDragging);
        cropCanvas.addEventListener('mouseleave', stopDragging);

        function startDragging(e) {
            isDragging = true;
            lastX = e.clientX;
            lastY = e.clientY;
        }

        function drag(e) {
            if (isDragging) {
                const deltaX = e.clientX - lastX;
                const deltaY = e.clientY - lastY;
                offsetX += deltaX;
                offsetY += deltaY;
                lastX = e.clientX;
                lastY = e.clientY;
                drawImageForCropping();
            }
        }

        function stopDragging() {
            isDragging = false;
        }

        cropButton.addEventListener('click', function () {
            const ctx = previewCanvas.getContext('2d');
            ctx.clearRect(0, 0, previewCanvas.width, previewCanvas.height);
            ctx.drawImage(cropCanvas, 0, 0, cropCanvas.width, cropCanvas.height, 0, 0, previewCanvas.width, previewCanvas.height);

            cropArea.hidden = true;
            previewArea.hidden = false;
            cropButton.hidden = true;
            submitButton.hidden = false;
        });

        submitButton.addEventListener('click', function () {
            alert('Profile photo changed successfully');
            closePopup();
        });

        document.getElementById('close-photo').addEventListener('click', closePopup);
    });

    // Delete account
    document.querySelector('.delete-account').addEventListener('click', function (e) {
        e.preventDefault();
        showPopup('Delete Account?', `
            <div class="confirm-delete-message"></div>
                <p>Are you sure you want to delete your account? </p>
                <p class='confirm-delete-message'>This action cannot be undone.</p>
            </div>
            <div class="button-group-delete-account">
                <button id="confirm-delete" class="delete-btn">Yes, Delete My Account</button>
                <button id="cancel-delete" class="cancel-btn">Cancel</button>
            </div>
        `);
        document.getElementById('confirm-delete').addEventListener('click', function () {
            // Add account deletion logic here
            alert('Account deleted successfully');
            closePopup();
        });
        document.getElementById('cancel-delete').addEventListener('click', closePopup);
    });

    // Distance units
    document.getElementById('distance_units-select').addEventListener('click', function (e) {
        e.preventDefault();
        showPopup('Distance Units', `
            <select id="unit-select">
                <option value="km" ${currentDistanceUnit === 'Kilometers' ? 'selected' : ''}>Kilometers</option>
                <option value="mi" ${currentDistanceUnit === 'Miles' ? 'selected' : ''}>Miles</option>
            </select>
            <div class="button-group">
                <button id="submit-units" class="save-btn">Save</button>
                <button id="close-units" class="close-btn">Close</button>
            </div>
        `);
        document.getElementById('submit-units').addEventListener('click', function () {
            const selectedUnit = document.getElementById('unit-select');
            currentDistanceUnit = selectedUnit.options[selectedUnit.selectedIndex].text;
            document.querySelector('#distance_units-select .units-value').textContent = currentDistanceUnit;
            closePopup();
        });
        document.getElementById('close-units').addEventListener('click', closePopup);
    });

    // Dark mode
    document.querySelectorAll('.toggle input[type="checkbox"]')[1].addEventListener('change', function () {
        const isEnabled = this.checked;
        showAnimatedPopup(`Dark Mode is now ${isEnabled ? 'enabled' : 'disabled'}.`);
    });

    // Push notifications
    document.querySelectorAll('.toggle input[type="checkbox"]')[2].addEventListener('change', function () {
        const isEnabled = this.checked;
        showAnimatedPopup(`Push Notifications are now ${isEnabled ? 'enabled' : 'disabled'}.`);
    });

    // Language
    document.getElementById('language-select').addEventListener('click', function (e) {
        e.preventDefault();
        showPopup('Language', `
            <select id="language-select-dropdown">
                <option value="en" ${currentLanguage === 'English' ? 'selected' : ''}>English</option>
                <option value="ms" ${currentLanguage === 'Bahasa Melayu' ? 'selected' : ''}>Bahasa Melayu</option>
                <option value="zh_cn" ${currentLanguage === '简体中文' ? 'selected' : ''}>简体中文</option>
                <option value="zh_tw" ${currentLanguage === '繁體中文' ? 'selected' : ''}>繁體中文</option>
            </select>
            <div class="button-group">
                <button id="submit-language" class="save-btn">Save</button>
                <button id="close-language" class="close-btn">Close</button>
            </div>
        `);
        document.getElementById('submit-language').addEventListener('click', function () {
            const selectedLanguage = document.getElementById('language-select-dropdown');
            currentLanguage = selectedLanguage.options[selectedLanguage.selectedIndex].text;
            document.querySelector('#language-select .language-value').textContent = currentLanguage;
            closePopup();
        });
        document.getElementById('close-language').addEventListener('click', closePopup);
    });

    // Country
    document.getElementById('country-select').addEventListener('click', function (e) {
        e.preventDefault();
        showPopup('Country', `
            <input type="text" id="country-search" placeholder="Search for a country">
            <select id="country-select-dropdown" size="10">
                ${Object.entries(countryNames).map(([code, name]) =>
            `<option value="${code}" ${name === currentCountry ? 'selected' : ''}>${name}</option>`
        ).join('')}
            </select>
            <div class="button-group">
                <button id="submit-country" class="save-btn">Save</button>
                <button id="close-country" class="close-btn">Close</button>
            </div>
        `);

        const countrySearch = document.getElementById('country-search');
        const countryDropdown = document.getElementById('country-select-dropdown');

        countrySearch.addEventListener('input', function () {
            const searchTerm = this.value.toLowerCase();
            Array.from(countryDropdown.options).forEach(option => {
                const countryName = option.text.toLowerCase();
                option.style.display = countryName.includes(searchTerm) ? '' : 'none';
            });
        });

        document.getElementById('submit-country').addEventListener('click', function () {
            const selectedOption = countryDropdown.options[countryDropdown.selectedIndex];
            if (selectedOption) {
                currentCountry = selectedOption.text;
                document.querySelector('#country-select .country-value').textContent = currentCountry;
            }
            closePopup();
        });

        document.getElementById('close-country').addEventListener('click', closePopup);
    });

    const countryNames = {
        'AF': 'Afghanistan',
        'AL': 'Albania',
        'DZ': 'Algeria',
        'AS': 'American Samoa',
        'AD': 'Andorra',
        'AO': 'Angola',
        'AI': 'Anguilla',
        'AG': 'Antigua and Barbuda',
        'AR': 'Argentina',
        'AM': 'Armenia',
        'AW': 'Aruba',
        'AU': 'Australia',
        'AT': 'Austria',
        'AZ': 'Azerbaijan',
        'BS': 'Bahamas',
        'BH': 'Bahrain',
        'BD': 'Bangladesh',
        'BB': 'Barbados',
        'BY': 'Belarus',
        'BE': 'Belgium',
        'BZ': 'Belize',
        'BJ': 'Benin',
        'BM': 'Bermuda',
        'BT': 'Bhutan',
        'BO': 'Bolivia',
        'BA': 'Bosnia and Herzegovina',
        'BW': 'Botswana',
        'BR': 'Brazil',
        'BN': 'Brunei',
        'BG': 'Bulgaria',
        'BF': 'Burkina Faso',
        'BI': 'Burundi',
        'CV': 'Cabo Verde',
        'KH': 'Cambodia',
        'CM': 'Cameroon',
        'CA': 'Canada',
        'KY': 'Cayman Islands',
        'CF': 'Central African Republic',
        'TD': 'Chad',
        'CL': 'Chile',
        'CN': 'China',
        'CO': 'Colombia',
        'KM': 'Comoros',
        'CG': 'Congo',
        'CD': 'Congo, Democratic Republic of the',
        'CR': 'Costa Rica',
        'CI': "Côte d'Ivoire",
        'HR': 'Croatia',
        'CU': 'Cuba',
        'CY': 'Cyprus',
        'CZ': 'Czech Republic',
        'DK': 'Denmark',
        'DJ': 'Djibouti',
        'DM': 'Dominica',
        'DO': 'Dominican Republic',
        'EC': 'Ecuador',
        'EG': 'Egypt',
        'SV': 'El Salvador',
        'GQ': 'Equatorial Guinea',
        'ER': 'Eritrea',
        'EE': 'Estonia',
        'SZ': 'Eswatini',
        'ET': 'Ethiopia',
        'FJ': 'Fiji',
        'FI': 'Finland',
        'FR': 'France',
        'GA': 'Gabon',
        'GM': 'Gambia',
        'GE': 'Georgia',
        'DE': 'Germany',
        'GH': 'Ghana',
        'GR': 'Greece',
        'GD': 'Grenada',
        'GU': 'Guam',
        'GT': 'Guatemala',
        'GN': 'Guinea',
        'GW': 'Guinea-Bissau',
        'GY': 'Guyana',
        'HT': 'Haiti',
        'HN': 'Honduras',
        'HK': 'Hong Kong',
        'HU': 'Hungary',
        'IS': 'Iceland',
        'IN': 'India',
        'ID': 'Indonesia',
        'IR': 'Iran',
        'IQ': 'Iraq',
        'IE': 'Ireland',
        'IL': 'Israel',
        'IT': 'Italy',
        'JM': 'Jamaica',
        'JP': 'Japan',
        'JO': 'Jordan',
        'KZ': 'Kazakhstan',
        'KE': 'Kenya',
        'KI': 'Kiribati',
        'KP': 'Korea, North',
        'KR': 'Korea, South',
        'KW': 'Kuwait',
        'KG': 'Kyrgyzstan',
        'LA': 'Laos',
        'LV': 'Latvia',
        'LB': 'Lebanon',
        'LS': 'Lesotho',
        'LR': 'Liberia',
        'LY': 'Libya',
        'LI': 'Liechtenstein',
        'LT': 'Lithuania',
        'LU': 'Luxembourg',
        'MO': 'Macau',
        'MG': 'Madagascar',
        'MW': 'Malawi',
        'MY': 'Malaysia',
        'MV': 'Maldives',
        'ML': 'Mali',
        'MT': 'Malta',
        'MH': 'Marshall Islands',
        'MR': 'Mauritania',
        'MU': 'Mauritius',
        'MX': 'Mexico',
        'FM': 'Micronesia',
        'MD': 'Moldova',
        'MC': 'Monaco',
        'MN': 'Mongolia',
        'ME': 'Montenegro',
        'MA': 'Morocco',
        'MZ': 'Mozambique',
        'MM': 'Myanmar',
        'NA': 'Namibia',
        'NR': 'Nauru',
        'NP': 'Nepal',
        'NL': 'Netherlands',
        'NZ': 'New Zealand',
        'NI': 'Nicaragua',
        'NE': 'Niger',
        'NG': 'Nigeria',
        'NO': 'Norway',
        'OM': 'Oman',
        'PK': 'Pakistan',
        'PW': 'Palau',
        'PA': 'Panama',
        'PG': 'Papua New Guinea',
        'PY': 'Paraguay',
        'PE': 'Peru',
        'PH': 'Philippines',
        'PL': 'Poland',
        'PT': 'Portugal',
        'QA': 'Qatar',
        'RO': 'Romania',
        'RU': 'Russia',
        'RW': 'Rwanda',
        'KN': 'Saint Kitts and Nevis',
        'LC': 'Saint Lucia',
        'VC': 'Saint Vincent and the Grenadines',
        'WS': 'Samoa',
        'SM': 'San Marino',
        'ST': 'Sao Tome and Principe',
        'SA': 'Saudi Arabia',
        'SN': 'Senegal',
        'RS': 'Serbia',
        'SC': 'Seychelles',
        'SL': 'Sierra Leone',
        'SG': 'Singapore',
        'SK': 'Slovakia',
        'SI': 'Slovenia',
        'SB': 'Solomon Islands',
        'SO': 'Somalia',
        'ZA': 'South Africa',
        'SS': 'South Sudan',
        'ES': 'Spain',
        'LK': 'Sri Lanka',
        'SD': 'Sudan',
        'SR': 'Suriname',
        'SE': 'Sweden',
        'CH': 'Switzerland',
        'SY': 'Syria',
        'TW': 'Taiwan',
        'TJ': 'Tajikistan',
        'TZ': 'Tanzania',
        'TH': 'Thailand',
        'TL': 'Timor-Leste',
        'TG': 'Togo',
        'TO': 'Tonga',
        'TT': 'Trinidad and Tobago',
        'TN': 'Tunisia',
        'TR': 'Turkey',
        'TM': 'Turkmenistan',
        'TV': 'Tuvalu',
        'UG': 'Uganda',
        'UA': 'Ukraine',
        'AE': 'United Arab Emirates',
        'GB': 'United Kingdom',
        'US': 'United States',
        'UY': 'Uruguay',
        'UZ': 'Uzbekistan',
        'VU': 'Vanuatu',
        'VE': 'Venezuela',
        'VN': 'Vietnam',
        'YE': 'Yemen',
        'ZM': 'Zambia',
        'ZW': 'Zimbabwe'
    };

    // Log out
    document.querySelector('.log-out-button' && '.log-out-button-bottom').addEventListener('click', function () {
        showPopup('Log Out?', `
            <p>Are you sure you want to log out?</p>
            <div class="button-group-logout">
                <button id="confirm-logout" class="logout-btn">Yes, Log Out</button>
                <button id="cancel-logout" class="cancel-btn">Cancel</button>
            </div>
        `);
        document.getElementById('confirm-logout').addEventListener('click', function () {
            // small windows for logout animation
            /*const logoutWindow = document.createElement('div');
            logoutWindow.classList.add('logout-window');
            document.body.appendChild(logoutWindow);
            setTimeout(function () {
                logoutWindow.classList.add('show');
            }, 100);
            setTimeout(function () {
                logoutWindow.classList.remove('show');
                setTimeout(function () {
                    logoutWindow.remove();
                }, 500);
            }, 2000);
            */

            closePopup();
            //user cant go back by pressing back button after logout forever
            //so we redirect to login page
            window.location.href = 'logout.php';
        });
        document.getElementById('cancel-logout').addEventListener('click', closePopup);
    });
});