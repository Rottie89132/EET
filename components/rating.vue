<template>
    <div class="flex gap-1">
        <div v-for="star in 5">
            <icon :key="star" class="w-6 h-6" :class="star <= number ? 'text-green-600' : 'text-slate-300'"
                name="fa:star" />
        </div>
    </div>
</template>

<script setup lang="ts">


const props = defineProps<{
    number: number;
}>();



</script>