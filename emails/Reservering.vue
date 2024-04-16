<script lang="ts" setup>
	defineProps({
		url: { type: String, default: "/" },
		name: { type: String, default: "Gebruiker" },
		restaurant: { type: String, default: "EET" },
		datum: { type: String, default: "2021-10-10" },
		tijd: { type: String, default: "12:00" },
		personen: { type: Number, default: 2 },
	});
</script>

<template>
	<ETailwind>
		<EHtml>
			<EHead />
			<EPreview>Beste {{ name }}, bedankt voor het reserveren bij {{ restaurant }}. Klik op de onderstaande knop om je reservering te bevestigen. </EPreview>
			<EBody class="">
				<div class="w-full max-w-md  rounded py-6 pr-6">
					<e-heading as="h1" class="text-3xl font-bold tracking-tighter mb-4">Bevestig uw reservering!</e-heading>
					<p class="text-gray-500 text-sm mb-4">Beste {{ name }}, bedankt voor het reserveren bij EET. Klik op de onderstaande knop om je reservering te bevestigen.</p>
					<EHr />
					<div class="-mt-2">
						<p class="-mb-2 text-gray-700">
							<strong>Restaurant:</strong> <span class="font-normal">{{ restaurant }}</span>
						</p>
						<p class="-mb-2 text-gray-700">
							<strong>Datum:</strong> <span class="font-normal">{{ datum }}</span>
						</p>
						<p class="-mb-2 text-gray-700">
							<strong>Tijd:</strong> <span class="font-normal">{{ tijd }}</span>
						</p>
						<p class="text-gray-700">
							<strong>Aantal personen:</strong> <span class="font-normal">{{ personen }}</span>
						</p>
					</div>
					<EHr />
					<EButton :href="url" class="text-white text-center bg-[#4e995b] font-bold text-sm rounded-md no-underline w-full py-2"> Bevestig reservering </EButton>
					<p class="text-gray-500 text-sm mt-5">
						<span class="font-black">Deze link is 30 minuten geldig.</span>
						Als u geen reservering heeft gemaakt, kunt u deze e-mail negeren.
					</p>
				</div>
			</EBody>
		</EHtml>
	</ETailwind>
</template>
