// ─────────────────────────────────────────────────────────────────────────────
// search.util.ts — High-performance search engine with indexing & caching
// ─────────────────────────────────────────────────────────────────────────────

// ═══════════════════════════════════════════════════════════════════════════════
// SECTION 1 — Types & Interfaces
// ═══════════════════════════════════════════════════════════════════════════════

/** Comparison operators for numeric/string range and equality checks */
export interface SearchOperators<V = any> {
  /** Exact equality */
  $eq?: V
  /** Not equal */
  $ne?: V
  /** Greater than (numeric) */
  $gt?: number
  /** Greater than or equal (numeric) */
  $gte?: number
  /** Less than (numeric) */
  $lt?: number
  /** Less than or equal (numeric) */
  $lte?: number
  /** Case-insensitive substring match */
  $in?: string
  /** NOT case-insensitive substring match */
  $nin?: string
  /** Regex test */
  $regex?: string | RegExp
  /** Field existence check: true = must exist & not be null/undefined, false = must NOT exist */
  $exists?: boolean
}

/** A query value for a single field: direct value or operator object */
export type QueryValue<V = any> = V | SearchOperators<V>

/** A query object: partial map of field names to query values */
export type QueryObject<T = Record<string, any>> = {
  [K in keyof T]?: QueryValue<T[K]>
}

/** The full query input: string (for primitive arrays), single query, or OR-array of queries */
export type SearchQuery<T = any> = T extends string
  ? string | QueryObject<T> | QueryObject<T>[]
  : string | QueryObject<T> | QueryObject<T>[]

/** Returned from `search()` */
export interface SearchResult<T> {
  /** Matching items */
  results: T[]
  /** Clears the cached index for the associated model key */
  reset: () => void
}

// ═══════════════════════════════════════════════════════════════════════════════
// SECTION 2 — Internal Index Structures
// ═══════════════════════════════════════════════════════════════════════════════

/** Sorted entry for numeric binary-search index */
interface SortedEntry {
  value: number
  idx: number
}

/** Per-field index container */
interface FieldIndex {
  /** Exact-value hash: stringified value → set of row indices */
  hash: Map<string, Set<number>>
  /** Inverted text index: each unique token (lowercase word/substring) → row indices */
  inverted: Map<string, Set<number>>
  /** Sorted numeric entries for range queries */
  sorted: SortedEntry[]
  /** Whether this field contains numeric values */
  isNumeric: boolean
}

/** Complete index for a dataset */
interface DataIndex<T = any> {
  /** Field-level indexes */
  fields: Map<string, FieldIndex>
  /** Direct reference to the source data for identity checks */
  dataRef: T[] | null
  /** Length of data at index-build time */
  dataLength: number
  /** Primitive text index: lowercase string → row indices (for string[] data) */
  primitiveInverted: Map<string, number[]> | null
}

// ═══════════════════════════════════════════════════════════════════════════════
// SECTION 3 — Global Index Cache
// ═══════════════════════════════════════════════════════════════════════════════

const indexCache = new Map<string, DataIndex>()

/**
 * Reset cached indexes.
 * @param modelKey — If provided, only that model's cache is cleared.
 *                   If omitted, ALL caches are cleared.
 */
export function resetSearchIndex(modelKey?: string): void {
  if (modelKey) {
    indexCache.delete(modelKey)
  } else {
    indexCache.clear()
  }
}

// ═══════════════════════════════════════════════════════════════════════════════
// SECTION 4 — Index Builder
// ═══════════════════════════════════════════════════════════════════════════════

/**
 * Checks whether the cached index is still valid for the given data array.
 */
function isCacheValid<T>(cached: DataIndex<T>, data: T[]): boolean {
  if (cached.dataRef) {
    return cached.dataRef === data
  }
  return cached.dataLength === data.length
}

/**
 * Builds (or retrieves from cache) the full index for a dataset.
 */
function getOrBuildIndex<T>(data: T[], modelKey?: string): DataIndex<T> {
  // Check cache
  if (modelKey) {
    const cached = indexCache.get(modelKey) as DataIndex<T> | undefined
    if (cached && isCacheValid(cached, data)) {
      return cached
    }
  }

  const isPrimitive = data.length === 0 || typeof data[0] !== 'object' || data[0] === null

  const index: DataIndex<T> = {
    fields: new Map(),
    dataRef: null,
    dataLength: data.length,
    primitiveInverted: null,
  }

  // Hold a reference to the data array for identity check on cache hit
  index.dataRef = data

  if (isPrimitive) {
    // ── Build primitive inverted index ──
    const inv = new Map<string, number[]>()
    for (let i = 0; i < data.length; i++) {
      const val = String(data[i]).toLowerCase()
      // Index every substring of length 1..val.length (capped for perf)
      // For efficiency, we store the full lowercase string and do substring matching at query time
      // But we also tokenize on natural boundaries for fast lookups
      const existing = inv.get(val)
      if (existing) {
        existing.push(i)
      } else {
        inv.set(val, [i])
      }
    }
    index.primitiveInverted = inv
  } else {
    // ── Build field-level indexes for object arrays ──
    const sampleKeys = new Set<string>()
    // Collect all field names from first 100 items for schema inference
    const sampleSize = Math.min(data.length, 100)
    for (let i = 0; i < sampleSize; i++) {
      const item = data[i] as Record<string, any>
      if (item && typeof item === 'object') {
        for (const key of Object.keys(item)) {
          sampleKeys.add(key)
        }
      }
    }

    for (const field of sampleKeys) {
      const fieldIdx: FieldIndex = {
        hash: new Map(),
        inverted: new Map(),
        sorted: [],
        isNumeric: false,
      }

      let hasNumeric = false

      for (let i = 0; i < data.length; i++) {
        const item = data[i] as Record<string, any>
        if (!item || typeof item !== 'object') continue

        const val = item[field]
        if (val === undefined || val === null) continue

        // ── Hash index (exact match) ──
        const hashKey = Array.isArray(val) ? JSON.stringify(val) : String(val)
        const hashSet = fieldIdx.hash.get(hashKey)
        if (hashSet) {
          hashSet.add(i)
        } else {
          fieldIdx.hash.set(hashKey, new Set([i]))
        }

        // ── Inverted text index ──
        if (typeof val === 'string') {
          const lower = val.toLowerCase()
          const invSet = fieldIdx.inverted.get(lower)
          if (invSet) {
            invSet.add(i)
          } else {
            fieldIdx.inverted.set(lower, new Set([i]))
          }
        } else if (Array.isArray(val)) {
          // Index each element of array fields
          for (const elem of val) {
            if (typeof elem === 'string') {
              const lower = elem.toLowerCase()
              const invSet = fieldIdx.inverted.get(lower)
              if (invSet) {
                invSet.add(i)
              } else {
                fieldIdx.inverted.set(lower, new Set([i]))
              }
            }
          }
        }

        // ── Numeric sorted index ──
        if (typeof val === 'number' && Number.isFinite(val)) {
          hasNumeric = true
          fieldIdx.sorted.push({ value: val, idx: i })
        }
      }

      if (hasNumeric) {
        fieldIdx.sorted.sort((a, b) => a.value - b.value)
        fieldIdx.isNumeric = true
      }

      index.fields.set(field, fieldIdx)
    }
  }

  // Store in cache
  if (modelKey) {
    indexCache.set(modelKey, index)
  }

  return index
}

// ═══════════════════════════════════════════════════════════════════════════════
// SECTION 5 — Binary Search Helpers
// ═══════════════════════════════════════════════════════════════════════════════

/**
 * Returns the index of the first entry with value >= target.
 */
function lowerBound(sorted: SortedEntry[], target: number): number {
  let lo = 0
  let hi = sorted.length
  while (lo < hi) {
    const mid = (lo + hi) >>> 1
    if (sorted[mid].value < target) lo = mid + 1
    else hi = mid
  }
  return lo
}

/**
 * Returns the index of the first entry with value > target.
 */
function upperBound(sorted: SortedEntry[], target: number): number {
  let lo = 0
  let hi = sorted.length
  while (lo < hi) {
    const mid = (lo + hi) >>> 1
    if (sorted[mid].value <= target) lo = mid + 1
    else hi = mid
  }
  return lo
}

/**
 * Collects all row indices from sorted entries in range [fromIdx, toIdx).
 */
function collectFromSorted(sorted: SortedEntry[], fromIdx: number, toIdx: number): Set<number> {
  const result = new Set<number>()
  for (let i = fromIdx; i < toIdx; i++) {
    result.add(sorted[i].idx)
  }
  return result
}

// ═══════════════════════════════════════════════════════════════════════════════
// SECTION 6 — Operator Checking
// ═══════════════════════════════════════════════════════════════════════════════

const OPERATOR_KEYS = new Set([
  '$eq',
  '$ne',
  '$gt',
  '$gte',
  '$lt',
  '$lte',
  '$in',
  '$nin',
  '$regex',
  '$exists',
])

/**
 * Determines whether a query value is an operator object (e.g., { $gte: 10 })
 * vs. a direct value.
 */
function isOperatorObject(val: any): val is SearchOperators {
  if (!val || typeof val !== 'object' || Array.isArray(val)) return false
  return Object.keys(val).some((k) => OPERATOR_KEYS.has(k))
}

// ═══════════════════════════════════════════════════════════════════════════════
// SECTION 7 — Field-Level Query Evaluation (Index-Accelerated)
// ═══════════════════════════════════════════════════════════════════════════════

/**
 * Evaluates a single field condition against a value using operators.
 * Returns true if the item's field value matches the condition.
 */
function matchesOperators(itemValue: any, ops: SearchOperators): boolean {
  // $exists
  if (ops.$exists !== undefined) {
    const exists = itemValue !== undefined && itemValue !== null
    if (ops.$exists !== exists) return false
  }

  // $eq
  if (ops.$eq !== undefined) {
    if (itemValue !== ops.$eq) return false
  }

  // $ne
  if (ops.$ne !== undefined) {
    if (itemValue === ops.$ne) return false
  }

  // $gt
  if (ops.$gt !== undefined) {
    if (typeof itemValue !== 'number' || itemValue <= ops.$gt) return false
  }

  // $gte
  if (ops.$gte !== undefined) {
    if (typeof itemValue !== 'number' || itemValue < ops.$gte) return false
  }

  // $lt
  if (ops.$lt !== undefined) {
    if (typeof itemValue !== 'number' || itemValue >= ops.$lt) return false
  }

  // $lte
  if (ops.$lte !== undefined) {
    if (typeof itemValue !== 'number' || itemValue > ops.$lte) return false
  }

  // $in (case-insensitive substring match)
  if (ops.$in !== undefined) {
    const needle = String(ops.$in).toLowerCase()
    if (Array.isArray(itemValue)) {
      const found = itemValue.some((v) => typeof v === 'string' && v.toLowerCase().includes(needle))
      if (!found) return false
    } else {
      if (typeof itemValue !== 'string' || !itemValue.toLowerCase().includes(needle)) return false
    }
  }

  // $nin (NOT substring match)
  if (ops.$nin !== undefined) {
    const needle = String(ops.$nin).toLowerCase()
    if (Array.isArray(itemValue)) {
      const found = itemValue.some((v) => typeof v === 'string' && v.toLowerCase().includes(needle))
      if (found) return false
    } else {
      if (typeof itemValue === 'string' && itemValue.toLowerCase().includes(needle)) return false
    }
  }

  // $regex
  if (ops.$regex !== undefined) {
    const re = ops.$regex instanceof RegExp ? ops.$regex : new RegExp(ops.$regex, 'i')
    if (!re.test(String(itemValue))) return false
  }

  return true
}

/**
 * Uses the field index to quickly resolve which row indices match a field condition.
 * Falls back to full scan when no suitable index can accelerate the query.
 * Returns null if full-scan fallback is needed.
 */
function resolveFieldViaIndex(
  fieldIndex: FieldIndex,
  queryValue: any,
  totalLength: number
): Set<number> | null {
  // ── Direct value (no operator) ──
  if (!isOperatorObject(queryValue)) {
    if (typeof queryValue === 'string') {
      // Substring match via inverted index scan
      const needle = queryValue.toLowerCase()
      const result = new Set<number>()
      for (const [text, indices] of fieldIndex.inverted) {
        if (text.includes(needle)) {
          for (const idx of indices) result.add(idx)
        }
      }
      return result
    }

    // Exact match via hash index
    const hashKey = Array.isArray(queryValue) ? JSON.stringify(queryValue) : String(queryValue)
    const hashResult = fieldIndex.hash.get(hashKey)
    return hashResult ? new Set(hashResult) : new Set()
  }

  // ── Operator object ──
  const ops = queryValue as SearchOperators

  // Try index-accelerated paths first
  // Pure numeric range: use sorted index
  const hasRange =
    ops.$gt !== undefined ||
    ops.$gte !== undefined ||
    ops.$lt !== undefined ||
    ops.$lte !== undefined
  const hasOnlyRangeAndEq =
    hasRange &&
    ops.$in === undefined &&
    ops.$nin === undefined &&
    ops.$regex === undefined &&
    ops.$exists === undefined &&
    ops.$ne === undefined

  if (hasOnlyRangeAndEq && fieldIndex.isNumeric && fieldIndex.sorted.length > 0) {
    let lo = 0
    let hi = fieldIndex.sorted.length

    if (ops.$gte !== undefined) lo = lowerBound(fieldIndex.sorted, ops.$gte)
    else if (ops.$gt !== undefined) lo = upperBound(fieldIndex.sorted, ops.$gt)

    if (ops.$lte !== undefined) hi = upperBound(fieldIndex.sorted, ops.$lte)
    else if (ops.$lt !== undefined) hi = lowerBound(fieldIndex.sorted, ops.$lt)

    let result = collectFromSorted(fieldIndex.sorted, lo, hi)

    // Apply $eq filter if present
    if (ops.$eq !== undefined) {
      const eqSet = new Set<number>()
      for (const idx of result) {
        if (fieldIndex.sorted.find((e) => e.idx === idx && e.value === ops.$eq)) {
          eqSet.add(idx)
        }
      }
      result = eqSet
    }

    return result
  }

  // Pure $eq: use hash index
  if (
    ops.$eq !== undefined &&
    ops.$in === undefined &&
    ops.$nin === undefined &&
    ops.$regex === undefined &&
    !hasRange
  ) {
    const hashKey = String(ops.$eq)
    const hashResult = fieldIndex.hash.get(hashKey)
    return hashResult ? new Set(hashResult) : new Set()
  }

  // Pure $in (substring): use inverted index
  if (
    ops.$in !== undefined &&
    ops.$eq === undefined &&
    ops.$ne === undefined &&
    ops.$nin === undefined &&
    ops.$regex === undefined &&
    !hasRange
  ) {
    const needle = String(ops.$in).toLowerCase()
    const result = new Set<number>()
    for (const [text, indices] of fieldIndex.inverted) {
      if (text.includes(needle)) {
        for (const idx of indices) result.add(idx)
      }
    }
    return result
  }

  // Cannot fully resolve via index — return null to signal full-scan needed
  return null
}

// ═══════════════════════════════════════════════════════════════════════════════
// SECTION 8 — Query Execution
// ═══════════════════════════════════════════════════════════════════════════════

/**
 * Evaluates a single QueryObject against the dataset using indexes.
 * Returns the set of matching row indices.
 */
function evaluateQueryObject<T>(
  data: T[],
  query: QueryObject<T>,
  dataIndex: DataIndex<T>
): Set<number> {
  const fields = Object.keys(query) as (keyof T & string)[]

  if (fields.length === 0) {
    // Empty query matches everything
    const all = new Set<number>()
    for (let i = 0; i < data.length; i++) all.add(i)
    return all
  }

  let resultSet: Set<number> | null = null

  for (const field of fields) {
    const queryValue = (query as any)[field]
    const fieldIdx = dataIndex.fields.get(field as string)

    let fieldMatches: Set<number>

    if (fieldIdx) {
      // Try index-accelerated resolution
      const indexed = resolveFieldViaIndex(fieldIdx, queryValue, data.length)

      if (indexed !== null) {
        fieldMatches = indexed
      } else {
        // Full-scan fallback for complex operator combinations
        fieldMatches = new Set<number>()
        const candidates = resultSet ?? Array.from({ length: data.length }, (_, i) => i)
        for (const i of candidates) {
          const item = data[i] as Record<string, any>
          if (!item || typeof item !== 'object') continue
          const itemValue = item[field as string]
          if (isOperatorObject(queryValue)) {
            if (matchesOperators(itemValue, queryValue)) fieldMatches.add(i)
          } else {
            // Direct match
            if (typeof queryValue === 'string') {
              const needle = queryValue.toLowerCase()
              if (typeof itemValue === 'string' && itemValue.toLowerCase().includes(needle)) {
                fieldMatches.add(i)
              } else if (
                Array.isArray(itemValue) &&
                itemValue.some((v) => typeof v === 'string' && v.toLowerCase().includes(needle))
              ) {
                fieldMatches.add(i)
              }
            } else {
              if (itemValue === queryValue) fieldMatches.add(i)
            }
          }
        }
      }
    } else {
      // No index for this field — full scan
      fieldMatches = new Set<number>()
      const candidates = resultSet ?? Array.from({ length: data.length }, (_, i) => i)
      for (const i of candidates) {
        const item = data[i] as Record<string, any>
        if (!item || typeof item !== 'object') continue
        const itemValue = item[field as string]
        if (isOperatorObject(queryValue)) {
          if (matchesOperators(itemValue, queryValue)) fieldMatches.add(i)
        } else {
          if (typeof queryValue === 'string') {
            const needle = queryValue.toLowerCase()
            if (typeof itemValue === 'string' && itemValue.toLowerCase().includes(needle)) {
              fieldMatches.add(i)
            } else if (
              Array.isArray(itemValue) &&
              itemValue.some((v) => typeof v === 'string' && v.toLowerCase().includes(needle))
            ) {
              fieldMatches.add(i)
            }
          } else {
            if (itemValue === queryValue) fieldMatches.add(i)
          }
        }
      }
    }

    // AND — intersect with previous results
    if (resultSet === null) {
      resultSet = fieldMatches
    } else {
      const intersection = new Set<number>()
      for (const idx of resultSet) {
        if (fieldMatches.has(idx)) intersection.add(idx)
      }
      resultSet = intersection
    }

    // Early exit if no matches remain
    if (resultSet.size === 0) break
  }

  return resultSet ?? new Set()
}

/**
 * Evaluates a primitive string query against a string[] dataset.
 */
function evaluatePrimitiveQuery<T>(data: T[], query: string, dataIndex: DataIndex<T>): Set<number> {
  const needle = query.toLowerCase()
  const result = new Set<number>()

  if (dataIndex.primitiveInverted) {
    // Use inverted index — scan all entries for substring match
    for (const [text, indices] of dataIndex.primitiveInverted) {
      if (text.includes(needle)) {
        for (const idx of indices) result.add(idx)
      }
    }
  } else {
    // Fallback full scan
    for (let i = 0; i < data.length; i++) {
      if (String(data[i]).toLowerCase().includes(needle)) {
        result.add(i)
      }
    }
  }

  return result
}

// ═══════════════════════════════════════════════════════════════════════════════
// SECTION 9 — Public API
// ═══════════════════════════════════════════════════════════════════════════════

/**
 * High-performance search engine with indexing and caching.
 *
 * Supports primitive arrays (string search), object arrays with exact/substring match,
 * query operators ($in, $gte, $lte, etc.), OR queries (array of query objects),
 * and AND queries (multiple rest-parameter query objects).
 *
 * @param data        — The dataset to search (array of primitives or objects)
 * @param queries     — One or more queries. Last argument may be a `modelKey` string.
 *                      - `string` — substring search on primitive arrays
 *                      - `QueryObject` — AND of all field conditions
 *                      - `QueryObject[]` — OR across the array (union)
 *                      - Multiple `QueryObject` args — AND across queries (intersection)
 * @param modelKey    — Optional cache key (like a Mongoose model name). Pass as the
 *                      last argument. When reused, indexes are cached and not rebuilt.
 *
 * @returns `{ results, reset }` — `results` is the matched items in original order;
 *          `reset()` clears the cached index for this model key.
 *
 * @example
 * // Primitive search
 * const { results } = search(['apple', 'banana', 'cherry'], 'an')
 * // results: ['banana']
 *
 * @example
 * // Object search with exact match
 * const { results } = search(users, { name: 'Jane' }, 'User')
 *
 * @example
 * // Multiple AND queries
 * const { results } = search(products, { category: 'clothes' }, { price: { $gte: 200 } }, 'Product')
 *
 * @example
 * // OR query (array)
 * const { results } = search(users, [{ name: 'John' }, { age: 25 }], 'User')
 */
export function search<T>(data: T[], ...args: any[]): SearchResult<T> {
  if (!Array.isArray(data) || data.length === 0) {
    return { results: [], reset: () => {} }
  }

  // ── Parse arguments: separate queries from modelKey ──
  let modelKey: string | undefined
  let queryArgs: any[] = args

  // If the last argument is a plain string that looks like a model key (not a search query for primitives)
  // We detect this by checking: if there are 2+ args and last is a string, it's a model key.
  // If there's exactly 1 arg and it's a string, it depends on data type:
  //   - primitive data → it's a search query
  //   - object data → it's a model key (but this makes no sense without a query, so treat as query)
  if (args.length >= 2 && typeof args[args.length - 1] === 'string') {
    const lastArg = args[args.length - 1]
    // Heuristic: model keys are typically PascalCase/camelCase identifiers, not search terms
    // But to be safe, if the second-to-last arg is also a string and data is primitive, both could be queries
    // The reliable rule: if last arg is a string AND the data is objects, last is modelKey
    const isPrimitiveData = data.length > 0 && (typeof data[0] !== 'object' || data[0] === null)

    if (!isPrimitiveData) {
      modelKey = lastArg
      queryArgs = args.slice(0, -1)
    } else if (args.length >= 3) {
      // For primitive data with 3+ args, last is still modelKey
      modelKey = lastArg
      queryArgs = args.slice(0, -1)
    }
    // For primitive data with exactly 2 args: first is query string, second is modelKey
    else if (args.length === 2) {
      modelKey = lastArg
      queryArgs = args.slice(0, -1)
    }
  }

  // ── Build or retrieve index ──
  const dataIndex = getOrBuildIndex(data, modelKey)

  const resetFn = () => {
    if (modelKey) {
      resetSearchIndex(modelKey)
    }
  }

  // ── No query provided ──
  if (queryArgs.length === 0) {
    return { results: [...data], reset: resetFn }
  }

  const firstQuery = queryArgs[0]

  // ── String query on any data ──
  if (typeof firstQuery === 'string') {
    const matchedIndices = evaluatePrimitiveQuery(data, firstQuery, dataIndex)
    const results = Array.from(matchedIndices)
      .sort((a, b) => a - b)
      .map((i) => data[i])
    return { results, reset: resetFn }
  }

  // ── Array of queries (OR) ──
  if (Array.isArray(firstQuery)) {
    const orQueries = firstQuery as QueryObject<T>[]
    const unionIndices = new Set<number>()
    for (const q of orQueries) {
      const matches = evaluateQueryObject(data, q, dataIndex)
      for (const idx of matches) unionIndices.add(idx)
    }

    // If there are additional query args, AND them
    let finalIndices = unionIndices
    for (let i = 1; i < queryArgs.length; i++) {
      const q = queryArgs[i] as QueryObject<T>
      if (typeof q !== 'object' || Array.isArray(q)) continue
      const matches = evaluateQueryObject(data, q, dataIndex)
      const intersection = new Set<number>()
      for (const idx of finalIndices) {
        if (matches.has(idx)) intersection.add(idx)
      }
      finalIndices = intersection
    }

    const results = Array.from(finalIndices)
      .sort((a, b) => a - b)
      .map((i) => data[i])
    return { results, reset: resetFn }
  }

  // ── Single or multiple QueryObject(s) (AND) ──
  let resultIndices: Set<number> | null = null

  for (let i = 0; i < queryArgs.length; i++) {
    const q = queryArgs[i]
    if (typeof q !== 'object' || q === null || Array.isArray(q)) continue
    const matches = evaluateQueryObject(data, q as QueryObject<T>, dataIndex)

    if (resultIndices === null) {
      resultIndices = matches
    } else {
      // Intersect (AND)
      const intersection = new Set<number>()
      for (const idx of resultIndices) {
        if (matches.has(idx)) intersection.add(idx)
      }
      resultIndices = intersection
    }

    if (resultIndices.size === 0) break
  }

  const results = resultIndices
    ? Array.from(resultIndices)
        .sort((a, b) => a - b)
        .map((i) => data[i])
    : []

  return { results, reset: resetFn }
}
