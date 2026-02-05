import { ref, watch, type Ref } from 'vue'
import type { TableFilter, PageInfo } from '@/components/DataTable/types'

export interface User {
	_id: string
	name: string
	email: string
	avatar: string
	status: 'active' | 'inactive' | 'pending'
	role: string
	department: string
	joinDate: string
	salary: number
}

export interface UseGetUsersResult {
	result: Ref<{ users: User[]; pageInfo: PageInfo } | null>
	loading: Ref<boolean>
	refetch: (filter?: TableFilter) => Promise<void>
}

const mockUsers: User[] = [
	{
		_id: '1',
		name: 'John Doe',
		email: 'john.doe@example.com',
		avatar: 'https://i.pravatar.cc/150?u=1',
		status: 'active',
		role: 'Admin',
		department: 'Engineering',
		joinDate: '2023-01-15',
		salary: 85000,
	},
	{
		_id: '2',
		name: 'Jane Smith',
		email: 'jane.smith@example.com',
		avatar: 'https://i.pravatar.cc/150?u=2',
		status: 'active',
		role: 'Developer',
		department: 'Engineering',
		joinDate: '2023-02-20',
		salary: 75000,
	},
	{
		_id: '3',
		name: 'Bob Johnson',
		email: 'bob.johnson@example.com',
		avatar: 'https://i.pravatar.cc/150?u=3',
		status: 'inactive',
		role: 'Designer',
		department: 'Design',
		joinDate: '2022-11-10',
		salary: 70000,
	},
	{
		_id: '4',
		name: 'Alice Brown',
		email: 'alice.brown@example.com',
		avatar: 'https://i.pravatar.cc/150?u=4',
		status: 'active',
		role: 'Manager',
		department: 'Management',
		joinDate: '2022-08-05',
		salary: 95000,
	},
	{
		_id: '5',
		name: 'Charlie Wilson',
		email: 'charlie.wilson@example.com',
		avatar: 'https://i.pravatar.cc/150?u=5',
		status: 'pending',
		role: 'Developer',
		department: 'Engineering',
		joinDate: '2024-01-02',
		salary: 72000,
	},
	{
		_id: '6',
		name: 'Diana Miller',
		email: 'diana.miller@example.com',
		avatar: 'https://i.pravatar.cc/150?u=6',
		status: 'active',
		role: 'Developer',
		department: 'Engineering',
		joinDate: '2023-06-18',
		salary: 78000,
	},
	{
		_id: '7',
		name: 'Edward Davis',
		email: 'edward.davis@example.com',
		avatar: 'https://i.pravatar.cc/150?u=7',
		status: 'active',
		role: 'Designer',
		department: 'Design',
		joinDate: '2023-03-25',
		salary: 68000,
	},
	{
		_id: '8',
		name: 'Fiona Garcia',
		email: 'fiona.garcia@example.com',
		avatar: 'https://i.pravatar.cc/150?u=8',
		status: 'inactive',
		role: 'HR',
		department: 'Human Resources',
		joinDate: '2022-05-12',
		salary: 62000,
	},
	{
		_id: '9',
		name: 'George Martinez',
		email: 'george.martinez@example.com',
		avatar: 'https://i.pravatar.cc/150?u=9',
		status: 'active',
		role: 'Developer',
		department: 'Engineering',
		joinDate: '2023-09-08',
		salary: 80000,
	},
	{
		_id: '10',
		name: 'Hannah Anderson',
		email: 'hannah.anderson@example.com',
		avatar: 'https://i.pravatar.cc/150?u=10',
		status: 'active',
		role: 'Marketing',
		department: 'Marketing',
		joinDate: '2023-04-14',
		salary: 65000,
	},
	{
		_id: '11',
		name: 'Ian Thomas',
		email: 'ian.thomas@example.com',
		avatar: 'https://i.pravatar.cc/150?u=11',
		status: 'pending',
		role: 'Developer',
		department: 'Engineering',
		joinDate: '2024-01-10',
		salary: 71000,
	},
	{
		_id: '12',
		name: 'Julia Jackson',
		email: 'julia.jackson@example.com',
		avatar: 'https://i.pravatar.cc/150?u=12',
		status: 'active',
		role: 'Designer',
		department: 'Design',
		joinDate: '2023-07-22',
		salary: 69000,
	},
	{
		_id: '13',
		name: 'Kevin White',
		email: 'kevin.white@example.com',
		avatar: 'https://i.pravatar.cc/150?u=13',
		status: 'active',
		role: 'Developer',
		department: 'Engineering',
		joinDate: '2022-12-01',
		salary: 82000,
	},
	{
		_id: '14',
		name: 'Laura Harris',
		email: 'laura.harris@example.com',
		avatar: 'https://i.pravatar.cc/150?u=14',
		status: 'inactive',
		role: 'Manager',
		department: 'Management',
		joinDate: '2022-03-20',
		salary: 92000,
	},
	{
		_id: '15',
		name: 'Michael Clark',
		email: 'michael.clark@example.com',
		avatar: 'https://i.pravatar.cc/150?u=15',
		status: 'active',
		role: 'Developer',
		department: 'Engineering',
		joinDate: '2023-08-30',
		salary: 77000,
	},
	{
		_id: '16',
		name: 'Nancy Lewis',
		email: 'nancy.lewis@example.com',
		avatar: 'https://i.pravatar.cc/150?u=16',
		status: 'active',
		role: 'HR',
		department: 'Human Resources',
		joinDate: '2023-02-14',
		salary: 64000,
	},
	{
		_id: '17',
		name: 'Oscar Robinson',
		email: 'oscar.robinson@example.com',
		avatar: 'https://i.pravatar.cc/150?u=17',
		status: 'pending',
		role: 'Developer',
		department: 'Engineering',
		joinDate: '2024-01-18',
		salary: 73000,
	},
	{
		_id: '18',
		name: 'Patricia Walker',
		email: 'patricia.walker@example.com',
		avatar: 'https://i.pravatar.cc/150?u=18',
		status: 'active',
		role: 'Marketing',
		department: 'Marketing',
		joinDate: '2023-05-05',
		salary: 66000,
	},
	{
		_id: '19',
		name: 'Quentin Hall',
		email: 'quentin.hall@example.com',
		avatar: 'https://i.pravatar.cc/150?u=19',
		status: 'active',
		role: 'Designer',
		department: 'Design',
		joinDate: '2023-10-12',
		salary: 71000,
	},
	{
		_id: '20',
		name: 'Rachel Allen',
		email: 'rachel.allen@example.com',
		avatar: 'https://i.pravatar.cc/150?u=20',
		status: 'inactive',
		role: 'Developer',
		department: 'Engineering',
		joinDate: '2022-09-28',
		salary: 76000,
	},
	{
		_id: '21',
		name: 'Samuel Young',
		email: 'samuel.young@example.com',
		avatar: 'https://i.pravatar.cc/150?u=21',
		status: 'active',
		role: 'Admin',
		department: 'IT',
		joinDate: '2023-01-08',
		salary: 88000,
	},
	{
		_id: '22',
		name: 'Tina King',
		email: 'tina.king@example.com',
		avatar: 'https://i.pravatar.cc/150?u=22',
		status: 'active',
		role: 'Developer',
		department: 'Engineering',
		joinDate: '2023-11-20',
		salary: 79000,
	},
	{
		_id: '23',
		name: 'Ulysses Wright',
		email: 'ulysses.wright@example.com',
		avatar: 'https://i.pravatar.cc/150?u=23',
		status: 'pending',
		role: 'HR',
		department: 'Human Resources',
		joinDate: '2024-01-05',
		salary: 61000,
	},
	{
		_id: '24',
		name: 'Victoria Scott',
		email: 'victoria.scott@example.com',
		avatar: 'https://i.pravatar.cc/150?u=24',
		status: 'active',
		role: 'Manager',
		department: 'Management',
		joinDate: '2022-06-15',
		salary: 98000,
	},
	{
		_id: '25',
		name: 'William Green',
		email: 'william.green@example.com',
		avatar: 'https://i.pravatar.cc/150?u=25',
		status: 'active',
		role: 'Developer',
		department: 'Engineering',
		joinDate: '2023-04-28',
		salary: 81000,
	},
	{
		_id: '26',
		name: 'Xena Adams',
		email: 'xena.adams@example.com',
		avatar: 'https://i.pravatar.cc/150?u=26',
		status: 'inactive',
		role: 'Designer',
		department: 'Design',
		joinDate: '2022-10-18',
		salary: 67000,
	},
	{
		_id: '27',
		name: 'Yusuf Baker',
		email: 'yusuf.baker@example.com',
		avatar: 'https://i.pravatar.cc/150?u=27',
		status: 'active',
		role: 'Developer',
		department: 'Engineering',
		joinDate: '2023-12-05',
		salary: 74000,
	},
	{
		_id: '28',
		name: 'Zoe Carter',
		email: 'zoe.carter@example.com',
		avatar: 'https://i.pravatar.cc/150?u=28',
		status: 'active',
		role: 'Marketing',
		department: 'Marketing',
		joinDate: '2023-07-10',
		salary: 63000,
	},
	{
		_id: '29',
		name: 'Aaron Mitchell',
		email: 'aaron.mitchell@example.com',
		avatar: 'https://i.pravatar.cc/150?u=29',
		status: 'pending',
		role: 'Developer',
		department: 'Engineering',
		joinDate: '2024-01-22',
		salary: 72000,
	},
	{
		_id: '30',
		name: 'Bella Perez',
		email: 'bella.perez@example.com',
		avatar: 'https://i.pravatar.cc/150?u=30',
		status: 'active',
		role: 'Admin',
		department: 'IT',
		joinDate: '2023-02-28',
		salary: 86000,
	},
	{
		_id: '31',
		name: 'Carl Roberts',
		email: 'carl.roberts@example.com',
		avatar: 'https://i.pravatar.cc/150?u=31',
		status: 'active',
		role: 'Developer',
		department: 'Engineering',
		joinDate: '2023-06-02',
		salary: 78000,
	},
	{
		_id: '32',
		name: 'Daisy Turner',
		email: 'daisy.turner@example.com',
		avatar: 'https://i.pravatar.cc/150?u=32',
		status: 'inactive',
		role: 'Designer',
		department: 'Design',
		joinDate: '2022-08-22',
		salary: 68000,
	},
	{
		_id: '33',
		name: 'Ethan Phillips',
		email: 'ethan.phillips@example.com',
		avatar: 'https://i.pravatar.cc/150?u=33',
		status: 'active',
		role: 'Developer',
		department: 'Engineering',
		joinDate: '2023-09-15',
		salary: 80000,
	},
	{
		_id: '34',
		name: 'Faith Campbell',
		email: 'faith.campbell@example.com',
		avatar: 'https://i.pravatar.cc/150?u=34',
		status: 'active',
		role: 'HR',
		department: 'Human Resources',
		joinDate: '2023-03-12',
		salary: 63000,
	},
	{
		_id: '35',
		name: 'Gary Parker',
		email: 'gary.parker@example.com',
		avatar: 'https://i.pravatar.cc/150?u=35',
		status: 'pending',
		role: 'Developer',
		department: 'Engineering',
		joinDate: '2024-01-15',
		salary: 71000,
	},
	{
		_id: '36',
		name: 'Hazel Evans',
		email: 'hazel.evans@example.com',
		avatar: 'https://i.pravatar.cc/150?u=36',
		status: 'active',
		role: 'Manager',
		department: 'Management',
		joinDate: '2022-04-08',
		salary: 94000,
	},
	{
		_id: '37',
		name: 'Ivan Edwards',
		email: 'ivan.edwards@example.com',
		avatar: 'https://i.pravatar.cc/150?u=37',
		status: 'active',
		role: 'Developer',
		department: 'Engineering',
		joinDate: '2023-10-25',
		salary: 77000,
	},
	{
		_id: '38',
		name: 'Joy Collins',
		email: 'joy.collins@example.com',
		avatar: 'https://i.pravatar.cc/150?u=38',
		status: 'inactive',
		role: 'Marketing',
		department: 'Marketing',
		joinDate: '2022-07-18',
		salary: 64000,
	},
	{
		_id: '39',
		name: 'Kyle Stewart',
		email: 'kyle.stewart@example.com',
		avatar: 'https://i.pravatar.cc/150?u=39',
		status: 'active',
		role: 'Designer',
		department: 'Design',
		joinDate: '2023-08-08',
		salary: 70000,
	},
	{
		_id: '40',
		name: 'Lily Sanchez',
		email: 'lily.sanchez@example.com',
		avatar: 'https://i.pravatar.cc/150?u=40',
		status: 'active',
		role: 'Developer',
		department: 'Engineering',
		joinDate: '2023-05-20',
		salary: 79000,
	},
]

export function useGetUsers(initialFilter?: TableFilter): UseGetUsersResult {
	const result = ref<{ users: User[]; pageInfo: PageInfo } | null>(null)
	const loading = ref(false)

	const refetch = async (filter?: TableFilter): Promise<void> => {
		loading.value = true

		await new Promise((resolve) =>
			setTimeout(resolve, 500 + Math.random() * 300),
		)

		const page = filter?.pagination?.page || 1
		const limit = filter?.pagination?.limit || 10
		const search = filter?.filter?.search || ''
		const sorting = filter?.filter?.sorting

		let filtered = [...mockUsers]

		if (search) {
			const query = search.toLowerCase()
			filtered = filtered.filter(
				(user) =>
					user.name.toLowerCase().includes(query) ||
					user.email.toLowerCase().includes(query) ||
					user.role.toLowerCase().includes(query) ||
					user.department.toLowerCase().includes(query),
			)
		}

		if (sorting?.field && sorting?.order) {
			filtered.sort((a, b) => {
				const aVal = (a as any)[sorting.field]
				const bVal = (b as any)[sorting.field]

				if (typeof aVal === 'string') {
					const comparison = aVal.localeCompare(bVal)
					return sorting.order === 'asc' ? comparison : -comparison
				}

				if (typeof aVal === 'number') {
					return sorting.order === 'asc' ? aVal - bVal : bVal - aVal
				}

				return 0
			})
		}

		const totalItems = filtered.length
		const totalPages = Math.ceil(totalItems / limit)
		const start = (page - 1) * limit
		const end = start + limit

		result.value = {
			users: filtered.slice(start, end),
			pageInfo: {
				currentPage: page,
				totalPages,
				totalItems,
			},
		}

		loading.value = false
	}

	if (initialFilter) {
		refetch(initialFilter)
	}

	return {
		result,
		loading,
		refetch,
	}
}
