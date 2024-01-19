document.addEventListener('DOMContentLoaded', () => {
    document.querySelector('#btn_login').addEventListener('click', () => {
        const loginEmail = document.querySelector('#input_email').value;
        const loginPassword = document.querySelector('#input_password').value;

        fetch('http://localhost:3000/users')
            .then(response => response.json())
            .then(data => {
                if (Array.isArray(data)) {
                    const user = data.find(user => user.email === loginEmail && user.password === loginPassword);

                    if (user) {
                        localStorage.setItem('userId', user.id);
                        alert('Login successful!');
                        
                        // Navigate to the home page
                        window.location.href = '../index.html';
                    } else {
                        alert('Invalid login credentials.');
                    }
                } else {
                    console.error('Invalid user data format in the JSON file.');
                }
            })
            .catch(error => console.error('Error fetching user data:', error));
    });
});