# Project Overview

This is a chat application backend built with the [NestJS](https://nestjs.com/) framework. It uses a modular architecture with features like user authentication, real-time chat using WebSockets, and a database for persistence.

## Key Technologies

*   **Framework**: NestJS
*   **Language**: TypeScript
*   **Real-time Communication**: WebSockets (Socket.IO)
*   **Database**: PostgreSQL (inferred from `pg` dependency)
*   **ORM**: TypeORM
*   **Authentication**: JWT (JSON Web Tokens)
*   **API Documentation**: Swagger

## Project Structure

The project follows the standard NestJS project structure:

*   `src`: Contains the application source code.
    *   `main.ts`: The application entry point.
    *   `app.module.ts`: The root module of the application.
    *   `common`: Contains common modules, guards, decorators, etc.
    *   `modules`: Contains the different feature modules of the application (e.g., `auth`, `chat`, `users`).
    *   `entities`: Contains the TypeORM entity definitions.
*   `migrations`: Contains the database migration files.
*   `test`: Contains the end-to-end tests.
*   `package.json`: Defines the project dependencies and scripts.
*   `tsconfig.json`: The TypeScript compiler configuration.
*   `nest-cli.json`: The NestJS CLI configuration.

# Building and Running

## Installation

To install the dependencies, run:

```bash
npm install
```

## Running the Application

To run the application in development mode with watch, run:

```bash
npm run start:dev
```

To run the application in production mode, run:

```bash
npm run start:prod
```

## Running Tests

To run the unit tests, run:

```bash
npm run test
```

To run the end-to-end tests, run:

```bash
npm run test:e2e
```

# Development Conventions

*   **Coding Style**: The project uses Prettier for code formatting. To format the code, run `npm run format`.
*   **Linting**: The project uses ESLint for linting. To lint the code, run `npm run lint`.
*   **API Documentation**: The project uses Swagger for API documentation. When the application is running in development mode, the Swagger UI is available at `/docs`.
*   **Database Migrations**: The project uses TypeORM migrations to manage database schema changes. To run the migrations, use the `npm run migration:run` command. To generate a new migration, use the `npm run migration:generate --name=<migration-name>` command.
*   **WebSockets**: The project uses WebSockets for real-time communication. The main WebSocket gateway is located in `src/modules/chat/chat.gateway.ts`.
