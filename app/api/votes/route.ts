import { prisma } from '@/lib/db'
import { NextRequest, NextResponse } from 'next/server'

/**
 * POST /api/votes
 * Creates or updates a vote on a feedback post
 * Body:
 * - postId: string
 * - userId: string
 * - type: 'upvote' | 'downvote'
 */
export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { postId, userId, type } = body

    // Validate required fields
    if (!postId || !userId || !type) {
      return NextResponse.json(
        { error: 'Missing required fields: postId, userId, type' },
        { status: 400 }
      )
    }

    // Validate vote type
    if (!['upvote', 'downvote'].includes(type)) {
      return NextResponse.json(
        { error: 'Invalid vote type. Must be upvote or downvote' },
        { status: 400 }
      )
    }

    // Check if user already voted on this post
    const existingVote = await prisma.vote.findUnique({
      where: {
        userId_postId: { userId, postId },
      },
    })

    let vote
    let post

    if (existingVote) {
      // If same vote type, remove the vote (toggle off)
      if (existingVote.type === type) {
        await prisma.vote.delete({
          where: { id: existingVote.id },
        })

        // Update post vote counts
        if (type === 'upvote') {
          post = await prisma.feedbackPost.update({
            where: { id: postId },
            data: { upvotes: { decrement: 1 } },
          })
        } else {
          post = await prisma.feedbackPost.update({
            where: { id: postId },
            data: { downvotes: { decrement: 1 } },
          })
        }

        return NextResponse.json({ success: true, vote: null, post })
      } else {
        // Change vote type
        vote = await prisma.vote.update({
          where: { id: existingVote.id },
          data: { type },
        })

        // Update post vote counts
        if (type === 'upvote') {
          post = await prisma.feedbackPost.update({
            where: { id: postId },
            data: { upvotes: { increment: 1 }, downvotes: { decrement: 1 } },
          })
        } else {
          post = await prisma.feedbackPost.update({
            where: { id: postId },
            data: { upvotes: { decrement: 1 }, downvotes: { increment: 1 } },
          })
        }
      }
    } else {
      // Create new vote
      vote = await prisma.vote.create({
        data: {
          type,
          userId,
          postId,
        },
      })

      // Update post vote counts
      if (type === 'upvote') {
        post = await prisma.feedbackPost.update({
          where: { id: postId },
          data: { upvotes: { increment: 1 } },
        })
      } else {
        post = await prisma.feedbackPost.update({
          where: { id: postId },
          data: { downvotes: { increment: 1 } },
        })
      }
    }

    return NextResponse.json({ success: true, vote, post })
  } catch (error) {
    console.error('Error voting:', error)
    return NextResponse.json(
      { error: 'Failed to process vote' },
      { status: 500 }
    )
  }
}
