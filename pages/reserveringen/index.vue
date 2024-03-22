<template>
	<div class=" h-screen">
		<Navigation></Navigation>
		<div class=" pb-8">
			<div class=" mt-[5.25rem]">
				<div :class="!installed ? 'top-[4rem] sticky -mt-6' : 'top-0 pt-14 md:top-0 md:-mt-5 fixed'"
					class=" w-full z-10 px-6 bg-white">
					<div class=" mb-4">
						<h3 class="xl:text-3xl text-xl font-bold pt-5">Reserveringen</h3>
						<p class="xl:text-sm text-xs z-0 opacity-80 mb-2">
							Hier ziet u een overzicht van uw reserveringen
						</p>

					</div>
					<hr class="pb-2" />
				</div>
				<div :class="!installed ? 'pb-6' : ' pb-[5.4rem] mt-[9.3rem] md:mt-[10.5rem]'"
					class="grid h-fit pt-2 gap-4 px-6 xl:grid-cols-3 sm:grid-cols-2 grid-rows-1">
					<div class="" v-for="i in 12">
						<Reserveringen plaats="Rotterdam" restaurant="Restaurant" datum="2022-12-12" tijd="12:00"
							naam="Naam" :rating="4" :aantal="3" keuken="Nederlands" prijs="$$" id="234567">
						</Reserveringen>
					</div>
				</div>
			</div>
		</div>
	</div>














	<!-- <div class=" pb-6 h-screen">
		<Navigation></Navigation>
		<div class=" sticky top-0 ">
			<div :class="!installed ? ' top-[4rem] sticky' : ' fixed top-0 pt-14 md:top-0 md:-mt-5'"
				class=" w-full px-6 z-10 bg-white">

				<div class=" mb-4">
					<h3 class="xl:text-3xl text-xl font-bold pt-5">
						Reserveringen
					</h3>
					<p class="xl:text-sm text-xs z-0 opacity-80 mb-2">
						Hier ziet u een overzicht van uw reserveringen
					</p>
				</div>
				<hr class="pb-2" />
			</div>
		</div>
		<div :class="!installed ? 'pb-6' : ' pb-[5.4rem] mt-[9.5rem] md:mt-[10.5rem]'"
			class="grid h-fit pt-2 gap-4 px-6 xl:grid-cols-3 sm:grid-cols-2 grid-rows-1">
			<div class=" last:mb-6" v-for="i in 12">
				<Reserveringen plaats="Rotterdam" restaurant="Restaurant" datum="2022-12-12" tijd="12:00" naam="Naam"
					:rating="4" :aantal="3" keuken="Nederlands" prijs="$$" id="234567">
				</Reserveringen>
			</div>
		</div>
	</div> -->
</template>

<script setup lang="ts">
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
			rel: 'icon',
			type: 'image/svg',
			href: '/image/Logo.svg'
		}
	]
});

const { $pwa }: any = useNuxtApp()
const installed = ref(false);

onMounted(() => {
	if ($pwa?.isPWAInstalled) installed.value = true;

});

const { data, error }: Record<string, any> = await useFetch("/api/users");
</script>
