MyBlog - A Full-Stack Blog Application
A modern, responsive blog application built with HTML, CSS, JavaScript for the frontend, PHP for the backend, and MySQL as the database. This application provides a complete blogging platform with user authentication and full CRUD operations.

http://inukag.great-site.net/

🚀 Features
🔐 User Authentication & Authorization
User registration and login

Secure password hashing

Session-based authentication

Authorization to ensure users can only manage their own blogs

📝 Blog Management
Create new blog posts

Read all blogs on the home page

Update existing blog posts

Delete blog posts

Rich text editing capabilities

🎨 Frontend Features
Responsive design that works on all devices

Clean and modern user interface

Single page application-like experience with AJAX

# MyBlog

A simple, full-stack blog application built with plain HTML/CSS/JavaScript on the frontend, PHP (PDO) on the backend, and MySQL as the database. It includes user registration/login and full CRUD operations for blog posts.

## Table of contents

- [Features](#features)
- [Tech stack](#tech-stack)
- [Prerequisites](#prerequisites)
- [Installation & setup](#installation--setup)
- [Configuration](#configuration)
- [Database schema](#database-schema)
- [Running the app](#running-the-app)
- [API endpoints](#api-endpoints)
- [Project structure](#project-structure)
- [Contributing](#contributing)
- [License](#license)

## Features

- User registration and login with secure password hashing (password_hash)
- Session-based authentication and authorization (users can manage only their own posts)
- Create, read, update and delete blog posts (CRUD)
- Responsive frontend with AJAX-powered interactions for a smoother UX
- Simple alert/validation system for user feedback

## Tech stack

- Frontend: HTML5, CSS3, Vanilla JavaScript (ES6+)
- Backend: PHP (procedural) using PDO for database access
- Database: MySQL / MariaDB

## Prerequisites

- PHP 7.4+ with PDO MySQL extension enabled
- MySQL or MariaDB server
- A web server (Apache, Nginx) or PHP built-in server for local development

## Installation & setup

1. Clone the repository (if needed) and open the project directory.

2. Copy the example env/config files and set your database credentials.

   - Edit `config/env.php` and set DB host, name, user and password.
   - Confirm `config/database.php` uses those values to build a PDO connection.

3. Create the database and tables (see Database schema below).

4. Make sure your web server's document root points to the project directory, or run the PHP built-in server for quick local testing:

```
php -S localhost:8000
```

Then open http://localhost:8000 in your browser.

## Configuration

- `config/env.php` — environment / credential placeholders (update with your DB credentials).
- `config/database.php` — returns a PDO connection using the values from `env.php`.
- `api/` — the folder containing server endpoints (authentication and blog CRUD handlers).

Keep credentials out of version control for production. For local development, `config/env.php` can be used, but consider environment variables or a .env loader for production.

## Database schema

Below is a minimal SQL schema to create the `users` and `posts` tables used by this app. Run these statements in your MySQL database (adjust types/lengths as needed):

```sql
CREATE TABLE users (
	id INT AUTO_INCREMENT PRIMARY KEY,
	username VARCHAR(100) NOT NULL UNIQUE,
	email VARCHAR(255) NOT NULL UNIQUE,
	password VARCHAR(255) NOT NULL,
	created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE posts (
	id INT AUTO_INCREMENT PRIMARY KEY,
	user_id INT NOT NULL,
	title VARCHAR(255) NOT NULL,
	body TEXT NOT NULL,
	created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
	updated_at TIMESTAMP NULL DEFAULT NULL,
	FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
);
```

If you already have a `config/database.php` with a `PDO` connection, run the SQL above using your preferred MySQL client (mysql CLI, phpMyAdmin, TablePlus, etc.).

## Running the app

- Quick local dev with PHP built-in server (from project root):

```
php -S localhost:8000
```

- Or configure your Apache/Nginx virtual host to point to the project root.

Notes:

- Ensure `config/env.php` has correct DB credentials.
- Ensure your PHP install has the PDO MySQL extension enabled.

## API endpoints

This project exposes endpoints under `api/`. The important ones are:

- `api/auth/register.php` — POST: register a new user (expects username/email/password)
- `api/auth/login.php` — POST: login and start a session (expects email/password)
- `api/auth/logout.php` — GET/POST: log out and destroy session

- `api/blog/create.php` — POST: create a new blog post (requires authenticated user)
- `api/blog/read.php` — GET: list or fetch posts
- `api/blog/update.php` — POST: update a post (authorization enforced)
- `api/blog/delete.php` — POST/DELETE: delete a post (authorization enforced)

Inspect the code inside `api/` to see required parameters and responses. Add CSRF protection and input sanitization if you plan to deploy publicly.

## Project structure

```
.
├─ api/
│  ├─ auth/
│  │  ├─ login.php
│  │  ├─ logout.php
│  │  └─ register.php
│  └─ blog/
│     ├─ create.php
│     ├─ delete.php
│     ├─ read.php
│     └─ update.php
├─ config/
│  ├─ database.php
│  └─ env.php
├─ index.html
├─ login.html
├─ register.html
├─ editor.html
├─ blog.html
├─ app.js
├─ editor.js
├─ styles.css
└─ readme.md
```

## Contributing

If you'd like to contribute:

1. Open an issue describing the feature or bug.
2. Create a branch, implement the change, add tests where appropriate, and open a pull request.

Small suggestions: add a DB seed script, unit tests for API handlers, and CSRF protection.

## Security notes

- Always use prepared statements (PDO with bound params) to avoid SQL injection.
- Hash passwords with `password_hash()` and verify with `password_verify()`.
- Use HTTPS in production and protect sessions (set secure and httponly flags).

## License

This project is provided under the MIT License — see `LICENSE` file if present, or add one to make licensing explicit.

---

If you'd like, I can also:

- Add an example `.env` template and a DB import script.
- Create a small Bash or PHP script to create the database and tables automatically.

Tell me which of those you'd like next.
