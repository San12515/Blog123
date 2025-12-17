'use client';
import React from 'react';
import { verifyEmailSchema } from '@/schemas/AuthSchema';
import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import axios from 'axios';
import { Loader2 } from 'lucide-react';
import { useParams, useRouter } from 'next/navigation';
import Link from 'next/link';

function Page() {
  const params = useParams();
  const router = useRouter();
  const form = useForm({
    resolver: zodResolver(verifyEmailSchema),
    defaultValues: { token: '' ,username:params.username}, // ensure controlled input
  });

  const onSubmit = async (data) => {
    try {
      const response = await axios.post(`/api/verify`, {
        username: params.username,
        token: data.token, // ✅ now defined
      });
      router.replace(`/signin`);
    } catch (error) {
      if (axios.isAxiosError(error)) {
        console.error(error.response?.data?.message || 'Error verifying');
      } else {
        console.error('Unexpected error:', error);
      }
    }
  };

  return (
    <div className="flex justify-center items-center min-h-screen bg-gray-800">
      <div className="w-full max-w-md p-8 space-y-8 bg-white rounded-lg shadow-md">
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
            <FormField
              control={form.control}
              name="token" // ✅ matches schema
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Verification Code</FormLabel>
                  <FormControl>
                    <Input {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <button
              type="submit"
              className="w-full flex items-center justify-center px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
            >
              Verify
            </button>
          </form>
        </Form>
        <p className="mt-4 text-center">
          Didn’t get the code?{' '}
          <Link href="/signup" className="text-blue-600 hover:text-blue-800">
            Resend
          </Link>
        </p>
      </div>
    </div>
  );
}

export default Page;
