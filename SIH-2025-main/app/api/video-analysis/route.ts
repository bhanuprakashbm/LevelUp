import { NextRequest, NextResponse } from 'next/server'
import { writeFile, mkdir } from 'fs/promises'
import { existsSync } from 'fs'
import path from 'path'
import { generateFallbackAnalysis } from './fallback'

export async function POST(request: NextRequest) {
  try {
    const data = await request.formData()
    const file: File | null = data.get('video') as unknown as File

    if (!file) {
      return NextResponse.json({ success: false, message: 'No file uploaded' })
    }

    // Create uploads directory if it doesn't exist
    const uploadsDir = path.join(process.cwd(), 'uploads')
    if (!existsSync(uploadsDir)) {
      await mkdir(uploadsDir, { recursive: true })
    }

    // Save the uploaded file
    const bytes = await file.arrayBuffer()
    const buffer = Buffer.from(bytes)
    const filename = `${Date.now()}_${file.name}`
    const filepath = path.join(uploadsDir, filename)
    
    await writeFile(filepath, buffer)

    // Always use mock data for analysis
    console.log('Using mock data for video analysis')
    const analysisResult = generateFallbackAnalysis(filename)
    analysisResult.analysisType = 'mock'

    return NextResponse.json({
      success: true,
      message: 'Video uploaded and analyzed successfully',
      data: analysisResult
    })

  } catch (error) {
    console.error('Error processing video:', error)
    return NextResponse.json(
      { success: false, message: 'Error processing video' },
      { status: 500 }
    )
  }
}

// Video processing with AI models has been replaced with mock data
