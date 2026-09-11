'use client';

import React, { useEffect } from 'react';
import { useRouter, usePathname } from 'next/navigation';
import { Sidebar } from '@/components/layout/Sidebar';
import { RoleGuard } from '@/components/shared/RoleGuard';
import { useStore } from '@/store/useStore';

function StudentOnboardingCheck({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}

export default function StudentLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <RoleGuard requiredRole="STUDENT">
      <StudentOnboardingCheck>
        <div className="flex-1 flex w-full">
          <Sidebar />
          <div className="flex-1 overflow-x-hidden p-4 sm:p-6 lg:p-8 max-w-7xl mx-auto w-full">
            {children}
          </div>
        </div>
      </StudentOnboardingCheck>
    </RoleGuard>
  );
}
