import { NextResponse } from "next/server"
import Tool from "@/models/Tool"

const sampleTools = [
  {
    name: "Physics Wallah",
    slug: "physics-wallah",
    category: "VIDEO_LEARNING",
    description: "Comprehensive video lectures for JEE and NEET preparation with affordable pricing",
    website: "https://www.pw.live",
    pricing: "₹3,999/year",
    features: [
      "Live and recorded lectures",
      "DPPs and assignments",
      "Test series",
      "Doubt solving sessions",
      "Mobile app access",
    ],
    pros: ["Very affordable pricing", "Quality content", "Good faculty", "Regular updates"],
    cons: ["Limited advanced topics", "Basic UI/UX", "Limited doubt support"],
    platforms: ["WEB", "ANDROID", "IOS"],
    bestFor: ["JEE", "NEET"],
    rating: 4.3,
    reviewCount: 15420,
  },
  {
    name: "Unacademy",
    slug: "unacademy",
    category: "LIVE_CLASSES",
    description: "Live online classes with top educators for competitive exam preparation",
    website: "https://unacademy.com",
    pricing: "₹15,000-25,000/year",
    features: [
      "Live interactive classes",
      "Recorded lectures",
      "Test series and assessments",
      "Study materials and notes",
      "Doubt clearing sessions",
    ],
    pros: ["Top quality educators", "Interactive live classes", "Comprehensive study material", "Good test series"],
    cons: ["Expensive pricing", "Internet dependency", "Limited offline access"],
    platforms: ["WEB", "ANDROID", "IOS"],
    bestFor: ["JEE", "NEET"],
    rating: 4.1,
    reviewCount: 28350,
  },
  {
    name: "Allen Test My Prep",
    slug: "allen-test-my-prep",
    category: "PRACTICE_TESTS",
    description: "Comprehensive test series and practice questions from Allen Institute",
    website: "https://testmyprep.allen.ac.in",
    pricing: "₹8,000-12,000/year",
    features: [
      "Chapter-wise tests",
      "Full-length mock tests",
      "Previous year papers",
      "Detailed analytics",
      "Performance tracking",
    ],
    pros: ["Quality questions", "Detailed solutions", "Good analytics", "Allen brand trust"],
    cons: ["Limited video explanations", "Basic interface", "No live doubt support"],
    platforms: ["WEB", "ANDROID", "IOS"],
    bestFor: ["JEE", "NEET"],
    rating: 4.2,
    reviewCount: 12680,
  },
  {
    name: "Notion",
    slug: "notion",
    category: "NOTE_TAKING",
    description: "All-in-one workspace for notes, planning, and collaboration",
    website: "https://notion.so",
    pricing: "Free - ₹800/month",
    features: ["Rich text editing", "Database and tables", "Templates", "Collaboration tools", "Cross-platform sync"],
    pros: ["Highly customizable", "Great for organization", "Free tier available", "Excellent templates"],
    cons: ["Learning curve", "Can be overwhelming", "Slow on mobile"],
    platforms: ["WEB", "ANDROID", "IOS", "DESKTOP"],
    bestFor: ["JEE", "NEET"],
    rating: 4.5,
    reviewCount: 45230,
  },
  {
    name: "Forest",
    slug: "forest",
    category: "STUDY_PLANNER",
    description: "Gamified focus app that helps you stay concentrated while studying",
    website: "https://forestapp.cc",
    pricing: "₹250 one-time",
    features: ["Pomodoro timer", "Focus tracking", "Virtual forest growth", "Study statistics", "Whitelist apps"],
    pros: ["Gamified approach", "Helps build focus", "Beautiful interface", "Motivating"],
    cons: ["Limited features", "One-time payment", "Basic analytics"],
    platforms: ["ANDROID", "IOS"],
    bestFor: ["JEE", "NEET"],
    rating: 4.6,
    reviewCount: 89450,
  },
  {
    name: "Wolfram Alpha",
    slug: "wolfram-alpha",
    category: "PROBLEM_SOLVING",
    description: "Computational knowledge engine for solving mathematical problems",
    website: "https://wolframalpha.com",
    pricing: "₹400/month",
    features: [
      "Step-by-step solutions",
      "Mathematical computations",
      "Graph plotting",
      "Scientific calculations",
      "Educational tools",
    ],
    pros: ["Accurate solutions", "Step-by-step explanations", "Wide range of topics", "Reliable calculations"],
    cons: ["Subscription required for full features", "Complex interface", "Limited to computational problems"],
    platforms: ["WEB", "ANDROID", "IOS"],
    bestFor: ["JEE", "NEET"],
    rating: 4.4,
    reviewCount: 23670,
  },
]

export async function POST() {
  try {
    // Clear existing tools
    await Tool.deleteMany()

    // Insert sample tools
    await Tool.insertMany(sampleTools)

    return NextResponse.json({ message: "Sample tools seeded successfully" })
  } catch (error) {
    console.error("Error seeding tools:", error)
    return NextResponse.json({ message: "Error seeding tools" }, { status: 500 })
  }
}
