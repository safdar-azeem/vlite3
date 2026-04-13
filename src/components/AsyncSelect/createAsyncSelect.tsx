import { defineComponent, ref, computed, watch, nextTick, PropType } from 'vue'
import { Dropdown } from '../Dropdown'
import { MultiSelect } from '../MultiSelect'

export interface SelectOption<T = unknown> {
	label: string
	value: string | number
	subtitle?: string
	description?: string
	icon?: string
	data?: T
}

export type OptionsMapper<T> = (item: T) => SelectOption<T> | null | undefined

export interface CreateSelectConfig<T = any> {
	name: string
	useQuery: any
	queryName: string
	labelKey?: keyof T | ((item: T) => string)
	subtitleKey?: keyof T | ((item: T) => string)
	descriptionKey?: keyof T | ((item: T) => string)
	valueKey?: keyof T
	iconKey?: keyof T | ((item: T) => string)
	searchable?: boolean
	remote?: boolean
	multiple?: boolean
	optionsMapper?: OptionsMapper<T>
}

export const createAsyncSelect = <T extends { id?: string | number }>(
	config: CreateSelectConfig<T>,
) => {
	return defineComponent({
		name: config.name,
		inheritAttrs: false,
		props: {
			value: { type: [String, Array, Number, Object, Boolean] },
			modelValue: { type: [String, Array, Number, Object, Boolean] },
			multiple: { type: Boolean, default: config.multiple || false },
			placeholder: { type: String, default: 'Select...' },
			filter: { type: Object, default: () => ({}) },
			disabled: { type: Boolean, default: false },
			optionsMapper: { type: Function as PropType<OptionsMapper<T>> },
		},
		emits: ['onChange', 'update:modelValue', 'change'],
		setup(props, { attrs, emit }) {
			const items = ref<any[]>([])
			const page = ref(1)
			const search = ref('')
			const limit = 20

			const internalValue = computed(() => {
				return props.value !== undefined
					? props.value
					: props.modelValue
			})

			const activeMapper = computed(
				() => props.optionsMapper || config.optionsMapper,
			)

			const variables = computed(() => ({
				pagination: { page: page.value, limit },
				search: search.value || undefined,
				filter: { ...props.filter },
			}))

			const { result, loading, refetch } = config.useQuery(variables, {
				notifyOnNetworkStatusChange: true,
				fetchPolicy: 'cache-and-network',
			})

			const hasMore = computed(() => {
				const pageInfo = result.value?.[config.queryName]?.pageInfo
				return pageInfo
					? pageInfo.currentPage < pageInfo.totalPages
					: false
			})

			watch(
				() => result.value?.[config.queryName],
				(rawData) => {
					if (!rawData) return
					const newItems = Array.isArray(rawData)
						? rawData
						: rawData.items
					if (!newItems) return

					if (page.value === 1) {
						items.value = [...newItems]
					} else {
						const existingIds = new Set(
							items.value.map((i) => i.id),
						)
						const uniqueNew = newItems.filter(
							(i: any) => !existingIds.has(i.id),
						)
						items.value.push(...uniqueNew)
					}
				},
				{ immediate: true },
			)

			const mapItem = (item: any) => {
				if (activeMapper.value) {
					return activeMapper.value(item)
				}

				const label =
					typeof config.labelKey === 'function'
						? config.labelKey(item)
						: item[config.labelKey || 'name']

				const subtitle =
					typeof config.subtitleKey === 'function'
						? config.subtitleKey(item)
						: item[config.subtitleKey || '']

				const description =
					typeof config.descriptionKey === 'function'
						? config.descriptionKey(item)
						: item[config.descriptionKey || '']

				const icon = config.iconKey
					? typeof config.iconKey === 'function'
						? config.iconKey(item)
						: item[config.iconKey]
					: undefined

				return {
					label,
					subtitle: subtitle || undefined,
					description: description || undefined,
					value: item[config.valueKey || 'id'],
					icon: icon || undefined,
					data: item,
				}
			}

			const options = computed(
				() => items.value.map(mapItem).filter(Boolean) as any[],
			)

			const handleChange = (val: any, rawData?: any) => {
				let payloadData = rawData
				// If multiple is true, map the array of IDs back to their full data objects securely
				if (props.multiple && Array.isArray(val)) {
					payloadData = val
						.map((id) => {
							const found = options.value.find(
								(o) => o.value === id,
							)
							return found ? found.data : null
						})
						.filter(Boolean)
				}
				const payload = { value: val, data: payloadData }
				emit('update:modelValue', val)
				emit('change', payload)
				emit('onChange', payload)
			}

			const onSearch = (query: string) => {
				search.value = query
				page.value = 1
			}

			const onLoadMore = () => {
				if (!hasMore.value || loading.value) return
				page.value++
			}

			const fetchSelected = async (ids: any[]) => {
				const validIds = (Array.isArray(ids) ? ids : [ids]).filter(
					(id) =>
						(typeof id === 'string' || typeof id === 'number') &&
						id !== '',
				)

				if (validIds.length === 0) return []

				await nextTick()

				const currentValues = new Set(
					options.value.map((o: any) => o.value),
				)
				const missingIds = validIds.filter(
					(id) => !currentValues.has(id),
				)

				if (missingIds.length === 0) return []

				try {
					const { data } = await refetch({
						pagination: { page: 1, limit: missingIds.length },
						filter: { ...props.filter, ids: missingIds },
					})
					const rawData = data?.[config.queryName]
					const list = Array.isArray(rawData)
						? rawData
						: rawData?.items || []
					return list.map(mapItem).filter(Boolean) as any[]
				} catch (e) {
					console.error(`[${config.name}] Hydration failed`, e)
					return []
				}
			}

			return () => {
				const sharedProps = {
					options: options.value,
					loading: loading.value,
					searchable: config.searchable ?? true,
					remote: config.remote ?? true,
					hasMore: hasMore.value,
					placeholder: props.placeholder,
					disabled: props.disabled,
					fetchSelected,
					onSearch,
					onLoadMore,
					...attrs,
				}

				if (props.multiple) {
					return (
						<MultiSelect
							{...sharedProps}
							modelValue={internalValue.value as any[]}
							onUpdate:modelValue={(val: any) =>
								handleChange(val)
							}
							onChange={(val: any) => handleChange(val)}
						/>
					)
				}

				return (
					<Dropdown
						{...sharedProps}
						showSelectedIcon={true}
						emptyMessage='Data not found'
						modelValue={internalValue.value}
						onOnSelect={(payload: any) =>
							handleChange(payload.value, payload.data)
						}
					/>
				)
			}
		},
	})
}
