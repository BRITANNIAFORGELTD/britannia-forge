import React from 'react';
import { Switch, Route } from "wouter";
import { queryClient } from "./lib/queryClient";
import { QueryClientProvider } from "@tanstack/react-query";
import { Toaster } from "@/components/ui/toaster";
import { AuthProvider } from "@/components/auth/auth-provider";
import NotFound from "@/pages/not-found";
import Home from "@/pages/home";
import QuoteInfo from "@/pages/quote-info";
import Quotation from "@/pages/quotation";
import Dashboard from "@/pages/dashboard";
import CustomerDashboard from "@/pages/customer-dashboard";
import Services from "@/pages/services";
import ServiceRequest from "@/pages/service-request";
import ServiceUpload from "@/pages/service-upload";
import EngineerPortal from "@/pages/engineer-portal";
import EngineerRegistration from "@/pages/engineer-registration";
import Checkout from "@/pages/checkout";
import About from "@/pages/about";
import Contact from "@/pages/contact";
import Login from "@/pages/login";
import CustomerLogin from "@/pages/customer-login";
import CustomerRegister from "@/pages/customer-register";
import TradeLogin from "@/pages/trade-login";
import TradeRegister from "@/pages/trade-register";
import AdminLogin from "@/pages/admin/login";
import AdminDashboard from "@/pages/admin/dashboard";
import SecureAdminLogin from "@/pages/admin/secure-login";
import UserManagement from "@/pages/admin/user-management";
import { AdminRoute, EngineerRoute, CustomerRoute } from "@/components/auth/protected-route";

function Router() {
  return (
    <Switch>
      <Route path="/" component={Home} />
      <Route path="/get-quote" component={QuoteInfo} />
      <Route path="/quote" component={Quotation} />
      <Route path="/dashboard" component={Dashboard} />
      <Route path="/customer-dashboard" component={() => <CustomerRoute><CustomerDashboard /></CustomerRoute>} />
      <Route path="/services" component={Services} />
      <Route path="/service-request" component={ServiceRequest} />
      <Route path="/service/:serviceType" component={ServiceUpload} />
      <Route path="/engineer-portal" component={() => <EngineerRoute><EngineerPortal /></EngineerRoute>} />
      <Route path="/engineer-registration" component={EngineerRegistration} />
      <Route path="/checkout" component={Checkout} />
      <Route path="/about" component={About} />
      <Route path="/contact" component={Contact} />
      <Route path="/login" component={Login} />
      <Route path="/customer-login" component={CustomerLogin} />
      <Route path="/customer-register" component={CustomerRegister} />
      <Route path="/trade-login" component={TradeLogin} />
      <Route path="/trade-register" component={TradeRegister} />
      <Route path="/admin/login" component={AdminLogin} />
      <Route path="/britannia1074/admin/login" component={SecureAdminLogin} />
      <Route path="/britannia1074/admin/dashboard" component={() => <AdminRoute><AdminDashboard /></AdminRoute>} />
      <Route path="/britannia1074/admin/users" component={() => <AdminRoute><UserManagement /></AdminRoute>} />
      <Route path="/admin/dashboard" component={() => <AdminRoute><AdminDashboard /></AdminRoute>} />
      <Route component={NotFound} />
    </Switch>
  );
}

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <AuthProvider>
        <Router />
        <Toaster />
      </AuthProvider>
    </QueryClientProvider>
  );
}

export default App;
