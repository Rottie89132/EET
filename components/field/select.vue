<template>
	<field :name="name" v-slot="{ handleChange, field }">
		<label class="text-base font-bold text-neutral-900" :for="type">{{ label }}</label>
		<div class="grid grid-cols-4 gap-2 mt-2 mb-4">
			<div v-bind="field" v-for="option in options" :key="option.value" tabindex="0" @keydown.enter="handleChange(option.value)" @click="handleChange(option.value)" :class="field.value === option.value ? 'bg-[#4e995b] hover:bg-[#42834d] border-[#4e995b] text-white' : 'hover:bg-gray-200 border-gray-300'" class="flex items-center justify-center p-2 border transition-all delay-100 ease-in rounded-md">{{ option.text }}</div>
		</div>

		<ErrorMessage class="mb-1 -mt-3 text-xs text-[#B92538] block" :name="name"></ErrorMessage>
	</field>
</template>

<script setup lang="ts">
	defineProps({
		type: { type: String, required: true },
		label: { type: String, required: true },
		name: { type: String, required: true },
		options: { type: Object, required: true },
		value: { type: String, default: "" },
		disabled: { type: Boolean, default: false },
	});

</script>
