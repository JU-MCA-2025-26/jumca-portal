When you are done making a backend endpoint, add it to this file with the following format:

### Endpoint Name

- **Method**: GET/POST/PUT/DELETE
- **URL**: /api/endpoint/url
- **Description**: A brief description of what the endpoint does.
- **Request Body**: (if applicable) A description of the expected request body, including any required fields and their types.
- **Response**: A description of the expected response, including any relevant status codes and response body structure.
- **Authentication**: (if applicable) A description of the authentication requirements for the endpoint, including any required headers or tokens.
- **Example Request**

```
curl -X METHOD "http://localhost:PORT/api/endpoint/url" \
-H "Content-Type: application/json" \
-H "Authorization: Bearer YOUR_ACCESS_TOKEN" \
-d '{
  "field1": "Field 1 value does this",
  "field2": "Field 2 value does this"
}'
- **Example Response**
```

{
"success": "true",
"data": {
"field1": "value1",
"field2": "value2"
}
}

## Endpoints

### Login

- **Method**: POST
- **URL**: /api/auth/login
- **Description**: Authenticates a user and returns a JWT token for subsequent requests.
- **Request Body**:

```json
{
  "indentifier": "The email or roll number of the registered user",
  "password": "The unhashed password of the registered user"
}
```

- **Response**:

```json
{
  "success": "true",
  "data": {
    "accessToken": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySWQiOiJjbXNhbzUxeGkwMDAwaDdsdnZ6bWVsc3N1Iiwicm9sZSI6IkFETUlOIiwiaWF0IjoxNzg1NjI1ODAzLCJleHAiOjE3ODU2MjY3MDN9.9zAd5lOj8fOO1eLzBwFGeGeyUBvtjAtGvcSqTpDBD88",
    "user": {
      "id": "amsro55xo0506h4lvgzdeasnp",
      "rollNumber": "002510503034",
      "email": "abcde@efgh.ijk",
      "username": "abcde"
      "password": "$2b$12$S7WeGcbPLcV9RuhelRp59O3OBT6tFfQ5PLH7mzOGwEDoRtQWFd8ba",
      "fullName": "Abcde Wxyz",
      "role": "STUDENT",
      "batch": "2025",
      "refreshToken": "eyJhbGciOiJIU4I1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySWQiOiJjbXNhbzUxeGkwMDAwaDdsdnZ6bWFsc3N1Piwicm9sZSI6IkFETUlOIiwiaWF0IjoxNzg1NjIyODM3LCJleHAiOjE3ODYyMjd2Mzd9.85-aUL3u9bgEa1T0W9m2V44GD9yfK-anicb4P3JCDTg",
      "createdAt": "2025-06-01T12:34:56.789Z",
      "updatedAt": "2026-06-01T12:34:56.789Z"
    }
  }
}
```

## Health Check

- **Method**: GET
- **URL**: /api/health
- **Description**: Checks the health status of the backend server and database connection.
- **Response**:

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
