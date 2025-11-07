import { prisma } from '@/lib/db'
import { NextRequest, NextResponse } from 'next/server'

/**
 * POST /api/comments
 * Creates a new comment on a feedback post
 * Body:
 * - postId: string
 * - authorId: string
 * - content: string
 */
export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { postId, authorId, content } = body

    // Validate required fields
    if (!postId || !authorId || !content) {
      return NextResponse.json(
        { error: 'Missing required fields: postId, authorId, content' },
        { status: 400 }
      )
    }

    // Validate content length
    if (content.trim().length === 0 || content.length > 5000) {
      return NextResponse.json(
        { error: 'Comment must be between 1 and 5000 characters' },
        { status: 400 }
      )
    }

    // Create new comment
    const comment = await prisma.comment.create({
      data: {
        content,
        authorId,
        postId,
      },
      include: {
        author: {
          select: { id: true, name: true, email: true, isAdmin: true },
        },
      },
    })

    return NextResponse.json(comment, { status: 201 })
  } catch (error) {
    console.error('Error creating comment:', error)
    return NextResponse.json(
      { error: 'Failed to create comment' },
      { status: 500 }
    )
  }
}
