<script lang="ts" setup>
	defineProps({
		url: { type: String, default: "/" },
	});
</script>

<template>
	<ETailwind>
		<EHtml>
			<EHead />
			<EPreview>
				Beste Gebruiker, hierbij ontvangt u een e-mail om uw nieuwe wachtwoord te activeren. Klik op de onderstaande knop voor bevestiging.
			</EPreview>
			<EBody class="">
				<div class="w-full max-w-md  rounded py-6 pr-6">
					<p class="text-gray-500 text-sm mb-4">
						Beste Gebruiker, hierbij ontvangt u een e-mail om uw nieuwe wachtwoord te activeren. Klik op de onderstaande knop voor bevestiging.
					</p>
					<EButton :href="url" class="text-white text-center bg-[#4e995b] font-bold text-sm rounded-md no-underline px-6 py-2"> 
						Activeer wachtwoord
					</EButton>
					<p class="text-gray-500 text-sm mt-5">
						<span class="font-black">Deze link is 30 minuten geldig.</span>
						Als u geen wachtwoord reset heeft aangevraagd, kunt u deze e-mail negeren.
					</p>
				</div>
			</EBody>
		</EHtml>
	</ETailwind>
</template>
