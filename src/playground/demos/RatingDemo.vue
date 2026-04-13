<script setup lang="ts">
import { ref } from 'vue'
import DemoSection from '../DemoSection.vue'
import { Rating, ReviewSummary } from '@/components/Rating'
import Button from '@/components/Button.vue'
import Textarea from '@/components/Textarea.vue'

const basicRating = ref(0)
const halfRating = ref(2.5)
const decimalRating = ref(4.3)
const textRating = ref(0)
const heartRating = ref(0)
const emojiRating = ref(0)
const outlineRating = ref(3)

const emojiIcons = [
  'lucide:angry',
  'lucide:frown',
  'lucide:meh',
  'lucide:smile',
  'lucide:laugh'
]

const reviewForm = ref({ rating: 0, feedback: '', submitted: false })
const handleReviewSubmit = () => {
  if (reviewForm.value.rating > 0) reviewForm.value.submitted = true
}

const distribution = [
  { rating: 5, percentage: 65, count: 185 },
  { rating: 4, percentage: 20, count: 57 },
  { rating: 3, percentage: 10, count: 28 },
  { rating: 2, percentage: 3, count: 9 },
  { rating: 1, percentage: 2, count: 6 },
]

const codeBasic = `<Rating v-model="rating" clearable />`

const codeHalf = `<Rating v-model="rating" allow-half />`

const codeDecimals = `<Rating :model-value="4.3" allow-half readonly show-text />`

const codeText = `<Rating v-model="rating" show-text />`

const codeSolid = `<div class="flex flex-col gap-4">
  <div class="flex items-center gap-4">
    <span class="text-sm w-16">Solid</span>
    <Rating v-model="rating" solid />
  </div>
  <div class="flex items-center gap-4">
    <span class="text-sm w-16">Outline</span>
    <Rating v-model="rating" :solid="false" />
  </div>
</div>`

const codeHeart = `<Rating 
  v-model="rating" 
  icon="lucide:heart" 
  active-icon="lucide:heart"
  active-color="text-rose-500 fill-rose-500" 
/>`

const codeEmoji = `<script setup>
const emojis = ['lucide:angry', 'lucide:frown', 'lucide:meh', 'lucide:smile', 'lucide:laugh']
<\/script>

<template>
  <Rating 
    v-model="rating" 
    :icon="emojis" 
    :active-icon="emojis"
    active-color="text-yellow-400 fill-current" 
    size="xl"
  />
</template>`

const codeSizes = `<Rating v-model="rating" size="sm" />
<Rating v-model="rating" size="md" />
<Rating v-model="rating" size="lg" />
<Rating v-model="rating" size="xl" />`

const codeSummary = `<script setup>
const distribution = [
  { rating: 5, percentage: 65, count: 185 },
  { rating: 4, percentage: 20, count: 57 },
  { rating: 3, percentage: 10, count: 28 },
  { rating: 2, percentage: 3, count: 9 },
  { rating: 1, percentage: 2, count: 6 },
]
<\/script>

<template>
  <ReviewSummary :rating-distribution="distribution" />
</template>`

const codeForm = `<div class="max-w-md border rounded-xl p-6 space-y-4">
  <div class="space-y-1">
    <h3 class="font-semibold text-lg">Leave a review</h3>
    <p class="text-sm text-muted-foreground">Share your experience with others.</p>
  </div>
  
  <div class="space-y-4">
    <div class="flex items-center gap-4">
      <span class="text-sm font-medium">Your Rating</span>
      <Rating v-model="form.rating" size="lg" />
    </div>
    
    <Textarea v-model="form.feedback" placeholder="Write your feedback..." />
    <Button @click="submit">Submit Review</Button>
  </div>
</div>`
</script>

<template>
  <div class="space-y-6">
    <div class="flex flex-col gap-2">
      <h1 class="text-2xl font-bold tracking-tight">Rating</h1>
      <p class="text-muted-foreground text-sm">
        Display ratings, allow user feedback, and show review distributions.
      </p>
    </div>

    <!-- 1. Basic -->
    <DemoSection title="Standard Star Rating" :code="codeBasic">
      <Rating v-model="basicRating" clearable />
      <div class="mt-4 text-sm text-muted-foreground">Current Value: {{ basicRating }}</div>
    </DemoSection>
    
    <!-- 2. Half-Stars -->
    <DemoSection title="Interactive Half-Star" :code="codeHalf">
      <Rating v-model="halfRating" allow-half />
      <div class="mt-4 text-sm text-muted-foreground">Current Value: {{ halfRating }}</div>
    </DemoSection>
    
    <!-- 3. Readonly / Decimals -->
    <DemoSection title="Decimal & Readonly Mode" :code="codeDecimals">
      <Rating :model-value="decimalRating" allow-half readonly show-text />
    </DemoSection>
    
    <!-- 4. Text Display -->
    <DemoSection title="With Value Text" :code="codeText">
      <Rating v-model="textRating" show-text />
    </DemoSection>

    <!-- 4.5. Solid vs Outline -->
    <DemoSection title="Solid vs Outline Styles" :code="codeSolid">
      <div class="flex flex-col gap-4">
        <div class="flex items-center gap-4">
          <span class="text-sm w-16">Solid</span>
          <Rating v-model="outlineRating" solid />
        </div>
        <div class="flex items-center gap-4">
          <span class="text-sm w-16">Outline</span>
          <Rating v-model="outlineRating" :solid="false" />
        </div>
      </div>
    </DemoSection>
    
    <!-- 5. Heart custom icon -->
    <DemoSection title="Custom Icons (Hearts)" :code="codeHeart">
      <Rating 
        v-model="heartRating" 
        icon="lucide:heart" 
        active-icon="lucide:heart"
        active-color="text-rose-500 fill-rose-500" 
      />
    </DemoSection>
    
    <!-- 6. Emojis -->
    <DemoSection title="Emoji Reaction Scale" :code="codeEmoji">
      <Rating 
        v-model="emojiRating" 
        :icon="emojiIcons" 
        :active-icon="emojiIcons"
        active-color="text-yellow-400" 
        inactive-color="text-muted-foreground/30"
        size="xl"
      />
    </DemoSection>
    
    <!-- 7. Sizes -->
    <DemoSection title="Size Variations" :code="codeSizes">
      <div class="flex flex-col gap-4 items-center">
        <Rating v-model="basicRating" size="sm" />
        <Rating v-model="basicRating" size="md" />
        <Rating v-model="basicRating" size="lg" />
        <Rating v-model="basicRating" size="xl" />
      </div>
    </DemoSection>
    
    <!-- 8. Review Summary -->
    <DemoSection title="Review Summary / Progress Bars" :code="codeSummary" align="start">
      <div class="w-full max-w-2xl bg-card border rounded-xl overflow-hidden p-6 md:p-8">
        <h3 class="text-xl font-bold mb-6">Customer Reviews</h3>
        <ReviewSummary :rating-distribution="distribution" />
      </div>
    </DemoSection>
    
    <!-- 9. Form -->
    <DemoSection title="Review Form" :code="codeForm" align="start" class="items-start">
      <div class="w-full max-w-lg bg-card border border-border shadow-sm rounded-xl p-6 m-auto">
        <div v-if="reviewForm.submitted" class="flex flex-col items-center justify-center p-6 text-center space-y-4">
          <div class="w-12 h-12 bg-success/10 rounded-full flex items-center justify-center text-success">
            <svg class="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7" />
            </svg>
          </div>
          <h3 class="text-xl font-bold">Review Submitted!</h3>
          <p class="text-muted-foreground">Thank you for your feedback.</p>
          <Button variant="outline" @click="reviewForm.submitted = false; reviewForm.rating = 0; reviewForm.feedback = ''">Write another</Button>
        </div>
        
        <div v-else class="space-y-6">
          <div class="space-y-1">
            <h3 class="font-semibold text-lg">Leave a review</h3>
            <p class="text-sm text-muted-foreground">Share your experience with others.</p>
          </div>
          
          <div class="space-y-4">
            <div class="flex flex-col gap-2">
              <label class="text-sm font-medium">Your Rating <span class="text-destructive">*</span></label>
              <Rating v-model="reviewForm.rating" size="xl" clearable />
            </div>
            
            <div class="flex flex-col gap-2">
              <label class="text-sm font-medium">Your Feedback</label>
              <Textarea v-model="reviewForm.feedback" placeholder="What did you like or dislike?" rows="4" />
            </div>
            
            <Button 
              class="w-full" 
              @click="handleReviewSubmit"
              :disabled="reviewForm.rating === 0"
            >
              Submit Review
            </Button>
          </div>
        </div>
      </div>
    </DemoSection>
  </div>
</template>
