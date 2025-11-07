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
            const image_url = document.getElementById('image_url').value;
            const urlParams = new URLSearchParams(window.location.search);
            const id = urlParams.get('id');
            if (id) {
                updateBlog(id, title, content, image_url);
            } else {
                createBlog(title, content, image_url);
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
            blogList.style.display = 'grid';
            blogList.style.gridTemplateColumns = 'repeat(auto-fill, minmax(300px, 1fr))';
            blogList.style.gap = '1rem';
            blogList.style.padding = '2rem';

            blogs.forEach(blog => {
                const blogItem = document.createElement('div');
                blogItem.className = 'blog-item';
                blogItem.innerHTML = `
                  <div class="max-w-sm bg-white border border-gray-200 rounded-lg shadow-sm">
  <a href="/phpblog/singleblog?id=${blog.id}">
    <img class="rounded-t-lg w-full h-48 object-cover" src="${blog.image_url}" alt="${blog.title}" />
  </a>
  <div class="p-5 text-wrap">
    <a href="/phpblog/singleblog?id=${blog.id}">
      <h5 class="mb-2 text-2xl font-bold tracking-tight text-gray-900 ">${blog.title}</h5>
    </a>
    <p class="text-sm text-gray-500  mb-2">
      By ${blog.username} on ${new Date(blog.created_at).toLocaleDateString()}
    </p>
    <p class="mb-3 font-normal text-gray-700 text-wrap">
      ${blog.content.substring(0, 100)}...
    </p>
    <a href="blog.html?id=${blog.id}" class="inline-flex items-center px-3 py-2 text-sm font-medium text-center text-white bg-black rounded-lg hover:bg-blue-800">
      Read more
      <svg class="rtl:rotate-180 w-3.5 h-3.5 ms-2" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 14 10">
        <path stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M1 5h12m0 0L9 1m4 4L9 9"/>
      </svg>
    </a>
  </div>
</div>


                    
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
            // Title, meta and content
            const postTitleEl = document.getElementById('postTitle');
            if (postTitleEl) postTitleEl.textContent = blog.title;
            const postMetaEl = document.getElementById('postMeta');
            if (postMetaEl) postMetaEl.textContent = `By ${blog.username} on ${new Date(blog.created_at).toLocaleDateString()}`;
            const postContentEl = document.getElementById('postContent');
            if (postContentEl) postContentEl.innerHTML = marked.parse(blog.content);

            // Image: prefer postimg, then imageUrl, then image_url
            const imgSrc = blog.postimg || blog.imageUrl || blog.image_url || '';
            if (imgSrc) {
                let imgEl = document.getElementById('postImg');
                if (!imgEl) {
                    imgEl = document.createElement('img');
                    imgEl.id = 'postImg';
                    imgEl.className = 'rounded-lg mb-6 w-full max-h-[400px] object-cover';
                    // insert before content
                    if (postContentEl && postContentEl.parentNode) {
                        postContentEl.parentNode.insertBefore(imgEl, postContentEl);
                    } else if (postTitleEl && postTitleEl.parentNode) {
                        postTitleEl.parentNode.insertBefore(imgEl, postTitleEl.nextSibling);
                    }
                }
                imgEl.src = imgSrc;
                imgEl.alt = blog.title || 'Post image';
            }

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
                const alert = document.getElementsByClassName("alert")[0];
                Object.assign(alert.style, {
                    display: "block",
                    color: '#166534',
                    backgroundColor: '#f0fdf4'
                });
                alert.innerHTML = "Login successful.";
                setTimeout(() => {
                    alert.style.display = "none";
                    window.location.href = 'index.html';
                }, 2300);

            } else {
                const alert = document.getElementsByClassName("alert")[0];
                alert.style.display = "block";
                alert.innerHTML = "Login failed. Please check your credentials.";
                // alert('Login failed.');
                setTimeout(() => {
                    alert.style.display = "none";
                }, 2000);
            }
        })
        .catch(error => {
            console.error('Error:', error)

        });
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
                const alert = document.getElementsByClassName("alert")[0];
                alert.style.display = "block";
                Object.assign(alert.style, {
                    display: "block",
                    color: '#166534',
                    backgroundColor: '#f0fdf4'
                });
                alert.innerHTML = "Registration successful. Please login.";
                setTimeout(() => {
                    alert.style.display = "none";
                }, 2000);
                window.location.href = 'login.html';
            } else {
                const alert = document.getElementsByClassName("alert")[0];
                alert.style.display = "block";
                alert.innerHTML = "Registration failed. Please try again.";
                // alert('Registration failed.');
                setTimeout(() => {
                    alert.style.display = "none";
                }, 2000);
            }
        })
        .catch(error => console.error('Error:', error));
}

// Create blog
function createBlog(title, content, image_url) {
    const user = sessionStorage.getItem('user');
    if (!user) {
        const alert = document.getElementsByClassName("alert")[0];
        alert.style = {
            display: "block"

        };
        alert.innerHTML = "You must be logged in to create a blog.";

        // alert('You must be logged in to create a blog.');
        return;
    }

    fetch(`${API_BASE}/blog/create.php`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({ title, content, image_url })
    })
        .then(response => response.json())
        .then(data => {
            if (data.message === 'Blog post was created.') {
                const alert = document.getElementsByClassName("alert")[0];
                Object.assign(alert.style, {
                    display: "block",
                    color: "#166534",
                    backgroundColor: "#f0fdf4"
                });
                alert.innerHTML = "Blog post created successfully.";
                setTimeout(() => {
                    alert.style.display = "none";
                    window.location.href = 'index.html';
                }, 2000);
            } else {
                const alert = document.getElementsByClassName("alert")[0];
                alert.style.display = "block";
                alert.innerHTML = "Failed to create blog post.";
                // alert('Failed to create blog post.');
            }
        })
        .catch(error => {
            console.error('Error:', error)

            const alert = document.getElementsByClassName("alert")[0];
            alert.style.display = "block";
            alert.innerHTML = `Error: ${error.message}`;

        });
}

// Update blog
function updateBlog(id, title, content, image_url) {
    const user = sessionStorage.getItem('user');
    if (!user) {
        const alert = document.getElementsByClassName("alert")[0];
        alert.style = {
            display: "block"

        };
        alert.innerHTML = "You must be logged in to update a blog.";
        // alert('You must be logged in to update a blog.');
        return;
    }

    fetch(`${API_BASE}/blog/update.php`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({ id, title, content, image_url })
    })
        .then(response => response.json())
        .then(data => {
            if (data.message === 'Blog post was updated.') {
                const alert = document.getElementsByClassName("alert")[0];
                Object.assign(alert.style, {
                    display: "block",
                    color: "#166534",
                    backgroundColor: "#f0fdf4"
                });
                alert.innerHTML = "Blog post updated successfully.";
                setTimeout(() => {
                    alert.style.display = "none";
                    window.location.href = `blog.html?id=${id}`;
                }, 2000);
            } else {
                const alert = document.getElementsByClassName("alert")[0];
                alert.style.display = "block";
                alert.innerHTML = "Failed to update blog post.";
                //
                // alert('Failed to update blog post.');
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
        const alert = document.getElementsByClassName("alert")[0];
        alert.style.display = "block";
        alert.innerHTML = "You must be logged in to delete a blog.";
        // alert('You must be logged in to delete a blog.');
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
                const alert = document.getElementsByClassName("alert")[0];
                Object.assign(alert.style, {
                    display: "block",
                    color: "#166534",
                    backgroundColor: "#f0fdf4"
                });
                alert.innerHTML = "Blog post deleted successfully.";
                setTimeout(() => {
                    alert.style.display = "none";
                    window.location.href = 'index.html';
                }, 2000);

            } else {
                const alert = document.getElementsByClassName("alert")[0];
                alert.style.display = "block";
                alert.innerHTML = "Failed to delete blog post.";
                //

                // alert('Failed to delete blog post.');
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
                document.getElementById('image_url').value = blog.image_url;
            })
            .catch(error => {
                console.error('Error:', error)
                const alert = document.getElementsByClassName("alert")[0];
                alert.style.display = "block";
                alert.innerHTML = `Error: ${error.message}`;
            });
    }
});