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

    // Mock payment verification - always successful for demo
    const mockPaymentData = await request.json()

    // Update user subscription status
    await dbConnect()

    const subscriptionEndDate = new Date()
    subscriptionEndDate.setMonth(subscriptionEndDate.getMonth() + 1)

    await User.findByIdAndUpdate(session.user.id, {
      subscriptionStatus: "ACTIVE",
      subscriptionEndDate,
    })

    return NextResponse.json({ message: "Mock subscription verified successfully" })
  } catch (error) {
    console.error("Error verifying mock subscription:", error)
    return NextResponse.json({ message: "Internal server error" }, { status: 500 })
  }
}
