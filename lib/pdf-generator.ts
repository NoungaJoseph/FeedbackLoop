import jsPDF from 'jspdf'

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

export function generateWeeklySummaryPDF(data: WeeklySummaryData) {
  const doc = new jsPDF()
  const pageWidth = doc.internal.pageSize.getWidth()
  const pageHeight = doc.internal.pageSize.getHeight()
  let yPosition = 20

  // Title
  doc.setFontSize(20)
  doc.text('Weekly Feedback Summary Report', pageWidth / 2, yPosition, { align: 'center' })
  yPosition += 15

  // Date range
  doc.setFontSize(11)
  const startDate = new Date(data.stats.weekStart).toLocaleDateString()
  const endDate = new Date(data.stats.weekEnd).toLocaleDateString()
  doc.text(`Week of ${startDate} to ${endDate}`, pageWidth / 2, yPosition, { align: 'center' })
  yPosition += 15

  // Summary Statistics Section
  doc.setFontSize(14)
  doc.text('Summary Statistics', 20, yPosition)
  yPosition += 10

  // Stats table
  const statsData = [
    ['Metric', 'Count'],
    ['Total Feedback', data.stats.totalFeedback.toString()],
    ['Total Votes', data.stats.totalVotes.toString()],
    ['Total Comments', data.stats.totalComments.toString()],
    ['Upvotes', data.stats.upvotes.toString()],
    ['Downvotes', data.stats.downvotes.toString()],
  ]

  // Draw stats table manually
  doc.setFontSize(10)
  doc.setFillColor(59, 130, 246)
  doc.setTextColor(255, 255, 255)
  doc.rect(20, yPosition, 80, 7, 'F')
  doc.text('Metric', 25, yPosition + 5)
  doc.text('Count', 85, yPosition + 5)
  
  yPosition += 8
  doc.setTextColor(0, 0, 0)
  doc.setFillColor(240, 244, 248)
  
  statsData.slice(1).forEach((row, index) => {
    if (index % 2 === 0) {
      doc.rect(20, yPosition, 80, 7, 'F')
    }
    doc.text(row[0], 25, yPosition + 5)
    doc.text(row[1], 85, yPosition + 5)
    yPosition += 7
  })

  yPosition += 10

  // Feedback by Category
  doc.setFontSize(14)
  doc.text('Feedback by Category', 20, yPosition)
  yPosition += 10

  const categoryData = [
    ['Category', 'Count'],
    ['Feature Request', data.stats.feedbackByCategory.featureRequest.toString()],
    ['Bug Report', data.stats.feedbackByCategory.bugReport.toString()],
    ['Improvement', data.stats.feedbackByCategory.improvement.toString()],
    ['Other', data.stats.feedbackByCategory.other.toString()],
  ]

  doc.setFontSize(10)
  doc.setFillColor(59, 130, 246)
  doc.setTextColor(255, 255, 255)
  doc.rect(20, yPosition, 80, 7, 'F')
  doc.text('Category', 25, yPosition + 5)
  doc.text('Count', 85, yPosition + 5)
  
  yPosition += 8
  doc.setTextColor(0, 0, 0)
  doc.setFillColor(240, 244, 248)
  
  categoryData.slice(1).forEach((row, index) => {
    if (index % 2 === 0) {
      doc.rect(20, yPosition, 80, 7, 'F')
    }
    doc.text(row[0], 25, yPosition + 5)
    doc.text(row[1], 85, yPosition + 5)
    yPosition += 7
  })

  yPosition += 10

  // Feedback by Status
  doc.setFontSize(14)
  doc.text('Feedback by Status', 20, yPosition)
  yPosition += 10

  const statusData = [
    ['Status', 'Count'],
    ['Under Review', data.stats.feedbackByStatus.underReview.toString()],
    ['Planned', data.stats.feedbackByStatus.planned.toString()],
    ['Completed', data.stats.feedbackByStatus.completed.toString()],
    ['Rejected', data.stats.feedbackByStatus.rejected.toString()],
  ]

  doc.setFontSize(10)
  doc.setFillColor(59, 130, 246)
  doc.setTextColor(255, 255, 255)
  doc.rect(20, yPosition, 80, 7, 'F')
  doc.text('Status', 25, yPosition + 5)
  doc.text('Count', 85, yPosition + 5)
  
  yPosition += 8
  doc.setTextColor(0, 0, 0)
  doc.setFillColor(240, 244, 248)
  
  statusData.slice(1).forEach((row, index) => {
    if (index % 2 === 0) {
      doc.rect(20, yPosition, 80, 7, 'F')
    }
    doc.text(row[0], 25, yPosition + 5)
    doc.text(row[1], 85, yPosition + 5)
    yPosition += 7
  })

  // Footer
  doc.setFontSize(10)
  doc.text(
    `Page 1 of 1`,
    pageWidth / 2,
    pageHeight - 10,
    { align: 'center' }
  )

  return doc
}
