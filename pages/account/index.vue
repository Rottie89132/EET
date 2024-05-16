<template>
	<div class="h-screen">
		<div :class="!installed ? ' mt-20' : 'mt-14'" class="overflow-hidden">
			<div :class="!installed ? 'top-[4rem] fixed' : 'top-0 pt-14 md:top-0 md:-mt-5 fixed'" class="w-full z-10 px-6 bg-white">
				<div class="mb-4">
					<h3 class="xl:text-3xl text-xl font-bold pt-5">Account</h3>
					<p class="xl:text-sm text-xs z-0 opacity-80 mb-2">Hier ziet u een overzicht van uw account.</p>
				</div>
				<hr class="pb-2" />
			</div>
			<div :class="!installed ? ' fixed w-screen h-[90vh] ' : ' fixed w-screen max-h-[72vh]  '" class="mt-[5.5rem] overflow-auto pb-5">
				<div class="grid px-6 grid-cols-1 xl:grid-cols-3 gap-2 pb-3 overflow-auto">
					<div class="bg-[#4e995b] text-white p-4 rounded-xl mt-2">
						<div class="flex items-center justify-between">
							<div>
								<h2 class="font-semibold flex items-center gap-1 text-lg">
									{{ User?.name || User?.email.split("@")[0] }}
									<span v-if="User?.email_verified" class="text-sm">
										<icon name="ic:sharp-verified" size="1.5em" class="text-white text-opacity-80"> </icon>
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
							<button class="bg-slate-50 p-2 px-3 text-xs text-black rounded-lg" @click="openInstellingen">Instellingen</button>
							<p v-if="items?.length > 0" class="bg-[#377642] text-[#cfe7d3] text-xs p-2 rounded-md">Restaurant houder</p>
							<p class="bg-[#377642] text-[#cfe7d3] text-xs p-2 rounded-md">Gebruiker</p>
						</div>
						<div class="flex gap-2 mt-3"></div>
					</div>
				</div>
				<div :class="!installed ? 'mb-16' : ''" class="grid px-6 grid-cols-1 xl:grid-cols-3 gap-2 pb-6 overflow-auto">
					<div class="bg-slate-50 p-4 rounded-xl mt-2 outline outline-2 outline-gray-100">
						<div class="flex items-end justify-between">
							<h2 class="font-bold">
								Aankomende
								<span v-if="itemsReserveringen?.length > 0" class="opacity-75 text-xs"> ({{ itemsReserveringen[0].restaurant[0].naam }}) </span>
							</h2>
						</div>
						<div class="mt-1">
							<div v-if="itemsReserveringen?.length > 0" class="flex gap-2 items-center justify-between">
								<div class="flex gap-2 items-center">
									<span class="bg-[#4e995b] font-semibold text-[#cfe7d3] p-1 px-3 text-xs rounded-lg">{{ itemsReserveringen[0].tijd.substring(0, 5) }}</span>
									<span class="bg-[#4e995b] font-semibold text-[#cfe7d3] p-1 px-3 text-xs rounded-lg">{{ itemsReserveringen[0].datum }}</span>
								</div>

								<NuxtLink to="/reserveringen" class="bg-slate-200 text-[#3e3f3e] p-1 px-3 font-semibold text-xs rounded-lg"> Bekijken </NuxtLink>
							</div>
							<div v-else class="flex gap-2 items-center justify-between">
								<div class="flex gap-2 items-center">
									<span class="bg-[#4e995b] font-semibold text-[#cfe7d3] p-1 px-3 text-xs rounded-lg">Geen reserveringen</span>
								</div>
							</div>
						</div>
					</div>
					<div class="hidden md:block"></div>
					<div class="hidden md:block"></div>

					<div class="bg-slate-50 p-4 rounded-xl mt-2 outline outline-2 outline-gray-100">
						<div class="flex items-end justify-between">
							<h2 class="font-bold">Restaurants</h2>
							<div class="flex gap-2">
								<span class="bg-[#4e995b] font-semibold text-[#cfe7d3] p-2 px-3 text-xs rounded-lg">{{ items?.length }}</span>
								<NuxtLink to="/account/restaurants" class="bg-slate-200 text-[#3e3f3e] p-2 px-3 font-semibold text-xs rounded-lg"> Bekijken </NuxtLink>
							</div>
						</div>
						<p class="text-sm mb-3 mt-1 font-normal">
							<span v-if="items?.length > 0" class="opacity-80 text-balance"> Overzicht met alle restaurants onder dit account, klik op bekijken om de details te zien </span>
							<span v-else class="opacity-80"> Je hebt geen restaurants onder dit account </span>
						</p>
					</div>
					<div class="bg-slate-50 p-4 rounded-xl mt-2 outline outline-2 outline-gray-100">
						<div class="flex items-end justify-between">
							<h2 class="font-bold">Reserveringen</h2>
							<div class="flex gap-2">
								<span class="bg-[#4e995b] font-semibold text-[#cfe7d3] p-2 px-3 text-xs rounded-lg">{{ itemsReserveringen?.length }}</span>
								<NuxtLink v-if="itemsReserveringen?.length > 0" to="/reserveringen" class="bg-slate-200 text-[#3e3f3e] p-2 px-3 font-semibold text-xs rounded-lg"> Bekijken </NuxtLink>
								<span v-else class="bg-slate-200 opacity-80 text-[#3e3f3e] p-2 px-3 font-semibold text-xs rounded-lg"> Bekijken </span>
							</div>
						</div>
						<p class="text-sm mb-3 mt-1 font-normal">
							<span v-if="itemsReserveringen?.length > 0" class="opacity-80 text-balance"> Overzicht met alle reserveringen onder dit account, klik op bekijken om de details te zien </span>
							<span v-else class="opacity-80"> Je hebt geen reserveringen onder dit account </span>
						</p>
					</div>
					<button v-if="installed" class="bg-[#377642] text-[#cfe7d3] p-2 rounded-xl mt-[0.15rem]" @click="logout">
						<span v-if="displayLoading" class="">
							<icon class="animate-spin" name="pajamas:repeat" size="1rem"> </icon>
						</span>
						<span v-else>Uitloggen</span>
					</button>
				</div>
			</div>
		</div>
	</div>
	<Modal :title v-model:active="active" v-model:activeDelay="activeDelay">
		<div v-if="title == 'Instelling'">
			<p class="-mt-2 text-gray-600">Wijzig hier uw instellingen</p>
			<hr class="my-2 mb-2" />
			<form @submit.prevent="saveSettings">
				<div>
					<label for="name" class="block font-medium text-gray-700">Naam</label>
					<input type="text" id="name" name="name" class="mt-1 p-2 block w-full border rounded-md" />
				</div>

				<div class="mt-4">
					<label for="photo" class="block font-medium text-gray-700">Foto</label>
					<input type="file" id="photo" name="photo" accept="image/*" class="mt-1 p-2 block w-full border rounded-md" />
				</div>

				<div class="mt-6 flex gap-2 items-center">
					<div class="bg-[#de4747] text-white p-1 px-4 rounded-lg" @click="deleteAccount">
						<span v-if="displayLoading" class="">
							<icon class="animate-spin" name="pajamas:repeat" size="1rem"> </icon>
						</span>
						<span v-else> Verwijder account </span>
					</div>
					<button class="bg-gray-200 p-1 px-4 rounded-lg" type="submit">
						<span v-if="displayLoading" class="">
							<icon class="animate-spin" name="pajamas:repeat" size="1rem"> </icon>
						</span>
						<span v-else>Opslaan</span>
					</button>
				</div>

				<div v-if="result" class="flex gap-2 mt-6 mb-2">
					<hr class="my-3" />
					<p :class="result.statusCode != 200 ? 'text-red-600' : 'text-green-800'" class="text-sm leading-4 -ml-1">
						{{ result.message }}
					</p>
				</div>
			</form>
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
	const itemsReserveringen: any = ref([]);

	const active = ref(false);
	const activeDelay = ref(false);
	const title = ref("Account");

	const displayLoading = ref(false);
	const result: Record<string, any> = ref("");
	provide("displayLoading", displayLoading);

	useSeoMeta({
		title: "EET | Account",
		description: "",
		ogTitle: "EET | Account",
		ogDescription: "",
		ogImage: "/image/banner.png",
		ogUrl: "https://eet.com",
		twitterTitle: "EET | Account",
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
	const { data: reserverigen }: Record<string, any> = await useFetch("/api/reserverigen?status=upcoming");
	const { data }: Record<string, any> = await useFetch("/api/restaurants", { params: { searchOwner: true } });

	User.value = user.value?.user;
	items.value = data.value.restaurants;
	itemsReserveringen.value = reserverigen.value.reserveringen;

	onMounted(() => {
		if ($pwa.isPWAInstalled) installed.value = true;
	});

	const logout = async () => {
		displayLoading.value = true;
		await useFetch("/api/auth/logout", { method: "delete" });
		setTimeout(() => {
			displayLoading.value = false;
			navigateTo("/home");
		}, 2000);
	};

	const openInstellingen = () => {
		title.value = "Instelling";
		active.value = true;
		setTimeout(() => {
			activeDelay.value = true;
		}, 100);
	};

	const closeModal = () => {
		activeDelay.value = false;
		setTimeout(() => {
			active.value = false;
		}, 100);
	};

	const saveSettings = async (value: object) => {
		displayLoading.value = true;
		const { data, error, pending }: any = await useFetch("/api/account", {
			method: "put",
			body: value,
		});

		displayLoading.value = pending.value;
		if (!error.value) {
			result.value = data.value;
			const { data: userData }: Record<string, any> = await useFetch("/api/users");
			User.value = userData.value.user;
			setTimeout(() => {
				closeModal();
			}, 4000);
		}
	};

	const deleteAccount = async () => {
		displayLoading.value = true;
		const { pending, data, error }: any = await useFetch("/api/account", {
			method: "DELETE",
		});

		displayLoading.value = pending.value;
		if (!error.value) navigateTo("/");
	};
</script>
