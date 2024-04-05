<template>
	<div class="h-screen">
		<Navigation></Navigation>
		<div class="fixed w-screen h-full overflow-auto top-0">
			<div class="mt-24">
				<div :class="!installed ? 'top-[4rem] sticky -mt-14' : 'top-0 pt-14 md:top-0 md:-mt-5 fixed'"
					class="w-full z-10 px-6 bg-white"></div>
			</div>
			<div class="px-6">
				<div>
					<div class="grid grid-cols-1 md:grid-cols-3 sm:mt-36 mt-32 gap-4 md:mt-36">
						<div>
							<img alt="Burger" class="w-full h-auto rounded-lg" width="500" height="300"
								style="aspect-ratio: 500 / 300; object-fit: cover" src="/image/Banner.png" />
						</div>
						<div>
							<img alt="Burger" class="w-full h-auto hidden md:inline rounded-lg" width="500" height="300"
								style="aspect-ratio: 500 / 300; object-fit: cover" src="/image/Banner.png" />
						</div>
						<div>
							<img alt="Burger" class="w-full hidden md:inline h-auto rounded-lg" width="500" height="300"
								style="aspect-ratio: 500 / 300; object-fit: cover" src="/image/Banner.png" />
						</div>
					</div>
				</div>
				<div class="-mt-4 md:mt-4 bg-gray-50 rounded-lg p-5 py-4">
					<div>
						<div class="flex items-center justify-between">
							<h1 class="text-3xl font-bold">{{ restaurantDetails?.naam }}</h1>
							<div class="flex items-center gap-2">
								<button
									class="flex items-center justify-center text-white p-1 px-4 bg-[#64A362] bg-opacity-75 rounded-lg">Menu</button>
								<button
									class="items-center hidden md:flex justify-center text-white p-1 px-4 bg-[#64A362] bg-opacity-75 rounded-lg">Tafel
									reserveren</button>
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
						<button
							class="items-center md:hidden mt-4 flex justify-center text-white p-1 px-4 bg-[#64A362] bg-opacity-75 rounded-lg">Tafel
							reserveren</button>
					</div>
				</div>
				<div class="mt-4 bg-gray-50 rounded-lg p-5 py-4">
					<div>
						<div class="flex items-center justify-between">
							<h1 class="text-3xl font-bold">Recensies</h1>
							<div class="flex items-center gap-2">
								<button
									class="flex items-center justify-center text-white p-1 px-4 bg-[#4e995b] bg-opacity-75 rounded-lg"
									@click="handleReviewPopup">
									<span>Beoordeel</span>
								</button>
							</div>
						</div>
						<p class="text-base leading-5 opacity-80">Er zijn nog geen recensies voor dit restaurant.</p>
					</div>
				</div>
				<div>
					<transition name="slide-up">
						<div v-if="reviewPopupActive"
							class="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50"
							@click="closeReviewPopupOnOutsideClick">
							<div class="bg-white rounded-lg p-8 z-50" @click.stop>
								<!-- Your review form can go here -->
								<h2 class="text-2xl font-bold mb-4">Schrijf een recensie</h2>
								<textarea class="w-full h-32 border border-gray-300 rounded-lg p-2 mb-4"
									placeholder="Schrijf hier je recensie..."></textarea>
								<button class="bg-[#4e995b] text-white py-2 px-4 rounded-lg"
									@click="closeReviewPopup">Verzenden</button>
							</div>
						</div>
					</transition>
				</div>
			</div>
		</div>
	</div>
</template>

<script setup lang="ts">
const id = useRoute().params.id;
const { $pwa }: any = useNuxtApp();
const installed = ref(false);
const restaurantDetails = ref<any | null>(null);
const reviewPopupActive = ref(false);

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

if (error.value) {
	console.error("Error fetching restaurant details:", error.message);
} else {
	restaurantDetails.value = data.value.restaurant;
}



onMounted(async () => {
	if ($pwa?.isPWAInstalled) installed.value = true;
});

const handleReviewPopup = () => {
	console.log("Opening review popup", reviewPopupActive.value); // Add this line
	reviewPopupActive.value = true;
};

const closeReviewPopup = () => {
	reviewPopupActive.value = false;
};

const closeReviewPopupOnOutsideClick = (event: MouseEvent) => {
	// Check if the clicked element is outside of the review popup
	if (!(event.target as HTMLElement).closest('.bg-white')) {
		closeReviewPopup();
	}
};



</script>


<style scoped>
.slide-up-enter-active,
.slide-up-leave-active {
	transition: all 0.8s ease;
}

.slide-up-enter-from,
.slide-up-leave-to {
	opacity: 0;
	transform: translateX(-18em);
}
</style>


