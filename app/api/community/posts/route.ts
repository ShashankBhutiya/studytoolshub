import { type NextRequest, NextResponse } from "next/server"
import { getServerSession } from "next-auth"
import dbConnect from "@/lib/mongodb"
import ForumPost from "@/models/ForumPost"
import { authOptions } from "@/lib/auth"
import mongoose, { Document } from 'mongoose'
import 'next-auth'

declare module 'next-auth' {
  interface Session {
    user: {
      id?: string
      name?: string | null
      email?: string | null
      image?: string | null
    }
  }
}

export async function GET(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions)

    if (!session) {
      return NextResponse.json({ message: "Unauthorized" }, { status: 401 })
    }

    await dbConnect()

    const { searchParams } = new URL(request.url)
    const search = searchParams.get("search")
    const category = searchParams.get("category")
    const query: mongoose.FilterQuery<Document> = {}

    if (search) {
      query.$or = [
        { title: { $regex: search, $options: "i" } },
        { content: { $regex: search, $options: "i" } },
        { tags: { $in: [new RegExp(search, "i")] } },
      ]
    }

    if (category) {
      query.category = category
    }

    const posts = await (ForumPost as any).find(query).populate("author", "name").sort({ createdAt: -1 }).limit(50)

    return NextResponse.json(posts)
  } catch (error) {
    console.error("Error fetching posts:", error)
    return NextResponse.json({ message: "Internal server error" }, { status: 500 })
  }
}

export async function POST(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions)

    if (!session) {
      return NextResponse.json({ message: "Unauthorized" }, { status: 401 })
    }

    await dbConnect()

    const { title, content, category, tags } = await request.json()

    if (!session.user || !session.user.id) {
      return NextResponse.json({ message: "User not found" }, { status: 401 })
    }

    const post = await ForumPost.create({
      title,
      content,
      category,
      tags,
      author: session.user.id,
    })

    const populatedPost = await (ForumPost.findById(post._id) as any).populate("author", "name")

    return NextResponse.json(populatedPost, { status: 201 })
  } catch (error) {
    console.error("Error creating post:", error)
    return NextResponse.json({ message: "Internal server error" }, { status: 500 })
  }
}
