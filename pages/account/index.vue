<template>
	<div class="h-screen">
		<VitePwaManifest />
		<Navigation v-model:OkStatus="OkStatus"></Navigation>
		<div :class="!installed ? ' mt-20' : 'mt-14'" class="overflow-hidden">
			<div :class="!installed ? 'top-[4rem] fixed' : 'top-0 pt-14 md:top-0 md:-mt-5 fixed'"
				class="w-full z-10 px-6 bg-white">
				<div class="mb-4">
					<h3 class="xl:text-3xl text-xl font-bold pt-5">Account</h3>
					<p class="xl:text-sm text-xs z-0 opacity-80 mb-2">Hier ziet u een overzicht van uw account.</p>
				</div>
				<hr class="pb-2" />
			</div>
			<div :class="!installed ? ' fixed w-screen h-[90vh] ' : ' fixed w-screen max-h-[72vh]  '"
				class="mt-[5.5rem] overflow-auto pb-5">
				<div class="grid px-6 grid-cols-1 xl:grid-cols-3 gap-2 pb-3 overflow-auto">
					<div class="bg-[#4e995b] text-white p-4 rounded-xl mt-2">
						<div class="flex items-center justify-between">
							<div>
								<h2 class="font-semibold flex items-center gap-1 text-lg">
									{{ User?.name || User?.email.split("@")[0] }}
									<span v-if="User?.email_verified" class="text-sm">
										<icon name="ic:sharp-verified" size="1.5em" class="text-white text-opacity-80">
										</icon>
									</span>
								</h2>
								<p class="text-sm -mt-1 opacity-80">
									{{ User?.email }}
								</p>
							</div>
						</div>

						<p class="my-2">
							<span class="text-sm opacity-70">Eigenschappen:</span>
						</p>
						<div class="flex gap-2">
							<button class="bg-slate-50 p-2 px-3 text-xs text-black rounded-lg"
								@click="openInstellingen">Instellingen</button>
							<p v-if="items?.length > 0" class="bg-[#377642] text-[#cfe7d3] text-xs p-2 rounded-md">
								Restaurant houder</p>
							<p class="bg-[#377642] text-[#cfe7d3] text-xs p-2 rounded-md">Gebruiker</p>
						</div>
						<div class="flex gap-2 mt-3"></div>
					</div>
				</div>
				<div :class="!installed ? 'mb-16' : ''"
					class="grid px-6 grid-cols-1 xl:grid-cols-1 gap-2 pb-6 overflow-auto">
					<div class="bg-slate-50 p-4 rounded-xl mt-2 outline outline-2 outline-gray-100">
						<div class="flex items-center w-full justify-between">
							<div class="w-full">
								<details :open="openDetail === 'restaurants'"
									class="font-semibold flex items-center justify-between gap-1 text-lg">
									<summary @click.prevent="toggleDetail('restaurants')">
										<span>Restaurants</span>
										<span class="text-xs opacity-80">({{ items?.length }})</span>
									</summary>
									<p class="text-sm -my-1 font-normal">
										<span v-if="items?.length > 0" class="text-xs opacity-80"> Lijst met alle
											restaurants onder dit account </span>
										<span v-else class="text-xs opacity-80"> Je hebt geen restaurants onder dit
											account </span>
									</p>
									<button class="bg-gray-300 p-[0.35rem] px-3 text-xs mt-2 text-gray-700 rounded-lg"
										@click="openRestaurant">Voeg een restaurant toe</button>
									<div class="grid gap-2 mt-3 font-normal">
										<div v-if="items?.length > 0" v-for="(item, index) in items"
											class="flex items-center gap-2 bg-slate-50 rounded-lg">
											<div class="w-full">
												<hr class="my-2 mt-1" />
												<div class="flex justify-between gap-2">
													<div class="w-full">
														<div class="flex items-center justify-between gap-2 w-full">
															<h3 class="font-semibold text-md truncate">{{ item?.naam }}
															</h3>
															<div v-if="item?.images && item?.locatie && item?.telefoon && item?.telefoon && item?.Openingstijden"
																class="flex items-center gap-2 text-right pb-2 overflow-auto">
																<span
																	class="bg-[#4e995b] p-1 flex items-center justify-center gap-1 px-3 text-xs text-[#b4e4bc] rounded-lg">
																	<icon name="ic:sharp-star" size="1.2em"></icon>
																	{{ item?.beoordeling.toFixed(1) }}
																</span>
															</div>
															<div v-else
																class="flex items-center gap-2 text-right pb-2 overflow-auto">
																<span
																	class="bg-rose-600 text-white p-1 flex items-center justify-center gap-1 px-3 text-xs rounded-lg">
																	<icon name="ic:round-error" size="1.2em"></icon>
																	Fout
																</span>
															</div>
														</div>
														<p
															class="text-xs opacity-80 text-balance max-w-[85%] line-clamp-2">
															{{ item?.beschrijving }}
														</p>
													</div>
												</div>
												<div class="flex gap-2 mt-1">
													<NuxtLink :to="`/restaurants/${item?.id}/dashboard/`"
														class="bg-gray-300 p-[0.35rem] px-3 text-xs text-gray-800 rounded-lg">
														Beheren</NuxtLink>
													<button
														class="bg-gray-200 p-[0.35rem] px-3 text-xs text-gray-700 rounded-lg">Bewerken</button>
													<button
														class="bg-rose-600 p-[0.35rem] px-3 text-xs text-white rounded-lg">Verwijderen</button>
												</div>
											</div>
										</div>
									</div>
								</details>
							</div>
						</div>
					</div>
				</div>
			</div>
		</div>
	</div>
	<Modal :title v-model:active="active" v-model:activeDelay="activeDelay">
		<div v-if="title == 'Instelling'">
			<p class="-mt-3 text-gray-600">Wijzig hier uw instellingen</p>
			<hr class="my-2 mb-2" />
			<form @submit.prevent="saveSettings">
				<div>
					<label for="name" class="block font-medium text-gray-700">Naam</label>
					<input type="text" id="name" name="name" class="mt-1 p-2 block w-full border rounded-md" />
				</div>

				<div class="mt-4">
					<label for="photo" class="block font-medium text-gray-700">Foto</label>
					<input type="file" id="photo" name="photo" accept="image/*"
						class="mt-1 p-2 block w-full border rounded-md" />
				</div>

				<div class="mt-6 flex gap-2 items-center">
					<div class="bg-[#de4747] text-white p-1 px-4 rounded-lg" @click="deleteAccount">Verwijder account
					</div>
					<button class="bg-gray-200 p-1 px-4 rounded-lg" type="submit">Opslaan</button>
				</div>
			</form>
		</div>
		<div v-else-if="title == 'Restaurant'">
			<p class="-mt-3 text-gray-600">Voeg hier een restaurant toe</p>
			<hr class="my-2 mb-2" />
			<FormWizard @submit="createRestaurant" :validation-schema="Schema">
				<FormStep>
					<FieldInput type="text" label="Naam" name="naam" />
					<FieldInput type="text" label="Keuken" name="keuken" />
					<FieldInput type="text" label="Telefoon" name="telefoon" value="06 12 34 56 78" />
				</FormStep>
				<FormStep>
					<FieldArea type="text" label="Beschrijving" name="beschrijving" />
					<FieldSelect type="text" label="Prijs" name="prijs" :options="values" />
				</FormStep>
				<FormStep>
					<FieldInput type="text" label="Stad" name="stad" />
					<FieldInput type="text" label="Locatie" name="locatie" />
				</FormStep>
				<FormStep>
					<FieldOpeningstijden label="Openingstijden" name="openingstijden"
						v-model:openingTimes="openingTimes" />
				</FormStep>
				<FormStep>
					<FieldInput type="number" label="Tafels" name="tafels" />
					<FieldInput type="number" label="Capaciteit (Personen)" name="capaciteit" />
					<FieldInput type="number" label="Duur" name="duur" />
				</FormStep>
				<FormStep>
					<FieldImage label="Thumbnail" name="thumbnail" :multipe="false" :max="1" v-model:preview="thumbnail"
						v-model:previewArray="thumbnailArray" />
				</FormStep>
				<FormStep>
					<FieldImage label="Afbeeldingen" name="afbeeldingen" :multipe="true" :max="3"
						v-model:preview="afbeeldingen" v-model:previewArray="afbeeldingenArray" />
				</FormStep>
				<FormStep>
					<FieldPdf label="Menu" name="menu" v-model:preview="menu" />
					<div v-if="result" class="flex gap-2 mt-6 mb-2">
						<hr class=" my-3">
						<p :class="result.statusCode != 200 ? 'text-red-600' : 'text-green-800'"
							class="text-sm leading-4 -ml-1">
							{{ result.message }}</p>
					</div>
				</FormStep>
			</FormWizard>
		</div>
	</Modal>
</template>

<script setup lang="ts">
	import { configure } from "vee-validate";
	import * as yup from "yup";

	const { $pwa }: any = useNuxtApp();
	const installed = ref(false);
	const User = ref();
	const items: any = ref([]);
	const openDetail = ref();
	const OkStatus = ref(false);

	const active = ref(false);
	const activeDelay = ref(false);
	const title = ref("Account");

	const result: Record<string, any> = ref("");

	const afbeeldingenArray: any = ref([]);
	const afbeeldingen: any = ref([]);

	const thumbnailArray: any = ref([]);
	const thumbnail: any = ref([]);

	const menu: any = ref("");

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

	const openInstellingen = () => {
		title.value = "Instelling";
		active.value = true;
		setTimeout(() => {
			activeDelay.value = true;
		}, 100);
	};

	const openRestaurant = () => {
		title.value = "Restaurant";
		active.value = true;
		setTimeout(() => {
			activeDelay.value = true;
		}, 100);
	};

	const createRestaurant = async (values: any, actions: any) => {
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
			}
			else if (key === "thumbnail") {
				const blob = new Blob([value[key]], { type: value[key]?.type });
				formData.append(`file:thumbnail`, blob, value[key]?.name);
			}
			else if (key === "menu") {
				const blob = new Blob([value[key]], { type: value[key]?.type });
				formData.append(`file:menu`, blob, value[key]?.name);
			}
			else if (key == "openingstijden") {
				formData.append(key, JSON.stringify(value[key]));
			}
			else {
				formData.append(key, value[key]);
			}
		}

		const { data, error }: any = await useFetch("/api/restaurants", { method: "post", body: formData });
		
		if (error.value) result.value = error.value.data;
		else {
			result.value = data.value;
			setTimeout(() => {
				active.value = false;
				activeDelay.value = false;
			}, 10000);
		}
		
	};

	const saveSettings = async (value: any) => {
		const { data, error }: any = await useFetch("/api/account", {
			method: "put",
			body: value,
		});
		if (error.value) console.log(error.value);
		else navigateTo("/");
	};

	const deleteAccount = async () => {
		const { data, error }: any = await useFetch("/api/account", {
			method: "DELETE",
		});

		if (error.value) console.log(error.value);
		else navigateTo("/");
	};

	const toggleDetail = (detailName: string) => {
		openDetail.value = openDetail.value === detailName ? "" : detailName;
	};

	const ImageDimension = async (value: any) => {
		if (Array.isArray(value)) {
			const dimensions = [];
			for (const file of value) {
				const dimension = await getImageDimension(file);
				dimensions.push(dimension);
			}
			return dimensions;
		} else {
			return await getImageDimension(value);
		}
	};

	const getImageDimension = (file: any) => {
		return new Promise((resolve, reject) => {
			const reader = new FileReader();
			reader.readAsDataURL(file);

			reader.onload = () => {
				const img = new Image();
				img.onload = () => resolve(`${img.width} X ${img.height}`);
				img.src = reader.result as string;
			};
		});
	};

	const isThumbnailDimensionValid = async (value: any) => {
		const data = await ImageDimension(value);

		if (data !== "1728 X 668") return false;
		return true;
	};

	const areDimensionsValid = async (value: any) => {
		const Errors: any = ref([]);
		const data: any = await ImageDimension(value);

		data.forEach((value: any) => {
			if (value !== "1728 X 668") Errors.value.push(false);
		});

		return Errors.value.length < 1;
	};

	const isAtleasttreeFile = (value: any) => {
		return value.length == 3;
	};

	const isFileCountValid = () => {
		return afbeeldingen.value.length <= 3;
	};

	const isFileSizeValid = (file: any) => {
		if (Array.isArray(file)) return file.every((file) => file.size <= 10000000);
		return file && file.size <= 10000000;
	};

	const isFileTypeValid = (file: any) => {
		if (Array.isArray(file)) return file.every((file) => ["image/png", "image/jpeg"].includes(file.type));
		return file && ["image/png", "image/jpeg"].includes(file.type);
	};

	const isFilePdf = (file: any) => {
		if (Array.isArray(file)) return file.every((file) => ["application/pdf"].includes(file.type));
		return file && ["application/pdf"].includes(file.type);
	};

	const Schema = [
		yup.object().shape({
			naam: yup.string().required( "Het invullen van de naam is verplicht."),
			keuken: yup.string().required( "Het invullen van de keuken is verplicht."),
			telefoon: yup.string().matches(phoneRegExp, "Telefoonnummer moet geldig zijn").required( "Het invullen van de telefoonnummer is verplicht."),
		}),
		yup.object().shape({
			beschrijving: yup.string().required( "Het invullen van de beschrijving is verplicht."),
			prijs: yup.string().required( "Het invullen van de prijs is verplicht."),
		}),
		yup.object().shape({
			stad: yup.string().required( "Het invullen van de stad is verplicht."),
			locatie: yup.string().required( "Het invullen van de locatie is verplicht."),
		}),
		yup.object().shape({
			openingstijden: yup.array().of(
				yup.object().shape({
				open: yup.string().required(" Het invullen van de openingstijd is verplicht."),
				sluit: yup.string().required(" Het invullen van de sluitingstijd is verplicht."),
			})
			).required("Het invullen van de openingstijden is verplicht."),
		}),
		yup.object().shape({
			tafels: yup.number().min(1, "Het aantal tafels moet minimaal 1 zijn").required(" Het invullen van het aantal tafels is verplicht."),
			capaciteit: yup.number().min(4, "Het aantal gasten moet minimaal 4 zijn").required( "Het invullen van de capaciteit is verplicht."),
			duur: yup.number().min(1, "Het aantal uren moet minimaal 1 zijn").required( "Het invullen van de duur is verplicht."),
		}),
		yup.object().shape({
			thumbnail: yup.mixed()
			.test("fileSize", "Het bestand overschrijdt de maximale grootte van 10MB.", isFileSizeValid)
			.test("fileType", "Alleen PNG- en JPEG-bestandstypen zijn toegestaan.", isFileTypeValid)
			.test("fileAfmeting", "De afmetingen van het bestand moeten precies 1728 x 668 pixels zijn.", isThumbnailDimensionValid)
			.required("Het uploaden van een thumbnail is verplicht."),
		}),
		yup.object().shape({
			afbeeldingen: yup.array().of(
				yup.mixed()).min(3).max(3)
				.test("minCount", "Het aantal bestanden moet minimaal 3 zijn.", isAtleasttreeFile)
				.test("fileCount", "Het aantal bestanden overschrijdt het maximale aantal van 3.", isFileCountValid)
				.test("fileSize", "Het bestand overschrijdt de maximale grootte van 10MB.", isFileSizeValid)
				.test("fileType", "Alleen PNG- en JPEG-bestandstypen zijn toegestaan.", isFileTypeValid)
				.test("fileAfmeting", "De afmetingen van de bestanden moeten precies 1728 x 668 pixels zijn.", areDimensionsValid)
				.required("Het uploaden van minimaal 3 afbeeldingen is verplicht."
			).required("Het uploaden van minimaal 3 afbeeldingen is verplicht."),
		}),
		yup.object().shape({
			menu: yup.mixed()
			.test("fileSize", "Het bestand overschrijdt de maximale grootte van 10MB.", isFileSizeValid)
			.test("fileType", "Alleen pdf-bestandstypen zijn toegestaan.", isFilePdf)
			.required("Het uploaden van een menukaart is verplicht."),
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
