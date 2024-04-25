<template>
	<div class=" h-screen">
		<Navigation v-model:OkStatus="OkStatus"></Navigation>
		<div :class=" installed ? 'fixed w-screen h-full overflow-auto top-0' : '' ">
			<div :class="!installed ? 'top-[4.5rem] pt-2' : 'top-0 z-40 pt-24'" class="fixed top-0 w-screen z-20 p-3 bg-white"></div>
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
								<p class="text-[#4e995b] font-bold mb-1">{{ restaurantDetails?.beoordeling.toFixed(1) }}/5</p>
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
						<hr class="my-2 md:mt-6 mt-3" />
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
								<p class="text-blue-600 text-sm md:text-base underline leading-4 md:text-right">
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
						<RecensieOverview :restaurantDetails :OkStatus :beoordelingen :openrecensiemodal />
						<hr class="my-2 mt-3" />
					</div>
					<div class="mt-1 z-10 grid grid-cols-1 gap-2 rounded-lg">
						<beoordeling :beoordelingen :installed />
					</div>
				</section>
			</div>
		</div>
	</div>

	<Modal :title v-model:active="active" v-model:activeDelay="activeDelay">
		<div v-if="title != 'Reserveren'">
			<p class="-mt-3 text-gray-600">
				Plaats hier een recensie over
				<span class="font-bold">{{ restaurantDetails?.naam }}</span
				>.
			</p>
			<hr class="my-2 mb-2" />
			<ModalRecensie :isSuccess.value :onSubmit="handleRecentie" />
		</div>
		<div v-else>
			<p class="-mt-3 text-gray-600">
				Reserveer een tafel bij
				<span class="font-bold">{{ restaurantDetails?.naam }}</span
				>.
			</p>
			<hr class="my-2 mb-2" />
			<ModalReservering :emailSend :ResturantId="useRoute().params.id" :restaurantDetails :onSubmit="handleReservering" :OkStatus :user />
		</div>
	</Modal>
</template>

<script setup lang="ts">
	const id = useRoute().params.id;
	const { $pwa }: any = useNuxtApp();
	const installed = ref(false);
	const restaurantDetails = ref<any | null>(null);

	const title = ref("");
	const active = ref(false);
	const activeDelay = ref(false);
	const beoordelingen: any = ref([]);
	const user = ref();

	const OkStatus = ref(false);
	const emailSend = ref(false);
	const isSuccess = ref(false);

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

	const closeModal = () => {
		activeDelay.value = false;
		setTimeout(() => {
			active.value = false;
		}, 100);
	};

	const handleRecentie = async (values: any, actions: any) => {
		const { data, error } = await useFetch(`/api/restaurants/${restaurantDetails.value.id}/recenties`, {
			method: "POST",
			body: values,
		});

		if (error.value) {
			actions.setErrors({
				recensie: error.value.data.message,
				beoordeling: error.value.data.message,
			});
		} else {
			isSuccess.value = true;
			setTimeout(() => {
				actions.resetForm();
				closeModal();
				isSuccess.value = false;
			}, 5000);
		}
	};

	const handleReservering = async (values: any, actions: any) => {
		const { error } = await useFetch(`/api/restaurants/${restaurantDetails.value.id}/reserverigen`, {
			method: "POST",
			body: values,
		});

		if (error.value) {
			actions.setErrors({
				datum: error.value.data.message,
				tijd: error.value.data.message,
				naam: error.value.data.message,
				aantalPersonen: error.value.data.message,
				email: error.value.data.message,
				telefoon: error.value.data.message,
			});
		} else {
			emailSend.value = true;
			setTimeout(() => {
				actions.resetForm();
				closeModal();
				emailSend.value = false;
			}, 5000);
		}
	};

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
	if (error.value) throw createError({
            statusCode: 404,
			message: "Restaurant niet gevonden",
			statusMessage: "Restaurant niet gevonden",
            fatal: true,
        })

	const { data: userData, error: userError }: Record<string, any> = await useFetch("/api/users");
	const { data: beoordelingenData }: Record<string, any> = await useFetch(`/api/restaurants/${restaurantDetails.value?.id}/recenties`);

	beoordelingen.value = beoordelingenData.value.recenties;
	OkStatus.value = userError.value ? false : true;
	user.value = userData.value || userError.value.data;

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

	onMounted(async () => {
		if ($pwa?.isPWAInstalled) installed.value = true;
	});

	watch(OkStatus, async (status) => {
		if (status) {
			const { data: userData, error: userError }: Record<string, any> = await useFetch("/api/users");
			user.value = userData.value || userError.value.data;
		}
	});
</script>
