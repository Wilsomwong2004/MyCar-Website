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
        .then(response => {
            if (!response.ok) {
                return response.text().then(text => {
                    console.log('Raw server response:', text);
                    throw new Error(`HTTP error! status: ${response.status}`);
                });
            }
            return response.json();
        })
        .then(data => {
            if (data.error) {
                throw new Error(data.error);
            }
            payments = data;
            populatePaymentTable(payments);
        })
        .catch(error => {
            console.error('Error fetching payments:', error);
            document.querySelector('#paymentTable tbody').innerHTML = `<tr><td colspan="5">Error loading payments: ${error.message}</td></tr>`;
        });
}

function populatePaymentTable(paymentsToDisplay) {
    const tableBody = document.querySelector('#paymentTable tbody');
    tableBody.innerHTML = '';

    paymentsToDisplay.forEach((payment, index) => {
        const row = document.createElement('tr');
        row.innerHTML = `
            <td>${index + 1}</td>
            <td>${payment.user_firstname} ${payment.user_lastname}</td>
            <td>${payment.user_payment_bankname}</td>
            <td>${payment.user_payment_cardnumber}</td>
            <td>$${payment.user_payment_balance}</td>
            <td>
                <div class="action-buttons">
                    <button class="btn btn-edit" onclick="editPayment('${id}')">Edit</button>
                    <button class="btn btn-delete" onclick="deletePayment('${id}')">Delete</button>
                </div>
            </td>
        `;
        tableBody.appendChild(row);
    });
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

document.querySelector('#manage-payment .search-bar input').addEventListener('input', function (e) {
    const searchTerm = e.target.value.toLowerCase();
    const filteredPayments = payments.filter(payment =>
        `${payment.user_firstname} ${payment.user_lastname}`.toLowerCase().includes(searchTerm) ||
        payment.amount.toString().includes(searchTerm) ||
        payment.payment_date.toLowerCase().includes(searchTerm) ||
        payment.status.toLowerCase().includes(searchTerm)
    );
    populatePaymentTable(filteredPayments);
});

function editPayment(id) {
    if (currentEditingId) {
        cancelEdit(currentEditingId);
    }

    currentEditingId = id;
    const payment = payments.find(p => p.id === id);
    if (!payment) {
        console.error('Payment not found for ID:', id);
        return;
    }

    const editForm = document.createElement('tr');
    editForm.id = `editForm-${id}`;
    editForm.innerHTML = `
        <td colspan="5">
            <form id="editPaymentForm-${id}">
                <input type="hidden" name="payment_id" value="${payment.id}">
                <div class="form-group">
                    <label for="user_firstname">First Name:</label>
                    <input type="text" id="user_firstname" name="user_firstname" value="${payment.user_firstname || ''}" required>
                </div>
                <div class="form-group">
                    <label for="user_lastname">Last Name:</label>
                    <input type="text" id="user_lastname" name="user_lastname" value="${payment.user_lastname || ''}" required>
                </div>
                <div class="form-group">
                    <label for="user_payment_bankname">Bank Name:</label>
                    <input type="text" id="user_payment_bankname" name="user_payment_bankname" value="${payment.user_payment_bankname || ''}" required>
                </div>
                <div class="form-group">
                    <label for="user_payment_cardnumber">Card Number:</label>
                    <input type="text" id="user_payment_cardnumber" name="user_payment_cardnumber" value="${payment.user_payment_cardnumber || ''}" required>
                </div>
                <div class="form-group">
                    <label for="user_payment_balance">Balance:</label>
                    <input type="text" id="user_payment_balance" name="user_payment_balance" value="${payment.user_payment_balance || ''}" required>
                </div>
                <div class="form-group">
                    <label for="payment_date">Payment Date:</label>
                    <input type="date" id="payment_date" name="payment_date" value="${payment.payment_date || ''}" required>
                </div>
                <div class="form-group">
                    <label for="status">Status:</label>
                    <select id="status" name="status">
                        <option value="paid" ${payment.status === 'paid' ? 'selected' : ''}>Paid</option>
                        <option value="unpaid" ${payment.status === 'unpaid' ? 'selected' : ''}>Unpaid</option>
                    </select>
                </div>
                <button type="submit" class="btn btn-submit">Submit</button>
                <button type="button" class="btn btn-cancel" onclick="cancelEdit('${id}')">Cancel</button>
            </form>
        </td>
    `;

    const paymentRow = document.getElementById(`paymentRow-${id}`);
    paymentRow.style.display = 'none';
    paymentRow.insertAdjacentElement('afterend', editForm);

    document.getElementById(`editPaymentForm-${id}`).addEventListener('submit', function (e) {
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
                } else {
                    alert('Error updating payment: ' + (data.error || 'Unknown error'));
                }
            })
            .catch(error => {
                console.error('Error:', error);
                alert('An error occurred while updating the payment.');
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

function deletePayment(id) {
    if (confirm('Are you sure you want to delete this payment?')) {
        const formData = new FormData();
        formData.append('id', id);

        fetch('delete-payment.php', {
            method: 'POST',
            body: formData
        })
            .then(response => response.json())
            .then(data => {
                if (data.success) {
                    fetchPayments();
                } else {
                    alert('Error deleting payment: ' + (data.error || 'Unknown error'));
                }
            })
            .catch(error => {
                console.error('Error:', error);
                alert('An error occurred while deleting the payment.');
            });
    }
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