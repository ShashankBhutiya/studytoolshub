import { type NextRequest, NextResponse } from "next/server"
import { getServerSession } from "next-auth"
import dbConnect from "@/lib/mongodb"
import ForumPost from "@/models/ForumPost"
import { authOptions } from "@/lib/auth"

export async function POST(request: NextRequest, { params }: { params: { id: string } }) {
  try {
    const session = await getServerSession(authOptions)

    if (!session) {
      return NextResponse.json({ message: "Unauthorized" }, { status: 401 })
    }

    await dbConnect()

    const postId = params.id
    const userId = session.user.id

    const post = await ForumPost.findById(postId)

    if (!post) {
      return NextResponse.json({ message: "Post not found" }, { status: 404 })
    }

    const isLiked = post.likes.includes(userId)

    if (isLiked) {
      // Unlike
      post.likes = post.likes.filter((id: string) => id.toString() !== userId)
    } else {
      // Like
      post.likes.push(userId)
    }

    await post.save()

    return NextResponse.json({
      liked: !isLiked,
      likesCount: post.likes.length,
    })
  } catch (error) {
    console.error("Error toggling like:", error)
    return NextResponse.json({ message: "Internal server error" }, { status: 500 })
  }
}
