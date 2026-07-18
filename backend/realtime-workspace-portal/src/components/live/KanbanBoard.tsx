'use client';

import { useEffect, useState } from 'react';
import { getSocket } from '@/lib/socket';
import { Plus, GripVertical } from 'lucide-react';

type Task = {
  id: string;
  title: string;
  status: 'To Do' | 'In Progress' | 'Done';
};

const columns = ['To Do', 'In Progress', 'Done'] as const;

export default function KanbanBoard() {
  const [tasks, setTasks] = useState<Task[]>([]);
  const [newTaskTitle, setNewTaskTitle] = useState('');
  const [draggedTaskId, setDraggedTaskId] = useState<string | null>(null);
  const socket = getSocket();

  useEffect(() => {
    socket.on('init-tasks', (initialTasks: Task[]) => {
      setTasks(initialTasks);
    });

    socket.on('task-update', (updatedTasks: Task[]) => {
      setTasks(updatedTasks);
    });

    return () => {
      socket.off('init-tasks');
      socket.off('task-update');
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
    if (newTaskTitle.trim()) {
      socket.emit('task-add', { title: newTaskTitle.trim() });
      setNewTaskTitle('');
    }
  };

  return (
    <div className="flex flex-col gap-6 w-full max-w-6xl mx-auto mt-12 p-4">
      <div className="flex items-center justify-between">
        <h2 className="text-3xl font-bold tracking-tight text-slate-800 dark:text-white">Collaborative Board</h2>
        
        <form onSubmit={addTask} className="flex gap-2">
          <input
            type="text"
            placeholder="Add new task..."
            value={newTaskTitle}
            onChange={(e) => setNewTaskTitle(e.target.value)}
            className="px-4 py-2 bg-white/50 dark:bg-slate-800/50 backdrop-blur-sm border border-slate-200 dark:border-slate-700 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
          <button
            type="submit"
            className="flex items-center justify-center bg-blue-600 hover:bg-blue-700 text-white p-2 rounded-lg transition-colors shadow-sm"
          >
            <Plus size={20} />
          </button>
        </form>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {columns.map((col) => (
          <div
            key={col}
            onDragOver={handleDragOver}
            onDrop={(e) => handleDrop(e, col)}
            className="flex flex-col bg-slate-100/50 dark:bg-slate-900/50 backdrop-blur-md border border-slate-200 dark:border-slate-800 rounded-xl p-4 min-h-[500px]"
          >
            <h3 className="font-semibold text-slate-700 dark:text-slate-300 mb-4">{col}</h3>
            
            <div className="flex flex-col gap-3">
              {tasks
                .filter((t) => t.status === col)
                .map((task) => (
                  <div
                    key={task.id}
                    draggable
                    onDragStart={(e) => handleDragStart(e, task.id)}
                    className="flex items-start gap-2 bg-white dark:bg-slate-800 p-4 rounded-lg shadow-sm border border-slate-100 dark:border-slate-700 cursor-grab active:cursor-grabbing hover:shadow-md transition-shadow"
                  >
                    <GripVertical size={16} className="text-slate-400 mt-0.5 flex-shrink-0" />
                    <span className="text-sm text-slate-700 dark:text-slate-200">{task.title}</span>
                  </div>
                ))}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
