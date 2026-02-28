<script setup lang="ts">
import { ref, computed } from 'vue'
import { useTokenClient } from 'vue3-google-signin'
import Button from '@/components/Button.vue'
import { $t } from '@/utils/i18n'

export interface GoogleLoginProps {
  buttonText?: string
  buttonTextI18n?: string
  btnClass?: string
  variant?: any
  size?: any
  rounded?: any
  disabled?: boolean
}

const props = withDefaults(defineProps<GoogleLoginProps>(), {
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

const displayButtonText = computed(() => {
  if (props.buttonTextI18n) return $t(props.buttonTextI18n)
  if (props.buttonText) return props.buttonText
  const res = $t('vlite.googleLogin.buttonText')
  return res !== 'vlite.googleLogin.buttonText' ? res : 'Sign in with Google'
})
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
        <span class="font-medium">{{ displayButtonText }}</span>
      </Button>
    </slot>
  </div>
</template>

