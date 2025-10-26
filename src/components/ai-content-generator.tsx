'use client'

import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import { Badge } from '@/components/ui/badge'
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import {
  Brain,
  Sparkles,
  Rocket,
  Target,
  Zap,
  TrendingUp,
  Eye,
  Globe,
  Users,
  BarChart3,
  Lightbulb,
  Wand2,
} from 'lucide-react'
import { BlogService } from '@/lib/blog-service'

interface AIContentGeneratorProps {
  onContentGenerated: (content: string, type: string) => void
  currentContent?: {
    title?: string
    excerpt?: string
    content?: string
  }
}

export const AIContentGenerator = ({
  onContentGenerated,
  currentContent = {},
}: AIContentGeneratorProps) => {
  const [isOpen, setIsOpen] = useState(false)
  const [generating, setGenerating] = useState(false)
  const [activeTab, setActiveTab] = useState<
    'generate' | 'enhance' | 'analyze'
  >('generate')
  const [prompt, setPrompt] = useState('')
  const [contentType, setContentType] = useState<
    'title' | 'excerpt' | 'content'
  >('title')
  const [enhancementType, setEnhancementType] = useState<
    'expand' | 'simplify' | 'professionalize' | 'viral'
  >('expand')
  const [generatedHistory, setGeneratedHistory] = useState<
    Array<{
      type: string
      content: string
      timestamp: Date
    }>
  >([])

  const generateContent = async () => {
    if (!prompt.trim() && activeTab === 'generate') return

    setGenerating(true)
    try {
      let content: string
      let resultType: string

      switch (activeTab) {
        case 'generate':
          content = await BlogService.generateContentWithAI(prompt, contentType)
          resultType = contentType
          break

        case 'enhance':
          const sourceContent = currentContent.content || prompt
          content = await BlogService.enhanceContentWithAI(
            sourceContent,
            enhancementType
          )
          resultType = `enhanced_${enhancementType}`
          break

        case 'analyze':
          const seoData = await BlogService.generateSEOData(
            currentContent.content || prompt,
            prompt.split(',').map((k) => k.trim())
          )
          content = JSON.stringify(seoData, null, 2)
          resultType = 'seo_analysis'
          break

        default:
          throw new Error('Invalid tab')
      }

      // Add to history
      setGeneratedHistory((prev) => [
        {
          type: resultType,
          content,
          timestamp: new Date(),
        },
        ...prev.slice(0, 4),
      ])

      onContentGenerated(content, resultType)

      if (activeTab === 'generate') {
        setPrompt('')
      }
    } catch (error) {
      console.error('AI generation failed:', error)
    } finally {
      setGenerating(false)
    }
  }

  const quickPrompts = {
    title: [
      'Write about AI and technology trends',
      'Create a how-to guide for beginners',
      'Discuss sustainable business practices',
      'Explore future of remote work',
    ],
    excerpt: [
      'Make it compelling and engaging',
      'Focus on benefits for readers',
      'Highlight key takeaways',
      'Create urgency and curiosity',
    ],
    content: [
      'Write a comprehensive guide about',
      'Create a step-by-step tutorial for',
      'Discuss the latest trends in',
      'Share expert insights on',
    ],
  }

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>
        <Button className='bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-white shadow-lg'>
          <Brain className='w-4 h-4 mr-2' />
          AI Co-Pilot
        </Button>
      </DialogTrigger>

      <DialogContent className='max-w-4xl max-h-[90vh] overflow-y-auto'>
        <DialogHeader>
          <DialogTitle className='flex items-center gap-2'>
            <Brain className='w-6 h-6 text-purple-500' />
            AI Content Co-Pilot
            <Badge variant='secondary' className='bg-green-100 text-green-700'>
              <Sparkles className='w-3 h-3 mr-1' />
              Powered by GPT-4
            </Badge>
          </DialogTitle>
        </DialogHeader>

        <div className='space-y-6'>
          {/* Tab Navigation */}
          <div className='flex bg-gray-100 rounded-xl p-1'>
            {[
              { id: 'generate', label: 'Generate', icon: Wand2 },
              { id: 'enhance', label: 'Enhance', icon: Rocket },
              { id: 'analyze', label: 'Analyze', icon: BarChart3 },
            ].map(({ id, label, icon: Icon }) => (
              <button
                key={id}
                onClick={() => setActiveTab(id as 'generate' | 'enhance' | 'analyze')}
                className={`flex-1 flex items-center justify-center gap-2 py-3 px-4 rounded-lg transition-all ${
                  activeTab === id
                    ? 'bg-white shadow-md text-purple-600'
                    : 'text-gray-600 hover:text-gray-900'
                }`}
              >
                <Icon className='w-4 h-4' />
                {label}
              </button>
            ))}
          </div>

          {/* Generate Tab */}
          {activeTab === 'generate' && (
            <div className='space-y-4'>
              <div className='grid grid-cols-1 md:grid-cols-2 gap-4'>
                <div>
                  <label className='block text-sm font-medium mb-2'>
                    Content Type
                  </label>
                  <Select
                    value={contentType}
                    onValueChange={(value: 'title' | 'excerpt' | 'content') => setContentType(value)}
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value='title'>
                        <div className='flex items-center gap-2'>
                          <Target className='w-4 h-4' />
                          Blog Title
                        </div>
                      </SelectItem>
                      <SelectItem value='excerpt'>
                        <div className='flex items-center gap-2'>
                          <Eye className='w-4 h-4' />
                          Excerpt
                        </div>
                      </SelectItem>
                      <SelectItem value='content'>
                        <div className='flex items-center gap-2'>
                          <Globe className='w-4 h-4' />
                          Full Content
                        </div>
                      </SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>

              <div>
                <label className='block text-sm font-medium mb-2'>
                  What would you like to create?
                </label>
                <Textarea
                  placeholder='Describe what you want to generate...'
                  value={prompt}
                  onChange={(e) => setPrompt(e.target.value)}
                  className='min-h-[100px] resize-none'
                />
              </div>

              {/* Quick Prompts */}
              <div>
                <label className='block text-sm font-medium mb-2'>
                  Quick Prompts
                </label>
                <div className='flex flex-wrap gap-2'>
                  {quickPrompts[contentType].map((quickPrompt, index) => (
                    <Badge
                      key={index}
                      variant='outline'
                      className='cursor-pointer hover:bg-blue-50'
                      onClick={() => setPrompt(quickPrompt)}
                    >
                      {quickPrompt}
                    </Badge>
                  ))}
                </div>
              </div>
            </div>
          )}

          {/* Enhance Tab */}
          {activeTab === 'enhance' && (
            <div className='space-y-4'>
              <div>
                <label className='block text-sm font-medium mb-2'>
                  Enhancement Type
                </label>
                <div className='grid grid-cols-2 gap-3'>
                  {[
                    {
                      value: 'expand',
                      label: 'Expand',
                      icon: TrendingUp,
                      desc: 'Add more details and examples',
                    },
                    {
                      value: 'simplify',
                      label: 'Simplify',
                      icon: Users,
                      desc: 'Make more accessible',
                    },
                    {
                      value: 'professionalize',
                      label: 'Professional',
                      icon: Target,
                      desc: 'More authoritative tone',
                    },
                    {
                      value: 'viral',
                      label: 'Viral',
                      icon: Zap,
                      desc: 'Social media optimized',
                    },
                  ].map(({ value, label, icon: Icon, desc }) => (
                    <Card
                      key={value}
                      className={`cursor-pointer transition-all ${
                        enhancementType === value
                          ? 'ring-2 ring-purple-500 bg-purple-50'
                          : 'hover:bg-gray-50'
                      }`}
                      onClick={() => setEnhancementType(value as 'expand' | 'simplify' | 'professionalize' | 'viral')}
                    >
                      <CardContent className='p-4 text-center'>
                        <Icon className='w-6 h-6 mx-auto mb-2 text-purple-600' />
                        <div className='font-medium'>{label}</div>
                        <div className='text-xs text-gray-600 mt-1'>{desc}</div>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              </div>

              <div>
                <label className='block text-sm font-medium mb-2'>
                  Content to Enhance
                  {currentContent.content && (
                    <span className='text-green-600 ml-2'>
                      (Using current content)
                    </span>
                  )}
                </label>
                <Textarea
                  placeholder={
                    currentContent.content
                      ? 'Using current blog content...'
                      : 'Paste content to enhance...'
                  }
                  value={currentContent.content ? '' : prompt}
                  onChange={(e) => setPrompt(e.target.value)}
                  className='min-h-[100px] resize-none'
                  disabled={!!currentContent.content}
                />
              </div>
            </div>
          )}

          {/* Analyze Tab */}
          {activeTab === 'analyze' && (
            <div className='space-y-4'>
              <Card className='bg-blue-50 border-blue-200'>
                <CardContent className='p-4'>
                  <div className='flex items-center gap-2 mb-2'>
                    <BarChart3 className='w-5 h-5 text-blue-600' />
                    <span className='font-medium'>SEO Analysis</span>
                  </div>
                  <p className='text-sm text-gray-600'>
                    Get comprehensive SEO insights and optimization
                    recommendations
                  </p>
                </CardContent>
              </Card>

              <div>
                <label className='block text-sm font-medium mb-2'>
                  Target Keywords (optional)
                </label>
                <Input
                  placeholder='Enter keywords separated by commas...'
                  value={prompt}
                  onChange={(e) => setPrompt(e.target.value)}
                />
              </div>
            </div>
          )}

          {/* Generation History */}
          {generatedHistory.length > 0 && (
            <Card>
              <CardHeader>
                <CardTitle className='flex items-center gap-2 text-sm'>
                  <Lightbulb className='w-4 h-4' />
                  Recent Generations
                </CardTitle>
              </CardHeader>
              <CardContent className='space-y-2 max-h-32 overflow-y-auto'>
                {generatedHistory.map((item, index) => (
                  <div
                    key={index}
                    className='flex items-center justify-between p-2 bg-gray-50 rounded cursor-pointer hover:bg-gray-100'
                    onClick={() => onContentGenerated(item.content, item.type)}
                  >
                    <div>
                      <Badge variant='outline' className='text-xs'>
                        {item.type}
                      </Badge>
                      <span className='ml-2 text-sm text-gray-600'>
                        {item.content.substring(0, 50)}...
                      </span>
                    </div>
                    <span className='text-xs text-gray-400'>
                      {item.timestamp.toLocaleTimeString()}
                    </span>
                  </div>
                ))}
              </CardContent>
            </Card>
          )}

          {/* Action Button */}
          <Button
            onClick={generateContent}
            disabled={generating || (!prompt.trim() && activeTab !== 'enhance')}
            className='w-full bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-white py-3'
          >
            {generating ? (
              <>
                <div className='animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2' />
                AI is working its magic...
              </>
            ) : (
              <>
                {activeTab === 'generate' && <Wand2 className='w-4 h-4 mr-2' />}
                {activeTab === 'enhance' && <Rocket className='w-4 h-4 mr-2' />}
                {activeTab === 'analyze' && (
                  <BarChart3 className='w-4 h-4 mr-2' />
                )}
                {activeTab === 'generate' && 'Generate Content'}
                {activeTab === 'enhance' && 'Enhance Content'}
                {activeTab === 'analyze' && 'Analyze Content'}
              </>
            )}
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  )
}

export default AIContentGenerator
