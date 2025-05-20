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

#### Admin and User roles are seperated. For creating, updating, deleting and blocking, User and Admin have to logged-in.

### Error Handlings:

#### Proper error handling for invalid input, invalid email, missing data, duplicate user, and unauthorized request.

### Technology Used:

- **Node.js** – Runtime environment
- **Express.js** – Web framework for building APIs
- **TypeScript** – Type-safe JavaScript for better development experience
- **MongoDB** – NoSQL database
- **JWT (JSON Web Token)** – Authentication and authorization
- **Zod** – Schema-based validation
- **http-status** – Standard HTTP status codes handling
- **Prettier** – Code formatter for consistent styling
- **ESLint** – Code linting to maintain code quality and standards

## Project installation Locally .

1. Clone the repository:

```bash
 git clone https://github.com/rafiferdos/papyrus-server.git
```

2.  Go to the project directory and Install npm:

```bash
cd papyrus-server;
npm install;
```

3. To run this project you need Environment Variables. First create .env file in papyrus-server main directory and add these variables.

```env
NODE_ENV=development
PORT=5000
DATABASE_URL=
BCRYPT_SALT_ROUNDS=8
DEFAULT_PASSWORD=123456
SERVER_BASE_URL=
JWT_ACCESS_SECRET=
JWT_REFRESH_SECRET=
JWT_ACCESS_SECRET_EXPIRES_IN=
JWT_REFRESH_SECRET_EXPIRES_IN=
SP_ENDPOINT=
SP_USERNAME=
SP_PASSWORD=
SP_PREFIX=
SP_RETURN_URL=
```

### Scripts for manage this application.

1. To run this application in development:

```bash
npm run start:dev
```

2. To build this application:

```bash
npm run build
```

3. To Use lint to find problem:

```bash
npm run lint
```

4. To Use lint fix to auto fix problem:

```bash
npm run lint:fix
```

5. To format codes:

```bash
npm run prettier
```

## API Endpoints:

### For Authentication :

1. **Register User** :

```bash
/api/auth/register
Method: POST
```

2. **Login User** :

```bash
/api/auth/login
Method: POST
```

3. **Refresh Token** :

```bash
/api/auth/refresh-token
Method: POST
```

### User Related Actions :

1. **Get all user**:

```bash
/api/user
Method: GET
Request-Header: Authorization: Bearer <token>
```

2. **Get Single User**:

```bash
/api/user/userId
Method: GET
Request-Header: Authorization: Bearer <token>
```

3. **Update User**:

```bash
/api/user/userId
Method: POST
Request-Header: Authorization: Bearer <token>
```

### Product Related Actions :

1. **Create Product**:

```bash
/api/product
Method: POST
Request-Header: Authorization: Bearer <token>
```

2. **Get All Product**:

```bash
/api/product
Method: GET
```
3. **Get Product By Query**:

```bash
api/product?searchTerm=Pen
Method: GET
```

4. **Get Single Product**:

```bash
/api/product/productId
Method: GET
```

5. **Update Product**:

```bash
/api/product/productId
Method: PUT
Request-Header: Authorization: Bearer <token>
```

6. **Delete Product**:

```bash
/api/product/productId
Method: DELETE
Request-Header: Authorization: Bearer <token>
```

### Product Related Actions :

1. **Create Order**:

```bash
/api/order
Method: POST
Request-Header: Authorization: Bearer <token>
```

2. **Get All Order**:

```bash
/api/order
Method: GET
Request-Header: Authorization: Bearer <token>
```

3. **Get Order By User**:

```bash
/api/order/byUser/orderId
Method: GET
Request-Header: Authorization: Bearer <token>
```

4. **Get Single Order**:

```bash
/api/order/orderId
Method: GET
Request-Header: Authorization: Bearer <token>
```

### Admin Related Actions :

1.  **Deactivate User**:

```bash
/api/admin/user/UserId/deactivate
Method: PATCH
Request-Header: Authorization: Bearer <token>
```

2.  **Update Order Status**:

```bash
/api/order/orderId/status
Method: PATCH
Request-Header: Authorization: Bearer <token>
```

## Admin login crediential:

```bash
Email: admin@gmail.com
Password: 123456
```

## Necessary Links:

1. **Live Links**: https://papyrus-server-lovat.vercel.app
2. **Github Link**: https://github.com/rafiferdos/papyrus-server.git


