'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { getToken, clearToken } from '../lib/api';
import Sidebar from '../components/Sidebar';
import ChatPanel from '../components/ChatPanel';

export default function DashboardPage() {
  const router = useRouter();
  const [ready, setReady] = useState(false);

  useEffect(() => {
    if (!getToken()) {
      router.replace('/login');
    } else {
      setReady(true);
    }
  }, [router]);

  function handleLogout() {
    clearToken();
    router.replace('/login');
  }

  if (!ready) return null;

  return (
    <div style={{ display: 'flex' }}>
      <Sidebar onLogout={handleLogout} />
      <ChatPanel />
    </div>
  );
}

//https://main.dxj0l2n0qnvwz.amplifyapp.com/