<template>
	<div class="h-screen">
		<VitePwaManifest />
		<Navigation v-model:OkStatus="OkStatus"></Navigation>
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
									{{ User.name || User.email.split("@")[0] }}
									<span v-if="User.email_verified" class="text-sm">
										<icon name="ic:sharp-verified" size="1.5em" class="text-white text-opacity-80"></icon>
									</span>
								</h2>
								<p class="text-sm -mt-1 opacity-80">
									{{ User.email }}
								</p>
							</div>
						</div>

						<p class="my-2">
							<span class="text-sm opacity-70">Eigenschappen:</span>
						</p>
						<div class="flex gap-2">
							<button class="bg-slate-50 p-2 px-3 text-xs text-black rounded-lg">Instellingen</button>
							<p v-if="items.length > 0" class="bg-[#377642] text-[#cfe7d3] text-xs p-2 rounded-md">Restaurant houder</p>
							<p class="bg-[#377642] text-[#cfe7d3] text-xs p-2 rounded-md">Gebruiker</p>
						</div>
						<div class="flex gap-2 mt-3"></div>
					</div>
					<div class="bg-slate-50 p-4 rounded-xl mt-2 outline outline-2 outline-gray-100 xl:hidden">
						<div class="flex items-center w-full justify-between">
							<div class="w-full">
								<details :open="openDetail === 'reservations'" class="font-semibold flex items-center justify-between gap-1 text-lg">
									<summary @click.prevent="toggleDetail('reservations')">
										<span>Reserveringen</span>
										<span class="text-xs opacity-80">(0)</span>
									</summary>
									<p class="text-sm -my-1 font-normal">
										<span v-if="items.length > 10" class="text-xs opacity-80"> Lijst met acties die je kunt uitvoeren op reserveringen </span>
										<span v-else class="text-xs opacity-80"> Je hebt geen reserveringen onder dit account </span>
									</p>
									<div class="grid gap-2 mt-3 font-normal">
										<div v-if="items.length > 10" class="flex gap-2">
											<NuxtLink to="/reserveringen?tab=history" class="bg-gray-300 text-xs p-2 px-3 rounded-md">Geschiedenis</NuxtLink>
											<NuxtLink to="/reserveringen?tab=upcoming" class="bg-gray-200 text-xs p-2 px-3 rounded-md">Aankomende</NuxtLink>
										</div>

										<div v-else class="">
											<button class="bg-gray-300 p-[0.35rem] px-3 text-xs text-gray-700 rounded-lg">Maak een reservering</button>
										</div>
									</div>
								</details>
							</div>
						</div>
					</div>
					<div class="bg-slate-50 p-4 rounded-xl mt-2 outline outline-2 outline-gray-100 hidden xl:inline">
						<div class="flex items-center w-full justify-between">
							<div class="w-full">
								<div class="font-semibold items-center justify-between gap-1 text-lg">
									<h1>
										<span>Reserveringen</span>
										<span class="text-xs opacity-80">(0)</span>
									</h1>
									<p class="text-sm -my-1 font-normal">
										<span v-if="items.length > 10" class="text-xs opacity-80"> Lijst met acties die je kunt uitvoeren op reserveringen </span>
										<span v-else class="text-xs opacity-80"> Je hebt geen reserveringen onder dit account </span>
									</p>
									<div class="grid gap-2 mt-3 font-normal">
										<div v-if="items.length > 10" class="flex gap-2">
											<NuxtLink to="/reserveringen?tab=history" class="bg-gray-300 text-xs p-2 px-3 rounded-md">Geschiedenis</NuxtLink>
											<NuxtLink to="/reserveringen?tab=upcoming" class="bg-gray-200 text-xs p-2 px-3 rounded-md">Aankomende</NuxtLink>
										</div>
										<div v-else class="">
											<button class="bg-gray-300 text-gray-700 text-xs p-2 px-3 rounded-md">Maak een reservering</button>
										</div>
									</div>
								</div>
							</div>
						</div>
					</div>
				</div>
				<div class="grid px-6 grid-cols-1 xl:grid-cols-1 gap-2 pb-6 overflow-auto">
					<div class="bg-slate-50 p-4 rounded-xl mt-2 outline outline-2 outline-gray-100">
						<div class="flex items-center w-full justify-between">
							<div class="w-full">
								<details :open="openDetail === 'restaurants'" class="font-semibold flex items-center justify-between gap-1 text-lg">
									<summary @click.prevent="toggleDetail('restaurants')">
										<span>Restaurants</span>
										<span class="text-xs opacity-80">({{ items.length }})</span>
									</summary>
									<p class="text-sm -my-1 font-normal">
										<span v-if="items.length > 0" class="text-xs opacity-80"> Lijst met alle restaurants onder dit account </span>
										<span v-else class="text-xs opacity-80"> Je hebt geen restaurants onder dit account </span>
									</p>
									<div class="grid gap-2 mt-3 font-normal">
										<div v-if="items.length > 0" v-for="(item, index) in items" class="flex items-center gap-2 bg-slate-50 rounded-lg">
											<div class="w-full">
												<hr class="my-2 mt-1" />
												<div class="flex justify-between gap-2">
													<div class="w-full">
														<div class="flex items-center justify-between gap-2 w-full">
															<h3 class="font-semibold text-md truncate">{{ item.naam }}</h3>
															<div v-if="item.images && item.locatie && item.telefoon && item.telefoon && item.Openingstijden" class="flex items-center gap-2 text-right pb-2 overflow-auto">
																<span class="bg-gray-200 text-gray-500 p-1 flex items-center justify-center gap-1 px-3 text-xs rounded-lg">
																	<icon name="ic:round-local-post-office" size="1.2em"></icon>
																	{{ item.aantal_recenties || 4 }}
																</span>
																<span class="bg-[#4e995b] p-1 flex items-center justify-center gap-1 px-3 text-xs text-[#b4e4bc] rounded-lg">
																	<icon name="ic:sharp-star" size="1.2em"></icon>
																	{{ item.beoordeling.toFixed(1) }}
																</span>
															</div>
															<div v-else class="flex items-center gap-2 text-right pb-2 overflow-auto">
																<span class="bg-rose-200 text-rose-500 p-1 flex items-center justify-center gap-1 px-3 text-xs rounded-lg">
																	<icon name="ic:round-error" size="1.2em"></icon>
																	Fout
																</span>
															</div>
														</div>
														<p class="text-xs opacity-80 text-balance max-w-[85%] line-clamp-2">{{ item.beschrijving }}</p>
													</div>
												</div>
												<div class="flex gap-2 mt-1">
													<button class="bg-gray-300 p-[0.35rem] px-3 text-xs text-gray-800 rounded-lg">Beheren</button>
													<button class="bg-gray-200 p-[0.35rem] px-3 text-xs text-gray-700 rounded-lg">Bewerken</button>
												</div>
											</div>
										</div>
										<div v-else>
											<button class="bg-gray-300 p-[0.35rem] px-3 text-xs text-gray-700 rounded-lg">Voeg een restaurant toe</button>
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
</template>

<script setup lang="ts">
	const { $pwa }: any = useNuxtApp();
	const installed = ref(false);
	const User = ref();
	const items: any = ref([]);
	const openDetail = ref();
	const OkStatus = ref(false);

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

	const toggleDetail = (detailName: string) => {
		if (openDetail.value === detailName) {
			openDetail.value = "";
		} else {
			openDetail.value = detailName;
		}
	};
</script>

<style scoped></style>


