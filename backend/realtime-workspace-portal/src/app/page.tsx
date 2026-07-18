import LiveCursors from '@/components/live/LiveCursors';
import KanbanBoard from '@/components/live/KanbanBoard';
import { cookies } from 'next/headers';
import { redirect } from 'next/navigation';
import { verifyToken } from '@/lib/auth';

export default async function Home() {
  const cookieStore = await cookies();
  const token = cookieStore.get('auth_token')?.value;

  if (!token) {
    redirect('/login');
  }

  const user = await verifyToken(token);
  if (!user) {
    redirect('/login');
  }

  return (
    <main className="min-h-screen bg-slate-50 dark:bg-slate-950 relative overflow-hidden">
      {/* Abstract Background Elements */}
      <div className="absolute top-[-10%] left-[-10%] w-96 h-96 bg-blue-500/20 rounded-full blur-[100px] pointer-events-none" />
      <div className="absolute bottom-[-10%] right-[-10%] w-96 h-96 bg-purple-500/20 rounded-full blur-[100px] pointer-events-none" />
      
      <LiveCursors />
      
      <div className="relative z-10 pt-16">
        <div className="text-center mb-8">
          <h1 className="text-4xl md:text-5xl font-extrabold tracking-tight text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-purple-600">
            Real-Time Workspace
          </h1>
          <p className="text-slate-600 dark:text-slate-400 mt-4 max-w-2xl mx-auto">
            Logged in as {user.name} ({user.email}). Experience real-time collaboration with live cursors and instant state synchronization.
          </p>
        </div>
        
        <KanbanBoard />
      </div>
    </main>
  );
}
