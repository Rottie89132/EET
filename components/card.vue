<template>
    <div class="shadow-md bg-slate-50 rounded-xl">
        <div class="rounded-md">
            <NuxtImg draggable="false" class="w-full h-full object-cover rounded-t-lg"
                src="/image/banner.png" alt="Restaurant 2" />
        </div>
        <div class="p-3">
            <div class="flex justify-between items-center mb-2">
                <h4 class="text-lg font-bold">Het Vleeshuis</h4>
                <Rating :number="rating" />
            </div>
            <div class="flex max-w-[65%] flex-wrap gap-2 mb-2">
                <p class="bg-slate-200 text-xs p-2 rounded-md">Vlaardingen</p>
                <p class="bg-slate-200 text-xs p-2 rounded-md">Italiaans</p>
                <p class="bg-slate-200 text-xs p-2 rounded-md">€€€</p>
            </div>
            <p class="text-xs z-0 opacity-80 text-balance sm:pb-3 pb-2 line-clamp-2">Lorem ipsum dolor
                sit
                amet consectetur. Eget nunc in ipsum morbi vivamus sed tellus enim.</p>
            <NuxtLink to="/restaurants/23456789"
                class="text-xs rounded-md text-opacity-90 bg-green-600 p-2 px-4 text-white font-medium text-balance">
                Bekijk restaurant</NuxtLink>
        </div>
    </div>
</template>

<script setup lang="ts">

const { rating } = defineModels<{
    // restaurant: string;
    // id: string;
    // datum: string;
    // aantal: number;
    // plaats: string;
    // keuken: string;
    // prijs: string;
    rating: number;

}>();

// const number = ref(0);
// const random = Math.floor(Math.random() * 5) + 1;

// number.value = random;





</script>

<style scoped></style>