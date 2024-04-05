<template>
	<div class="h-screen">
		<Navigation></Navigation>
		<div class="fixed w-screen h-full overflow-auto top-0">
			<div class="mt-24">
				<div :class="!installed ? 'top-[4rem] sticky -mt-14' : 'top-0 pt-14 md:top-0 md:-mt-5 fixed'" class="w-full z-10 px-6 bg-white"></div>
			</div>
			<div class="px-6 ">
				<div>
					<div class="grid grid-cols-1 sm:mt-36 mt-32  md:grid-cols-3 gap-4">
						<div>
							<img alt="Burger" class="w-full h-auto rounded-lg" width="500" height="300" style="aspect-ratio: 500 / 300; object-fit: cover" :src="restaurantDetails.thumbnail.data.publicUrl" />
						</div>
						<div>
							<img alt="Burger" class="w-full h-auto hidden md:inline rounded-lg" width="500" height="300" style="aspect-ratio: 500 / 300; object-fit: cover" :src="restaurantDetails.thumbnail.data.publicUrl" />
						</div>
						<div>
							<img alt="Burger" class="w-full hidden md:inline h-auto rounded-lg" width="500" height="300" style="aspect-ratio: 500 / 300; object-fit: cover" :src="restaurantDetails.thumbnail.data.publicUrl" />
						</div>
					</div>
				</div>
				<div class="-mt-4 md:mt-4 bg-gray-50 rounded-lg p-5 py-4">
					<div>
						<div class="flex items-center justify-between">
							<h1 class="text-3xl font-bold">{{ restaurantDetails?.naam }}</h1>
							<div class="flex items-center gap-2">
								<button class="flex items-center justify-center text-white p-1 px-4 bg-[#4e995b] rounded-lg">Menu</button>
								<button @click="openbookingmodal"  class="items-center hidden md:flex justify-center text-white p-1 px-4 bg-[#4e995b] rounded-lg">Tafel reserveren</button>
							</div>
						</div>

						<h1 class="text-base leading-5 opacity-80">{{ restaurantDetails?.beschrijving }}</h1>
						<hr class="mb-2 mt-3" />
						<div class="flex flex-wrap items-center gap-x-4">
							<div class="flex items-center mt-2 space-x-2 bg-gray-200 p-2 rounded-md">
								<Icon name="ep:location" size="1.2rem"></Icon>
								<span class=" text-sm">{{ restaurantDetails?.plaats }}</span>
							</div>
							<div class="flex items-center mt-2 space-x-2 bg-gray-200 p-2 rounded-md">
								<Icon name="ep:fork-spoon" size="1.2rem"></Icon>
								<span class=" text-sm">{{ restaurantDetails?.keuken }}</span>
							</div>
							<div class="flex items-center mt-2 space-x-2 bg-gray-200 p-2 rounded-md">
								<Icon name="ep:money" size="1.2rem"></Icon>
								<span class=" text-sm">{{ restaurantDetails?.prijs }}</span>
							</div>
							<div class="flex items-center mt-2 space-x-2 bg-gray-200 p-2 rounded-md">
								<Icon name="ep:star" size="1.2rem"></Icon>
								<span class=" text-sm">{{ restaurantDetails?.beoordeling }}</span>
							</div>
						</div>
						<button @click="openbookingmodal" class="items-center md:hidden mt-4 flex justify-center text-white p-1 px-4 bg-[#4e995b]  rounded-lg">Tafel reserveren</button>
					</div>
				</div>
				<div class="mt-4 bg-gray-50 rounded-lg p-5 py-4">
					<div>
						<div class="flex items-center justify-between">
							<h1 class="text-3xl font-bold">Recensies</h1>
							<div class="flex items-center gap-2">
								<button @click="openrecensiemodal" class="flex items-center justify-center text-white p-1 px-4 bg-[#4e995b] rounded-lg">
									<span>Beoordeel</span>
								</button>
							</div>
						</div>
						<p class="text-base leading-5 opacity-80">Er zijn nog geen recensies voor dit restaurant.</p>
					</div>
				</div>
			</div>
		</div>
	</div>
	<ModalRecensie :title="title" v-model:active="active" v-model:activeDelay="activeDelay">
		
	</ModalRecensie>
</template>

<script setup lang="ts">
	const id = useRoute().params.id;
	const { $pwa }: any = useNuxtApp();
	const installed = ref(false);
	const restaurantDetails = ref<any | null>(null);
	
	const title = ref("");
	const active = ref(false);
	const activeDelay = ref(false);

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

	onMounted(async () => {
		if ($pwa?.isPWAInstalled) installed.value = true;
	});
</script>

<style scoped></style>
