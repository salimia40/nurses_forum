import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import * as z from 'zod';

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
import { createFileRoute } from '@tanstack/react-router';

const formSchema = z.object({
  email: z.string().email({
    message: 'لطفا یک ایمیل معتبر وارد کنید',
  }),
  password: z.string().min(1, {
    message: 'رمز عبور الزامی است',
  }),
});

export const Route = createFileRoute('/login')({
  component: LoginPage,
});

function LoginPage() {
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      email: '',
      password: '',
    },
  });

  function onSubmit(values: z.infer<typeof formSchema>) {
    console.log(values);
    // Here you would typically handle submission by calling an API
  }

  return (
    <div className="container mx-auto p-8">
      <div className="mx-auto max-w-md">
        <Card className="w-full">
          <CardHeader>
            <CardTitle className="text-center text-2xl">ورود</CardTitle>
            <CardDescription className="text-center">وارد حساب کاربری خود شوید</CardDescription>
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
                <FormField
                  control={form.control}
                  name="password"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>رمز عبور</FormLabel>
                      <FormControl>
                        <Input type="password" placeholder="رمز عبور خود را وارد کنید" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <div className="text-right">
                  <a href="/forgot-password" className="text-sm text-primary hover:underline">
                    رمز عبور خود را فراموش کرده اید؟
                  </a>
                </div>
                <Button type="submit" className="w-full">
                  ورود
                </Button>
              </form>
            </Form>
          </CardContent>
          <CardFooter className="flex justify-center">
            <p className="text-sm text-gray-500">
              حساب کاربری ندارید؟{' '}
              <a href="/register" className="text-primary hover:underline">
                ثبت نام
              </a>
            </p>
          </CardFooter>
        </Card>
      </div>
    </div>
  );
}
