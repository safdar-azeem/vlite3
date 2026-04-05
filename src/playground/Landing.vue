<script setup lang="ts">
import Button from '@/components/Button.vue'
import { useRouter } from 'vue-router'

const router = useRouter()

const navigateToComponents = () => {
  router.push('/components/button')
}
</script>

<template>
  <div class="min-h-screen bg-background text-foreground flex flex-col font-sans">
    <!-- Navbar -->
    <header
      class="border-b border-border/40 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60 sticky top-0 z-50">
      <div class="container mx-auto px-6 h-16 flex items-center justify-between">
        <div class="flex items-center gap-3">
          <div
            class="w-8 h-8 rounded-lg bg-primary text-white flex items-center justify-center font-bold text-lg shadow-sm">
            V
          </div>
          <span class="font-bold text-xl tracking-tight">vlite3</span>
        </div>
        <div class="flex items-center gap-4">
          <a
            href="https://github.com/safdar-azeem/vlite3"
            target="_blank"
            class="text-sm font-medium text-muted-foreground hover:text-foreground transition-colors">
            GitHub
          </a>
          <Button
            @click="navigateToComponents"
            size="sm"
            class="rounded-full shadow-sm font-medium px-5">
            Components
          </Button>
        </div>
      </div>
    </header>

    <!-- Hero Section -->
    <main class="flex-1 flex flex-col items-center justify-center -mt-10 px-6">
      <div
        class="max-w-3xl text-center space-y-8 animate-in fade-in slide-in-from-bottom-8 duration-1000">
        <h1 class="text-5xl sm:text-7xl font-bold tracking-tight text-balance leading-tight">
          Build beautiful interfaces with
          <span class="text-primary relative inline-block"
            >vlite3
            <svg
              class="absolute w-full h-3 -bottom-1 left-0 text-primary/30"
              viewBox="0 0 100 10"
              preserveAspectRatio="none">
              <path d="M0 5 Q 50 10 100 5" stroke="currentColor" stroke-width="4" fill="none" />
            </svg>
          </span>
        </h1>

        <p class="text-xl sm:text-2xl text-muted-foreground max-w-2xl mx-auto leading-relaxed">
          A minimalistic, highly-usable Vue 3 UI component library built with Tailwind CSS. Designed
          to be clean, friendly, and deeply customizable.
        </p>

        <div class="flex items-center justify-center gap-4 pt-4">
          <Button
            @click="navigateToComponents"
            size="lg"
            class="rounded-full h-14 px-8 text-lg font-medium shadow-md hover:-translate-y-0.5 transition-transform">
            Get Started
          </Button>
          <Button
            variant="outline"
            size="lg"
            class="rounded-full h-14 px-8 text-lg font-medium border-border/60 hover:bg-muted/50 transition-colors">
            View Source
            <svg class="w-4 h-4 ml-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path
                stroke-linecap="round"
                stroke-linejoin="round"
                stroke-width="2"
                d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14"></path>
            </svg>
          </Button>
        </div>

        <div
          class="pt-16 grid grid-cols-2 md:grid-cols-4 gap-8 text-left border-t border-border/40 mt-16 text-sm">
          <div class="space-y-2">
            <div
              class="w-10 h-10 rounded-xl bg-primary/10 text-primary flex items-center justify-center mb-4">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="20"
                height="20"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                stroke-width="2"
                stroke-linecap="round"
                stroke-linejoin="round">
                <path d="M12 20a8 8 0 1 0 0-16 8 8 0 0 0 0 16Z" />
                <path d="M12 14a2 2 0 1 0 0-4 2 2 0 0 0 0 4Z" />
                <path d="M12 2v2" />
                <path d="M12 22v-2" />
                <path d="m17 20.66-1-1.73" />
                <path d="M11 10.27 7 3.34" />
                <path d="m20.66 17-1.73-1" />
                <path d="m3.34 7 1.73 1" />
                <path d="M14 12h8" />
                <path d="M2 12h2" />
                <path d="m20.66 7-1.73 1" />
                <path d="m3.34 17 1.73-1" />
                <path d="m17 3.34-1 1.73" />
                <path d="m11 13.73-4 6.93" />
              </svg>
            </div>
            <h3 class="font-semibold text-foreground text-base">Simplicity First</h3>
            <p class="text-muted-foreground leading-relaxed">
              Focus on what matters. Clutter-free components providing highest usability.
            </p>
          </div>
          <div class="space-y-2">
            <div
              class="w-10 h-10 rounded-xl bg-primary/10 text-primary flex items-center justify-center mb-4">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="20"
                height="20"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                stroke-width="2"
                stroke-linecap="round"
                stroke-linejoin="round">
                <rect width="18" height="18" x="3" y="3" rx="2" ry="2" />
                <line x1="3" x2="21" y1="9" y2="9" />
                <line x1="9" x2="9" y1="21" y2="9" />
              </svg>
            </div>
            <h3 class="font-semibold text-foreground text-base">Ample Whitespace</h3>
            <p class="text-muted-foreground leading-relaxed">
              Premium spacing structure allows your layout to breathe effortlessly.
            </p>
          </div>
          <div class="space-y-2">
            <div
              class="w-10 h-10 rounded-xl bg-primary/10 text-primary flex items-center justify-center mb-4">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="20"
                height="20"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                stroke-width="2"
                stroke-linecap="round"
                stroke-linejoin="round">
                <path d="M4 7V4h16v3" />
                <path d="M9 20h6" />
                <path d="M12 4v16" />
              </svg>
            </div>
            <h3 class="font-semibold text-foreground text-base">Legible Typography</h3>
            <p class="text-muted-foreground leading-relaxed">
              System-optimized fluid scale variables ready for the modern web.
            </p>
          </div>
          <div class="space-y-2">
            <div
              class="w-10 h-10 rounded-xl bg-primary/10 text-primary flex items-center justify-center mb-4">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="20"
                height="20"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                stroke-width="2"
                stroke-linecap="round"
                stroke-linejoin="round">
                <circle cx="13.5" cy="6.5" r=".5" />
                <circle cx="17.5" cy="10.5" r=".5" />
                <circle cx="8.5" cy="7.5" r=".5" />
                <circle cx="6.5" cy="12.5" r=".5" />
                <path
                  d="M12 2C6.5 2 2 6.5 2 12s4.5 10 10 10c.926 0 1.648-.746 1.648-1.688 0-.437-.18-.835-.437-1.125-.29-.289-.438-.652-.438-1.125a1.64 1.64 0 0 1 1.668-1.668h1.996c3.051 0 5.555-2.503 5.555-5.554C21.965 6.012 17.461 2 12 2z" />
              </svg>
            </div>
            <h3 class="font-semibold text-foreground text-base">Limited Color Palettes</h3>
            <p class="text-muted-foreground leading-relaxed">
              Semantic tokens designed to reduce visual clutter and fatigue.
            </p>
          </div>
        </div>
      </div>
    </main>
  </div>
</template>

<style scoped>
@keyframes fade-in {
  from {
    opacity: 0;
  }
  to {
    opacity: 1;
  }
}

@keyframes slide-in-from-bottom-8 {
  from {
    transform: translateY(2rem);
  }
  to {
    transform: translateY(0);
  }
}

.animate-in {
  animation-fill-mode: both;
}

.fade-in {
  animation-name: fade-in;
}

.slide-in-from-bottom-8 {
  animation-name: slide-in-from-bottom-8;
}

.duration-1000 {
  animation-duration: 1s;
}
</style>
