import { prisma } from '@/lib/db'
import { NextRequest, NextResponse } from 'next/server'

/**
 * GET /api/feedback/[id]
 * Retrieves a single feedback post with all related data (votes, comments)
 */
export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const { id } = params

    // Fetch feedback post with all related data
    const post = await prisma.feedbackPost.findUnique({
      where: { id },
      include: {
        author: {
          select: { id: true, name: true, email: true },
        },
        votes: {
          include: {
            user: {
              select: { id: true, name: true },
            },
          },
        },
        comments: {
          include: {
            author: {
              select: { id: true, name: true, email: true, isAdmin: true },
            },
          },
          orderBy: { createdAt: 'desc' },
        },
        _count: {
          select: { votes: true, comments: true },
        },
      },
    })

    if (!post) {
      return NextResponse.json(
        { error: 'Feedback post not found' },
        { status: 404 }
      )
    }

    return NextResponse.json(post)
  } catch (error) {
    console.error('Error fetching feedback:', error)
    return NextResponse.json(
      { error: 'Failed to fetch feedback' },
      { status: 500 }
    )
  }
}

/**
 * PATCH /api/feedback/[id]
 * Updates a feedback post (admin only)
 * Can update: title, description, status, category
 */
export async function PATCH(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const { id } = params
    const body = await request.json()
    const { title, description, status, category } = body

    // Build update data - only include fields that are provided
    const updateData: any = {}
    if (title !== undefined) updateData.title = title
    if (description !== undefined) updateData.description = description
    if (status !== undefined) updateData.status = status
    if (category !== undefined) updateData.category = category

    // Update feedback post
    const post = await prisma.feedbackPost.update({
      where: { id },
      data: updateData,
      include: {
        author: {
          select: { id: true, name: true, email: true },
        },
      },
    })

    return NextResponse.json(post)
  } catch (error) {
    console.error('Error updating feedback:', error)
    return NextResponse.json(
      { error: 'Failed to update feedback' },
      { status: 500 }
    )
  }
}

/**
 * DELETE /api/feedback/[id]
 * Deletes a feedback post (admin or author only)
 */
export async function DELETE(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const { id } = params

    // Delete feedback post (cascades to votes and comments)
    await prisma.feedbackPost.delete({
      where: { id },
    })

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error('Error deleting feedback:', error)
    return NextResponse.json(
      { error: 'Failed to delete feedback' },
      { status: 500 }
    )
  }
}
