'use client';

import { useEffect, useState } from 'react';
import { getSocket } from '@/lib/socket';
import { Plus, GripVertical, Trash2, LogOut, Users } from 'lucide-react';
import { toast } from 'react-hot-toast';
import { taskSchema } from '@/lib/validations';
import { useRouter } from 'next/navigation';

type Task = {
  id: string;
  title: string;
  status: 'To Do' | 'In Progress' | 'Done';
};

type Presence = {
  id: string;
  x: number;
  y: number;
  color: string;
  name: string;
};

const columns = ['To Do', 'In Progress', 'Done'] as const;

export default function KanbanBoard() {
  const [tasks, setTasks] = useState<Task[]>([]);
  const [newTaskTitle, setNewTaskTitle] = useState('');
  const [draggedTaskId, setDraggedTaskId] = useState<string | null>(null);
  const [activeUsers, setActiveUsers] = useState<Presence[]>([]);
  const socket = getSocket();
  const router = useRouter();

  useEffect(() => {
    socket.on('init-tasks', (initialTasks: Task[]) => {
      setTasks(initialTasks);
    });

    socket.on('task-update', (updatedTasks: Task[]) => {
      setTasks(updatedTasks);
    });

    socket.on('presence-update', (users: [string, Presence][]) => {
      setActiveUsers(users.map(([, presence]) => presence));
    });

    socket.on('error', (err: { message: string }) => {
      toast.error(err.message);
    });

    return () => {
      socket.off('init-tasks');
      socket.off('task-update');
      socket.off('presence-update');
      socket.off('error');
    };
  }, [socket]);

  const handleDragStart = (e: React.DragEvent, id: string) => {
    setDraggedTaskId(id);
    e.dataTransfer.effectAllowed = 'move';
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    e.dataTransfer.dropEffect = 'move';
  };

  const handleDrop = (e: React.DragEvent, status: Task['status']) => {
    e.preventDefault();
    if (draggedTaskId) {
      socket.emit('task-move', { id: draggedTaskId, newStatus: status });
      setDraggedTaskId(null);
    }
  };

  const addTask = (e: React.FormEvent) => {
    e.preventDefault();
    const result = taskSchema.safeParse({ title: newTaskTitle.trim() });
    
    if (!result.success) {
      toast.error(result.error.errors[0].message);
      return;
    }

    socket.emit('task-add', { title: result.data.title });
    setNewTaskTitle('');
    toast.success('Task added');
  };

  const deleteTask = (id: string) => {
    socket.emit('task-delete', { id });
    toast.success('Task deleted');
  };

  const handleLogout = () => {
    document.cookie = 'auth_token=; path=/; expires=Thu, 01 Jan 1970 00:00:01 GMT;';
    socket.disconnect();
    toast.success('Logged out');
    router.push('/login');
  };

  return (
    <div className="flex flex-col gap-6 w-full max-w-7xl mx-auto mt-6 p-4">
      {/* Header Bar */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 bg-white/40 dark:bg-slate-900/40 backdrop-blur-md p-4 rounded-2xl border border-slate-200/50 dark:border-slate-800/50 shadow-sm">
        <div className="flex items-center gap-4">
          <div className="flex items-center gap-2">
            <Users size={20} className="text-slate-500" />
            <span className="font-medium text-slate-700 dark:text-slate-300">
              {activeUsers.length} Active User{activeUsers.length !== 1 ? 's' : ''}
            </span>
          </div>
          <div className="flex -space-x-2">
            {activeUsers.map(u => (
              <div 
                key={u.id} 
                className="w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold text-white border-2 border-white dark:border-slate-900 shadow-sm"
                style={{ backgroundColor: u.color }}
                title={u.name}
              >
                {u.name.charAt(0)}
              </div>
            ))}
          </div>
        </div>

        <div className="flex items-center gap-4">
          <form onSubmit={addTask} className="flex gap-2">
            <input
              type="text"
              placeholder="Add new task..."
              value={newTaskTitle}
              onChange={(e) => setNewTaskTitle(e.target.value)}
              className="px-4 py-2 bg-white/80 dark:bg-slate-800/80 backdrop-blur-sm border border-slate-200 dark:border-slate-700 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 w-64"
            />
            <button
              type="submit"
              className="flex items-center justify-center bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg transition-colors shadow-sm"
            >
              <Plus size={20} />
            </button>
          </form>
          <button 
            onClick={handleLogout}
            className="flex items-center gap-2 px-4 py-2 text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-lg transition-colors border border-transparent hover:border-slate-200 dark:hover:border-slate-700"
          >
            <LogOut size={18} />
            <span className="hidden sm:inline">Logout</span>
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {columns.map((col) => (
          <div
            key={col}
            onDragOver={handleDragOver}
            onDrop={(e) => handleDrop(e, col)}
            className="flex flex-col bg-slate-100/30 dark:bg-slate-900/30 backdrop-blur-xl border border-slate-200/50 dark:border-slate-800/50 rounded-2xl p-4 min-h-[600px] shadow-sm relative overflow-hidden group"
          >
            {/* Dynamic Column Header */}
            <div className="flex items-center justify-between mb-4 border-b border-slate-200 dark:border-slate-700 pb-3">
              <h3 className="font-semibold text-slate-700 dark:text-slate-200">{col}</h3>
              <span className="bg-slate-200 dark:bg-slate-800 text-slate-600 dark:text-slate-400 text-xs px-2.5 py-1 rounded-full font-medium">
                {tasks.filter((t) => t.status === col).length}
              </span>
            </div>
            
            <div className="flex flex-col gap-3">
              {tasks
                .filter((t) => t.status === col)
                .map((task) => (
                  <div
                    key={task.id}
                    draggable
                    onDragStart={(e) => handleDragStart(e, task.id)}
                    className="group/card flex flex-col gap-2 bg-white/90 dark:bg-slate-800/90 p-4 rounded-xl shadow-sm border border-slate-100 dark:border-slate-700 cursor-grab active:cursor-grabbing hover:shadow-md hover:border-blue-200 dark:hover:border-blue-900/50 transition-all backdrop-blur-sm relative"
                  >
                    <div className="flex items-start justify-between">
                      <div className="flex items-start gap-2 pr-6">
                        <GripVertical size={16} className="text-slate-400 mt-0.5 flex-shrink-0 cursor-grab active:cursor-grabbing hover:text-slate-600" />
                        <span className="text-sm font-medium text-slate-700 dark:text-slate-200 leading-snug break-words">
                          {task.title}
                        </span>
                      </div>
                      
                      <button 
                        onClick={() => deleteTask(task.id)}
                        className="absolute right-3 top-3 text-slate-400 hover:text-red-500 opacity-0 group-hover/card:opacity-100 transition-opacity bg-white dark:bg-slate-800 rounded p-1"
                        title="Delete task"
                      >
                        <Trash2 size={16} />
                      </button>
                    </div>
                  </div>
                ))}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
