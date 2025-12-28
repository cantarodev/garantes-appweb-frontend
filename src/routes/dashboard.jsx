import { lazy, Suspense } from 'react';
import { Outlet } from 'react-router-dom';
import { RoleGuard } from 'src/guards/role-guard';

import { Layout as DashboardLayout } from 'src/layouts/dashboard';

// User
const UserPage = lazy(() => import('src/pages/dashboard/users'));

// Analytic
const AnalyticsSeacePage = lazy(() => import('src/pages/dashboard/analytics/seace'));
const AnalyticsMiviviendaPage = lazy(() => import('src/pages/dashboard/analytics/mivivienda'));

// Other
const AccountPage = lazy(() => import('src/pages/dashboard/account'));

export const dashboardRoutes = [
  {
    path: 'dashboard',
    element: (
      <DashboardLayout>
        <Suspense>
          <Outlet />
        </Suspense>
      </DashboardLayout>
    ),
    children: [
      {
        path: 'users',
        element: (
          <RoleGuard allowedRoles={['admin']}>
            <UserPage />
          </RoleGuard>
        ),
      },

      {
        path: 'account',
        element: <AccountPage />,
      },
      {
        path: 'analytics',
        children: [
          {
            path: 'seace',
            element: <AnalyticsSeacePage />,
          },
          {
            path: 'mivivienda',
            element: <AnalyticsMiviviendaPage />,
          },
        ],
      },
    ],
  },
];
