# System Overview

This document provides a technical high-level overview of the HireMintora backend architecture, core components, and primary business logic flows.

## 1. Architecture Overview

The system is built as a **Node.js Express** application utilizing **Prisma ORM** for database management and **WebSocket** for real-time interactions.

- **Storage**: PostgreSQL (hosted on Supabase)
- **ORM**: Prisma (schema located in `server/prisma/schema.prisma`)
- **Real-time**: Custom WebSocket implementation for interview simulations
- **Authentication**: JWT-based (Manual & OAuth)

## 2. Core Modules

### Authentication (`src/api/auth`)
Handles user identity management via two paths:
- **Manual**: Standard email/password signup and login with bcrypt hashing.
- **OAuth**: Integration with Supabase Auth for third-party providers (Google, GitHub).

### Organization Management (`src/api/organisation`)
The system follows a multi-tenant structure where users either create or join an organization via a unique `orgCode`.
- **CREATE**: Initializes a new organization and sets the user as `OWNER`.
- **JOIN**: Associates a user with an existing organization as a `MEMBER`.

### Hiring Drive (`src/api/drive`)
The heart of the recruitment workflow:
1. **Drive Creation**: Organizations define a role and description for a recruitment campaign.
2. **Candidate Import**: HR users upload candidate details (email, fullName).
3. **Token Generation**: Each candidate is assigned a unique 32-byte secure token.
4. **Invitation Dispatch**: Unique interview links (containing the token) are generated and sent to candidates.

## 3. Data Integrity & Relationships

The database schema ensures strict isolation:
- **Users** belong to exactly one **Organisation**.
- **HiringDrives** are owned by an **Organisation**.
- **DriveCandidates** are mapped to a specific **HiringDrive**.
- **Uniqueness**: A candidate email is unique within the scope of a single hiring drive to prevent duplicate assessment attempts.

## 4. Real-time Interview Engine

The WebSocket server (`src/websocket`) handles real-time interview simulations. It validates candidate tokens upon connection and manages full-duplex communication between the client and the AI interviewer service.

## 5. Documentation & API Reference

- **Swagger/OpenAPI**: Available at `/api-docs` or `/docs`.
- **AsyncAPI**: Defined in `server/asyncapi.yaml` for WebSocket event documentation.
