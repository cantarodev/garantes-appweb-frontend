import ProtectedRoute from 'src/components/protected-route';
import { Seo } from 'src/components/seo';
import { usePageView } from 'src/hooks/use-page-view';
import LoginPage from 'src/pages/auth/login';

const Page = () => {
  usePageView();

  return (
    <>
      <Seo />
      <main>
        <ProtectedRoute redirectTo="/dashboard/analytics/seace">
          <LoginPage />
        </ProtectedRoute>
      </main>
    </>
  );
};

export default Page;
