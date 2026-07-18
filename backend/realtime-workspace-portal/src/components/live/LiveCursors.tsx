'use client';

import { useEffect, useState } from 'react';
import { getSocket } from '@/lib/socket';

type Presence = {
  id: string;
  x: number;
  y: number;
  color: string;
  name: string;
};

export default function LiveCursors() {
  const [presences, setPresences] = useState<Presence[]>([]);
  const socket = getSocket();

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      socket.emit('cursor-move', { x: e.clientX, y: e.clientY });
    };

    window.addEventListener('mousemove', handleMouseMove);
    
    socket.on('presence-update', (entries: [string, any][]) => {
      const activeUsers = entries
        .map(([id, data]) => ({ id, ...data }))
        .filter((user) => user.id !== socket.id); // Exclude self
      setPresences(activeUsers);
    });

    return () => {
      window.removeEventListener('mousemove', handleMouseMove);
      socket.off('presence-update');
    };
  }, [socket]);

  return (
    <>
      {presences.map((p) => (
        <div
          key={p.id}
          className="pointer-events-none fixed top-0 left-0 z-50 transition-all duration-100 ease-linear"
          style={{ transform: `translate(${p.x}px, ${p.y}px)` }}
        >
          <svg
            width="24"
            height="36"
            viewBox="0 0 24 36"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
            className="drop-shadow-md"
          >
            <path
              d="M5.65376 21.1597L3.1074 2.82512C2.88372 1.21447 4.54228 0.161099 5.86435 0.957519L21.7208 10.5113C22.9734 11.2662 22.8459 13.1118 21.5034 13.6669L15.3524 16.2084C14.7709 16.4487 14.3312 16.9205 14.1353 17.5132L12.0463 23.8344C11.6033 25.1752 9.69991 25.2289 9.18375 23.9059L5.65376 21.1597Z"
              fill={p.color}
              stroke="white"
              strokeWidth="1.5"
            />
          </svg>
          <div
            className="absolute left-4 top-5 rounded-md px-2 py-0.5 text-xs font-semibold text-white whitespace-nowrap shadow-sm"
            style={{ backgroundColor: p.color }}
          >
            {p.name}
          </div>
        </div>
      ))}
    </>
  );
}
