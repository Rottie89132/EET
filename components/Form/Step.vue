<template>
  <div v-if="shouldShow">
    <slot></slot>
  </div>
</template>

<script setup lang="ts">


const currentIdx = (inject('STEP_COUNTER') as { value: number }).value++;
const formStepIdx: any = inject('CURRENT_STEP_INDEX');

const shouldShow = computed(() => {
    return currentIdx === formStepIdx.value;
});
</script>
