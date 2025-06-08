// Mock Razorpay implementation for development
export const razorpay = {
  customers: {
    create: async (data: any) => ({
      id: `cust_${Date.now()}`,
      name: data.name,
      email: data.email,
    }),
  },
  subscriptions: {
    create: async (data: any) => ({
      id: `sub_${Date.now()}`,
      plan_id: data.plan_id,
      customer_id: data.customer_id,
      status: "created",
    }),
  },
}

export const createRazorpayCustomer = async (email: string, name: string) => {
  try {
    const customer = await razorpay.customers.create({
      name,
      email,
    })
    return customer
  } catch (error) {
    console.error("Error creating mock customer:", error)
    throw error
  }
}

export const createSubscription = async (customerId: string, planId: string) => {
  try {
    const subscription = await razorpay.subscriptions.create({
      plan_id: planId,
      customer_id: customerId,
      total_count: 12,
      quantity: 1,
    })
    return subscription
  } catch (error) {
    console.error("Error creating mock subscription:", error)
    throw error
  }
}
