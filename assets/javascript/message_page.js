let emojiPicker = null;
let unsentMessages = {};
let currentPopup = null;
let removeTimeout = null;

const chats = [
    {
        id: 1,
        name: 'Helena Hills',
        phoneNumber: '+60 12-345 6789',
        lastMessage: 'I just arrived at the entrance!',
        image: 'assets/css/pic/Unknown_acc-removebg.png',
        messages: [
            { text: 'Hi Helena, are you on the way?', isSent: true },
            { text: 'Yes, I will be there in 5 minutes.', isSent: false },
            { text: 'Great! I am waiting at the entrance.', isSent: true },
            { text: 'I just hit some traffic, might take 2-3 minutes longer.', isSent: false },
            { text: 'No worries, I will wait.', isSent: true },
            { text: 'I just arrived at the entrance!', isSent: false }
        ]
    },
    {
        id: 2,
        name: 'Carlo Emilio',
        phoneNumber: '+60 12-345 6789',
        lastMessage: 'I’ll park nearby and wait for you.',
        image: 'assets/css/pic/Unknown_acc-removebg.png',
        messages: [
            { text: 'Hi Carlo, are you close?', isSent: true },
            { text: 'Yes, just 2 minutes away.', isSent: false },
            { text: 'Okay, I will be ready.', isSent: true },
            { text: 'Actually, I’m having trouble finding the entrance.', isSent: false },
            { text: 'Oh, it’s the one near the main road, just turn left.', isSent: true },
            { text: 'Got it! I’ll park nearby and wait for you.', isSent: false }
        ]
    },
    {
        id: 3,
        name: 'Oscar Davis',
        phoneNumber: '+60 19-234 5678',
        lastMessage: 'See you soon!',
        image: 'assets/css/pic/Unknown_acc-removebg.png',
        messages: [
            { text: 'Hi Oscar, is everything on track?', isSent: true },
            { text: 'Yes, I am on the way now.', isSent: false },
            { text: 'Awesome! Thank you.', isSent: true },
            { text: 'See you soon!', isSent: false }
        ]
    },
    {
        id: 4,
        name: 'Daniel Jay Park',
        phoneNumber: '+60 11-765 4321',
        lastMessage: 'I will be there shortly.',
        image: 'assets/css/pic/Unknown_acc-removebg.png',
        messages: [
            { text: 'Hi Daniel, have you left yet?', isSent: true },
            { text: 'Yes, just leaving now.', isSent: false },
            { text: 'Alright, I will wait at the pickup point.', isSent: true },
            { text: 'I will be there shortly.', isSent: false }
        ]
    },
    {
        id: 5,
        name: 'Mark Rojas',
        phoneNumber: '+60 13-876 5432',
        lastMessage: 'I’ll take a shortcut and be there soon!',
        image: 'assets/css/pic/Unknown_acc-removebg.png',
        messages: [
            { text: 'Hi Mark, how much longer?', isSent: true },
            { text: 'On the way! I’ll be there in 7 minutes.', isSent: false },
            { text: 'Thanks! I will wait here.', isSent: true },
            { text: 'Actually, there’s some heavy traffic ahead.', isSent: false },
            { text: 'Do you think it will take much longer?', isSent: true },
            { text: 'I’ll take a shortcut and be there soon!', isSent: false }
        ]
    },
    {
        id: 6,
        name: 'Giannis Constantinou',
        phoneNumber: '+60 14-567 8901',
        lastMessage: 'All sorted, see you shortly!',
        image: 'assets/css/pic/Unknown_acc-removebg.png',
        messages: [
            { text: 'Hi Giannis, will you be arriving soon?', isSent: true },
            { text: 'Yes, in about 10 minutes.', isSent: false },
            { text: 'Okay, I’ll be ready.', isSent: true },
            { text: 'Wait, my GPS isn’t showing the right location.', isSent: false },
            { text: 'Oh! Do you need me to send you directions?', isSent: true },
            { text: 'That would help, thank you!', isSent: false },
            { text: 'Sending it now. Let me know if it works!', isSent: true },
            { text: 'All sorted, see you shortly!', isSent: false }
        ]
    },
    {
        id: 7,
        name: 'Briana Lewis',
        phoneNumber: '+60 17-654 3210',
        lastMessage: 'Thanks for the 5 stars!',
        image: 'assets/css/pic/Unknown_acc-removebg.png',
        messages: [
            { text: 'Hi Briana, just checking if you are near.', isSent: true },
            { text: 'Yes, almost there!', isSent: false },
            { text: 'Alright, I’ll be waiting.', isSent: true },
            { text: 'Thanks for the 5 stars!', isSent: false }
        ]
    },
    {
        id: 8,
        name: 'Sherry Roy',
        phoneNumber: '+60 18-432 1098',
        lastMessage: 'I am almost there!',
        image: 'assets/css/pic/Unknown_acc-removebg.png',
        messages: [
            { text: 'Hi Sherry, just checking your status.', isSent: true },
            { text: 'I am going to your pickup point now.', isSent: false },
            { text: 'Perfect, see you soon!', isSent: true },
            { text: 'I am almost there!', isSent: false }
        ]
    }
];

// Responsive Design (Phone)
function initResponsiveLayout() {
    const messagesContainer = document.querySelector('.messages-container');
    const chatHeader = document.querySelector('.chat-header');

    if (window.innerWidth <= 768) {
        if (!chatHeader.querySelector('.back-button')) {
            const backButton = document.createElement('span');
            backButton.className = 'back-button';
            backButton.innerHTML = '<i class="fas fa-angle-left"></i>';
            backButton.addEventListener('click', showChatList);
            chatHeader.insertBefore(backButton, chatHeader.firstChild);
        }
    } else {
        const backButton = chatHeader.querySelector('.back-button');
        if (backButton) {
            backButton.remove();
        }
    }

    function showChatWindow() {
        console.log('Showing chat window');
        messagesContainer.classList.add('show-chat-window');
    }

    function showChatList() {
        console.log('Showing chat list');
        messagesContainer.classList.remove('show-chat-window');
    }

    // Update the selectChat function
    window.selectChat = function (chat) {
        console.log('Selected chat:', chat);
        // Existing chat selection code...

        if (window.innerWidth <= 768) {
            showChatWindow();
        }
    };

    // Add click event listeners to chat items
    const chatItems = document.querySelectorAll('.chat-item');
    console.log('Number of chat items:', chatItems.length);
    chatItems.forEach(item => {
        item.addEventListener('click', () => {
            console.log('Chat item clicked:', item);
            const chatId = item.dataset.chatId;
            console.log('Chat ID:', chatId);
            const chat = chats.find(c => c.id === parseInt(chatId));
            if (chat) {
                window.selectChat(chat);
            } else {
                console.log('Chat not found for ID:', chatId);
            }
        });
    });
}

window.addEventListener('resize', initResponsiveLayout);

// Call initResponsiveLayout on page load and window resize
document.addEventListener('DOMContentLoaded', () => {
    console.log('DOM content loaded');
    initResponsiveLayout();
});
window.addEventListener('resize', initResponsiveLayout);

// Make sure this function is defined
function createChatItem(chat) {
    const li = document.createElement('li');
    li.className = 'chat-item';
    li.dataset.chatId = chat.id; // Add this line to set the data-chat-id attribute
    li.innerHTML = `
        <img src="${chat.image}" alt="${chat.name}">
        <div class="chat-item-info">
        <div class="chat-item-name">${chat.name}</div>
        <div class="chat-item-lastmessage">${chat.lastMessage}</div>
        </div>
    `;
    li.addEventListener('click', () => selectChat(chat));
    return li;
}

// Define this function if it's not already defined
function selectChat(chat) {
    console.log('selectChat function called with:', chat);
    // Implementation of chat selection
    // ...

    if (window.innerWidth <= 768) {
        const messagesContainer = document.querySelector('.messages-container');
        if (messagesContainer) {
            messagesContainer.classList.add('show-chat-window');
        } else {
            console.error('messagesContainer not found');
        }
    }
}

// Call initResponsiveLayout on page load and window resize
document.addEventListener('DOMContentLoaded', initResponsiveLayout);
window.addEventListener('resize', initResponsiveLayout);

document.addEventListener('DOMContentLoaded', function () {
    // Draggable divider functionality
    const messagesContainer = document.querySelector('.messages-container');
    let chatList = document.querySelector('.chat-list');

    // Create chat list if it doesn't exist
    if (!chatList) {
        chatList = document.createElement('div');
        chatList.className = 'chat-list';
        messagesContainer.insertBefore(chatList, messagesContainer.firstChild);
    }

    // Add title if it doesn't exist
    if (!chatList.querySelector('h2')) {
        const title = document.createElement('h2');
        title.textContent = 'Messages';
        chatList.insertBefore(title, chatList.firstChild);
    }

    // Add search bar if it doesn't exist
    if (!chatList.querySelector('.search-bar')) {
        const searchBar = document.createElement('div');
        searchBar.className = 'search-bar';
        searchBar.innerHTML = `
            <input type="text" placeholder="Search chats">
            <i class="fas fa-search"></i>
        `;
        chatList.insertBefore(searchBar, chatList.firstChild.nextSibling);
    }

    // Draggable divider functionality
    let isDragging = false;
    let divider = document.getElementById('draggable-divider');
    const chatWindow = document.querySelector('.chat-window');

    // Create divider if it doesn't exist
    if (!divider) {
        divider = document.createElement('div');
        divider.id = 'draggable-divider';
        messagesContainer.insertBefore(divider, chatWindow);
    }

    divider.addEventListener('mousedown', (e) => {
        isDragging = true;
        document.addEventListener('mousemove', onMouseMove);
        document.addEventListener('mouseup', onMouseUp);

    });

    function onMouseMove(e) {
        if (!isDragging) return;

        // Check if the viewport width is more than 768px
        if (window.innerWidth > 768) {
            const containerRect = messagesContainer.getBoundingClientRect();
            const newWidth = e.clientX - containerRect.left;
            chatList.style.width = `${newWidth}px`; // Apply dynamic width
        }
    }

    // Listen for window resize to clear inline styles
    window.addEventListener('resize', () => {
        if (window.innerWidth <= 768) {
            chatList.style.width = ''; // Clear inline width when <= 768px
        }
    });


    function onMouseUp() {
        isDragging = false;
        document.removeEventListener('mousemove', onMouseMove);
        document.removeEventListener('mouseup', onMouseUp);
    }

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


    //chat-container
    const chatMessages = document.getElementById('chat-messages');
    const messageInput = document.getElementById('message-input');
    const sendButton = document.getElementById('send-button');
    const contactName = document.getElementById('contact-name');
    const contactImage = document.getElementById('contact-image');
    const emojiButton = document.getElementById('emoji-button');
    const attachmentButton = document.getElementById('attachment-button');
    const phoneButton = document.getElementById('phone-button');
    const phonePopup = document.getElementById('phone-popup');
    const phoneNumberElement = document.getElementById('phone-number');
    const closePopupButton = document.getElementById('close-popup');

    let currentChat = null;

    function createChatItem(chat) {
        const li = document.createElement('li');
        li.className = 'chat-item';
        li.dataset.chatId = chat.id;
        li.innerHTML = `
            <img src="${chat.image}" alt="${chat.name}">
            <div class="chat-item-info">
                <div class="chat-item-name">${chat.name}</div>
                <div class="chat-item-lastmessage">${chat.lastMessage}</div>
            </div>
        `;
        li.addEventListener('click', () => selectChat(chat));
        return li;
    }

    function selectChat(chat) {
        console.log('selectChat function called with:', chat);

        if (window.innerWidth <= 768) {
            const messagesContainer = document.querySelector('.messages-container');
            if (messagesContainer) {
                messagesContainer.classList.add('show-chat-window');
            } else {
                console.error('messagesContainer not found');
            }
        }

        // Save unsent message for the current chat
        if (currentChat) {
            unsentMessages[currentChat.id] = messageInput.value;
        }

        currentChat = chat;
        contactName.textContent = chat.name;
        contactImage.src = chat.image;
        chatMessages.innerHTML = ''; // Clear previous messages

        // Add conversation start date
        const dateElement = document.createElement('div');
        dateElement.className = 'conversation-date';
        dateElement.textContent = new Date().toLocaleDateString();
        chatMessages.appendChild(dateElement);

        chat.messages.forEach(message => addMessage(message.text, message.isSent));

        // Restore unsent message for this chat
        messageInput.value = unsentMessages[chat.id] || '';
    }

    sendButton.addEventListener('click', function () {
        const message = messageInput.value.trim();
        if (message && currentChat) {
            addMessage(message);
            currentChat.messages.push({ text: message, isSent: true, timestamp: new Date() });
            messageInput.value = '';
            delete unsentMessages[currentChat.id]; // Clear unsent message for this chat
        }
    });

    // Add this event listener to save unsent messages when switching chats
    messageInput.addEventListener('input', function () {
        if (currentChat) {
            unsentMessages[currentChat.id] = messageInput.value;
        }
    });

    function addMessage(message, isSent = true) {
        const messageElement = document.createElement('div');
        messageElement.classList.add('message', isSent ? 'message-sent' : 'message-received');
        messageElement.textContent = message;
        chatMessages.appendChild(messageElement);
        chatMessages.scrollTop = chatMessages.scrollHeight;
    }

    function updateChatList() {
        chatList.innerHTML = '';
        chats.forEach(chat => chatList.appendChild(createChatItem(chat)));
    }

    sendButton.addEventListener('click', function () {
        const message = messageInput.value.trim();
        if (message && currentChat) {
            addMessage(message);
            messageInput.value = '';
            delete unsentMessages[currentChat.id]; // Clear unsent message for this chat
            // Simulate received message after a short delay
            //setTimeout(() => {
            //    addMessage(`Reply to: ${message}`, false);
            //}, 1000);
        }
    });

    messageInput.addEventListener('keypress', function (e) {
        if (e.key === 'Enter') {
            sendButton.click();
        }
    });

    // Populate chat list
    updateChatList();

    // Select the first chat by default
    if (chats.length > 0) {
        selectChat(chats[0]);
    }

    // Emoji and attachment functionality
    const emojiCategories = {
        'Smileys & People': ['😀', '😃', '😄', '😁', '😆', '😅', '😂', '🤣', '😊', '😇'],
        'Animals & Nature': ['🐶', '🐱', '🐭', '🐹', '🐰', '🦊', '🐻', '🐼', '🐨', '🐯'],
        'Food & Drink': ['🍎', '🍐', '🍊', '🍋', '🍌', '🍉', '🍇', '🍓', '🍒', '🍑'],
        'Activities': ['⚽️', '🏀', '🏈', '⚾️', '🎾', '🏐', '🏉', '🎱', '🏓', '🏸'],
        'Travel & Places': ['🚗', '🚕', '🚙', '🚌', '🚎', '🏎', '🚓', '🚑', '🚒', '🚐'],
        'Objects': ['⌚️', '📱', '💻', '⌨️', '🖥', '🖨', '🖱', '🖲', '🕹', '🗜'],
        'Symbols': ['❤️', '💛', '💚', '💙', '💜', '🖤', '💔', '❣️', '💕', '💞'],
        'Flags': ['🏳️', '🏴', '🏁', '🚩', '🏳️‍🌈', '🇦🇫', '🇦🇽', '🇦🇱', '🇩🇿', '🇦🇸']
    };


    function createEmojiPicker() {
        emojiPicker = document.createElement('div');
        emojiPicker.className = 'emoji-picker';
        emojiPicker.style.display = 'none';

        const categoryTabs = document.createElement('div');
        categoryTabs.className = 'emoji-category-tabs';

        const categoryIndicator = document.createElement('div');
        categoryIndicator.className = 'category-indicator';
        categoryTabs.appendChild(categoryIndicator);

        if (darkModeToggle) {
            emojiPicker.classList.add('dark-mode');
        }

        const emojiContainer = document.createElement('div');
        emojiContainer.className = 'emoji-container';

        emojiPicker.appendChild(categoryTabs);
        emojiPicker.appendChild(emojiContainer);

        let activeTab = null;

        Object.keys(emojiCategories).forEach((category, index) => {
            const tab = document.createElement('span');
            tab.textContent = category.split(' ')[0];
            tab.dataset.category = category;

            tab.addEventListener('click', () => {
                showEmojiCategory(category);
                updateCategoryIndicator(tab);
                if (activeTab) {
                    activeTab.style.color = '';
                }
                tab.style.color = 'white';
                activeTab = tab;
            });

            categoryTabs.appendChild(tab);

            if (index === 0) {
                tab.style.color = 'white';
                activeTab = tab;
                setTimeout(() => {
                    showEmojiCategory(category);
                    updateCategoryIndicator(tab);
                }, 0);
            }
        });

        document.body.appendChild(emojiPicker);
    }

    function updateCategoryIndicator(tab) {
        const indicator = emojiPicker.querySelector('.category-indicator');
        indicator.style.width = `${tab.offsetWidth}px`;
        indicator.style.left = `${tab.offsetLeft}px`;
    }

    function showEmojiCategory(category) {
        const emojiContainer = emojiPicker.querySelector('.emoji-container');
        emojiContainer.innerHTML = '';
        emojiCategories[category].forEach(emoji => {
            const emojiSpan = document.createElement('span');
            emojiSpan.textContent = emoji;
            emojiSpan.addEventListener('click', () => {
                messageInput.value += emoji;
                messageInput.focus();
                emojiPicker.style.display = 'none';
            });
            emojiContainer.appendChild(emojiSpan);
        });
    }

    emojiButton.addEventListener('click', function (event) {
        event.stopPropagation();
        if (!emojiPicker) {
            createEmojiPicker();
        }
        const buttonRect = emojiButton.getBoundingClientRect();
        emojiPicker.style.bottom = `74px`;
        emojiPicker.style.left = `${buttonRect.left + window.scrollX - 456}px`;
        emojiPicker.style.display = emojiPicker.style.display === 'none' ? 'block' : 'none';
    });

    document.addEventListener('click', function (event) {
        if (emojiPicker && !emojiPicker.contains(event.target) && event.target !== emojiButton) {
            emojiPicker.style.display = 'none';
        }
    });

    if (attachmentButton && messageInput) {
        attachmentButton.addEventListener('click', function () {
            const fileInput = document.createElement('input');
            fileInput.type = 'file';
            fileInput.style.display = 'none';
            document.body.appendChild(fileInput);

            fileInput.click();

            fileInput.addEventListener('change', function () {
                if (fileInput.files.length > 0) {
                    const fileName = fileInput.files[0].name;
                    messageInput.value += `[Attachment: ${fileName}]`;
                    messageInput.focus();
                }
                document.body.removeChild(fileInput);
            });
        });
    }

    phoneButton.addEventListener('click', function () {
        if (currentChat && currentChat.phoneNumber) {
            phoneNumberElement.textContent = currentChat.phoneNumber;
            phonePopup.style.display = 'block';
        } else {
            console.log('No phone number available for this contact');
        }
    });

    closePopupButton.addEventListener('click', function () {
        phonePopup.style.display = 'none';
    });

    // Close the popup if the user clicks outside of it
    window.addEventListener('click', function (event) {
        if (event.target === phonePopup) {
            phonePopup.style.display = 'none';
        }
    });

    // Chat list functionality
    const searchInput = document.querySelector('.search-bar input');

    function updateChatList(chatsToShow = chats) {
        const chatListElement = document.querySelector('.chat-list ul') || chatList;
        if (chatListElement) {
            chatListElement.innerHTML = '';
            chatsToShow.forEach(chat => {
                const chatItem = createChatItem(chat);
                chatListElement.appendChild(chatItem);
            });
        } else {
            console.error('Chat list element not found');
        }
    }

    if (searchInput) {
        searchInput.addEventListener('input', () => {
            const searchTerm = searchInput.value.toLowerCase();
            const filteredChats = chats.filter(chat =>
                chat.name.toLowerCase().includes(searchTerm)
            );
            updateChatList(filteredChats);
        });
    }

    function initializeChatList() {
        updateChatList();

        // Add click event listeners to chat items
        const chatItems = document.querySelectorAll('.chat-item');
        console.log('Number of chat items:', chatItems.length);
        chatItems.forEach(item => {
            item.addEventListener('click', () => {
                console.log('Chat item clicked:', item);
                const chatId = item.dataset.chatId;
                console.log('Chat ID:', chatId);
                const chat = chats.find(c => c.id === parseInt(chatId));
                if (chat) {
                    selectChat(chat);
                } else {
                    console.log('Chat not found for ID:', chatId);
                }
            });
        });
    }

    // Initial chat list update
    updateChatList();
    initResponsiveLayout();

    document.addEventListener('DOMContentLoaded', () => {
        console.log('DOM content loaded');
        initializeChatList();
        initResponsiveLayout();
    });
});

// Make sure this function is defined
function createChatItem(chat) {
    const li = document.createElement('li');
    li.className = 'chat-item';
    li.innerHTML = `
        <img src="${chat.image}" alt="${chat.name}">
        <div class="chat-item-info">
            <div class="chat-item-name">${chat.name}</div>
            <div class="chat-item-lastmessage">${chat.lastMessage}</div>
        </div>
    `;
    li.addEventListener('click', () => selectChat(chat));
    return li;
}

// Define this function if it's not already defined
function selectChat(chat) {
    // Implementation of chat selection
    console.log('Selected chat:', chat.name);
}
