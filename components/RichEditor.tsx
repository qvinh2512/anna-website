'use client'
import { useEditor, EditorContent, BubbleMenu } from '@tiptap/react'
import StarterKit from '@tiptap/starter-kit'
import Image from '@tiptap/extension-image'
import TextAlign from '@tiptap/extension-text-align'
import Underline from '@tiptap/extension-underline'
import Placeholder from '@tiptap/extension-placeholder'
import { createClient } from '../app/lib/supabase/client'
import { useState } from 'react'

type Props = {
  value: string
  onChange: (val: string) => void
  placeholder?: string
}

export default function RichEditor({ value, onChange, placeholder }: Props) {
  const supabase = createClient()
  const [uploading, setUploading] = useState(false)
  const [showImageOptions, setShowImageOptions] = useState(false)
  const [pendingImageUrl, setPendingImageUrl] = useState('')
  const [imageAlign, setImageAlign] = useState<'center'|'left'|'right'>('center')
  const [imageCaption, setImageCaption] = useState('')

  const editor = useEditor({
    extensions: [
      StarterKit,
      Underline,
      TextAlign.configure({ types: ['heading', 'paragraph'] }),
      Image.configure({ inline: true, allowBase64: false }),
      Placeholder.configure({ placeholder: placeholder || 'Viết nội dung ở đây...' }),
    ],
    content: value,
    onUpdate: ({ editor }) => onChange(editor.getHTML()),
  })

  const uploadFile = async (file: File) => {
    setUploading(true)
    const ext = file.name.split('.').pop()
    const isPdf = file.type === 'application/pdf'
    const folder = isPdf ? 'sheets' : 'posts'
    const fileName = `${folder}/${Date.now()}-${Math.random().toString(36).slice(2)}.${ext}`
    const { error } = await supabase.storage.from('anna-images').upload(fileName, file)
    if (error) { alert('Lỗi upload: ' + error.message); setUploading(false); return null }
    const { data } = supabase.storage.from('anna-images').getPublicUrl(fileName)
    setUploading(false)
    return data.publicUrl
  }

  const handleImageUpload = async (file: File) => {
    const url = await uploadFile(file)
    if (!url) return
    setPendingImageUrl(url)
    setShowImageOptions(true)
  }

  const insertImage = () => {
    if (!pendingImageUrl || !editor) return
    const floatStyle = imageAlign === 'left'
      ? 'float:left;margin:0 16px 8px 0;max-width:45%;'
      : imageAlign === 'right'
      ? 'float:righ
