<template>
	<div class="h-screen">
		<Navigation v-model:OkStatus="OkStatus"></Navigation>
		<div class="fixed w-screen h-full overflow-auto top-0">
			<div :class="!installed ? 'top-[4.2rem] pt-2' : 'top-0 z-40 pt-24'" class="fixed top-0 w-screen z-20 p-3 bg-white"></div>
			<div :class="!installed ? ' mt-[5.5rem]' : ' mt-[7rem]'" class="px-6">
				<div class="rounded-lg overflow-hidden">
					<ClientOnly>
						<swipe :images="restaurantDetails?.images"></swipe>
					</ClientOnly>
				</div>
				<div class="md:hidden mb-4">
					<div :class="restaurantDetails?.images ? '-mt-8 mb-6 pl-3' : ' -mb-4 '" class="flex space-x-2 z-10 relative items-center">
						<div class="inline-flex bg-gray-100 items-center rounded-lg whitespace-nowrap border px-2.5 py-0.5 w-fit text-xs font-semibold transition-colors focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 border-transparent">
							{{ restaurantDetails?.plaats }}
						</div>
						<div class="inline-flex bg-gray-100 items-center rounded-lg whitespace-nowrap border px-2.5 py-0.5 w-fit text-xs font-semibold transition-colors focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 border-transparent">
							{{ restaurantDetails?.keuken }}
						</div>
						<div class="inline-flex bg-gray-100 items-center rounded-lg whitespace-nowrap border px-2.5 py-0.5 w-fit text-xs font-semibold transition-colors focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 border-transparent">
							{{ restaurantDetails?.prijs }}
						</div>
					</div>
				</div>
				<section>
					<div :class="!installed ? ' top-[4em] md:top-[4.7em] ' : ' top-[6.5em] '" class="z-20 bg-white sticky pb-[0.10rem]">
						<div class="flex justify-between items-center">
							<h2 class="text-2xl font-semibold mt-2 -mb-1">
								{{ restaurantDetails?.naam }}
							</h2>
							<div class="flex gap-1 items-center mt-2">
								<p class="text-[#4e995b] font-bold mb-1">{{ restaurantDetails.beoordeling }}/5</p>
								<icon class="w-6 h-6 text-[#4e995b]" name="f7:bubble-right" />
								<p class="text-gray-600 text-base mb-1">{{ beoordelingen?.length }}</p>
							</div>
						</div>

						<div class="flex gap-2 items-center justify-between md:justify-end my-2">
							<button @click="openbookingmodal" class="flex text-sm md:hidden text-white items-center justify-center p-1 px-4 bg-[#4e995b] rounded-lg">Reserveren</button>
							<div class="flex gap-2 items-center">
								<div class="flex text-sm items-center justify-center text-black bg-gray-100 p-1 px-4 rounded-lg">Menu</div>
								<div :class="!isRestaurantOpen() ? ' bg-red-200 text-red-600' : ' text-black bg-gray-100'" class="flex items-center justify-center p-1 px-4 text-sm rounded-lg">
									{{ isRestaurantOpen() ? "Geopend" : "Gesloten" }}
								</div>
								<button @click="openbookingmodal" class="text-sm hidden md:flex text-white items-center justify-center p-1 px-4 bg-[#4e995b] rounded-lg">Reserveren</button>
							</div>
						</div>

						<p class="flex items-center gap-2 leading-4 md:-mt-10 mt-1">
							{{ restaurantDetails?.beschrijving || " Geen beschrijving beschikbaar" }}
						</p>
						<hr class="my-2 mt-3" />
					</div>
					<div class="md:max-w-[60vw]">
						<div class="md:flex items-center justify-between">
							<div>
								<div class="flex justify-between items-center">
									<h2 class="text-lg font-semibold">Locatie</h2>
								</div>
								<p class="text-gray-600 text-sm md:text-base text-balance leading-4">
									{{ restaurantDetails?.locatie || "Onbekend" }}
								</p>
							</div>
							<div class="mt-2">
								<h2 class="text-lg font-semibold md:text-right">Telefoon</h2>
								<p class="text-gray-600 text-sm md:text-base underline leading-4 md:text-right">
									<a :href="`tel:${restaurantDetails?.telefoon}`">{{ restaurantDetails?.telefoon || "Onbekend" }}</a>
								</p>
							</div>
						</div>
						<div class="mt-2">
							<h2 class="text-lg font-semibold">Openingstijden</h2>
							<div class="text-gray-600">
								<div v-if="restaurantDetails?.Openingstijden" v-for="(item, index) in restaurantDetails?.Openingstijden" :key="index" class="flex justify-between" :class="{ 'font-bold': item.dag === huidigeDag }">
									<p class="text-sm md:text-base">{{ item.dag }}</p>
									<p class="text-sm md:text-base">{{ item.tijd }}</p>
								</div>
								<div v-else>
									<p class="text-gray-600 leading-4 text-sm md:text-base">Er is geen informatie beschikbaar over de openingstijden van dit restaurant.</p>
								</div>
							</div>
						</div>
					</div>
					<hr class="my-2 mt-3 md:max-w-[60vw]" />
				</section>
				<section>
					<div :class="!installed ? ' top-[4em] md:top-[4.7em] ' : ' top-[6.5em] '" class="z-20 bg-white sticky pb-[0.10rem]">
						<h2 class="text-2xl font-semibold mt-2 -mb-1">Recensies</h2>
						<div class="bg-[#f3f4f3] mt-3 rounded-lg md:max-w-[60vw] p-3">
							<div class="flex gap-2 justify-between items-center">
								<div class="flex items-center justify-center gap-4">
									<div class="w-24 h-24 md:w-32 md:h-32">
										<svg class="w-full h-full" viewBox="0 0 100 100">
											<circle class="text-gray-200 stroke-current" stroke-width="5" cx="50" cy="50" r="40" fill="transparent"></circle>
											<circle class="text-[#4e995b] progress-ring__circle stroke-current" stroke-width="5" stroke-linecap="round" cx="50" cy="50" r="40" fill="transparent" :stroke-dashoffset="strokeDashOffset" :stroke-dasharray="strokeDashArray"></circle>
											<text x="50" y="50" font-family="Verdana" font-size="16" text-anchor="middle" alignment-baseline="middle">{{ restaurantDetails.beoordeling }}/5</text>
										</svg>
									</div>
									<div class="">
										<p class="text-[#4e995b] font-bold mt-1">
											{{ percentage > 0 && percentage < 10 ? "Zeer slecht" : percentage >= 10 && percentage < 20 ? "Slecht" : percentage >= 20 && percentage < 30 ? "Matig" : percentage >= 30 && percentage < 40 ? "Redelijk" : percentage >= 40 && percentage < 50 ? "Gemiddeld" : percentage >= 50 && percentage < 60 ? "Voldoende" : percentage >= 60 && percentage < 70 ? "Goed" : percentage >= 70 && percentage < 80 ? "Zeer goed" : percentage >= 80 && percentage < 90 ? "Uitstekend" : percentage >= 90 && percentage <= 100 ? "Perfect" : " Nog geen beoordelingen" }}
										</p>
										<p class="text-gray-400 text-sm -mt-1">Gebaseerd op {{ beoordelingen?.length }} recensies</p>
										<div class="flex gap-2 -mt-1">
											<button v-if="OkStatus" @click="openrecensiemodal" class="flex items-center text-sm justify-center text-white p-[0.15rem] px-4 bg-[#4e995b] rounded-lg mt-2">Beoordeel</button>
											<button v-else class="flex opacity-50 cursor-not-allowed items-center text-sm justify-center text-white p-[0.15rem] px-4 bg-[#4e995b] rounded-lg mt-2">Beoordeel</button>
											<button @click="toonDetailsHandler" class="flex items-center text-sm justify-center text-[#4e995b] p-[0.15rem] px-4 border-2 border-[#4e995b] rounded-lg mt-2">{{ toonDetails ? "Minder" : "Meer" }}</button>
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
													<div class="h-3 rounded bg-green-700" :style="{ width: `${(beoordelingen.filter((b: any) => b.steren === i).length / beoordelingen.length) * 100}%` }"></div>
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
						<div v-if="beoordelingen" v-for="beoordeling in beoordelingen" :class="!installed ? 'last:mb-5' : ' last:mb-24'" class="rounded-lg md:h-[10vh] px-3">
							<div class="flex items-center justify-between gap-2">
								<div class="flex items-center gap-2">
									<NuxtImg draggable="false" :src="beoordeling.user.avatar_url" alt="Profile" class="rounded-full w-7 h-7" />
									<div>
										<h2 class="font-semibold flex items-center gap-1">{{ beoordeling.user.full_name }} <span class="text-xs opacity-45">• 1 recensie</span></h2>
										<p class="text-gray-600 leading-4 -mt-1 text-sm">
											{{ beoordeling.created_at }}
										</p>
									</div>
								</div>
								<div class="flex items-center gap-2">
									<span class="font-bold">{{ beoordeling.steren }}/5</span>
								</div>
							</div>
							<p class="text-gray-400 leading-4 mt-1 mb-2 text-sm">
								{{ beoordeling.beoordeling }}
							</p>
							<hr class="" />
						</div>
						<div v-else :class=" !installed? '' : 'mb-20' "></div>
					</div>
				</section>
			</div>
		</div>
	</div>
	<ModalRecensie :title="title" v-model:active="active" v-model:activeDelay="activeDelay">
		<div v-if="title != 'Reserveren'">
			<p class="-mt-3 text-gray-600">
				Plaats hier een recensie over <span class="font-bold">{{ restaurantDetails?.naam }}</span
				>.
			</p>
			<hr class="my-2 mb-2" />
			<FormWizard :validation-schema="validationSchema" @submit="onSubmit">
				<FormStep>
					<FieldArea type="text" label="" name="recensie" value="Laat hier je beoordeling achter zodat wij onze service kunnen verbeteren" />
				</FormStep>
				<FormStep>
					<div class="pt-4 flex h-68 md:h-72 items-center w-full justify-center">
						<slider name="beoordeling"></slider>
						<ErrorMessage name="beoordeling" />
					</div>
				</FormStep>
			</FormWizard>
		</div>
		<div v-else>
			<p class="-mt-3 text-gray-600">
				Reserveer een tafel bij <span class="font-bold">{{ restaurantDetails?.naam }}</span
				>.
			</p>
			<hr class="my-2" />
		</div>
	</ModalRecensie>
</template>

<script setup lang="ts">
	import { configure } from "vee-validate";
	import * as yup from "yup";

	const validationSchema = [
		yup.object({
			recensie: yup
				.string()
				.required("Recensie is verplicht")
				.label("Recensie")
				.min(50, "Recensie moet minimaal 50 tekens bevatten")
				.max(2500, "Recensie mag maximaal 2500 tekens bevatten")
				.test("word-count", "Recensie moet meer dan 10 woorden bevatten", (value) => {
					if (!value) return false;
					const wordCount = value.trim().split(/\s+/).length;
					return wordCount > 10;
				}),
		}),
		yup.object({
			beoordeling: yup.number().required("beoordeling is verplicht").label("beoordeling"),
		}),
	];

	function onSubmit(formData: any) {
		activeDelay.value = false;
		setTimeout(() => {
			active.value = false;
		}, 100);

		console.log(JSON.stringify(formData, null, 2));
	}

	configure({
		validateOnBlur: true,
		validateOnChange: true,
		validateOnInput: true,
		validateOnModelUpdate: true,
	});

	const id = useRoute().params.id;
	const { $pwa }: any = useNuxtApp();
	const installed = ref(false);
	const restaurantDetails = ref<any | null>(null);
	const toonDetails = ref(false);
	const title = ref("");
	const active = ref(false);
	const activeDelay = ref(false);
	const percentage = ref();
	const beoordelingen: any = ref([]);
	const user = ref();
	const OkStatus = ref(false);

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

	const huidigeDag = computed(() => {
		const dagen = ["Zondag", "Maandag", "Dinsdag", "Woensdag", "Donderdag", "Vrijdag", "Zaterdag"];
		const huidigeDagIndex = new Date().getDay();
		return dagen[huidigeDagIndex];
	});

	const isRestaurantOpen = () => {
		const currentTime = new Date();
		const openingTime = new Date();
		const closingTime = new Date();

		if (!restaurantDetails.value?.Openingstijden) return false;
		const todaysHours = restaurantDetails.value?.Openingstijden.find((item: any) => item.dag === huidigeDag.value);
		if (!todaysHours) return false;

		const [open, close] = todaysHours.tijd.split(" - ");

		openingTime.setHours(Number(open.split(":")[0]));
		openingTime.setMinutes(Number(open.split(":")[1]));

		closingTime.setHours(Number(close.split(":")[0]));
		closingTime.setMinutes(Number(close.split(":")[1]));

		return currentTime >= openingTime && currentTime <= closingTime;
	};

	const { data, error }: Record<string, any> = await useFetch(`/api/restaurants/${id}`);
	if (!error.value) restaurantDetails.value = data.value.restaurant;
	if (error.value) navigateTo("/home");

	const { data: userData, error: userError }: Record<string, any> = await useFetch("/api/users");
	const { data: beoordelingenData }: Record<string, any> = await useFetch(`/api/restaurants/${restaurantDetails.value.id}/recenties`);
	beoordelingen.value = beoordelingenData.value.recenties;

	OkStatus.value = userError.value ? false : true;
	user.value = userData.value || userError.value.data;

	percentage.value = (restaurantDetails.value.beoordeling / 5) * 100;

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
