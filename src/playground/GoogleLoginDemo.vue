<script setup lang="ts">
import { ref } from 'vue'
import DemoSection from './DemoSection.vue'
import GoogleLogin from '@/components/GoogleLogin.vue'
import Button from '@/components/Button.vue'

const clientId = 'YOUR_GOOGLE_CLIENT_ID_HERE'

const handleSuccess = (response: any) => {
  console.log('Login Success:', response)
  alert('Login successful! Check console for token details.')
}

const handleError = (error: any) => {
  console.error('Login Failed:', error)
  alert('Login failed. Check console for details.')
}
</script>

<template>
  <div class="max-w-3xl mx-auto space-y-10">
    <div>
      <h2 class="text-2xl font-bold mb-2">Google Login</h2>
      <p class="text-gray-500">
        A lightweight Google authentication component using vue3-google-login. Supports standard
        styling and complete slot overrides.
      </p>
    </div>

    <DemoSection
      title="Default Button"
      code="<GoogleLogin
  clientId='YOUR_CLIENT_ID'
  @success='handleSuccess'
  @error='handleError'
/>">
      <div class="max-w-sm">
        <GoogleLogin :clientId="clientId" @success="handleSuccess" @error="handleError" />
      </div>
    </DemoSection>

    <DemoSection
      title="Custom Slot Override"
      code="<GoogleLogin 
  clientId='YOUR_CLIENT_ID' 
  @success='handleSuccess' 
  @error='handleError'
>
  <template #default='{ login, loading, disabled }'>
    <Button
      variant='primary'
      :loading='loading'
      :disabled='disabled'
      @click='login'
      icon='lucide:log-in'
      class='w-full'
    >
      Custom Google Sign-in
    </Button>
  </template>
</GoogleLogin>">
      <div class="max-w-sm">
        <GoogleLogin :clientId="clientId" @success="handleSuccess" @error="handleError">
          <template #default="{ login, loading, disabled }">
            <Button
              variant="primary"
              :loading="loading"
              :disabled="disabled"
              @click="login"
              icon="lucide:log-in"
              class="w-full">
              Custom Google Sign-in
            </Button>
          </template>
        </GoogleLogin>
      </div>
    </DemoSection>
  </div>
</template>
