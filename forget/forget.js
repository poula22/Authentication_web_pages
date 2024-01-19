document.addEventListener('DOMContentLoaded', () => {
    const forgotPasswordForm = document.getElementById('forgotPasswordForm');
    const resetPasswordForm = document.getElementById('resetPasswordForm');
    const passwordSection = document.getElementById('passwordSection');

    forgotPasswordForm.addEventListener('submit', async (event) => {
        event.preventDefault();

        const email = document.getElementById('email').value;

        const userExists = await checkUserExists(email);

        if (userExists) {
            passwordSection.style.display = 'block';
        } else {
            alert('Invalid email. Please enter a registered email address.');
        }
    });

    resetPasswordForm.addEventListener('submit', async (event) => {
        event.preventDefault();

        const newPassword = document.getElementById('newPassword').value;
        const confirmPassword = document.getElementById('confirmPassword').value;

        const strongPasswordRegex = /^(?=.*\d)(?=.*[a-z])(?=.*[A-Z]).{8,}$/;
        if (strongPasswordRegex.test(newPassword)) {
            if (newPassword === confirmPassword) {
                const email = document.getElementById('email').value;
                const success = await updatePassword(email, newPassword);
                const user = await getUserByEmail(email);

                if (user) {
                    const userId = user.id;
                    if (success) {
                        localStorage.setItem('userId', userId);
                        window.location.href = '../index.html';  
                    } else {
                        alert('Failed to update password. Please try again.');
                    }
                } else {
                    alert('User not found for the given email.');
                }
            } else {
                alert('Passwords do not match. Please try again.');
            }
        } else {
            alert('Password must be at least 8 characters long and include at least one uppercase letter, one lowercase letter, one number, and one special character.');
        }
    });

    async function getUserByEmail(email) {
        try {
            const response = await fetch(`http://localhost:3000/users?email=${email}`);
            if (response.ok) {
                const data = await response.json();
                return Array.isArray(data) && data.length > 0 ? data[0] : null;
            } else {
                console.error('Error fetching user by email:', response.status, response.statusText);
                return null;
            }
        } catch (error) {
            console.error('Error fetching user by email:', error);
            return null;
        }
    }

    async function checkUserExists(email) {
        try {
            const response = await fetch(`http://localhost:3000/users?email=${email}`);
            if (response.ok) {
                const data = await response.json();
                return Array.isArray(data) && data.length > 0;
            } else {
                console.error('Error checking user existence:', response.status, response.statusText);
                return false;
            }
        } catch (error) {
            console.error('Error checking user existence:', error);
            return false;
        }
    }

    async function updatePassword(email, newPassword) {
        try {
            const response = await fetch(`http://localhost:3000/users?email=${email}`);
            if (!response.ok) {
                console.error('Error fetching user by email:', response.status, response.statusText);
                return false;
            }

            const userData = await response.json();

            if (Array.isArray(userData) && userData.length > 0) {
                const userId = userData[0].id;

                const updateResponse = await fetch(`http://localhost:3000/users/${userId}`, {
                    method: 'PATCH',
                    headers: {
                        'Content-Type': 'application/json',
                    },
                    body: JSON.stringify({ password: newPassword }),
                });

                return updateResponse.ok;
            } else {
                console.error('User not found for email:', email);
                return false;
            }
        } catch (error) {
            console.error('Error updating password:', error);
            return false;
        }
    }
});
