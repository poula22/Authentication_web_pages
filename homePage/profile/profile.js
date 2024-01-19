async function getUserProfile(userId) {
    try {
        const response = await fetch(`http://localhost:3000/users/${userId}`);
        if (response.ok) {
            const userData = await response.json();
            return userData;
        } else {
            console.error('Error fetching user profile:', response.status, response.statusText);
            return null;
        }
    } catch (error) {
        console.error('Error fetching user profile:', error);
        return null;
    }
}

function displayUserProfile(user) {
    const profileContent = document.getElementById('profile-content');

    if (user) {
        const userProfileHTML = `
            <p><strong>Name:</strong> ${user.name}</p>
            <p><strong>Email:</strong> ${user.email}</p>
        `;

        profileContent.innerHTML = userProfileHTML;
    } else {
        profileContent.innerHTML = '<p>User profile not found.</p>';
    }
}

const storedUserId = localStorage.getItem('userId');

if (storedUserId) {
    getUserProfile(storedUserId)
        .then(user => {
            displayUserProfile(user);
        })
        .catch(error => {
            console.error('Error fetching user profile:', error);
            displayUserProfile(null); 
        });
} else {
    console.error('User ID not found in local storage.');
    displayUserProfile(null); 
}