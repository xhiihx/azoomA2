// Helper to toggle views
function toggleView(idToShow) {
  const forms = ['loginForm', 'registerForm', 'resetForm', 'welcome'];
  forms.forEach(id => {
    document.getElementById(id).classList.add('hidden');
  });
  document.getElementById(idToShow).classList.remove('hidden');

  const heading = document.getElementById('formTitle'); // Make sure this ID is set in HTML
  switch (idToShow) {
    case 'loginForm':
      heading.textContent = 'Login';
      break;
    case 'registerForm':
      heading.textContent = 'Register';
      break;
    case 'resetForm':
      heading.textContent = 'Reset Password';
      break;
    case 'welcome':
      heading.textContent = 'Welcome';
      updateLoginNav();
      break;
    default:
      heading.textContent = '';
  }
}

// Simulate register
document.getElementById('registerForm').addEventListener('submit', function (e) {
  e.preventDefault();
  const email = document.getElementById('registerEmail').value;
  const password = document.getElementById('registerPassword').value;
  localStorage.setItem('userEmail', email);
  localStorage.setItem('userPassword', password);
  alert('Registration successful. You can now log in.');
  toggleView('loginForm');
});

// Simulate login
document.getElementById('loginForm').addEventListener('submit', function (e) {
  e.preventDefault();
  const email = document.getElementById('loginEmail').value;
  const password = document.getElementById('loginPassword').value;

  const savedEmail = localStorage.getItem('userEmail');
  const savedPassword = localStorage.getItem('userPassword');

  if (email === savedEmail && password === savedPassword) {
    localStorage.setItem('loginStatus', 'true');
    localStorage.setItem("user", JSON.stringify({ role: "user", email }));
    document.getElementById('userEmail').textContent = email;
    toggleView('welcome');
    console.log('creating redirect')

    let countdown = 5;
    let existingMsg = document.getElementById('redirect-msg');
    if (!existingMsg) {

      const msg = document.createElement('p');
      msg.id = 'redirect-msg';
      msg.style.color = 'white';
      msg.style.marginTop = '10px';
      msg.style.fontWeight = 'bold';
      //msg.textContent = 'Redirecting in ${countdown}...';
      document.getElementById('welcome').appendChild(msg);


      // Start interval to update countdown every second
      const interval = setInterval(() => {
        countdown--;
        if (countdown > 0) {
          msg.textContent = `Redirecting in ${countdown}...`;
        } else {
          clearInterval(interval);
          window.location.href = 'index.html'; // Change to your target page
        }

      }, 1000);

    }
  } else if (email === "admin@azoom.com" && password === "admin123") { //check if admin
    //admin login
    localStorage.setItem("loginStatus", "true");
    localStorage.setItem("user", JSON.stringify({ role: "admin", email }));
    window.location.href = "admin.html";
  } else {
    alert('Invalid email or password');
  }
});

// Simulate password reset
document.getElementById('resetForm').addEventListener('submit', function (e) {
  e.preventDefault();
  const resetEmail = document.getElementById('resetEmail').value;
  const savedEmail = localStorage.getItem('userEmail');

  if (resetEmail === savedEmail) {
    alert('Password reset link sent to your email (simulated)');
    toggleView('loginForm');
  } else {
    alert('Email not found in system.');
  }
});

// Simulate logout
function logout() {
  localStorage.removeItem('loginStatus');
  localStorage.removeItem('user');
  document.getElementById('userEmail').textContent = '';
  toggleView('loginForm');
  updateLoginNav();
}

function updateLoginNav() {
  const loginLink = document.getElementById('login-link');

  if (!loginLink) {
    return;
  }

  if (localStorage.getItem('loginStatus') === 'true') {

    const user = JSON.parse(localStorage.getItem("user"));
    const nav = document.querySelector("nav");

    //check if admin
    if (user?.role === "admin") {
      const existing = document.querySelector('nav a[href="admin.html"]');
      if (!existing) {
        const adminLink = document.createElement("a");
        adminLink.href = "admin.html";
        adminLink.textContent = "Admin Panel";
        nav.appendChild(adminLink);
      }
    }

    loginLink.textContent = 'Logout';
    loginLink.href = '#';
    loginLink.onclick = function () {
      localStorage.removeItem('loginStatus');
      window.location.href = 'index.html'; // Redirect to homepage

    };
  }
  else {
    //set everything back to default
    loginLink.textContent = 'Login';
    loginLink.href = 'login.html';
    loginLink.onclick = function () {
      localStorage.removeItem('loginStatus');
      window.location.href = 'login.html'; // Redirect to login

    };
  }
}

