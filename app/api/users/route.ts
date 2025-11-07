import { prisma } from '@/lib/db'
import { NextRequest, NextResponse } from 'next/server'

/**
 * POST /api/users
 * Creates or retrieves a user by email
 * Body:
 * - email: string
 * - name: string
 */
export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { email, name } = body

    // Validate required fields
    if (!email || !name) {
      return NextResponse.json(
        { error: 'Missing required fields: email, name' },
        { status: 400 }
      )
    }

    // Check if user already exists
    let user = await prisma.user.findUnique({
      where: { email },
    })

    // If user doesn't exist, create one
    if (!user) {
      user = await prisma.user.create({
        data: {
          email,
          name,
        },
      })
    }

    return NextResponse.json(user)
  } catch (error) {
    console.error('Error creating/retrieving user:', error)
    return NextResponse.json(
      { error: 'Failed to process user' },
      { status: 500 }
    )
  }
}
