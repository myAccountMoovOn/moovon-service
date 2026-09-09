import { createBrowserRouter, Navigate } from 'react-router-dom';
import Home from '../pages/Home';
import Login from '../pages/auth/Login';
import Signup from '../pages/auth/Signup';
import { ProtectedRoute } from '../components/ProtectedRoute';
import AdminLayout from '../layouts/AdminLayout';
import CustomerLayout from '../layouts/CustomerLayout';
import { Result, Button } from 'antd';

// Admin Pages
import AdminDashboard from '../pages/admin/Dashboard';
import Customers from '../pages/admin/Customers';
import Services from '../pages/admin/Services';
import Subscriptions from '../pages/admin/Subscriptions';
import Payments from '../pages/admin/Payments';
import Notifications from '../pages/admin/Notifications';
import Reports from '../pages/admin/Reports';
import Templates from '../pages/admin/Templates';
import CustomerDetails from '../pages/admin/CustomerDetails';
import MockPayment from '../pages/admin/MockPayment';
import Categories from '../pages/admin/Categories';
import Packages from '../pages/admin/Packages';
import Coupons from '../pages/admin/Coupons';
import BrandSettings from '../pages/admin/BrandSettings';

// Customer Pages
import CustomerDashboard from '../pages/customer/Dashboard';
import Billing from '../pages/customer/Billing';
import Profile from '../pages/customer/Profile';
import CustomerNotifications from '../pages/customer/Notifications';


const NotFoundPage = () => (
  <Result
    status="404"
    title="404"
    subTitle="Sorry, the page you visited does not exist."
    extra={<Button type="primary" onClick={() => window.location.href = '/'}>Back Home</Button>}
  />
);

export const router = createBrowserRouter([
  {
    path: '/',
    element: <Home />,
  },
  {
    path: '/login',
    element: <Login />,
  },
  {
    path: '/signup',
    element: <Signup />,
  },
  {
    path: '/mock-payment',
    element: <MockPayment />,
  },
  {
    path: '/admin',
    element: <ProtectedRoute allowedRole="admin" />,
    children: [
      {
        element: <AdminLayout />,
        children: [
          { index: true, element: <Navigate to="dashboard" replace /> },
          { path: 'dashboard', element: <AdminDashboard /> },
          { path: 'customers', element: <Customers /> },
          { path: 'customers/:id', element: <CustomerDetails /> },
          { path: 'services', element: <Services /> },
          { path: 'subscriptions', element: <Subscriptions /> },
          { path: 'payments', element: <Payments /> },
          { path: 'notifications', element: <Notifications /> },
          { path: 'reports', element: <Reports /> },
          { path: 'templates', element: <Templates /> },
          { path: 'categories', element: <Categories /> },
          { path: 'packages', element: <Packages /> },
          { path: 'coupons', element: <Coupons /> },
          { path: 'brand-settings', element: <BrandSettings /> },
        ],
      },
    ],
  },
  {
    path: '/customer',
    element: <ProtectedRoute allowedRole="customer" />,
    children: [
      {
        element: <CustomerLayout />,
        children: [
          { index: true, element: <Navigate to="dashboard" replace /> },
          { path: 'dashboard', element: <CustomerDashboard /> },
          { path: 'billing', element: <Billing /> },
          { path: 'notifications', element: <CustomerNotifications /> },
          { path: 'profile', element: <Profile /> },
        ],
      },
    ],
  },
  {
    path: '*',
    element: <NotFoundPage />,
  },
]);

import ResellerHome from '../pages/ResellerHome';
import ResellerSignup from '../pages/auth/ResellerSignup';
export const resellerRouter = createBrowserRouter([
  {
    path: '/',
    element: <ResellerHome />,
  },
  {
    path: '/signup',
    element: <ResellerSignup />,
  },
  {
    path: '*',
    element: <NotFoundPage />,
  },
]);

import CompanyHome from '../pages/CompanyHome';
import CompanySignup from '../pages/auth/CompanySignup';
export const companyRouter = createBrowserRouter([
  {
    path: '/',
    element: <CompanyHome />,
  },
  {
    path: '/signup',
    element: <CompanySignup />,
  },
  {
    path: '*',
    element: <NotFoundPage />,
  },
]);
