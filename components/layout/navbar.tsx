"use client"

import { useState } from "react"
import Link from "next/link"
import { useSession, signOut } from "next-auth/react"
import { Button } from "@/components/ui/button"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import { BookOpen, Menu, User, LogOut, Settings } from "lucide-react"
import { Badge } from "@/components/ui/badge"

export function Navbar() {
  const { data: session } = useSession()
  const [isMenuOpen, setIsMenuOpen] = useState(false)

  const getSubscriptionBadge = () => {
    if (!session?.user?.subscriptionStatus) return null

    const status = session.user.subscriptionStatus
    const variant = status === "ACTIVE" ? "default" : status === "TRIAL" ? "secondary" : "destructive"

    return (
      <Badge variant={variant} className="ml-2">
        {status}
      </Badge>
    )
  }

  return (
    <nav className="border-b bg-background">
      <div className="container mx-auto px-4">
        <div className="flex justify-between items-center h-16">
          <Link href="/" className="flex items-center space-x-2">
            <BookOpen className="h-8 w-8 text-primary" />
            <span className="text-xl font-bold">StudyToolsHub</span>
          </Link>

          {session ? (
            <div className="flex items-center space-x-4">
              <div className="hidden md:flex items-center space-x-4">
                <Link href="/dashboard">
                  <Button variant="ghost">Dashboard</Button>
                </Link>
                <Link href="/tools">
                  <Button variant="ghost">Tools</Button>
                </Link>
                <Link href="/community">
                  <Button variant="ghost">Community</Button>
                </Link>
              </div>

              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="ghost" className="flex items-center space-x-2">
                    <User className="h-4 w-4" />
                    <span>{session.user.name}</span>
                    {getSubscriptionBadge()}
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end">
                  <DropdownMenuItem asChild>
                    <Link href="/profile">
                      <Settings className="mr-2 h-4 w-4" />
                      Profile
                    </Link>
                  </DropdownMenuItem>
                  <DropdownMenuItem onClick={() => signOut()}>
                    <LogOut className="mr-2 h-4 w-4" />
                    Sign Out
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>

              <Button variant="ghost" size="sm" className="md:hidden" onClick={() => setIsMenuOpen(!isMenuOpen)}>
                <Menu className="h-4 w-4" />
              </Button>
            </div>
          ) : (
            <div className="flex items-center space-x-4">
              <Link href="/login">
                <Button variant="ghost">Login</Button>
              </Link>
              <Link href="/register">
                <Button>Get Started</Button>
              </Link>
            </div>
          )}
        </div>

        {/* Mobile menu */}
        {isMenuOpen && session && (
          <div className="md:hidden py-4 border-t">
            <div className="flex flex-col space-y-2">
              <Link href="/dashboard">
                <Button variant="ghost" className="w-full justify-start">
                  Dashboard
                </Button>
              </Link>
              <Link href="/tools">
                <Button variant="ghost" className="w-full justify-start">
                  Tools
                </Button>
              </Link>
              <Link href="/community">
                <Button variant="ghost" className="w-full justify-start">
                  Community
                </Button>
              </Link>
            </div>
          </div>
        )}
      </div>
    </nav>
  )
}
