<template>
	<nav v-if="!$pwa?.isPWAInstalled" class="z-20 px-6 bg-white w-full sticky top-0 p-4">
		<div class="flex justify-between items-center">
			<NuxtLink to="/home" class="flex gap-4">
				<NuxtImg draggable="false" class="w-7" src="/image/Logo.svg" alt="Logo" />
				<p class="text-2xl font-bold">EET</p>
			</NuxtLink>
			<div v-if="User" class="flex gap-4 items-center">
				<button class=" bg-[#4e995b] p-2 px-4 text-white rounded-lg" @click="logout">Uitloggen</button>
				<NuxtLink to="/Reserveringen">
					<NuxtImg draggable="false" class="w-8 h-8 rounded-full" :src="User.avatar_url" alt="Profile picture" />
				</NuxtLink>

			</div>
			<div v-else class="flex gap-4">
				<button @click="handleModal" class=" bg-[#4e995b] p-2 px-4 text-white rounded-lg">Aanmelden</button>
			</div>
		</div>
		<hr class="-pb-1 -mb-2 mt-4" />
	</nav>
	<footer v-else class=" z-20 fixed w-full bottom-0 bg-white">
		<hr class="-pb-1 -mb-2 mt-4" />
		<div class="flex justify-evenly items-center p-6 px-8">
			<NuxtLink to="/home" class=" opacity-50 flex flex-col justify-center items-center">
				<icon class="w-8 h-8 " name="ic:sharp-home" size="1.5rem" />
				<span class="text-xs">Home</span>
			</NuxtLink>
			<NuxtLink to="/restaurants?pagina=1" class=" opacity-50 flex flex-col justify-center items-center">
				<icon class="w-8 h-8 " name="ic:sharp-restaurant" size="1.5rem" />
				<span class="text-xs">Eten</span>
			</NuxtLink>
			<NuxtLink to="/dashboard" class=" opacity-50 flex flex-col justify-center items-center">
				<icon class="w-8 h-8 " name="ic:sharp-chat" size="1.5rem" />
				<span class="text-xs">Chat</span>
			</NuxtLink>
			<NuxtLink v-if="User" to="/reserveringen" class=" opacity-50 flex flex-col justify-center items-center">
				<icon class="w-8 h-8 " name="ic:sharp-event" size="1.5rem" />
				<span class="text-xs">
					Reservering
				</span>
			</NuxtLink>
		</div>
	</footer>
	<div v-if="installed ?? !User" class=" z-30 fixed right-6 top-14 rounded-md bg-[#3f7f4a] p-2 px-4 text-white">
		<button @click="handleModal" class="">
			Aanmelden
		</button>
	</div>
	<ModalLogin v-model:User="User" v-model:active="active" v-model:activeDelay="activeDelay" />

</template>

<script setup lang="ts">

const { $pwa } = useNuxtApp()

const User = ref();
const active = ref(false);
const activeDelay = ref(false);
const installed = ref(false);

if ($pwa?.isPWAInstalled) installed.value = true;

const popup = () => {
	useOneTap({
		onSuccess: async (response: any) => {
			const { data, error }: Record<string, any> = await useFetch("/api/auth/google/identity", { method: "POST", body: response, });
			if (!error.value) User.value = data.value?.user.user_metadata;
		},
	});
}


const logout = async () => {
	const { error }: Record<string, any> = await useFetch("/api/auth/logout", { method: "delete" });
	if (!error.value) User.value = null; navigateTo("/home");
};

const handleModal = () => {

	active.value = true;
	setTimeout(() => {
		activeDelay.value = true;
	}, 100);

}


const { data, error }: Record<string, any> = await useFetch("/api/users")

if (!error.value) User.value = data.value?.user;
if (error.value) popup()



</script>

<style scoped>
.router-link-active {
	@apply font-bold opacity-100
}
</style>
