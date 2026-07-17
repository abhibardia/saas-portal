# API Specification

All endpoints are authenticated using a JWT token in the `Authorization: Bearer <token>` header.

## Tenants
### GET `/api/tenants`
Retrieves a list of tenants.
- **Roles Allowed**: Administrator
- **Query Parameters**: None
- **Response**: `200 OK`
  ```json
  [
    {
      "id": "uuid",
      "name": "string",
      "description": "string",
      "createdAt": "ISO8601 Timestamp"
    }
  ]
  ```

## Users
### GET `/api/users`
Retrieves a list of users.
- **Roles Allowed**: Administrator, Tenant Owner (restricted to their tenant)
- **Query Parameters**: `tenantId` (optional, for Admin filtering)
- **Response**: `200 OK`
  ```json
  [
    {
      "id": "uuid",
      "username": "string",
      "email": "string",
      "role": "admin|tenant_owner|end_user",
      "tenantId": "uuid",
      "createdAt": "ISO8601 Timestamp"
    }
  ]
  ```

### PUT `/api/users/:id`
Updates a user's details or role.
- **Roles Allowed**: Administrator, Tenant Owner (can only modify users in their own tenant, cannot elevate to admin)
- **Request Body**:
  ```json
  {
    "username": "string (optional)",
    "email": "string (optional)",
    "role": "string (optional)"
  }
  ```
- **Response**: `200 OK`
  ```json
  {
    "id": "uuid",
    "username": "string",
    "email": "string",
    "role": "string",
    "tenantId": "uuid"
  }
  ```

### DELETE `/api/users/:id`
Deletes a user.
- **Roles Allowed**: Administrator, Tenant Owner (can only delete users in their own tenant)
- **Response**: `204 No Content`

## Transactions
### GET `/api/transactions`
Retrieves a list of transactions.
- **Roles Allowed**: Administrator, Tenant Owner (restricted to their tenant), End User (restricted to their own transactions)
- **Query Parameters**: `userId` (optional), `tenantId` (optional, admin only)
- **Response**: `200 OK`
  ```json
  [
    {
      "id": "uuid",
      "type": "string",
      "amount": "number",
      "userId": "uuid",
      "tenantId": "uuid",
      "createdAt": "ISO8601 Timestamp"
    }
  ]
  ```

### POST `/api/transactions`
Creates a new transaction.
- **Roles Allowed**: End User
- **Request Body**:
  ```json
  {
    "type": "string",
    "amount": "number"
  }
  ```
- **Response**: `201 Created`
  ```json
  {
    "id": "uuid",
    "type": "string",
    "amount": "number",
    "userId": "uuid",
    "tenantId": "uuid",
    "createdAt": "ISO8601 Timestamp"
  }
  ```
