import { ref, computed } from 'vue'
import { useFileUpload } from '@/components/Form/composables/useFileUpload'

export function useRichTextImageUpload(
  editorRef: { value: HTMLDivElement | null },
  callbacks: {
    saveSelection: () => void
    restoreSelection: () => void
    onInput: () => void
  }
) {
  const activeUploads = ref(0)
  const isUploadingImage = computed(() => activeUploads.value > 0)
  const imageInputRef = ref<HTMLInputElement | null>(null)
  
  const { handleUploadFile } = useFileUpload()

  function triggerImageUpload(disabledOrReadonly: boolean): void {
    if (disabledOrReadonly) return
    callbacks.saveSelection()
    imageInputRef.value?.click()
  }

  async function handleFile(file: File): Promise<void> {
    if (!file) return

    const objectUrl = URL.createObjectURL(file)
    
    callbacks.restoreSelection()
    editorRef.value?.focus()
    document.execCommand('insertImage', false, objectUrl)
    
    const newImg = editorRef.value?.querySelector(`img[src="${objectUrl}"]`) as HTMLImageElement | null
    if (newImg) {
      newImg.classList.add('rte-image-uploading')
    }
    
    callbacks.onInput()

    activeUploads.value++
    try {
      const finalUrl = await handleUploadFile(file)
      if (finalUrl) {
        const pendingImg = editorRef.value?.querySelector(`img[src="${objectUrl}"]`) as HTMLImageElement | null
        if (pendingImg) {
          pendingImg.src = finalUrl
          pendingImg.classList.remove('rte-image-uploading')
          pendingImg.loading = 'lazy'
        }
      } else {
        const pendingImg = editorRef.value?.querySelector(`img[src="${objectUrl}"]`) as HTMLImageElement | null
        if (pendingImg) pendingImg.remove()
      }
    } catch (error) {
      console.error('[RichTextEditor] Image upload error:', error)
      const pendingImg = editorRef.value?.querySelector(`img[src="${objectUrl}"]`) as HTMLImageElement | null
      if (pendingImg) pendingImg.remove()
    } finally {
      activeUploads.value--
      URL.revokeObjectURL(objectUrl)
      callbacks.onInput()
    }
  }

  async function onImageFileChange(e: Event): Promise<void> {
    const target = e.target as HTMLInputElement
    const file = target.files?.[0]
    if (file) await handleFile(file)
    target.value = '' 
  }

  async function onPaste(e: ClipboardEvent): Promise<void> {
    const items = e.clipboardData?.items
    if (!items) return
    for (let i = 0; i < items.length; i++) {
      const item = items[i]
      if (item.type.startsWith('image/')) {
        e.preventDefault()
        const file = item.getAsFile()
        if (file) {
          callbacks.saveSelection()
          await handleFile(file)
        }
        return
      }
    }
  }

  async function onDrop(e: DragEvent): Promise<void> {
    const files = e.dataTransfer?.files
    if (!files || files.length === 0) return
    for (let i = 0; i < files.length; i++) {
      const file = files[i]
      if (file.type.startsWith('image/')) {
        e.preventDefault()
        
        if (document.caretRangeFromPoint) {
          const range = document.caretRangeFromPoint(e.clientX, e.clientY)
          if (range) {
            const sel = window.getSelection()
            sel?.removeAllRanges()
            sel?.addRange(range)
          }
        }
        
        callbacks.saveSelection()
        await handleFile(file)
        return
      }
    }
  }

  return {
    imageInputRef,
    isUploadingImage,
    triggerImageUpload,
    onImageFileChange,
    onPaste,
    onDrop
  }
}
