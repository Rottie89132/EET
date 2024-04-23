<template>
	<div></div>
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
			rel: 'icon',
			type: 'image/svg',
			href: '/image/Logo.svg'
		}
	]
});

onMounted(() => {
	setTimeout(() => {
		navigateTo("/home")
	}, 5);
})


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
