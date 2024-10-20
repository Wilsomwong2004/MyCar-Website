let users = [];

function fetchUsers() {
    fetch('get-users.php')
        .then(response => response.json())
        .then(data => {
            users = data;
            populateUserTable();
        })
        .catch(error => console.error('Error fetching users:', error));
}

document.addEventListener('DOMContentLoaded', fetchUsers);

function populateUserTable() {
    const tableBody = document.querySelector('#userTable tbody');
    tableBody.innerHTML = '';

    users.forEach((user, index) => {
        const row = document.createElement('tr');
        row.innerHTML = `
            <td>${index + 1}</td>
            <td>
                <img src="/api/placeholder/30/30" alt="${user.user_firstname} ${user.user_lastname}" style="width: 30px; height: 30px; border-radius: 50%; margin-right: 10px;">
                ${user.user_firstname} ${user.user_lastname}
            </td>
            <td>${user.user_email}</td>
            <td>${user.user_verification_code ? 'Verified' : 'Unverified'}</td>
            <td>
                <div class="action-buttons">
                    <button class="btn btn-edit" onclick="editUser(${user.id})">Edit</button>
                    <button class="btn btn-delete" onclick="deleteUser(${user.id})">Delete</button>
                </div>
            </td>
        `;
        tableBody.appendChild(row);
    });
}

function editUser(userId) {
    console.log(`Editing user with ID: ${userId}`);
    // Implement edit functionality
}

function deleteUser(userId) {
    console.log(`Deleting user with ID: ${userId}`);
    // Implement delete functionality
}

// Search functionality
document.querySelector('.search-bar input').addEventListener('input', function (e) {
    const searchTerm = e.target.value.toLowerCase();
    const filteredUsers = users.filter(user =>
        `${user.user_firstname} ${user.user_lastname}`.toLowerCase().includes(searchTerm) ||
        user.user_email.toLowerCase().includes(searchTerm)
    );
    populateUserTable(filteredUsers);
});