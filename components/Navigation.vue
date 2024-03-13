<template>
	<nav class="z-20 px-6 bg-white w-full sticky top-0 p-4">
		<div class="flex justify-between items-center">
			<NuxtLink to="/" class="flex gap-4">
				<NuxtImg class="w-7" src="/image/Logo.svg" alt="Logo" />
				<p class="text-2xl font-bold">EET</p>
			</NuxtLink>
			<div v-if="User" class="flex gap-4 items-center">
				<button class=" bg-[#4e995b] p-2 px-4 text-white rounded-lg" @click="logout">Uitlogen</button>
				<NuxtLink to="/Reserveringen">
					<NuxtImg class="w-8 h-8 rounded-full" :src="User.avatar_url" alt="Profile picture" />
				</NuxtLink>

			</div>
			<div v-else class="flex gap-4">
				<NuxtLink class=" bg-[#4e995b] p-2 px-4 text-white rounded-lg" to="/login">Login</NuxtLink>
			</div>
		</div>
		<hr class="-pb-1 -mb-2 mt-4" />
	</nav>
</template>

<script setup lang="ts">

const User = ref();

const popup = () => {
	useOneTap({
		onSuccess: async (response: any) => {
			const { data, error }: Record<string, any> = await useFetch("/api/auth/google/identity", { method: "POST", body: response, });
			if (!error.value) User.value = data.value?.user.user_metadata;
		},
		onError: (error: any) => console.log(error)
	});
}


const logout = async () => {
	const { error }: Record<string, any> = await useFetch("/api/auth/logout", { method: "delete" });
	if (!error.value) User.value = null; navigateTo("/");
};

const { data, error }: Record<string, any> = await useFetch("/api/users")

if (!error.value) User.value = data.value?.user;
if (error.value) popup()

</script>

<style scoped>
.router-link-active {
	@apply font-bold
}
</style>
