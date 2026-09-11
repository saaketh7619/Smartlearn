'use client';

import React, { useEffect } from 'react';
import { useStore } from '@/store/useStore';
import { Role } from '@/types';

interface RoleGuardProps {
  requiredRole: Role;
  children: React.ReactNode;
}

export function RoleGuard({ requiredRole, children }: RoleGuardProps) {
  const currentUser = useStore((state) => state.currentUser);
  const switchDemoRole = useStore((state) => state.switchDemoRole);

  useEffect(() => {
    // Synchronize active role in background without delaying or blocking portal rendering
    if (currentUser?.role !== requiredRole) {
      switchDemoRole(requiredRole);
    }
  }, [currentUser?.role, requiredRole, switchDemoRole]);

  // Render the portal content immediately without artificial mount delay or full-page spinner
  return <>{children}</>;
}
