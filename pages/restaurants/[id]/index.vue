<template>
    <div>
        <Navigation></Navigation>
        <div class=" px-6">
            <h1 class="xl:text-2xl text-base">
                {{ id }}
            </h1>
        </div>
    </div>
</template>

<script setup lang="ts">

const id = useRoute().params.id;


</script>

<style scoped></style>