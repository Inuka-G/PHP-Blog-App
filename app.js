// app.js

// Prefer absolute path so fetches work from any page under the site
const API_BASE = '/phpblog/api';

// Utility function to check if user is logged in
function checkLogin() {
    const user = sessionStorage.getItem('user');
    if (user) {
        const userObj = JSON.parse(user);
        const welcomeEl = document.getElementById('welcomeMessage');
        if (welcomeEl) {
            welcomeEl.textContent = `Welcome, ${userObj.username}`;
            welcomeEl.style.display = 'inline';
        }
        const loginLink = document.getElementById('loginLink');
        if (loginLink) loginLink.style.display = 'none';
        const registerLink = document.getElementById('registerLink');
        if (registerLink) registerLink.style.display = 'none';
        const editorLink = document.getElementById('editorLink');
        if (editorLink) editorLink.style.display = 'inline';
        const logoutLink = document.getElementById('logoutLink');
        if (logoutLink) logoutLink.style.display = 'inline';
    } else {
        const welcomeEl = document.getElementById('welcomeMessage');
        if (welcomeEl) welcomeEl.style.display = 'none';
        const loginLink = document.getElementById('loginLink');
        if (loginLink) loginLink.style.display = 'inline';
        const registerLink = document.getElementById('registerLink');
        if (registerLink) registerLink.style.display = 'inline';
        const editorLink = document.getElementById('editorLink');
        if (editorLink) editorLink.style.display = 'none';
        const logoutLink = document.getElementById('logoutLink');
        if (logoutLink) logoutLink.style.display = 'none';
    }
}

// Logout function
function logout() {
    fetch(`${API_BASE}/auth/logout.php`, {
        method: 'POST',
        credentials: 'include'
    })
        .then(response => response.json())
        .then(data => {
            sessionStorage.removeItem('user');
            window.location.href = 'index.html';
        })
        .catch(error => console.error('Error:', error));
}

// Event listener for logout link
document.addEventListener('DOMContentLoaded', function () {
    checkLogin();

    const logoutLink = document.getElementById('logoutLink');
    if (logoutLink) {
        logoutLink.addEventListener('click', function (e) {
            e.preventDefault();
            logout();
        });
    }

    // Load blog list on home page
    if (document.getElementById('blogList')) {
        loadBlogs();
    }

    // Handle login form
    const loginForm = document.getElementById('loginForm');
    if (loginForm) {
        loginForm.addEventListener('submit', function (e) {
            e.preventDefault();
            const username = document.getElementById('username').value;
            const password = document.getElementById('password').value;
            login(username, password);
        });
    }

    // Handle register form
    const registerForm = document.getElementById('registerForm');
    if (registerForm) {
        registerForm.addEventListener('submit', function (e) {
            e.preventDefault();
            const username = document.getElementById('username').value;
            const email = document.getElementById('email').value;
            const password = document.getElementById('password').value;
            register(username, email, password);
        });
    }

    // Handle blog form (create/update)
    const blogForm = document.getElementById('blogForm');
    if (blogForm) {
        blogForm.addEventListener('submit', function (e) {
            e.preventDefault();
            const title = document.getElementById('title').value;
            const content = document.getElementById('content').value;
            const urlParams = new URLSearchParams(window.location.search);
            const id = urlParams.get('id');
            if (id) {
                updateBlog(id, title, content);
            } else {
                createBlog(title, content);
            }
        });
    }

    // Load single blog post
    if (document.getElementById('blogPost')) {
        const urlParams = new URLSearchParams(window.location.search);
        const id = urlParams.get('id');
        if (id) {
            loadBlog(id);
        }
    }
});

// Load all blogs
function loadBlogs() {
    fetch(`${API_BASE}/blog/read.php`)
        .then(response => response.json())
        .then(blogs => {
            const blogList = document.getElementById('blogList');
            blogList.innerHTML = '';
            blogs.forEach(blog => {
                const blogItem = document.createElement('div');
                blogItem.className = 'blog-item';
                blogItem.innerHTML = `
                    <h2><a href="blog.html?id=${blog.id}">${blog.title}</a></h2>
                    <p>By ${blog.username} on ${new Date(blog.created_at).toLocaleDateString()}</p>
                    <p>${blog.content.substring(0, 100)}...</p>
                `;
                blogList.appendChild(blogItem);
            });
        })
        .catch(error => console.error('Error:', error));
}

// Load single blog
function loadBlog(id) {
    fetch(`${API_BASE}/blog/read.php?id=${id}`)
        .then(response => response.json())
        .then(blog => {
            document.getElementById('postTitle').textContent = blog.title;
            document.getElementById('postMeta').textContent = `By ${blog.username} on ${new Date(blog.created_at).toLocaleDateString()}`;
            document.getElementById('postContent').textContent = blog.content;

            // Check if the current user is the author
            const user = sessionStorage.getItem('user');
            if (user) {
                const userObj = JSON.parse(user);
                if (userObj.id == blog.user_id) {
                    document.getElementById('postActions').style.display = 'block';
                    document.getElementById('editButton').addEventListener('click', () => {
                        window.location.href = `editor.html?id=${blog.id}`;
                    });
                    document.getElementById('deleteButton').addEventListener('click', () => {
                        deleteBlog(blog.id);
                    });
                }
            }
        })
        .catch(error => console.error('Error:', error));
}

// Login function
function login(username, password) {
    fetch(`${API_BASE}/auth/login.php`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({ username, password })
    })
        .then(response => response.json())
        .then(data => {
            if (data.message === 'Login successful.') {
                sessionStorage.setItem('user', JSON.stringify({ id: data.user_id, username: data.username }));
                window.location.href = 'index.html';
            } else {
                alert('Login failed.');
            }
        })
        .catch(error => console.error('Error:', error));
}

// Register function
function register(username, email, password) {
    fetch(`${API_BASE}/auth/register.php`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({ username, email, password })
    })
        .then(response => response.json())
        .then(data => {
            if (data.message === 'User was created.') {
                alert('Registration successful. Please login.');
                window.location.href = 'login.html';
            } else {
                alert('Registration failed.');
            }
        })
        .catch(error => console.error('Error:', error));
}

// Create blog
function createBlog(title, content) {
    const user = sessionStorage.getItem('user');
    if (!user) {
        alert('You must be logged in to create a blog.');
        return;
    }

    fetch(`${API_BASE}/blog/create.php`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({ title, content })
    })
        .then(response => response.json())
        .then(data => {
            if (data.message === 'Blog post was created.') {
                window.location.href = 'index.html';
            } else {
                alert('Failed to create blog post.');
            }
        })
        .catch(error => console.error('Error:', error));
}

// Update blog
function updateBlog(id, title, content) {
    const user = sessionStorage.getItem('user');
    if (!user) {
        alert('You must be logged in to update a blog.');
        return;
    }

    fetch(`${API_BASE}/blog/update.php`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({ id, title, content })
    })
        .then(response => response.json())
        .then(data => {
            if (data.message === 'Blog post was updated.') {
                window.location.href = `blog.html?id=${id}`;
            } else {
                alert('Failed to update blog post.');
            }
        })
        .catch(error => console.error('Error:', error));
}

// Delete blog
function deleteBlog(id) {
    if (!confirm('Are you sure you want to delete this blog post?')) {
        return;
    }

    const user = sessionStorage.getItem('user');
    if (!user) {
        alert('You must be logged in to delete a blog.');
        return;
    }

    fetch(`${API_BASE}/blog/delete.php`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({ id })
    })
        .then(response => response.json())
        .then(data => {
            if (data.message === 'Blog post was deleted.') {
                window.location.href = 'index.html';
            } else {
                alert('Failed to delete blog post.');
            }
        })
        .catch(error => console.error('Error:', error));
}

// If we are on the editor page and there's an ID in the URL, we are in edit mode
document.addEventListener('DOMContentLoaded', function () {
    const urlParams = new URLSearchParams(window.location.search);
    const id = urlParams.get('id');
    if (id && document.getElementById('formTitle')) {
        document.getElementById('formTitle').textContent = 'Edit Blog Post';
        // Load the blog post data
        fetch(`${API_BASE}/blog/read.php?id=${id}`)
            .then(response => response.json())
            .then(blog => {
                document.getElementById('title').value = blog.title;
                document.getElementById('content').value = blog.content;
            })
            .catch(error => console.error('Error:', error));
    }
});