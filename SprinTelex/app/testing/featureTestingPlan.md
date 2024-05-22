# Feature Testing Plan for SprinTelex

## Objective
To manually test user registration, sign-in, profile fetching, and profile updating functionalities, ensuring they work as expected with the MongoDB backend. Additionally, test scenarios involving invalid credentials, duplicate sign-ups, and unauthorized access to protected routes.

## Setup
- Ensure the backend server is running.
- Ensure the MongoDB instance is accessible.
- The React Native Expo app is set up and able to run on a device or emulator.

## Test Scenarios

### User Registration
1. Attempt to register a new user with valid credentials.
2. Attempt to register with an already registered email or username (expect failure).
3. Attempt to register with incomplete or invalid data.

### User Sign-In
1. Attempt to sign in with valid credentials.
2. Attempt to sign in with invalid credentials (expect failure).
3. Attempt to sign in with an unregistered email (expect failure).

### Profile Fetching
1. Fetch the profile of a signed-in user.
2. Attempt to fetch the profile without being signed in (expect failure).

### Profile Updating
1. Update the profile of a signed-in user with valid changes.
2. Attempt to update the profile without being signed in (expect failure).
3. Attempt to make invalid updates to the profile (e.g., invalid email format).

### Accessing Protected Routes
1. Access a route that requires authentication with a valid token.
2. Attempt to access a protected route without a token or with an invalid token (expect failure).

## Reporting
- For each test scenario, note the outcome: Pass, Fail, or Blocked.
- For failures, provide details about the failure and screenshots if applicable.
- Summarize findings and recommend any required actions or bug fixes.