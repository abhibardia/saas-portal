import { pgTable, uuid, text, timestamp } from 'drizzle-orm/pg-core';

export const users = pgTable('users', {
  id: uuid('id').primaryKey().defaultRandom(),
  name: text('name').notNull(),
  email: text('email').notNull().unique(),
  password: text('password').notNull(),
  avatar_url: text('avatar_url'),
  created_at: timestamp('created_at').defaultNow().notNull(),
});

export const workspaces = pgTable('workspaces', {
  id: uuid('id').primaryKey().defaultRandom(),
  name: text('name').notNull(),
  created_at: timestamp('created_at').defaultNow().notNull(),
});

export const workspaceMembers = pgTable('workspace_members', {
  workspace_id: uuid('workspace_id').references(() => workspaces.id).notNull(),
  user_id: uuid('user_id').references(() => users.id).notNull(),
  role: text('role').notNull().default('member'), // admin | member
});

export const boards = pgTable('boards', {
  id: uuid('id').primaryKey().defaultRandom(),
  workspace_id: uuid('workspace_id').references(() => workspaces.id).notNull(),
  name: text('name').notNull(),
  created_at: timestamp('created_at').defaultNow().notNull(),
});

export const tasks = pgTable('tasks', {
  id: uuid('id').primaryKey().defaultRandom(),
  board_id: uuid('board_id').references(() => boards.id).notNull(),
  assignee_id: uuid('assignee_id').references(() => users.id),
  title: text('title').notNull(),
  description: text('description'),
  status: text('status').notNull().default('To Do'), // To Do | In Progress | Done
  updated_at: timestamp('updated_at').defaultNow().notNull(),
});
