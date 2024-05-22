# 24Matters

24Matters is a comprehensive cryptocurrency management platform designed to provide users with a wide range of functionalities to manage their cryptocurrency assets efficiently. Users can track their wallet balance, engage with tasks to earn cryptocurrency, view transaction histories, and much more, all within a secure and user-friendly environment.

## Overview

The 24Matters platform utilizes a robust tech stack including Node.js, Express for the backend, MongoDB for data storage, and Socket.IO for real-time communication. It's structured around modular routes, models, and views to facilitate easy navigation and maintenance. The project leverages environment variables for configuration, ensuring security and flexibility across different deployment environments.

## Features

- **User Account Management**: Secure login/logout, registration, and session management.
- **Real-time Wallet Information**: Display of current balance and commission earnings in USDT.
- **Task Management**: Users can accept, manage, and submit tasks to earn cryptocurrency.
- **Transaction History**: View a log of all deposit transactions and tasks completed.
- **Customer Support**: Integrated support system allowing users to submit queries and receive assistance.
- **Security and Analytics**: Two-factor authentication (2FA), real-time account activity alerts, and a comprehensive analytics dashboard.

## Getting Started

### Requirements

- Node.js
- MongoDB
- A modern web browser

### Quickstart

1. Clone the repository.
2. Install dependencies with `npm install`.
3. Copy `.env.example` to `.env` and fill in your MongoDB URL and session secret.
4. Run the application using `npm start`.
5. Open a web browser and navigate to `http://localhost:3000`.

### License

Copyright (c) 2024.