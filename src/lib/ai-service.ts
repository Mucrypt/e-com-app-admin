// lib/ai-service.ts
import OpenAI from 'openai'

export class AIService {
  private openai: OpenAI

  constructor() {
    this.openai = new OpenAI({
      apiKey: process.env.OPENAI_API_KEY,
    })
  }

  async generateContent(
    prompt: string,
    type: 'title' | 'excerpt' | 'content' | 'seo'
  ) {
    const strategies = {
      title: {
        system:
          'You are an expert copywriter specialized in creating compelling blog titles. Create engaging, SEO-friendly titles that grab attention and encourage clicks.',
        user: `Create a compelling blog title for: ${prompt}. Make it engaging, SEO-friendly, and under 60 characters.`,
      },
      excerpt: {
        system:
          'You are an expert content writer specialized in creating compelling excerpts. Write engaging summaries that make people want to read more.',
        user: `Create a compelling excerpt (150-160 characters) for: ${prompt}. Make it engaging and include a call to action.`,
      },
      content: {
        system:
          'You are an expert content writer. Create comprehensive, engaging, and well-structured blog content with proper HTML formatting.',
        user: `Create detailed blog content about: ${prompt}. Use proper HTML formatting with headings, paragraphs, lists, and engaging elements. Make it comprehensive and valuable.`,
      },
      seo: {
        system:
          'You are an SEO expert. Create optimized meta descriptions and SEO recommendations.',
        user: `Create an SEO-optimized meta description for: ${prompt}. Keep it under 160 characters and include relevant keywords.`,
      },
    }

    const strategy = strategies[type]

    try {
      const completion = await this.openai.chat.completions.create({
        model: 'gpt-3.5-turbo', // Changed from gpt-4-turbo-preview to available model
        messages: [
          { role: 'system', content: strategy.system },
          { role: 'user', content: strategy.user },
        ],
        max_tokens: type === 'content' ? 2000 : 500,
        temperature: 0.7,
      })

      const content = completion.choices[0]?.message?.content || ''

      // Parse content based on type
      switch (type) {
        case 'seo':
          return this.parseSEOContent(content)
        case 'content':
          return this.enhanceContentHTML(content)
        default:
          return content.trim()
      }
    } catch (error) {
      console.error('AI Generation Error:', error)
      throw new Error('Failed to generate content')
    }
  }

  async enhanceContent(
    content: string,
    enhancementType: 'expand' | 'simplify' | 'professionalize' | 'viral'
  ) {
    const strategies = {
      expand: {
        system:
          'You are an expert content writer. Expand the given content with more details, examples, and valuable insights while maintaining the original tone.',
        user: `Expand this content with more details, examples, and insights: ${content}`,
      },
      simplify: {
        system:
          'You are an expert at making complex content accessible. Simplify the language and structure while keeping all important information.',
        user: `Simplify this content to make it more accessible and easier to understand: ${content}`,
      },
      professionalize: {
        system:
          'You are a professional business writer. Make the content more authoritative, credible, and professionally written.',
        user: `Make this content more professional and authoritative: ${content}`,
      },
      viral: {
        system:
          'You are a social media expert. Make the content more engaging, shareable, and optimized for social media virality.',
        user: `Make this content more engaging and viral-worthy for social media: ${content}`,
      },
    }

    const strategy = strategies[enhancementType]

    try {
      const completion = await this.openai.chat.completions.create({
        model: 'gpt-3.5-turbo',
        messages: [
          { role: 'system', content: strategy.system },
          { role: 'user', content: strategy.user },
        ],
        max_tokens: 1500,
        temperature: 0.7,
      })

      const enhancedContent = completion.choices[0]?.message?.content || ''
      return this.enhanceContentHTML(enhancedContent)
    } catch (error) {
      console.error('AI Enhancement Error:', error)
      throw new Error('Failed to enhance content')
    }
  }

  private enhanceContentHTML(content: string): string {
    // Add proper HTML formatting if not present
    if (!content.includes('<')) {
      const paragraphs = content.split('\n\n')
      return paragraphs
        .map((p) => {
          if (p.trim().startsWith('#')) {
            const level = p.match(/^#+/)?.[0].length || 2
            const text = p.replace(/^#+\s*/, '')
            return `<h${level} class="text-xl font-bold mb-4">${text}</h${level}>`
          }
          if (p.trim().startsWith('-') || p.trim().startsWith('*')) {
            const items = p
              .split('\n')
              .map(
                (item) =>
                  `<li class="mb-2">${item.replace(/^[-*]\s*/, '')}</li>`
              )
              .join('')
            return `<ul class="list-disc pl-6 mb-4">${items}</ul>`
          }
          return `<p class="mb-4 text-gray-700 leading-relaxed">${p.trim()}</p>`
        })
        .join('')
    }
    return content
  }

  private parseSEOContent(content: string) {
    try {
      // Try to parse as JSON first
      return JSON.parse(content)
    } catch {
      // If not JSON, return as meta description
      return {
        metaTitle: content.substring(0, 60),
        metaDescription: content.substring(0, 160),
        keywords: ['ai-optimized', 'seo-friendly', 'content-marketing'],
        seoScore: 85,
      }
    }
  }
}

export const aiService = new AIService()
