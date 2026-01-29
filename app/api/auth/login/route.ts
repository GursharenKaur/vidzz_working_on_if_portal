import { type NextRequest, NextResponse } from "next/server"

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { email, password } = body

    if (!email || !password) {
      return NextResponse.json({ error: "Email and password are required" }, { status: 400 })
    }

    // Mock authentication logic
    // In a real app, this would verify against a database
    const determineRole = (email: string): "student" | "company" | "admin" => {
      if (email.includes("admin")) return "admin"
      if (email.includes("company")) return "company"
      return "student"
    }

    const role = determineRole(email)
    const token = `mock-jwt-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`

    return NextResponse.json({
      success: true,
      token,
      role,
      user: {
        id: Math.random().toString(36).substr(2, 9),
        email,
        name: email.split("@")[0],
      },
    })
  } catch (error) {
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}
