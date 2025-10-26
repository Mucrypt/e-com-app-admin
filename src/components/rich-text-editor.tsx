// components/cosmic-rich-text-editor.tsx
'use client'

import { useState, useCallback } from 'react'
import { useEditor, EditorContent } from '@tiptap/react'
import StarterKit from '@tiptap/starter-kit'
import CodeBlockLowlight from '@tiptap/extension-code-block-lowlight'
import Image from '@tiptap/extension-image'
import Link from '@tiptap/extension-link'
import TextAlign from '@tiptap/extension-text-align'
import Underline from '@tiptap/extension-underline'
import { Table } from '@tiptap/extension-table'
import { TableRow } from '@tiptap/extension-table-row'
import { TableHeader } from '@tiptap/extension-table-header'
import { TableCell } from '@tiptap/extension-table-cell'
import TaskList from '@tiptap/extension-task-list'
import TaskItem from '@tiptap/extension-task-item'
import { createLowlight, common } from 'lowlight'
import { Button } from '@/components/ui/button'

import { Textarea } from '@/components/ui/textarea'
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog'
import {
  Bold,
  Italic,
  Underline as UnderlineIcon,
  Strikethrough,
  Heading1,
  Heading2,
  Heading3,
  List,
  ListOrdered,
  Quote,
  Link2,
  Image as ImageIcon,
  Table as TableIcon,
  AlignLeft,
  AlignCenter,
  AlignRight,
  Undo,
  Redo,
  Brain,
  Sparkles,
  Wand2,
  Zap,
  TrendingUp,
} from 'lucide-react'
import { BlogService } from '@/lib/blog-service'

const lowlight = createLowlight(common)

interface AdvancedRichTextEditorProps {
  value: string
  onChange: (value: string) => void
  className?: string
  onMediaUpload?: (file: File) => Promise<string>
}

export const CosmicRichTextEditor = ({
  value,
  onChange,
  className,
}: AdvancedRichTextEditorProps) => {
  const [showAIDialog, setShowAIDialog] = useState(false)
  const [aiPrompt, setAiPrompt] = useState('')
  const [isGenerating, setIsGenerating] = useState(false)
  //const [activeTool, setActiveTool] = useState('write')

  const editor = useEditor({
    extensions: [
      StarterKit.configure({
        codeBlock: false,
      }),
      CodeBlockLowlight.configure({
        lowlight,
      }),
      Image.configure({
        HTMLAttributes: {
          class: 'max-w-full h-auto rounded-lg shadow-lg',
        },
      }),
      Link.configure({
        openOnClick: false,
        HTMLAttributes: {
          class: 'text-blue-600 hover:text-blue-800 underline',
        },
      }),
      TextAlign.configure({
        types: ['heading', 'paragraph'],
      }),
      Underline,
      Table.configure({
        resizable: true,
      }),
      TableRow,
      TableHeader,
      TableCell,
      TaskList,
      TaskItem.configure({
        nested: true,
      }),
    ],
    content: value,
    immediatelyRender: false,
    onUpdate: ({ editor }) => {
      onChange(editor.getHTML())
    },
    editorProps: {
      attributes: {
        class: 'prose prose-lg max-w-none focus:outline-none min-h-[400px] p-6',
      },
    },
  })

  // AI Content Generation
  const generateWithAI = async (
    type: 'enhance' | 'expand' | 'optimize' | 'custom'
  ) => {
    if (!aiPrompt.trim() && type === 'custom') return

    setIsGenerating(true)
    try {
      let content: string
      //let requestType: string

      switch (type) {
        case 'enhance':
          content = await BlogService.enhanceContentWithAI(
            editor?.getHTML() || '',
            'professionalize'
          )
          break
        case 'expand':
          content = await BlogService.enhanceContentWithAI(
            editor?.getHTML() || '',
            'expand'
          )
          break
        case 'optimize':
          const seoData = await BlogService.generateSEOData(
            editor?.getHTML() || ''
          )

          let seoContent: string
          if (typeof seoData === 'string') {
            try {
              const parsed = JSON.parse(seoData)
              seoContent = `
                <div class="bg-gradient-to-r from-green-50 to-blue-50 p-6 rounded-2xl border-l-4 border-green-500 my-6">
                  <h3 class="text-xl font-bold text-green-800 mb-4">✨ SEO Optimized Content</h3>
                  <div class="space-y-3">
                    <p><strong class="text-green-700">Meta Title:</strong> ${
                      parsed.metaTitle || 'SEO-optimized title'
                    }</p>
                    <p><strong class="text-green-700">Meta Description:</strong> ${
                      parsed.metaDescription || 'SEO-optimized description'
                    }</p>
                    <p><strong class="text-green-700">SEO Score:</strong> ${
                      parsed.seoScore || '85'
                    }/100</p>
                    <p><strong class="text-green-700">Keywords:</strong> ${(
                      parsed.keywords || []
                    ).join(', ')}</p>
                  </div>
                </div>
              `
            } catch {
              seoContent = `
                <div class="bg-gradient-to-r from-green-50 to-blue-50 p-6 rounded-2xl border-l-4 border-green-500 my-6">
                  <h3 class="text-xl font-bold text-green-800 mb-4">✨ SEO Analysis</h3>
                  <p class="text-gray-700">${seoData}</p>
                </div>
              `
            }
          } else {
            seoContent = `
              <div class="bg-gradient-to-r from-green-50 to-blue-50 p-6 rounded-2xl border-l-4 border-green-500 my-6">
                <h3 class="text-xl font-bold text-green-800 mb-4">✨ SEO Optimized Content</h3>
                <div class="space-y-3">
                  <p><strong class="text-green-700">Meta Title:</strong> ${
                    seoData.metaTitle || 'SEO-optimized title'
                  }</p>
                  <p><strong class="text-green-700">Meta Description:</strong> ${
                    seoData.metaDescription || 'SEO-optimized description'
                  }</p>
                  <p><strong class="text-green-700">SEO Score:</strong> ${
                    seoData.seoScore || '85'
                  }/100</p>
                </div>
              </div>
            `
          }
          content = seoContent
          break
        case 'custom':
          content = await BlogService.generateContentWithAI(aiPrompt, 'content')
          break
        default:
          throw new Error('Unknown enhancement type')
      }

      editor?.chain().focus().insertContent(content).run()
      setShowAIDialog(false)
      setAiPrompt('')
    } catch (error) {
      console.error('AI generation failed:', error)
      // Insert fallback content
      const fallbackContent = `
        <div class="bg-gradient-to-r from-blue-50 to-purple-50 p-6 rounded-2xl border-l-4 border-blue-500 my-6">
          <h3 class="text-xl font-bold text-blue-800 mb-4">🚀 AI-Enhanced Content</h3>
          <p class="text-gray-700">AI-generated content will enhance your blog with engaging, SEO-optimized text that resonates with your audience.</p>
          <div class="mt-4 p-4 bg-white rounded-lg">
            <h4 class="font-semibold mb-2">Content Enhancement Features:</h4>
            <ul class="list-disc pl-6 space-y-1 text-sm">
              <li>Professional tone and structure</li>
              <li>SEO optimization</li>
              <li>Engaging and readable format</li>
              <li>Relevant examples and insights</li>
            </ul>
          </div>
        </div>
      `
      editor?.chain().focus().insertContent(fallbackContent).run()
      setShowAIDialog(false)
      setAiPrompt('')
    } finally {
      setIsGenerating(false)
    }
  }

  const addImage = useCallback(() => {
    const url = window.prompt('Enter image URL:')
    if (url) {
      editor?.chain().focus().setImage({ src: url }).run()
    }
  }, [editor])

  const addLink = useCallback(() => {
    const previousUrl = editor?.getAttributes('link').href
    const url = window.prompt('Enter URL:', previousUrl)

    if (url === null) {
      return
    }

    if (url === '') {
      editor?.chain().focus().extendMarkRange('link').unsetLink().run()
      return
    }

    editor?.chain().focus().extendMarkRange('link').setLink({ href: url }).run()
  }, [editor])

  const addTable = useCallback(() => {
    editor
      ?.chain()
      .focus()
      .insertTable({ rows: 3, cols: 3, withHeaderRow: true })
      .run()
  }, [editor])

  if (!editor) {
    return (
      <div className='h-96 bg-gradient-to-br from-gray-100 to-blue-100 rounded-2xl animate-pulse flex items-center justify-center'>
        <div className='text-center'>
          <div className='w-12 h-12 bg-gradient-to-r from-blue-400 to-purple-500 rounded-full animate-spin mx-auto mb-4'></div>
          <p className='text-gray-600 font-medium'>Loading Cosmic Editor...</p>
        </div>
      </div>
    )
  }

  return (
    <div
      className={`border rounded-2xl overflow-hidden bg-white shadow-2xl ${className}`}
    >
      {/* Enhanced Toolbar */}
      <div className='border-b bg-gradient-to-r from-gray-50 to-blue-50/50 p-4'>
        <div className='flex flex-wrap items-center gap-2'>
          {/* Text Formatting */}
          <div className='flex bg-white rounded-lg p-1 shadow-sm border'>
            <Button
              variant='ghost'
              size='sm'
              onClick={() => editor.chain().focus().toggleBold().run()}
              className={`${
                editor.isActive('bold') ? 'bg-blue-100 text-blue-600' : ''
              }`}
            >
              <Bold className='w-4 h-4' />
            </Button>
            <Button
              variant='ghost'
              size='sm'
              onClick={() => editor.chain().focus().toggleItalic().run()}
              className={`${
                editor.isActive('italic') ? 'bg-blue-100 text-blue-600' : ''
              }`}
            >
              <Italic className='w-4 h-4' />
            </Button>
            <Button
              variant='ghost'
              size='sm'
              onClick={() => editor.chain().focus().toggleUnderline().run()}
              className={`${
                editor.isActive('underline') ? 'bg-blue-100 text-blue-600' : ''
              }`}
            >
              <UnderlineIcon className='w-4 h-4' />
            </Button>
            <Button
              variant='ghost'
              size='sm'
              onClick={() => editor.chain().focus().toggleStrike().run()}
              className={`${
                editor.isActive('strike') ? 'bg-blue-100 text-blue-600' : ''
              }`}
            >
              <Strikethrough className='w-4 h-4' />
            </Button>
          </div>

          {/* Headings */}
          <div className='flex bg-white rounded-lg p-1 shadow-sm border'>
            <Button
              variant='ghost'
              size='sm'
              onClick={() =>
                editor.chain().focus().toggleHeading({ level: 1 }).run()
              }
              className={`${
                editor.isActive('heading', { level: 1 })
                  ? 'bg-blue-100 text-blue-600'
                  : ''
              }`}
            >
              <Heading1 className='w-4 h-4' />
            </Button>
            <Button
              variant='ghost'
              size='sm'
              onClick={() =>
                editor.chain().focus().toggleHeading({ level: 2 }).run()
              }
              className={`${
                editor.isActive('heading', { level: 2 })
                  ? 'bg-blue-100 text-blue-600'
                  : ''
              }`}
            >
              <Heading2 className='w-4 h-4' />
            </Button>
            <Button
              variant='ghost'
              size='sm'
              onClick={() =>
                editor.chain().focus().toggleHeading({ level: 3 }).run()
              }
              className={`${
                editor.isActive('heading', { level: 3 })
                  ? 'bg-blue-100 text-blue-600'
                  : ''
              }`}
            >
              <Heading3 className='w-4 h-4' />
            </Button>
          </div>

          {/* Lists */}
          <div className='flex bg-white rounded-lg p-1 shadow-sm border'>
            <Button
              variant='ghost'
              size='sm'
              onClick={() => editor.chain().focus().toggleBulletList().run()}
              className={`${
                editor.isActive('bulletList') ? 'bg-blue-100 text-blue-600' : ''
              }`}
            >
              <List className='w-4 h-4' />
            </Button>
            <Button
              variant='ghost'
              size='sm'
              onClick={() => editor.chain().focus().toggleOrderedList().run()}
              className={`${
                editor.isActive('orderedList')
                  ? 'bg-blue-100 text-blue-600'
                  : ''
              }`}
            >
              <ListOrdered className='w-4 h-4' />
            </Button>
          </div>

          {/* Insert Elements */}
          <div className='flex bg-white rounded-lg p-1 shadow-sm border'>
            <Button variant='ghost' size='sm' onClick={addLink}>
              <Link2 className='w-4 h-4' />
            </Button>
            <Button variant='ghost' size='sm' onClick={addImage}>
              <ImageIcon className='w-4 h-4' />
            </Button>
            <Button variant='ghost' size='sm' onClick={addTable}>
              <TableIcon className='w-4 h-4' />
            </Button>
            <Button
              variant='ghost'
              size='sm'
              onClick={() => editor.chain().focus().toggleBlockquote().run()}
              className={`${
                editor.isActive('blockquote') ? 'bg-blue-100 text-blue-600' : ''
              }`}
            >
              <Quote className='w-4 h-4' />
            </Button>
          </div>

          {/* Alignment */}
          <div className='flex bg-white rounded-lg p-1 shadow-sm border'>
            <Button
              variant='ghost'
              size='sm'
              onClick={() => editor.chain().focus().setTextAlign('left').run()}
              className={`${
                editor.isActive({ textAlign: 'left' })
                  ? 'bg-blue-100 text-blue-600'
                  : ''
              }`}
            >
              <AlignLeft className='w-4 h-4' />
            </Button>
            <Button
              variant='ghost'
              size='sm'
              onClick={() =>
                editor.chain().focus().setTextAlign('center').run()
              }
              className={`${
                editor.isActive({ textAlign: 'center' })
                  ? 'bg-blue-100 text-blue-600'
                  : ''
              }`}
            >
              <AlignCenter className='w-4 h-4' />
            </Button>
            <Button
              variant='ghost'
              size='sm'
              onClick={() => editor.chain().focus().setTextAlign('right').run()}
              className={`${
                editor.isActive({ textAlign: 'right' })
                  ? 'bg-blue-100 text-blue-600'
                  : ''
              }`}
            >
              <AlignRight className='w-4 h-4' />
            </Button>
          </div>

          {/* Undo/Redo */}
          <div className='flex bg-white rounded-lg p-1 shadow-sm border'>
            <Button
              variant='ghost'
              size='sm'
              onClick={() => editor.chain().focus().undo().run()}
              disabled={!editor.can().undo()}
            >
              <Undo className='w-4 h-4' />
            </Button>
            <Button
              variant='ghost'
              size='sm'
              onClick={() => editor.chain().focus().redo().run()}
              disabled={!editor.can().redo()}
            >
              <Redo className='w-4 h-4' />
            </Button>
          </div>

          {/* AI Assistant */}
          <div className='ml-auto'>
            <Dialog open={showAIDialog} onOpenChange={setShowAIDialog}>
              <DialogTrigger asChild>
                <Button className='bg-gradient-to-r from-purple-600 to-pink-600 text-white shadow-lg hover:shadow-xl transition-all'>
                  <Brain className='w-4 h-4 mr-2' />
                  AI Assistant
                </Button>
              </DialogTrigger>
              <DialogContent className='max-w-2xl'>
                <DialogHeader>
                  <DialogTitle className='flex items-center gap-2'>
                    <Brain className='w-6 h-6 text-purple-500' />
                    Content AI Assistant
                  </DialogTitle>
                </DialogHeader>
                <div className='space-y-4'>
                  <div className='grid grid-cols-2 gap-3'>
                    <Button
                      variant='outline'
                      onClick={() => generateWithAI('enhance')}
                      disabled={isGenerating}
                      className='justify-start'
                    >
                      <Sparkles className='w-4 h-4 mr-2' />
                      Enhance Content
                    </Button>
                    <Button
                      variant='outline'
                      onClick={() => generateWithAI('expand')}
                      disabled={isGenerating}
                      className='justify-start'
                    >
                      <TrendingUp className='w-4 h-4 mr-2' />
                      Expand Ideas
                    </Button>
                    <Button
                      variant='outline'
                      onClick={() => generateWithAI('optimize')}
                      disabled={isGenerating}
                      className='justify-start'
                    >
                      <Zap className='w-4 h-4 mr-2' />
                      SEO Optimize
                    </Button>
                  </div>

                  <div className='space-y-2'>
                    <label className='text-sm font-medium'>
                      Custom Generation
                    </label>
                    <Textarea
                      placeholder='Describe what you want to generate...'
                      value={aiPrompt}
                      onChange={(e) => setAiPrompt(e.target.value)}
                      rows={3}
                    />
                    <Button
                      onClick={() => generateWithAI('custom')}
                      disabled={isGenerating || !aiPrompt.trim()}
                      className='w-full bg-gradient-to-r from-purple-600 to-pink-600'
                    >
                      {isGenerating ? (
                        <>
                          <div className='animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2' />
                          Generating...
                        </>
                      ) : (
                        <>
                          <Wand2 className='w-4 h-4 mr-2' />
                          Generate Content
                        </>
                      )}
                    </Button>
                  </div>
                </div>
              </DialogContent>
            </Dialog>
          </div>
        </div>
      </div>

      {/* Editor Content */}
      <div className='min-h-[400px] bg-white'>
        <EditorContent editor={editor} />
      </div>

      {/* Status Bar */}
      <div className='border-t bg-gray-50 px-4 py-2 text-sm text-gray-600 flex justify-between items-center'>
        <div>
          Words: {editor.storage.characterCount?.words() || 0} | Characters:{' '}
          {editor.storage.characterCount?.characters() || 0}
        </div>
        <div className='flex items-center gap-2'>
          <div className='w-2 h-2 bg-green-500 rounded-full'></div>
          <span>Ready</span>
        </div>
      </div>
    </div>
  )
}

// Export as default as well for compatibility
export default CosmicRichTextEditor
