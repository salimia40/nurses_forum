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
import { authClient } from '@/lib/auth';
import { toast } from 'sonner';
const formSchema = z
  .object({
    fullName: z.string().min(3, {
      message: 'نام و نام خانوادگی باید حداقل ۳ کاراکتر باشد',
    }),
    username: z.string().min(3, {
      message: 'نام کاربری باید حداقل ۳ کاراکتر باشد',
    }),
    email: z.string().email({
      message: 'لطفا یک ایمیل معتبر وارد کنید',
    }),
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

export function RegisterForm() {
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      fullName: '',
      username: '',
      email: '',
      password: '',
      confirmPassword: '',
    },
  });

  function onSubmit(values: z.infer<typeof formSchema>) {
    console.log(values);
    // Here you would typically handle submission by calling an API
    authClient.signUp.email(
      {
        email: values.email,
        password: values.password,
        name: values.fullName,
        username: values.email,
      },
      {
        onSuccess: () => {
          toast.success('ثبت نام با موفقیت انجام شد');
        },
        onError: () => {
          toast.error('ثبت نام با خطا مواجه شد');
        },
      },
    );
  }
  return (
    <Card className="mx-auto w-full max-w-md">
      <CardHeader>
        <CardTitle className="text-center text-2xl">ثبت نام</CardTitle>
        <CardDescription className="text-center">
          برای عضویت در انجمن پرستاران فرم زیر را تکمیل کنید.
        </CardDescription>
      </CardHeader>
      <CardContent>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
            <FormField
              control={form.control}
              name="fullName"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>نام و نام خانوادگی</FormLabel>
                  <FormControl>
                    <Input placeholder="نام و نام خانوادگی خود را وارد کنید" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="username"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>نام کاربری</FormLabel>
                  <FormControl>
                    <Input placeholder="نام کاربری خود را وارد کنید" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
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
            <FormField
              control={form.control}
              name="confirmPassword"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>تکرار رمز عبور</FormLabel>
                  <FormControl>
                    <Input
                      type="password"
                      placeholder="رمز عبور خود را مجددا وارد کنید"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <Button type="submit" className="w-full">
              ثبت نام
            </Button>
          </form>
        </Form>
      </CardContent>
      <CardFooter className="flex justify-center">
        <p className="text-sm text-gray-500">
          قبلا ثبت نام کرده اید؟{' '}
          <a href="/login" className="text-primary hover:underline">
            ورود
          </a>
        </p>
      </CardFooter>
    </Card>
  );
}
