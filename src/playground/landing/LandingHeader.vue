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
    class="sticky top-0 z-[100] flex justify-center pointer-events-none w-full"
    :class="isScrolled ? 'pt-4 pb-2 px-2 sm:px-4' : 'pt-6 pb-4 px-4 sm:px-6'"
  >
    <header
      class="pointer-events-auto rounded-full relative flex items-center justify-between w-full"
      :class="[
        isScrolled
          ? 'max-w-5xl bg-background border border-border py-2.5 px-3 sm:px-4'
          : 'max-w-6xl bg-card border border-border/30 py-4 px-4 sm:px-6'
      ]"
    >
      
      <!-- Logo Area -->
      <div 
        class="flex items-center gap-3 cursor-pointer shrink-0 pl-1 group/logo" 
        @click="router.push('/')"
      >
        <div class="w-10 h-10 rounded-full bg-foreground text-background flex items-center justify-center font-black text-lg hover:bg-primary">
          V
        </div>
        <span class="font-extrabold text-xl tracking-tight hidden lg:block text-foreground hover:text-primary">
          vlite3
        </span>
      </div>

      <!-- Magnet Navigation -->
      <nav class="hidden md:flex items-center p-1.5 rounded-full bg-muted/50 border border-border/50">
        <router-link
          v-for="item in navItems"
          :key="item.path"
          :to="item.path"
          class="relative flex items-center gap-2 px-5 py-2 text-sm font-semibold rounded-full text-muted-foreground hover:text-foreground group/link overflow-hidden"
          active-class="text-foreground bg-background border border-border/50"
        >
          <Icon 
            :icon="item.icon" 
            class="w-4 h-4" 
            :class="route.path.includes(item.path) ? 'text-primary' : 'opacity-70'" 
          />
          <span class="relative z-10">{{ item.label }}</span>
          <div class="absolute inset-0 rounded-full bg-foreground/5 opacity-0 group-hover/link:opacity-100"></div>
        </router-link>
      </nav>

      <!-- Right Action Items -->
      <div class="flex items-center gap-2 shrink-0">
        <!-- Tools box -->
        <div class="flex items-center gap-1 px-1.5 py-1.5 rounded-full bg-muted/60 border border-border/50 hidden sm:flex">
          <ThemeToggle 
            variant="ghost" 
            class="w-8 h-8 rounded-full hover:bg-background" 
          />
          <a
            href="https://github.com/safdar-azeem/vlite3"
            target="_blank"
            rel="noopener noreferrer"
            class="w-8 h-8 flex items-center justify-center text-muted-foreground hover:text-foreground rounded-full hover:bg-background"
          >
            <Icon icon="lucide:github" class="w-4 h-4" />
          </a>
        </div>

        <Button 
          size="md" 
          class="hidden sm:flex rounded-full px-6 font-bold tracking-wide bg-foreground text-background hover:bg-primary hover:text-primary-foreground group" 
          @click="router.push('/components/getting-started')"
        >
          Start Building
          <Icon icon="lucide:chevron-right" class="w-4 h-4 ml-1 opacity-70 group-hover:opacity-100" />
        </Button>
        
        <Button variant="ghost" size="md" icon="lucide:menu" class="md:hidden rounded-full bg-muted/60 border border-border/50" />
      </div>
    </header>
  </div>
</template>
