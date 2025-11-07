'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { Button } from '@/components/ui/button'
import { Card } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { LogOut, BarChart3 } from 'lucide-react'
import AdminFeedbackCard from '@/components/AdminFeedbackCard'
import WeeklySummary from '@/components/WeeklySummary'
import { useAuth } from '@/hooks/useAuth'

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

interface Stats {
  total: number
  underReview: number
  planned: number
  completed: number
  rejected: number
}

export default function AdminPage() {
  const router = useRouter()
  const { user, isLoading, logout } = useAuth()
  const [posts, setPosts] = useState<FeedbackPost[]>([])
  const [loading, setLoading] = useState(true)
  const [stats, setStats] = useState<Stats>({
    total: 0,
    underReview: 0,
    planned: 0,
    completed: 0,
    rejected: 0,
  })
  const [filter, setFilter] = useState<'all' | 'under-review' | 'planned' | 'completed' | 'rejected'>('all')
  const [activeTab, setActiveTab] = useState('feedback')

  // Redirect to login if not authenticated or not admin
  useEffect(() => {
    if (!isLoading && (!user || !user.isAdmin)) {
      router.push('/login')
    }
  }, [user, isLoading, router])

  // Fetch feedback posts on component mount and when filter changes
  useEffect(() => {
    if (user?.isAdmin) {
      fetchPosts()
    }
  }, [filter, user])

  /**
   * Fetches feedback posts from the API
   */
  const fetchPosts = async () => {
    try {
      setLoading(true)
      const params = new URLSearchParams()
      if (filter !== 'all') params.append('status', filter)

      const response = await fetch(`/api/feedback?${params}`)
      const data = await response.json()
      setPosts(data)

      // Calculate stats
      const allResponse = await fetch('/api/feedback')
      const allData = await allResponse.json()
      
      setStats({
        total: allData.length,
        underReview: allData.filter((p: FeedbackPost) => p.status === 'under-review').length,
        planned: allData.filter((p: FeedbackPost) => p.status === 'planned').length,
        completed: allData.filter((p: FeedbackPost) => p.status === 'completed').length,
        rejected: allData.filter((p: FeedbackPost) => p.status === 'rejected').length,
      })
    } catch (error) {
      console.error('Error fetching posts:', error)
    } finally {
      setLoading(false)
    }
  }

  const handleLogout = () => {
    logout()
    router.push('/login')
  }

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 flex items-center justify-center">
        <p className="text-slate-600">Loading...</p>
      </div>
    )
  }

  if (!user?.isAdmin) {
    return null
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100">
      {/* Header */}
      <header className="sticky top-0 z-50 bg-white border-b border-slate-200 shadow-sm">
        <div className="max-w-6xl mx-auto px-4 py-4 flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
              Admin Dashboard
            </h1>
            <p className="text-sm text-slate-600">Manage and categorize user feedback</p>
          </div>
          <div className="flex gap-3 items-center">
            <Button
              variant="outline"
              onClick={() => router.push('/')}
            >
              Back to Board
            </Button>
            <Button
              variant="ghost"
              onClick={handleLogout}
              className="gap-2"
            >
              <LogOut className="w-4 h-4" />
              Logout
            </Button>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-6xl mx-auto px-4 py-8">
        {/* Tabs */}
        <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full mb-8">
          <TabsList className="grid w-full grid-cols-2 bg-slate-200">
            <TabsTrigger value="feedback">Feedback Management</TabsTrigger>
            <TabsTrigger value="summary" className="gap-2">
              <BarChart3 className="w-4 h-4" />
              Weekly Summary
            </TabsTrigger>
          </TabsList>

          {/* Feedback Management Tab */}
          <TabsContent value="feedback" className="space-y-8">
            {/* Statistics */}
            <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
              <Card className="p-6 border-l-4 border-l-slate-400">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-slate-600 text-sm font-medium">Total Feedback</p>
                    <p className="text-3xl font-bold text-slate-900 mt-2">{stats.total}</p>
                  </div>
                  <div className="text-3xl">📊</div>
                </div>
              </Card>

              <Card className="p-6 border-l-4 border-l-yellow-400">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-slate-600 text-sm font-medium">Under Review</p>
                    <p className="text-3xl font-bold text-yellow-600 mt-2">{stats.underReview}</p>
                  </div>
                  <div className="text-3xl">📋</div>
                </div>
              </Card>

              <Card className="p-6 border-l-4 border-l-blue-400">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-slate-600 text-sm font-medium">Planned</p>
                    <p className="text-3xl font-bold text-blue-600 mt-2">{stats.planned}</p>
                  </div>
                  <div className="text-3xl">📅</div>
                </div>
              </Card>

              <Card className="p-6 border-l-4 border-l-green-400">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-slate-600 text-sm font-medium">Completed</p>
                    <p className="text-3xl font-bold text-green-600 mt-2">{stats.completed}</p>
                  </div>
                  <div className="text-3xl">✅</div>
                </div>
              </Card>

              <Card className="p-6 border-l-4 border-l-red-400">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-slate-600 text-sm font-medium">Rejected</p>
                    <p className="text-3xl font-bold text-red-600 mt-2">{stats.rejected}</p>
                  </div>
                  <div className="text-3xl">❌</div>
                </div>
              </Card>
            </div>

            {/* Feedback Items */}
            <Card className="p-6">
              <h2 className="text-xl font-semibold text-slate-900 mb-4">Feedback Items</h2>

              <Tabs value={filter} onValueChange={(v) => setFilter(v as any)} className="w-full">
                <TabsList className="grid w-full grid-cols-5 bg-slate-200 mb-6">
                  <TabsTrigger value="all">All</TabsTrigger>
                  <TabsTrigger value="under-review">Under Review</TabsTrigger>
                  <TabsTrigger value="planned">Planned</TabsTrigger>
                  <TabsTrigger value="completed">Completed</TabsTrigger>
                  <TabsTrigger value="rejected">Rejected</TabsTrigger>
                </TabsList>
              </Tabs>

              <div className="space-y-4">
                {loading ? (
                  <div className="text-center py-12">
                    <p className="text-slate-600">Loading feedback...</p>
                  </div>
                ) : posts.length === 0 ? (
                  <div className="text-center py-12">
                    <p className="text-slate-600">No feedback found</p>
                  </div>
                ) : (
                  posts.map((post) => (
                    <AdminFeedbackCard
                      key={post.id}
                      post={post}
                      onStatusChange={fetchPosts}
                    />
                  ))
                )}
              </div>
            </Card>
          </TabsContent>

          {/* Weekly Summary Tab */}
          <TabsContent value="summary">
            <WeeklySummary />
          </TabsContent>
        </Tabs>
      </main>
    </div>
  )
}
