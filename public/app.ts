document.addEventListener('DOMContentLoaded', () => {
    const app = document.getElementById('app');

    if (!app) {
        console.error('App element not found');
        return;
    }

    // Define the User interface
    interface User {
        userId: string;
        username: string;
    }

    // Example: Fetch and display user data
    fetch('/api/users', {
        headers: {
            'Authorization': 'Bearer your-username-here' // Replace with actual token (username)
        }
    })
    .then(response => response.json())
    .then((users: User[]) => {
        const userList = document.createElement('ul');
        users.forEach(user => {
            const listItem = document.createElement('li');
            listItem.textContent = `${user.username} (${user.userId})`;
            userList.appendChild(listItem);
        });
        app.appendChild(userList);
    })
    .catch(error => {
        console.error('Error fetching users:', error);
    });
});