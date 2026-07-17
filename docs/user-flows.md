# User Flows

This document details the core user stories and their associated flows within the Multi-Tenant SaaS Portal.

## 1. Administrator Managing Tenants
**Goal**: View and oversee all tenants on the platform.
1. **Login**: Administrator logs in with Admin credentials.
2. **Dashboard**: Routed to the global dashboard showing platform-wide telemetry stats.
3. **Navigate to Tenants**: Clicks "Tenants" in the sidebar.
4. **View Tenants**: The platform makes a `GET /api/tenants` request. Admin sees a table of all tenants.
5. *(Future Action)*: Admin can click on a tenant to view details or manage that specific tenant's settings.

## 2. Administrator Managing Users/Roles Globally
**Goal**: View, edit, or delete any user on the platform.
1. **Navigate to Users**: From the dashboard, Admin clicks "Users" in the sidebar.
2. **View Users**: The platform makes a `GET /api/users` request. Admin sees a list of all users across all tenants.
3. **Edit Role**: Admin clicks "Edit" on a specific user, changes the role to `tenant_owner` or `end_user`, and submits (`PUT /api/users/:id`).
4. **Delete User**: Admin clicks "Delete" on a specific user, confirms the prompt, and the user is removed (`DELETE /api/users/:id`).

## 3. Tenant Owner Managing Their Tenant's Users
**Goal**: Manage users specifically belonging to their own tenant.
1. **Login**: Tenant Owner logs in.
2. **Dashboard**: Routed to their tenant-specific dashboard, showing telemetry for their tenant only.
3. **Navigate to Users**: Clicks "Users".
4. **View Users**: The platform makes a `GET /api/users` request (middleware scopes this to their `tenantId`). They see a list of users in their tenant.
5. **Manage Users**: They can edit (`PUT /api/users/:id`) or remove (`DELETE /api/users/:id`) end users within their tenant.

## 4. End User Creating a Transaction
**Goal**: Record a new transaction.
1. **Login**: End User logs in.
2. **Navigate to Create Transaction**: Clicks "New Transaction" or navigates to `/transactions/new`.
3. **Submit Form**: User enters the transaction `type` and `amount` and clicks "Submit".
4. **Process**: The platform makes a `POST /api/transactions` request. The API associates the transaction with the user's ID and tenant ID.
5. **Confirmation**: User is redirected to their transaction history with a success toast message.

## 5. End User Viewing Their Transaction History
**Goal**: Review past transactions.
1. **Login**: End User logs in and arrives at their dashboard.
2. **Navigate to Transactions**: Clicks "Transactions" in the sidebar.
3. **View History**: The platform makes a `GET /api/transactions` request (middleware scopes this to their `userId`). User sees a table of only their submitted transactions.
