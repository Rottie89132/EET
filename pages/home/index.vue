<template>
	<div class="h-screen">
		<div :class="!installed ? ' mt-20 -mb-12' : 'mt-14'" class="flex items-center px-6 overflow-hidden">
			<div class="rounded-xl flex bg-[#4e995b] mt-6 mb-12 xl:p-10 sm:p-8 p-6">
				<div>
					<h1 class="mb-2 text-sm font-bold text-white xl:text-5xl sm:text-lg text-balance xl:mb-4">Reserveren was nog nooit zo makkelijk, voor jou én voor restaurants!</h1>
					<h2 class="mb-3 text-xs text-white xl:text-2xl sm:text-base opacity-80 xl:mb-6 text-balance">Navigeer moeiteloos door een uitgebreide selectie van restaurants, allemaal binnen handbereik op één gebruiksvriendelijke website</h2>

					<div class="flex gap-4">
						<form @submit.prevent="handleSearch" class="flex">
							<input class="appearance-none outline-none xl:w-[28rem] sm:w-[18rem] rounded-md p-2 xl:placeholder:text-base sm:placeholder:text-base placeholder:text-xs" type="text" v-model="stad" name="stad" placeholder="Zoek via een stad" />
							<button class="xl:-ml-11 -ml-6 xl:p-[0.65rem] rounded-e-md bg-neutral-700 flex justify-center items-center">
								<icon class="w-10 text-white xl:w-6" name="ic:sharp-search" size="1.5rem" />
							</button>
						</form>
					</div>
				</div>
			</div>
		</div>
		<div class="mt-2">
			<div :class="!installed ? 'top-[4.2rem] pt-2' : 'top-0 pt-16'" class="fixed top-0 z-10 w-screen p-3 bg-white"></div>
			<div :class="!installed ? 'top-[4.2rem] pt-2' : 'top-[4.7rem] md:top-12'" class="sticky z-10 px-6 mb-2 bg-white">
				<h3 class="mt-3 text-xl font-bold xl:text-3xl">Populaire restaurants</h3>
				<p class="z-0 mb-2 text-xs xl:text-sm opacity-80">
					De best beoordeelde restaurants uit gekozen <br />
					door onze gebruikers
				</p>
				<hr class="pb-2" />
			</div>

			<div v-auto-animate :class="!installed ? 'pb-6' : ' pb-[7.5rem] sm:mt-[0.8rem] md:-mt-[0.8rem]'" class="grid grid-rows-1 gap-4 px-6 pt-2 h-fit sm:grid-cols-2 md:grid-cols-3 xl:grid-cols-3">
				<div v-for="restaurant in items">
					<Card :loading="loading" :naam="restaurant.naam" :plaats="restaurant.plaats" :afbeelding="restaurant.thumbnail.data.publicUrl" :keuken="restaurant.keuken" :id="`${restaurant.id}`" :prijs="restaurant.prijs" :rating="restaurant.beoordeling" :beschrijving="restaurant.beschrijving" :images="restaurant.images"/>
				</div>
			</div>
		</div>
	</div>
</template>

<script setup lang="ts">
	const { $pwa }: any = useNuxtApp();
	const stad = ref("");
	const installed = ref(false);
	const items = ref();
	const loading = ref(true);
	const OkStatus = ref(false);

	useSeoMeta({
		title: "EET | Home",
		description: "Reserveer bij de beste restaurants in Nederland. EET maakt het makkelijk om een restaurant te vinden en te reserveren.",
		ogTitle: "EET | Home",
		ogDescription: "Reserveer bij de beste restaurants in Nederland. EET maakt het makkelijk om een restaurant te vinden en te reserveren.",
		ogImage: "/image/banner.png",
		ogUrl: "https://eet.com",
		twitterTitle: "EET | Home",
		twitterDescription: "Reserveer bij de beste restaurants in Nederland. EET maakt het makkelijk om een restaurant te vinden en te reserveren.",
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

	onMounted(() => {
		if ($pwa?.isPWAInstalled) installed.value = true;
	});

	const handleSearch = () => {
		if (stad.value === "") return navigateTo(`/restaurants?pagina=1`);
		else navigateTo(`/restaurants?pagina=1&stad=${stad.value}`);
	};

	

	const { data, pending }: any = await useFetch("/api/restaurants");
	items.value = data.value?.restaurants;
	loading.value = pending;
</script>
