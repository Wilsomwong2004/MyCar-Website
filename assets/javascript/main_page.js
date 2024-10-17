let map;
let userFavorites = [];
let inactivityTimer;
let isTracking = false;
let isFetchingDetails = false;
let userMarker;
let placeMarker;
let locateControl;
let currentFilterMarkers = [];
let isUserMovingMap = false;
let userLocationTimeoutId;
let currentSearchQuery = '';
let isSearchContainerVisible = false;
let recognition;
let tileLayer;
let currentPopup = null;
let lastKnownPosition = null;
let initialLocationSet = false;
let defaultCoordinates = [3.1390, 101.6869]; // Kuala Lumpur coordinates
let initialZoom = 12; // Initial zoom level
let userLocationCircle;
let lastActivityTimestamp;
let isPlaceDetailsVisible = false;
let isSearching = false;
let isInactivityTrackingPaused = false;
let isFilterActive = false;
let currentFilterType = null;
let nearbyPlacesContainer = null;
let currentPlaceIndex = 0;
let isViewingFilteredResults = false;
let isViewingFavorites = false;
let isViewingPlaceDetails = false;

const FAST_FOOD_CHAINS = [
    'mcdonald', 'kfc', 'pizzahut', 'domino', 'subway', 'burgerking',
    'wendys', 'tacobell', 'popeyes', 'chickenfillet', 'dunkindonuts',
    'fiveguys', 'pandaexpress', 'arbys', 'dairyqueen', 'chipotle'
];

document.addEventListener('DOMContentLoaded', function () {
    // Initialize the map centered on Kuala Lumpur
    map = L.map('map', {
        zoomControl: false  // Disable default zoom control
    }).setView([3.1390, 101.6869], 12);

    // Function to set the tile layer based on dark mode
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

    // Function to check dark mode preference and update map
    function updateMapDarkMode() {
        const isDarkMode = localStorage.getItem('darkMode') === 'dark';
        setTileLayer(isDarkMode);
    }

    // Initial map setup
    updateMapDarkMode();

    // Listen for dark mode changes
    window.addEventListener('darkModeChange', function (e) {
        updateMapDarkMode();
    });

    // Listen for changes in other tabs
    window.addEventListener('storage', function (e) {
        if (e.key === 'darkMode') {
            updateMapDarkMode();
        }
    });

    // Add zoom control to the bottom right
    L.control.zoom({
        position: 'bottomright'
    }).addTo(map);

    const searchInput = document.getElementById('search-input');
    const searchSuggestions = document.createElement('div');
    searchSuggestions.className = 'search-suggestions';
    searchInput.parentNode.appendChild(searchSuggestions);

    const restaurantButton = document.querySelector('.filter-buttons button:nth-child(1)');
    const shoppingButton = document.querySelector('.filter-buttons button:nth-child(2)');
    const petrolButton = document.querySelector('.filter-buttons button:nth-child(3)');
    const carServiceButton = document.querySelector('.filter-buttons button:nth-child(4)');
    const filterButtons = document.querySelector('.filter-buttons');
    const filterButtons_all = document.querySelectorAll('.filter-buttons button');
    const placeDetailsContainer = document.getElementById('place-details');
    const micIcon = document.querySelector('.mic-icon');
    const favoritesIcon = document.getElementById('.star-icon');

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

    restaurantButton.addEventListener('click', () => filterNearbyPlaces('restaurant'));
    shoppingButton.addEventListener('click', () => filterNearbyPlaces('shopping'));
    petrolButton.addEventListener('click', () => filterNearbyPlaces('petrol'));
    carServiceButton.addEventListener('click', () => filterNearbyPlaces('car_service'));

    // Initially hide the place details container
    placeDetailsContainer.style.display = 'none';

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
            // Clear session storage or authentication token
            sessionStorage.clear(); // Or localStorage.clear() if you're using local storage

            // Redirect to login page or perform other logout actions
            // window.location.href = 'index.php';

            location.replace("index.php");
            /*
            window.location.hash = "no-back";
            window.location.hash = "Again   -No-back-button";
            window.onhashchange = function () { window.location.hash = "no-back"; }
            */
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

    // Mainpage.js function (map & others)
    // Debounce function to limit API calls during typing
    function debounce(func, delay) {
        let timeoutId;
        return function (...args) {
            clearTimeout(timeoutId);
            timeoutId = setTimeout(() => {
                func.apply(this, args);
            }, delay);
        };
    }

    searchInput.addEventListener('input', debounce(function () {
        const query = this.value.trim().toLowerCase();
        if (query.length > 0) {
            filterButtons.style.display = 'none';
            showSearchSuggestions(query);
        } else {
            filterButtons.style.display = 'flex';
            searchSuggestions.innerHTML = '';
        }
    }, 300));  // 300ms debounce delay

    // Function to track user location and fly to it
    function initializeLocationTracking() {
        if ("geolocation" in navigator) {
            locateControl = L.control.locate({
                position: 'bottomright',
                drawCircle: true,
                follow: false,
                setView: false,
                keepCurrentZoomLevel: true,
                icon: 'fa fa-location-arrow',
                onLocationError: onLocationError,
                onLocationOutsideMapBounds: onLocationOutsideMapBounds,
                onLocationFound: onLocationFound
            }).addTo(map);

            // Set initial view to default location
            map.setView(defaultCoordinates, initialZoom);

            // Start locating immediately
            locateControl.start();

            navigator.geolocation.watchPosition(
                updateUserLocation,
                handleLocationError,
                {
                    enableHighAccuracy: true,
                    timeout: 10000,
                    maximumAge: 0
                }
            );
        } else {
            console.error("Geolocation is not supported by your browser");
            alert("Geolocation is not supported by your browser. Some features may not work correctly.");
        }
    }

    function updateUserLocation(position) {
        const newLatLng = L.latLng(position.coords.latitude, position.coords.longitude);
        lastKnownPosition = newLatLng;

        if (!userMarker) {
            userMarker = L.marker(newLatLng, {
                icon: L.divIcon({
                    className: 'user-marker',
                    iconSize: [16, 16],
                    fillOpacity: 0
                })
            }).addTo(map);
        } else {
            userMarker.setLatLng(newLatLng);
        }

        if (!initialLocationSet) {
            focusOnUserLocation(true);
            initialLocationSet = true;
        } else if (!isUserMovingMap) {
            map.panTo(newLatLng);
        }
    }

    function handleLocationError(error) {
        console.warn('Error watching user location', error);
        if (error.code === error.TIMEOUT) {
            // Retry getting location
            navigator.geolocation.getCurrentPosition(updateUserLocation, handleLocationError);
        } else {
            isTracking = false;
            alert("Unable to retrieve your location. Please check your device settings and try again.");
        }
    }

    function onLocationFound(e) {
        lastKnownPosition = e.latlng;
        if (!initialLocationSet) {
            focusOnUserLocation(true);
            initialLocationSet = true;
        }
        isTracking = true;
    }

    function onLocationError(e) {
        console.error("Error finding location:", e.message);
        alert("Unable to find your location. Some features may not work correctly.");
    }

    function onLocationOutsideMapBounds(e) {
        alert("You seem to be located outside the boundaries of the map");
    }

    function focusOnUserLocation(initialJump = false) {
        if (lastKnownPosition) {
            map.flyTo(lastKnownPosition, 18, {
                duration: initialJump ? 3 : 1.5,
                easeLinearity: 0.25,
                zoom: initialJump ? 12 : 18
            });
        }
        if (!isTracking) {
            locateControl.start();
        }
        isTracking = true;
    }

    // Reset inactivity timer and track user location
    function resetInactivityTimer() {
        if (isInactivityTrackingPaused) {
            console.log('Inactivity tracking is paused. Timer not reset.');
            return;
        }
        clearTimeout(inactivityTimer);
        lastActivityTimestamp = Date.now();
        //console.log(`Inactivity timer reset at ${new Date().toLocaleTimeString()}`);
        inactivityTimer = setTimeout(checkInactivity, 1000); // Check every second
    }

    function checkInactivity() {
        if (isInactivityTrackingPaused || isViewingFilteredResults) {
            console.log('Inactivity tracking is paused or user is viewing filtered results. Skipping check.');
            return;
        }
        const currentTime = Date.now();
        const inactivityDuration = currentTime - lastActivityTimestamp;
        //console.log(`Checking inactivity. Time since last activity: ${inactivityDuration / 1000} seconds`);

        if (inactivityDuration >= 10000 && !isPlaceDetailsVisible && !isSearching) {
            console.log(`Inactivity threshold reached at ${new Date().toLocaleTimeString()}`);
            focusOnUserLocation();
            if (!isTracking) {
                console.log('Focusing on user location due to inactivity');
                focusOnUserLocation();
            }
        } else {
            if (isPlaceDetailsVisible) {
                console.log('Place details visible, not focusing on user location');
            }
            if (isSearching) {
                console.log('User is searching, not focusing on user location');
            }
            inactivityTimer = setTimeout(checkInactivity, 1000);
        }
    }

    function pauseInactivityTracking() {
        isInactivityTrackingPaused = true;
        clearTimeout(inactivityTimer);
    }

    function resumeInactivityTracking() {
        if (!isViewingFavorites && !isViewingPlaceDetails) {
            isInactivityTrackingPaused = false;
            resetInactivityTimer();
        }
    }

    ['mousemove', 'keypress', 'touchstart', 'click', 'wheel', 'dragstart'].forEach(function (event) {
        document.addEventListener(event, resetInactivityTimer);
    });


    // Initial call to start tracking and inactivity timer
    initializeLocationTracking();

    function showPlaceDetails(place) {
        const placeLatLng = [parseFloat(place.lat), parseFloat(place.lon)];
        map.flyTo(placeLatLng, 15, {
            duration: 4,
            easeLinearity: 0.5
        });

        if (placeMarker) {
            map.removeLayer(placeMarker);
        }

        placeMarker = L.marker(placeLatLng, { accuracy: 5 }).addTo(map);

        const distance = userMarker ? calculateDistance([userMarker.getLatLng().lat, userMarker.getLatLng().lng], placeLatLng) : 0;

        // Split the display name
        const nameParts = place.display_name.split(',');
        const firstPart = nameParts[0].trim();
        const restOfAddress = nameParts.slice(1).join(',').trim();

        const placeDetailsContainer = document.getElementById('place-details');
        placeDetailsContainer.innerHTML = `
            <div class="place-info">
            <h2>${firstPart}</h2>
            <p>${restOfAddress}</p>
            <p>Distance: ${distance.toFixed(2)} km</p>
            <button class="book-ride-btn">Book a Ride</button>
            </div>
            <div class="close-btn">
            <i class="fa fa-times"></i>
            </div>
        `;

        placeDetailsContainer.style.display = 'flex';

        placeDetailsContainer.querySelector('.book-ride-btn').addEventListener('click', function () {
            const selectedLocation = encodeURIComponent(place.display_name);
            window.location.href = `booking_page.php?to=${selectedLocation}`;
        });

        placeDetailsContainer.querySelector('.close-btn').addEventListener('click', function () {
            clearPlaceDetails();
            isTracking = true;
            locateControl.start();
        });

        placeDetailsContainer.style.display = 'flex';
        isPlaceDetailsVisible = true;
        isTracking = false;
        locateControl.stop();
        isViewingPlaceDetails = true;
        pauseInactivityTracking();
    }

    function clearPlaceDetails() {
        const placeDetailsContainer = document.getElementById('place-details');
        placeDetailsContainer.style.display = 'none';
        isPlaceDetailsVisible = false;
        if (placeMarker) {
            map.removeLayer(placeMarker);
        }
        console.log('Place details cleared, resuming inactivity tracking');
        isViewingPlaceDetails = false;
        resumeInactivityTracking();
    }


    micIcon.addEventListener('click', function () {
        if (!recognition) {
            initSpeechRecognition();
        }
        recognition.start();

    });

    function initSpeechRecognition() {
        recognition = new webkitSpeechRecognition();

        // Set the language based on the user's preference or system settings
        const userLang = navigator.language || navigator.userLanguage;
        switch (userLang) {
            case 'ms-MY':
                recognition.lang = 'ms-MY';
                break;
            case 'zh-CN':
                recognition.lang = 'zh-CN';
                break;
            default:
                recognition.lang = 'en-US';
                break;
        }

        recognition.continuous = false;
        recognition.interimResults = false;

        recognition.onresult = function (event) {
            const transcript = event.results[0][0].transcript;
            searchInput.value = transcript;
            currentSearchQuery = transcript.trim().toLowerCase();
            showSearchSuggestions(currentSearchQuery);
            isSearchContainerVisible = true;
            filterButtons.style.display = 'none';
        };

        recognition.onerror = function (event) {
            console.error('Speech recognition error:', event.error);
        };
    }

    searchInput.addEventListener('input', debounce(function () {
        const query = this.value.trim().toLowerCase();
        currentSearchQuery = query;
        if (query.length > 0) {
            filterButtons.style.display = 'none';
            showSearchSuggestions(query);
            isSearchContainerVisible = true;
            isSearching = true;
            pauseInactivityTracking();
            console.log('User is searching, inactivity tracking paused');
        } else {
            if (searchSuggestions.innerHTML == '') {
                searchSuggestions.innerHTML = '';
            }
            filterButtons.style.display = 'flex';
            searchSuggestions.innerHTML = '';
            isSearchContainerVisible = false;
            isSearching = false;
            resumeInactivityTracking();
            console.log('Search cleared, resuming inactivity tracking');
        }
    }, 300));


    searchInput.addEventListener('click', function () {
        if (currentSearchQuery.length > 0) {
            showSearchSuggestions(currentSearchQuery);
            isSearchContainerVisible = true;
        }
    });

    map.on('click', function () {
        if (isSearchContainerVisible) {
            searchSuggestions.innerHTML = '';
            isSearchContainerVisible = false;
            isSearching = false;
            resumeInactivityTracking();
            console.log('Search closed, resuming inactivity tracking');
        }
    });

    // Add this function to handle search container visibility changes
    function handleSearchContainerVisibility() {
        const searchContainer = document.querySelector('.search-suggestions');
        if (searchContainer) {
            const observer = new MutationObserver((mutations) => {
                mutations.forEach((mutation) => {
                    if (mutation.type === 'attributes' && mutation.attributeName === 'style') {
                        const isVisible = searchContainer.style.display !== 'none';
                        if (isVisible) {
                            pauseInactivityTracking();
                            console.log('Search container visible, inactivity tracking paused');
                        } else {
                            resumeInactivityTracking();
                            console.log('Search container hidden, resuming inactivity tracking');
                        }
                    }
                });
            });

            observer.observe(searchContainer, { attributes: true });
        }
    }

    // Call this function after your DOM is loaded
    document.addEventListener('DOMContentLoaded', handleSearchContainerVisibility);

    // Initial call to start inactivity timer
    resumeInactivityTracking();
    console.log('Inactivity tracking initialized');

    function showSearchSuggestions(query) {
        const userLocation = userMarker ? userMarker.getLatLng() : map.getCenter();
        const url = `https://nominatim.openstreetmap.org/search?format=json&q=${query}&addressdetails=1&extratags=1&namedetails=1&limit=20&countrycodes=my,sg,bn`;

        fetch(url)
            .then(response => response.json())
            .then(data => {
                searchSuggestions.innerHTML = '';
                if (data.length > 0) {
                    const sortedData = data
                        .map(item => ({
                            ...item,
                            distance: calculateDistance([userLocation.lat, userLocation.lng], [parseFloat(item.lat), parseFloat(item.lon)])
                        }))
                        .sort((a, b) => a.distance - b.distance);

                    filterButtons.style.display = 'none';
                    hideNearbyPlacesContainer();

                    const localResults = sortedData.filter(item => item.distance <= 450);

                    localResults.slice(0, 10).forEach(suggestion => {
                        const suggestionElement = document.createElement('div');
                        suggestionElement.className = 'suggestion';
                        const isFavorite = userFavorites.some(fav => fav.fullName === suggestion.display_name);
                        suggestionElement.innerHTML = `
                            <span>${suggestion.display_name}</span>
                            <span>${suggestion.distance.toFixed(2)} km</span>
                            <div class="favorite-container">
                                <button class="favorite-btn">${isFavorite ? '⭐' : '☆'}</button>
                            </div>
                        `;
                        searchSuggestions.appendChild(suggestionElement);

                        suggestionElement.addEventListener('click', function () {
                            clearFilterMarkers();
                            showPlaceDetails(suggestion);
                            isTracking = false;
                            locateControl.stop();
                            searchSuggestions.innerHTML = '';
                        });

                        suggestionElement.querySelector('.favorite-btn').addEventListener('click', function (e) {
                            e.stopPropagation();
                            toggleFavorite(suggestion);
                            this.textContent = userFavorites.some(fav => fav.fullName === suggestion.display_name) ? '⭐' : '☆';
                        });
                    });


                    updateSearchSuggestionsStyle();
                    searchSuggestions.addEventListener('scroll', updateSearchSuggestionsStyle);
                } else {
                    searchSuggestions.innerHTML = '<div class="no-results">Oops! No suggestions found.</div>';
                }
            })
            .catch(error => {
                console.error('Error fetching suggestions:', error);
                searchSuggestions.innerHTML = '<div>Error fetching suggestions</div>';
            });
    }

    window.addEventListener('resize', updateSearchSuggestionsStyle);

    function showAllNearbyFastFood(data, chainName) {
        clearFilterMarkers();
        data.forEach(place => {
            const marker = L.marker([place.lat, place.lon]).addTo(map);
            marker.bindPopup(place.tags.name || capitalizeFirstLetter(chainName));
            currentFilterMarkers.push(marker);
        });

        // Fit the map to show all markers
        const group = new L.featureGroup(currentFilterMarkers);
        map.fitBounds(group.getBounds().pad(0.1));
    }

    function capitalizeFirstLetter(string) {
        return string.charAt(0).toUpperCase() + string.slice(1);
    }

    // Function to clear all filter markers
    function clearFilterMarkers() {
        currentFilterMarkers.forEach(marker => map.removeLayer(marker));
        currentFilterMarkers = [];
    }

    filterButtons_all.forEach(button => {
        button.addEventListener('click', () => {
            const filterType = button.getAttribute('data-filter-type');
            filterNearbyPlaces(filterType);
            clearPlaceDetails();
        });
    });

    function filterNearbyPlaces(category) {
        if (currentFilterType === category && isFilterActive) {
            clearFilterMarkers();
            hideNearbyPlacesContainer();
            isFilterActive = false;
            currentFilterType = null;
            isViewingFilteredResults = false;
            resumeInactivityTracking();
            console.log('Filtering deactivated for category:', category);
            return;
        }

        clearFilterMarkers();
        currentFilterType = category;
        isFilterActive = true;

        const userLocation = userMarker ? userMarker.getLatLng() : map.getCenter();
        const radius = 2500; // 2.5km radius
        let query = '';

        switch (category) {
            case 'restaurant':
                query = `
                    node(around:${radius},${userLocation.lat},${userLocation.lng})[amenity=restaurant];
                    node(around:${radius},${userLocation.lat},${userLocation.lng})[amenity=fast_food];
                    node(around:${radius},${userLocation.lat},${userLocation.lng})[amenity=cafe];
                    node(around:${radius},${userLocation.lat},${userLocation.lng})[amenity=food_court];
                `;
                break;
            case 'shopping':
                query = `
                    node(around:${radius},${userLocation.lat},${userLocation.lng})[shop][shop!~"car|car_parts|car_repair"];
                    node(around:${radius},${userLocation.lat},${userLocation.lng})[amenity=mall];
                `;
                break;
            case 'petrol':
                query = `
                    node(around:${radius},${userLocation.lat},${userLocation.lng})[amenity=fuel];
                    node(around:${radius},${userLocation.lat},${userLocation.lng})[amenity=charging_station];
                `;
                break;
            case 'car_service':
                query = `
                    node(around:${radius},${userLocation.lat},${userLocation.lng})[shop~"car|car_parts|car_repair"];
                    node(around:${radius},${userLocation.lat},${userLocation.lng})[amenity=car_repair];
                `;
                break;
            default:
                console.error('Invalid category');
                return;
        }

        const url = `https://overpass-api.de/api/interpreter?data=[out:json];(${encodeURIComponent(query)});out body;>;out skel qt;`;

        fetch(url)
            .then(response => response.json())
            .then(data => {
                if (!data.elements || data.elements.length === 0) {
                    console.log('No places found for this category');
                    hideNearbyPlacesContainer();
                    return;
                }

                data.elements.forEach(element => {
                    if (element.lat && element.lon) {
                        const markerOptions = {
                            tags: element.tags || {},
                            title: element.tags.name || 'Unnamed place'
                        };
                        const marker = L.marker([element.lat, element.lon], markerOptions).addTo(map);
                        marker.setIcon(L.divIcon({ className: 'default-marker' }));
                        currentFilterMarkers.push(marker);
                    }
                });

                if (currentFilterMarkers.length > 0) {
                    const group = L.featureGroup(currentFilterMarkers);
                    map.flyToBounds(group.getBounds().pad(0.2), {
                        duration: 1,
                        easeLinearity: 0.5
                    });
                    showNearbyPlacesContainer(currentFilterMarkers);
                } else {
                    hideNearbyPlacesContainer();
                }
            })
            .catch(error => {
                console.error('Error fetching filtered places:', error);
                hideNearbyPlacesContainer();
            });
    }

    function getAddressFromLatLng(lat, lng) {
        return fetch(`https://nominatim.openstreetmap.org/reverse?format=json&lat=${lat}&lon=${lng}`)
            .then(response => response.json())
            .then(data => {
                if (data.display_name) {
                    return data.display_name;
                } else {
                    return 'Address not available';
                }
            })
            .catch(error => {
                console.error('Error fetching address:', error);
                return 'Address not available';
            });
    }

    function showNearbyPlacesContainer(places) {
        if (!nearbyPlacesContainer) {
            nearbyPlacesContainer = document.createElement('div');
            nearbyPlacesContainer.id = 'nearby-places-container';
            nearbyPlacesContainer.innerHTML = `
                <div class="navigation-buttons">
                    <button class="prev-place"><i class="fas fa-chevron-left"></i></button>
                </div>
                <div class="filter-place-details">
                    <div class="place-info"></div>
                    <button class="book-ride-btn">Book a Ride</button>
                </div>
                <div class="navigation-buttons">
                    <button class="next-place"><i class="fas fa-chevron-right"></i></button>
                </div>
                <div class="close-btn">
                    <i class="fa fa-times"></i>
                </div>
            `;
            document.body.appendChild(nearbyPlacesContainer);

            nearbyPlacesContainer.querySelector('.prev-place').addEventListener('click', () => navigatePlace(-1));
            nearbyPlacesContainer.querySelector('.next-place').addEventListener('click', () => navigatePlace(1));

            nearbyPlacesContainer.querySelector('.book-ride-btn').addEventListener('click', function () {
                const currentPlace = places[currentPlaceIndex];
                if (currentPlace) {
                    const selectedLocation = encodeURIComponent(currentPlace.fullAddress || currentPlace.options.title || 'selected location');
                    window.location.href = `booking_page.php?to=${selectedLocation}`;
                }
            });

            nearbyPlacesContainer.querySelector('.close-btn').addEventListener('click', function () {
                hideNearbyPlacesContainer();
                clearFilterMarkers();
                isFilterActive = false;
                currentFilterType = null;
            });
        }

        currentPlaceIndex = 0;
        updatePlaceInfo(places);
        nearbyPlacesContainer.style.display = 'flex';
        isViewingFilteredResults = true;
        pauseInactivityTracking();
    }

    function hideNearbyPlacesContainer() {
        if (nearbyPlacesContainer) {
            nearbyPlacesContainer.style.display = 'none';
        }
        isViewingFilteredResults = false;
        resumeInactivityTracking();
    }

    function updatePlaceInfo(places) {
        const placeInfo = nearbyPlacesContainer.querySelector('.place-info');
        const place = places[currentPlaceIndex];
        if (place && place instanceof L.Marker) {
            const latLng = place.getLatLng();
            const tags = place.options.tags || {};
            const name = tags.name || place.options.title || 'Unnamed place';
            const type = tags.amenity || tags.shop || currentFilterType || 'Unknown type';
            map.flyTo(latLng, 15);
            getAddressFromLatLng(latLng.lat, latLng.lng).then(address => {
                placeInfo.innerHTML = `
                    <div class="place-info-title">
                        <h3>${name}</h3>
                        <p class="place-type">${type}</p>
                    </div>
                    <p class="place-address">${address}</p>
                `;
                place.fullAddress = `${address}`; // Store the full address
            });
        } else {
            console.log('No place found at index:', currentPlaceIndex);
            placeInfo.innerHTML = '<p>No information available</p>';
        }
    }

    function navigatePlace(direction) {
        if (currentFilterMarkers.length === 0) {
            console.log('No places to navigate');
            return;
        }

        currentPlaceIndex = (currentPlaceIndex + direction + currentFilterMarkers.length) % currentFilterMarkers.length;
        updatePlaceInfo(currentFilterMarkers);

        // Highlight the current marker
        currentFilterMarkers.forEach((marker, index) => {
            if (index === currentPlaceIndex) {
                marker.setIcon(L.divIcon({ className: 'selected-marker' }));
            } else {
                marker.setIcon(L.divIcon({ className: 'default-marker' }));
            }
        });
    }

    function clearFilterMarkers() {
        currentFilterMarkers.forEach(marker => map.removeLayer(marker));
        currentFilterMarkers = [];
    }

    // Assuming filterButtons_all is defined elsewhere
    filterButtons_all.forEach(button => {
        button.addEventListener('click', () => {
            const filterType = button.getAttribute('data-filter-type');
            filterNearbyPlaces(filterType);
        });
    });

    function calculateDistance(userLatLng, placeLatLng) {
        const R = 6371; // Earth's radius in kilometers
        const φ1 = userLatLng[0] * Math.PI / 180; // user latitude in radians
        const φ2 = placeLatLng[0] * Math.PI / 180; // place latitude in radians
        const Δφ = (placeLatLng[0] - userLatLng[0]) * Math.PI / 180;
        const Δλ = (placeLatLng[1] - userLatLng[1]) * Math.PI / 180;

        const a = Math.sin(Δφ / 2) * Math.sin(Δφ / 2) +
            Math.cos(φ1) * Math.cos(φ2) *
            Math.sin(Δλ / 2) * Math.sin(Δλ / 2);
        const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
        return R * c;
    }

    function updateFavorites(suggestion, isFavorite) {
        if (isFavorite) {
            const newFavorite = {
                name: suggestion.display_name.split(',')[0],
                fullName: suggestion.display_name,
                distance: suggestion.distance,
                latLng: [parseFloat(suggestion.lat), parseFloat(suggestion.lon)]
            };
            userFavorites.push(newFavorite);
        } else {
            userFavorites = userFavorites.filter(fav => fav.fullName !== suggestion.display_name);
        }
        updateFavoritesUI();
        saveFavoritesToLocalStorage();
    }

    function toggleFavorite(suggestion) {
        const isFavorite = userFavorites.some(fav => fav.fullName === suggestion.display_name);
        updateFavorites(suggestion, !isFavorite);
    }

    function updateFavoritesUI() {
        const favoritesContainer = document.querySelector('.favorites-container');
        if (!favoritesContainer) {
            console.error('Favorites container not found');
            return;
        }
        favoritesContainer.innerHTML = '';

        userFavorites.forEach(favorite => {
            const favoriteElement = document.createElement('div');
            favoriteElement.className = 'favorite-item';
            favoriteElement.innerHTML = `
                <img src="https://via.placeholder.com/50" alt="${favorite.name}">
                <div class="favorite-info">
                    <span class="favorite-name">${favorite.name}</span>
                    <span class="favorite-distance">${favorite.distance.toFixed(2)} km</span>
                </div>
                <button class="remove-favorite-btn">❌</button>
            `;
            favoritesContainer.appendChild(favoriteElement);

            favoriteElement.querySelector('.remove-favorite-btn').addEventListener('click', (e) => {
                e.stopPropagation();
                toggleFavorite({ display_name: favorite.fullName });
            });

            favoriteElement.addEventListener('click', () => {
                map.flyTo(favorite.latLng, 15);
                if (placeMarker) {
                    map.removeLayer(placeMarker);
                }
                placeMarker = L.marker(favorite.latLng).addTo(map);
                fetchPlaceDetails(favorite.latLng, favorite.name);
                isTracking = false;
                locateControl.stop();
            });
        });
    }

    function updateSearchSuggestionsStyle() {
        const searchSuggestions = document.querySelector('.search-suggestions');
        if (!searchSuggestions) return;

        const scrollPercentage = searchSuggestions.scrollTop / (searchSuggestions.scrollHeight - searchSuggestions.clientHeight);

        let topRightRadius, bottomRightRadius;

        if (scrollPercentage === 0) {
            topRightRadius = '2px';
            bottomRightRadius = '12px';
        } else if (scrollPercentage === 1) {
            topRightRadius = '12px';
            bottomRightRadius = '2px';
        } else {
            topRightRadius = '12px';
            bottomRightRadius = '12px';
        }

        searchSuggestions.style.borderTopRightRadius = topRightRadius;
        searchSuggestions.style.borderBottomRightRadius = bottomRightRadius;

        // Update scrollbar thumb style
        const style = document.createElement('style');
        style.textContent = `
            .search-suggestions::-webkit-scrollbar-thumb {
                border-top-right-radius: ${topRightRadius};
                border-bottom-right-radius: ${bottomRightRadius};
            }
        `;

        // Remove any previously added style
        const oldStyle = document.getElementById('dynamic-scrollbar-style');
        if (oldStyle) {
            oldStyle.remove();
        }

        // Add the new style
        style.id = 'dynamic-scrollbar-style';
        document.head.appendChild(style);
    }

    // Call the function on scroll
    document.querySelector('.search-suggestions').addEventListener('scroll', updateSearchSuggestionsStyle);

    // Initial call to set the initial state
    updateSearchSuggestionsStyle();

    // Hide place details when map is moved manually
    map.on('movestart', function () {
        isUserMovingMap = true;
        clearTimeout(userLocationTimeoutId);
        if (!isTracking) {
            placeDetailsContainer.style.display = 'none';
        }
    });

    // Show place details when a marker is clicked
    map.on('click', function (e) {
        if (placeMarker && placeMarker.getLatLng().equals(e.latlng)) {
            placeDetailsContainer.style.display = 'flex';
        }
    });

    map.on('moveend', function () {
        isUserMovingMap = false;
        clearTimeout(userLocationTimeoutId);
    });
});