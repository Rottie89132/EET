<template>
	<ClientOnly>
		<Field tabindex="1" :name="name" class="sr-only" type="range" v-model="childValue" min="1" max="5" step="1" />
		<div class="pt-4 flex h-68 md:h-72 items-center w-full justify-center">
			<RoundSlider mouseScrollAction="true" rangeColor="#4e995b" v-model="childValue" start-angle="315" end-angle="+270" line-cap="round" radius="120" step="1" max="5" min="1" />
		</div>
		<ErrorMessage class="mb-2 -mt-2 text-xs text-[#B92538] block" :name="name" />
	</ClientOnly>
</template>

<script setup>
	import RoundSlider from "@artem9989/vue-three-round-slider";
	const childValue = ref(2.5);

	const probs = defineProps({
		name: { type: String, default: "Input" },
	});
</script>
