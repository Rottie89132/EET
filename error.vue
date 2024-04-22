<template>
	<div>
		<div class="flex justify-center items-center w-full h-screen">
			<div class=" text-center">
				<h1 class="text-black text-8xl font-black">{{ error?.statusCode }}</h1>
				<h2 class="text-black md:text-3xl text-xl text-balance  opacity-70">{{ error?.message }}</h2>
                <button @click="handleError" class="mt-4 bg-[#4e995b] p-1 px-4 text-white rounded-lg">
                    Terug naar home
                </button>
			</div>
		</div>

		<!-- {{ error }} -->
		<!-- <h2>{{ error?.statusCode }}</h2>
		<button @click="handleError">Clear errors</button> -->
	</div>
</template>

<script setup lang="ts">
	import type { NuxtError } from "#app";

	const props = defineProps({
		error: Object as () => NuxtError,
	});

	const handleError = () => clearError({ redirect: "/" });
</script>
