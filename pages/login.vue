<script setup lang="ts">

const handleLoginSuccess = async (response: any) => {
	const { error } = await useFetch("/api/auth/google/identity", {
		method: "post",
		body: response,
	});

	if (!error.value) return navigateTo("/reserveringen");

};





</script>

<template>
	<div>
		<Navigation></Navigation>
		<div class="flex items-center overflow-hidden px-6 ">
			<div class="rounded-xl flex bg-[#4e995b] mt-4 xl:p-10 sm:p-8 p-6">
				<div>
					<h1 class="xl:text-5xl sm:text-lg text-balance text-sm font-bold text-white xl:mb-4 mb-2">
						Meld je aan bij EET en begin met reserveren!
					</h1>
					<h2 class="xl:text-2xl sm:text-base text-xs opacity-80 xl:mb-6 mb-3 text-balance text-white">
						Door in te loggen, ga je akkoord met onze <NuxtLink to="/terms" class="underline">algemene
							voorwaarden</NuxtLink> en <NuxtLink to="/privacy" class="underline">privacybeleid</NuxtLink>
					</h2>

					<div class="flex gap-4">
						<NuxtLink class="  p-2 px-4 bg-white rounded-lg" to="/register">Registreren</NuxtLink>
					</div>


				</div>

			</div>
		</div>

		<div class=" px-6">
			<GoogleSignInButton @success="handleLoginSuccess"> </GoogleSignInButton>
		</div>
	</div>
</template>
