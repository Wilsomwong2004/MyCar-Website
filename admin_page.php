<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>MyCar - Administrator</title>
    <link rel="stylesheet" href="./assets/css/admin_page.css">
    <link href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/5.15.3/css/all.min.css" rel="stylesheet">
</head>
<body>
    <nav class="navbar">
        <div class="logo">
            <img id="logo-image" src="assets/css/pic/mycarlogo1.png" alt="MyCar Logo">
            <p class="navbar-title">Admin Page</p>
        </div>
        <div class="button">
            <i id="logout-icon" class="fas fa-sign-out-alt"></i>
        </div>
    </nav>
    <div class="container">
        <aside class="sidebar">
            <h2 class="sidebar-title">Menu</h2>
            <nav>
                <div class="menu-item active" data-section="manage-users"><i class="fas fa-users"></i> Manage Users</div>
                <div class="menu-item" data-section="manage-payment"><i class="far fa-credit-card"></i> Manage Payment</div>
            </nav>
        </aside>
        <main class="main-content">
            <section id="manage-users" class="content-section active">
                <h2 class="section-title">Manage Users</h2>
                <div class="search-bar">
                    <input type="text" placeholder="Search User">
                </div>
                <div class="table-container">
                    <table id="userTable">
                        <thead>
                            <tr>
                                <th>No</th>
                                <th>Profile</th>
                                <th>Email</th>
                                <th>Status</th>
                                <th>Actions</th>
                            </tr>
                        </thead>
                        <tbody>
                            <!-- Table rows will be dynamically populated here -->
                        </tbody>
                    </table>
                </div>
            </section>
            <section id="manage-payment" class="content-section">
                <h2 class="section-title">Manage Payment</h2>
                <div class="search-bar">
                    <input type="text" placeholder="Search Payment">
                </div>
                <div class="table-container">
                    <table id="paymentTable">
                        <thead>
                            <tr>
                                <th>No</th>
                                <th>User</th>
                                <th>Bank Name</th>
                                <th>Card Number</th>
                                <th>Balance</th>
                                <th>Actions</th>
                            </tr>
                        </thead>
                        <tbody>
                            <!-- Table rows will be dynamically populated here -->
                        </tbody>
                    </table>
                </div>
            </section>
        </main>
    </div>
    <script src="./assets/javascript/admin_page.js"></script>
</body>
</html>