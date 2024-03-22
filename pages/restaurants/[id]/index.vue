<template>
    <div class=" h-screen">
        <Navigation></Navigation>
        <div :class="!installed ? ' mt-20' : 'mt-14'" class="overflow-hidden px-6">
            <h1 class="xl:text-2xl text-base">
                {{ id }}
            </h1>
        </div>
    </div>
</template>

<script setup lang="ts">

const id = useRoute().params.id;
const { $pwa }: any = useNuxtApp()
const installed = ref(false);

onMounted(() => {
    if ($pwa?.isPWAInstalled) installed.value = true;

});

</script>

<style scoped></style>