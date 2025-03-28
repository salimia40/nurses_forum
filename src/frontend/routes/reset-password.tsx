import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import { useState } from 'react';
import * as z from 'zod';
import { createFileRoute, useNavigate } from '@tanstack/react-router';

import { Button } from '@/frontend/components/ui/button';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/frontend/components/ui/form';
import { Input } from '@/frontend/components/ui/input';
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@/frontend/components/ui/card';

const formSchema = z
  .object({
    password: z.string().min(8, {
      message: 'رمز عبور باید حداقل ۸ کاراکتر باشد',
    }),
    confirmPassword: z.string().min(8, {
      message: 'تکرار رمز عبور باید حداقل ۸ کاراکتر باشد',
    }),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: 'رمز عبور و تکرار آن باید یکسان باشند',
    path: ['confirmPassword'],
  });

export const Route = createFileRoute('/reset-password')({
  component: ResetPasswordPage,
});

function ResetPasswordPage() {
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(false);

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      password: '',
      confirmPassword: '',
    },
  });

  function onSubmit(values: z.infer<typeof formSchema>) {
    setIsLoading(true);
    console.log(values);
    // Here you would typically handle submission by calling an API to reset the password
    // This would include sending the token from the URL (not implemented here)

    // Simulate successful password reset and redirect
    setTimeout(() => {
      setIsLoading(false);
      navigate({ to: '/password-reset-success' });
    }, 1000);
  }

  return (
    <div className="container mx-auto p-8">
      <div className="mx-auto max-w-md">
        <Card className="w-full">
          <CardHeader>
            <CardTitle className="text-center text-2xl">تنظیم رمز عبور جدید</CardTitle>
            <CardDescription className="text-center">
              لطفا رمز عبور جدید خود را وارد کنید
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Form {...form}>
              <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
                <FormField
                  control={form.control}
                  name="password"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>رمز عبور جدید</FormLabel>
                      <FormControl>
                        <Input
                          type="password"
                          placeholder="رمز عبور جدید خود را وارد کنید"
                          {...field}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="confirmPassword"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>تکرار رمز عبور جدید</FormLabel>
                      <FormControl>
                        <Input
                          type="password"
                          placeholder="رمز عبور جدید خود را مجددا وارد کنید"
                          {...field}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <Button type="submit" className="w-full" disabled={isLoading}>
                  {isLoading ? (
                    <>
                      <svg
                        className="mr-2 h-4 w-4 animate-spin"
                        xmlns="http://www.w3.org/2000/svg"
                        fill="none"
                        viewBox="0 0 24 24"
                      >
                        <circle
                          className="opacity-25"
                          cx="12"
                          cy="12"
                          r="10"
                          stroke="currentColor"
                          strokeWidth="4"
                        ></circle>
                        <path
                          className="opacity-75"
                          fill="currentColor"
                          d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                        ></path>
                      </svg>
                      در حال ذخیره...
                    </>
                  ) : (
                    'ذخیره رمز عبور جدید'
                  )}
                </Button>
              </form>
            </Form>
          </CardContent>
          <CardFooter className="flex justify-center">
            <p className="text-sm text-gray-500">
              <a href="/login" className="text-primary hover:underline">
                بازگشت به صفحه ورود
              </a>
            </p>
          </CardFooter>
        </Card>
      </div>
    </div>
  );
}
