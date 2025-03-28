import { createRootRoute, Outlet } from '@tanstack/react-router';
import { Navbar } from '../components/navbar';
import { Toaster } from '../components/ui/sonner';

export const Route = createRootRoute({
  component: () => (
    <div className="flex min-h-screen flex-col bg-gray-50 font-sans">
      <Toaster />
      <Navbar />
      <main className="flex-grow">
        <div className="relative z-10 container mx-auto p-8 text-center">
          <Outlet />
        </div>
      </main>
      <footer className="bg-gray-100 py-6 text-center text-sm text-gray-600">
        <div className="container mx-auto">
          تمامی حقوق محفوظ است © انجمن پرستاران {new Date().getFullYear()}
        </div>
      </footer>
    </div>
  ),
});
