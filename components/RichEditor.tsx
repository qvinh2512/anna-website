'use client'
import { useEditor, EditorContent } from '@tiptap/react'
import StarterKit from '@tiptap/starter-kit'
import Image from '@tiptap/extension-image'
import TextAlign from '@tiptap/extension-text-align'
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
      TextAlign.configure({ types: ['heading', 'paragraph'] }),
      Image.configure({ inline: true, allowBase64: false }),
      Placeholder.configure({ placeholder: placeholder || 'Viet noi dung o day...' }),
    ],
    content: value,
    onUpdate: ({ editor }) => onChange(editor.getHTML()),
  })

  const uploadFile = async (file: File) => {
    setUploading(true)
    const ext = file.name.split('.').pop()
    const folder = file.type === 'application/pdf' ? 'sheets' : 'posts'
    const fileName = `${folder}/${Date.now()}-${Math.random().toString(36).slice(2)}.${ext}`
    const { error } = await supabase.storage.from('anna-images').upload(fileName, file)
    if (error) { alert('Loi upload: ' + error.message); setUploading(false); return null }
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

  const buildImageHtml = (src: string, align: 'center'|'left'|'right', caption: string) => {
    let imgStyle = 'display:block;margin:12px auto;max-width:80%;border-radius:8px;'
    let wrapStyle = 'text-align:center;clear:both;'
    if (align === 'left') {
      imgStyle = 'float:left;margin:0 16px 8px 0;max-width:45%;border-radius:8px;'
      wrapStyle = 'overflow:hidden;'
    } else if (align === 'right') {
      imgStyle = 'float:right;margin:0 0 8px 16px;max-width:45%;border-radius:8px;'
      wrapStyle = 'overflow:hidden;'
    }
    const captionHtml = caption
      ? `<p style="text-align:center;font-style:italic;color:#888;font-size:0.85em;margin-top:4px;">${caption}</p>`
      : ''
    return `<div style="${wrapStyle}"><img src="${src}" style="${imgStyle}" />${captionHtml}</div><p></p>`
  }

  const insertImage = () => {
    if (!pendingImageUrl || !editor) return
    editor.chain().focus().insertContent(buildImageHtml(pendingImageUrl, imageAlign, imageCaption)).run()
    onChange(editor.getHTML())
    setShowImageOptions(false)
    setPendingImageUrl('')
    setImageCaption('')
    setImageAlign('center')
  }

  const handlePdfUpload = async (file: File) => {
    const url = await uploadFile(file)
    if (!url || !editor) return
    const html = `<div style="border:1px solid #e5e7eb;border-radius:12px;padding:16px;margin:12px 0;background:#f9fafb;"><p style="font-weight:600;margin:0 0 4px;">📄 ${file.name}</p><a href="${url}" target="_blank" style="color:#f43f5e;font-size:0.85em;">Xem / Tai PDF →</a></div><p></p>`
    editor.chain().focus().insertContent(html).run()
    onChange(editor.getHTML())
  }

  if (!editor) return null

  const btn = (active: boolean) =>
    `px-2 py-1 rounded text-sm border transition-colors ${active ? 'bg-rose-500 text-white border-rose-500' : 'bg-white text-gray-600 border-gray-200 hover:bg-gray-50'}`

  return (
    <div className="border rounded-xl overflow-hidden">
      <div className="flex flex-wrap gap-1 p-2 bg-gray-50 border-b">
        <button type="button" onClick={() => editor.chain().focus().toggleBold().run()} className={btn(editor.isActive('bold'))} title="Bold"><b>B</b></button>
<button type="button" onClick={() => editor.chain().focus().toggleItalic().run()} className={btn(editor.isActive('italic'))} title="Italic"><i>I</i></button>
<button type="button" onClick={() => editor.chain().focus().toggleStrike().run()} className={btn(editor.isActive('strike'))} title="Strikethrough"><s>S</s></button>
<div className="w-px bg-gray-200 mx-1" />
<button type="button" onClick={() => editor.chain().focus().toggleHeading({ level: 2 }).run()} className={btn(editor.isActive('heading', { level: 2 }))} title="Heading 2">H2</button>
<button type="button" onClick={() => editor.chain().focus().toggleHeading({ level: 3 }).run()} className={btn(editor.isActive('heading', { level: 3 }))} title="Heading 3">H3</button>
<div className="w-px bg-gray-200 mx-1" />
<button type="button" onClick={() => editor.chain().focus().setTextAlign('left').run()} className={btn(editor.isActive({ textAlign: 'left' }))} title="Align left">≡←</button>
<button type="button" onClick={() => editor.chain().focus().setTextAlign('center').run()} className={btn(editor.isActive({ textAlign: 'center' }))} title="Align center">≡↔</button>
<button type="button" onClick={() => editor.chain().focus().setTextAlign('right').run()} className={btn(editor.isActive({ textAlign: 'right' }))} title="Align right">≡→</button>
<div className="w-px bg-gray-200 mx-1" />
<button type="button" onClick={() => editor.chain().focus().toggleBulletList().run()} className={btn(editor.isActive('bulletList'))} title="Bullet list">• List</button>
<button type="button" onClick={() => editor.chain().focus().toggleOrderedList().run()} className={btn(editor.isActive('orderedList'))} title="Numbered list">1. List</button>
<div className="w-px bg-gray-200 mx-1" />
        <label className={`px-2 py-1 rounded text-sm border cursor-pointer ${uploading ? 'bg-gray-100 text-gray-400' : 'bg-white text-gray-600 border-gray-200 hover:bg-gray-50'}`}>
          Chen anh
          <input type="file" accept="image/*" className="hidden" disabled={uploading}
            onChange={e => { const f = e.target.files?.[0]; if (f) handleImageUpload(f); e.target.value = '' }} />
        </label>
        <label className={`px-2 py-1 rounded text-sm border cursor-pointer ${uploading ? 'bg-gray-100 text-gray-400' : 'bg-white text-gray-600 border-gray-200 hover:bg-gray-50'}`}>
          Chen PDF
          <input type="file" accept="application/pdf" className="hidden" disabled={uploading}
            onChange={e => { const f = e.target.files?.[0]; if (f) handlePdfUpload(f); e.target.value = '' }} />
        </label>
        {uploading && <span className="text-xs text-gray-400 self-center">Dang upload...</span>}
      </div>

      {showImageOptions && (
        <div className="p-4 bg-amber-50 border-b border-amber-200">
          <p className="text-sm font-medium text-gray-700 mb-3">Chon cach hien thi anh:</p>
          <div className="flex gap-2 mb-3">
            {([['center','Canh giua','Anh to chu tren/duoi'],['left','Ben trai','Chu chay ben phai'],['right','Ben phai','Chu chay ben trai']] as [string,string,string][]).map(([key,label,desc]) => (
              <button key={key} type="button" onClick={() => setImageAlign(key as any)}
                className={`flex-1 px-3 py-2 rounded-xl border-2 text-xs ${imageAlign === key ? 'border-rose-400 bg-rose-50 text-rose-600' : 'border-gray-200 bg-white text-gray-600'}`}>
                <div className="font-medium">{label}</div>
                <div className="text-gray-400">{desc}</div>
              </button>
            ))}
          </div>
          <div className="mb-3">
            <label className="block text-xs text-gray-500 mb-1">Chu thich anh (tuy chon)</label>
            <input type="text" value={imageCaption} onChange={e => setImageCaption(e.target.value)}
              placeholder="Anna tai buoi bieu dien SOS 2025"
              className="w-full px-3 py-1.5 border rounded-lg text-sm focus:outline-none focus:border-rose-300" />
          </div>
          <div className="flex gap-2">
            <button type="button" onClick={insertImage} className="px-4 py-1.5 bg-rose-500 text-white rounded-full text-sm hover:bg-rose-600">Chen anh</button>
            <button type="button" onClick={() => { setShowImageOptions(false); setPendingImageUrl('') }} className="px-4 py-1.5 border rounded-full text-sm hover:bg-gray-50">Huy</button>
          </div>
        </div>
      )}

      <EditorContent editor={editor} className="prose max-w-none p-4 min-h-48 focus:outline-none text-sm leading-relaxed" />

      <style>{`
        .ProseMirror p.is-editor-empty:first-child::before { content: attr(data-placeholder); color: #aaa; pointer-events: none; float: left; height: 0; }
        .ProseMirror:focus { outline: none; }
        .ProseMirror img { border-radius: 8px; cursor: pointer; }
        .ProseMirror h2 { font-size: 1.4em; font-weight: bold; margin: 12px 0 6px; }
        .ProseMirror h3 { font-size: 1.2em; font-weight: bold; margin: 10px 0 4px; }
        .ProseMirror ul { list-style: disc; padding-left: 20px; }
        .ProseMirror ol { list-style: decimal; padding-left: 20px; }
      `}</style>
    </div>
  )
}