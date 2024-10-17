let currentPopup = null;
let removeTimeout = null;
let fromColor = 'blue';
let toColor = 'red';

// Hamburger menu functionality
const hamburgerMenu = document.getElementById('hamburger-menu');
const navLinks = document.getElementById('nav-links');

function toggleMenuVisibility(show) {
    hamburgerMenu.classList.toggle('active', show);
    navLinks.classList.toggle('show', show);
    document.body.classList.toggle('menu-open', show);
}

function adjustGradients() {
    const menuHeight = navLinks.offsetHeight;
    const navbar = document.querySelector('.navbar');
    const mapGradient = document.querySelector('.map-gradient');

    if (document.body.classList.contains('menu-open')) {
        navbar.style.setProperty('--gradient-offset', `${menuHeight}px`);
        mapGradient.style.bottom = `calc(300px + ${menuHeight}px)`;
    } else {
        navbar.style.removeProperty('--gradient-offset');
        mapGradient.style.bottom = '300px';
    }
}

function toggleMenuVisibility(show) {
    hamburgerMenu.classList.toggle('active', show);
    navLinks.classList.toggle('show', show);
    document.body.classList.toggle('menu-open', show);
    adjustGradients();
}

// Call this on window resize as well
window.addEventListener('resize', adjustGradients);

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

// booking page javascript
let tileLayer;

function setTileLayer(isDarkMode) {
    if (tileLayer) {
        map.removeLayer(tileLayer);
    }

    const tileUrl = isDarkMode
        ? 'https://tiles.stadiamaps.com/tiles/alidade_smooth_dark/{z}/{x}/{y}{r}.png'
        : 'https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png';

    const attribution = isDarkMode
        ? '&copy; <a href="https://stadiamaps.com/">Stadia Maps</a>, &copy; <a href="https://openmaptiles.org/">OpenMapTiles</a> &copy; <a href="http://openstreetmap.org">OpenStreetMap</a> contributors'
        : '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors';

    tileLayer = L.tileLayer(tileUrl, { attribution: attribution }).addTo(map);
}

// Initialize the map with the default (light) theme
const map = L.map('map').setView([3.0556, 101.6889], 13);
setTileLayer(false);

// Add event listener for dark mode toggle
if (darkModeToggle) {
    darkModeToggle.addEventListener('change', function () {
        const isDarkModeEnabled = this.checked;
        setTileLayer(isDarkModeEnabled);
    });
}

const carTypes = [
    { name: 'Economy', eta: '12min', price: 'RM 16.00', seats: 4 },
    { name: 'Premium', eta: '16min', price: 'RM 20.00', seats: 6 },
    { name: 'VIP 5-seater', eta: '20min', price: 'RM 26.00', seats: 5 },
    { name: 'VIP 6-seater', eta: '20min', price: 'RM 30.00', seats: 6 },
];

// Populate car options
const carOptionsContainer = document.getElementById('car-options');
carTypes.forEach(car => {
    const carOption = document.createElement('div');
    carOption.className = 'car-option';
    carOption.innerHTML = `
        <div class="car-icon ${car.name.toLowerCase().replace(' ', '-')}"></div>
        <div class="car-details-info">
            <h3>${car.name}</h3>
            <p>ETA: ${car.eta}</p>
            <p>${car.price}</p>
        </div>
    `;
    carOptionsContainer.appendChild(carOption);
});

const carOptions = document.querySelectorAll('.car-option');
carOptions.forEach(option => {
    option.addEventListener('click', () => {
        carOptions.forEach(opt => opt.classList.remove('selected'));
        option.classList.add('selected');
    });
});

// fix mouse cant scrolling right
const car_options = document.getElementById("car-options");
car_options.addEventListener("wheel", function (e) {
    if (e.deltaY > 0) {
        car_options.scrollLeft += 100;
        e.preventDefault();
    }
    else {
        car_options.scrollLeft -= 100;
        e.preventDefault();
    }
});

// Searching Function
const fromInput = document.getElementById('from');
const toInput = document.getElementById('to');

// Create popup container
const popupContainer = document.createElement('div');
popupContainer.id = 'popup-container';
popupContainer.className = 'hidden';
document.body.appendChild(popupContainer);

// Create popup content
const popupContent = document.createElement('div');
popupContent.id = 'popup-content';
popupContainer.appendChild(popupContent);

// Create search input
const searchInput = document.createElement('input');
searchInput.type = 'text';
searchInput.id = 'search-input';
searchInput.placeholder = 'Search for a location';
popupContent.appendChild(searchInput);

// Create search results container
const searchResults = document.createElement('div');
searchResults.id = 'search-results';
popupContent.appendChild(searchResults);

let activeInput = null;

function showSearchPopup(inputElement) {
    popupContainer.classList.remove('hidden');
    searchInput.value = inputElement.value;
    searchInput.focus();
    activeInput = inputElement;
}

fromInput.addEventListener('click', () => showSearchPopup(fromInput));
toInput.addEventListener('click', () => showSearchPopup(toInput));

// Function to get URL parameters
function getUrlParameter(name) {
    name = name.replace(/[\[]/, '\\[').replace(/[\]]/, '\\]');
    var regex = new RegExp('[\\?&]' + name + '=([^&#]*)');
    var results = regex.exec(location.search);
    return results === null ? '' : decodeURIComponent(results[1].replace(/\+/g, ' '));
}

// Function to set initial 'To' location
function setInitialToLocation() {
    const toInput = document.getElementById('to');
    const initialTo = getUrlParameter('to');
    if (toInput && initialTo) {
        toInput.value = decodeURIComponent(initialTo);
        updateRoute();
    }
}

// Call this function when the page loads
window.addEventListener('load', setInitialToLocation);

// Function to get user's current location
function getUserLocation() {
    return new Promise((resolve, reject) => {
        if ("geolocation" in navigator) {
            navigator.geolocation.getCurrentPosition(
                position => {
                    resolve({
                        lat: position.coords.latitude,
                        lon: position.coords.longitude
                    });
                },
                error => {
                    reject(error);
                }
            );
        } else {
            reject("Geolocation is not supported by this browser.");
        }
    });
}

// Function to reverse geocode coordinates
function reverseGeocode(lat, lon) {
    return fetch(`https://nominatim.openstreetmap.org/reverse?format=json&lat=${lat}&lon=${lon}`)
        .then(response => response.json())
        .then(data => data.display_name);
}

// Function to set initial 'From' location as user's current location
async function setInitialFromLocation() {
    const fromInput = document.getElementById('from');
    if (fromInput) {
        try {
            const location = await getUserLocation();
            const address = await reverseGeocode(location.lat, location.lon);
            fromInput.value = address;
            updateRoute();
        } catch (error) {
            console.error("Error getting user location:", error);
            fromInput.value = ""; // Clear the input if there's an error
        }
    }
}

// Modify the window load event listener
window.addEventListener('load', () => {
    // Ensure the map is initialized before setting locations
    if (typeof map !== 'undefined') {
        setInitialToLocation();
        setInitialFromLocation();
    } else {
        console.error("Map is not initialized");
    }
});

// Add event listeners for location inputs after DOM is fully loaded
document.addEventListener('DOMContentLoaded', () => {
    const fromInput = document.getElementById('from');
    const toInput = document.getElementById('to');

    if (fromInput) {
        fromInput.addEventListener('change', updateRoute);
    }

    if (toInput) {
        toInput.addEventListener('change', updateRoute);
    }
});

// Modify the showSearchPopup function
function showSearchPopup(inputElement) {
    popupContainer.classList.remove('hidden');
    searchInput.value = inputElement.value;
    searchInput.focus();
    activeInput = inputElement;

    // Add "User's location" option if it's the 'From' input
    if (inputElement.id === 'from') {
        const userLocationOption = document.createElement('div');
        userLocationOption.className = 'search-result user-location';
        userLocationOption.textContent = "User's location";
        userLocationOption.addEventListener('click', async () => {
            try {
                const location = await getUserLocation();
                const address = await reverseGeocode(location.lat, location.lon);
                inputElement.value = address;
                popupContainer.classList.add('hidden');
                updateRoute();
            } catch (error) {
                console.error("Error setting user location:", error);
            }
        });
        searchResults.innerHTML = '';
        searchResults.appendChild(userLocationOption);
    } else {
        searchResults.innerHTML = '';
    }
}

searchInput.addEventListener('input', (e) => {
    const query = e.target.value;
    if (query.length > 2) {
        fetch(`https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(query)}`)
            .then(res => res.json())
            .then(data => {
                searchResults.innerHTML = '';
                if (activeInput && activeInput.id === 'from') {
                    const userLocationOption = document.createElement('div');
                    userLocationOption.className = 'search-result user-location';
                    userLocationOption.textContent = "User's location";
                    userLocationOption.addEventListener('click', async () => {
                        try {
                            const location = await getUserLocation();
                            const address = await reverseGeocode(location.lat, location.lon);
                            activeInput.value = address;
                            popupContainer.classList.add('hidden');
                            updateRoute();
                        } catch (error) {
                            console.error("Error setting user location:", error);
                        }
                    });
                    searchResults.appendChild(userLocationOption);
                }
                data.forEach(result => {
                    const div = document.createElement('div');
                    div.className = 'search-result';
                    div.textContent = result.display_name;
                    div.addEventListener('click', () => {
                        if (activeInput) {
                            activeInput.value = result.display_name;
                            popupContainer.classList.add('hidden');
                            updateRoute();
                        }
                    });
                    searchResults.appendChild(div);
                });
            });
    }
});

// Call these functions when the page loads
window.addEventListener('load', () => {
    setInitialToLocation();
    setInitialFromLocation();
});

// Function to update the route
function updateRoute() {
    const fromInput = document.getElementById('from');
    const toInput = document.getElementById('to');

    if (fromInput && toInput && fromInput.value && toInput.value) {
        // Clear existing route and markers
        map.eachLayer(layer => {
            if (layer instanceof L.Polyline || layer instanceof L.Marker) {
                map.removeLayer(layer);
            }
        });

        // Geocode both locations
        // Geocode both locations
        Promise.all([
            fetch(`https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(fromInput.value)}`),
            fetch(`https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(toInput.value)}`)
        ])
            .then(responses => Promise.all(responses.map(res => res.json())))
            .then(([fromResults, toResults]) => {
                if (fromResults.length > 0 && toResults.length > 0) {
                    const fromCoords = [parseFloat(fromResults[0].lat), parseFloat(fromResults[0].lon)];
                    const toCoords = [parseFloat(toResults[0].lat), parseFloat(toResults[0].lon)];

                    // Add markers with correct colors
                    const fromMarker = L.marker(fromCoords, {
                        icon: L.icon({
                            iconUrl: 'https://raw.githubusercontent.com/pointhi/leaflet-color-markers/master/img/marker-icon-2x-blue.png',
                            iconSize: [25, 41],
                            iconAnchor: [12, 41]
                        })
                    }).addTo(map).bindPopup('From');
                    const toMarker = L.marker(toCoords, {
                        icon: L.icon({
                            iconUrl: 'https://raw.githubusercontent.com/pointhi/leaflet-color-markers/master/img/marker-icon-2x-red.png',
                            iconSize: [25, 41],
                            iconAnchor: [12, 41]
                        })
                    }).addTo(map).bindPopup('To');

                    // Get route using OSRM
                    fetch(`https://router.project-osrm.org/route/v1/driving/${fromCoords[1]},${fromCoords[0]};${toCoords[1]},${toCoords[0]}?overview=full&geometries=geojson`)
                        .then(res => res.json())
                        .then(data => {
                            const route = data.routes[0].geometry.coordinates;
                            const polyline = L.polyline(route.map(coord => [coord[1], coord[0]]), { color: '#0f53ff' }).addTo(map);

                            // Create a bounds object that includes both markers and the route
                            const bounds = L.latLngBounds(fromCoords, toCoords);
                            polyline.getLatLngs().forEach(latLng => bounds.extend(latLng));

                            // Fit the map to the bounds with some padding
                            map.fitBounds(bounds, { padding: [50, 50] });
                        });
                }
            });
    }
}

// Add event listeners for location inputs
document.getElementById('from').addEventListener('change', (e) => {
    updateRoute(e.target.value, document.getElementById('to').value);
});

document.getElementById('to').addEventListener('change', (e) => {
    updateRoute(document.getElementById('from').value, e.target.value);
});

popupContainer.addEventListener('click', (e) => {
    if (e.target === popupContainer) {
        popupContainer.classList.add('hidden');
    }
});

// Add random car markers/ Move car icons
/*
function addRandomCarMarkers() {
    const carIcon = L.icon({
        iconUrl: './assets/javascript/pic',
        iconSize: [32, 32],
        iconAnchor: [16, 16]
    });

    for (let i = 0; i < 10; i++) {
        const lat = 3.0556 + (Math.random() - 0.5) * 0.02;
        const lng = 101.6889 + (Math.random() - 0.5) * 0.02;
        L.marker([lat, lng], { icon: carIcon }).addTo(map);
    }
}

addRandomCarMarkers();

function addMovingCarIcons() {
    const carIconUrl = './pic/car-icon.png';

    function getRandomPointOnVisibleArea() {
        const bounds = map.getBounds();
        const southWest = bounds.getSouthWest();
        const northEast = bounds.getNorthEast();
        const lngSpan = northEast.lng - southWest.lng;
        const latSpan = northEast.lat - southWest.lat;

        return [
            southWest.lat + latSpan * Math.random(),
            southWest.lng + lngSpan * Math.random()
        ];
    }

    function movecar(car) {
        const newPos = getRandomPointOnVisibleArea();
        const oldPos = car.getLatLng();
        const angle = Math.atan2(newPos[1] - oldPos.lng, newPos[0] - oldPos.lat) * 180 / Math.PI;
        car.setLatLng(newPos);
        car.setRotationAngle(angle);
        setTimeout(() => movecar(car), Math.random() * 5000 + 1000);
    }

    for (let i = 0; i < 10; i++) {
        const car = L.marker(getRandomPointOnVisibleArea(), {
            icon: L.icon({ iconUrl: carIconUrl, iconSize: [32, 32] }),
            rotationAngle: 0,
            rotationOrigin: 'center center'
        }).addTo(map);
        movecar(car);
    }
}

map.on('load', addMovingCarIcons);
*/

// Searchbar exchange icon functionality
function exchangeLocations() {
    const fromInput = document.getElementById('from');
    const toInput = document.getElementById('to');

    // Animate the exchange
    if (window.innerWidth < 832) {
        fromInput.style.transform = 'translateX(40px)';
        toInput.style.transform = 'translateX(-40px)';
    } else {
        fromInput.style.transform = 'translateY(40px)';
        toInput.style.transform = 'translateY(-40px)';
    }

    setTimeout(() => {
        // Swap the values
        const temp = fromInput.value;
        fromInput.value = toInput.value;
        toInput.value = temp;

        // Reset the animation
        fromInput.style.transform = 'translateY(0)';
        toInput.style.transform = 'translateY(0)';

        // Update the route with the new locations
        updateRoute();
    }, 300);
}

// Function to show notification
function showNotification(message, type) {
    console.log('showNotification called with message:', message, 'and type:', type);
    const notification = document.createElement('div');
    notification.textContent = message;
    notification.className = 'notification';

    // Add type-specific class if provided
    if (type) {
        notification.classList.add(`notification-${type}`);
    }

    document.body.appendChild(notification);

    // Remove the notification after the animation ends
    notification.addEventListener('animationend', () => {
        notification.remove();
    });
}

// Add click event listener to the exchange icon
document.querySelector('.exchange-icon').addEventListener('click', exchangeLocations);


function showLoadingPopup() {
    console.log('Showing loading popup');
    const popup = document.getElementById('loading-popup');
    popup.classList.remove('hidden');
}

function hideLoadingPopup() {
    console.log('Hiding loading popup');
    const popup = document.getElementById('loading-popup');
    popup.classList.add('hidden');
}

document.getElementById('ride-now').addEventListener('click', () => {
    console.log('Ride Now button clicked');
    const carOptionsContainer = document.getElementById('car-options');
    const selectedCar = carOptionsContainer.querySelector('.selected');
    const fromInput = document.getElementById('from');
    const toInput = document.getElementById('to');
    const fromValue = fromInput.value.trim();
    const toValue = toInput.value.trim();

    // Check if car is selected
    if (!selectedCar) {
        console.log('No car selected');
        showNotification('⚠️ Please select a car type before booking a ride!', 'error');
        return; // Stop execution if no car is selected
    }

    // Check if From and To locations are provided
    if (fromValue === "" || toValue === "") {
        console.log('Missing location information');
        showNotification('⚠️ Please enter both From and To locations before booking a ride!', 'error');
        return; // Stop execution if locations are missing
    }

    console.log('All conditions met, proceeding with booking');
    showLoadingPopup();

    // Simulate a 5-second booking process
    setTimeout(() => {
        hideLoadingPopup();
        console.log('Booking process complete, redirecting...');
        window.location.href = 'done_booking_page.php';
    }, 5000);
});


// Add event listener for the "Ride Now" button
document.addEventListener('DOMContentLoaded', function () {
    console.log('DOMContentLoaded event fired');

    // Log the existence of key elements
    console.log('Notes button exists:', !!document.querySelector('#notes, .notes-button, [data-notes-button]'));
    console.log('Notes container exists:', !!document.getElementById('notes-container'));
    console.log('Calendar button exists:', !!document.querySelector('.calendar-icon, #calendar-button, [data-calendar-button]'));
    console.log('Calendar container exists:', !!document.getElementById('calendar-container'));

    // Event delegation for notes and calendar functionality
    document.body.addEventListener('click', function (event) {
        console.log('Click event detected on:', event.target);

        if (event.target.matches('#notes, .notes-button, [data-notes-button]')) {
            console.log('Notes button clicked');
            const notesContainer = document.getElementById('notes-container');
            if (notesContainer) {
                console.log('Notes container found:', notesContainer);
                console.log('Current classList:', notesContainer.classList);
                notesContainer.classList.remove('hidden');
                console.log('classList after removal:', notesContainer.classList);
            } else {
                console.log('Notes container not found');
            }
        }

        if (event.target.matches('#send-notes')) {
            console.log('Send notes button clicked');
            const notesInput = document.getElementById('notes-input');
            const notesContainer = document.getElementById('notes-container');
            const notes = notesInput ? notesInput.value.trim() : ''; // Trim to avoid just whitespace

            // Check if notes are provided
            if (!notes) {
                console.log('No notes provided');
                showNotification('⚠️ Please enter some notes for the driver.', 'error');
                return; // Stop further execution
            }

            console.log('Notes content:', notes);
            if (notesContainer) {
                console.log('Hiding notes container');
                notesContainer.classList.add('hidden');
            } else {
                console.log('Notes container not found');
            }

            if (notesInput) {
                notesInput.value = ''; // Clear the input field after sending
            } else {
                console.log('Notes input not found');
            }

            showNotification('✅ Notes have been sent to the driver successfully!', 'success');
        }


        if (event.target.matches('#cancel-notes')) {
            console.log('Cancel notes button clicked');
            const notesContainer = document.getElementById('notes-container');
            const notesInput = document.getElementById('notes-input');
            if (notesContainer) {
                console.log('Hiding notes container');
                notesContainer.classList.add('hidden');
            } else {
                console.log('Notes container not found');
            }
            if (notesInput) {
                notesInput.value = '';
            } else {
                console.log('Notes input not found');
            }
        }

        // Calendar functionality
        if (event.target.matches('.calendar-icon, #calendar-button, [data-calendar-button], #calendar-button-icon')) {
            console.log('Calendar button clicked');
            const calendarContainer = document.getElementById('calendar-container');
            if (calendarContainer) {
                console.log('Showing calendar container');
                calendarContainer.classList.remove('hidden');
            } else {
                console.log('Calendar container not found');
            }
        }

        if (event.target.matches('#close-calendar')) {
            console.log('Close calendar button clicked');
            const calendarContainer = document.getElementById('calendar-container');
            if (calendarContainer) {
                console.log('Hiding calendar container');
                calendarContainer.classList.add('hidden');
            } else {
                console.log('Calendar container not found');
            }
        }

        if (event.target.matches('#confirm-datetime')) {
            console.log('Confirm date/time button clicked');
            const calendarContainer = document.getElementById('calendar-container');
            const dateInput = document.getElementById('trip-date');
            const timeInput = document.getElementById('trip-time');
            const date = dateInput ? dateInput.value : '';
            const time = timeInput ? timeInput.value : '';

            // Check if date and time are entered
            if (!date || !time) {
                console.log('Date or time not provided');
                showNotification('⚠️ Please select both a date and time for your booking.', 'error');
                return; // Stop further execution
            }

            console.log(`Selected date and time: ${date} ${time}`);
            if (calendarContainer) {
                console.log('Hiding calendar container');
                calendarContainer.classList.add('hidden');
            } else {
                console.log('Calendar container not found');
            }
            showNotification('✅ Booking confirmed! The driver will be ready at the scheduled time.', 'success');
        }
    });

    console.log('Event listener attached to body');
});