<template>
    <div class=" bg-white h-screen w-screen z-50 absolute top-0">
        <p class=" text-red-800">
            {{ result }}</p>
    </div>
</template>

<script setup lang="ts">

const result = ref()
const { id, token } = useRoute().params
const { data, error} = await useFetch(`/api/restaurants/${id}/reserverigen/verify/${token}`)
result.value = data.value || error.value

if(!error.value) {}//navigateTo('/')
else throw showError({
    statusCode: 400,
    statusMessage: "Foutieve aanvraag",
    message: "Deze link is ongeldig of verlopen!",
})

</script>

<style scoped>

</style>