import { prisma } from '@/lib/db'
import { NextRequest, NextResponse } from 'next/server'

/**
 * GET /api/admin/weekly-summary
 * Retrieves weekly summary of all feedback activities
 */
export async function GET(request: NextRequest) {
  try {
    // Get the start of the current week (Monday)
    const now = new Date()
    const dayOfWeek = now.getDay()
    const diff = now.getDate() - dayOfWeek + (dayOfWeek === 0 ? -6 : 1)
    const weekStart = new Date(now.setDate(diff))
    weekStart.setHours(0, 0, 0, 0)

    const weekEnd = new Date(weekStart)
    weekEnd.setDate(weekEnd.getDate() + 7)

    // Get all feedback created this week
    const feedbackThisWeek = await prisma.feedbackPost.findMany({
      where: {
        createdAt: {
          gte: weekStart,
          lt: weekEnd,
        },
      },
      include: {
        author: {
          select: { id: true, name: true, email: true },
        },
        _count: {
          select: { votes: true, comments: true },
        },
      },
      orderBy: { createdAt: 'desc' },
    })

    // Get all votes this week
    const votesThisWeek = await prisma.vote.findMany({
      where: {
        createdAt: {
          gte: weekStart,
          lt: weekEnd,
        },
      },
    })

    // Get all comments this week
    const commentsThisWeek = await prisma.comment.findMany({
      where: {
        createdAt: {
          gte: weekStart,
          lt: weekEnd,
        },
      },
      include: {
        author: {
          select: { id: true, name: true, email: true },
        },
      },
    })

    // Calculate statistics
    const stats = {
      weekStart: weekStart.toISOString(),
      weekEnd: weekEnd.toISOString(),
      totalFeedback: feedbackThisWeek.length,
      totalVotes: votesThisWeek.length,
      totalComments: commentsThisWeek.length,
      feedbackByCategory: {
        featureRequest: feedbackThisWeek.filter(f => f.category === 'feature-request').length,
        bugReport: feedbackThisWeek.filter(f => f.category === 'bug-report').length,
        improvement: feedbackThisWeek.filter(f => f.category === 'improvement').length,
        other: feedbackThisWeek.filter(f => f.category === 'other').length,
      },
      feedbackByStatus: {
        underReview: feedbackThisWeek.filter(f => f.status === 'under-review').length,
        planned: feedbackThisWeek.filter(f => f.status === 'planned').length,
        completed: feedbackThisWeek.filter(f => f.status === 'completed').length,
        rejected: feedbackThisWeek.filter(f => f.status === 'rejected').length,
      },
      upvotes: votesThisWeek.filter(v => v.type === 'upvote').length,
      downvotes: votesThisWeek.filter(v => v.type === 'downvote').length,
    }

    return NextResponse.json({
      stats,
      feedback: feedbackThisWeek,
      votes: votesThisWeek,
      comments: commentsThisWeek,
    })
  } catch (error) {
    console.error('Error fetching weekly summary:', error)
    return NextResponse.json(
      { error: 'Failed to fetch weekly summary' },
      { status: 500 }
    )
  }
}
