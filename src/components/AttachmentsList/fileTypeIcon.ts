/**
 * Maps a file's name or MIME type to the most descriptive Lucide/Iconify icon string.
 * Returns a fallback generic file icon when no match is found.
 *
 * Priority: explicit fileType (MIME) → file extension from fileName/fileUrl
 */

/** Extension → icon string */
const EXT_MAP: Record<string, string> = {
  // ── PDFs ──────────────────────────────────────────────────────────────────
  pdf: 'lucide:file-text',

  // ── Word / rich text ──────────────────────────────────────────────────────
  doc:  'lucide:file-text',
  docx: 'lucide:file-text',
  odt:  'lucide:file-text',
  rtf:  'lucide:file-text',

  // ── Spreadsheets ──────────────────────────────────────────────────────────
  xls:  'lucide:file-spreadsheet',
  xlsx: 'lucide:file-spreadsheet',
  ods:  'lucide:file-spreadsheet',
  csv:  'lucide:file-spreadsheet',
  tsv:  'lucide:file-spreadsheet',

  // ── Presentations ─────────────────────────────────────────────────────────
  ppt:  'lucide:presentation',
  pptx: 'lucide:presentation',
  odp:  'lucide:presentation',
  key:  'lucide:presentation',

  // ── Plain text / markdown / config ────────────────────────────────────────
  txt:  'lucide:file-text',
  md:   'lucide:file-text',
  mdx:  'lucide:file-text',
  rst:  'lucide:file-text',
  log:  'lucide:scroll-text',

  // ── Code ──────────────────────────────────────────────────────────────────
  js:    'lucide:file-code',
  jsx:   'lucide:file-code',
  ts:    'lucide:file-code',
  tsx:   'lucide:file-code',
  vue:   'lucide:file-code',
  py:    'lucide:file-code',
  rb:    'lucide:file-code',
  php:   'lucide:file-code',
  go:    'lucide:file-code',
  rs:    'lucide:file-code',
  cpp:   'lucide:file-code',
  c:     'lucide:file-code',
  cs:    'lucide:file-code',
  java:  'lucide:file-code',
  kt:    'lucide:file-code',
  swift: 'lucide:file-code',
  html:  'lucide:file-code',
  css:   'lucide:file-code',
  scss:  'lucide:file-code',
  less:  'lucide:file-code',
  sh:    'lucide:terminal',
  bash:  'lucide:terminal',
  sql:   'lucide:database',
  json:  'lucide:braces',
  yaml:  'lucide:braces',
  yml:   'lucide:braces',
  toml:  'lucide:braces',
  xml:   'lucide:code-xml',

  // ── Archives ──────────────────────────────────────────────────────────────
  zip:  'lucide:file-archive',
  rar:  'lucide:file-archive',
  '7z': 'lucide:file-archive',
  tar:  'lucide:file-archive',
  gz:   'lucide:file-archive',
  bz2:  'lucide:file-archive',

  // ── Audio ─────────────────────────────────────────────────────────────────
  mp3:  'lucide:file-audio',
  wav:  'lucide:file-audio',
  ogg:  'lucide:file-audio',
  flac: 'lucide:file-audio',
  aac:  'lucide:file-audio',
  m4a:  'lucide:file-audio',
  wma:  'lucide:file-audio',
  opus: 'lucide:file-audio',

  // ── Video ─────────────────────────────────────────────────────────────────
  mp4:  'lucide:file-video',
  mov:  'lucide:file-video',
  avi:  'lucide:file-video',
  mkv:  'lucide:file-video',
  webm: 'lucide:file-video',
  flv:  'lucide:file-video',
  wmv:  'lucide:file-video',
  m4v:  'lucide:file-video',
  '3gp':'lucide:file-video',

  // ── Fonts ─────────────────────────────────────────────────────────────────
  ttf:   'lucide:type',
  otf:   'lucide:type',
  woff:  'lucide:type',
  woff2: 'lucide:type',

  // ── Executables / binaries ────────────────────────────────────────────────
  exe: 'lucide:cog',
  dmg: 'lucide:disc',
  apk: 'lucide:smartphone',
  deb: 'lucide:package',
  rpm: 'lucide:package',

  // ── eBooks ────────────────────────────────────────────────────────────────
  epub: 'lucide:book-open',
  mobi: 'lucide:book-open',
}

/** MIME prefix → icon (coarse-grained fallback when extension is missing) */
const MIME_PREFIX_MAP: Array<{ prefix: string; icon: string }> = [
  { prefix: 'video/',       icon: 'lucide:file-video' },
  { prefix: 'audio/',       icon: 'lucide:file-audio' },
  { prefix: 'text/',        icon: 'lucide:file-text'  },
  { prefix: 'application/pdf',                                                    icon: 'lucide:file-text'        },
  { prefix: 'application/zip',                                                    icon: 'lucide:file-archive'     },
  { prefix: 'application/vnd.ms-excel',                                           icon: 'lucide:file-spreadsheet' },
  { prefix: 'application/vnd.openxmlformats-officedocument.spreadsheetml',        icon: 'lucide:file-spreadsheet' },
  { prefix: 'application/vnd.ms-powerpoint',                                      icon: 'lucide:presentation'    },
  { prefix: 'application/vnd.openxmlformats-officedocument.presentationml',       icon: 'lucide:presentation'    },
  { prefix: 'application/msword',                                                  icon: 'lucide:file-text'       },
  { prefix: 'application/vnd.openxmlformats-officedocument.wordprocessingml',     icon: 'lucide:file-text'       },
]

const FALLBACK = 'lucide:file'

/**
 * Extracts the lowercase file extension from a URL or file name string.
 * Strips query strings and hash fragments before matching.
 */
function getExtension(name?: string): string {
  if (!name) return ''
  const clean = name.split('?')[0].split('#')[0]
  const dot = clean.lastIndexOf('.')
  if (dot === -1) return ''
  return clean.slice(dot + 1).toLowerCase()
}

/**
 * Returns the best Iconify icon string for a given file.
 *
 * Resolution order:
 *   1. Extension from fileName
 *   2. Extension from fileUrl
 *   3. MIME type prefix match (fileType)
 *   4. Generic fallback
 */
export function getFileTypeIcon(
  fileName?: string,
  fileUrl?: string,
  fileType?: string,
): string {
  // 1. Extension from fileName
  const extFromName = getExtension(fileName)
  if (extFromName && EXT_MAP[extFromName]) return EXT_MAP[extFromName]

  // 2. Extension from fileUrl
  const extFromUrl = getExtension(fileUrl)
  if (extFromUrl && EXT_MAP[extFromUrl]) return EXT_MAP[extFromUrl]

  // 3. MIME prefix
  if (fileType) {
    const mime = fileType.toLowerCase()
    for (const { prefix, icon } of MIME_PREFIX_MAP) {
      if (mime.startsWith(prefix)) return icon
    }
  }

  return FALLBACK
}
