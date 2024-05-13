<template>
	<div :class="!installed ? 'absolute' : ' fixed'"
		class="bg-white h-screen w-screen flex items-center justify-center z-30 top-0">
		<div class="flex flex-col gap-6 z-20 items-center justify-center">
			<Icon class="w-52 h-52 text-[#4e995b]" name="material-symbols:check-circle" />
			<p class="text-6xl font-semibold">Gelukt!</p>
			<p class="text-lg max-w-[80%] -mt-4 opacity-65 leading-5 text-balance text-center">
				Je account is aangemaakt. Je kunt nu inloggen en reserveren.
			</p>
		</div>
	</div>
</template>

<script setup lang="ts">
	const { $pwa } = useNuxtApp();
	const installed = ref(false);

	onMounted(() => {
		if ($pwa?.isPWAInstalled) installed.value = true;
	});
</script>

<style scoped></style>
