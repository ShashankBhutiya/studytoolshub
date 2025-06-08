import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import Link from "next/link"
import { BookOpen, Users, Search, Star, ArrowRight, CheckCircle } from "lucide-react"
import { SelectItem } from "@/components/ui/select"

export default function HomePage() {
  return (
    <div className="min-h-screen">
      {/* Header */}
      <header className="border-b">
        <div className="container mx-auto px-4 py-4 flex justify-between items-center">
          <div className="flex items-center space-x-2">
            <BookOpen className="h-8 w-8 text-primary" />
            <span className="text-2xl font-bold">StudyToolsHub</span>
          </div>
          <div className="flex items-center space-x-4">
            <Link href="/login">
              <Button variant="ghost">Login</Button>
            </Link>
            <Link href="/register">
              <Button>Get Started</Button>
            </Link>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section className="py-20 bg-gradient-to-b from-secondary to-background">
        <div className="container mx-auto px-4 text-center">
          <Badge className="mb-4" variant="secondary">
            30-Day Free Trial
          </Badge>
          <h1 className="text-5xl font-bold mb-6">
            Discover the Best Study Tools for <span className="text-primary">JEE & NEET</span>
          </h1>
          <p className="text-xl text-muted-foreground mb-8 max-w-2xl mx-auto">
            Compare 100+ premium study tools, get expert recommendations, and join a community of serious aspirants.
          </p>
          <div className="flex justify-center space-x-4">
            <Link href="/register">
              <Button size="lg" className="text-lg px-8">
                Start Free Trial
                <ArrowRight className="ml-2 h-5 w-5" />
              </Button>
            </Link>
            <Link href="/tools">
              <Button size="lg" variant="outline" className="text-lg px-8">
                Browse Tools
              </Button>
            </Link>
          </div>
        </div>
      </section>

      {/* Features */}
      <section className="py-20">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl font-bold text-center mb-12">Why Choose StudyToolsHub?</h2>
          <div className="grid md:grid-cols-3 gap-8">
            <Card>
              <CardHeader>
                <Search className="h-12 w-12 text-primary mb-4" />
                <CardTitle>Smart Discovery</CardTitle>
                <CardDescription>
                  Find the perfect study tools with advanced filters and AI-powered recommendations
                </CardDescription>
              </CardHeader>
            </Card>
            <Card>
              <CardHeader>
                <Star className="h-12 w-12 text-primary mb-4" />
                <CardTitle>Expert Reviews</CardTitle>
                <CardDescription>
                  Get detailed comparisons and honest reviews from successful JEE/NEET candidates
                </CardDescription>
              </CardHeader>
            </Card>
            <Card>
              <CardHeader>
                <Users className="h-12 w-12 text-primary mb-4" />
                <CardTitle>Active Community</CardTitle>
                <CardDescription>Connect with fellow aspirants, share experiences, and get study tips</CardDescription>
              </CardHeader>
            </Card>
          </div>
        </div>
      </section>

      {/* Pricing */}
      <section className="py-20 bg-secondary">
        <div className="container mx-auto px-4">
          <div className="max-w-md mx-auto">
            <Card className="border-2 border-primary">
              <CardHeader className="text-center">
                <Badge className="w-fit mx-auto mb-2">Most Popular</Badge>
                <CardTitle className="text-2xl">Premium Access</CardTitle>
                <CardDescription>Everything you need to ace JEE/NEET</CardDescription>
                <div className="text-4xl font-bold mt-4">
                  ₹299<span className="text-lg font-normal text-muted-foreground">/month</span>
                </div>
              </CardHeader>
              <CardContent>
                <ul className="space-y-3 mb-6">
                  <li className="flex items-center">
                    <CheckCircle className="h-5 w-5 text-green-500 mr-2" />
                    Access to 100+ study tools
                  </li>
                  <li className="flex items-center">
                    <CheckCircle className="h-5 w-5 text-green-500 mr-2" />
                    Tool comparison & recommendations
                  </li>
                  <li className="flex items-center">
                    <CheckCircle className="h-5 w-5 text-green-500 mr-2" />
                    Community forum access
                  </li>
                  <li className="flex items-center">
                    <CheckCircle className="h-5 w-5 text-green-500 mr-2" />
                    Expert study guides
                  </li>
                  <li className="flex items-center">
                    <CheckCircle className="h-5 w-5 text-green-500 mr-2" />
                    30-day free trial
                  </li>
                </ul>
                <Link href="/register">
                  <Button className="w-full" size="lg">
                    Start Free Trial
                  </Button>
                </Link>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t py-12">
        <div className="container mx-auto px-4 text-center">
          <div className="flex items-center justify-center space-x-2 mb-4">
            <BookOpen className="h-6 w-6 text-primary" />
            <span className="text-xl font-bold">StudyToolsHub</span>
          </div>
          <p className="text-muted-foreground">© 2024 StudyToolsHub. All rights reserved.</p>
        </div>
      </footer>
    </div>
  )
}
