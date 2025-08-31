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
yarn install
```

## Running the Application

To run the application in development mode with watch, run:

```bash
yarn run start:dev
```

To run the application in production mode, run:

```bash
yarn run start:prod
```

## Running Tests

To run the unit tests, run:

```bash
yarn run test
```

To run the end-to-end tests, run:

```bash
yarn run test:e2e
```

# Development Conventions

*   **Coding Style**: The project uses Prettier for code formatting. To format the code, run `yarn run format`.
*   **Linting**: The project uses ESLint for linting. To lint the code, run `yarn run lint`.
*   **API Documentation**: The project uses Swagger for API documentation. When the application is running in development mode, the Swagger UI is available at `/docs`.
*   **Database Migrations**: The project uses TypeORM migrations to manage database schema changes. To run the migrations, use the `yarn run migration:run` command. To generate a new migration, use the `yarn run migration:generate --name=<migration-name>` command.
*   **WebSockets**: The project uses WebSockets for real-time communication. The main WebSocket gateway is located in `src/modules/chat/chat.gateway.ts`.

# Instructions

This section provides step-by-step instructions for common development tasks.

## Environment Setup

1.  **Create Environment File**: Copy the example environment file:

    ```bash
    cp .env.example .env
    ```

2.  **Update Variables**: Open the `.env` file and update the variables, especially the database connection details (`DB_HOST`, `DB_PORT`, `DB_USERNAME`, `DB_PASSWORD`, `DB_DATABASE`) and JWT secret (`JWT_SECRET`).

## Database Migrations

When you make changes to the TypeORM entities, you need to create and run a migration to update the database schema.

1.  **Generate a Migration**: After changing an entity, run the following command. Replace `YourMigrationName` with a descriptive name for your changes (e.g., `AddAvatarToUser`).

    ```bash
    yarn run migration:generate --name=YourMigrationName
    ```

    This will create a new migration file in the `migrations` directory.

2.  **Run Migrations**: To apply all pending migrations to your database, run:

    ```bash
    yarn run migration:run
    ```

## Generating New Modules

Use the NestJS CLI to scaffold new modules, controllers, services, etc., to maintain consistency.

1.  **Generate a Module**: To create a new feature module:

    ```bash
    nest generate module modules/your-feature-name
    ```

2.  **Generate a Controller**:

    ```bash
    nest generate controller modules/your-feature-name
    ```

3.  **Generate a Service**:

    ```bash
    nest generate service modules/your-feature-name
    ```

## Interacting with the WebSocket API

The application uses WebSockets for real-time chat. You can use a WebSocket client like [Postman](https://www.postman.com/downloads/) or a simple command-line tool to test the events.

*   **Connection URL**: `ws://localhost:5000` (or your configured port)
*   **Key Events**: Refer to `src/modules/chat/chat.gateway.ts` for a full list of events. Some key events are:
    *   `join-room`: To join a chat room.
    *   `send-message`: To send a message to a room.
    *   `receive-message`: To listen for incoming messages.

## Authentication and Authorization

The application uses JWT for authentication. Most routes are protected by default.

1.  **Public Routes**: To make a route public (e.g., for login or registration), use the `@Public()` decorator.

    ```typescript
    import { Public } from 'src/common/decorators/public.decorator';

    @Public()
    @Get('login')
    login() {
      // ...
    }
    ```

2.  **Accessing User Data**: In a protected route, you can access the authenticated user's data (the JWT payload) using the `@AuthUser()` decorator.

    ```typescript
    import { AuthUser } from 'src/common/decorators/auth-user.decorator';
    import { UserPayload } from 'src/modules/auth/dto/user-payload.dto';

    @Get('profile')
    getProfile(@AuthUser() user: UserPayload) {
      return user;
    }
    ```

3.  **Role-Based Access**: You can restrict access to certain roles using the `@Roles()` decorator. This works for both standard HTTP routes and WebSocket gateways.

    ```typescript
    import { Roles } from 'src/common/decorators/roles.decorator';
    import { ChatRoles } from 'src/entities/chatMember.entity';

    @Post('admin-action')
    @Roles([ChatRoles.ADMIN])
    adminAction() {
      // This can only be accessed by users with the ADMIN role in a chat
    }
    ```