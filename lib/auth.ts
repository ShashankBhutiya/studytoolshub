import type { NextAuthOptions } from "next-auth"
import CredentialsProvider from "next-auth/providers/credentials"
import bcrypt from "bcryptjs"
import dbConnect from "./mongodb"
import User from "@/models/User"

export const authOptions: NextAuthOptions = {
  providers: [
    CredentialsProvider({
      name: "credentials",
      credentials: {
        email: { label: "Email", type: "email" },
        password: { label: "Password", type: "password" },
      },
      async authorize(credentials) {
        if (!credentials?.email || !credentials?.password) {
          return null
        }

        await dbConnect()

        const user = await User.findOne({ email: credentials.email })

        if (!user) {
          return null
        }

        const isPasswordValid = await bcrypt.compare(credentials.password, user.password)

        if (!isPasswordValid) {
          return null
        }

        return {
          id: user._id,
          email: user.email,
          name: user.name,
          role: user.role,
          subscriptionStatus: user.subscriptionStatus,
          preparingFor: user.preparingFor,
          razorpayCustomerId: user.razorpayCustomerId,
          trialStartDate: user.trialStartDate,
          subscriptionEndDate: user.subscriptionEndDate,
        }
      },
    }),
  ],
  session: {
    strategy: "jwt",
  },
  callbacks: {
    async jwt({ token, user }) {
      if (user) {
        token.role = user.role
        token.subscriptionStatus = user.subscriptionStatus
        token.preparingFor = user.preparingFor
        token.razorpayCustomerId = user.razorpayCustomerId
        token.trialStartDate = user.trialStartDate
        token.subscriptionEndDate = user.subscriptionEndDate
      }
      return token
    },
    async session({ session, token }) {
      if (token) {
        session.user.id = token.sub!
        session.user.role = token.role as string
        session.user.subscriptionStatus = token.subscriptionStatus as string
        session.user.preparingFor = token.preparingFor as string
        session.user.razorpayCustomerId = token.razorpayCustomerId as string
        session.user.trialStartDate = token.trialStartDate as string
        session.user.subscriptionEndDate = token.subscriptionEndDate as string
      }
      return session
    },
  },
  pages: {
    signIn: "/login",
  },
}
