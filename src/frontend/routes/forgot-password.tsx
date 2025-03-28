import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import { useState } from 'react';
import * as z from 'zod';
import { createFileRoute } from '@tanstack/react-router';

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

const formSchema = z.object({
  email: z.string().email({
    message: 'لطفا یک ایمیل معتبر وارد کنید',
  }),
});

export const Route = createFileRoute('/forgot-password')({
  component: ForgotPasswordPage,
});

function ForgotPasswordPage() {
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [submittedEmail, setSubmittedEmail] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      email: '',
    },
  });

  function onSubmit(values: z.infer<typeof formSchema>) {
    setIsLoading(true);
    console.log(values);
    // Here you would typically handle submission by calling an API to send a reset link
    setTimeout(() => {
      setSubmittedEmail(values.email);
      setIsLoading(false);
      setIsSubmitted(true);
    }, 1000);
  }

  if (isSubmitted) {
    return (
      <div className="container mx-auto p-8">
        <div className="mx-auto max-w-md">
          <Card className="w-full">
            <CardHeader>
              <CardTitle className="text-center text-2xl">ایمیل بازیابی ارسال شد</CardTitle>
              <CardDescription className="text-center">
                لینک بازیابی رمز عبور به آدرس {submittedEmail} ارسال شد
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
                    d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"
                  />
                </svg>
                <p className="mt-4 text-lg font-medium text-gray-700">
                  لطفا صندوق ایمیل خود را بررسی کنید
                </p>
                <p className="mt-2 text-gray-600">
                  اگر حساب کاربری با این ایمیل وجود داشته باشد، ایمیلی حاوی دستورالعمل‌های بازیابی
                  رمز عبور برای شما ارسال خواهد شد.
                </p>
              </div>
            </CardContent>
            <CardFooter className="flex justify-center">
              <a href="/login">
                <Button variant="outline">بازگشت به صفحه ورود</Button>
              </a>
            </CardFooter>
          </Card>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto p-8">
      <div className="mx-auto max-w-md">
        <Card className="w-full">
          <CardHeader>
            <CardTitle className="text-center text-2xl">بازیابی رمز عبور</CardTitle>
            <CardDescription className="text-center">
              ایمیل خود را وارد کنید تا لینک بازیابی رمز عبور برای شما ارسال شود
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Form {...form}>
              <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
                <FormField
                  control={form.control}
                  name="email"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>ایمیل</FormLabel>
                      <FormControl>
                        <Input type="email" placeholder="ایمیل خود را وارد کنید" {...field} />
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
                      در حال ارسال...
                    </>
                  ) : (
                    'ارسال لینک بازیابی'
                  )}
                </Button>
              </form>
            </Form>
          </CardContent>
          <CardFooter className="flex justify-center">
            <p className="text-sm text-gray-500">
              رمز عبور خود را به یاد آوردید؟{' '}
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
