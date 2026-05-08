<script setup lang="ts">
import { ref } from 'vue'
import { Carousel } from '@/components/Carousel'
import DemoSection from '../DemoSection.vue'
import sourceCode from './CarouselDemo.vue?raw'

/*
 * Carousel Demo
 * Showcases the Carousel component across real-world use cases:
 * hero banners, e-commerce cards, vertical reels, autoplay, and more.
 */

// ── Hero Banner Data ──────────────────────────────────────────
const heroBanners = [
	{
		title: 'Ship Faster with vlite3',
		subtitle: '90+ production-ready Vue 3 components. Tailwind v4 native.',
		gradient: 'linear-gradient(135deg, #0f0f0f 0%, #1a1a2e 50%, #16213e 100%)',
		accent: '#60a5fa',
	},
	{
		title: 'Built for Performance',
		subtitle: 'Virtual DOM recycling, GPU-accelerated transitions, and lazy rendering.',
		gradient: 'linear-gradient(135deg, #0a0a0a 0%, #1b1a2e 50%, #2d1b3d 100%)',
		accent: '#a78bfa',
	},
	{
		title: 'Dark Mode First',
		subtitle: 'Automatic theme switching. No dark: prefixes. Just works.',
		gradient: 'linear-gradient(135deg, #0c0c0c 0%, #1a2e1a 50%, #0d2818 100%)',
		accent: '#34d399',
	},
]

// ── Product Card Data ─────────────────────────────────────────
const products = [
	{
		name: 'Wireless Earbuds Pro',
		price: '$129',
		originalPrice: '$179',
		badge: 'Best Seller',
		rating: 4.8,
		reviews: 2341,
		image: 'https://picsum.photos/400/400?random=10',
	},
	{
		name: 'Smart Watch Ultra',
		price: '$349',
		originalPrice: '$449',
		badge: 'New',
		rating: 4.9,
		reviews: 876,
		image: 'https://picsum.photos/400/400?random=11',
	},
	{
		name: 'Noise-Cancel Headphones',
		price: '$249',
		originalPrice: '$299',
		badge: '-17%',
		rating: 4.7,
		reviews: 1543,
		image: 'https://picsum.photos/400/400?random=12',
	},
	{
		name: 'Portable Speaker X',
		price: '$89',
		originalPrice: '$119',
		badge: 'Popular',
		rating: 4.6,
		reviews: 987,
		image: 'https://picsum.photos/400/400?random=13',
	},
	{
		name: 'USB-C Hub Dock',
		price: '$69',
		originalPrice: '$99',
		badge: '-30%',
		rating: 4.5,
		reviews: 654,
		image: 'https://picsum.photos/400/400?random=14',
	},
	{
		name: 'Mechanical Keyboard',
		price: '$159',
		originalPrice: '$199',
		badge: 'Hot',
		rating: 4.8,
		reviews: 1234,
		image: 'https://picsum.photos/400/400?random=15',
	},
]

// ── Vertical Reels Data ───────────────────────────────────────
const reels = [
	{
		user: 'sarah_designs',
		caption: 'Building a full dashboard in 10 minutes with vlite3 ✨',
		likes: '12.4K',
		comments: '342',
		image: 'https://picsum.photos/360/640?random=20',
	},
	{
		user: 'dev_marcus',
		caption: 'This carousel component is insane 🔥 #vuejs #opensource',
		likes: '8.7K',
		comments: '198',
		image: 'https://picsum.photos/360/640?random=21',
	},
	{
		user: 'ui_craft',
		caption: 'Dark mode that just works. No dark: prefix needed 🌙',
		likes: '15.1K',
		comments: '567',
		image: 'https://picsum.photos/360/640?random=22',
	},
	{
		user: 'code_ninja',
		caption: 'Virtual scrolling on 10,000 items. Zero lag 🚀',
		likes: '22.3K',
		comments: '891',
		image: 'https://picsum.photos/360/640?random=23',
	},
]

// ── Testimonial Data ──────────────────────────────────────────
const testimonials = [
	{
		quote: 'vlite3 cut our development time in half. The component quality is outstanding.',
		author: 'Alex Chen',
		role: 'Lead Engineer at Stripe',
		avatar: 'https://i.pravatar.cc/80?img=1',
	},
	{
		quote: 'The best Vue 3 component library I\'ve used. Period. Dark mode support is flawless.',
		author: 'Maria Santos',
		role: 'CTO at Vercel',
		avatar: 'https://i.pravatar.cc/80?img=5',
	},
	{
		quote: 'We migrated from 3 different libraries to vlite3. Never looked back.',
		author: 'James Wright',
		role: 'Senior Dev at Linear',
		avatar: 'https://i.pravatar.cc/80?img=8',
	},
]

// ── Gallery Data ──────────────────────────────────────────────
const gallery = [
	'https://picsum.photos/800/500?random=30',
	'https://picsum.photos/800/500?random=31',
	'https://picsum.photos/800/500?random=32',
	'https://picsum.photos/800/500?random=33',
	'https://picsum.photos/800/500?random=34',
]

// ── Responsive Breakpoints ────────────────────────────────────
const productBreakpoints = {
	0: 1,
	640: 2,
	1024: 3,
}

// ── Carousel Refs ─────────────────────────────────────────────
const reelsCarousel = ref()
</script>

<template>
	<div class="flex flex-col w-full space-y-2 pb-20">
		<!-- Page Header -->
		<div class="flex flex-col space-y-2 pb-6 mb-6 border-b border-border/30">
			<div class="flex items-center gap-2 text-sm text-muted-foreground font-medium">
				<span>Components</span>
				<span class="text-muted-foreground/40">›</span>
				<span class="text-foreground">Carousel</span>
			</div>
			<h2 class="text-3xl font-extrabold tracking-tight lg:text-4xl text-foreground">Carousel</h2>
			<p class="text-lg text-muted-foreground max-w-[70ch]">
				A high-performance carousel built for TikTok-style vertical feeds, e-commerce sliders,
				hero banners, and card carousels. Supports virtual scrolling, touch/drag, autoplay,
				responsive breakpoints, and GPU-accelerated transitions.
			</p>
		</div>

		<!-- ── 1. Hero Banner ──────────────────────────────────────── -->
		<DemoSection title="Hero Banner" :code="sourceCode">
			<div class="w-full max-w-3xl">
				<Carousel
					:data="heroBanners"
					:pagination="['dots', 'buttons']"
					:pagination-position="['bottom-center', 'center']"
					:pagination-visibility="['always', 'hover']"
					:items-to-show="1"
					:auto-play="true"
					:auto-play-interval="5000"
					:speed="600"
					easing="ease-out"
					loop>
					<template #default="{ item }">
						<div
							class="relative w-full overflow-hidden rounded-xl select-none"
							style="height: 320px"
							:style="{ background: item.gradient }">
							<!-- Decorative circles -->
							<div
								class="absolute -top-20 -right-20 w-64 h-64 rounded-full opacity-10"
								:style="{ background: item.accent }"></div>
							<div
								class="absolute -bottom-16 -left-16 w-48 h-48 rounded-full opacity-8"
								:style="{ background: item.accent }"></div>

							<!-- Content -->
							<div class="relative z-10 flex flex-col justify-center h-full px-8 md:px-14">
								<span
									class="inline-block px-3 py-1 text-xs font-semibold rounded-full mb-4 w-fit"
									:style="{
										background: item.accent + '20',
										color: item.accent,
									}"
									>vlite3</span
								>
								<h3 class="text-2xl md:text-4xl font-bold text-white mb-3 tracking-tight">
									{{ item.title }}
								</h3>
								<p class="text-sm md:text-base text-white/60 max-w-md">
									{{ item.subtitle }}
								</p>
							</div>
						</div>
					</template>
				</Carousel>
			</div>
		</DemoSection>

		<!-- ── 2. E-Commerce Product Cards ─────────────────────────── -->
		<DemoSection title="E-Commerce Products" :code="sourceCode">
			<div class="w-full">
				<Carousel
					:data="products"
					:items-to-show="productBreakpoints"
					:pagination="['dots', 'buttons']"
					:pagination-position="['bottom-center', 'center']"
					:pagination-visibility="['always', 'hover']"
					:gap="16"
					draggable
					:speed="500">
					<template #default="{ item }">
						<div
							class="flex flex-col rounded-xl border border-border/80 bg-card overflow-hidden select-none group">
							<!-- Image -->
							<div class="relative aspect-square overflow-hidden bg-muted/30">
								<img
									:src="item.image"
									:alt="item.name"
									class="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
									loading="lazy" />
								<!-- Badge -->
								<span
									class="absolute top-3 left-3 px-2.5 py-1 text-[11px] font-semibold rounded-full bg-primary text-primary-foreground shadow-sm">
									{{ item.badge }}
								</span>
							</div>

							<!-- Info -->
							<div class="flex flex-col gap-2 p-4">
								<h4 class="text-sm font-semibold text-foreground truncate">{{ item.name }}</h4>

								<!-- Rating -->
								<div class="flex items-center gap-1.5">
									<div class="flex items-center gap-0.5">
										<svg
											v-for="n in 5"
											:key="n"
											class="w-3.5 h-3.5"
											:class="n <= Math.round(item.rating) ? 'text-amber-400' : 'text-gray-300'"
											viewBox="0 0 20 20"
											fill="currentColor">
											<path
												d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
										</svg>
									</div>
									<span class="text-xs text-muted-foreground"
										>{{ item.rating }} ({{ item.reviews.toLocaleString() }})</span
									>
								</div>

								<!-- Price -->
								<div class="flex items-baseline gap-2 mt-1">
									<span class="text-lg font-bold text-foreground">{{ item.price }}</span>
									<span class="text-sm text-muted-foreground line-through">{{
										item.originalPrice
									}}</span>
								</div>
							</div>
						</div>
					</template>
				</Carousel>
			</div>
		</DemoSection>

		<!-- ── 3. Vertical Reels / TikTok ──────────────────────────── -->
		<DemoSection title="Vertical Reels" :code="sourceCode">
			<div class="w-full flex justify-center">
				<div class="w-[320px]">
					<Carousel
						ref="reelsCarousel"
						:data="reels"
						direction="vertical"
						:pagination="['dots', 'buttons']"
						:pagination-position="['center-right', 'center']"
						:pagination-visibility="['always', 'hover']"
						:items-to-show="1"
						draggable
						mousewheel
						:speed="500"
						easing="ease-out">
						<template #default="{ item }">
							<div class="relative w-full overflow-hidden rounded-xl select-none" style="height: 520px">
								<!-- Background image -->
								<img
									:src="item.image"
									:alt="item.caption"
									class="absolute inset-0 w-full h-full object-cover"
									loading="lazy" />
								<!-- Gradient overlay -->
								<div
									class="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent"></div>

								<!-- Bottom content -->
								<div class="absolute bottom-0 left-0 right-0 p-5 z-10">
									<div class="flex items-center gap-2 mb-3">
										<div
											class="w-8 h-8 rounded-full bg-white/20 backdrop-blur-sm flex items-center justify-center text-white text-xs font-bold">
											{{ item.user[0].toUpperCase() }}
										</div>
										<span class="text-white text-sm font-semibold">@{{ item.user }}</span>
									</div>
									<p class="text-white/90 text-sm leading-relaxed mb-4">{{ item.caption }}</p>
									<div class="flex items-center gap-5 text-white/60 text-xs">
										<span class="flex items-center gap-1">
											<svg class="w-4 h-4" viewBox="0 0 24 24" fill="currentColor">
												<path
													d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z" />
											</svg>
											{{ item.likes }}
										</span>
										<span class="flex items-center gap-1">
											<svg
												class="w-4 h-4"
												viewBox="0 0 24 24"
												fill="none"
												stroke="currentColor"
												stroke-width="2">
												<path
													d="M21 15a2 2 0 01-2 2H7l-4 4V5a2 2 0 012-2h14a2 2 0 012 2z" />
											</svg>
											{{ item.comments }}
										</span>
									</div>
								</div>
							</div>
						</template>
					</Carousel>
				</div>
			</div>
		</DemoSection>

		<!-- ── 4. Testimonials (Autoplay + Loop) ───────────────────── -->
		<DemoSection title="Testimonials Autoplay" :code="sourceCode">
			<div class="w-full max-w-2xl">
				<Carousel
					:data="testimonials"
					pagination="dots"
					pagination-position="bottom-center"
					:items-to-show="1"
					:auto-play="true"
					:auto-play-interval="4000"
					loop
					:speed="700"
					easing="ease-in-out">
					<template #default="{ item }">
						<div class="flex flex-col items-center text-center px-6 py-10 select-none">
							<!-- Quote icon -->
							<svg
								class="w-10 h-10 text-primary/20 mb-6"
								viewBox="0 0 24 24"
								fill="currentColor">
								<path
									d="M14.017 21v-7.391c0-5.704 3.731-9.57 8.983-10.609l.995 2.151c-2.432.917-3.995 3.638-3.995 5.849h4v10H14.017zM0 21v-7.391c0-5.704 3.731-9.57 8.983-10.609L9.978 5.151c-2.432.917-3.995 3.638-3.995 5.849h4v10H0z" />
							</svg>

							<blockquote class="text-lg md:text-xl text-foreground font-medium leading-relaxed mb-8 max-w-lg">
								"{{ item.quote }}"
							</blockquote>

							<div class="flex items-center gap-3">
								<img
									:src="item.avatar"
									:alt="item.author"
									class="w-10 h-10 rounded-full object-cover ring-2 ring-border"
									loading="lazy" />
								<div class="text-left">
									<p class="text-sm font-semibold text-foreground">{{ item.author }}</p>
									<p class="text-xs text-muted-foreground">{{ item.role }}</p>
								</div>
							</div>
						</div>
					</template>
				</Carousel>
			</div>
		</DemoSection>

		<!-- ── 5. Gallery with Buttons on Hover ────────────────────── -->
		<DemoSection title="Gallery with Hover Controls" :code="sourceCode">
			<div class="w-full max-w-3xl">
				<Carousel
					:data="gallery"
					:pagination="['dots', 'buttons']"
					:pagination-position="['bottom-center', 'center']"
					:pagination-visibility="['always', 'hover']"
					:items-to-show="1"
					draggable
					:speed="500">
					<template #default="{ item }">
						<div class="w-full overflow-hidden rounded-xl select-none" style="height: 340px">
							<img
								:src="item"
								alt="Gallery"
								class="w-full h-full object-cover"
								loading="lazy" />
						</div>
					</template>
				</Carousel>
			</div>
		</DemoSection>

		<!-- ── 6. Responsive Multi-Item ─────────────────────────────── -->
		<DemoSection title="Responsive Breakpoints" :code="sourceCode">
			<p class="text-sm text-muted-foreground text-center max-w-lg mb-2">
				Resize the window to see items adapt:
				<code class="text-xs bg-muted px-1.5 py-0.5 rounded">{ 0: 1, 640: 2, 1024: 3 }</code>
			</p>
			<div class="w-full">
				<Carousel
					:data="gallery"
					:items-to-show="productBreakpoints"
					pagination="dots"
					pagination-position="bottom-center"
					:gap="12">
					<template #default="{ item }">
						<div class="h-48 w-full overflow-hidden rounded-lg">
							<img
								:src="item"
								alt="Responsive slide"
								class="w-full h-full object-cover"
								loading="lazy" />
						</div>
					</template>
				</Carousel>
			</div>
		</DemoSection>

		<!-- ── 7. Minimal Dots Only ─────────────────────────────────── -->
		<DemoSection title="Minimal (Dots Only)" :code="sourceCode">
			<div class="w-full max-w-xl">
				<Carousel
					:data="gallery"
					pagination="dots"
					:items-to-show="1"
					:speed="400">
					<template #default="{ item }">
						<div class="h-56 w-full overflow-hidden rounded-lg">
							<img
								:src="item"
								alt="Slide"
								class="w-full h-full object-cover"
								loading="lazy" />
						</div>
					</template>
				</Carousel>
			</div>
		</DemoSection>
	</div>
</template>
