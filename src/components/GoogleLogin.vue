<script setup lang="ts">
import { ref } from 'vue'
import { useTokenClient } from 'vue3-google-signin'
import Button from '@/components/Button.vue'

export interface GoogleLoginProps {
  buttonText?: string
  btnClass?: string
  variant?: any
  size?: any
  rounded?: any
  disabled?: boolean
}

const props = withDefaults(defineProps<GoogleLoginProps>(), {
  buttonText: 'Sign in with Google',
  variant: 'outline',
  size: 'md',
  rounded: 'md',
  disabled: false,
})

const emit = defineEmits<{
  (e: 'success', response: any): void
  (e: 'error', error: any): void
}>()

const isLoading = ref(false)

const { login, isReady } = useTokenClient({
  onSuccess: (response) => {
    isLoading.value = false
    emit('success', response)
  },
  onError: (error) => {
    isLoading.value = false
    emit('error', error)
  },
})

const triggerLogin = () => {
  if (props.disabled || isLoading.value) return
  isLoading.value = true

  try {
    login()
  } catch (error) {
    isLoading.value = false
    emit('error', error)
  }
}
</script>

<template>
  <div class="google-login-wrapper inline-block w-full">
    <slot :login="triggerLogin" :loading="isLoading" :disabled="disabled">
      <Button
        :variant="variant"
        :size="size"
        :rounded="rounded"
        :disabled="!isReady || disabled || isLoading"
        :loading="isLoading"
        :class="btnClass"
        icon="flat-color-icons:google"
        @click="triggerLogin"
        class="w-full">
        <span class="font-medium">{{ buttonText }}</span>
      </Button>
    </slot>
  </div>
</template>
