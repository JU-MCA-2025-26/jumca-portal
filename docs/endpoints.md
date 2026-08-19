When you are done making a backend endpoint, add it to this file with the following format:

### Endpoint Name

- **Method**: GET/POST/PATCH/DELETE
- **URL**: /api/endpoint/url
- **Description**: A brief description of what the endpoint does.
- **Request Body**: (if applicable) A description of the expected request body, including any required fields and their types.
- **Response**: A description of the expected response, including any relevant status codes and response body structure.
- **Authentication**: (if applicable) A description of the authentication requirements for the endpoint, including any required headers, cookies, or tokens.
- **Example Request**

```bash
curl -X METHOD "http://localhost:5000/api/endpoint/url" \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer YOUR_ACCESS_TOKEN" \
  -d '{
    "field1": "Field 1 value does this",
    "field2": "Field 2 value does this"
  }'
```

- **Example Response**

```json
{
  "success": true,
  "data": {
    "field1": "value1",
    "field2": "value2"
  }
}
```

## Endpoints

### Login

- **Method**: POST
- **URL**: /api/auth/login
- **Description**: Authenticates an active user with email or roll number and password. Returns an access token in the response body and sets a `refreshToken` HTTP-only cookie.
- **Request Body**:

```json
{
  "identifier": "student@example.com or 002510503034",
  "password": "The user's unhashed password"
}
```

- **Response**: `200 OK` on success. `401 Unauthorized` if credentials are invalid or the user is inactive.

```json
{
  "success": true,
  "data": {
    "accessToken": "JWT_ACCESS_TOKEN",
    "user": {
      "id": "cm123456789",
      "rollNumber": "002510503034",
      "email": "student@example.com",
      "fullName": "Student Name",
      "role": "STUDENT",
      "batch": "2025",
      "isActive": true,
      "createdAt": "2026-08-03T10:54:36.732Z",
      "updatedAt": "2026-08-03T10:54:36.732Z"
    }
  }
}
```

- **Authentication**: None.
- **Example Request**

```bash
curl -X POST "http://localhost:5000/api/auth/login" \
  -H "Content-Type: application/json" \
  -d '{
    "identifier": "student@example.com",
    "password": "password123"
  }'
```

- **Example Response**

```json
{
  "success": true,
  "data": {
    "accessToken": "JWT_ACCESS_TOKEN",
    "user": {
      "id": "cm123456789",
      "rollNumber": "002510503034",
      "email": "student@example.com",
      "fullName": "Student Name",
      "role": "STUDENT",
      "batch": "2025",
      "isActive": true,
      "createdAt": "2026-08-03T10:54:36.732Z",
      "updatedAt": "2026-08-03T10:54:36.732Z"
    }
  }
}
```

### Refresh Token

- **Method**: POST
- **URL**: /api/auth/refresh
- **Description**: Verifies the `refreshToken` cookie, rotates it, and returns a new access token.
- **Request Body**: None.
- **Response**: `200 OK` on success. `401 Unauthorized` if the refresh token is missing, invalid, expired, mismatched, or belongs to an inactive user.

```json
{
  "success": true,
  "data": {
    "accessToken": "NEW_JWT_ACCESS_TOKEN",
    "user": {
      "id": "cm123456789",
      "rollNumber": "002510503034",
      "email": "student@example.com",
      "fullName": "Student Name",
      "role": "STUDENT",
      "batch": "2025",
      "isActive": true,
      "createdAt": "2026-08-03T10:54:36.732Z",
      "updatedAt": "2026-08-03T10:54:36.732Z"
    }
  }
}
```

- **Authentication**: Requires a valid `refreshToken` cookie.
- **Example Request**

```bash
curl -X POST "http://localhost:5000/api/auth/refresh" \
  -H "Content-Type: application/json" \
  -b "refreshToken=YOUR_REFRESH_TOKEN"
```

- **Example Response**

```json
{
  "success": true,
  "data": {
    "accessToken": "NEW_JWT_ACCESS_TOKEN",
    "user": {
      "id": "cm123456789",
      "rollNumber": "002510503034",
      "email": "student@example.com",
      "fullName": "Student Name",
      "role": "STUDENT",
      "batch": "2025",
      "isActive": true,
      "createdAt": "2026-08-03T10:54:36.732Z",
      "updatedAt": "2026-08-03T10:54:36.732Z"
    }
  }
}
```

### Logout

- **Method**: POST
- **URL**: /api/auth/logout
- **Description**: Logs out the authenticated user by clearing their stored refresh token and clearing the `refreshToken` cookie.
- **Request Body**: None.
- **Response**: `200 OK` on success.

```json
{
  "success": true,
  "message": "Logged out successfully"
}
```

- **Authentication**: Requires a valid access token in the `Authorization: Bearer YOUR_ACCESS_TOKEN` header.
- **Example Request**

```bash
curl -X POST "http://localhost:5000/api/auth/logout" \
  -H "Authorization: Bearer YOUR_ACCESS_TOKEN"
```

- **Example Response**

```json
{
  "success": true,
  "message": "Logged out successfully"
}
```

### Get Current User

- **Method**: GET
- **URL**: /api/auth/me
- **Description**: Returns the currently authenticated user's profile information.
- **Request Body**: None.
- **Response**: `200 OK` on success. `404 Not Found` if the user no longer exists.

```json
{
  "success": true,
  "data": {
    "user": {
      "id": "cm123456789",
      "rollNumber": "002510503034",
      "email": "student@example.com",
      "fullName": "Student Name",
      "role": "STUDENT",
      "batch": "2025",
      "isActive": true,
      "createdAt": "2026-08-03T10:54:36.732Z",
      "updatedAt": "2026-08-03T10:54:36.732Z"
    }
  }
}
```

- **Authentication**: Requires a valid access token in the `Authorization: Bearer YOUR_ACCESS_TOKEN` header.
- **Example Request**

```bash
curl -X GET "http://localhost:5000/api/auth/me" \
  -H "Authorization: Bearer YOUR_ACCESS_TOKEN"
```

- **Example Response**

```json
{
  "success": true,
  "data": {
    "user": {
      "id": "cm123456789",
      "rollNumber": "002510503034",
      "email": "student@example.com",
      "fullName": "Student Name",
      "role": "STUDENT",
      "batch": "2025",
      "isActive": true,
      "createdAt": "2026-08-03T10:54:36.732Z",
      "updatedAt": "2026-08-03T10:54:36.732Z"
    }
  }
}
```

### Forgot Password

- **Method**: POST
- **URL**: /api/auth/forgot-password
- **Description**: Generates a password reset token for the user with the submitted email if the account exists. The response is intentionally the same whether or not the email exists to prevent user enumeration.
- **Request Body**:

```json
{
  "email": "student@example.com"
}
```

- **Response**: `200 OK` on success. In development, the reset URL is logged by the server.

```json
{
  "success": true,
  "message": "If an account exists with that email, a password reset link has been sent."
}
```

- **Authentication**: None.
- **Example Request**

```bash
curl -X POST "http://localhost:5000/api/auth/forgot-password" \
  -H "Content-Type: application/json" \
  -d '{
    "email": "student@example.com"
  }'
```

- **Example Response**

```json
{
  "success": true,
  "message": "If an account exists with that email, a password reset link has been sent."
}
```

### Reset Password

- **Method**: POST
- **URL**: /api/auth/reset-password
- **Description**: Resets a user's password using the email and password reset token generated by the forgot password endpoint. The token must belong to the submitted email and must not be expired.
- **Request Body**:

```json
{
  "email": "student@example.com",
  "token": "RESET_TOKEN_FROM_RESET_LINK",
  "password": "newPassword123"
}
```

- **Response**: `200 OK` on success. `400 Bad Request` if the reset token is invalid, expired, or does not belong to the submitted email.

```json
{
  "success": true,
  "message": "Password reset successfully"
}
```

- **Authentication**: None.
- **Example Request**

```bash
curl -X POST "http://localhost:5000/api/auth/reset-password" \
  -H "Content-Type: application/json" \
  -d '{
    "email": "student@example.com",
    "token": "RESET_TOKEN_FROM_RESET_LINK",
    "password": "newPassword123"
  }'
```

- **Example Response**

```json
{
  "success": true,
  "message": "Password reset successfully"
}
```

### Create User

- **Method**: POST
- **URL**: /api/users
- **Description**: Creates a new user account. Passwords are hashed before storage.
- **Request Body**:

```json
{
  "rollNumber": "002510503034",
  "email": "student@example.com",
  "password": "password123",
  "fullName": "Student Name",
  "role": "STUDENT",
  "batch": "2025"
}
```

- **Response**: `201 Created` on success. `409 Conflict` if another user already has the same email or roll number.

```json
{
  "success": true,
  "message": "User registered successfully",
  "data": {
    "user": {
      "id": "cm123456789",
      "rollNumber": "002510503034",
      "email": "student@example.com",
      "fullName": "Student Name",
      "role": "STUDENT",
      "batch": "2025",
      "isActive": true,
      "createdAt": "2026-08-03T10:54:36.732Z",
      "updatedAt": "2026-08-03T10:54:36.732Z"
    }
  }
}
```

- **Authentication**: Requires a valid admin access token in the `Authorization: Bearer YOUR_ACCESS_TOKEN` header.
- **Example Request**

```bash
curl -X POST "http://localhost:5000/api/users" \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer ADMIN_ACCESS_TOKEN" \
  -d '{
    "rollNumber": "002510503034",
    "email": "student@example.com",
    "password": "password123",
    "fullName": "Student Name",
    "role": "STUDENT",
    "batch": "2025"
  }'
```

- **Example Response**

```json
{
  "success": true,
  "message": "User registered successfully",
  "data": {
    "user": {
      "id": "cm123456789",
      "rollNumber": "002510503034",
      "email": "student@example.com",
      "fullName": "Student Name",
      "role": "STUDENT",
      "batch": "2025",
      "isActive": true,
      "createdAt": "2026-08-03T10:54:36.732Z",
      "updatedAt": "2026-08-03T10:54:36.732Z"
    }
  }
}
```

### Get Users

- **Method**: GET
- **URL**: /api/users
- **Description**: Returns all users ordered by newest first.
- **Request Body**: None.
- **Response**: `200 OK` on success.

```json
{
  "success": true,
  "data": [
    {
      "id": "cm123456789",
      "rollNumber": "002510503034",
      "email": "student@example.com",
      "fullName": "Student Name",
      "role": "STUDENT",
      "batch": "2025",
      "isActive": true,
      "createdAt": "2026-08-03T10:54:36.732Z",
      "updatedAt": "2026-08-03T10:54:36.732Z"
    }
  ]
}
```

- **Authentication**: Requires a valid admin access token in the `Authorization: Bearer YOUR_ACCESS_TOKEN` header.
- **Example Request**

```bash
curl -X GET "http://localhost:5000/api/users" \
  -H "Authorization: Bearer ADMIN_ACCESS_TOKEN"
```

- **Example Response**

```json
{
  "success": true,
  "data": [
    {
      "id": "cm123456789",
      "rollNumber": "002510503034",
      "email": "student@example.com",
      "fullName": "Student Name",
      "role": "STUDENT",
      "batch": "2025",
      "isActive": true,
      "createdAt": "2026-08-03T10:54:36.732Z",
      "updatedAt": "2026-08-03T10:54:36.732Z"
    }
  ]
}
```

### Get User By ID

- **Method**: GET
- **URL**: /api/users/:userId
- **Description**: Returns one user by ID.
- **Request Body**: None.
- **Response**: `200 OK` on success. `404 Not Found` if no user exists for the given ID.

```json
{
  "success": true,
  "data": {
    "id": "cm123456789",
    "rollNumber": "002510503034",
    "email": "student@example.com",
    "fullName": "Student Name",
    "role": "STUDENT",
    "batch": "2025",
    "isActive": true,
    "createdAt": "2026-08-03T10:54:36.732Z",
    "updatedAt": "2026-08-03T10:54:36.732Z"
  }
}
```

- **Authentication**: None in the current route definition.
- **Example Request**

```bash
curl -X GET "http://localhost:5000/api/users/cm123456789"
```

- **Example Response**

```json
{
  "success": true,
  "data": {
    "id": "cm123456789",
    "rollNumber": "002510503034",
    "email": "student@example.com",
    "fullName": "Student Name",
    "role": "STUDENT",
    "batch": "2025",
    "isActive": true,
    "createdAt": "2026-08-03T10:54:36.732Z",
    "updatedAt": "2026-08-03T10:54:36.732Z"
  }
}
```

### Update User

- **Method**: PATCH
- **URL**: /api/users/:userId
- **Description**: Updates editable user fields for the given user ID.
- **Request Body**: All fields are optional. At least one editable field should be sent.

```json
{
  "email": "new-email@example.com",
  "fullName": "Updated Student Name",
  "role": "ALUMNI",
  "batch": "2024",
  "isActive": true
}
```

- **Response**: `200 OK` on success. `404 Not Found` if no user exists for the given ID. `409 Conflict` if the submitted email is already owned by another user.

```json
{
  "success": true,
  "message": "User updated successfully",
  "data": {
    "id": "cm123456789",
    "rollNumber": "002510503034",
    "email": "new-email@example.com",
    "fullName": "Updated Student Name",
    "role": "ALUMNI",
    "batch": "2024",
    "isActive": true,
    "createdAt": "2026-08-03T10:54:36.732Z",
    "updatedAt": "2026-08-03T11:00:00.000Z"
  }
}
```

- **Authentication**: None in the current route definition.
- **Example Request**

```bash
curl -X PATCH "http://localhost:5000/api/users/cm123456789" \
  -H "Content-Type: application/json" \
  -d '{
    "fullName": "Updated Student Name",
    "batch": "2024"
  }'
```

- **Example Response**

```json
{
  "success": true,
  "message": "User updated successfully",
  "data": {
    "id": "cm123456789",
    "rollNumber": "002510503034",
    "email": "student@example.com",
    "fullName": "Updated Student Name",
    "role": "STUDENT",
    "batch": "2024",
    "isActive": true,
    "createdAt": "2026-08-03T10:54:36.732Z",
    "updatedAt": "2026-08-03T11:00:00.000Z"
  }
}
```

### Deactivate User

- **Method**: DELETE
- **URL**: /api/users/deactivate/:userId
- **Description**: Deactivates a non-admin user and clears their refresh token.
- **Request Body**: None.
- **Response**: `200 OK` on success. `404 Not Found` if no user exists for the given ID. `403 Forbidden` if the target user is an admin.

```json
{
  "success": true,
  "message": "User deactivated successfully",
  "data": {
    "id": "cm123456789",
    "rollNumber": "002510503034",
    "email": "student@example.com",
    "fullName": "Student Name",
    "role": "STUDENT",
    "batch": "2025",
    "isActive": false,
    "createdAt": "2026-08-03T10:54:36.732Z",
    "updatedAt": "2026-08-03T11:00:00.000Z"
  }
}
```

- **Authentication**: Requires a valid admin access token in the `Authorization: Bearer YOUR_ACCESS_TOKEN` header.
- **Example Request**

```bash
curl -X DELETE "http://localhost:5000/api/users/deactivate/cm123456789" \
  -H "Authorization: Bearer ADMIN_ACCESS_TOKEN"
```

- **Example Response**

```json
{
  "success": true,
  "message": "User deactivated successfully",
  "data": {
    "id": "cm123456789",
    "rollNumber": "002510503034",
    "email": "student@example.com",
    "fullName": "Student Name",
    "role": "STUDENT",
    "batch": "2025",
    "isActive": false,
    "createdAt": "2026-08-03T10:54:36.732Z",
    "updatedAt": "2026-08-03T11:00:00.000Z"
  }
}
```

### Activate User

- **Method**: POST
- **URL**: /api/users/activate/:userId
- **Description**: Activates a user account.
- **Request Body**: None.
- **Response**: `200 OK` on success. `404 Not Found` if no user exists for the given ID.

```json
{
  "success": true,
  "message": "User activated successfully",
  "data": {
    "id": "cm123456789",
    "rollNumber": "002510503034",
    "email": "student@example.com",
    "fullName": "Student Name",
    "role": "STUDENT",
    "batch": "2025",
    "isActive": true,
    "createdAt": "2026-08-03T10:54:36.732Z",
    "updatedAt": "2026-08-03T11:00:00.000Z"
  }
}
```

- **Authentication**: Requires a valid admin access token in the `Authorization: Bearer YOUR_ACCESS_TOKEN` header.
- **Example Request**

```bash
curl -X POST "http://localhost:5000/api/users/activate/cm123456789" \
  -H "Authorization: Bearer ADMIN_ACCESS_TOKEN"
```

- **Example Response**

```json
{
  "success": true,
  "message": "User activated successfully",
  "data": {
    "id": "cm123456789",
    "rollNumber": "002510503034",
    "email": "student@example.com",
    "fullName": "Student Name",
    "role": "STUDENT",
    "batch": "2025",
    "isActive": true,
    "createdAt": "2026-08-03T10:54:36.732Z",
    "updatedAt": "2026-08-03T11:00:00.000Z"
  }
}
```

### Delete User

- **Method**: DELETE
- **URL**: /api/users/:userId
- **Description**: Permanently deletes a non-admin user account.
- **Request Body**: None.
- **Response**: `200 OK` on success. `404 Not Found` if no user exists for the given ID. `403 Forbidden` if the target user is an admin.

```json
{
  "success": true,
  "message": "User deleted successfully",
  "data": {
    "id": "cm123456789",
    "rollNumber": "002510503034",
    "email": "student@example.com",
    "fullName": "Student Name",
    "role": "STUDENT",
    "batch": "2025",
    "isActive": true,
    "createdAt": "2026-08-03T10:54:36.732Z",
    "updatedAt": "2026-08-03T11:00:00.000Z"
  }
}
```

- **Authentication**: Requires a valid admin access token in the `Authorization: Bearer YOUR_ACCESS_TOKEN` header.
- **Example Request**

```bash
curl -X DELETE "http://localhost:5000/api/users/cm123456789" \
  -H "Authorization: Bearer ADMIN_ACCESS_TOKEN"
```

- **Example Response**

```json
{
  "success": true,
  "message": "User deleted successfully",
  "data": {
    "id": "cm123456789",
    "rollNumber": "002510503034",
    "email": "student@example.com",
    "fullName": "Student Name",
    "role": "STUDENT",
    "batch": "2025",
    "isActive": true,
    "createdAt": "2026-08-03T10:54:36.732Z",
    "updatedAt": "2026-08-03T11:00:00.000Z"
  }
}
```

### Health Check

- **Method**: GET
- **URL**: /api/health
- **Description**: Checks the health status of the backend server and database connection.
- **Request Body**: None.
- **Response**: `200 OK` on success.

```json
{
  "success": true,
  "message": "Server is healthy",
  "data": {
    "status": "ok",
    "database": "connected",
    "timestamp": "2026-08-03T10:54:36.732Z"
  }
}
```

- **Authentication**: None.
- **Example Request**

```bash
curl -X GET "http://localhost:5000/api/health"
```

- **Example Response**

```json
{
  "success": true,
  "message": "Server is healthy",
  "data": {
    "status": "ok",
    "database": "connected",
    "timestamp": "2026-08-03T10:54:36.732Z"
  }
}
```
