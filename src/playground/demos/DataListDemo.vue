<script setup lang="ts">
import { ref, computed, onMounted } from 'vue'
import { DataList } from '@/components/DataList'
import DemoSection from '../DemoSection.vue'
import { useGetUsers } from '../composables/useGetUsers'
import CheckBox from '@/components/CheckBox.vue'
import Button from '@/components/Button.vue'
import Badge from '@/components/Badge.vue'
import Avatar from '@/components/Avatar.vue'
import sourceCode from './DataListDemo.vue?raw'

import UserCard from './DataListCards/UserCard.vue'
import UserSkeleton from './DataListCards/UserSkeleton.vue'

const { result, loading, refetch } = useGetUsers()

// Pagination state
const itemsPerPage = ref(8)
const currentPage = ref(1)

// Controls
const showStatus = ref(true)
const showDepartment = ref(true)
const showRole = ref(true)
const compactMode = ref(false)
const gridCols = ref<2 | 3 | 4>(3)

// Component-prop demo controls
const cardCols = ref<2 | 3>(2)
const showPaginationInfo = ref(true)

const gridClass = computed(() => {
  const cols: Record<number, string> = {
    2: 'grid grid-cols-1 sm:grid-cols-2 gap-5',
    3: 'grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5',
    4: 'grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5',
  }
  return cols[gridCols.value]
})

const cardGridClass = computed(() => {
  return cardCols.value === 2
    ? 'grid grid-cols-1 sm:grid-cols-2 gap-6'
    : 'grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6'
})

const stats = computed(() => {
  const users = result.value?.users || []
  const all = result.value?.pageInfo?.totalItems || 0
  return {
    all,
    active: users.filter((u) => u.status === 'active').length,
    inactive: users.filter((u) => u.status === 'inactive').length,
    pending: users.filter((u) => u.status === 'pending').length,
  }
})

const statusVariant = (status: string) => {
  const map: Record<string, 'success' | 'secondary' | 'warning'> = {
    active: 'success',
    inactive: 'secondary',
    pending: 'warning',
  }
  return map[status] || 'secondary'
}

const fetchData = (page = currentPage.value, limit = itemsPerPage.value) => {
  refetch({
    pagination: { page, limit },
    filter: { search: '' },
  })
}

onMounted(() => {
  fetchData()
})

const handleChange = (payload: { page: number; limit: number }) => {
  currentPage.value = payload.page
  itemsPerPage.value = payload.limit
  fetchData()
}
</script>

<template>
  <div class="space-y-10 pb-20">
    <!-- Page Header -->
    <div class="space-y-4">
      <div class="space-y-2">
        <div class="flex items-center gap-2 text-sm text-muted-foreground font-medium">
          <span>Components</span>
          <span class="text-muted-foreground/40">›</span>
          <span class="text-foreground">DataList</span>
        </div>
        <h2 class="text-3xl font-extrabold tracking-tight lg:text-4xl text-foreground">DataList</h2>
        <p class="text-lg text-muted-foreground max-w-[75ch]">
          A flexible grid and list component with built-in pagination, empty states, and loading
          skeletons. Supports both <strong class="text-foreground">slot-based</strong> and
          <strong class="text-foreground">prop-based</strong> component rendering.
        </p>
      </div>

      <!-- Stat Pills -->
      <div class="flex flex-wrap gap-3">
        <div
          class="flex items-center gap-2 px-3 py-1.5 rounded-lg bg-muted/40 border border-border/50 text-sm"
        >
          <span class="w-1.5 h-1.5 rounded-full bg-muted-foreground/60 inline-block"></span>
          <span class="text-muted-foreground">Total</span>
          <span class="font-semibold text-foreground ml-0.5">{{ stats.all }}</span>
        </div>
        <div
          class="flex items-center gap-2 px-3 py-1.5 rounded-lg bg-success/10 border border-success/20 text-sm"
        >
          <span class="w-1.5 h-1.5 rounded-full bg-success inline-block"></span>
          <span class="text-success/80">Active</span>
          <span class="font-semibold text-success ml-0.5">{{ stats.active }}</span>
        </div>
        <div
          class="flex items-center gap-2 px-3 py-1.5 rounded-lg bg-warning/10 border border-warning/20 text-sm"
        >
          <span class="w-1.5 h-1.5 rounded-full bg-warning inline-block"></span>
          <span class="text-warning/80">Pending</span>
          <span class="font-semibold text-warning ml-0.5">{{ stats.pending }}</span>
        </div>
        <div
          class="flex items-center gap-2 px-3 py-1.5 rounded-lg bg-muted/40 border border-border/50 text-sm"
        >
          <span class="w-1.5 h-1.5 rounded-full bg-muted-foreground/50 inline-block"></span>
          <span class="text-muted-foreground">Inactive</span>
          <span class="font-semibold text-foreground ml-0.5">{{ stats.inactive }}</span>
        </div>
      </div>
    </div>

    <!-- ===================== -->
    <!-- SECTION 1: Slot-based -->
    <!-- ===================== -->

    <!-- Slot-based Controls -->
    <div class="space-y-3">
      <h3 class="text-base font-semibold text-foreground">Slot-based Rendering</h3>
      <p class="text-sm text-muted-foreground max-w-[65ch]">
        Render items and skeletons seamlessly using Vue templates. Ideal for quick layouts without
        creating separate components. Toggle the controls below to customize live.
      </p>

      <div
        class="grid grid-cols-1 md:grid-cols-2 gap-4 bg-muted/20 border border-border/40 rounded-xl p-5"
      >
        <!-- Checkboxes -->
        <div class="space-y-1">
          <span class="text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-3 block">Display Options</span>
          <div class="grid grid-cols-2 gap-3">
            <CheckBox v-model="showStatus" label="Show Status" />
            <CheckBox v-model="showDepartment" label="Show Department" />
            <CheckBox v-model="showRole" label="Show Role" />
            <CheckBox v-model="compactMode" label="Compact Mode" />
          </div>
        </div>

        <!-- Layout -->
        <div class="space-y-1">
          <span class="text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-3 block">Grid Columns</span>
          <div class="flex items-center gap-2">
            <Button
              size="sm"
              :variant="gridCols === 2 ? 'primary' : 'outline'"
              @click="gridCols = 2"
            >
              2 Cols
            </Button>
            <Button
              size="sm"
              :variant="gridCols === 3 ? 'primary' : 'outline'"
              @click="gridCols = 3"
            >
              3 Cols
            </Button>
            <Button
              size="sm"
              :variant="gridCols === 4 ? 'primary' : 'outline'"
              @click="gridCols = 4"
            >
              4 Cols
            </Button>
          </div>
        </div>
      </div>
    </div>

    <DemoSection title="Slot-based Rendering" :code="sourceCode" align="stretch">
      <DataList
        :data="result?.users"
        :loading="loading"
        :page-info="result?.pageInfo"
        :class-name="gridClass"
        @change="handleChange"
      >
        <template #skeleton>
          <div
            class="bg-card border border-border rounded-xl shadow-sm animate-pulse"
            :class="compactMode ? 'p-3 h-[72px]' : 'p-5 h-[130px]'"
          >
            <div class="flex items-center gap-3">
              <div
                class="rounded-full bg-muted shrink-0"
                :class="compactMode ? 'w-8 h-8' : 'w-11 h-11'"
              ></div>
              <div class="flex flex-col gap-2 flex-1">
                <div class="h-3.5 bg-muted rounded w-3/4"></div>
                <div class="h-2.5 bg-muted rounded w-1/2"></div>
              </div>
            </div>
            <div v-if="!compactMode" class="flex justify-between mt-4 pt-3 border-t border-border/60">
              <div class="h-2.5 bg-muted rounded w-1/3"></div>
              <div class="h-4 bg-muted rounded-full w-14"></div>
            </div>
          </div>
        </template>

        <template #item="{ item }">
          <div
            class="bg-card border border-border rounded-xl shadow-sm hover:shadow-md hover:border-primary/40 transition-all duration-200 group flex flex-col"
            :class="compactMode ? 'p-3 gap-2' : 'p-5 gap-4'"
          >
            <div class="flex items-center gap-3">
              <Avatar
                :src="`https://i.pravatar.cc/150?u=${item._id}`"
                :alt="item.name"
                :size="compactMode ? 'sm' : 'md'"
                class="group-hover:scale-105 transition-transform duration-200 shrink-0"
              />
              <div class="min-w-0 flex-1">
                <h3 class="font-semibold text-foreground truncate" :class="compactMode ? 'text-sm' : 'text-base'">
                  {{ item.name }}
                </h3>
                <p class="text-xs text-muted-foreground truncate">{{ item.email }}</p>
              </div>
              <Badge
                v-if="showStatus && compactMode"
                :variant="statusVariant(item.status)"
                class="shrink-0 text-xs"
              >
                {{ item.status }}
              </Badge>
            </div>

            <div
              v-if="!compactMode"
              class="flex items-center justify-between pt-3 border-t border-border/60 mt-auto"
            >
              <div class="flex flex-col gap-0.5 min-w-0">
                <span v-if="showRole" class="text-xs font-medium text-foreground truncate">
                  {{ item.role }}
                </span>
                <span v-if="showDepartment" class="text-xs text-muted-foreground truncate">
                  {{ item.department }}
                </span>
              </div>
              <Badge v-if="showStatus" :variant="statusVariant(item.status)" class="shrink-0">
                {{ item.status }}
              </Badge>
            </div>
          </div>
        </template>
      </DataList>
    </DemoSection>

    <!-- ======================== -->
    <!-- SECTION 2: Component-prop -->
    <!-- ======================== -->

    <div class="space-y-3">
      <h3 class="text-base font-semibold text-foreground">Component Prop-based Rendering</h3>
      <p class="text-sm text-muted-foreground max-w-[65ch]">
        Pass entire Vue components to <code class="text-xs bg-muted px-1 py-0.5 rounded">:item</code> and
        <code class="text-xs bg-muted px-1 py-0.5 rounded">:skeleton</code> props for cleaner templates
        and highly reusable architecture. Perfect for design systems and component libraries.
      </p>

      <div
        class="flex flex-wrap items-center gap-4 bg-muted/20 border border-border/40 rounded-xl p-5"
      >
        <div class="space-y-1">
          <span class="text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-3 block">Card Columns</span>
          <div class="flex gap-2">
            <Button
              size="sm"
              :variant="cardCols === 2 ? 'primary' : 'outline'"
              @click="cardCols = 2"
            >
              2 Cols
            </Button>
            <Button
              size="sm"
              :variant="cardCols === 3 ? 'primary' : 'outline'"
              @click="cardCols = 3"
            >
              3 Cols
            </Button>
          </div>
        </div>
        <div class="space-y-1">
          <span class="text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-3 block">Pagination</span>
          <CheckBox v-model="showPaginationInfo" label="Show items per page" />
        </div>
      </div>
    </div>

    <DemoSection title="Component Prop-based Rendering" :code="sourceCode" align="stretch">
      <DataList
        :data="result?.users"
        :loading="loading"
        :page-info="result?.pageInfo"
        :item="UserCard"
        :skeleton="UserSkeleton"
        :class-name="cardGridClass"
        :pagination-props="{
          alignment: 'between',
          showItemsPerPage: showPaginationInfo,
        }"
        @change="handleChange"
      />
    </DemoSection>
  </div>
</template>
