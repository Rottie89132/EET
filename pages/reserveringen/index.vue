<template>
	<div>
		<Navigation></Navigation>
		<div class="">
			<div class="grid grid-cols-1 md:grid-cols-2 px-6 h-[16vh] mt-4 gap-4">
				<div class="flex sm:p-8 p-6 bg-[#4e995b] rounded-xl">
					<div class="w-full text-white">
						<div class="flex items-center -mt-2 justify-between">
							<div>
								<h2 class="xl:text-2xl text-base font-bold">Welkom terug bij EET!</h2>
								<p class="opacity-80 leading-4 text-ms mb-6">{{ data.user.name || data.user.email }}</p>
								<NuxtLink to="/restaurants?pagina=1" class="bg-white p-2 px-4 text-black rounded-lg">
									Bekijk restaurants </NuxtLink>
							</div>
						</div>
					</div>
				</div>
			</div>
			<div class="mt-8">
				<div class="sticky z-10 top-[4.8rem] mb-2 px-6 bg-white">
					<h3 class="xl:text-3xl text-xl font-bold mt-2">Reserveringsgeschiedenis</h3>
					<p class="xl:text-sm text-xs z-0 opacity-80 mb-4">Hier zijn de reserveringen die je hebt gemaakt!
					</p>
					<hr class="pb-2" />
				</div>

				<div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-2 px-6 gap-4 pb-6">
					<div v-for="i in 8">
						<Reserveringen restaurant="Het Vleeshuis" plaats="Vlaardingen" keuken="Italiaans" prijs="€€€"
							datum="2022-10-10" :aantal="4" :rating="4" id="65432">
						</Reserveringen>
					</div>
				</div>
			</div>
		</div>
	</div>
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

const { data, error }: Record<string, any> = await useFetch("/api/users");
</script>
