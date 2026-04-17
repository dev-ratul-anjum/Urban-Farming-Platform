# Urban Farming Platform Backend API

A robust, scalable REST API for the Urban Farming Platform. The backend is designed to facilitate communities, vendor transactions, rental space bookings, plant tracking, and more, leveraging modern backend technologies and best practices.

## 🚀 Tech Stack

- **Framework**: [Express.js](https://expressjs.com/) & [Node.js](https://nodejs.org/)
- **Language**: [TypeScript](https://www.typescriptlang.org/)
- **Database**: [PostgreSQL](https://www.postgresql.org/)
- **ORM**: [Prisma](https://www.prisma.io/) (with Multi-file schema standard)
- **Validation**: [Zod](https://zod.dev/)
- **Authentication**: JWT (`jsonwebtoken`) & `bcryptjs`
- **File Uploads**: `multer` & [Cloudinary](https://cloudinary.com/)
- **Security & Formatting**: `express-rate-limit`, `cors`, `cookie-parser`

## ✨ Features

- **Authentication & Authorization**: Secure JWT-based authentication using HTTP-Only cookies, with Role-Based Access Control (RBAC).
- **Domain-Driven Architecture**: Clean module-based structure for isolating schemas, models, controllers, and routes.
- **Rental Space & Booking Management**: Rentable urban farming spaces with availability tracking and reservation features.
- **Produce Marketplace & Orders**: E-commerce features for selling farm produces and managing fulfillment (orders).
- **Plant Growth Tracking**: Features to monitor and manage plant lifecycles.
- **Community Forum**: Social elements allowing farmers to share updates via community posts.
- **Media Uploads**: Seamless integration with Cloudinary for scalable image attachments and processing.
- **Centralized Error Handling**: Type-safe error wrapping (`catchAsync`), unified Prisma error parsers, and custom API Error classes.

## 📁 Folder Structure

```text
backend/
├── src/
│   ├── middlewares/    # Custom middlewares (Rate Limit, Auth checks, Error Handlers, Zod Validation)
│   ├── modules/        # Domain-driven features (users, auth, orders, bookings, etc.)
│   │   ├── admin/
│   │   ├── auth/
│   │   ├── booking/
│   │   ├── community-post/
│   │   ├── order/
│   │   ├── plant-tracking/
│   │   ├── produce/
│   │   ├── rental-space/
│   │   └── users/
│   ├── prisma/         # Prisma configuration
│   │   └── schema/     # Multi-file Prisma schemas and entities
│   ├── types/          # Global TypeScript interfaces
│   ├── utils/          # Core utilities (Cloudinary, catchAsync, env setups, Response formatters)
│   ├── app.ts          # Express App configuration and middleware bindings
│   ├── router.ts       # Global Application Router
│   └── server.ts       # Server bootstrap and entry point
├── .env                # Secret environment variables (ignored by git)
├── .env.example        # Reference environment variables
├── package.json        # Dependencies & NPM Scripts
└── tsconfig.json       # TypeScript configuration
```

## ⚙️ Environment Variables

Create a `.env` file at the root of the project to get started. Below is an explanation of required fields:

| Variable                  | Description                                                         |
| :------------------------ | :------------------------------------------------------------------ |
| `NODE_ENV`                | Environment stage. (`development`, `production`)                    |
| `PORT`                    | API port number (Default: `4000`)                                   |
| `CORS_ORIGINS`            | Explicitly allowed domains for CORS. (e.g. `http://localhost:5173`) |
| `DATABASE_URL`            | Your PostgreSQL Connection URI (e.g., via NeonDB)                   |
| `ACCESS_TOKEN_NAME`       | The cookie key where the JWT token is kept.                         |
| `JWT_SECRET`              | Unique secure secret key used to sign JWTs.                         |
| `ACCESS_TOKEN_EXPIRES_IN` | JWT string expiration time. (e.g. `7d`)                             |
| `COOKIE_SECRET`           | Secret string for parsing signed cookies securely.                  |
| `CLOUDINARY_CLOUD_NAME`   | Cloudinary Account Service ID.                                      |
| `CLOUDINARY_API_KEY`      | Cloudinary Secret API Key.                                          |
| `CLOUDINARY_API_SECRET`   | Cloudinary API Client Secret.                                       |

### Sample `.env.example`

```env
NODE_ENV="development"
PORT="4000"
CORS_ORIGINS="http://localhost:5173"

# Database Configuration
DATABASE_URL="postgresql://user:password@host:port/database"

# Authentication & Cookies
ACCESS_TOKEN_NAME="auth_token"
JWT_SECRET="super_secret_jwt_string"
ACCESS_TOKEN_EXPIRES_IN="7d"
COOKIE_SECRET="super_secret_cookie_string"

# Cloudinary Integration
CLOUDINARY_CLOUD_NAME="your_cloud_name"
CLOUDINARY_API_KEY="00000000000000"
CLOUDINARY_API_SECRET="your_cloudinary_api_secret"
```

## 🛠️ Installation & Setup

Follow these steps to seamlessly bootstrap the development environment:

1. **Clone the repository:**

   ```bash
   git clone <https://github.com/dev-ratul-anjum/Urban-Farming-Platform.git>
   cd Urban-Farming-Platform/backend
   ```

2. **Install Dependencies:**

   ```bash
   yarn install
   # or npm install
   ```

3. **Configure Environment:**
   Copy the `sample .env.example` format above into a root `.env` file. Update DB credentials and Cloudinary API Tokens.

4. **Initialize Prisma (Setup Database):**

   ```bash
   # Generates TypeScript definitions from Prisma schema
   yarn prisma:generate

   # Pushes schema state into dev DB or Run Migrations
   yarn prisma:db:push
   # or `yarn prisma:migrate` depending on dev preferences
   ```

5. **Start Dev Server:**
   ```bash
   yarn dev
   ```

## 📊 Prisma Configuration

This project implements **Multi-file Prisma schemas**, placing individual schema definitions cleanly into the `src/prisma/schema/*.prisma` directory instead of a monolithic file.

### Common Prisma Commands:

- `yarn prisma:generate` - Updates the Prisma Client definitions. **Run this every time you modify a `.prisma` file.**
- `yarn prisma:db:push` - Synchronizes your schema updates locally directly to the NeonDB/PostgreSQL development instance.
- `yarn prisma:migrate` - Applies structural changes creating standard migration history files.
- `yarn prisma:studio` - Launches Prisma's visual UI Database browser on `localhost:5555`.

## 🛣️ API Routes Overview

Base API route format: `http://localhost:4000/api`

| Route Prefix           | Short Description                                           |
| :--------------------- | :---------------------------------------------------------- |
| `/api/auth`            | Login, Registration, JWT issuing processes and logout.      |
| `/api/users`           | Retrieve and update profile configurations.                 |
| `/api/admin`           | Platform-wide sensitive administrative operations.          |
| `/api/community-posts` | Interactions for user-created discussion threads and posts. |
| `/api/rental-spaces`   | Browsing and creation of bookable urban farming lands.      |
| `/api/bookings`        | Space rental application endpoints.                         |
| `/api/produces`        | Marketplace inventory operations for crops.                 |
| `/api/orders`          | Ordering functionalities, updating statuses, and purchases. |
| `/api/plant-tracking`  | Lifecycle endpoints for plant-growing processes.            |

## 🛡️ Security Features

- **Rate Limiting:** Protects against DDOS/Brute force attacks utilizing `express-rate-limit` middleware (`src/middlewares/rateLimiter.ts`).
- **Zod Schema Validation:** Automatically rejects invalid or malicious incoming payload payloads using `validateSchema.ts` typed middleware guarantees.
- **Secure Authentication:** Implementation utilizes hashed passwords (`bcryptjs`) alongside cookie-parser for avoiding exposed local-storage vulnerability risks via HTTP-only Cookies.
- **Sanitized Error Processing:** The `errorHandler.ts` middleware traps internal server crashing issues to provide consistent and stack-trace-redacted JSON envelopes in production states.
- **CORS Configured Protocol:** Explicit cross-origin allowance strictly regulating accessible domains setup inside `utils/corsOptions.ts`.
