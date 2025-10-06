// components/advanced-rich-text-editor.tsx
'use client'

import { useState, useRef, useCallback } from 'react'
import { useEditor, EditorContent } from '@tiptap/react'
import StarterKit from '@tiptap/starter-kit'
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
import CodeBlockLowlight from '@tiptap/extension-code-block-lowlight'
import { createLowlight, common } from 'lowlight'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
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
  Code,
  Heading1,
  Heading2,
  Heading3,
  List,
  ListOrdered,
  Quote,
  Undo,
  Redo,
  Link as LinkIcon,
  Image as ImageIcon,
  Table as TableIcon,
  AlignLeft,
  AlignCenter,
  AlignRight,
  Sparkles,
} from 'lucide-react'

const lowlight = createLowlight(common)

interface AdvancedRichTextEditorProps {
  value: string
  onChange: (content: string) => void
  placeholder?: string
  className?: string
  onMediaUpload?: (file: File) => Promise<string>
}

export const AdvancedRichTextEditor = ({
  value,
  onChange,
  className,
  onMediaUpload,
}: AdvancedRichTextEditorProps) => {
  const [showMediaDialog, setShowMediaDialog] = useState(false)
  const [showAIDialog, setShowAIDialog] = useState(false)
  const [aiPrompt, setAiPrompt] = useState('')
  const [isGenerating, setIsGenerating] = useState(false)
  const [linkUrl, setLinkUrl] = useState('')
  const [showLinkDialog, setShowLinkDialog] = useState(false)
  const fileInputRef = useRef<HTMLInputElement>(null)

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
          class: 'rounded-lg max-w-full h-auto shadow-lg',
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
      TaskItem,
    ],
    content: value,
    immediatelyRender: false, // Add this line to fix SSR hydration issues
    onUpdate: ({ editor }) => {
      onChange(editor.getHTML())
    },
    editorProps: {
      attributes: {
        class:
          'prose prose-lg max-w-none focus:outline-none min-h-[500px] p-6 prose-headings:font-bold prose-h1:text-4xl prose-h2:text-3xl prose-h3:text-2xl prose-blockquote:border-l-4 prose-blockquote:border-blue-500 prose-blockquote:bg-blue-50 prose-blockquote:italic prose-pre:bg-gray-900 prose-pre:text-white',
      },
    },
  })

  const handleImageUpload = useCallback(
    async (file: File) => {
      if (!onMediaUpload) return

      try {
        const url = await onMediaUpload(file)
        editor?.chain().focus().setImage({ src: url }).run()
      } catch (error) {
        console.error('Failed to upload image:', error)
      }
    },
    [editor, onMediaUpload]
  )

  const handleVideoEmbed = (url: string) => {
    if (url.includes('youtube.com') || url.includes('youtu.be')) {
      const videoId = url.match(
        /(?:youtube\.com\/(?:[^\/]+\/.+\/|(?:v|e(?:mbed)?)\/|.*[?&]v=)|youtu\.be\/)([^"&?\/\s]{11})/
      )?.[1]
      if (videoId) {
        const iframe = `<iframe width="560" height="315" src="https://www.youtube.com/embed/${videoId}" frameborder="0" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture" allowfullscreen></iframe>`
        editor?.chain().focus().insertContent(iframe).run()
      }
    }
  }

  const generateWithAI = async () => {
    if (!aiPrompt.trim()) return

    setIsGenerating(true)
    try {
      // Simulate AI content generation
      const response = await fetch('/api/ai/generate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ prompt: aiPrompt }),
      })

      if (response.ok) {
        const data = await response.json()
        editor?.chain().focus().insertContent(data.content).run()
      } else {
        // Fallback content for demo
        const fallbackContent = `<p>AI-generated content based on: "${aiPrompt}"</p><p>This is a placeholder response. In a real implementation, this would be replaced with actual AI-generated content.</p>`
        editor?.chain().focus().insertContent(fallbackContent).run()
      }

      setShowAIDialog(false)
      setAiPrompt('')
    } catch (error) {
      console.error('AI generation failed:', error)
      // Fallback content
      const fallbackContent = `<p>AI-generated content based on: "${aiPrompt}"</p><p>This is a placeholder response.</p>`
      editor?.chain().focus().insertContent(fallbackContent).run()
      setShowAIDialog(false)
      setAiPrompt('')
    } finally {
      setIsGenerating(false)
    }
  }

  const addTable = () => {
    editor
      ?.chain()
      .focus()
      .insertTable({ rows: 3, cols: 3, withHeaderRow: true })
      .run()
  }

  const setLink = () => {
    if (linkUrl) {
      editor?.chain().focus().setLink({ href: linkUrl }).run()
      setLinkUrl('')
      setShowLinkDialog(false)
    }
  }

  if (!editor) {
    return <div className='h-96 bg-gray-100 rounded-lg animate-pulse'></div>
  }

  return (
    <div
      className={`border border-gray-200 rounded-xl overflow-hidden bg-white shadow-lg ${className}`}
    >
      {/* Enhanced Toolbar */}
      <div className='border-b border-gray-100 bg-gradient-to-r from-gray-50 to-blue-50/30 p-4'>
        <div className='flex flex-wrap items-center gap-2'>
          {/* Text Formatting */}
          <div className='flex items-center gap-1 border-r border-gray-200 pr-2'>
            <Button
              type='button'
              variant='ghost'
              size='sm'
              onClick={() => editor.chain().focus().toggleBold().run()}
              className={editor.isActive('bold') ? 'bg-gray-200' : ''}
            >
              <Bold className='w-4 h-4' />
            </Button>
            <Button
              type='button'
              variant='ghost'
              size='sm'
              onClick={() => editor.chain().focus().toggleItalic().run()}
              className={editor.isActive('italic') ? 'bg-gray-200' : ''}
            >
              <Italic className='w-4 h-4' />
            </Button>
            <Button
              type='button'
              variant='ghost'
              size='sm'
              onClick={() => editor.chain().focus().toggleUnderline().run()}
              className={editor.isActive('underline') ? 'bg-gray-200' : ''}
            >
              <UnderlineIcon className='w-4 h-4' />
            </Button>
            <Button
              type='button'
              variant='ghost'
              size='sm'
              onClick={() => editor.chain().focus().toggleStrike().run()}
              className={editor.isActive('strike') ? 'bg-gray-200' : ''}
            >
              <Strikethrough className='w-4 h-4' />
            </Button>
            <Button
              type='button'
              variant='ghost'
              size='sm'
              onClick={() => editor.chain().focus().toggleCode().run()}
              className={editor.isActive('code') ? 'bg-gray-200' : ''}
            >
              <Code className='w-4 h-4' />
            </Button>
          </div>

          {/* Headings */}
          <div className='flex items-center gap-1 border-r border-gray-200 pr-2'>
            <Button
              type='button'
              variant='ghost'
              size='sm'
              onClick={() =>
                editor.chain().focus().toggleHeading({ level: 1 }).run()
              }
              className={
                editor.isActive('heading', { level: 1 }) ? 'bg-gray-200' : ''
              }
            >
              <Heading1 className='w-4 h-4' />
            </Button>
            <Button
              type='button'
              variant='ghost'
              size='sm'
              onClick={() =>
                editor.chain().focus().toggleHeading({ level: 2 }).run()
              }
              className={
                editor.isActive('heading', { level: 2 }) ? 'bg-gray-200' : ''
              }
            >
              <Heading2 className='w-4 h-4' />
            </Button>
            <Button
              type='button'
              variant='ghost'
              size='sm'
              onClick={() =>
                editor.chain().focus().toggleHeading({ level: 3 }).run()
              }
              className={
                editor.isActive('heading', { level: 3 }) ? 'bg-gray-200' : ''
              }
            >
              <Heading3 className='w-4 h-4' />
            </Button>
          </div>

          {/* Lists */}
          <div className='flex items-center gap-1 border-r border-gray-200 pr-2'>
            <Button
              type='button'
              variant='ghost'
              size='sm'
              onClick={() => editor.chain().focus().toggleBulletList().run()}
              className={editor.isActive('bulletList') ? 'bg-gray-200' : ''}
            >
              <List className='w-4 h-4' />
            </Button>
            <Button
              type='button'
              variant='ghost'
              size='sm'
              onClick={() => editor.chain().focus().toggleOrderedList().run()}
              className={editor.isActive('orderedList') ? 'bg-gray-200' : ''}
            >
              <ListOrdered className='w-4 h-4' />
            </Button>
            <Button
              type='button'
              variant='ghost'
              size='sm'
              onClick={() => editor.chain().focus().toggleBlockquote().run()}
              className={editor.isActive('blockquote') ? 'bg-gray-200' : ''}
            >
              <Quote className='w-4 h-4' />
            </Button>
          </div>

          {/* Alignment */}
          <div className='flex items-center gap-1 border-r border-gray-200 pr-2'>
            <Button
              type='button'
              variant='ghost'
              size='sm'
              onClick={() => editor.chain().focus().setTextAlign('left').run()}
              className={
                editor.isActive({ textAlign: 'left' }) ? 'bg-gray-200' : ''
              }
            >
              <AlignLeft className='w-4 h-4' />
            </Button>
            <Button
              type='button'
              variant='ghost'
              size='sm'
              onClick={() =>
                editor.chain().focus().setTextAlign('center').run()
              }
              className={
                editor.isActive({ textAlign: 'center' }) ? 'bg-gray-200' : ''
              }
            >
              <AlignCenter className='w-4 h-4' />
            </Button>
            <Button
              type='button'
              variant='ghost'
              size='sm'
              onClick={() => editor.chain().focus().setTextAlign('right').run()}
              className={
                editor.isActive({ textAlign: 'right' }) ? 'bg-gray-200' : ''
              }
            >
              <AlignRight className='w-4 h-4' />
            </Button>
          </div>

          {/* Media & Links */}
          <div className='flex items-center gap-1 border-r border-gray-200 pr-2'>
            <Dialog open={showLinkDialog} onOpenChange={setShowLinkDialog}>
              <DialogTrigger asChild>
                <Button type='button' variant='ghost' size='sm'>
                  <LinkIcon className='w-4 h-4' />
                </Button>
              </DialogTrigger>
              <DialogContent>
                <DialogHeader>
                  <DialogTitle>Add Link</DialogTitle>
                </DialogHeader>
                <div className='space-y-4'>
                  <Input
                    placeholder='Enter URL...'
                    value={linkUrl}
                    onChange={(e) => setLinkUrl(e.target.value)}
                  />
                  <Button onClick={setLink} className='w-full'>
                    Add Link
                  </Button>
                </div>
              </DialogContent>
            </Dialog>

            <Button
              type='button'
              variant='ghost'
              size='sm'
              onClick={() => setShowMediaDialog(true)}
            >
              <ImageIcon className='w-4 h-4' />
            </Button>

            <Button type='button' variant='ghost' size='sm' onClick={addTable}>
              <TableIcon className='w-4 h-4' />
            </Button>
          </div>

          {/* History */}
          <div className='flex items-center gap-1 border-r border-gray-200 pr-2'>
            <Button
              type='button'
              variant='ghost'
              size='sm'
              onClick={() => editor.chain().focus().undo().run()}
              disabled={!editor.can().undo()}
            >
              <Undo className='w-4 h-4' />
            </Button>
            <Button
              type='button'
              variant='ghost'
              size='sm'
              onClick={() => editor.chain().focus().redo().run()}
              disabled={!editor.can().redo()}
            >
              <Redo className='w-4 h-4' />
            </Button>
          </div>

          {/* AI Assistant */}
          <Dialog open={showAIDialog} onOpenChange={setShowAIDialog}>
            <DialogTrigger asChild>
              <Button
                type='button'
                variant='outline'
                size='sm'
                className='bg-gradient-to-r from-blue-50 to-purple-50 border-blue-200 text-blue-700'
              >
                <Sparkles className='w-4 h-4 mr-1' />
                AI Assistant
              </Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>AI Writing Assistant</DialogTitle>
              </DialogHeader>
              <div className='space-y-4'>
                <Textarea
                  placeholder='Describe what you want to write...'
                  value={aiPrompt}
                  onChange={(e) => setAiPrompt(e.target.value)}
                  rows={4}
                />
                <Button
                  onClick={generateWithAI}
                  disabled={isGenerating || !aiPrompt.trim()}
                  className='w-full bg-gradient-to-r from-blue-600 to-purple-600'
                >
                  {isGenerating ? 'Generating...' : 'Generate Content'}
                </Button>
              </div>
            </DialogContent>
          </Dialog>
        </div>
      </div>

      {/* Editor Content */}
      <EditorContent
        editor={editor}
        className='min-h-[500px] bg-gradient-to-b from-white to-gray-50/30'
      />

      {/* Enhanced Media Dialog */}
      <Dialog open={showMediaDialog} onOpenChange={setShowMediaDialog}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Add Media</DialogTitle>
          </DialogHeader>
          <div className='space-y-4'>
            <div>
              <h4 className='font-medium mb-2'>Upload Image</h4>
              <input
                ref={fileInputRef}
                type='file'
                accept='image/*'
                placeholder='Choose an image file'
                title='Upload Image'
                onChange={(e) => {
                  const file = e.target.files?.[0]
                  if (file) {
                    handleImageUpload(file)
                    setShowMediaDialog(false)
                  }
                }}
                className='w-full'
              />
            </div>
            <div>
              <h4 className='font-medium mb-2'>Embed Video (YouTube)</h4>
              <Input
                placeholder='YouTube URL...'
                onKeyPress={(e) => {
                  if (e.key === 'Enter') {
                    handleVideoEmbed((e.target as HTMLInputElement).value)
                    setShowMediaDialog(false)
                  }
                }}
              />
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  )
}

export default AdvancedRichTextEditor
