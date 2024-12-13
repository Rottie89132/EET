<template>
	<div @touchstart="preloadimages(naam, images)" @mouseover="preloadimages(naam, images)" v-if="!loading" class="shadow-md bg-slate-50 rounded-xl">
		<div class="flex-shrink-0 rounded-md h-fit">
			<NuxtImg draggable="false" class="w-full h-[10rem] object-cover rounded-t-lg" :src="afbeelding ? afbeelding : '/image/placeholder-eten.jpg'" @error="handleImageError" alt="Restaurant 2" />
		</div>
		<div class="p-3">
			<div class="flex items-center justify-between mb-2">
				<h4 class="text-lg font-bold">{{ naam }}</h4>
				<Rating :number="rating" />
			</div>
			<div class="flex max-w-[80%] flex-wrap gap-2 mb-2">
				<p class="p-2 text-xs bg-gray-200 rounded-md">{{ plaats }}</p>
				<p class="p-2 text-xs bg-gray-200 rounded-md">{{ keuken }}</p>
				<p class="p-2 text-xs bg-gray-200 rounded-md">{{ prijs }}</p>
			</div>
			<p class="mb-2 text-xs opacity-80 text-balance sm:mb-2 line-clamp-3 sm:line-clamp-1">
				{{ beschrijving }}
			</p>
			<NuxtLink @click="preloadimages(naam, images)" :to="`/restaurants/${id}`" class="text-xs rounded-md text-opacity-90 bg-[#4e995b] p-2 px-4 text-white font-medium text-balance"> Bekijk restaurant</NuxtLink>
		</div>
	</div>
	<div v-else class="shadow-md animate-pulse bg-slate-50 rounded-xl">
		<div class="rounded-md">
			<div class="w-full bg-gray-200 h-[9.9rem] md:h-52 xl:h-[12.8rem] object-cover rounded-t-lg"></div>
		</div>
		<div class="p-3">
			<div class="flex items-center justify-between mb-2">
				<h4 class="p-3 px-12 text-lg font-bold bg-gray-300 rounded-md"></h4>
				<Rating :number="0" />
			</div>
			<div class="flex max-w-[80%] flex-wrap gap-2 mb-8 md:mb-[1.65rem]">
				<p class="p-4 px-8 text-xs rounded-md bg-slate-200"></p>
				<p class="p-4 px-6 text-xs rounded-md bg-slate-200"></p>
				<p class="p-4 px-5 text-xs rounded-md bg-slate-200"></p>
			</div>
		</div>
	</div>
</template>

<script setup lang="ts">
	const { naam, id, keuken, plaats, prijs, rating, beschrijving, afbeelding, loading } = defineModels<{
		naam: string;
		id: string;
		plaats: string;
		keuken: string;
		prijs: string;
		rating: number;
		beschrijving: string;
		afbeelding: string;
		loading: any;
        images: string[];
	}>();

	const handleImageError = () => {
		afbeelding.value = "/image/placeholder-eten.jpg";
	};

	const preloadimages = (naam: string, arr: string[]) => {
		arr.forEach((image: any, index: number) => {
			const session = sessionStorage.getItem(`${naam}-${index + 1}`)
			
			if (!session) {
				const img = new Image();
				img.src = image.data.publicUrl;
				sessionStorage.setItem(`${naam}-${index + 1}`, JSON.stringify(image));
			}
		});
	};
</script>
