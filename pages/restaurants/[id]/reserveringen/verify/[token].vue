<template>
    <div>
        {{ result }}
    </div>
</template>

<script setup lang="ts">

const result = ref()

onMounted( async() => {
    const { id, token} = useRoute().params
    const data = await $fetch(`/api/restaurants/${id}/reserverigen/verify/${token}`)
    result.value = data
})

</script>

<style scoped>

</style>