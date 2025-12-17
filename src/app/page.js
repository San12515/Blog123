"use client";

import { motion } from "motion/react";
import React,{useContext} from "react";
import { AuroraBackground } from "@/components/ui/aurora-background";
import Link from "next/link";
import {AuthContext} from '@/context/AuthContext'
export default function Home() {
  const {user} = useContext(AuthContext);
  return (
     
    <AuroraBackground>
      <div>
       <div className="absolute top-6 right-30">
        <Link href="/signin">
        <button className="bg-black dark:bg-white rounded-full text-white dark:text-black px-4 py-2 shadow-md hover:scale-105 transition">
          Signin
        </button>
        </Link>
      </div>
       <div className="absolute top-6 right-6">
        <Link href="/signup">
        <button className="bg-black dark:bg-white rounded-full text-white dark:text-black px-4 py-2 shadow-md hover:scale-105 transition">
          Signup
        </button>
        </Link>
      </div>
      </div>
      <motion.div
        initial={{ opacity: 0.0, y: 40 }}
        whileInView={{ opacity: 1, y: 0 }}
        transition={{
          delay: 0.3,
          duration: 0.8,
          ease: "easeInOut",
        }}
        className="relative flex flex-col gap-4 items-center justify-center px-4"
      >
        <div className="text-3xl md:text-7xl font-bold dark:text-white text-center">
          Express Yourselves
        </div>
        <div className="font-extralight text-base md:text-4xl dark:text-neutral-200 py-4">
          Create your very own blog
        </div>
       <Link href={`/route/${user ? user.username : "guest"}`}>
        <button className="bg-black dark:bg-white rounded-full w-fit text-white dark:text-black px-4 py-2">
          Create Your Blog
        </button>
        </Link>
      </motion.div>
    </AuroraBackground>
      
  );
}
