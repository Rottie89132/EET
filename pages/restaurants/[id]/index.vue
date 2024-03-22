<template>
    <Navigation></Navigation>
    <div class="bg-white">
        <div class="grid grid-cols-3 gap-4 p-4">
            <div>
                <img alt="Burger" class="w-full h-auto rounded-lg" width="500" height="300"
                    style="aspect-ratio: 500 / 300; object-fit: cover;" src="/image/Banner.png" />
            </div>
            <div>
                <img alt="Burger" class="w-full h-auto rounded-lg" width="500" height="300"
                    style="aspect-ratio: 500 / 300; object-fit: cover;" src="/image/Banner.png" />
            </div>
            <div>
                <img alt="Burger" class="w-full h-auto rounded-lg" width="500" height="300"
                    style="aspect-ratio: 500 / 300; object-fit: cover;" src="/image/Banner.png" />
            </div>
        </div>
    </div>

    <div class="grid grid-cols-3 gap-4 p-4">

        <div>
            <h1 class="mt-4 text-3xl font-bold">{{ restaurantDetails?.naam }}</h1>
            <div class="flex items-center mt-2 space-x-2">
                <Icon name="ep:location" size="2EM"></Icon>
                <span>{{ restaurantDetails?.plaats }}</span>
            </div>
            <div class="flex items-center mt-2 space-x-2">
                <Icon name="ep:fork-spoon" size="2EM"></Icon>
                <span>{{ restaurantDetails?.keuken }}</span>
            </div>
            <div class="flex items-center mt-2 space-x-2">
                <Icon name="ep:money" size="2EM"></Icon>
                <span>{{ restaurantDetails?.prijs }}</span>
            </div>
            <div class="flex items-center mt-2 space-x-2">
                <Icon name="ep:star" size="2EM"></Icon>
                <span>{{ restaurantDetails?.beoordeling }}</span>
            </div>

        </div>
        <div>
            <h1 class="mt-2 text-3xl">{{ restaurantDetails?.beschrijving }}</h1>
            <div class="grid grid-cols-2 gap-">
                <div class="inset-0 flex items-center justify-center bg-[#64A362] bg-opacity-75 rounded-lg w-40 h-6 mt-4">
                    <h2 class="font-bold text-white">Tafel reserveren</h2>
                </div>
                <div class="inset-0 flex items-center justify-center bg-[#64A362] bg-opacity-75 rounded-lg w-40 h-6 mt-4">
                    <h2 class="font-bold text-white">Menu</h2>
                </div>
            </div>
        </div>
    </div>
</template>
      
<script setup lang="ts">

interface RestaurantDetails {
    naam: string;
    plaats: string;
    keuken: string;
    prijs: string;
    beoordeling: string;
    afbeelding: string;
    beschrijving: string;
}

const id = useRoute().params.id;
const supabase = useSupabaseClient();

const { $pwa }: any = useNuxtApp();
const installed = ref(false);
const restaurantDetails = ref<RestaurantDetails | null>(null);

onMounted(async () => {
    if ($pwa?.isPWAInstalled) installed.value = true;

    const { data, error } = await supabase
        .from('restaurants_table')
        .select('*')
        .eq('id', id)
        .single();

    if (error) {
        console.error('Error fetching restaurant details:', error.message);
    } else {
        console.log(data);
        restaurantDetails.value = data;
    }
});
</script>
      
<style scoped></style>
      
    