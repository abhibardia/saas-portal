import { cookies } from 'next/headers';
import { decrypt } from '@/lib/auth';
import ProfileForm from './ProfileForm';

export default async function ProfilePage() {
  const sessionCookie = (await cookies()).get('session')?.value;
  if (!sessionCookie) return null;
  const session = await decrypt(sessionCookie);

  return (
    <div>
      <h2 style={{ marginBottom: '24px' }}>My Profile</h2>
      <ProfileForm userId={session.userId as string} />
    </div>
  );
}
