<template>
    <div>
        {{ data }}
    </div>
</template>

<script setup lang="ts">

const { data } = await useFetch("/api/users")


</script>

<style scoped>

</style>