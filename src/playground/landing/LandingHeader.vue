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
  <!-- Floating Island Container -->
  <div 
    class="fixed top-0 inset-x-0 z-[100] flex justify-center pointer-events-none p-4 transition-transform duration-700 ease-out"
    :class="isScrolled ? 'translate-y-0' : 'translate-y-2'"
  >
    <header
      class="pointer-events-auto rounded-full transition-all duration-500 overflow-hidden relative group/header shadow-2xl"
      :class="[
        isScrolled
          ? 'w-[95%] sm:w-full max-w-5xl bg-background/85 backdrop-blur-2xl ring-1 ring-border/80 shadow-black/10 py-2.5 px-3 sm:px-4'
          : 'w-full max-w-6xl bg-card/60 backdrop-blur-xl ring-1 ring-border/40 shadow-black/5 py-4 px-4 sm:px-6'
      ]"
    >
      <!-- Subtle ambient glow matching the primary color -->
      <div 
        class="absolute inset-0 bg-gradient-to-r from-primary/0 via-primary/5 to-primary/0 opacity-0 group-hover/header:opacity-100 transition-opacity duration-700 pointer-events-none"
      ></div>

      <div class="flex items-center justify-between relative z-10 w-full">
        
        <!-- Logo Area -->
        <div 
          class="flex items-center gap-3 cursor-pointer shrink-0 pl-1 group/logo" 
          @click="router.push('/')"
        >
          <div class="w-10 h-10 rounded-full bg-foreground text-background flex items-center justify-center font-black text-lg shadow-[0_0_15px_rgba(0,0,0,0.1)] group-hover/logo:bg-primary transition-all duration-300">
            V
          </div>
          <span class="font-extrabold text-xl tracking-tight hidden lg:block text-foreground group-hover/logo:text-primary transition-colors">
            vlite3
          </span>
        </div>

        <!-- Magnet Navigation -->
        <nav class="hidden md:flex items-center p-1.5 rounded-full bg-muted/30 ring-1 ring-border/50">
          <router-link
            v-for="item in navItems"
            :key="item.path"
            :to="item.path"
            class="relative flex items-center gap-2 px-5 py-2 text-sm font-semibold rounded-full text-muted-foreground hover:text-foreground transition-all duration-300 group/link overflow-hidden"
            active-class="text-foreground shadow-sm bg-background ring-1 ring-border/40"
          >
            <Icon 
              :icon="item.icon" 
              class="w-4 h-4 transition-transform duration-300 group-hover/link:scale-110" 
              :class="route.path.includes(item.path) ? 'text-primary' : 'opacity-70'" 
            />
            <span class="relative z-10">{{ item.label }}</span>
            <div class="absolute inset-0 rounded-full bg-foreground/5 opacity-0 group-hover/link:opacity-100 transition-opacity duration-300"></div>
          </router-link>
        </nav>

        <!-- Right Action Items -->
        <div class="flex items-center gap-2 shrink-0">
          <!-- Tools box -->
          <div class="flex items-center gap-1 px-1.5 py-1.5 rounded-full bg-muted/40 ring-1 ring-border/50 hidden sm:flex">
            <ThemeToggle 
              variant="ghost" 
              class="w-8 h-8 rounded-full hover:bg-background/80 hover:shadow-sm transition-all" 
            />
            <a
              href="https://github.com/safdar-azeem/vlite3"
              target="_blank"
              rel="noopener noreferrer"
              class="w-8 h-8 flex items-center justify-center text-muted-foreground hover:text-foreground transition-all duration-300 rounded-full hover:bg-background/80 hover:shadow-sm"
            >
              <Icon icon="lucide:github" class="w-4 h-4" />
            </a>
          </div>

          <Button 
            size="md" 
            class="hidden sm:flex rounded-full px-6 font-bold tracking-wide shadow-lg hover:shadow-xl transition-all duration-300 bg-foreground text-background hover:bg-primary hover:text-primary-foreground group" 
            @click="router.push('/components/getting-started')"
          >
            Start Building
            <Icon icon="lucide:chevron-right" class="w-4 h-4 ml-1 opacity-70 group-hover:translate-x-1 group-hover:opacity-100 transition-all" />
          </Button>
          
          <Button variant="ghost" size="md" icon="lucide:menu" class="md:hidden rounded-full bg-muted/40 ring-1 ring-border/50" />
        </div>

      </div>
    </header>
  </div>
</template>
