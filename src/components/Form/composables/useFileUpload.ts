import { ref } from 'vue'

export interface FileUploadResult {
  url: string
  fileName?: string
  fileType?: string
  fileSize?: number
}

/**
 * Composable for handling file uploads
 *
 * This is a placeholder implementation. Replace the handleUploadFile
 * function body with your actual API integration.
 *
 * @example
 * ```ts
 * const { handleUploadFile, loading } = useFileUpload()
 *
 * const url = await handleUploadFile(file, folderId)
 * ```
 */
export function useFileUpload() {
  const loading = ref(false)
  const error = ref<string | null>(null)

  /**
   * Upload a file and return the URL
   *
   * @param file - File object or FilePickerValue to upload
   * @param folderId - Optional folder ID for organizing uploads
   * @returns Promise resolving to the file URL or null on failure
   */
  const handleUploadFile = async (
    file: File | { file: File; fileName?: string },
    folderId?: string | null
  ): Promise<string | null | undefined> => {
    loading.value = true
    error.value = null

    try {
      // Extract File object if FilePickerValue was passed
      const fileToUpload = file instanceof File ? file : file.file

      // ============================================
      // TODO: Replace this placeholder with your actual API call
      // ============================================

      // FIXME: This is where we will eventually implement the Signed URL flow
      // 1. Get Signed URL
      // const initRes = await fetch(`${storageApiUrl}/upload/signed-url`, {
      //    method: 'POST',
      //    headers: {
      //       'Content-Type': 'application/json',
      //       Authorization: `Bearer ${token}`,
      //    },
      //    body: JSON.stringify({
      //       fileName: fileToUpload.name,
      //       mimeType: fileToUpload.type,
      //       size: fileToUpload.size,
      //       folderId: folderId,
      //    }),
      // })

      // Simulate network delay
      await new Promise((resolve) => setTimeout(resolve, 800))

      // Return a mock URL that looks like a real storage URL
      const mockId = Math.random().toString(36).substring(7)
      // Using a reliable placeholder service for visual confirmation if needed,
      // or a mock storage URL structure.
      // For images, let's try to return the base64 if available for immediate preview in tests,
      // BUT the requirement is "gives me the file URL".

      // Let's construct a convincing mock URL
      const safeName = fileToUpload.name.replace(/[^a-zA-Z0-9.-]/g, '_')
      return `https://storage.googleapis.com/vlite-bucket/${mockId}/${safeName}`

      // ============================================
    } catch (err) {
      error.value = err instanceof Error ? err.message : 'Upload failed'
      console.error('[useFileUpload] Error:', err)
      return null
    } finally {
      loading.value = false
    }
  }

  /**
   * Upload multiple files
   */
  const handleUploadFiles = async (
    files: Array<File | { file: File }>,
    folderId?: string | null
  ): Promise<Array<string | null>> => {
    const results: Array<string | null> = []

    for (const file of files) {
      const url = await handleUploadFile(file, folderId)
      results.push(url ?? null)
    }

    return results
  }

  return {
    handleUploadFile,
    handleUploadFiles,
    loading,
    error,
  }
}
