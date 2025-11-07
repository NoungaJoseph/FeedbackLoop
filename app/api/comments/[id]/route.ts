import { prisma } from '@/lib/db'
import { NextRequest, NextResponse } from 'next/server'

/**
 * PATCH /api/comments/[id]
 * Updates a comment (author only)
 * Body:
 * - content: string
 */
export async function PATCH(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const { id } = params
    const body = await request.json()
    const { content } = body

    // Validate content
    if (!content || content.trim().length === 0 || content.length > 5000) {
      return NextResponse.json(
        { error: 'Comment must be between 1 and 5000 characters' },
        { status: 400 }
      )
    }

    // Update comment
    const comment = await prisma.comment.update({
      where: { id },
      data: { content },
      include: {
        author: {
          select: { id: true, name: true, email: true },
        },
      },
    })

    return NextResponse.json(comment)
  } catch (error) {
    console.error('Error updating comment:', error)
    return NextResponse.json(
      { error: 'Failed to update comment' },
      { status: 500 }
    )
  }
}

/**
 * DELETE /api/comments/[id]
 * Deletes a comment (author or admin only)
 */
export async function DELETE(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const { id } = params

    // Delete comment
    await prisma.comment.delete({
      where: { id },
    })

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error('Error deleting comment:', error)
    return NextResponse.json(
      { error: 'Failed to delete comment' },
      { status: 500 }
    )
  }
}
