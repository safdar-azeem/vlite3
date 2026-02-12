import { ref } from 'vue'
import { useVLiteConfig } from '@/core/config'

export interface FileUploadResult {
  url: string
  fileName?: string
  fileType?: string
  fileSize?: number
}

/**
 * Composable for handling file uploads.
 *
 * This composable automatically checks the global VLite configuration
 * for a registered 'upload' service. If found, it uses that service.
 * Otherwise, it falls back to a mock implementation.
 */
export function useFileUpload() {
  const loading = ref(false)
  const error = ref<string | null>(null)
  const config = useVLiteConfig()

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
    // Note: We don't set loading globally here if calling from handleUploadFiles
    // to avoid flickering, but for single calls it's fine.
    // If running in parallel, the parent handles the loading state usually,
    // but safe to keep strictly for single file usage.
    
    try {
      // Extract File object if FilePickerValue was passed
      // If it's a FilePickerValue, it has a .file property
      const fileToUpload = file instanceof File ? file : file.file

      // If no actual file object is present (e.g. malformed data), return null
      if (!fileToUpload) return null

      // ---------------------------------------------------------
      // 1. Check for Global Custom Implementation (Registry Pattern)
      // ---------------------------------------------------------
      if (config.services?.upload) {
        try {
          const result = await config.services.upload(fileToUpload, folderId)
          return result
        } catch (customErr) {
          throw customErr instanceof Error ? customErr : new Error('External upload service failed')
        }
      }

      // ---------------------------------------------------------
      // 2. Default Fallback Implementation (if no global service registered)
      // ---------------------------------------------------------

      // Simulate network delay
      await new Promise((resolve) => setTimeout(resolve, 800))

      // Generate a mock URL
      const mockId = Math.random().toString(36).substring(7)
      const safeName = fileToUpload.name.replace(/[^a-zA-Z0-9.-]/g, '_')

      return `https://storage.googleapis.com/vlite-bucket/${mockId}/${safeName}`

    } catch (err) {
      const msg = err instanceof Error ? err.message : 'Upload failed'
      console.error('[useFileUpload] Error:', err)
      // If called individually, set error. If parallel, this might get overwritten,
      // but usually the Promise.all catch block handles the group error.
      error.value = msg
      return null
    }
  }

  /**
   * Upload multiple files in parallel
   */
  const handleUploadFiles = async (
    files: Array<File | { file: File }>,
    folderId?: string | null
  ): Promise<Array<string | null>> => {
    loading.value = true
    error.value = null

    try {
      // Create an array of promises for parallel execution
      const uploadPromises = files.map((file) => handleUploadFile(file, folderId))

      // Wait for all uploads to complete
      const results = await Promise.all(uploadPromises)
      
      return results
    } catch (err) {
      error.value = err instanceof Error ? err.message : 'One or more uploads failed'
      console.error('[useFileUpload] Parallel Upload Error:', err)
      return [] 
    } finally {
      loading.value = false
    }
  }

  return {
    handleUploadFile,
    handleUploadFiles,
    loading,
    error,
  }
}

