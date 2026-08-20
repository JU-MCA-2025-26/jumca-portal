When you are done making a backend endpoint, add it to this file with the following format:

### Endpoint Name

- **Method**: GET/POST/PATCH/PUT/DELETE
- **URL**: /api/endpoint/url
- **Description**: A brief description of what the endpoint does.
- **Request Body**: (if applicable) A description of the expected request body, including any required fields and their types.
- **Response**: A description of the expected response, including any relevant status codes and response body structure.
- **Authentication**: (if applicable) A description of the authentication requirements for the endpoint, including any required headers, cookies, or tokens.
- **CSRF Protection**: For every `POST`, `PATCH`, `PUT`, and `DELETE` request, first call `GET /csrf-token`, save the returned/set CSRF cookie, and send the token in the `x-csrf-token` header with the mutating request. `GET` requests do not require the CSRF header.
- **Example Request**

```bash
# For POST/PATCH/PUT/DELETE only, first fetch a CSRF token and save cookies.
curl -c cookies.txt "http://localhost:5000/csrf-token"

curl -X METHOD "http://localhost:5000/api/endpoint/url" \
  -b cookies.txt \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer YOUR_ACCESS_TOKEN" \
  -H "x-csrf-token: YOUR_CSRF_TOKEN" \
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

## CSRF Requirement

All mutating requests must be protected with CSRF validation.

Before making any `POST`, `PATCH`, `PUT`, or `DELETE` request:

1. Call `GET /csrf-token`.
2. Save the CSRF cookie returned by the server.
3. Read the returned CSRF token from the response body.
4. Send the mutating request with:
   - the saved CSRF cookie
   - an `x-csrf-token` header containing the returned token

`GET` requests do not require a CSRF token.

Example flow:

```bash
curl -c cookies.txt "http://localhost:5000/csrf-token"

curl -X POST "http://localhost:5000/api/auth/login" \
  -b cookies.txt \
  -H "Content-Type: application/json" \
  -H "x-csrf-token: YOUR_CSRF_TOKEN" \
  -d '{
    "identifier": "student@example.com",
    "password": "password123"
  }'
```

## Endpoints

### Get CSRF Token

- **Method**: GET
- **URL**: /csrf-token
- **Description**: Generates a CSRF token and sets/synchronizes the CSRF cookie required for later mutating requests.
- **Request Body**: None.
- **Response**: `200 OK` on success.

```json
{
  "csrfToken": "CSRF_TOKEN"
}
```

- **Authentication**: None.
- **CSRF Protection**: Not required. This endpoint is called before protected mutating requests.
- **Example Request**

```bash
curl -c cookies.txt "http://localhost:5000/csrf-token"
```

- **Example Response**

```json
{
  "csrfToken": "CSRF_TOKEN"
}
```

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
- **CSRF Protection**: Required. First call `GET /csrf-token`, save the CSRF cookie, then send the returned token in `x-csrf-token`.
- **Example Request**

```bash
curl -c cookies.txt "http://localhost:5000/csrf-token"

curl -X POST "http://localhost:5000/api/auth/login" \
  -b cookies.txt \
  -H "Content-Type: application/json" \
  -H "x-csrf-token: YOUR_CSRF_TOKEN" \
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
- **CSRF Protection**: Required. First call `GET /csrf-token`, save the CSRF cookie, then send the returned token in `x-csrf-token` along with the refresh token cookie.
- **Example Request**

```bash
curl -c cookies.txt "http://localhost:5000/csrf-token"

curl -X POST "http://localhost:5000/api/auth/refresh" \
  -b cookies.txt \
  -H "Content-Type: application/json" \
  -H "x-csrf-token: YOUR_CSRF_TOKEN"
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
- **CSRF Protection**: Required. First call `GET /csrf-token`, save the CSRF cookie, then send the returned token in `x-csrf-token`.
- **Example Request**

```bash
curl -c cookies.txt "http://localhost:5000/csrf-token"

curl -X POST "http://localhost:5000/api/auth/logout" \
  -b cookies.txt \
  -H "Authorization: Bearer YOUR_ACCESS_TOKEN" \
  -H "x-csrf-token: YOUR_CSRF_TOKEN"
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
- **CSRF Protection**: Not required for `GET` requests.
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
- **CSRF Protection**: Required. First call `GET /csrf-token`, save the CSRF cookie, then send the returned token in `x-csrf-token`.
- **Example Request**

```bash
curl -c cookies.txt "http://localhost:5000/csrf-token"

curl -X POST "http://localhost:5000/api/auth/forgot-password" \
  -b cookies.txt \
  -H "Content-Type: application/json" \
  -H "x-csrf-token: YOUR_CSRF_TOKEN" \
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
- **CSRF Protection**: Required. First call `GET /csrf-token`, save the CSRF cookie, then send the returned token in `x-csrf-token`.
- **Example Request**

```bash
curl -c cookies.txt "http://localhost:5000/csrf-token"

curl -X POST "http://localhost:5000/api/auth/reset-password" \
  -b cookies.txt \
  -H "Content-Type: application/json" \
  -H "x-csrf-token: YOUR_CSRF_TOKEN" \
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
- **CSRF Protection**: Required. First call `GET /csrf-token`, save the CSRF cookie, then send the returned token in `x-csrf-token`.
- **Example Request**

```bash
curl -c cookies.txt "http://localhost:5000/csrf-token"

curl -X POST "http://localhost:5000/api/users" \
  -b cookies.txt \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer ADMIN_ACCESS_TOKEN" \
  -H "x-csrf-token: YOUR_CSRF_TOKEN" \
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
- **CSRF Protection**: Not required for `GET` requests.
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
- **CSRF Protection**: Not required for `GET` requests.
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
- **CSRF Protection**: Required. First call `GET /csrf-token`, save the CSRF cookie, then send the returned token in `x-csrf-token`.
- **Example Request**

```bash
curl -c cookies.txt "http://localhost:5000/csrf-token"

curl -X PATCH "http://localhost:5000/api/users/cm123456789" \
  -b cookies.txt \
  -H "Content-Type: application/json" \
  -H "x-csrf-token: YOUR_CSRF_TOKEN" \
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
- **CSRF Protection**: Required. First call `GET /csrf-token`, save the CSRF cookie, then send the returned token in `x-csrf-token`.
- **Example Request**

```bash
curl -c cookies.txt "http://localhost:5000/csrf-token"

curl -X DELETE "http://localhost:5000/api/users/deactivate/cm123456789" \
  -b cookies.txt \
  -H "Authorization: Bearer ADMIN_ACCESS_TOKEN" \
  -H "x-csrf-token: YOUR_CSRF_TOKEN"
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
- **CSRF Protection**: Required. First call `GET /csrf-token`, save the CSRF cookie, then send the returned token in `x-csrf-token`.
- **Example Request**

```bash
curl -c cookies.txt "http://localhost:5000/csrf-token"

curl -X POST "http://localhost:5000/api/users/activate/cm123456789" \
  -b cookies.txt \
  -H "Authorization: Bearer ADMIN_ACCESS_TOKEN" \
  -H "x-csrf-token: YOUR_CSRF_TOKEN"
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
- **CSRF Protection**: Required. First call `GET /csrf-token`, save the CSRF cookie, then send the returned token in `x-csrf-token`.
- **Example Request**

```bash
curl -c cookies.txt "http://localhost:5000/csrf-token"

curl -X DELETE "http://localhost:5000/api/users/cm123456789" \
  -b cookies.txt \
  -H "Authorization: Bearer ADMIN_ACCESS_TOKEN" \
  -H "x-csrf-token: YOUR_CSRF_TOKEN"
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
- **CSRF Protection**: Not required for `GET` requests.
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
