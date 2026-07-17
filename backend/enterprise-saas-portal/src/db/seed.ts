import { db } from './index';
import { users, tenants } from './schema';
import * as bcrypt from 'bcryptjs';

async function seed() {
  console.log('Seeding database...');
  
  // Create a tenant
  const newTenant = await db.insert(tenants).values({
    name: 'Acme Corp',
    description: 'A test tenant',
  }).returning();

  const tenantId = newTenant[0].id;
  
  // Create an admin user
  const hashedPassword = await bcrypt.hash('password123', 10);

  await db.insert(users).values({
    username: 'admin',
    email: 'admin@example.com',
    password: hashedPassword,
    role: 'admin',
    tenantId: tenantId,
  });

  console.log('Database seeded! Login with admin@example.com / password123');
  process.exit(0);
}

seed().catch(err => {
  console.error(err);
  process.exit(1);
});
