let users = [];
let payments = [];
let currentEditingId = null;

//log-out button
const logout_btn = document.getElementById('logout-icon');

logout_btn.addEventListener('click', function (e) {
    e.preventDefault();
    fetch('logout.php')
        .then(response => {
            if (response.redirected) {
                // If the response is redirected, go to the redirected URL
                window.location.href = response.url;
            } else {
                throw new Error('Unexpected response format');
            }
        })
        .catch(error => {
            console.error('Error:', error);
            alert('An error occurred while logging out: ' + error.message);
        });
});


// Side menu
document.addEventListener('DOMContentLoaded', () => {
    fetchUsers(); // Load users data immediately

    const menuItems = document.querySelectorAll('.menu-item');
    const contentSections = document.querySelectorAll('.content-section');

    menuItems.forEach(item => {
        item.addEventListener('click', () => {
            const targetSection = item.getAttribute('data-section');

            menuItems.forEach(mi => mi.classList.remove('active'));
            item.classList.add('active');

            contentSections.forEach(section => {
                if (section.id === targetSection) {
                    section.classList.add('active');
                } else {
                    section.classList.remove('active');
                }
            });

            // Load data for the selected section
            if (targetSection === 'manage-users') {
                fetchUsers();
            } else if (targetSection === 'manage-payment') {
                fetchPayments();
            }
        });
    });
});

// User Payment Table
function fetchPayments() {
    fetch('get-payments.php')
        .then(response => response.text())
        .then(text => {
            // Debug: Log raw response
            console.log('Raw server response:', text);

            try {
                const data = JSON.parse(text);
                console.log('Parsed data:', data);

                // Handle different possible response formats
                if (Array.isArray(data)) {
                    payments = data;
                } else if (data && typeof data === 'object') {
                    // If data is wrapped in a success property
                    payments = Array.isArray(data.data) ? data.data :
                        Array.isArray(data.payments) ? data.payments :
                            Array.isArray(data) ? data : [];
                } else {
                    throw new Error('Invalid data structure received from server');
                }

                console.log('Processed payments array:', payments);
                populatePaymentTable(payments);
            } catch (e) {
                console.error('JSON parsing error:', e);
                throw new Error(`Failed to parse server response: ${e.message}`);
            }
        })
        .catch(error => {
            console.error('Error in fetchPayments:', error);
            document.querySelector('#paymentTable tbody').innerHTML = `
                <tr>
                    <td colspan="6" class="text-center text-red-500">
                        Error loading payments: ${error.message}<br>
                        Please check the console for more details.
                    </td>
                </tr>`;
        });
}

function populatePaymentTable(paymentsToDisplay) {
    const tableBody = document.querySelector('#paymentTable tbody');
    tableBody.innerHTML = '';

    // Debug: Log the payments being displayed
    console.log('Populating table with payments:', paymentsToDisplay);

    if (!Array.isArray(paymentsToDisplay) || paymentsToDisplay.length === 0) {
        tableBody.innerHTML = `
            <tr>
                <td colspan="6" class="text-center">
                    No payment records found
                </td>
            </tr>`;
        return;
    }

    paymentsToDisplay.forEach((payment, index) => {
        // Debug: Log each payment object
        console.log(`Processing payment ${index}:`, payment);

        const row = document.createElement('tr');
        row.id = `paymentRow-${payment.payment_id || payment.id}`;

        // Safely access nested properties
        const userData = {
            firstName: payment.user_firstname || payment.firstname || '',
            lastName: payment.user_lastname || payment.lastname || '',
            bankName: payment.user_payment_bankname || payment.bankname || '',
            cardNumber: payment.user_payment_cardnumber || payment.cardnumber || '',
            balance: payment.user_payment_balance || payment.balance || '0.00'
        };

        row.innerHTML = `
            <td>${index + 1}</td>
            <td>${userData.firstName} ${userData.lastName}</td>
            <td>${userData.bankName}</td>
            <td>${maskCardNumber(userData.cardNumber)}</td>
            <td>$${formatBalance(userData.balance)}</td>
            <td>
                <div class="action-buttons">
                    <button class="btn btn-edit" onclick="editPayment('${payment.payment_id || payment.id}')">Edit</button>
                    <button class="btn btn-delete" onclick="deletePayment('${payment.payment_id || payment.id}')">Delete</button>
                </div>
            </td>
        `;
        tableBody.appendChild(row);
    });
}

function maskCardNumber(cardNumber) {
    if (!cardNumber) return 'N/A';
    const last4 = String(cardNumber).slice(-4);
    return `**** **** **** ${last4}`;
}

function formatBalance(balance) {
    if (!balance) return '0.00';
    return parseFloat(balance).toFixed(2);
}

document.addEventListener('DOMContentLoaded', () => {
    fetchUsers();
    fetchPayments();

    const menuItems = document.querySelectorAll('.menu-item');
    const contentSections = document.querySelectorAll('.content-section');

    menuItems.forEach(item => {
        item.addEventListener('click', () => {
            const targetSection = item.getAttribute('data-section');

            menuItems.forEach(mi => mi.classList.remove('active'));
            item.classList.add('active');

            contentSections.forEach(section => {
                if (section.id === targetSection) {
                    section.style.display = 'block';
                } else {
                    section.style.display = 'none';
                }
            });
        });
    });
});

document.addEventListener('DOMContentLoaded', () => {
    const searchInput = document.querySelector('#manage-payment .search-bar input');
    if (searchInput) {
        searchInput.addEventListener('input', function (e) {
            const searchTerm = e.target.value.toLowerCase();
            const filteredPayments = payments.filter(payment =>
                `${payment.user_firstname || ''} ${payment.user_lastname || ''}`.toLowerCase().includes(searchTerm) ||
                (payment.user_payment_bankname || '').toLowerCase().includes(searchTerm) ||
                (payment.user_payment_cardnumber || '').includes(searchTerm)
            );
            populatePaymentTable(filteredPayments);
        });
    }
});

function editPayment(paymentId, userId) {
    if (currentEditingId) {
        cancelEdit(currentEditingId);
    }

    currentEditingId = paymentId;
    const payment = payments.find(p => p.payment_id === paymentId);
    if (!payment) {
        console.error('Payment not found for payment_id:', paymentId);
        return;
    }

    const editForm = document.createElement('tr');
    editForm.id = `editForm-${paymentId}`;
    editForm.innerHTML = `
        <td colspan="6">
            <form id="editPaymentForm-${paymentId}" class="edit-payment-form">
                <input type="hidden" name="payment_id" value="${paymentId}">
                <input type="hidden" name="user_id" value="${userId}">
                <div class="form-group">
                    <label for="user_payment_bankname">Bank Name:</label>
                    <input type="text" id="user_payment_bankname" name="user_payment_bankname" 
                           value="${payment.user_payment_bankname || ''}" required>
                </div>
                <div class="form-group">
                    <label for="user_payment_cardnumber">Card Number:</label>
                    <input type="text" id="user_payment_cardnumber" name="user_payment_cardnumber" 
                           value="${payment.user_payment_cardnumber || ''}" 
                           pattern="[0-9]{16}" maxlength="16" required>
                </div>
                <div class="form-group">
                    <label for="user_payment_balance">Balance:</label>
                    <input type="number" id="user_payment_balance" name="user_payment_balance" 
                           value="${payment.user_payment_balance || ''}" 
                           step="0.01" min="0" required>
                </div>
                <div class="button-group">
                    <button type="submit" class="btn btn-submit">Save Changes</button>
                    <button type="button" class="btn btn-cancel" onclick="cancelEdit('${paymentId}')">Cancel</button>
                </div>
            </form>
        </td>
    `;

    const paymentRow = document.getElementById(`paymentRow-${paymentId}`);
    paymentRow.style.display = 'none';
    paymentRow.insertAdjacentElement('afterend', editForm);

    // Form submission handler
    document.getElementById(`editPaymentForm-${paymentId}`).addEventListener('submit', function (e) {
        e.preventDefault();
        const formData = new FormData(e.target);

        fetch('update-payment.php', {
            method: 'POST',
            body: formData
        })
            .then(response => response.json())
            .then(data => {
                if (data.success) {
                    fetchPayments();
                    cancelEdit(paymentId);
                } else {
                    throw new Error(data.error || 'Unknown error occurred');
                }
            })
            .catch(error => {
                console.error('Error updating payment:', error);
                alert('Failed to update payment: ' + error.message);
            });
    });
}

function cancelEdit(id) {
    const editForm = document.getElementById(`editForm-${id}`);
    if (editForm) {
        editForm.remove();
    }
    const paymentRow = document.getElementById(`paymentRow-${id}`);
    if (paymentRow) {
        paymentRow.style.display = '';
    }
    currentEditingId = null;
}

function deletePayment(paymentId) {
    if (!confirm('Are you sure you want to delete this payment record?')) {
        return;
    }

    const formData = new FormData();
    formData.append('payment_id', paymentId);

    fetch('delete-payment.php', {
        method: 'POST',
        body: formData
    })
        .then(response => response.json())
        .then(data => {
            if (data.success) {
                fetchPayments();
            } else {
                throw new Error(data.error || 'Failed to delete payment');
            }
        })
        .catch(error => {
            console.error('Error deleting payment:', error);
            alert('Failed to delete payment: ' + error.message);
        });
}

// User Management Table
function fetchUsers() {
    fetch('get-users.php')
        .then(response => {
            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }
            return response.json();
        })
        .then(data => {
            users = data;
            populateUserTable(users);
        })
        .catch(error => {
            console.error('Error fetching users:', error);
            document.querySelector('#userTable tbody').innerHTML = `<tr><td colspan="5">Error loading users: ${error.message}</td></tr>`;
        });
}
document.addEventListener('DOMContentLoaded', fetchUsers);

function populateUserTable(usersToDisplay) {
    const tableBody = document.querySelector('#userTable tbody');
    tableBody.innerHTML = '';

    usersToDisplay.forEach((user, index) => {
        const row = document.createElement('tr');
        row.id = `userRow-${user.id}`;
        row.innerHTML = `
            <td>${index + 1}</td>
            <td>
                <div class="user-info">
                    <img src="${user.user_profile_pic || 'path/to/default/avatar.png'}" alt="${user.user_firstname} ${user.user_lastname}" style="width: 30px; height: 30px; border-radius: 50%; margin-right: 10px;">
                    ${user.user_firstname} ${user.user_lastname}
                </div>
            </td>
            <td class="user_account_table_email">${user.user_email}</td>
            <td class="user_account_table_status">${user.user_verification_code ? 'Verified' : 'Unverified'}</td>
            <td>
                <div class="action-buttons">
                    <button class="btn btn-edit" onclick="editUser('${user.id}')">Edit</button>
                    <button class="btn btn-delete" onclick="deleteUser('${user.id}')">Delete</button>
                </div>
            </td>
        `;
        tableBody.appendChild(row);
    });
}

function editUser(id) {
    if (currentEditingId) {
        cancelEdit(currentEditingId);
    }

    currentEditingId = id;
    const user = users.find(u => u.id === id);
    if (!user) {
        console.error('User not found for ID:', id);
        return;
    }

    const editForm = document.createElement('tr');
    editForm.id = `editForm-${id}`;
    editForm.innerHTML = `
        <td colspan="5">
            <form id="editUserForm-${id}">
                <input type="hidden" name="user_id" value="${user.user_id}">
                <div class="form-group">
                    <label for="user_firstname">First Name:</label>
                    <input type="text" id="user_firstname" name="user_firstname" value="${user.user_firstname || ''}" required>
                </div>
                <div class="form-group">
                    <label for="user_lastname">Last Name:</label>
                    <input type="text" id="user_lastname" name="user_lastname" value="${user.user_lastname || ''}" required>
                </div>
                <div class="form-group">
                    <label for="user_phone">Username:</label>
                    <input type="tel" id="user_phone" name="user_phone" value="${user.user_username || ''}" required>
                </div>
                <div class="form-group">
                    <label for="user_email">Email:</label>
                    <input type="email" id="user_email" name="user_email" value="${user.user_email}" required>
                </div>
                <div class="form-group">
                    <label for="user_password">Password:</label>
                    <input type="password" id="user_password" name="user_password" placeholder="Enter new password">
                </div>
                <div class="form-group">
                    <label for="user_address">Address:</label>
                    <input type="text" id="user_address" name="user_address" value="${user.user_address || ''}">
                </div>
                <div class="form-group">
                    <label for="user_birthday">Birthday:</label>
                    <input type="date" id="user_birthday" name="user_birthday" value="${user.user_birthday || ''}">
                </div>
                <div class="form-group">
                    <label for="user_gender">Gender:</label>
                    <select id="user_gender" name="user_gender">
                        <option value="male" ${user.user_gender === 'male' ? 'selected' : ''}>Male</option>
                        <option value="female" ${user.user_gender === 'female' ? 'selected' : ''}>Female</option>
                        <option value="other" ${user.user_gender === 'other' ? 'selected' : ''}>Other</option>
                    </select>
                </div>
                <button type="submit" class="btn btn-submit">Submit</button>
                <button type="button" class="btn btn-cancel" onclick="cancelEdit('${id}')">Cancel</button>
            </form>
        </td>
    `;

    const userRow = document.getElementById(`userRow-${id}`);
    userRow.style.display = 'none';
    userRow.insertAdjacentElement('afterend', editForm);

    document.getElementById(`editUserForm-${id}`).addEventListener('submit', function (e) {
        e.preventDefault();
        const formData = new FormData(e.target);

        fetch('update-user.php', {
            method: 'POST',
            body: formData
        })
            .then(response => response.json())
            .then(data => {
                if (data.success) {
                    fetchUsers();
                } else {
                    alert('Error updating user: ' + (data.error || 'Unknown error'));
                }
            })
            .catch(error => {
                console.error('Error:', error);
                alert('An error occurred while updating the user.');
            });
    });
}

function cancelEdit(id) {
    const editForm = document.getElementById(`editForm-${id}`);
    if (editForm) {
        editForm.remove();
    }
    const userRow = document.getElementById(`userRow-${id}`);
    if (userRow) {
        userRow.style.display = '';
    }
    currentEditingId = null;
}

function deleteUser(id) {
    if (confirm('Are you sure you want to delete this user?')) {
        const formData = new FormData();
        formData.append('id', id);

        fetch('delete-user.php', {
            method: 'POST',
            body: formData
        })
            .then(response => response.json())
            .then(data => {
                if (data.success) {
                    fetchUsers();
                } else {
                    alert('Error deleting user: ' + (data.error || 'Unknown error'));
                }
            })
            .catch(error => {
                console.error('Error:', error);
                alert('An error occurred while deleting the user.');
            });
    }
}

document.querySelector('.search-bar input').addEventListener('input', function (e) {
    const searchTerm = e.target.value.toLowerCase();
    const filteredUsers = users.filter(user =>
        `${user.user_firstname} ${user.user_lastname}`.toLowerCase().includes(searchTerm) ||
        user.user_email.toLowerCase().includes(searchTerm)
    );
    populateUserTable(filteredUsers);
});