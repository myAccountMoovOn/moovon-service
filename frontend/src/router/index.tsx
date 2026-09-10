import { createBrowserRouter, Navigate } from 'react-router-dom';
import Home from '../pages/Home';
import Login from '../pages/auth/Login';
import Signup from '../pages/auth/Signup';
import ForgotPassword from '../pages/auth/ForgotPassword';
import { ProtectedRoute } from '../components/ProtectedRoute';
import AdminLayout from '../layouts/AdminLayout';
import CustomerLayout from '../layouts/CustomerLayout';
import CompanyLayout from '../layouts/CompanyLayout';
import { Result, Button } from 'antd';

// Admin / Company Shared Section Pages
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

// Company Dedicated Pages
import CompanyDashboard from '../pages/company/Dashboard';

// Reseller & Company Domain Pages
import ResellerHome from '../pages/ResellerHome';
import ResellerSignup from '../pages/auth/ResellerSignup';
import CompanyHome from '../pages/CompanyHome';
import CompanySignup from '../pages/auth/CompanySignup';
import CompanyForgotPassword from '../pages/auth/CompanyForgotPassword';

const NotFoundPage = () => (
  <Result
    status="404"
    title="404"
    subTitle="Sorry, the page you visited does not exist."
    extra={<Button type="primary" onClick={() => window.location.href = '/'}>Back Home</Button>}
  />
);

const commonAuthRoutes = [
  {
    path: '/login',
    element: <Login />,
  },
  {
    path: '/forgot-password',
    element: <CompanyForgotPassword />,
  },
  {
    path: '/mock-payment',
    element: <MockPayment />,
  },
];

const companySubRoutes = [
  { index: true, element: <Navigate to="dashboard" replace /> },
  { path: 'dashboard', element: <CompanyDashboard /> },
  { path: 'crm', element: <Customers /> },
  { path: 'customers', element: <Customers /> },
  { path: 'customers/:id', element: <CustomerDetails /> },
  { path: 'products', element: <Services /> },
  { path: 'services', element: <Services /> },
  { path: 'categories', element: <Categories /> },
  { path: 'packages', element: <Packages /> },
  { path: 'coupons', element: <Coupons /> },
  { path: 'inventory', element: <Services /> },
  { path: 'purchase', element: <Payments /> },
  { path: 'sales', element: <Reports /> },
  { path: 'billing', element: <Payments /> },
  { path: 'gst-tax', element: <Reports /> },
  { path: 'accounts', element: <Payments /> },
  { path: 'expenses', element: <Payments /> },
  { path: 'amc', element: <Subscriptions /> },
  { path: 'subscriptions', element: <Subscriptions /> },
  { path: 'service-jobs', element: <Services /> },
  { path: 'field-staff', element: <Customers /> },
  { path: 'assets', element: <Services /> },
  { path: 'support-tickets', element: <Notifications /> },
  { path: 'tasks-projects', element: <Services /> },
  { path: 'hrms', element: <Customers /> },
  { path: 'marketing', element: <Notifications /> },
  { path: 'automation', element: <Notifications /> },
  { path: 'documents', element: <Templates /> },
  { path: 'payments', element: <Payments /> },
  { path: 'notifications', element: <Notifications /> },
  { path: 'templates', element: <Templates /> },
  { path: 'reports', element: <Reports /> },
  { path: 'branches', element: <BrandSettings /> },
  { path: 'api-webhooks', element: <BrandSettings /> },
  { path: 'brand-settings', element: <BrandSettings /> },
];

const companyRoutes = [
  {
    path: '/company',
    element: <ProtectedRoute allowedRole="company" />,
    children: [
      {
        element: <CompanyLayout />,
        children: companySubRoutes,
      },
    ],
  },
  {
    path: '/:companySlug',
    element: <ProtectedRoute allowedRole="company" />,
    children: [
      {
        element: <CompanyLayout />,
        children: companySubRoutes,
      },
    ],
  },
];

const adminRoutes = [
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
];

const customerRoutes = [
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
];

import ResellerLayout from '../layouts/ResellerLayout';
import ResellerDashboard from '../pages/reseller/Dashboard';
import ResellerCompanies from '../pages/reseller/Companies';
import ResellerTenantBilling from '../pages/reseller/TenantBilling';
import ResellerPlanBuilder from '../pages/reseller/PlanBuilder';
import ResellerFeatureLimits from '../pages/reseller/FeatureLimits';
import ResellerAddOns from '../pages/reseller/AddOns';
import ResellerPaymentGateways from '../pages/reseller/PaymentGateways';
import ResellerCommunications from '../pages/reseller/Communications';
import ResellerWhiteLabel from '../pages/reseller/WhiteLabel';
import ResellerStaffRoles from '../pages/reseller/StaffRoles';
import ResellerSupportTickets from '../pages/reseller/SupportTickets';
import ResellerReports from '../pages/reseller/Reports';
import ResellerApiIntegrations from '../pages/reseller/ApiIntegrations';

const resellerSubRoutes = [
  { index: true, element: <ResellerDashboard /> },
  { path: 'dashboard',         element: <ResellerDashboard /> },
  { path: 'companies',         element: <ResellerCompanies /> },
  { path: 'tenant-billing',    element: <ResellerTenantBilling /> },
  { path: 'plan-builder',      element: <ResellerPlanBuilder /> },
  { path: 'feature-limits',    element: <ResellerFeatureLimits /> },
  { path: 'add-ons',           element: <ResellerAddOns /> },
  { path: 'payment-gateways',  element: <ResellerPaymentGateways /> },
  { path: 'communications',    element: <ResellerCommunications /> },
  { path: 'white-label',       element: <ResellerWhiteLabel /> },
  { path: 'staff-roles',       element: <ResellerStaffRoles /> },
  { path: 'support-tickets',   element: <ResellerSupportTickets /> },
  { path: 'reports',           element: <ResellerReports /> },
  { path: 'api-integrations',  element: <ResellerApiIntegrations /> },
];

const resellerRoutes = [
  {
    path: '/dashboard',
    element: <ProtectedRoute allowedRole="reseller" />,
    children: [
      {
        element: <ResellerLayout />,
        children: resellerSubRoutes,
      },
    ],
  },
  {
    path: '/:resellerSlug',
    element: <ProtectedRoute allowedRole="reseller" />,
    children: [
      {
        element: <ResellerLayout />,
        children: resellerSubRoutes,
      },
    ],
  },
];

// Main App Router (localhost:5173 / app.domain.com)
export const router = createBrowserRouter([
  {
    path: '/',
    element: <Home />,
  },
  {
    path: '/signup',
    element: <Signup />,
  },
  ...commonAuthRoutes,
  ...adminRoutes,
  ...customerRoutes,
  ...companyRoutes,
  ...resellerRoutes,
  {
    path: '*',
    element: <NotFoundPage />,
  },
]);

// Reseller Subdomain Router (reseller.localhost:5173 / reseller.domain.com)
export const resellerRouter = createBrowserRouter([
  // Public routes
  {
    path: '/',
    element: <ResellerHome />,
  },
  {
    path: '/login',
    element: <Login />,
  },
  {
    path: '/signup',
    element: <ResellerSignup />,
  },
  ...commonAuthRoutes,
  {
    path: '/forgot-password',
    element: <ForgotPassword />,
  },
  ...resellerRoutes,
  {
    path: '*',
    element: <NotFoundPage />,
  },
]);

// Company Subdomain Router (company.localhost:5173 / company.domain.com)
export const companyRouter = createBrowserRouter([
  {
    path: '/',
    element: <CompanyHome />,
  },
  {
    path: '/login',
    element: <Login />,
  },
  {
    path: '/signup',
    element: <CompanySignup />,
  },
  ...commonAuthRoutes,
  {
    path: '/forgot-password',
    element: <ForgotPassword />,
  },
  ...companyRoutes,
  {
    path: '*',
    element: <NotFoundPage />,
  },
]);
