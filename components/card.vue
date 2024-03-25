<template>
    <div v-if="!loading" class="shadow-md bg-slate-50 rounded-xl">
        <div class="rounded-md h-fit flex-shrink-0">
            <NuxtImg draggable="false" class="w-full h-full object-cover rounded-t-lg"
                :src="afbeelding ? afbeelding : '/image/placeholder-eten.jpg'" @error="handleImageError"
                alt="Restaurant 2" />
        </div>
        <div class="p-3">
            <div class="flex justify-between items-center mb-2">
                <h4 class="text-lg font-bold">{{ naam }}</h4>
                <Rating :number="rating" />
            </div>
            <div class="flex max-w-[80%] flex-wrap gap-2 mb-2">
                <p class="bg-gray-200 text-xs p-2 rounded-md">{{ plaats }}</p>
                <p class="bg-gray-200 text-xs p-2 rounded-md">{{ keuken }}</p>
                <p class="bg-gray-200 text-xs p-2 rounded-md">{{ prijs }}</p>
            </div>
            <p class="text-xs opacity-80 text-balance sm:mb-2 mb-2 line-clamp-3 sm:line-clamp-1 ">
                {{ beschrijving }}
            </p>
            <NuxtLink :to="`/restaurants/${id}`"
                class="text-xs rounded-md text-opacity-90 bg-green-600 p-2 px-4 text-white font-medium text-balance">
                Bekijk restaurant</NuxtLink>
        </div>
    </div>
    <div v-else class="shadow-md animate-pulse bg-slate-50 rounded-xl">
        <div class="rounded-md">
            <div class="w-full bg-gray-200 h-[9.9rem] md:h-52 xl:h-[12.8rem] object-cover rounded-t-lg">
            </div>
        </div>
        <div class="p-3">
            <div class="flex justify-between items-center mb-2">
                <h4 class="text-lg font-bold rounded-md bg-gray-300 p-3 px-12"></h4>
                <Rating :number="0" />
            </div>
            <div class="flex max-w-[80%] flex-wrap gap-2 mb-8 md:mb-[1.65rem]">
                <p class="bg-slate-200 text-xs p-4 px-8 rounded-md"></p>
                <p class="bg-slate-200 text-xs p-4 px-6 rounded-md"></p>
                <p class="bg-slate-200 text-xs p-4 px-5 rounded-md"></p>
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
}>();

const handleImageError = () => {
    afbeelding.value = '/image/placeholder-eten.jpg';
}





</script>
