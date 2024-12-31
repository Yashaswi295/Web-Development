let isLogin = true; // Track if the user is in login or register mode

// Toggle between Login and Register forms
function toggleForm() {
    isLogin = !isLogin;
    document.getElementById('errorMessage').textContent = ''; // Clear any error messages
    
    if (isLogin) {
        document.getElementById('formTitle').textContent = 'Login';
        document.getElementById('loginForm').style.display = 'block';
        document.getElementById('registerForm').style.display = 'none';
        document.querySelector('.toggle').textContent = "Don't have an account? Register";
    } else {
        document.getElementById('formTitle').textContent = 'Register';
        document.getElementById('loginForm').style.display = 'none';
        document.getElementById('registerForm').style.display = 'block';
        document.querySelector('.toggle').textContent = "Already have an account? Login";
    }
}

// Handle User Registration
function register() {
    const username = document.getElementById('registerUsername').value;
    const email = document.getElementById('registerEmail').value;
    const password = document.getElementById('registerPassword').value;
    const errorMessage = document.getElementById('errorMessage');

    // Validate inputs
    if (!username || !email || !password) {
        errorMessage.textContent = 'All fields are required!';
        return;
    }

    // Check if user already exists in localStorage
    const existingUser = localStorage.getItem(username);
    if (existingUser) {
        errorMessage.textContent = 'Username already exists!';
        return;
    }

    // Log data for debugging
    console.log("Registering user:", { username, email, password });

    // Save the new user in localStorage
    const newUser = { email, password };
    localStorage.setItem(username, JSON.stringify(newUser));

    alert('Registration successful! You can now log in.');
    toggleForm(); // Switch back to login form
}

// Handle User Login
function login() {
    const username = document.getElementById('loginUsername').value;
    const password = document.getElementById('loginPassword').value;
    const errorMessage = document.getElementById('errorMessage');

    // Validate inputs
    if (!username || !password) {
        errorMessage.textContent = 'Please enter both username and password!';
        return;
    }

    // Check if user exists in localStorage
    const storedUser = localStorage.getItem(username);
    if (!storedUser) {
        errorMessage.textContent = 'User not found! Please register.';
        return;
    }

    // Parse the stored user data and check password
    const userData = JSON.parse(storedUser);
    if (userData.password === password) {
        // Log in the user and store session state in localStorage
        localStorage.setItem('isLoggedIn', username);
        window.location.href = 'index.html'; // Redirect to dashboard
    } else {
        errorMessage.textContent = 'Incorrect password!';
    }
}
