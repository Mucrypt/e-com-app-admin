import { NextRequest, NextResponse } from 'next/server'
import { aiService } from '@/lib/ai-service'

export async function POST(request: NextRequest) {
  try {
    const { prompt, type, enhancementType } = await request.json()

    if (!prompt || !type) {
      return NextResponse.json(
        { error: 'Prompt and type are required' },
        { status: 400 }
      )
    }

    let content: string

    if (type === 'enhance' && enhancementType) {
      content = await aiService.enhanceContent(prompt, enhancementType)
    } else {
      content = await aiService.generateContent(prompt, type)
    }

    return NextResponse.json({
      content,
      success: true,
      timestamp: new Date().toISOString(),
    })
  } catch (error) {
    console.error('AI Generation Error:', error)

    // Return fallback content based on the requested type
    const { type } = await request.json().catch(() => ({ type: 'content' }))

    const fallbackContent = {
      title: 'AI-Generated Title: Innovative Solutions for Modern Challenges',
      excerpt:
        "Discover cutting-edge approaches and strategies that can transform your business and drive meaningful results in today's competitive landscape.",
      content: `
        <div class="bg-gradient-to-r from-blue-50 to-purple-50 p-6 rounded-2xl border-l-4 border-blue-500 mb-6">
          <h2 class="text-2xl font-bold text-gray-900 mb-4">🚀 AI-Powered Content</h2>
          <p class="text-gray-700 leading-relaxed mb-4">This content has been generated using advanced AI technology to provide you with engaging and relevant information.</p>
          
          <h3 class="text-xl font-semibold mb-3 text-gray-800">Key Benefits</h3>
          <ul class="space-y-2 mb-6 list-disc pl-6">
            <li class="text-gray-700">Enhanced engagement and readability</li>
            <li class="text-gray-700">SEO-optimized for better visibility</li>
            <li class="text-gray-700">Tailored to your target audience</li>
            <li class="text-gray-700">Professional and authoritative tone</li>
          </ul>
          
          <blockquote class="bg-white p-4 border-l-4 border-purple-500 italic text-gray-600">
            "AI is revolutionizing how we create and consume content, making it more personalized and impactful than ever before."
          </blockquote>
        </div>
      `,
      seo: JSON.stringify({
        metaTitle: 'AI-Optimized Content Strategy Guide',
        metaDescription:
          'Comprehensive guide to creating AI-optimized content that improves search engine visibility and drives organic traffic.',
        keywords: ['ai-content', 'seo-optimization', 'content-strategy'],
        seoScore: 85,
      }),
    }

    const responseContent =
      fallbackContent[type as keyof typeof fallbackContent] ||
      fallbackContent.content

    return NextResponse.json({
      content: responseContent,
      success: true,
      fallback: true,
      message: 'Using fallback content due to AI service unavailability',
    })
  }
}
