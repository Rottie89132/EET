<template>
	<nav v-if="!$pwa?.isPWAInstalled" class="z-20 px-6 bg-white w-full fixed top-0 p-4">
		<div class="hidden md:inline">
			<div class="flex justify-between items-center">
				<NuxtLink to="/home" class="flex gap-4">
					<NuxtImg draggable="false" class="w-7" src="/image/Logo.svg" alt="Logo" />
					<p class="text-2xl">EET</p>
				</NuxtLink>

				<div v-if="User" class="flex gap-4 items-center">
					<NuxtLink class="opacity-60" to="/restaurants?pagina=1"> Restaurants </NuxtLink>
					<NuxtLink class="opacity-60" to="/Reserveringen"> Reserveringen </NuxtLink>
					<NuxtLink to="/account">
						<NuxtImg draggable="false" class="w-8 h-8 rounded-full" :src="User.avatar_url ? User.avatar_url : '/image/placeholder.jpg'" alt="Profile picture" />
					</NuxtLink>
					<button class="bg-[#4e995b] p-2 px-4 text-white rounded-lg" @click="logout">Uitloggen</button>
				</div>
				<div v-else class="flex gap-4 items-center">
					<NuxtLink class="opacity-80" to="/restaurants?pagina=1"> Restaurants </NuxtLink>
					<button @click="handleModal" class="bg-[#4e995b] p-2 px-4 text-white rounded-lg">Aanmelden</button>
				</div>
			</div>
			<hr class="-pb-1 -mb-2 mt-4" />
		</div>
		<div class="md:hidden z-20">
			<div class="flex justify-between items-center">
				<NuxtLink to="/home" class="flex gap-4">
					<NuxtImg draggable=" false" class="w-7" src="/image/Logo.svg" alt="Logo" />
					<p class="text-2xl font-bold">EET</p>
				</NuxtLink>
				<div v-if="!User" class="flex gap-4 items-center">
					<button @click="handleModal" class="bg-[#4e995b] p-2 px-4 text-white rounded-lg">Aanmelden</button>
					<icon class="w-8 h-8" name="ic:sharp-menu" size="1.5rem" @click="toglenav" />
				</div>
				<div v-else class="flex gap-4 items-center">
					<NuxtLink to="/account">
						<NuxtImg draggable="false" class="w-8 h-8 rounded-full" :src="User.avatar_url ? User.avatar_url : '/image/placeholder.jpg'" alt="Profile picture" />
					</NuxtLink>

					<button class="bg-[#4e995b] p-2 px-4 text-white rounded-lg" @click="logout">Uitloggen</button>
					<icon class="w-8 h-8" name="ic:sharp-menu" size="1.5rem" @click="toglenav" />
				</div>
			</div>
			<div class="z-10">
				<Transition name="animate">
					<div v-if="navVisible" class="fixed top-[4rem] left-0 w-screen bg-white px-6 py-2">
						<div class="flex items-center gap-2">
							<NuxtLink class="button-data p-2 px-4 flex gap-2 bg-gray-200 rounded-md" to="/restaurants?pagina=1">
								<icon class="" name="ic:sharp-restaurant" size="1em" />
								<span class="text-xs"> Restaurants </span>
							</NuxtLink>
							<NuxtLink class="button-data p-2 px-4 flex gap-2 bg-gray-200 rounded-md" v-if="User" to="/Reserveringen">
								<icon class="" name="ic:sharp-event" size="1em" />
								<span class="text-xs"> Reservering </span>
							</NuxtLink>
						</div>
					</div>
				</Transition>
			</div>
		</div>
	</nav>
	<footer v-else class="z-20 fixed w-full bottom-0 bg-white">
		<hr class="-pb-1 -mb-2 mt-4" />
		<div class="flex justify-evenly items-center p-6 px-8">
			<NuxtLink to="/home" class="opacity-50 flex flex-col justify-center items-center">
				<icon class="w-8 h-8" name="ic:sharp-home" size="1.5rem" />
				<span class="text-xs">Home</span>
			</NuxtLink>
			<NuxtLink to="/restaurants?pagina=1" class="opacity-50 flex flex-col justify-center items-center">
				<icon class="w-8 h-8" name="ic:sharp-restaurant" size="1.5rem" />
				<span class="text-xs">Eten</span>
			</NuxtLink>
			<NuxtLink v-if="User" to="/reserveringen" class="opacity-50 flex flex-col justify-center items-center">
				<icon class="w-8 h-8" name="ic:sharp-event" size="1.5rem" />
				<span class="text-xs"> Reservering </span>
			</NuxtLink>
		</div>
	</footer>
	<div v-if="installed && !User" class="z-30 fixed right-6 top-14 rounded-md bg-[#3f7f4a] p-2 px-4 text-white">
		<button @click="handleModal" class="">Aanmelden</button>
	</div>
	<div v-if="installed && User" class="fixed right-6 top-14 z-40">
		<NuxtLink to="/account">
			<NuxtImg draggable="false" class="w-12 h-12 rounded-full border-2 border-gray-50" :src="User.avatar_url ? User.avatar_url : '/image/placeholder.jpg'" alt="Profile picture" />
		</NuxtLink>
	</div>
	<ModalAuth v-model:User="User" v-model:active="active" v-model:activeDelay="activeDelay" />
</template>

<script setup lang="ts">
	const { $pwa } = useNuxtApp();

	const User = ref();
	const active = ref(false);
	const activeDelay = ref(false);
	const installed = ref(false);
	const navVisible = ref(false);
	const animate = ref();

	if ($pwa?.isPWAInstalled) installed.value = true;

	const popup = () => {
		useOneTap({
			onSuccess: async (response: any) => {
				const { data, error }: Record<string, any> = await useFetch("/api/auth/google/identity", { method: "POST", body: response });
				if (!error.value) User.value = data.value?.user.user_metadata;
			},
		});
	};

	const logout = async () => {
		const { error }: Record<string, any> = await useFetch("/api/auth/logout", { method: "delete" });
		if (!error.value) User.value = null;
		navigateTo("/");
	};

	const toglenav = () => {
		navVisible.value = !navVisible.value;
	};

	const handleModal = () => {
		active.value = true;
		setTimeout(() => {
			activeDelay.value = true;
		}, 100);
	};

	const { data, error }: Record<string, any> = await useFetch("/api/users");

	if (!error.value) User.value = data.value?.user;
	//if (error.value) popup();
</script>

<style scoped>
	.router-link-active.button-data {
		@apply font-bold opacity-100 bg-[#4e995b] text-white md:text-black md:bg-white;
	}

	.router-link-active {
		@apply font-bold opacity-100;
	}

	.animate-enter-active,
	.animate-leave-active {
		transition: all 0.8s ease;
	}

	.animate-enter-from,
	.animate-leave-to {
		opacity: 0;
		transform: translateX(-18em);
	}
</style>
