'use client'
import React, { useEffect } from 'react'
import { Sidebar, SidebarBody, SidebarLink } from "@/components/ui/sidebar";
import { useContext } from 'react';
import {
  IconArrowLeft,
  IconBrandTabler,
  IconSettings,
  IconUserBolt,
} from "@tabler/icons-react";
import { motion } from "framer-motion";
import { cn } from "@/lib/utils";
import {
  Navbar,
  NavBody,
  NavItems,
  MobileNav,
  NavbarLogo,
  NavbarButton,
  MobileNavHeader,
  MobileNavToggle,
  MobileNavMenu,
} from "@/components/ui/resizable-navbar";
import { CardBody, CardContainer, CardItem } from "@/components/ui/3d-card";
import { getPopularBlogPosts } from '@/lib/api';
import { Input } from "@/components/ui/input"
import { Bird, Book, Calendar, Home, Inbox, Search, Settings, User } from "lucide-react"
import { useState } from "react";
import {NextResponse} from 'next/server'
import { useRouter } from 'next/navigation';
import {useAuth} from '@/context/AuthContext'
import { getAvatarFromEmail } from '@/lib/avatar';
import { getBlogPosts } from '@/lib/api';
import { set } from 'mongoose';
import { setErrorMap } from 'zod';
import {AuthContext} from '@/context/AuthContext'
import Link from 'next/link'
export const Logo = () => {
  return (
    <a
      href="#"
      className="relative z-20 flex items-center space-x-2 py-1 text-sm font-normal text-black"
    >
      <div className="h-5 w-6 shrink-0 rounded-tl-lg rounded-tr-sm rounded-br-lg rounded-bl-sm bg-black dark:bg-white" />
      <motion.span
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        className="font-medium whitespace-pre text-black dark:text-white"
      >
        Acet Labs
      </motion.span>
    </a>
  );
};
export const LogoIcon = () => {
  return (
    <a
      href="#"
      className="relative z-20 flex items-center space-x-2 py-1 text-sm font-normal text-black"
    >
      <div className="h-5 w-6 shrink-0 rounded-tl-lg rounded-tr-sm rounded-br-lg rounded-bl-sm bg-black dark:bg-white" />
    </a>
  );
};



export default function AppLayout({ children }) {
  const { user } = useAuth();
  const router = useRouter();
  const [open, setOpen] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [searchTerm, setSearchTerm] = React.useState('');
  const [Loading, setLoading] = React.useState(false);
  const [error, setError] = React.useState(null);
  const [posts, setPosts] = React.useState([]);
  const links = [
    {
      label: "Explore",
      href: `/${user ? user.username : "guest"}/explore`,
      icon: <IconBrandTabler className="h-5 w-5 shrink-0 text-neutral-700 dark:text-neutral-200" />,
    },
    {
      label: "Profile",
      href: `/${user ? user.username : "guest"}/profile`,
      icon: <IconUserBolt className="h-5 w-5 shrink-0 text-neutral-700 dark:text-neutral-200" />,
    },
    {
      label: "Settings",
      href: "#",
      icon: <IconSettings className="h-5 w-5 shrink-0 text-neutral-700 dark:text-neutral-200" />,
    },
    {
      label: "Logout",
      href: "#",
      icon: <IconArrowLeft className="h-5 w-5 shrink-0 text-neutral-700 dark:text-neutral-200" />,
    },
  ];

  const navItems = [
    {
      name: "Features",
      link: "#features",
    },
    {
      name: "Pricing",
      link: "#pricing",
    },
    {
      name: "Contact",
      link: "#contact",
    },
  ];
  const items = [
    {
      title: "Home",
      url: "#",
      icon: Home,
    },
    {
      title: "Library",
      url: "#",
      icon: Inbox,
    },
    {
      title: "Profile",
      url: "#",
      icon: User,
    },
    {
      title: "Stories",
      url: "#",
      icon: Book,
    },
    {
      title: "Stats",
      url: "#",
      icon: Bird,
    },
  ]
  

  const handleLogin = () => router.push('/signin');
  const handleCreate = () => router.push(`/${user ? user.username : "guest"}/CreateBlog`);
  const handleSearch = (e) => {
      e.preventDefault();
      fetchPosts();}
    useEffect(()=> {
    fetchPosts();
  },[]);
  const fetchPosts = async () => {
    setLoading(true);
    try {
      let data;
       if (searchTerm.trim()){
      data = await getBlogPosts(searchTerm);
    }
    else{
      data = await getPopularBlogPosts();
    }
    setPosts(data.articles);
    setLoading(false);
  }
    catch (error) {
      setError("Error:", error.message);
      setLoading(false);
    }
  }


  return (
    <div>    
        <div>
            <div className="relative w-full">
          <Navbar >
            {/* Desktop Navigation */}
            <NavBody>
              <NavbarLogo />
              <NavItems items={navItems} />
              <div className="flex items-center gap-8 relative z-50">
          <form className="flex items-center" onSubmit={handleSearch}>
            <input
              type="text"
              placeholder="tech..."
              className="flex-1 px-4 py-3 border-black rounded bg-amber-950  text-white text-base"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
            <button type="submit" className="bg-black text-white">Search</button>
          </form>
                <NavbarButton onClick= {handleLogin} variant="secondary">Login</NavbarButton>
                <NavbarButton onClick={handleCreate} variant="primary">+ Create</NavbarButton>
              </div>
            </NavBody>
     
            {/* Mobile Navigation */}
            <MobileNav>
              <MobileNavHeader>
                <NavbarLogo />
                <MobileNavToggle
                  isOpen={isMobileMenuOpen}
                  onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
                />
              </MobileNavHeader>
     
              <MobileNavMenu
                isOpen={isMobileMenuOpen}
                onClose={() => setIsMobileMenuOpen(false)}
              >
                {navItems.map((item, idx) => (
                  <a
                    key={`mobile-link-${idx}`}
                    href={item.link}
                    onClick={() => setIsMobileMenuOpen(false)}
                    className="relative text-neutral-600 dark:text-neutral-300"
                  >
                    <span className="block">{item.name}</span>
                  </a>
                ))}
                <div className="flex w-full flex-col gap-4">
                  <NavbarButton
                    onClick={() => setIsMobileMenuOpen(false)}
                    variant="primary"
                    className="w-full"
                  >
                    Login
                  </NavbarButton>
                  <Link href={`/${user ? user.username : "guest"}/CreateBlog`}>
                  <NavbarButton
                    onClick={() => setIsMobileMenuOpen(false)}
                    variant="primary"
                    className="w-full"
                  >
                    + Create
                  </NavbarButton>
                  </Link>
                </div>
              </MobileNavMenu>
            </MobileNav>
          </Navbar>
     
          {/* Navbar */}
        </div>
        <div
          className={cn(
            "mx-auto flex w-full max-w-8xl flex-1 flex-col overflow-hidden rounded-md border border-neutral-200 bg-gray-100 md:flex-row dark:border-neutral-700 dark:bg-neutral-800",
            "h-full", // for your use case, use `h-screen` instead of `h-[60vh]`
          )}
        >
          <Sidebar open={open} setOpen={setOpen}>
            <SidebarBody className="justify-between gap-10">
              <div className="flex flex-1 flex-col overflow-x-hidden overflow-y-auto">
                {open ? <Logo /> : <LogoIcon />}
                <div className="mt-8 flex flex-col gap-2">
                  {links.map((link, idx) => (
                    <SidebarLink key={idx} link={link} />
                  ))}
                </div>
              </div>
              <div>
                <SidebarLink
                  link={{
                    label: user?.name || user?.email,
                    href: "#",
                    icon: (
                      <img
                        src={getAvatarFromEmail(user?.email)}
                        className="h-7 w-7 shrink-0 rounded-full"
                        width={50}
                        height={50}
                        alt="Avatar"
                      />
                    ),
                  }}
                />
              </div>
            </SidebarBody>
          </Sidebar>
          <main className="flex-1 overflow-y-auto p-4">
          {children}
      </main>
    </div>
    </div> 
    </div>
  );
}
 
       