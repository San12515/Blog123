'use client'
import React from 'react'
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { loginSchema } from '@/schemas/AuthSchema'
import { Button } from "@/components/ui/button"
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form"
import { Input } from "@/components/ui/input"
import axios from 'axios'
import { Loader2 } from 'lucide-react'
import { useRouter } from 'next/navigation'
import Link from 'next/link' 
import { getAvatarFromEmail } from '@/lib/avatar'
function Page() {
  const [submitting, setSubmitting] = React.useState(false)
  const router = useRouter()

  const form = useForm({
    resolver: zodResolver(loginSchema),
    defaultValues: { email: '', password: '' },
  })

  const onSubmit = async (data) => {
    setSubmitting(true) // start loading here
    try {
      console.log("🚀 onSubmit called with:", data)

      const response = await axios.post('/api/login', data)

      console.log("✅ Full login response:", response)
      console.log("📩 API message:", response.data.message)

      // store
      localStorage.setItem("token", response.data.token)
      localStorage.setItem("user", JSON.stringify(response.data.user))

      // ✅ log user before redirect
      console.log("👤 Logged in user:", response.data.user)
      console.log("🔍 response.data:", response.data)
      console.log("👤 response.data.user:", response.data.user)
      console.log("📛 username:", response.data.user?.username)
      console.log("👤 user.email:", response.data.user.email)
      console.log("🖼 avatar URL:", getAvatarFromEmail(response.data.user.email))



      // redirect after logs
      router.replace(`/${response.data.user.username}`)
    } catch (error) {
      if (axios.isAxiosError(error)) {
        console.error("❌ Axios error:", error.response?.data?.message || error.message)
      } else {
        console.error("❌ Unexpected error:", error)
      }
    } finally {
      setSubmitting(false) // stop loader
    }
  }

  return (
    <div className="flex justify-center items-center min-h-screen bg-gray-800">  
      <div className="w-full max-w-md p-8 space-y-8 bg-white rounded-lg shadow-md">
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
            <FormField
              control={form.control}
              name="email"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Email</FormLabel>
                  <FormControl>
                    <Input {...field} />
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
                  <FormLabel>Password</FormLabel>
                  <FormControl>
                    <Input type="password" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <Button type="submit" disabled={submitting}>
              {submitting ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" /> 
                  Please wait...
                </>
              ) : (
                'Sign In'
              )}
            </Button>
          </form>
        </Form>
        <p>
          No account?{" "}
          <Link href="/signup" className="text-blue-600 hover:text-black-600">
            Create one
          </Link>
        </p>
      </div>
    </div>  
  )
}

export default Page
