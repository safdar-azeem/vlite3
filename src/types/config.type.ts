/**
 * Interface for the file upload handler function.
 * This allows users to replace the default upload logic with their own API.
 */
export type FileUploadHandler = (
  file: File | { file: File; fileName?: string },
  folderId?: string | null
) => Promise<string | null | undefined>

/**
 * Registry for global services.
 * Extend this interface when adding new global capabilities (e.g., auth, analytics).
 */
export interface VLiteServices {
  /**
   * Global file upload implementation.
   * Used by useFileUpload composable.
   */
  upload?: FileUploadHandler
}

/**
 * Main configuration object for the VLite plugin.
 */
export interface VLiteConfig {
  /**
   * Service registry for dependency injection.
   */
  services?: VLiteServices
}

