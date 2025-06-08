export interface User {
  id: string
  email: string
  name: string
  role: "USER" | "ADMIN"
  subscriptionStatus: "TRIAL" | "ACTIVE" | "EXPIRED"
  preparingFor: "JEE" | "NEET" | "BOTH"
  razorpayCustomerId?: string
  trialStartDate: Date
  subscriptionEndDate?: Date
}

export interface Tool {
  _id: string
  name: string
  slug: string
  category: string
  description: string
  website: string
  pricing: string
  features: string[]
  pros: string[]
  cons: string[]
  platforms: string[]
  bestFor: string[]
  rating: number
  reviewCount: number
  logo?: string
}

export interface ForumPost {
  _id: string
  title: string
  content: string
  author: {
    _id: string
    name: string
  }
  category: string
  likes: string[]
  comments: string[]
  tags: string[]
  createdAt: Date
  updatedAt: Date
}

export interface ForumComment {
  _id: string
  content: string
  author: {
    _id: string
    name: string
  }
  post: string
  parentComment?: string
  likes: string[]
  createdAt: Date
}
