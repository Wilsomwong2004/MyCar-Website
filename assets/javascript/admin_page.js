let users = [];
let currentEditingId = null;

function fetchUsers() {
    fetch('get-users.php')
        .then(response => response.json())
        .then(data => {
            users = data;
            populateUserTable(users);
        })
        .catch(error => console.error('Error fetching users:', error));
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
                <img src="path/to/default/avatar.png" alt="${user.user_firstname} ${user.user_lastname}" style="width: 30px; height: 30px; border-radius: 50%; margin-right: 10px;">
                ${user.user_firstname} ${user.user_lastname}
            </td>
            <td>${user.user_email}</td>
            <td>${user.user_verification_code ? 'Verified' : 'Unverified'}</td>
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
                <input type="hidden" name="id" value="${user.id}">
                <div class="form-group">
                    <label for="username">Username:</label>
                    <input type="text" id="username" name="username" value="${user.user_username || ''}" required>
                </div>
                <div class="form-group">
                    <label for="user_email">Email:</label>
                    <input type="email" id="user_email" name="user_email" value="${user.user_email}" required>
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