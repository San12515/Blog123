'use client'
import React from 'react'
import {useState, useEffect} from 'react'
import { useDebounceCallback } from 'usehooks-ts'
import {signupSchema} from '@/schemas/AuthSchema'
import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import { Button } from "@/components/ui/button"
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form"
import { Input } from "@/components/ui/input"
import { set } from 'mongoose'
import axios, {Axios, AxiosError} from 'axios'
import { userAgent } from 'next/server'
import { Loader, Loader2 } from 'lucide-react'
import { useRouter } from 'next/navigation'
import Link from 'next/link' 
function Page() {
   const [username, setUsername] = React.useState('');
   const [checkingUsername,setCheckingUsername]=React.useState(false);
   const [usernameMessage,setUsernameMessage]=React.useState('');
   const [submitting,setSubmitting]=React.useState(false);
   const debounced = useDebounceCallback(setUsername, 500)
   const router = useRouter()
   const form = useForm({
        resolver: zodResolver(signupSchema),
        defaultValues:{username:'',
        email:'', password:''
        },
    })
    useEffect(() => {
        const checkUniqueUsername= async () => {
            if(username){
                setCheckingUsername(true);
                setUsernameMessage('');
            }
            try{
                const response = await axios.get(`/api/checkUsername?username=${username}`)
                setUsernameMessage(response.data.message);
            }
            catch (error) {
            if (axios.isAxiosError(error)) {
                setUsernameMessage(error.response?.data?.message || 'Error checking username');
                console.log(error.response?.data);
            } else {
                setUsernameMessage('Unknown error');
            }
            }
            finally{
                setCheckingUsername(false);
            }
        }      
        checkUniqueUsername();
    },[username])

    const onSubmit=async (data)=>{
        setSubmitting(true);
        try{
            const response=await axios.post('/api/signup',data);
            // Handle success (e.g., show a success message, redirect, etc.)
            console.log(response.data.message); 
            router.replace(`/verify/${username}`);
        }    
        catch (error) {
        if (axios.isAxiosError(error)) {
            console.error(error.response?.data?.message || 'Error during signup');
        } else {
            console.error('Unexpected error:', error);
        }
        }

    }  
    return (
    <div className="flex justify-center items-center min-h-screen bg-gray-800">  
      <div className="w-full max-w-md p-8 space-y-8 bg-white rounded-lg shadow-md">
        <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
        <FormField
            control={form.control}
            name="username"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Username</FormLabel>
                <FormControl>
                  <Input
                    {...field}
                    onChange={(e) => {
                      field.onChange(e);
                      debounced(e.target.value);
                    }}
                  />
                </FormControl>
                <FormDescription></FormDescription>
                {checkingUsername && <Loader2 className="animate-spin" />}
                {!checkingUsername && usernameMessage && (
                    <p
                      className={`text-sm ${
                        usernameMessage === 'Username available'
                          ? 'text-green-500'
                          : 'text-red-500'
                      }`}
                    >
                       {usernameMessage}
                    </p>
                  )}
                <FormMessage />
              </FormItem>
            )}
          />

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
        <Button type="submit" >{submitting ?(
            <>
            <Loader2 className="mr-2 h-4 w-4 animate-spin" /> 
            Please wait...
            </>) :('Sign Up')}
        </Button>
      </form>
    </Form>
    <p>
        "Already have an account?"
        <Link href="/login" className="text-blue-600 hover:text-black-600"> Log In</Link>

    </p>

    </div>
    </div>  
        
    )
}
export default Page
