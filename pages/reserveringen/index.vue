<template>
	<div class="h-screen">
		<div class="pb-8">
			<div class="mt-[5.25rem]">
				<div :class="!installed ? 'top-[4rem] sticky -mt-6' : 'top-0 pt-14 md:top-0 md:-mt-5 fixed'"
					class="w-full z-10 px-6 bg-white">
					<div class="mb-2">
						<h3 class="xl:text-3xl text-xl font-bold pt-5">Reserveringen</h3>
						<p class="xl:text-sm text-xs z-0 opacity-80 mb-2">Hier ziet u een overzicht van uw reserveringen
						</p>
					</div>
					<div
						class="grid grid-cols-2 border rounded-lg md:max-w-[20rem] overflow-hidden bg-gray-100 cursor-pointer">
						<div class="flex justify-center items-center py-1"
							:class="activeTab === 'upcoming' ? 'bg-[#4e995b] text-[#c8e7cd] rounded-lg' : 'bg-gray-100'"
							@click="setActiveTab('upcoming')">
							<span class="text-sm">Aankomende</span>
						</div>
						<div class="flex justify-center items-center py-1"
							:class="activeTab === 'history' ? 'bg-[#4e995b] text-[#c8e7cd] rounded-lg' : 'bg-gray-100'"
							@click="setActiveTab('history')">
							<span class="text-sm">Geschiedenis</span>
						</div>
					</div>
					<hr class="pb-2 mt-3" />
				</div>
				<div :class="!installed ? 'pb-6' : ' pb-[5.4rem] mt-[11rem] md:mt-[10.5rem]'"
					class="h-fit pt-2 gap-4 px-6">
					<div v-if="!loading" class="grid grid-cols-1 md:grid-cols-3 w-full gap-4">
						<div v-if="reserveringen.length > 0" v-for="reservering in reserveringen"
							:key="reservering.tijd" class="w-full p-4 bg-slate-50 rounded-xl shadow-md">
							<div v-for="restaurant in reservering.restaurant" :key="restaurant.id">
								<h2 class="text-xl font-bold">{{ restaurant.naam }}</h2>
								<p class="text-sm opacity-85 mb-2 -mt-1">Bedankt voor de reservering.</p>
								<NuxtImg :src="restaurant.thumbnail.data.publicUrl" alt="Restaurant Image"
									class="rounded-md mt-2 w-full h-[10rem] object-cover" />
								<div class="flex items-center justify-start gap-2 mt-3 mb-3 text-white text-sm">
									<p class="p-1 px-2 gap-1 flex items-center justify-center rounded-md bg-[#4e995b]">
										<icon name="material-symbols:calendar-month-outline-rounded" size="1.1em" />
										{{ reservering.datum.split("-").reverse().join("-") }}
									</p>
									<p class="p-1 px-2 gap-1 flex items-center justify-center rounded-md bg-[#4e995b]">
										<icon name="material-symbols:nest-clock-farsight-analog-rounded" size="1.1em" />
										{{ reservering.tijd.slice(0, 5) }}
									</p>
									<p class="p-1 px-2 gap-1 flex items-center justify-center rounded-md bg-[#4e995b]">
										<Icon name="material-symbols:emoji-people" size="1.1em" />
										x {{ reservering.personen }}
									</p>
									<button @click="activeTab == 'upcoming' ? openOptions(reservering) : ''"
										class="p-1 px-2 gap-1 flex items-center justify-center rounded-md bg-gray-200 text-black">
										<icon name="material-symbols:more-horiz" size="1.4em" />
									</button>
								</div>
								<p class="text-sm opacity-85 font-bold mb-2 leading-4">
									Locatie:
									<span class="block font-normal">{{ restaurant.locatie }}</span>
								</p>
								<p class="text-sm opacity-85 font-bold leading-4">
									Telefoon:
									<span class="block font-normal text-blue-600 underline">{{ restaurant.tel }}</span>
								</p>
							</div>
						</div>
						<div v-else class="w-full fixed left-0 h-[65vh]">
							<div class="flex flex-col items-center justify-center h-full w-full">
								<div class="flex flex-col items-center justify-center">
									<icon class="w-28 h-28 text-green-800"
										name="material-symbols:sad-tab-outline-rounded" size="1.5em" />
									<p class="text-sm opacity-55 font-bold">Er zijn geen reserveringen gevonden.</p>
									<button @click="refresh"
										class="mt-2 p-1 px-2 bg-green-800 text-white rounded-md flex items-center gap-1">
										<icon :class="loading ? ' animate-spin' : ''" name="material-symbols:refresh"
											size="1.4em" />
										<span> Herladen </span>
									</button>
								</div>
							</div>
						</div>
					</div>
				</div>
			</div>
		</div>
	</div>
	<Modal :title v-model:active="active" v-model:activeDelay="activeDelay">
		<ModalUpdateReservering :updateList :switchModal :closeModal :updateModal :activeTab :deleteId :ResturantId
			:action />
	</Modal>
</template>

<script setup lang="ts">
	const { $pwa }: any = useNuxtApp();
	const router = useRouter();
	const installed = ref(false);
	const activeTab = ref();
	const reserveringen: any = ref([]);

	const loading = ref(false);

	const active = ref(false);
	const activeDelay = ref(false);

	const title = ref("");
	const action = ref("");
	const deleteId = ref("");
	const ResturantId = ref("");

	activeTab.value = router.currentRoute.value.query.tab || "upcoming";
	const { data, refresh: refreshData }: any = await useFetch(`/api/reserverigen?status=${activeTab.value}`);
	reserveringen.value = data.value.reserveringen;

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

	const switchModal = () => {
		activeDelay.value = false;
		setTimeout(() => {
			activeDelay.value = true;
		}, 500);
	};

	const updateModal = (eventName: string) => {
		action.value = eventName;
	};

	const closeModal = () => {
		activeDelay.value = false;
		setTimeout(() => {
			active.value = false;
		}, 100);
	};

	const openModal = () => {
		active.value = true;
		setTimeout(() => {
			activeDelay.value = true;
		}, 100);
	};

	const updateList = (data: any) => {
		loading.value = true;
		setTimeout(() => {
			reserveringen.value = data;
			loading.value = false;
		}, 1000);
	};

	const openOptions = async (data: any) => {
		title.value = data.restaurant[0].naam;
		ResturantId.value = data.restaurant[0].id;
		deleteId.value = data.id;

		openModal();
	};

	const refresh = () => {
		loading.value = true;
		setTimeout(async () => {
			const data: any = await $fetch(`/api/reserverigen?status=${activeTab.value}`);
			reserveringen.value = data.reserveringen;
			router.push({ query: { ...router.currentRoute.value.query, tab: activeTab.value } });
			loading.value = false;
		}, 600);
	};

	const setActiveTab = async (tab: string) => {
		activeTab.value = tab;
		const data: any = await $fetch(`/api/reserverigen?status=${activeTab.value}`);
		reserveringen.value = data.reserveringen;
		router.push({ query: { ...router.currentRoute.value.query, tab } });
	};

	watch(active, (Value) => {
		if (!Value) action.value = "";
	});
</script>
