import type { InputVariant, InputSize, InputRounded } from './form.type'

/**
 * Interface for the file upload handler function.
 * This allows users to replace the default upload logic with their own API.
 */
export type FileUploadHandler = (
  file: File | { file: File; fileName?: string },
  folderId?: string | null
) => Promise<string | null | undefined>

/**
 * Interface for the i18n translation handler function.
 * This allows users to pass their translation library (e.g. vue-i18n).
 */
export type TranslationHandler = (key: string, ...args: any[]) => string

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

  /**
   * Global translation function implementation.
   * Used by components to support i18n.
   */
  t?: TranslationHandler

  /**
   * Global import API handler.
   * Used by the generic Screen component for the `ImportData` process.
   */
  importApi?: (entity: string, payload: any) => Promise<any>

  /**
   * Global export API handler.
   * Used by the generic Screen component for the `ExportData` process in backend mode.
   */
  exportApi?: (entity: string, payload: any) => Promise<any>
}

/**
 * Main configuration object for the VLite plugin.
 */
export interface VLiteConfig {
  /**
   * Service registry for dependency injection.
   */
  services?: VLiteServices

  /**
   * ImportData specific configs.
   */
  importData?: {
    batchMode?: boolean
    batchSize?: number
  }

  /**
   * ExportData specific configs.
   */
  exportData?: {
    mode?: 'frontend' | 'backend'
  }

  /**
   * Global UI Components configuration
   */
  components?: {
    form?: {
      variant?: InputVariant
      size?: InputSize
      rounded?: InputRounded
      showRequiredAsterisk?: boolean
    }
    price?: {
      currency?: string
    }
    date?: {
      format?: string
    }
  }
}
