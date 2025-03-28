import { createFileRoute } from '@tanstack/react-router';
import { Button } from '@/frontend/components/ui/button';
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@/frontend/components/ui/card';

export const Route = createFileRoute('/password-reset-success')({
  component: PasswordResetSuccessPage,
});

function PasswordResetSuccessPage() {
  return (
    <div className="container mx-auto p-8">
      <div className="mx-auto max-w-md">
        <Card className="w-full">
          <CardHeader>
            <CardTitle className="text-center text-2xl">
              بازیابی رمز عبور با موفقیت انجام شد
            </CardTitle>
            <CardDescription className="text-center">
              رمز عبور شما با موفقیت تغییر کرد
            </CardDescription>
          </CardHeader>
          <CardContent className="flex justify-center">
            <div className="text-center text-green-500">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="mx-auto h-16 w-16"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M5 13l4 4L19 7"
                />
              </svg>
              <p className="mt-4 text-lg font-medium">رمز عبور شما با موفقیت بازیابی شد.</p>
              <p className="mt-2 text-gray-600">
                می‌توانید با استفاده از رمز عبور جدید خود وارد شوید.
              </p>
            </div>
          </CardContent>
          <CardFooter className="flex justify-center">
            <a href="/login">
              <Button>ورود به حساب کاربری</Button>
            </a>
          </CardFooter>
        </Card>
      </div>
    </div>
  );
}
