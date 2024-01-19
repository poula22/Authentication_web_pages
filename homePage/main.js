var flag = 0;
menuIcon.onclick = () => {
    if (flag == 0) {
        menu.style.display = "block";
        flag = 1;
    } else {
        menu.style.display = "none";
        flag = 0;
    }
};
function clr() {
    document.getElementById("subject").value = "";
}

document.addEventListener('DOMContentLoaded', () => {
    // your existing code

    const userId = localStorage.getItem('userId');
    const signupBtn = document.getElementById('signupBtn');
    const signinBtn = document.getElementById('signinBtn');
    const logoutBtn = document.getElementById('logoutBtn');
    const welcomeMessage = document.getElementById('welcomeMessage');
    const profileLink =document.querySelectorAll('.profileLink')
    if (userId) {
        signupBtn.style.display = 'none';
        signinBtn.style.display = 'none';
        logoutBtn.style.display = 'block';
        // Fetch user data using userId (assuming you have a route like '/users/:id' for user details)
        fetch(`http://localhost:3000/users/${userId}`)
            .then(response => response.json())
            .then(user => {
                if (user && user.name) {
                    welcomeMessage.textContent = `Welcome, ${user.name}!`;
                }
            })
            .catch(error => console.error('Error fetching user data:', error));
    } else {
        // Clear the welcome message if there's no user logged in
        welcomeMessage.textContent = '';

        signupBtn.style.display = 'block';
        signinBtn.style.display = 'block';
        logoutBtn.style.display = 'none';
    }

    logoutBtn.onclick = () => {
        localStorage.removeItem('userId');

        signupBtn.style.display = 'block';
        signinBtn.style.display = 'block';
        logoutBtn.style.display = 'none';
        welcomeMessage.textContent = 'Welcome,'; 
    };
});