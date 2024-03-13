<template>
    <div class="shadow-md bg-slate-50 rounded-xl">
        <div class="p-3">
            <div class="flex justify-between items-center mb-2">
                <h4 class="text-lg font-bold">{{ restaurant }}</h4>
                <Rating :number="rating" />
            </div>
            <div class="flex max-w-[60%] md:max-w-[55%] flex-wrap gap-2 mb-2">
                <NuxtLink :to="`/restaurants/${id}`" class="bg-[#4e995b] p-2 px-4 text-white text-xs rounded-lg">Bekijk
                    restaurant
                </NuxtLink>
                <p class="bg-slate-200 flex items-center justify-center gap-1 text-xs p-2 rounded-md">
                    <Icon name="fa:calendar" class="w-4 h-4" />
                    <span class="ml-1">{{ datum }}</span>
                </p>
                <p class="bg-slate-200 flex items-center justify-center gap-1 text-xs p-2 rounded-md">
                    <icon name="fa:android" class="w-4 h-4" />
                    <span class="ml-1">x{{ aantal }}</span>
                </p>

                <p class="bg-slate-200 text-xs p-2 rounded-md">{{ plaats }}</p>
                <p class="bg-slate-200 text-xs p-2 rounded-md">{{ keuken }}</p>
                <p class="bg-slate-200 text-xs p-2 rounded-md">{{ prijs }}</p>
            </div>
        </div>
    </div>
</template>

<script setup lang="ts">

const { restaurant, id, datum, aantal, keuken, plaats, prijs, rating } = defineModels<{
    restaurant: string;
    id: string;
    datum: string;
    aantal: number;
    plaats: string;
    keuken: string;
    prijs: string;
    rating: number;

}>();


</script>