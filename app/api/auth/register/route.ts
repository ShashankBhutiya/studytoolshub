import { type NextRequest, NextResponse } from "next/server"
import bcrypt from "bcryptjs"
import dbConnect from "@/lib/mongodb"
import User from "@/models/User"
import { createRazorpayCustomer } from "@/lib/razorpay"

export async function POST(request: NextRequest) {
  try {
    const { name, email, password, preparingFor } = await request.json()

    await dbConnect()

    // Check if user already exists
    const existingUser = await User.findOne({ email })
    if (existingUser) {
      return NextResponse.json({ message: "User already exists" }, { status: 400 })
    }

    // Hash password
    const hashedPassword = await bcrypt.hash(password, 12)

    // Create mock customer ID
    const razorpayCustomer = await createRazorpayCustomer(email, name)

    // Create user
    const user = await User.create({
      name,
      email,
      password: hashedPassword,
      preparingFor,
      razorpayCustomerId: razorpayCustomer.id,
      role: "USER",
      subscriptionStatus: "TRIAL",
      trialStartDate: new Date().toISOString(),
    })

    return NextResponse.json({ message: "User created successfully", userId: user._id }, { status: 201 })
  } catch (error) {
    console.error("Registration error:", error)
    return NextResponse.json({ message: "Internal server error" }, { status: 500 })
  }
}
