import { type NextRequest, NextResponse } from "next/server"
import { getServerSession } from "next-auth"
import dbConnect from "@/lib/mongodb"
import User from "@/models/User"
import { authOptions } from "@/lib/auth"

export async function POST(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions)

    if (!session) {
      return NextResponse.json({ message: "Unauthorized" }, { status: 401 })
    }

    await dbConnect()

    // Mock payment processing - always successful for demo
    const subscriptionEndDate = new Date()
    subscriptionEndDate.setMonth(subscriptionEndDate.getMonth() + 1)

    await User.findByIdAndUpdate(session.user.id, {
      subscriptionStatus: "ACTIVE",
      subscriptionEndDate: subscriptionEndDate.toISOString(),
    })

    return NextResponse.json({
      success: true,
      message: "Mock payment processed successfully",
    })
  } catch (error) {
    console.error("Error processing mock payment:", error)
    return NextResponse.json({ message: "Internal server error" }, { status: 500 })
  }
}
