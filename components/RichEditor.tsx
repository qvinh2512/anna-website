'use client'
import { useEditor, EditorContent } from '@tiptap/react'
import StarterKit from '@tiptap/starter-kit'
import Image from '@tiptap/extension-image'
import TextAlign from '@tiptap/extension-text-align'
import Underline from '@tiptap/extension-underline'
import Placeholder from '@tiptap/extension-placeholder'
import { createClient } from '../app/lib/supabase/client'

type Props = {
  value: string
  onChange: (val: string) => void
  placeholder?: string
}

export default function RichEditor({ value, onChange, placeholder }: Props) {
  const supabase = createClient()

  const editor = useEditor({
    extensions: [
      StarterKit,
      Underline,
      TextAlign.configure({ types: ['heading', 'paragraph'] }),
      Image.configure({ inline: false, allowBase64: false }),
      Placeholder.configure({ placeholder: placeholder || 'Viết nội dung ở đây...' }),
    ],
    content: value,
    onUpdate: ({ editor }) => onChange(editor.getHTML()),
  })

  const uploadImage = async (file: File) => {
    const ext = file.name.split('.').pop()
    const fileName = `posts/${Date.now()}-${Math.random().toString(36).slice(2)}.${ext}`
    const { error } = await supabase.storage.from('anna-images').upload(fileName, file)
    if (error) { alert('Lỗi upload: ' + error.message); return }
    const { data } = supabase.storage.from('anna-images').getPublicUrl(fileName)
    editor?.chain().focus().setImage({ src: data.publicUrl }).run()
  }

  if (!editor) return null

  const btnClass = (active: boolean) =>
    `px-2 py-1 rounded text-sm border transition-colors ${active ? 'bg-rose-500 text-white border-rose-500' : 'bg-white text-gray-600 border-gray-200 hover:bg-gray-50'}`

  return (
    <div className="border rounded-xl overflow-hidden">
      {/* Toolbar */}
      <div className="flex flex-wrap gap-1 p-2 bg-gray-50 border-b">
        {/* Bold, Italic, Underline */}
        <button type="button" onClick={() => editor.chain().focus().toggleBold().run()}
          className={btnClass(editor.isActive('bold'))}>B</button>
        <button type="button" onClick={() => editor.chain().focus().toggleItalic().run()}
          className={btnClass(editor.isActive('italic'))}>I</button>
        <button type="button" onClick={() => editor.chain().focus().toggleUnderline().run()}
          className={btnClass(editor.isActive('underline'))}>U</button>

        <div className="w-px bg-gray-200 mx-1" />

        {/* Heading */}
        <button type="button" onClick={() => editor.chain().focus().toggleHeading({ level: 2 }).run()}
          className={btnClass(editor.isActive('heading', { level: 2 }))}>H2</button>
        <button type="button" onClick={() => editor.chain().focus().toggleHeading({ level: 3 }).run()}
          className={btnClass(editor.isActive('heading', { level: 3 }))}>H3</button>

        <div className="w-px bg-gray-200 mx-1" />

        {/* Align */}
        <button type="button" onClick={() => editor.chain().focus().setTextAlign('left').run()}
          className={btnClass(editor.isActive({ textAlign: 'left' }))}>⬅</button>
        <button type="button" onClick={() => editor.chain().focus().setTextAlign('center').run()}
          className={btnClass(editor.isActive({ textAlign: 'center' }))}>↔</button>
        <button type="button" onClick={() => editor.chain().focus().setTextAlign('right').run()}
          className={btnClass(editor.isActive({ textAlign: 'right' }))}>➡</button>

        <div className="w-px bg-gray-200 mx-1" />

        {/* List */}
        <button type="button" onClick={() => editor.chain().focus().toggleBulletList().run()}
          className={btnClass(editor.isActive('bulletList'))}>• List</button>
        <button type="button" onClick={() => editor.chain().focus().toggleOrderedList().run()}
          className={btnClass(editor.isActive('orderedList'))}>1. List</button>

        <div className="w-px bg-gray-200 mx-1" />

        {/* Upload ảnh */}
        <label className="px-2 py-1 rounded text-sm border bg-white text-gray-600 border-gray-200 hover:bg-gray-50 cursor-pointer transition-colors">
          📷 Ảnh
          <input type="file" accept="image/*" className="hidden"
            onChange={e => { const f = e.target.files?.[0]; if (f) uploadImage(f); e.target.value = '' }} />
        </label>
      </div>

      {/* Editor area */}
      <EditorContent editor={editor}
        className="prose max-w-none p-4 min-h-48 focus:outline-none text-sm leading-relaxed" />

      <style>{`
        .ProseMirror p.is-editor-empty:first-child::before {
          content: attr(data-placeholder);
          color: #aaa;
          pointer-events: none;
          float: left;
          height: 0;
        }
        .ProseMirror:focus { outline: none; }
        .ProseMirror img { max-width: 100%; border-radius: 8px; margin: 8px auto; display: block; }
        .ProseMirror h2 { font-size: 1.4em; font-weight: bold; margin: 12px 0 6px; }
        .ProseMirror h3 { font-size: 1.2em; font-weight: bold; margin: 10px 0 4px; }
        .ProseMirror ul { list-style: disc; padding-left: 20px; }
        .ProseMirror ol { list-style: decimal; padding-left: 20px; }
      `}</style>
    </div>
  )
}
