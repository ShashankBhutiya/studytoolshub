import { type NextRequest, NextResponse } from "next/server"
import { getServerSession } from "next-auth"
import { authOptions } from "@/lib/auth"
import { toolModel } from "@/lib/file-db" // Using the file-based DB methods

interface SessionUser {
  id?: string
  name?: string | null
  email?: string | null
  image?: string | null
  role?: string
  subscriptionStatus?: string
  trialStartDate?: string
}

export async function GET(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions)

    if (!session) {
      return NextResponse.json({ message: "Unauthorized" }, { status: 401 })
    }

    // Check subscription status
    const user = session.user as SessionUser
    const now = new Date()
    const trialStart = new Date(user.trialStartDate || now)
    const trialEnd = new Date(trialStart.getTime() + 30 * 24 * 60 * 60 * 1000)
    const hasAccess =
      user.subscriptionStatus === "ACTIVE" ||
      (user.subscriptionStatus === "TRIAL" && now <= trialEnd)

    if (!hasAccess) {
      return NextResponse.json({ message: "Subscription required" }, { status: 403 })
    }

    // Remove MongoDB connection since we're using a file-based database
    // await dbConnect()

    const { searchParams } = new URL(request.url)
    const search = searchParams.get("search")
    const bestFor = searchParams.get("bestFor")
    const query: any = {}

    if (search) {
      query.$or = [
        { name: { $regex: search, $options: "i" } },
        { description: { $regex: search, $options: "i" } },
        { features: { $in: [new RegExp(search, "i")] } },
      ]
    }

    if (bestFor) {
      query.bestFor = { $in: [bestFor] }
    }

    // Use the file-db toolModel to fetch tools from the local JSON file
    const tools = await toolModel.find(query)

    return NextResponse.json(tools)
  } catch (error) {
    console.error("Error fetching tools:", error)
    return NextResponse.json({ message: "Internal server error" }, { status: 500 })
  }
}

export async function POST(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions)
    const user = session?.user as SessionUser

    if (!session || user?.role !== "ADMIN") {
      return NextResponse.json({ message: "Unauthorized" }, { status: 401 })
    }

    // Remove MongoDB connection; local file updates don't require it
    // await dbConnect()

    const toolData = await request.json()
    // Generate slug from name
    const slug = toolData.name
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, "-")
      .replace(/(^-|-$)/g, "")
    
    // Use the file-db toolModel to create a new tool
    const tool = await toolModel.create({
      ...toolData,
      slug,
    })

    return NextResponse.json(tool)
  } catch (error: any) {
    console.error("Error creating tool:", error)
    return NextResponse.json({ message: "Failed to create tool" }, { status: 500 })
  }
}

