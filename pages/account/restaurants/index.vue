<template>
	<div class="h-screen">
		<div :class="!installed ? ' mt-20' : 'mt-14'" class="overflow-hidden">
			<div :class="!installed ? 'top-[4rem] fixed' : 'top-0 pt-14 md:top-0 md:-mt-5 fixed'" class="w-full z-10 px-6 bg-white">
				<div class="mb-4">
					<h3 class="xl:text-3xl text-xl font-bold pt-5">Restaurant overzicht</h3>
					<p class="xl:text-sm text-xs z-0 opacity-80 mb-2">Hier vindt u een overzicht van al uw restaurants.</p>
				</div>
				<hr class="pb-2" />
			</div>
			<div :class="!installed ? ' fixed w-screen h-[90vh] ' : ' fixed w-screen max-h-[72vh]  '" class="mt-[5.5rem] overflow-auto pb-5">
				<div :class="!installed ? 'mb-16' : ''" class="grid px-6 gap-2 pb-6 overflow-auto">
					<div class="bg-slate-50 p-4 rounded-xl mt-2 outline outline-2 outline-gray-100">
						<div>
							<span>Restaurants</span>
							<span class="text-xs opacity-80">({{ items?.length }})</span>
						</div>
						<p class="text-sm -my-1 font-normal">
							<span v-if="items?.length > 0" class="text-xs opacity-80"> Lijst met alle restaurants onder dit account </span>
							<span v-else class="text-xs opacity-80"> Je hebt geen restaurants onder dit account </span>
						</p>
						<button class="bg-gray-300 p-[0.35rem] px-3 text-xs mt-2 text-gray-700 rounded-lg" @click="openRestaurant">Voeg een restaurant toe</button>
						<div class="flex items-center w-full justify-between">
							<div class="w-full">
								<div class="font-semibold flex items-center justify-between gap-1 text-lg">
									<div class="grid gap-2 mt-3 font-normal">
										<div v-if="items?.length > 0" v-for="(item, index) in items" class="flex items-center gap-2 bg-slate-50 rounded-lg">
											<div class="w-full">
												<hr class="my-2 mt-1" />
												<div class="flex justify-between gap-2">
													<div class="w-full">
														<div class="flex items-center justify-between gap-2 w-full">
															<h3 class="font-semibold text-md truncate">{{ item?.naam }}</h3>
															<div v-if="item?.images && item?.locatie && item?.telefoon && item?.telefoon && item?.Openingstijden" class="flex items-center gap-2 text-right pb-2 overflow-auto">
																<span class="bg-[#4e995b] p-1 flex items-center justify-center gap-1 px-3 text-xs text-[#b4e4bc] rounded-lg">
																	<icon name="ic:sharp-star" size="1.2em"></icon>
																	{{ item?.beoordeling.toFixed(1) }}
																</span>
															</div>
															<div v-else class="flex items-center gap-2 text-right pb-2 overflow-auto">
																<span class="bg-rose-600 text-white p-1 flex items-center justify-center gap-1 px-3 text-xs rounded-lg">
																	<icon name="ic:round-error" size="1.2em"></icon>
																	Fout
																</span>
															</div>
														</div>
														<p class="text-xs opacity-80 text-balance max-w-[85%] line-clamp-2">
															{{ item?.beschrijving }}
														</p>
													</div>
												</div>
												<div class="flex gap-2 mt-1">
													<NuxtLink :to="`/restaurants/${item?.id}/dashboard/`" class="bg-gray-300 p-[0.35rem] px-3 text-xs text-gray-800 rounded-lg"> Beheren</NuxtLink>
													<button @click="toonWijigingenModal(item)" class="bg-gray-200 p-[0.35rem] px-3 text-xs text-gray-700 rounded-lg">Bewerken</button>
													<button @click="toonDeleteModal(item)" class="bg-rose-600 p-[0.35rem] px-3 text-xs text-white rounded-lg">Verwijderen</button>
												</div>
											</div>
										</div>
									</div>
								</div>
							</div>
						</div>
					</div>
				</div>
			</div>
		</div>
	</div>
	<Modal :title v-model:active="active" v-model:activeDelay="activeDelay">
		<div v-if="title == 'Verwijderen'">
			<p class="-mt-2 text-gray-600">
				Weet u zeker dat u het restaurant <span class="font-semibold">{{ nameRestaurant }}</span> wilt verwijderen?
			</p>
			<p class="text-red-600 text-sm leading-4 mt-4">Alle gegevens van het restaurant worden verwijderd en kunnen niet worden hersteld, zelfs de reserveringen en recenties!</p>
			<hr class="my-2 mb-2" />
			<div class="flex gap-2 w-full items-center">
				<button class="bg-[#de4747] text-white p-1 px-4 rounded-lg" @click="deleteResturant(valueId)">
					<span v-if="displayLoading" class="">
						<icon class="animate-spin" name="pajamas:repeat" size="1.3rem"> </icon>
					</span>
					<span v-else> Ja verwijderen </span>
				</button>
				<button @click="closeModal" class="bg-gray-200 p-1 px-4 rounded-lg">Nee toch niet</button>
			</div>
		</div>
		<div v-else-if="title == 'Restaurant'">
			<p class="-mt-2 text-gray-600">Voeg hier een restaurant toe</p>
			<hr class="my-2 mb-2" />
			<ModalAanmaken :options="values" v-model:afbeeldingen="afbeeldingen" :Schema v-model:openingTimes="openingTimes" v-model:thumbnail="thumbnail" v-model:thumbnailArray="thumbnailArray" v-model:afbeeldingenArray="afbeeldingenArray" v-model:menu="menu" :result :onSubmit="createRestaurant"> </ModalAanmaken>
		</div>
		<div v-else-if="title == 'Wijzigen'">
			<p class="-mt-2 text-gray-600">
				Wijzig hier het restaurant <span class="font-semibold">{{ nameRestaurant }}</span>
			</p>
			<hr class="my-2 mb-2" />
			<ModalUpdaten :details :options="values" :Schema :result :onSubmit="updateRestaurant"></ModalUpdaten>
		</div>
	</Modal>
</template>

<script setup lang="ts">
	import { configure } from "vee-validate";
	import * as yup from "yup";

	const { $pwa }: any = useNuxtApp();
	const installed = ref(false);
	const User: any = ref();
	const items: any = ref([]);
	const openDetail = ref();

	const active = ref(false);
	const activeDelay = ref(false);
	const title = ref("Account");
	const details = ref("");

	const displayLoading = ref(false);
	const result: Record<string, any> = ref("");
	provide("displayLoading", displayLoading);

	const afbeeldingenArray: any = ref([]);
	const afbeeldingen: any = ref([]);

	const thumbnailArray: any = ref([]);
	const thumbnail: any = ref([]);

	const nameRestaurant: any = ref("");
	const valueId: any = ref("");
	const menu: any = ref(null);

	const values = [
		{ value: "Laag", text: "€" },
		{ value: "Gemiddeld", text: "€€" },
		{ value: "Hoog", text: "€€€" },
	];

	const phoneRegExp = /^[0-9]{2} [0-9]{2} [0-9]{2} [0-9]{2} [0-9]{2}$/;
	const openingTimes = ref([
		{ dag: "Maandag", open: undefined, sluit: undefined },
		{ dag: "Dinsdag", open: undefined, sluit: undefined },
		{ dag: "Woensdag", open: undefined, sluit: undefined },
		{ dag: "Donderdag", open: undefined, sluit: undefined },
		{ dag: "Vrijdag", open: undefined, sluit: undefined },
		{ dag: "Zaterdag", open: undefined, sluit: undefined },
		{ dag: "Zondag", open: undefined, sluit: undefined },
	]);

	useSeoMeta({
		title: "EET | Overzicht",
		description: "",
		ogTitle: "EET | Overzicht",
		ogDescription: "",
		ogImage: "/image/banner.png",
		ogUrl: "https://eet.com",
		twitterTitle: "EET | Overzicht",
		twitterDescription: "",
		twitterImage: "/image/banner.png",
		twitterCard: "summary",
	});

	definePageMeta({
		middleware: "auth",
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

	const { data: user }: Record<string, any> = await useFetch("/api/users");
	const { data }: Record<string, any> = await useFetch("/api/restaurants", { params: { searchOwner: true } });
	User.value = user.value?.user;
	items.value = data.value.restaurants;

	onMounted(() => {
		if ($pwa.isPWAInstalled) installed.value = true;
	});

	const closeModal = () => {
		activeDelay.value = false;
		setTimeout(() => {
			active.value = false;
		}, 100);
	};

	const openRestaurant = () => {
		title.value = "Restaurant";
		active.value = true;
		setTimeout(() => {
			activeDelay.value = true;
		}, 100);
	};

	const updateRestaurant = async (values: any, actions: any) => {
		displayLoading.value = true;

		const value = {
			...values,
		};

		const formData = new FormData();

		for (const key in value) {
			if (key === "afbeeldingen") {
				value[key]?.forEach((file: any, index: number) => {
					const blob = new Blob([file], { type: file.type });
					formData.append(`file:afbeeldingen[${index}]`, blob, file.name);
				});
			} else if (key === "thumbnail") {
				const blob = new Blob([value[key]], { type: value[key]?.type });
				formData.append(`file:thumbnail`, blob, value[key]?.name);
			} else if (key === "menu") {
				const blob = new Blob([value[key]], { type: value[key]?.type });
				formData.append(`file:menu`, blob, value[key]?.name);
			} else if (key == "openingstijden") {
				formData.append(key, JSON.stringify(value[key]));
			} else {
				formData.append(key, value[key]);
			}
		}

		const { pending, data, error }: any = await useFetch(`/api/restaurants/${valueId.value}`, { method: "patch", body: formData });

		displayLoading.value = pending.value;
		if (error.value) result.value = error.value.data;
		if (!error.value) {
			result.value = data.value;
			const { data: resturannt }: Record<string, any> = await useFetch("/api/restaurants", { params: { searchOwner: true } });
			items.value = resturannt.value.restaurants;
			setTimeout(() => {
				closeModal();
			}, 4000);
		}
	};

	const createRestaurant = async (values: any, actions: any) => {
		displayLoading.value = true;
		const value = {
			...values,
		};

		const formData = new FormData();

		for (const key in value) {
			if (key === "afbeeldingen") {
				value[key]?.forEach((file: any, index: number) => {
					const blob = new Blob([file], { type: file.type });
					formData.append(`file:afbeeldingen[${index}]`, blob, file.name);
				});
			} else if (key === "thumbnail") {
				const blob = new Blob([value[key]], { type: value[key]?.type });
				formData.append(`file:thumbnail`, blob, value[key]?.name);
			} else if (key === "menu") {
				const blob = new Blob([value[key]], { type: value[key]?.type });
				formData.append(`file:menu`, blob, value[key]?.name);
			} else if (key == "openingstijden") {
				formData.append(key, JSON.stringify(value[key]));
			} else {
				formData.append(key, value[key]);
			}
		}

		const { pending, data, error }: any = await useFetch("/api/restaurants", { method: "post", body: formData });

		displayLoading.value = pending.value;
		if (error.value) result.value = error.value.data;
		if (!error.value) {
			result.value = data.value;
			const { data: resturannt }: Record<string, any> = await useFetch("/api/restaurants", { params: { searchOwner: true } });
			items.value = resturannt.value.restaurants;
			setTimeout(() => {
				closeModal();
			}, 4000);
		}
	};

	const toonWijigingenModal = async (item: any) => {
		const { data }: Record<string, any> = await useFetch(`/api/restaurants/${item.id}`);

		details.value = data.value.restaurant;
		valueId.value = item.id;
		nameRestaurant.value = item.naam;
		title.value = "Wijzigen";
		active.value = true;
		setTimeout(() => {
			activeDelay.value = true;
		}, 100);
	};

	const toonDeleteModal = (item: any) => {
		nameRestaurant.value = item.naam;
		valueId.value = item.id;
		title.value = "Verwijderen";
		active.value = true;
		setTimeout(() => {
			activeDelay.value = true;
		}, 100);
	};

	const deleteResturant = async (id: string) => {
		displayLoading.value = true;
		const { data, error, pending }: any = await useFetch(`/api/restaurants/${id}`, {
			method: "DELETE",
		});

		displayLoading.value = pending.value;

		if (!error.value) {
			result.value = data.value;
			const { data: restaurants }: Record<string, any> = await useFetch("/api/restaurants", { params: { searchOwner: true } });
			setTimeout(() => {
				items.value = restaurants.value.restaurants;
				closeModal();
			}, 4000);
		}
	};

	const isAtleasttreeFile = (value: any) => {
		return value.length == 3;
	};

	const isFileCountValid = () => {
		return afbeeldingen.value.length <= 3;
	};

	const isFileSizeValid = (file: any) => {
		try {
			new URL(file);
			return true;
		} catch (_) {
			try {
				file.includes("pdf");
				return true;
			} catch {}
			if (Array.isArray(file)) return file.every((file) => file.size <= 10000000);
			return file && file.size <= 10000000;
		}
	};

	const isFileTypeValid = (file: any) => {
		try {
			new URL(file);
			return true;
		} catch (_) {
			if (Array.isArray(file)) return file.every((file) => ["image/png", "image/jpeg"].includes(file.type));
			return file && ["image/png", "image/jpeg"].includes(file.type);
		}
	};

	const isFilePdf = (file: any) => {
		try {
			new URL(file);
			return true;
		} catch (_) {
			try {
				file.includes("pdf");
				return true;
			} catch {}
			if (Array.isArray(file)) return file.every((file) => ["application/pdf"].includes(file.type));
			return file && ["application/pdf"].includes(file.type);
		}
	};

	const Schema = [
		yup.object().shape({
			naam: yup.string().required("Het invullen van de naam is verplicht."),
			keuken: yup.string().required("Het invullen van de keuken is verplicht."),
			telefoon: yup.string().matches(phoneRegExp, "Telefoonnummer moet geldig zijn").required("Het invullen van de telefoonnummer is verplicht."),
		}),
		yup.object().shape({
			beschrijving: yup.string().required("Het invullen van de beschrijving is verplicht."),
			prijs: yup.string().required("Het invullen van de prijs is verplicht."),
		}),
		yup.object().shape({
			stad: yup.string().required("Het invullen van de stad is verplicht."),
			locatie: yup.string().required("Het invullen van de locatie is verplicht."),
		}),
		yup.object().shape({
			openingstijden: yup
				.array()
				.of(
					yup.object().shape({
						open: yup.string().required(" Het invullen van de openingstijd is verplicht."),
						sluit: yup.string().required(" Het invullen van de sluitingstijd is verplicht."),
					})
				)
				.required("Het invullen van de openingstijden is verplicht."),
		}),
		yup.object().shape({
			tafels: yup.number().min(1, "Het aantal tafels moet minimaal 1 zijn").required(" Het invullen van het aantal tafels is verplicht."),
			capaciteit: yup.number().min(4, "Het aantal gasten moet minimaal 4 zijn").required("Het invullen van de capaciteit is verplicht."),
			duur: yup.number().min(1, "Het aantal uren moet minimaal 1 zijn").required("Het invullen van de duur is verplicht."),
		}),
		yup.object().shape({
			thumbnail: yup.mixed().test("fileSize", "Het bestand overschrijdt de maximale grootte van 10MB.", isFileSizeValid).test("fileType", "Alleen PNG- en JPEG-bestandstypen zijn toegestaan.", isFileTypeValid).required("Het uploaden van een thumbnail is verplicht."),
		}),
		yup.object().shape({
			afbeeldingen: yup.array().of(yup.mixed()).min(3).max(3).test("minCount", "Het aantal bestanden moet minimaal 3 zijn.", isAtleasttreeFile).test("fileCount", "Het aantal bestanden overschrijdt het maximale aantal van 3.", isFileCountValid).test("fileSize", "Het bestand overschrijdt de maximale grootte van 10MB.", isFileSizeValid).test("fileType", "Alleen PNG- en JPEG-bestandstypen zijn toegestaan.", isFileTypeValid).required("Het uploaden van minimaal 3 afbeeldingen is verplicht.").required("Het uploaden van minimaal 3 afbeeldingen is verplicht."),
		}),
		yup.object().shape({
			menu: yup.mixed().test("fileSize", "Het bestand overschrijdt de maximale grootte van 10MB.", isFileSizeValid).test("fileType", "Alleen pdf-bestandstypen zijn toegestaan.", isFilePdf).required("Het uploaden van een menukaart is verplicht."),
		}),
	];

	configure({
		validateOnBlur: true,
		validateOnChange: true,
		validateOnInput: true,
		validateOnModelUpdate: true,
	});

	watch(active, (value) => {
		if (!value) {
			result.value = "";
			menu.value = "";
			thumbnail.value = [];
			thumbnailArray.value = [];
			afbeeldingen.value = [];
			afbeeldingenArray.value = [];
			openingTimes.value = [
				{ dag: "Maandag", open: undefined, sluit: undefined },
				{ dag: "Dinsdag", open: undefined, sluit: undefined },
				{ dag: "Woensdag", open: undefined, sluit: undefined },
				{ dag: "Donderdag", open: undefined, sluit: undefined },
				{ dag: "Vrijdag", open: undefined, sluit: undefined },
				{ dag: "Zaterdag", open: undefined, sluit: undefined },
				{ dag: "Zondag", open: undefined, sluit: undefined },
			];
		}
	});
</script>

