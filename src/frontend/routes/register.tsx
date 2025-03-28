import { RegisterForm } from '@/frontend/components/register-form';
import { createFileRoute } from '@tanstack/react-router';

export const Route = createFileRoute('/register')({
  component: RegisterPage,
});

function RegisterPage() {
  return (
    <div className="container mx-auto p-8">
      <div className="mx-auto max-w-md">
        <RegisterForm />
      </div>
    </div>
  );
}
