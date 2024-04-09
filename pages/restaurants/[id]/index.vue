<template>
	<div class="h-screen">
		<Navigation></Navigation>
		<div class="fixed w-screen h-full overflow-auto top-0">
			<div class="mt-36">
				<div :class="!installed ? 'top-[5rem] fixed ' : 'top-0 pt-20  md:top-0 md:-mt-5 fixed'" class="w-full z-20 -mt-2 md:-mt-0 px-6 bg-white">
					<div class="">
						<div class="flex justify-between items-center">
							<h1 class="text-3xl font-bold">{{ restaurantDetails.naam }}</h1>
							<div class="md:flex gap-2 hidden">
								<button class="flex items-center justify-center text-black bg-gray-100 p-1 px-4 rounded-lg">Menu</button>

								<button @click="openbookingmodal" class="flex text-white items-center justify-center p-1 px-4 bg-[#4e995b] rounded-lg">Reserveren</button>
							</div>
						</div>
						<p class="text-gray-600 mb-4 leading-5 text-balance">{{ restaurantDetails.beschrijving }}</p>
					</div>
					<div class="md:flex hidden items-center space-x-2 mb-3 -mt-2">
						<div class="inline-flex bg-gray-100 items-center rounded-lg whitespace-nowrap border px-2.5 py-0.5 w-fit text-xs font-semibold transition-colors focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 border-transparent">
							{{ restaurantDetails.plaats }}
						</div>
						<div class="inline-flex bg-gray-100 items-center rounded-lg whitespace-nowrap border px-2.5 py-0.5 w-fit text-xs font-semibold transition-colors focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 border-transparent">
							{{ restaurantDetails.keuken }}
						</div>
						<div class="inline-flex bg-gray-100 items-center rounded-lg whitespace-nowrap border px-2.5 py-0.5 w-fit text-xs font-semibold transition-colors focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 border-transparent">
							{{ restaurantDetails.prijs }}
						</div>
					</div>
					<hr class="my-2" />
				</div>
			</div>
			<div :class="!installed ? ' mt-[11.9rem]' : ' mt-[11.5rem]'" class="px-6">
				<div class="rounded-lg overflow-hidden">
					<swipe :publicUrl="restaurantDetails.thumbnail.data.publicUrl"></swipe>
				</div>
				<div class="md:hidden mb-4">
					<div class="flex z-10 relative items-center space-x-2 pl-3 -mt-8 mb-6">
						<div class="inline-flex bg-gray-100 items-center rounded-lg whitespace-nowrap border px-2.5 py-0.5 w-fit text-xs font-semibold transition-colors focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 border-transparent">
							{{ restaurantDetails.plaats }}
						</div>
						<div class="inline-flex bg-gray-100 items-center rounded-lg whitespace-nowrap border px-2.5 py-0.5 w-fit text-xs font-semibold transition-colors focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 border-transparent">
							{{ restaurantDetails.keuken }}
						</div>
						<div class="inline-flex bg-gray-100 items-center rounded-lg whitespace-nowrap border px-2.5 py-0.5 w-fit text-xs font-semibold transition-colors focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 border-transparent">
							{{ restaurantDetails.prijs }}
						</div>
					</div>
					<div class="flex gap-2 -mb-2">
						<button class="flex items-center justify-center text-black bg-gray-100 p-1 px-4 rounded-lg">Menu</button>

						<button @click="openbookingmodal" class="flex text-white items-center justify-center p-1 px-4 bg-[#4e995b] rounded-lg">Reserveren</button>
					</div>
				</div>
				<section>
					<div class="z-20 bg-white sticky top-[10.7em] pb-[0.10rem]">
						<h2 class="text-2xl font-semibold mt-2 -mb-1">Recensies</h2>
						<div class="bg-[#f4f6f4] mt-3 rounded-lg md:max-w-[60vw] p-3">
							<div class="flex gap-2 justify-between items-center">
								<div class="flex items-center justify-center gap-4">
									<div class="w-24 h-24 md:w-32 md:h-32">
										<svg class="w-full h-full" viewBox="0 0 100 100">
											<circle class="text-gray-200 stroke-current" stroke-width="5" cx="50" cy="50" r="40" fill="transparent"></circle>
											<circle class="text-[#4e995b] progress-ring__circle stroke-current" stroke-width="5" stroke-linecap="round" cx="50" cy="50" r="40" fill="transparent" :stroke-dashoffset="strokeDashOffset" :stroke-dasharray="strokeDashArray"></circle>
											<text x="50" y="50" font-family="Verdana" font-size="16" text-anchor="middle" alignment-baseline="middle">{{ gemiddelde }}/5</text>
										</svg>
									</div>
									<div class="">
										<p class="text-[#4e995b] font-bold mt-1">
											{{ percentage > 0 && percentage < 10 ? "Zeer slecht" : percentage >= 10 && percentage < 20 ? "Slecht" : percentage >= 20 && percentage < 30 ? "Matig" : percentage >= 30 && percentage < 40 ? "Redelijk" : percentage >= 40 && percentage < 50 ? "Gemiddeld" : percentage >= 50 && percentage < 60 ? "Voldoende" : percentage >= 60 && percentage < 70 ? "Goed" : percentage >= 70 && percentage < 80 ? "Zeer goed" : percentage >= 80 && percentage < 90 ? "Uitstekend" : percentage >= 90 && percentage <= 100 ? "Perfect" : "" }}
										</p>
										<p class="text-gray-400 text-sm -mt-1">Gebaseerd op {{ beoordelingen.length }} recensies</p>
										<div class="flex gap-2 -mt-1">
											<button @click="openrecensiemodal" class="flex items-center text-sm justify-center text-white p-[0.15rem] px-4 bg-[#4e995b] rounded-lg mt-2">Beoordeel</button>
											<button @click="toonDetailsHandler" class="flex items-center text-sm justify-center text-[#4e995b] p-[0.15rem] px-4 border-2 border-[#4e995b] rounded-lg mt-2">Info</button>
										</div>
									</div>
								</div>
							</div>
							<Transition name="details">
								<div v-if="toonDetails">
									<hr class="pb-2 mt-2" />
									<div>
										<div v-for="i in reverseRatings" :key="i" class="-mb-1">
											<div class="flex items-center mb-1">
												<div>{{ i }}</div>
												<div class="w-full bg-gray-200 ml-2 rounded">
													<div class="h-3 rounded bg-green-700" :style="{ width: `${(beoordelingen.filter((b: any) => b.beoordeling === i).length / beoordelingen.length) * 100}%` }"></div>
												</div>
											</div>
										</div>
									</div>
								</div>
							</Transition>
						</div>
						<hr class="my-2 mt-3" />
					</div>

					<div class="mt-1 z-10 grid grid-cols-1 gap-2 rounded-lg">
						<div v-for="beoordeling in beoordelingen" :class="!installed ? 'last:mb-5' : ' last:mb-24'" class="rounded-lg md:h-[10vh] px-3">
							<div class="flex items-center justify-between gap-2">
								<div class="flex items-center gap-2">
									<NuxtImg draggable="false" :src="beoordeling.picture.thumbnail" alt="Profile" class="rounded-full w-7 h-7" />
									<div>
										<h2 class="font-semibold flex items-center gap-1">{{ beoordeling.name.first }} {{ beoordeling.name.last }} <span class="text-xs opacity-45">• 1 recensie</span></h2>
										<p class="text-gray-600 leading-4 -mt-1 text-sm">17 maart 2024</p>
									</div>
								</div>
								<div class="flex items-center gap-2">
									<span class="font-bold">{{ beoordeling.beoordeling }}/5</span>
								</div>
							</div>
							<p class="text-gray-400 leading-4 mt-1 mb-2 text-sm">Lorem ipsum dolor sit amet, consectetur adipiscing elit. Nullam nec purus.</p>
							<hr class="" />
						</div>
					</div>
				</section>
			</div>
		</div>
	</div>
	<ModalRecensie :title="title" v-model:active="active" v-model:activeDelay="activeDelay">
		<div v-if="title != 'Reserveren'"></div>
		<div v-else></div>
	</ModalRecensie>
</template>

<script setup lang="ts">
	const id = useRoute().params.id;
	const { $pwa }: any = useNuxtApp();
	const installed = ref(false);
	const restaurantDetails = ref<any | null>(null);
	const toonDetails = ref(false);
	const title = ref("");
	const active = ref(false);
	const activeDelay = ref(false);
	const gemiddelde = ref();
	const percentage = ref();
	const beoordelingen: any = ref([0]);

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

	const { data: beoordelingenData }: Record<string, any> = await useFetch(`/api/restaurants/:id/recenties`);
	const { data: userdata }: Record<string, any> = await useFetch(`https://randomuser.me/api/?results=${beoordelingenData.value.length}`);

	gemiddelde.value = Math.round((beoordelingenData.value.reduce((a: number, b: number) => a + b, 0) / beoordelingenData.value.length) * 10) / 10;
	percentage.value = (gemiddelde.value / 5) * 100;

	beoordelingen.value = userdata.value.results.map((user: any, index: string | number) => {
		return { ...user, beoordeling: beoordelingenData.value[index] };
	});

	const strokeDashOffset = computed(() => {
		const circumference = 2 * Math.PI * 40;
		return circumference - (circumference * percentage.value) / 100;
	});

	const strokeDashArray = computed(() => {
		return 2 * Math.PI * 40;
	});

	const reverseRatings = computed(() => {
		return [5, 4, 3, 2, 1];
	});

	const { data, error }: Record<string, any> = await useFetch(`/api/restaurants/${id}`);
	if (!error.value) restaurantDetails.value = data.value.restaurant;

	const openbookingmodal = () => {
		title.value = "Reserveren";
		active.value = true;
		setTimeout(() => {
			activeDelay.value = true;
		}, 100);
	};

	const openrecensiemodal = () => {
		title.value = "Recensie";
		active.value = true;
		setTimeout(() => {
			activeDelay.value = true;
		}, 100);
	};

	const toonDetailsHandler = () => {
		toonDetails.value = !toonDetails.value;
	};

	onMounted(async () => {
		if ($pwa?.isPWAInstalled) installed.value = true;
	});
</script>

<style scoped>
	.progress-ring__circle {
		stroke-dasharray: 250, 250;
		transition: stroke-dashoffset 0.35s;
		transform: rotate(-90deg);
		transform-origin: 50% 50%;
	}

	.details-enter-active,
	.details-leave-active {
		transition: all 0.5s ease;
	}

	.details-enter-from,
	.details-leave-to {
		opacity: 0;
	}
</style>
