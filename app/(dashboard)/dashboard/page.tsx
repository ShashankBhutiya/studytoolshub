"use client"

import { useSession } from "next-auth/react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import Link from "next/link"
import { BookOpen, Users, Star, TrendingUp, Clock } from "lucide-react"

export default function DashboardPage() {
  const { data: session } = useSession()

  const getTrialDaysLeft = () => {
    if (!session?.user) return 0
    const trialStart = new Date(session.user.trialStartDate || Date.now())
    const trialEnd = new Date(trialStart.getTime() + 30 * 24 * 60 * 60 * 1000)
    const now = new Date()
    const daysLeft = Math.max(0, Math.ceil((trialEnd.getTime() - now.getTime()) / (24 * 60 * 60 * 1000)))
    return daysLeft
  }

  const trialDaysLeft = getTrialDaysLeft()

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold mb-2">Welcome back, {session?.user?.name}!</h1>
        <p className="text-muted-foreground">Here's what's happening with your study tools today.</p>
      </div>

      {/* Subscription Status */}
      {session?.user?.subscriptionStatus === "TRIAL" && (
        <Card className="mb-8 border-orange-200 bg-orange-50">
          <CardHeader>
            <div className="flex items-center justify-between">
              <div>
                <CardTitle className="text-orange-800">Free Trial Active</CardTitle>
                <CardDescription className="text-orange-600">
                  {trialDaysLeft} days remaining in your trial
                </CardDescription>
              </div>
              <Badge variant="secondary" className="bg-orange-100 text-orange-800">
                <Clock className="mr-1 h-3 w-3" />
                {trialDaysLeft} days left
              </Badge>
            </div>
          </CardHeader>
          <CardContent>
            <p className="text-orange-700 mb-4">
              Upgrade to premium to continue accessing all study tools after your trial ends.
            </p>
            <Link href="/subscription">
              <Button className="bg-orange-600 hover:bg-orange-700">Upgrade to Premium</Button>
            </Link>
          </CardContent>
        </Card>
      )}

      {/* Quick Stats */}
      <div className="grid md:grid-cols-4 gap-6 mb-8">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Tools Available</CardTitle>
            <BookOpen className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">100+</div>
            <p className="text-xs text-muted-foreground">Study tools to explore</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Community Posts</CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">1,234</div>
            <p className="text-xs text-muted-foreground">Active discussions</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Your Reviews</CardTitle>
            <Star className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">0</div>
            <p className="text-xs text-muted-foreground">Tools reviewed</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Preparing For</CardTitle>
            <TrendingUp className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{session?.user?.preparingFor}</div>
            <p className="text-xs text-muted-foreground">Your target exam</p>
          </CardContent>
        </Card>
      </div>

      {/* Quick Actions */}
      <div className="grid md:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle>Explore Study Tools</CardTitle>
            <CardDescription>
              Discover the best tools for your {session?.user?.preparingFor} preparation
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              <Link href="/tools?category=VIDEO_LEARNING">
                <Button variant="outline" className="w-full justify-start">
                  Video Learning Platforms
                </Button>
              </Link>
              <Link href="/tools?category=PRACTICE_TESTS">
                <Button variant="outline" className="w-full justify-start">
                  Practice Test Tools
                </Button>
              </Link>
              <Link href="/tools?category=NOTE_TAKING">
                <Button variant="outline" className="w-full justify-start">
                  Note Taking Apps
                </Button>
              </Link>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Community Activity</CardTitle>
            <CardDescription>Join discussions with fellow aspirants</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              <Link href="/community?category=STUDY_TIPS">
                <Button variant="outline" className="w-full justify-start">
                  Study Tips & Strategies
                </Button>
              </Link>
              <Link href="/community?category=MOTIVATION">
                <Button variant="outline" className="w-full justify-start">
                  Motivation & Support
                </Button>
              </Link>
              <Link href="/community?category=TOOLS">
                <Button variant="outline" className="w-full justify-start">
                  Tool Discussions
                </Button>
              </Link>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
