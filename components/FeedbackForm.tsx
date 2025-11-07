'use client'

import { useState } from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import * as z from 'zod'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form'
import { toast } from 'sonner'

/**
 * Validation schema for feedback form
 * Ensures all required fields are present and valid
 */
const feedbackSchema = z.object({
  title: z.string().min(5, 'Title must be at least 5 characters').max(100, 'Title must be less than 100 characters'),
  description: z.string().min(10, 'Description must be at least 10 characters').max(5000, 'Description must be less than 5000 characters'),
  category: z.enum(['feature-request', 'bug-report', 'improvement', 'other']),
  authorName: z.string().min(2, 'Name must be at least 2 characters'),
  authorEmail: z.string().email('Invalid email address'),
})

type FeedbackFormValues = z.infer<typeof feedbackSchema>

interface FeedbackFormProps {
  onSuccess?: () => void
}

/**
 * FeedbackForm Component
 * Allows users to submit new feedback posts
 * Handles form validation and API submission
 */
export default function FeedbackForm({ onSuccess }: FeedbackFormProps) {
  const [isSubmitting, setIsSubmitting] = useState(false)

  const form = useForm<FeedbackFormValues>({
    resolver: zodResolver(feedbackSchema),
    defaultValues: {
      title: '',
      description: '',
      category: 'feature-request',
      authorName: '',
      authorEmail: '',
    },
  })

  /**
   * Handles form submission
   * Creates a new feedback post via API
   * Shows success/error toast notifications
   */
  const onSubmit = async (values: FeedbackFormValues) => {
    try {
      setIsSubmitting(true)

      // First, create or get the user
      // In a real app, this would use authentication
      // For now, we'll create a simple user record
      const userResponse = await fetch('/api/users', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          email: values.authorEmail,
          name: values.authorName,
        }),
      }).catch(() => null)

      let userId = 'anonymous'
      if (userResponse?.ok) {
        const user = await userResponse.json()
        userId = user.id
      }

      // Create feedback post
      const response = await fetch('/api/feedback', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          title: values.title,
          description: values.description,
          category: values.category,
          authorId: userId,
        }),
      })

      if (!response.ok) {
        throw new Error('Failed to submit feedback')
      }

      toast.success('Feedback submitted successfully!')
      form.reset()
      onSuccess?.()
    } catch (error) {
      console.error('Error submitting feedback:', error)
      toast.error('Failed to submit feedback. Please try again.')
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <div className="w-full">
      <div className="mb-6">
        <h2 className="text-2xl font-bold text-slate-900">Share Your Feedback</h2>
        <p className="text-slate-600 mt-1">Help us improve by sharing your ideas, bug reports, or suggestions</p>
      </div>

      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
          {/* Author Information */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <FormField
              control={form.control}
              name="authorName"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Your Name</FormLabel>
                  <FormControl>
                    <Input placeholder="John Doe" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="authorEmail"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Email Address</FormLabel>
                  <FormControl>
                    <Input type="email" placeholder="john@example.com" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>

          {/* Category Selection */}
          <FormField
            control={form.control}
            name="category"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Feedback Type</FormLabel>
                <Select onValueChange={field.onChange} defaultValue={field.value}>
                  <FormControl>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    <SelectItem value="feature-request">Feature Request</SelectItem>
                    <SelectItem value="bug-report">Bug Report</SelectItem>
                    <SelectItem value="improvement">Improvement</SelectItem>
                    <SelectItem value="other">Other</SelectItem>
                  </SelectContent>
                </Select>
                <FormDescription>
                  Select the type of feedback you're providing
                </FormDescription>
                <FormMessage />
              </FormItem>
            )}
          />

          {/* Title */}
          <FormField
            control={form.control}
            name="title"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Title</FormLabel>
                <FormControl>
                  <Input placeholder="Brief summary of your feedback" {...field} />
                </FormControl>
                <FormDescription>
                  Keep it concise and descriptive
                </FormDescription>
                <FormMessage />
              </FormItem>
            )}
          />

          {/* Description */}
          <FormField
            control={form.control}
            name="description"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Description</FormLabel>
                <FormControl>
                  <Textarea
                    placeholder="Provide detailed information about your feedback..."
                    className="min-h-32"
                    {...field}
                  />
                </FormControl>
                <FormDescription>
                  Include as much detail as possible to help us understand your feedback
                </FormDescription>
                <FormMessage />
              </FormItem>
            )}
          />

          {/* Submit Button */}
          <div className="flex gap-3 pt-4">
            <Button
              type="submit"
              disabled={isSubmitting}
              className="flex-1 bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700"
            >
              {isSubmitting ? 'Submitting...' : 'Submit Feedback'}
            </Button>
          </div>
        </form>
      </Form>
    </div>
  )
}
