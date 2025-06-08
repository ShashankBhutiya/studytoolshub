"use client"

import { useState } from "react"
import { useSession } from "next-auth/react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { CheckCircle, Clock, CreditCard } from "lucide-react"
import { useToast } from "@/hooks/use-toast"

declare global {
  interface Window {
    Razorpay: any
  }
}

export default function SubscriptionPage() {
  const { data: session } = useSession()
  const [isLoading, setIsLoading] = useState(false)
  const { toast } = useToast()

  const getTrialDaysLeft = () => {
    if (!session?.user) return 0
    const trialStart = new Date(session.user.trialStartDate || Date.now())
    const trialEnd = new Date(trialStart.getTime() + 30 * 24 * 60 * 60 * 1000)
    const now = new Date()
    const daysLeft = Math.max(0, Math.ceil((trialEnd.getTime() - now.getTime()) / (24 * 60 * 60 * 1000)))
    return daysLeft
  }

  const handleSubscribe = async () => {
    setIsLoading(true)

    try {
      // Mock payment process - simulate successful payment
      const response = await fetch("/api/subscription/mock-payment", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
      })

      if (!response.ok) {
        throw new Error("Failed to process subscription")
      }

      const result = await response.json()

      if (result.success) {
        toast({
          title: "Success",
          description: "Subscription activated successfully! (Mock Payment)",
        })
        window.location.reload()
      } else {
        throw new Error("Payment processing failed")
      }
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to process subscription",
        variant: "destructive",
      })
    } finally {
      setIsLoading(false)
    }
  }

  const trialDaysLeft = getTrialDaysLeft()

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="max-w-4xl mx-auto">
        <div className="mb-8 text-center">
          <h1 className="text-3xl font-bold mb-2">Subscription Management</h1>
          <p className="text-muted-foreground">Manage your StudyToolsHub subscription</p>
        </div>

        {/* Demo Notice */}
        <Card className="mb-8 border-blue-200 bg-blue-50">
          <CardHeader>
            <div className="flex items-center space-x-2">
              <div className="w-2 h-2 bg-blue-500 rounded-full animate-pulse"></div>
              <CardTitle className="text-blue-800">Demo Mode</CardTitle>
            </div>
            <CardDescription className="text-blue-600">
              This is a demo version. Payment processing is simulated for demonstration purposes. In production, this
              would integrate with a real payment gateway like Razorpay, Stripe, or PayPal.
            </CardDescription>
          </CardHeader>
        </Card>

        {/* Current Status */}
        <Card className="mb-8">
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <CreditCard className="h-5 w-5" />
              <span>Current Status</span>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-center justify-between">
              <div>
                <div className="flex items-center space-x-2 mb-2">
                  <Badge
                    variant={
                      session?.user?.subscriptionStatus === "ACTIVE"
                        ? "default"
                        : session?.user?.subscriptionStatus === "TRIAL"
                          ? "secondary"
                          : "destructive"
                    }
                  >
                    {session?.user?.subscriptionStatus}
                  </Badge>
                  {session?.user?.subscriptionStatus === "TRIAL" && (
                    <Badge variant="outline">
                      <Clock className="h-3 w-3 mr-1" />
                      {trialDaysLeft} days left
                    </Badge>
                  )}
                </div>
                <p className="text-muted-foreground">
                  {session?.user?.subscriptionStatus === "ACTIVE"
                    ? "You have full access to all features"
                    : session?.user?.subscriptionStatus === "TRIAL"
                      ? `Your free trial expires in ${trialDaysLeft} days`
                      : "Your subscription has expired"}
                </p>
              </div>
              {session?.user?.subscriptionStatus === "ACTIVE" && (
                <div className="text-right">
                  <p className="font-medium">₹299/month</p>
                  <p className="text-sm text-muted-foreground">
                    Next billing: {new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toLocaleDateString()}
                  </p>
                </div>
              )}
            </div>
          </CardContent>
        </Card>

        {/* Subscription Plans */}
        {session?.user?.subscriptionStatus !== "ACTIVE" && (
          <div className="grid md:grid-cols-2 gap-6">
            {/* Free Trial */}
            <Card className="border-2 border-secondary">
              <CardHeader>
                <CardTitle>Free Trial</CardTitle>
                <CardDescription>Perfect for getting started</CardDescription>
                <div className="text-3xl font-bold">
                  Free
                  <span className="text-lg font-normal text-muted-foreground">/30 days</span>
                </div>
              </CardHeader>
              <CardContent>
                <ul className="space-y-3 mb-6">
                  <li className="flex items-center">
                    <CheckCircle className="h-5 w-5 text-green-500 mr-2" />
                    Access to all study tools
                  </li>
                  <li className="flex items-center">
                    <CheckCircle className="h-5 w-5 text-green-500 mr-2" />
                    Tool comparison feature
                  </li>
                  <li className="flex items-center">
                    <CheckCircle className="h-5 w-5 text-green-500 mr-2" />
                    Community forum access
                  </li>
                  <li className="flex items-center">
                    <CheckCircle className="h-5 w-5 text-green-500 mr-2" />
                    Basic recommendations
                  </li>
                </ul>
                <Button variant="outline" className="w-full" disabled={session?.user?.subscriptionStatus === "TRIAL"}>
                  {session?.user?.subscriptionStatus === "TRIAL" ? "Active" : "Already Used"}
                </Button>
              </CardContent>
            </Card>

            {/* Premium Plan */}
            <Card className="border-2 border-primary">
              <CardHeader>
                <Badge className="w-fit mb-2">Recommended</Badge>
                <CardTitle>Premium</CardTitle>
                <CardDescription>Full access to all features</CardDescription>
                <div className="text-3xl font-bold">
                  ₹299
                  <span className="text-lg font-normal text-muted-foreground">/month</span>
                </div>
              </CardHeader>
              <CardContent>
                <ul className="space-y-3 mb-6">
                  <li className="flex items-center">
                    <CheckCircle className="h-5 w-5 text-green-500 mr-2" />
                    Unlimited access to 100+ tools
                  </li>
                  <li className="flex items-center">
                    <CheckCircle className="h-5 w-5 text-green-500 mr-2" />
                    Advanced tool comparison
                  </li>
                  <li className="flex items-center">
                    <CheckCircle className="h-5 w-5 text-green-500 mr-2" />
                    Priority community support
                  </li>
                  <li className="flex items-center">
                    <CheckCircle className="h-5 w-5 text-green-500 mr-2" />
                    Personalized recommendations
                  </li>
                  <li className="flex items-center">
                    <CheckCircle className="h-5 w-5 text-green-500 mr-2" />
                    Expert study guides
                  </li>
                  <li className="flex items-center">
                    <CheckCircle className="h-5 w-5 text-green-500 mr-2" />
                    Early access to new features
                  </li>
                </ul>
                <Button className="w-full" onClick={handleSubscribe} disabled={isLoading}>
                  {isLoading ? "Processing..." : "Subscribe Now"}
                </Button>
              </CardContent>
            </Card>
          </div>
        )}

        {/* Features Comparison */}
        <Card className="mt-8">
          <CardHeader>
            <CardTitle>What's Included</CardTitle>
            <CardDescription>Compare features across different plans</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b">
                    <th className="text-left py-2">Feature</th>
                    <th className="text-center py-2">Free Trial</th>
                    <th className="text-center py-2">Premium</th>
                  </tr>
                </thead>
                <tbody className="space-y-2">
                  <tr className="border-b">
                    <td className="py-2">Study Tools Access</td>
                    <td className="text-center py-2">
                      <CheckCircle className="h-5 w-5 text-green-500 mx-auto" />
                    </td>
                    <td className="text-center py-2">
                      <CheckCircle className="h-5 w-5 text-green-500 mx-auto" />
                    </td>
                  </tr>
                  <tr className="border-b">
                    <td className="py-2">Tool Comparison (up to 4)</td>
                    <td className="text-center py-2">
                      <CheckCircle className="h-5 w-5 text-green-500 mx-auto" />
                    </td>
                    <td className="text-center py-2">
                      <CheckCircle className="h-5 w-5 text-green-500 mx-auto" />
                    </td>
                  </tr>
                  <tr className="border-b">
                    <td className="py-2">Community Forum</td>
                    <td className="text-center py-2">
                      <CheckCircle className="h-5 w-5 text-green-500 mx-auto" />
                    </td>
                    <td className="text-center py-2">
                      <CheckCircle className="h-5 w-5 text-green-500 mx-auto" />
                    </td>
                  </tr>
                  <tr className="border-b">
                    <td className="py-2">Personalized Recommendations</td>
                    <td className="text-center py-2">Basic</td>
                    <td className="text-center py-2">
                      <CheckCircle className="h-5 w-5 text-green-500 mx-auto" />
                    </td>
                  </tr>
                  <tr className="border-b">
                    <td className="py-2">Expert Study Guides</td>
                    <td className="text-center py-2">-</td>
                    <td className="text-center py-2">
                      <CheckCircle className="h-5 w-5 text-green-500 mx-auto" />
                    </td>
                  </tr>
                  <tr className="border-b">
                    <td className="py-2">Priority Support</td>
                    <td className="text-center py-2">-</td>
                    <td className="text-center py-2">
                      <CheckCircle className="h-5 w-5 text-green-500 mx-auto" />
                    </td>
                  </tr>
                </tbody>
              </table>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
