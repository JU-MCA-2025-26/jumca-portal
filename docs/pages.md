When you are done making a frontend page, add it to this file with the following format:

### Page Name

- **URL**: /page/url
- **Description**: A brief description of what the page does.
- **Components Used**: A list of the main components used in the page, including their purpose and any relevant props.
- **State Management**: A description of how state is managed in the page, including any relevant hooks or context providers.
- **API Calls**: A description of any API calls made in the page, including the endpoints used and the expected response structure. For every `POST`, `PATCH`, `PUT`, and `DELETE` request, the page must first call `GET /csrf-token`, save the CSRF cookie, and send the returned token in the `x-csrf-token` header with the mutating request. `GET` requests do not require the CSRF header.

## API CSRF Requirement

Every frontend page or component that performs a mutating API request must follow this flow:

1. Call `GET /csrf-token` before the mutating request.
2. Preserve the CSRF cookie set by the server.
3. Send the returned CSRF token in the `x-csrf-token` header.
4. Then send the `POST`, `PATCH`, `PUT`, or `DELETE` request.

This applies to all mutating API calls, including unauthenticated endpoints such as login, forgot password, and reset password. `GET` requests do not require a CSRF token.

## Pages
