# Papyrus-server

## Overview:

**Papyrus** is a backend API server for managing an online stationery shop. It enables users to browse products, manage carts, place orders, and make payments. Admins can handle product listings, update order statuses, and manage user access. Designed for a smooth, secure, and organized shopping experience.

## Features:

- 📝 **User Registration & Login**

  - JWT-based authentication
  - Secure user sessions

- 🛍️ **Product Management**

  - Users can view all available stationery products
  - Admins can create, update, or manage products

- 🛒 **Cart & Checkout**

  - Users can add products to their cart
  - Cart updates and modifications supported
  - Checkout with payment functionality

- 📦 **Order Processing**

  - Users can place orders after payment
  - Admins can update order status: `pending`, `paid`, `shipped`, `processing`

- 👤 **User Profile Management**

  - Users can update profile details like name and address
  - Admins can deactivate users if necessary

- ✅ **Data Validation**

  - All inputs are validated to ensure data integrity

- 🔐 **Secure API Access**
  - Role-based access control for admin and users

### Authentication & Authorization:

Admin and User roles are separated. To create, update, delete, or block, both Admin and User must be logged in.

### Error Handling:

Includes proper handling for invalid input, invalid email, missing data, duplicate user, and unauthorized requests.

### Technology Used:

- **Node.js** – Runtime environment
- **Express.js** – Web framework for building APIs
- **TypeScript** – Type-safe JavaScript
- **MongoDB** – NoSQL database
- **JWT (JSON Web Token)** – Authentication
- **Zod** – Schema validation
- **http-status** – HTTP status code helper
- **Prettier** – Code formatter
- **ESLint** – Code linter

## Local Installation

1. Clone the repository:

```bash
git clone https://github.com/shumon-dev/papyrus-server.git
```
