<template>
	<div :class="!installed ? 'absolute' : ' fixed'" class="bg-white h-screen w-screen flex items-center justify-center z-30 top-0">
		<div v-if="installed" class="flex flex-col gap-6 z-20 items-center justify-center">
			<NuxtImg class="w-36" src="/image/Logo.svg" alt="EET" />
			<p class="text-6xl font-semibold">EET</p>
			<p class="text-lg max-w-[80%] -mt-4 opacity-65 leading-5 text-balance text-center">
				De makkelijkste manier om een restaurant te vinden en te reserveren.
			</p>
		</div>
	</div>
</template>

<script setup lang="ts">
	useSeoMeta({
		title: "EET | Home",
		description: "Reserveer bij de beste restaurants in Nederland. EET maakt het makkelijk om een restaurant te vinden en te reserveren.",
		ogTitle: "EET | Home",
		ogDescription: "Reserveer bij de beste restaurants in Nederland. EET maakt het makkelijk om een restaurant te vinden en te reserveren.",
		ogImage: "/icons/icon-512x512.png",
		ogUrl: "https://eet.com",
		twitterTitle: "EET | Home",
		twitterDescription: "Reserveer bij de beste restaurants in Nederland. EET maakt het makkelijk om een restaurant te vinden en te reserveren.",
		twitterImage: "/icons/icon-512x512.png",
		twitterCard: "summary",
	});

	useHead({
		htmlAttrs: {
			lang: "nl",
		},
		link: [
			{
				rel: "icon",
				type: "image/svg",
				href: "/image/Logo.svg",
			},
		],
	});

	const { $pwa } = useNuxtApp();
	const installed = ref(false);

	onMounted(() => {
		if ($pwa?.isPWAInstalled) installed.value = true;
		if (!installed.value) {
			navigateTo("/home")
		} else {
			setTimeout(() => {
				navigateTo("/home")
			}, 500);
		}
	});
</script>

<style scoped>
	.animate-progress {
		width: 100%;
		animation: progress 2s linear infinite;
	}

	@keyframes progress {
		0% {
			transform: translateX(-100%);
		}

		100% {
			transform: translateX(100%);
		}
	}
</style>
