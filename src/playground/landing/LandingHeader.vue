<script setup lang="ts">
import { ref, onMounted, onUnmounted } from 'vue'
import { useRouter, useRoute } from 'vue-router'
import Button from '@/components/Button.vue'
import Icon from '@/components/Icon.vue'
import ThemeToggle from '@/components/ThemeToggle.vue'

const router = useRouter()
const route = useRoute()
const isScrolled = ref(false)

const handleScroll = () => {
  isScrolled.value = window.scrollY > 20
}

onMounted(() => {
  window.addEventListener('scroll', handleScroll)
})

onUnmounted(() => {
  window.removeEventListener('scroll', handleScroll)
})

const navItems = [
  { label: 'Components', path: '/components/button', icon: 'lucide:grid' },
  { label: 'Documentation', path: '/components/getting-started', icon: 'lucide:file-text' },
]
</script>

<template>
  <div
    class="sticky top-0 z-[100] flex justify-center pointer-events-none w-full py-4 border-b border-border/70">
    <header
      class="pointer-events-auto relative flex items-center justify-between w-full max-w-[1400px]">
      <!-- Logo Area -->
      <div
        class="flex items-center gap-2.5 cursor-pointer shrink-0 pl-1 group/logo"
        @click="router.push('/')">
        <div
          class="w-9 h-9 rounded-full bg-foreground text-background flex items-center justify-center font-black text-lg hover:bg-primary">
          V
        </div>
        <span
          class="font-extrabold text-xl tracking-tight hidden lg:block text-foreground hover:text-primary">
          Vlite3
        </span>
      </div>

      <!-- Right Action Items -->
      <div class="flex items-center gap-4 shrink-0">
        <!-- Tools box -->
        <div class="flex items-center gap-2">
          <ThemeToggle variant="ghost" />
          <a
            href="https://github.com/safdar-azeem/vlite3"
            target="_blank"
            rel="noopener noreferrer">
            <Button variant="ghost" icon="lucide:github" rounded="full" />
          </a>
        </div>

        <Button size="md" @click="router.push('/components/getting-started')">
          Start Building
          <Icon
            icon="lucide:chevron-right"
            class="w-4 h-4 ml-1 opacity-70 group-hover:opacity-100" />
        </Button>

        <Button
          variant="ghost"
          size="md"
          icon="lucide:menu"
          class="md:hidden rounded-full bg-muted/60 border border-border/50" />
      </div>
    </header>
  </div>
</template>
