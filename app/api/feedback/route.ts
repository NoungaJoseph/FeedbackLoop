import { prisma } from '@/lib/db'
import { NextRequest, NextResponse } from 'next/server'

/**
 * GET /api/feedback
 * Retrieves all feedback posts with optional filtering and sorting
 * Query parameters:
 * - status: filter by status (under-review, planned, completed, rejected)
 * - category: filter by category (feature-request, bug-report, improvement, other)
 * - sort: sort by (newest, popular, controversial)
 */
export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams
    const status = searchParams.get('status')
    const category = searchParams.get('category')
    const sort = searchParams.get('sort') || 'newest'

    // Build filter conditions
    const where: any = {}
    if (status) where.status = status
    if (category) where.category = category

    // Determine sort order
    let orderBy: any = { createdAt: 'desc' }
    if (sort === 'popular') {
      orderBy = { upvotes: 'desc' }
    } else if (sort === 'controversial') {
      orderBy = [{ upvotes: 'desc' }, { downvotes: 'desc' }]
    }

    // Fetch feedback posts with related data
    const posts = await prisma.feedbackPost.findMany({
      where,
      orderBy,
      include: {
        author: {
          select: { id: true, name: true, email: true },
        },
        _count: {
          select: { votes: true, comments: true },
        },
      },
    })

    return NextResponse.json(posts)
  } catch (error) {
    console.error('Error fetching feedback:', error)
    return NextResponse.json(
      { error: 'Failed to fetch feedback' },
      { status: 500 }
    )
  }
}

/**
 * POST /api/feedback
 * Creates a new feedback post
 * Required body:
 * - title: string
 * - description: string
 * - category: string (feature-request, bug-report, improvement, other)
 * - authorId: string (user ID)
 */
export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { title, description, category, authorId } = body

    // Validate required fields
    if (!title || !description || !authorId) {
      return NextResponse.json(
        { error: 'Missing required fields: title, description, authorId' },
        { status: 400 }
      )
    }

    // Create new feedback post
    const post = await prisma.feedbackPost.create({
      data: {
        title,
        description,
        category: category || 'feature-request',
        authorId,
      },
      include: {
        author: {
          select: { id: true, name: true, email: true },
        },
      },
    })

    return NextResponse.json(post, { status: 201 })
  } catch (error) {
    console.error('Error creating feedback:', error)
    return NextResponse.json(
      { error: 'Failed to create feedback' },
      { status: 500 }
    )
  }
}
