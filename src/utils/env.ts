/**
 * Global environment object that wraps `import.meta.env` for Vite-based Vue 3 apps.
 *
 * Usage:
 * ```ts
 * import { env } from 'vlite3'
 *
 * // Instead of: import.meta.env.VITE_GOOGLE_CLIENT_ID
 * // Use:        env.VITE_GOOGLE_CLIENT_ID
 * ```
 *
 * Works in `<script setup>`, composables, and `<template>` blocks.
 */
export const env: Record<string, string> = (import.meta as any).env ?? {}
