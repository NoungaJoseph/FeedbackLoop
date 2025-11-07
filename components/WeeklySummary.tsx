'use client'

import { useState, useEffect } from 'react'
import { Card } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Download, BarChart3 } from 'lucide-react'
import { toast } from 'sonner'
import { generateWeeklySummaryPDF } from '@/lib/pdf-generator'

interface WeeklySummaryData {
  stats: {
    weekStart: string
    weekEnd: string
    totalFeedback: number
    totalVotes: number
    totalComments: number
    feedbackByCategory: {
      featureRequest: number
      bugReport: number
      improvement: number
      other: number
    }
    feedbackByStatus: {
      underReview: number
      planned: number
      completed: number
      rejected: number
    }
    upvotes: number
    downvotes: number
  }
  feedback: any[]
  comments: any[]
}

export default function WeeklySummary() {
  const [data, setData] = useState<WeeklySummaryData | null>(null)
  const [loading, setLoading] = useState(true)
  const [downloading, setDownloading] = useState(false)

  useEffect(() => {
    fetchWeeklySummary()
  }, [])

  const fetchWeeklySummary = async () => {
    try {
      setLoading(true)
      const response = await fetch('/api/admin/weekly-summary')
      if (!response.ok) throw new Error('Failed to fetch summary')
      const summaryData = await response.json()
      setData(summaryData)
    } catch (error) {
      console.error('Error fetching weekly summary:', error)
      toast.error('Failed to load weekly summary')
    } finally {
      setLoading(false)
    }
  }

  const handleDownloadPDF = async () => {
    try {
      setDownloading(true)
      if (!data) {
        toast.error('No data available to download')
        return
      }

      const doc = generateWeeklySummaryPDF(data)
      const startDate = new Date(data.stats.weekStart).toLocaleDateString().replace(/\//g, '-')
      doc.save(`Weekly-Summary-${startDate}.pdf`)
      toast.success('PDF downloaded successfully')
    } catch (error) {
      console.error('Error generating PDF:', error)
      toast.error('Failed to generate PDF')
    } finally {
      setDownloading(false)
    }
  }

  if (loading) {
    return (
      <Card className="p-6">
        <p className="text-slate-600">Loading weekly summary...</p>
      </Card>
    )
  }

  if (!data) {
    return (
      <Card className="p-6">
        <p className="text-slate-600">No data available</p>
      </Card>
    )
  }

  const startDate = new Date(data.stats.weekStart).toLocaleDateString()
  const endDate = new Date(data.stats.weekEnd).toLocaleDateString()

  return (
    <Card className="p-6 border-l-4 border-l-purple-500">
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-3">
          <BarChart3 className="w-6 h-6 text-purple-600" />
          <div>
            <h3 className="text-lg font-semibold text-slate-900">Weekly Summary</h3>
            <p className="text-sm text-slate-600">{startDate} to {endDate}</p>
          </div>
        </div>
        <Button
          onClick={handleDownloadPDF}
          disabled={downloading}
          className="gap-2 bg-purple-600 hover:bg-purple-700"
        >
          <Download className="w-4 h-4" />
          {downloading ? 'Generating...' : 'Download PDF'}
        </Button>
      </div>

      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
        <div className="bg-blue-50 p-4 rounded-lg">
          <p className="text-sm text-slate-600 mb-1">Total Feedback</p>
          <p className="text-2xl font-bold text-blue-600">{data.stats.totalFeedback}</p>
        </div>
        <div className="bg-green-50 p-4 rounded-lg">
          <p className="text-sm text-slate-600 mb-1">Total Votes</p>
          <p className="text-2xl font-bold text-green-600">{data.stats.totalVotes}</p>
        </div>
        <div className="bg-orange-50 p-4 rounded-lg">
          <p className="text-sm text-slate-600 mb-1">Total Comments</p>
          <p className="text-2xl font-bold text-orange-600">{data.stats.totalComments}</p>
        </div>
        <div className="bg-purple-50 p-4 rounded-lg">
          <p className="text-sm text-slate-600 mb-1">Upvotes</p>
          <p className="text-2xl font-bold text-purple-600">{data.stats.upvotes}</p>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* By Category */}
        <div>
          <h4 className="font-semibold text-slate-900 mb-3">By Category</h4>
          <div className="space-y-2">
            <div className="flex justify-between items-center">
              <span className="text-sm text-slate-600">Feature Request</span>
              <Badge variant="outline">{data.stats.feedbackByCategory.featureRequest}</Badge>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-sm text-slate-600">Bug Report</span>
              <Badge variant="outline">{data.stats.feedbackByCategory.bugReport}</Badge>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-sm text-slate-600">Improvement</span>
              <Badge variant="outline">{data.stats.feedbackByCategory.improvement}</Badge>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-sm text-slate-600">Other</span>
              <Badge variant="outline">{data.stats.feedbackByCategory.other}</Badge>
            </div>
          </div>
        </div>

        {/* By Status */}
        <div>
          <h4 className="font-semibold text-slate-900 mb-3">By Status</h4>
          <div className="space-y-2">
            <div className="flex justify-between items-center">
              <span className="text-sm text-slate-600">Under Review</span>
              <Badge className="bg-yellow-100 text-yellow-800">{data.stats.feedbackByStatus.underReview}</Badge>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-sm text-slate-600">Planned</span>
              <Badge className="bg-blue-100 text-blue-800">{data.stats.feedbackByStatus.planned}</Badge>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-sm text-slate-600">Completed</span>
              <Badge className="bg-green-100 text-green-800">{data.stats.feedbackByStatus.completed}</Badge>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-sm text-slate-600">Rejected</span>
              <Badge className="bg-red-100 text-red-800">{data.stats.feedbackByStatus.rejected}</Badge>
            </div>
          </div>
        </div>
      </div>
    </Card>
  )
}
