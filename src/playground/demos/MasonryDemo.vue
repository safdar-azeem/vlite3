<script setup lang="ts">
import { ref, computed } from 'vue'
import { Masonry } from '@/components/Masonry'
import Button from '@/components/Button.vue'

// Types
type ItemType = 'text' | 'image' | 'mixed'

interface MasonryItem {
  id: number
  type: 'text' | 'image'
  height: number
  title?: string
  content?: string
  src?: string
  aspectRatio?: number
}

// State
const itemCount = ref(20)
const gap = ref(16)
const currentType = ref<ItemType>('mixed')
const items = ref<MasonryItem[]>([])

// Generate Random Data
const generateItems = (count: number, type: ItemType) => {
  const result: MasonryItem[] = []
  for (let i = 0; i < count; i++) {
    const isImage = type === 'image' || (type === 'mixed' && Math.random() > 0.5)
    // Random height between 200 and 500 for variety
    const height = Math.floor(Math.random() * (500 - 200 + 1)) + 200
    // Aspect ratio for images
    const aspectRatio = isImage ? 0.7 + Math.random() * 0.8 : 1 // 0.7 to 1.5

    result.push({
      id: Date.now() + i, // Simple unique ID
      type: isImage ? 'image' : 'text',
      height,
      aspectRatio,
      title: `Item ${i + 1}`,
      content: isImage 
        ? undefined 
        : 'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt ut labore.',
      src: isImage 
        ? `https://picsum.photos/400/${Math.floor(400 * (1/aspectRatio))}?random=${i}`
        : undefined
    })
  }
  return result
}

// Init
items.value = generateItems(itemCount.value, currentType.value)

const refresh = () => {
  items.value = generateItems(itemCount.value, currentType.value)
}

const addItems = () => {
  const newItems = generateItems(5, currentType.value)
  items.value = [...items.value, ...newItems]
}

const setType = (type: ItemType) => {
  currentType.value = type
  refresh()
}

// Column Config Options
// We can test responsive object vs number
const useResponsive = ref(true)
const fixedCols = ref(3)

const cols = computed(() => {
  if (!useResponsive.value) return fixedCols.value
  return {
    default: 1,
    sm: 2,
    md: 3,
    lg: 4,
    xl: 5
  }
})
</script>

<template>
  <div class="space-y-8">
    <!-- Title -->
    <div>
      <h2 class="text-2xl font-bold text-gray-900">Masonry Grid</h2>
      <p class="text-gray-500">Responsive masonry layout for displaying items with varying heights.</p>
    </div>

    <!-- Controls -->
    <div class="p-4 bg-white border border-gray-200 rounded-lg shadow-sm space-y-4">
      <div class="flex flex-wrap gap-4 items-center justify-between">
        
        <!-- Content Type -->
        <div class="flex items-center gap-2">
           <span class="text-sm font-medium text-gray-700">Content:</span>
           <div class="flex bg-gray-100 p-1 rounded-md">
             <button 
               v-for="t in ['text', 'image', 'mixed']" 
               :key="t"
               @click="setType(t as ItemType)"
               class="px-3 py-1 text-xs font-medium rounded capitalize transition-colors"
               :class="currentType === t ? 'bg-white text-primary shadow-sm' : 'text-gray-500 hover:text-gray-900'"
             >
               {{ t }}
             </button>
           </div>
        </div>
        
        <!-- Actions -->
        <div class="flex items-center gap-2">
            <Button size="sm" variant="outline" icon="lucide:refresh-cw" @click="refresh">Refresh</Button>
            <Button size="sm" variant="outline" icon="lucide:plus" @click="addItems">Add Items</Button>
        </div>
      </div>
      
      <div class="h-px bg-gray-100"></div>

      <div class="flex flex-wrap gap-6">
         <!-- Columns Toggle -->
         <div class="space-y-2">
            <div class="flex items-center gap-2">
                <label class="text-sm font-medium text-gray-700">Configuration</label>
                <button 
                  @click="useResponsive = !useResponsive" 
                  class="text-xs text-primary hover:underline"
                >
                  {{ useResponsive ? 'Switch to Fixed' : 'Switch to Responsive' }}
                </button>
            </div>
            
            <div v-if="!useResponsive" class="flex items-center gap-2">
                <span class="text-xs text-gray-500">Columns: {{ fixedCols }}</span>
                <input 
                  type="range" 
                  v-model.number="fixedCols" 
                  min="1" 
                  max="10" 
                  class="w-32"
                >
            </div>
            <div v-else class="text-xs text-gray-400">
               Auto-responsive: sm:2, md:3, lg:4, xl:5
            </div>
         </div>

         <!-- Gap Slider -->
         <div class="space-y-2">
            <div class="flex items-center gap-2">
                <label class="text-sm font-medium text-gray-700">Gap</label>
                <span class="text-xs text-gray-500">{{ gap }}px</span>
            </div>
            <input 
                  type="range" 
                  v-model.number="gap" 
                  min="0" 
                  max="64" 
                  step="4"
                  class="w-32"
            >
         </div>
         
         <!-- Item Count (Performance) -->
         <div class="space-y-2">
            <div class="flex items-center gap-2">
                <label class="text-sm font-medium text-gray-700">Items</label>
                <span class="text-xs text-gray-500">{{ itemCount }}</span>
            </div>
            <input 
                  type="range" 
                  v-model.number="itemCount" 
                  min="5" 
                  max="500" 
                  step="5"
                  @change="refresh"
                  class="w-32"
            >
         </div>
      </div>
    </div>

    <!-- The Masonry Grid -->
    <div class="bg-gray-50/50 p-4 rounded-xl border border-dashed border-gray-300 min-h-[500px]">
        <Masonry 
          :data="items" 
          :cols="cols" 
          :gap="gap"
          v-slot="{ data }"
        >
           <!-- Card -->
           <div 
             class="w-full rounded-xl overflow-hidden shadow-sm border border-gray-100 bg-white transition-transform duration-300 hover:-translate-y-1 hover:shadow-md"
             :class="data.type === 'text' ? 'p-6' : ''"
           >
              <!-- Content Type: Image -->
              <template v-if="data.type === 'image'">
                  <img 
                    :src="data.src" 
                    class="w-full h-auto block" 
                    loading="lazy" 
                    alt="Masonry Item"
                    :style="{ aspectRatio: data.aspectRatio }" 
                  />
                  <div class="p-4">
                      <h3 class="font-semibold text-gray-900">{{ data.title }}</h3>
                      <p class="text-sm text-gray-500 mt-1">Image Description</p>
                  </div>
              </template>

              <!-- Content Type: Text -->
              <template v-else>
                  <div class="flex items-center gap-3 mb-3">
                     <div class="w-8 h-8 rounded-full bg-primary/10 text-primary flex items-center justify-center font-bold text-xs ring-2 ring-white">
                        {{ data.id.toString().slice(-2) }}
                     </div>
                     <span class="text-xs font-semibold text-gray-400 uppercase tracking-wider">Note</span>
                  </div>
                  <h3 class="font-bold text-gray-900 mb-2">{{ data.title }}</h3>
                  <p class="text-gray-600 text-sm leading-relaxed">
                    {{ data.content }}
                    <span v-if="data.height > 300" class="block mt-2">
                       Additional content to show variable height. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore.
                    </span>
                    <span v-if="data.height > 400" class="block mt-2 text-gray-400 italic">
                       Even more content for very tall cards. Excepteur sint occaecat cupidatat non proident.
                    </span>
                  </p>
                  <div class="mt-4 pt-4 border-t border-gray-100 flex items-center justify-between">
                     <span class="text-xs text-gray-400">Just now</span>
                     <Button size="xs" variant="ghost">View</Button>
                  </div>
              </template>
           </div>
        </Masonry>
    </div>
  </div>
</template>
