<template>
	<form @submit="onSubmit">
		
		<slot></slot>

        <hr class="mb-4" />

		<div class=" flex gap-2">
            <button class="p-2 bg-gray-100 hover:bg-gray-200 rounded-md  focus:outline-none" v-if="hasPrevious" type="button" @click="goToPrev">
                <icon name="material-symbols:keyboard-double-arrow-left" size="1.5em"></icon>
            </button>

            <div class="p-2 px-4 font-semibold  select-none bg-gray-100  rounded-md  focus:outline-none" >
                {{ currentStepIdx + 1 }} 
            </div>
        
            <button class="w-full text-center p-2 bg-[#4e995b] hover:bg-[#43874e] text-white cursor-pointer rounded-md focus:outline-none">
                {{ isLastStep ? "Bevestigen" : "Volgende" }}
            </button>
        </div>
	</form>
</template>

<script setup lang="ts">
	import { useForm } from "vee-validate";
	import { ref, computed, provide } from "vue";

	const props = defineProps({
		validationSchema: {
			type: Array,
			required: true,
		},
	});

	const emit = defineEmits(["submit"]);
	const currentStepIdx = ref(0);

    const totalSteps = computed(() => props.validationSchema.length);
    const progress = computed(() => (currentStepIdx.value + 1 / totalSteps.value) * 100);

	const stepCounter = ref(0);
	provide("STEP_COUNTER", stepCounter);
	provide("CURRENT_STEP_INDEX", currentStepIdx);

	const isLastStep = computed(() => {
		return currentStepIdx.value === stepCounter.value - 1;
	});

	const hasPrevious = computed(() => {
		return currentStepIdx.value > 0;
	});

	const currentSchema = computed(() => {
		return props.validationSchema[currentStepIdx.value];
	});

	const { values, handleSubmit } = useForm({
		validationSchema: currentSchema,
		keepValuesOnUnmount: true,
	});

	const onSubmit = handleSubmit((values) => {
		if (!isLastStep.value) {
			currentStepIdx.value++;

			return;
		}

		emit("submit", values);
	});

	function goToPrev() {
		if (currentStepIdx.value === 0) {
			return;
		}

		currentStepIdx.value--;
	}
</script>