document.querySelector('.registerBtn').addEventListener('click', async () => {
    const email = document.querySelector('#registerEmail').value;
    const password = document.querySelector('#registerPassword').value;
    const confirmPassword = document.querySelector('#confirmPassword').value;
    const name = document.querySelector('#registerName');

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    const passwordRegex = /^(?=.*\d)(?=.*[a-z])(?=.*[A-Z]).{8,}$/;

    if (!emailRegex.test(email)) {
        alert('Invalid email address.');
        return;
    }

    if (!passwordRegex.test(password)) {
        alert('Invalid password. Password must contain at least 8 characters, including at least one digit, one lowercase letter, and one uppercase letter.');
        return;
    }

    if (password !== confirmPassword) {
        alert('Passwords do not match.');
        return;
    }

    try {
        const response = await fetch('http://localhost:3000/users');
        let existingData = [];

        if (response.ok) {
            try {
                existingData = await response.json();
            } catch (jsonError) {
                console.error('Error parsing existing user data:', jsonError);
                return;
            }

            // Flatten the nested arrays and keep only the objects
            existingData = existingData.flat(Infinity).filter(item => typeof item === 'object');

            // Check if the email already exists
            const isEmailTaken = existingData.some(user => user.email === email);

            if (isEmailTaken) {
                alert('Email address is already taken. Please choose a different email.');
                return;
            }
        } else {
            console.error('Error fetching user data:', response.status, response.statusText);
            return;
        }

        // Generate a unique userId
        const userId = generateRandomId(10);

        const userData = {
            id: userId,
            email,
            name: name.value,
            password
        };


        await fetch('http://localhost:3000/users', {
            method: 'post',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(userData),
        });
        alert('Registration successful!');

    } catch (error) {
        console.error('Error checking or creating user data:', error);
    }
});

function generateRandomId(length) {
    const characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
    let randomId = '';

    for (let i = 0; i < length; i++) {
        const randomIndex = Math.floor(Math.random() * characters.length);
        randomId += characters.charAt(randomIndex);
    }

    return randomId;
}
