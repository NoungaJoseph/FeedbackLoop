'use client'

import { useState, useEffect } from 'react'
import { Button } from '@/components/ui/button'
import { Card } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { BarChart3, TrendingUp, MessageSquare, CheckCircle } from 'lucide-react'
import AdminFeedbackCard from '@/components/AdminFeedbackCard'
import { toast } from 'sonner'

interface FeedbackPost {
  id: string
  title: string
  description: string
  category: string
  status: string
  upvotes: number
  downvotes: number
  author: {
    id: string
    name: string
    email: string
  }
  _count: {
    votes: number
    comments: number
  }
  createdAt: string
}

/**
 * Admin Dashboard Page
 * Allows admins to view, filter, and manage feedback posts
 * Can change status of feedback items (Under Review, Planned, Completed, Rejected)
 */
export default function AdminDashboard() {
  const [posts, setPosts] = useState<FeedbackPost[]>([])
  const [loading, setLoading] = useState(true)
  const [statusFilter, setStatusFilter] = useState<string>('all')
  const [stats, setStats] = useState({
    total: 0,
    underReview: 0,
    planned: 0,
    completed: 0,
    rejected: 0,
  })

  // Fetch posts on mount and when filter changes
  useEffect(() => {
    fetchPosts()
  }, [statusFilter])

  /**
   * Fetches all feedback posts for admin view
   */
  const fetchPosts = async () => {
    try {
      setLoading(true)
      const params = new URLSearchParams()
      if (statusFilter !== 'all') {
        params.append('status', statusFilter)
      }

      const response = await fetch(`/api/feedback?${params}`)
      const data = await response.json()
      setPosts(data)

      // Calculate stats
      const allResponse = await fetch('/api/feedback')
      const allData = await allResponse.json()
      setStats({
        total: allData.length,
        underReview: allData.filter((p: any) => p.status === 'under-review').length,
        planned: allData.filter((p: any) => p.status === 'planned').length,
        completed: allData.filter((p: any) => p.status === 'completed').length,
        rejected: allData.filter((p: any) => p.status === 'rejected').length,
      })
    } catch (error) {
      console.error('Error fetching posts:', error)
      toast.error('Failed to load feedback')
    } finally {
      setLoading(false)
    }
  }

  /**
   * Handles status update for a feedback post
   */
  const handleStatusChange = async (postId: string, newStatus: string) => {
    try {
      const response = await fetch(`/api/feedback/${postId}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status: newStatus }),
      })

      if (!response.ok) {
        throw new Error('Failed to update status')
      }

      toast.success('Status updated!')
      fetchPosts()
    } catch (error) {
      console.error('Error updating status:', error)
      toast.error('Failed to update status')
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100">
      {/* Header */}
      <header className="sticky top-0 z-50 bg-white border-b border-slate-200 shadow-sm">
        <div className="max-w-7xl mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                Admin Dashboard
              </h1>
              <p className="text-sm text-slate-600">Manage and categorize user feedback</p>
            </div>
            <Button
              variant="outline"
              onClick={() => window.location.href = '/'}
            >
              Back to Board
            </Button>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 py-8">
        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-5 gap-4 mb-8">
          <Card className="p-6 border-l-4 border-l-slate-500">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-slate-600 text-sm">Total Feedback</p>
                <p className="text-3xl font-bold text-slate-900">{stats.total}</p>
              </div>
              <BarChart3 className="w-8 h-8 text-slate-400" />
            </div>
          </Card>

          <Card className="p-6 border-l-4 border-l-yellow-500">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-slate-600 text-sm">Under Review</p>
                <p className="text-3xl font-bold text-yellow-600">{stats.underReview}</p>
              </div>
              <TrendingUp className="w-8 h-8 text-yellow-400" />
            </div>
          </Card>

          <Card className="p-6 border-l-4 border-l-blue-500">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-slate-600 text-sm">Planned</p>
                <p className="text-3xl font-bold text-blue-600">{stats.planned}</p>
              </div>
              <TrendingUp className="w-8 h-8 text-blue-400" />
            </div>
          </Card>

          <Card className="p-6 border-l-4 border-l-green-500">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-slate-600 text-sm">Completed</p>
                <p className="text-3xl font-bold text-green-600">{stats.completed}</p>
              </div>
              <CheckCircle className="w-8 h-8 text-green-400" />
            </div>
          </Card>

          <Card className="p-6 border-l-4 border-l-red-500">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-slate-600 text-sm">Rejected</p>
                <p className="text-3xl font-bold text-red-600">{stats.rejected}</p>
              </div>
              <MessageSquare className="w-8 h-8 text-red-400" />
            </div>
          </Card>
        </div>

        {/* Feedback List */}
        <Card className="p-6">
          <div className="mb-6">
            <h2 className="text-xl font-semibold text-slate-900 mb-4">Feedback Items</h2>
            <div className="flex gap-2">
              <Button
                variant={statusFilter === 'all' ? 'default' : 'outline'}
                onClick={() => setStatusFilter('all')}
                className={statusFilter === 'all' ? 'bg-gradient-to-r from-blue-600 to-purple-600' : ''}
              >
                All
              </Button>
              <Button
                variant={statusFilter === 'under-review' ? 'default' : 'outline'}
                onClick={() => setStatusFilter('under-review')}
                className={statusFilter === 'under-review' ? 'bg-gradient-to-r from-blue-600 to-purple-600' : ''}
              >
                Under Review
              </Button>
              <Button
                variant={statusFilter === 'planned' ? 'default' : 'outline'}
                onClick={() => setStatusFilter('planned')}
                className={statusFilter === 'planned' ? 'bg-gradient-to-r from-blue-600 to-purple-600' : ''}
              >
                Planned
              </Button>
              <Button
                variant={statusFilter === 'completed' ? 'default' : 'outline'}
                onClick={() => setStatusFilter('completed')}
                className={statusFilter === 'completed' ? 'bg-gradient-to-r from-blue-600 to-purple-600' : ''}
              >
                Completed
              </Button>
              <Button
                variant={statusFilter === 'rejected' ? 'default' : 'outline'}
                onClick={() => setStatusFilter('rejected')}
                className={statusFilter === 'rejected' ? 'bg-gradient-to-r from-blue-600 to-purple-600' : ''}
              >
                Rejected
              </Button>
            </div>
          </div>

          {/* Posts List */}
          <div className="space-y-4">
            {loading ? (
              <p className="text-center py-8 text-slate-600">Loading...</p>
            ) : posts.length === 0 ? (
              <p className="text-center py-8 text-slate-600">No feedback items found</p>
            ) : (
              posts.map((post) => (
                <AdminFeedbackCard
                  key={post.id}
                  post={post}
                  onStatusChange={handleStatusChange}
                />
              ))
            )}
          </div>
        </Card>
      </main>
    </div>
  )
}
