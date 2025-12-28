import { lazy } from 'react';
import { Outlet } from 'react-router-dom';

import { IssuerGuard } from 'src/guards/issuer-guard';
import { GuestGuard } from 'src/guards/guest-guard';
import { Layout as AuthLayout } from 'src/layouts/auth/classic-layout';
import { Issuer } from 'src/utils/auth';

// JWT
const LoginPage = lazy(() => import('src/pages/auth/login'));
const RegisterPage = lazy(() => import('src/pages/auth/register'));
const EmailSentPage = lazy(() => import('src/pages/auth/email-sent'));
const VerifyPage = lazy(() => import('src/pages/auth/verify'));
const ForgotPassword = lazy(() => import('src/pages/auth/forgot-password'));
const ResetPassword = lazy(() => import('src/pages/auth/reset-password'));

export const authRoutes = [
  {
    path: 'auth',
    element: (
      <IssuerGuard issuer={Issuer.JWT}>
        <GuestGuard>
          <AuthLayout>
            <Outlet />
          </AuthLayout>
        </GuestGuard>
      </IssuerGuard>
    ),

    children: [
      {
        path: 'login',
        element: <LoginPage />,
      },
      {
        path: 'register',
        element: <RegisterPage />,
      },
      {
        path: 'email-sent/:email',
        element: <EmailSentPage />,
      },
      {
        path: 'verify/:user_id/:token',
        element: <VerifyPage />,
      },
      {
        path: 'forgot-password',
        element: <ForgotPassword />,
      },
      {
        path: 'reset-password/:user_id/:token',
        element: <ResetPassword />,
      },
    ],
  },
];
