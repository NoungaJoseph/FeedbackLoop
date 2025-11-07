'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { Button } from '@/components/ui/button'
import { Card } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { ThumbsUp, ThumbsDown, MessageCircle, Plus, LogOut } from 'lucide-react'
import FeedbackForm from '@/components/FeedbackForm'
import FeedbackCard from '@/components/FeedbackCard'
import { Dialog, DialogContent, DialogTrigger } from '@/components/ui/dialog'
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

export default function Home() {
  const router = useRouter()
  const { user, isLoading, logout } = useAuth()
  const [posts, setPosts] = useState<FeedbackPost[]>([])
  const [loading, setLoading] = useState(true)
  const [filter, setFilter] = useState<'all' | 'feature-request' | 'bug-report' | 'improvement'>('all')
  const [sort, setSort] = useState<'newest' | 'popular' | 'controversial'>('newest')
  const [isFormOpen, setIsFormOpen] = useState(false)

  // Redirect to login if not authenticated
  useEffect(() => {
    if (!isLoading && !user) {
      router.push('/login')
    }
  }, [user, isLoading, router])

  // Fetch feedback posts on component mount and when filters change
  useEffect(() => {
    if (user) {
      fetchPosts()
    }
  }, [filter, sort, user])

  /**
   * Fetches feedback posts from the API with current filters and sorting
   */
  const fetchPosts = async () => {
    try {
      setLoading(true)
      const params = new URLSearchParams()
      if (filter !== 'all') params.append('category', filter)
      params.append('sort', sort)

      const response = await fetch(`/api/feedback?${params}`)
      const data = await response.json()
      setPosts(data)
    } catch (error) {
      console.error('Error fetching posts:', error)
    } finally {
      setLoading(false)
    }
  }

  /**
   * Handles new feedback submission
   * Refreshes the posts list after successful submission
   */
  const handleFeedbackSubmitted = () => {
    setIsFormOpen(false)
    fetchPosts()
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

  if (!user) {
    return null
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100">
      {/* Header */}
      <header className="sticky top-0 z-50 bg-white border-b border-slate-200 shadow-sm">
        <div className="max-w-6xl mx-auto px-4 py-4 flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
              FeedbackLoop
            </h1>
            <p className="text-sm text-slate-600">Welcome, {user.name}!</p>
          </div>
          <div className="flex gap-3 items-center">
            {user.isAdmin && (
              <Button
                variant="outline"
                onClick={() => router.push('/admin')}
              >
                Admin Dashboard
              </Button>
            )}
            <Dialog open={isFormOpen} onOpenChange={setIsFormOpen}>
              <DialogTrigger asChild>
                <Button className="gap-2 bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700">
                  <Plus className="w-4 h-4" />
                  Submit Feedback
                </Button>
              </DialogTrigger>
              <DialogContent className="max-w-2xl">
                <FeedbackForm onSuccess={handleFeedbackSubmitted} />
              </DialogContent>
            </Dialog>
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
        {/* Filter and Sort Controls */}
        <div className="mb-8 space-y-4">
          <div className="flex flex-col sm:flex-row gap-4 items-start sm:items-center justify-between">
            <div>
              <h2 className="text-xl font-semibold text-slate-900 mb-3">Feedback Board</h2>
              <Tabs value={filter} onValueChange={(v) => setFilter(v as any)} className="w-full">
                <TabsList className="grid w-full grid-cols-4 bg-slate-200">
                  <TabsTrigger value="all">All</TabsTrigger>
                  <TabsTrigger value="feature-request">Features</TabsTrigger>
                  <TabsTrigger value="bug-report">Bugs</TabsTrigger>
                  <TabsTrigger value="improvement">Improvements</TabsTrigger>
                </TabsList>
              </Tabs>
            </div>

            {/* Sort Controls */}
            <div className="flex gap-2">
              <Button
                variant={sort === 'newest' ? 'default' : 'outline'}
                onClick={() => setSort('newest')}
                className={sort === 'newest' ? 'bg-gradient-to-r from-blue-600 to-purple-600' : ''}
              >
                Newest
              </Button>
              <Button
                variant={sort === 'popular' ? 'default' : 'outline'}
                onClick={() => setSort('popular')}
                className={sort === 'popular' ? 'bg-gradient-to-r from-blue-600 to-purple-600' : ''}
              >
                Popular
              </Button>
              <Button
                variant={sort === 'controversial' ? 'default' : 'outline'}
                onClick={() => setSort('controversial')}
                className={sort === 'controversial' ? 'bg-gradient-to-r from-blue-600 to-purple-600' : ''}
              >
                Trending
              </Button>
            </div>
          </div>
        </div>

        {/* Feedback Posts List */}
        <div className="space-y-4">
          {loading ? (
            <div className="text-center py-12">
              <p className="text-slate-600">Loading feedback...</p>
            </div>
          ) : posts.length === 0 ? (
            <Card className="p-12 text-center">
              <p className="text-slate-600 mb-4">No feedback yet. Be the first to share!</p>
              <Dialog open={isFormOpen} onOpenChange={setIsFormOpen}>
                <DialogTrigger asChild>
                  <Button className="gap-2 bg-gradient-to-r from-blue-600 to-purple-600">
                    <Plus className="w-4 h-4" />
                    Submit Feedback
                  </Button>
                </DialogTrigger>
                <DialogContent className="max-w-2xl">
                  <FeedbackForm onSuccess={handleFeedbackSubmitted} />
                </DialogContent>
              </Dialog>
            </Card>
          ) : (
            posts.map((post) => (
              <FeedbackCard
                key={post.id}
                post={post}
                onVoteChange={fetchPosts}
              />
            ))
          )}
        </div>
      </main>
    </div>
  )
}
