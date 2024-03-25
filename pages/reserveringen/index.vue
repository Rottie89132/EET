<template>
	<div class="h-screen">
		<Navigation></Navigation>
		<div class="pb-8">
			<div class="mt-[5.25rem]">
				<div :class="!installed ? 'top-[4rem] sticky -mt-6' : 'top-0 pt-14 md:top-0 md:-mt-5 fixed'" class="w-full z-10 px-6 bg-white">
					<div class="mb-2">
						<h3 class="xl:text-3xl text-xl font-bold pt-5">Reserveringen</h3>
						<p class="xl:text-sm text-xs z-0 opacity-80 mb-2">Hier ziet u een overzicht van uw reserveringen</p>
					</div>
					<div class="grid grid-cols-2 border rounded-lg md:max-w-[20rem] overflow-hidden bg-gray-100 cursor-pointer">
						<div class="flex justify-center items-center py-1" :class="activeTab === 'history' ? 'bg-[#4e995b] text-[#c8e7cd] rounded-lg' : 'bg-gray-100'" @click="setActiveTab('history')">
							<span class="text-sm">Geschiedenis</span>
						</div>
						<div class="flex justify-center items-center py-1" :class="activeTab === 'upcoming' ? 'bg-[#4e995b] text-[#c8e7cd] rounded-lg' : 'bg-gray-100'" @click="setActiveTab('upcoming')">
							<span class="text-sm">Aankomende</span>
						</div>
					</div>
					<hr class="pb-2 mt-3" />
				</div>
				<div :class="!installed ? 'pb-6' : ' pb-[5.4rem] mt-[11rem] md:mt-[10.5rem]'" class="grid h-fit pt-2 gap-4 px-6 xl:grid-cols-3 sm:grid-cols-2 grid-rows-1">
					<div v-if="activeTab === 'history'">
						<p>Geschiedenis</p>
					</div>

					<div v-else>
						<p>Aankomende</p>
					</div>
				</div>
			</div>
		</div>
	</div>
</template>

<script setup lang="ts">
	const { $pwa }: any = useNuxtApp();
	const router = useRouter();
	const installed = ref(false);
	const activeTab = ref();

	activeTab.value = router.currentRoute.value.query.tab || "history";

	onMounted(() => {
		if ($pwa?.isPWAInstalled) installed.value = true;
	});

	definePageMeta({
		middleware: "auth",
	});

	useSeoMeta({
		title: "EET | Reserveringen",
		description: "",
		ogTitle: "EET | Reserveringen",
		ogDescription: "",
		ogImage: "/image/banner.png",
		ogUrl: "https://eet.com",
		twitterTitle: "EET | Reserveringen",
		twitterDescription: "",
		twitterImage: "/image/banner.png",
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

	// watch(router.currentRoute, (newRoute) => {
	// 	activeTab.value = newRoute.query.tab || "history";
	// });

	const setActiveTab = (tab: string) => {
		activeTab.value = tab;
		router.push({ query: { ...router.currentRoute.value.query, tab } });
	};
</script>
