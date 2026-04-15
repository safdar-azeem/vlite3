<script setup lang="ts">
import { ref, onMounted, onUnmounted } from 'vue'
import { useRouter } from 'vue-router'
import Button from '@/components/Button.vue'
import Icon from '@/components/Icon.vue'
import ThemeToggle from '@/components/ThemeToggle.vue'

const router = useRouter()
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
  { label: 'Components', path: '/components/button' },
  { label: 'Documentation', path: '/components/getting-started' },
]
</script>

<template>
  <header
    class="sticky top-0 z-50 w-full transition-all duration-300"
    :class="[
      isScrolled
        ? 'bg-background/80 backdrop-blur-lg border-b border-border shadow-sm py-2'
        : 'bg-transparent border-b border-transparent py-4'
    ]"
  >
    <div class="max-w-7xl mx-auto px-6 lg:px-8 flex items-center justify-between">
      <div 
        class="flex items-center gap-3 cursor-pointer group" 
        @click="router.push('/')"
      >
        <div class="w-9 h-9 rounded-xl bg-gradient-to-br from-primary to-primary/80 text-primary-foreground flex items-center justify-center font-bold text-lg shadow-md group-hover:scale-105 transition-transform duration-300">
          V
        </div>
        <span class="font-extrabold text-xl tracking-tight text-foreground hidden sm:block">vlite3</span>
      </div>

      <nav class="hidden md:flex items-center gap-8 bg-muted/30 px-6 py-2 rounded-full border border-border/50 backdrop-blur-sm">
        <router-link
          v-for="item in navItems"
          :key="item.path"
          :to="item.path"
          class="text-sm font-semibold text-muted-foreground hover:text-foreground transition-colors"
        >
          {{ item.label }}
        </router-link>
      </nav>

      <div class="flex items-center gap-2 sm:gap-4">
        <ThemeToggle variant="ghost" rounded="full" />
        
        <a
          href="https://github.com/safdar-azeem/vlite3"
          target="_blank"
          rel="noopener noreferrer"
          class="text-muted-foreground hover:text-foreground transition-colors p-2 rounded-full hover:bg-muted"
        >
          <Icon icon="lucide:github" class="w-5 h-5" />
        </a>

        <Button 
          size="md" 
          class="hidden sm:flex rounded-full px-6 font-semibold shadow-md shadow-primary/20 hover:shadow-lg hover:shadow-primary/30 transition-all duration-300 hover:-translate-y-0.5" 
          @click="router.push('/components/getting-started')"
        >
          Get Started
        </Button>
        
        <Button variant="ghost" size="sm" icon="lucide:menu" class="md:hidden" rounded="full" />
      </div>
    </div>
  </header>
</template>
