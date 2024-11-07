
document.addEventListener('DOMContentLoaded', function() {
    // Elements
    const container = document.getElementById('container');
    const toggleBtn = document.getElementById('toggleBtn');
    const welcomeText = document.getElementById('welcomeText');
    const toggleText = document.getElementById('toggleText');
    
    // Toggle between login and register forms
    function switchToLogin() {
        container.classList.remove('active');
        welcomeText.textContent = 'Welcome to Login';
        toggleText.textContent = "Don't have an account?";
        toggleBtn.textContent = 'Sign Up';
    }

    function switchToRegister() {
        container.classList.add('active');
        welcomeText.textContent = 'Welcome to Register';
        toggleText.textContent = 'Already have an account?';
        toggleBtn.textContent = 'Sign In';
    }

    // Toggle button click handler
    if (toggleBtn) {
        toggleBtn.addEventListener('click', function() {
            if (container.classList.contains('active')) {
                switchToLogin();
            } else {
                switchToRegister();
            }
        });
    }

    // Register new user
    const registerBtn = document.querySelector('.register-btn');
    if (registerBtn) {
        registerBtn.addEventListener('click', function() {
            const name = document.getElementById('reg-name').value;
            const surname = document.getElementById('reg-surname').value;
            const username = document.getElementById('reg-username').value;
            const password = document.getElementById('reg-password').value;
            const confirmPassword = document.getElementById('reg-confirm-password').value;

            if (!name || !surname || !username || !password || !confirmPassword) {
                alert("Please fill in all fields!");
                return;
            }

            if (password !== confirmPassword) {
                alert("Passwords do not match!");
                return;
            }

            if (localStorage.getItem(username)) {
                alert("Username already exists! Please choose another one.");
                return;
            }

            const user = {
                name,
                surname,
                username,
                password,
                registrationDate: new Date().toISOString()
            };

            localStorage.setItem(username, JSON.stringify(user));
            
            alert(`Registration successful!\n\nWelcome ${name} ${surname}!`);

            // Clear form fields
            document.getElementById('reg-name').value = '';
            document.getElementById('reg-surname').value = '';
            document.getElementById('reg-username').value = '';
            document.getElementById('reg-password').value = '';
            document.getElementById('reg-confirm-password').value = '';

            setTimeout(() => {
                switchToLogin();
            }, 1500);
        });
    }

    // Login user
    const loginBtn = document.querySelector('.btn:not(.register-btn)');
    if (loginBtn) {
        loginBtn.addEventListener('click', function() {
            const username = document.getElementById('username').value;
            const password = document.getElementById('password').value;
            const rememberMe = document.getElementById('remember').checked;

            if (!username || !password) {
                alert("Please fill in all fields!");
                return;
            }

            const userData = localStorage.getItem(username);
            if (!userData) {
                alert("Username not found!");
                return;
            }

            const user = JSON.parse(userData);

            if (user.password === password) {
                // Generate password key if it doesn't exist
                if (!user.passwordKey) {
                    user.passwordKey = Math.random().toString(36).substring(2, 10).toUpperCase();
                    localStorage.setItem(username, JSON.stringify(user));
                    alert(`Your Password Key is: ${user.passwordKey}\nPlease remember this key for  access Mainpage.`);
                }

                // Store user data
                if (rememberMe) {
                    localStorage.setItem('rememberedUser', username);
                    localStorage.setItem('currentUser', JSON.stringify(user));
                } else {
                    localStorage.removeItem('rememberedUser');
                    localStorage.setItem('currentUser', JSON.stringify(user));
                }

                // Clear form fields
                document.getElementById('username').value = '';
                document.getElementById('password').value = '';
                document.getElementById('remember').checked = false;

                window.location.href = 'password.html';
            } else {
                alert("Invalid password!");
            }
        });
    }

    // Forgot Password Link
    const forgotPasswordLink = document.querySelector('.forgot-password');
    if (forgotPasswordLink) {
        forgotPasswordLink.addEventListener('click', function(e) {
            e.preventDefault();
            const username = document.getElementById('username').value;
            
            if (!username) {
                alert("Please enter your username first!");
                return;
            }

            const userData = localStorage.getItem(username);
            if (!userData) {
                alert("Username not found!");
                return;
            }

            const user = JSON.parse(userData);
            if (user.passwordKey) {
                alert(`Your password key is: ${user.passwordKey}\nPlease keep this key safe for access to the main page.`);
            } else {
                alert("Password key not set. Please log in to generate a new password key.");
            }
        });
    }

    // Check for remembered user on page load
    const rememberedUser = localStorage.getItem('rememberedUser');
    if (rememberedUser) {
        const usernameInput = document.getElementById('username');
        const rememberCheckbox = document.getElementById('remember');
        if (usernameInput && rememberCheckbox) {
            usernameInput.value = rememberedUser;
            rememberCheckbox.checked = true;
        }
    }

    // Password verification page
    const submitBtn = document.getElementById('submitBtn');
    const passwordInput = document.getElementById('passwordInput');
    const errorMessage = document.getElementById('errorMessage');

    if (submitBtn && passwordInput && errorMessage) {
        submitBtn.addEventListener('click', () => {
            const enteredKey = passwordInput.value.trim();
            const currentUser = JSON.parse(localStorage.getItem('currentUser'));

            if (!currentUser) {
                alert('No user session found. Please login again.');
                window.location.href = 'login.html';
                return;
            }

            if (enteredKey === currentUser.passwordKey) {
                alert('Password key verified successfully!');
                window.location.href = 'mainpage.html';
            } else {
                errorMessage.style.display = 'block';
                passwordInput.value = '';
                setTimeout(() => {
                    errorMessage.style.display = 'none';
                }, 3000);
            }
        });
    }

    // Check authentication when page loads on main page
    function checkAuth() {
        const currentUser = localStorage.getItem('currentUser');
        if (!currentUser && window.location.pathname.includes('mainpage.html')) {
            window.location.href = 'login.html';
        }
    }

    // Logout function
    function logout() {
        localStorage.removeItem('rememberedUser');
        localStorage.removeItem('currentUser');
        window.location.href = 'login.html';
    }

    // Attach logout function to logout button if it exists
    const logoutBtn = document.querySelector('.logout-btn');
    if (logoutBtn) {
        logoutBtn.addEventListener('click', logout);
    }

    // Initialize authentication check
    checkAuth();

    // Handle Enter key press for password input
    if (passwordInput) {
        passwordInput.addEventListener('keypress', (e) => {
            if (e.key === 'Enter') {
                submitBtn.click();
            }
        });
    }
});