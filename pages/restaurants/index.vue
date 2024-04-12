<template>
	<div class="h-screen">
		<Navigation v-model:OkStatus="OkStatus"></Navigation>>
		<div class="fixed w-screen h-full overflow-auto top-0">
			<div class="mt-24">
				<div :class="!installed ? 'top-[4rem] sticky -mt-14' : 'top-0 pt-14 md:top-0 md:-mt-5 fixed'" class="w-full z-10 px-6 bg-white">
					<div class="mb-4">
						<h3 class="xl:text-3xl text-xl font-bold pt-5">Restaurants</h3>
						<p class="xl:text-sm text-xs z-0 opacity-80 mb-2">Hier zijn de restaurants die wij bieden voor jou!</p>
						<div class="flex mb-1 mt-2 justify-between">
							<div>
								<form @submit.prevent="handleSearch">
									<input v-model="navstad" class="placeholder:text-sm p-1 pl-3 border-2 xl:w-[10em] w-[9rem] appearance-none outline-none rounded-md" placeholder="zoeken op stad" />
								</form>
							</div>
							<div v-if="totalPagina > 1" class="flex gap-2">
								<button v-if="pagina > 1" @click="vorigePagina" class="p-2 bg-[#F7F7F7] flex items-center justify-center rounded-md">
									<Icon name="ic:sharp-keyboard-arrow-left" size="1.2em"></Icon>
								</button>
								<button v-if="pagina < totalPagina" @click="volgendePagina" class="p-2 bg-[#F7F7F7] flex items-center justify-center rounded-md">
									<Icon name="ic:sharp-keyboard-arrow-right" size="1.2em"></Icon>
								</button>

								<button v-if="pagina == totalPagina" @click="eerstePagina" class="p-2 bg-[#F7F7F7] flex items-center justify-center rounded-md">
									<Icon name="ic:round-keyboard-double-arrow-left" size="1.2em"></Icon>
								</button>

								<button v-if="pagina < totalPagina" @click="laatstePagina" class="p-2 bg-[#F7F7F7] flex items-center justify-center rounded-md">
									<Icon name="ic:round-keyboard-double-arrow-right" size="1.2rem"></Icon>
								</button>
								<form @submit.prevent="navigeerPagina">
									<input v-model="NavPagina" name="page" type="number" aria-label="Search" class="p-[0.34rem] appearance-none outline-none w-9 text-center font-medium bg-[#4e995b] text-white flex items-center justify-center rounded-md" />
								</form>
							</div>
						</div>
					</div>
					<hr class="pb-2" />
				</div>
				<div :class="!installed ? 'pb-6 mt-6' : ' mt-[6.2rem] sm:mt-[4.4rem] overflow-auto w-full h-[72vh] sm:h-[78vh] md:h-[78vh] fixed'">
					<div class="grid h-fit pt-2 gap-4 px-6 sm:grid-cols-2 md:grid-cols-3 :grid-cols-3 grid-rows-1">
						<div :class="!installed ? '' : 'last:mb-[4.4rem] last:sm:mb-10  last:md:mb-[8em] '" v-for="restaurant in items">
							<Card :loading="loading" :naam="restaurant.naam" :plaats="restaurant.plaats" :afbeelding="restaurant.thumbnail.data.publicUrl" :keuken="restaurant.keuken" :id="`${restaurant.id}`" :prijs="restaurant.prijs" :rating="restaurant.beoordeling" :beschrijving="restaurant.beschrijving"> </Card>
						</div>
					</div>
				</div>
			</div>
		</div>
	</div>
</template>

<script setup lang="ts">
	const { $pwa }: any = useNuxtApp();
	const installed = ref(false);
	const loading = ref(true);
	const stad = ref();
	const pagina: number | any = ref(1);
	const totalPagina = ref(0);
	const NavPagina: number | any = ref();
	const navstad: string | any = ref("");
	const keuken: string | any = ref("");
	const items = ref();
	const OkStatus = ref(false);

	onMounted(() => {
		if ($pwa?.isPWAInstalled) installed.value = true;
	});

	useSeoMeta({
		title: "EET | Restaurants",
		description: "",
		ogTitle: "EET | Restaurants",
		ogDescription: "",
		ogImage: "/image/banner.png",
		ogUrl: "https://eet.com",
		twitterTitle: "EET | Restaurants",
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

	pagina.value = useRoute().query.pagina;
	stad.value = useRoute().query.stad;
	keuken.value = useRoute().query.type;
	NavPagina.value = pagina.value;

	navstad.value = stad.value;

	if (!pagina.value) navigateTo(`/restaurants?pagina=1`);

	const { data, pending }: any = await useFetch("/api/restaurants", {
		params: {
			pagina: pagina.value,
			stad: navstad.value,
			keuken: keuken.value,
		},
	});

	items.value = data.value?.restaurants;
	totalPagina.value = data.value?.totalPages;
	loading.value = pending;

	const navigate = async () => {
		loading.value = true;
		const { data, pending }: any = await useFetch("/api/restaurants", {
			params: {
				pagina: pagina.value,
				stad: navstad.value,
				keuken: keuken.value,
			},
		});

		items.value = data.value?.restaurants;
		totalPagina.value = data.value?.totalPages;
		loading.value = pending;

		if (keuken.value && navstad.value) navigateTo(`/restaurants?pagina=${pagina.value}&stad=${navstad.value || stad.value}&keuken=${keuken.value}`);
		else if (navstad.value) navigateTo(`/restaurants?pagina=${pagina.value}&stad=${navstad.value || stad.value}`);
		else if (keuken.value) navigateTo(`/restaurants?pagina=${pagina.value}&keuken=${keuken.value}`);
		else navigateTo(`/restaurants?pagina=${pagina.value}`);
	};

	const volgendePagina = () => {
		if (pagina.value == totalPagina.value) return;
		pagina.value++;
		NavPagina.value = pagina.value;
		navigate();
	};

	const vorigePagina = () => {
		if (pagina.value == 1) return;
		pagina.value--;
		NavPagina.value = pagina.value;
		navigate();
	};

	const eerstePagina = () => {
		pagina.value = 1;
		NavPagina.value = pagina.value;
		navigate();
	};

	const laatstePagina = () => {
		pagina.value = totalPagina.value;
		NavPagina.value = pagina.value;
		navigate();
	};

	const navigeerPagina = () => {
		pagina.value = NavPagina.value;
		if (pagina.value < 1) pagina.value = 1;
		if (pagina.value > totalPagina.value) pagina.value = totalPagina.value;
		NavPagina.value = pagina.value;
		navigate();
	};

	const handleSearch = () => {
		pagina.value = 1;
		navigate();
	};
</script>

<style scoped></style>
