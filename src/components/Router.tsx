import { MemberProvider } from '@/integrations';
import { createBrowserRouter, RouterProvider, Navigate, Outlet } from 'react-router-dom';
import { ScrollToTop } from '@/lib/scroll-to-top';
import ErrorPage from '@/integrations/errorHandlers/ErrorPage';
import { MemberProtectedRoute } from '@/components/ui/member-protected-route';

// Pages
import HomePage from '@/components/pages/HomePage';
import RegisterPage from '@/components/pages/RegisterPage';
import LoginPage from '@/components/pages/LoginPage';
import ExploreFreePage from '@/components/pages/ExploreFreePage';
import StorePage from '@/components/pages/StorePage';
import PremiumPage from '@/components/pages/PremiumPage';
import StudentDashboardPage from '@/components/pages/StudentDashboardPage';
import AdminDashboardPage from '@/components/pages/AdminDashboardPage';

// Layout component that includes ScrollToTop
function Layout() {
  return (
    <>
      <ScrollToTop />
      <Outlet />
    </>
  );
}

const router = createBrowserRouter([
  {
    path: "/",
    element: <Layout />,
    errorElement: <ErrorPage />,
    children: [
      {
        index: true,
        element: <HomePage />,
        routeMetadata: {
          pageIdentifier: 'home',
        },
      },
      {
        path: "register",
        element: <RegisterPage />,
      },
      {
        path: "login",
        element: <LoginPage />,
      },
      {
        path: "explore-free",
        element: <ExploreFreePage />,
      },
      {
        path: "store",
        element: <StorePage />,
      },
      {
        path: "premium",
        element: <PremiumPage />,
      },
      {
        path: "student-dashboard",
        element: (
          <MemberProtectedRoute messageToSignIn="Please sign in to access your student dashboard">
            <StudentDashboardPage />
          </MemberProtectedRoute>
        ),
      },
      {
        path: "admin-dashboard",
        element: (
          <MemberProtectedRoute messageToSignIn="Please sign in as admin to access the dashboard">
            <AdminDashboardPage />
          </MemberProtectedRoute>
        ),
      },
      {
        path: "*",
        element: <Navigate to="/" replace />,
      },
    ],
  },
], {
  basename: import.meta.env.BASE_NAME,
});

export default function AppRouter() {
  return (
    <MemberProvider>
      <RouterProvider router={router} />
    </MemberProvider>
  );
}
