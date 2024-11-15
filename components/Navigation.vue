<template>
	<div>
		<nav v-if="!$pwa?.isPWAInstalled" class="fixed top-0 z-30 w-full p-4 px-6 bg-white">
			<div class="hidden md:inline">
				<div class="flex items-center justify-between">
					<NuxtLink to="/home" class="flex gap-4">
						<NuxtImg draggable="false" class="w-7" src="/image/Logo.svg" alt="Logo" />
						<p class="text-2xl">EET</p>
					</NuxtLink>

					<div v-if="User" class="flex items-center gap-4">
						<NuxtLink class="opacity-60" to="/restaurants?pagina=1"> Restaurants </NuxtLink>
						<NuxtLink class="opacity-60" to="/reserveringen"> Reserveringen </NuxtLink>
						<NuxtLink class="opacity-60" to="/account/restaurants"> Overzicht </NuxtLink>
						<NuxtLink to="/account">
							<NuxtImg draggable="false" class="w-8 h-8 rounded-full" :src="User.avatar_url ? User.avatar_url : '/image/placeholder.jpg'" alt="Profile picture" />
						</NuxtLink>
						<button class="bg-[#4e995b] p-2 px-4 text-white rounded-lg" @click="logout">Uitloggen</button>
					</div>
					<div v-else class="flex items-center gap-4">
						<NuxtLink class="opacity-80" to="/restaurants?pagina=1"> Restaurants </NuxtLink>
						<button @click="handleModal" class="bg-[#4e995b] p-2 px-4 text-white rounded-lg">Inloggen</button>
					</div>
				</div>
				<hr class="mt-4 -mb-2 -pb-1" />
			</div>
			<div class="z-20 md:hidden">
				<div class="flex items-center justify-between">
					<NuxtLink to="/home" class="flex gap-4">
						<NuxtImg draggable=" false" class="w-7" src="/image/Logo.svg" alt="Logo" />
						<p class="text-2xl font-bold">EET</p>
					</NuxtLink>
					<div v-if="!User" class="flex items-center gap-4">
						<button @click="handleModal" class="bg-[#4e995b] p-2 px-4 text-white rounded-lg">Inloggen</button>
						<icon class="w-8 h-8" name="ic:sharp-menu" size="1.5rem" @click="toglenav" />
					</div>
					<div v-else class="flex items-center gap-4">
						<NuxtLink to="/account">
							<NuxtImg draggable="false" class="w-8 h-8 rounded-full" :src="User.avatar_url ? User.avatar_url : '/image/placeholder.jpg'" alt="Profile picture" />
						</NuxtLink>

						<button class="bg-[#4e995b] p-2 px-4 text-white rounded-lg" @click="logout">Uitloggen</button>
						<icon class="w-8 h-8" name="ic:sharp-menu" size="1.5rem" @click="toglenav" />
					</div>
				</div>
				<div class="z-20">
					<Transition name="animate">
						<div v-if="navVisible" class="fixed top-[4rem] left-0 w-screen bg-white px-6 py-2">
							<div class="flex items-center gap-2">
								<NuxtLink class="flex gap-2 p-2 px-4 bg-gray-200 rounded-md button-data" to="/restaurants?pagina=1">
									<icon class="" name="ic:sharp-restaurant" size="1em" />
									<span class="text-xs"> Restaurants </span>
								</NuxtLink>
								<NuxtLink class="flex gap-2 p-2 px-4 bg-gray-200 rounded-md button-data" v-if="User" to="/reserveringen">
									<icon class="" name="ic:sharp-event" size="1em" />
									<span class="text-xs"> Reservering </span>
								</NuxtLink>
								<NuxtLink class="flex gap-2 p-2 px-3 bg-gray-200 rounded-md button-data" v-if="User" to="/account/restaurants">
									<icon class="" name="ic:sharp-edit-location-alt" size="1em" />
									<span class="text-xs"> Overzicht </span>
								</NuxtLink>
							</div>
						</div>
					</Transition>
				</div>
			</div>
		</nav>
		<footer v-else class="fixed bottom-0 z-30 w-full bg-white">
			<hr class="mt-4 -mb-2 -pb-1" />
			<div class="flex items-center p-6 px-8 justify-evenly">
				<NuxtLink to="/home" class="flex flex-col items-center justify-center opacity-50">
					<icon class="w-8 h-8" name="ic:sharp-home" size="1.5rem" />
					<span class="text-xs">Home</span>
				</NuxtLink>
				<NuxtLink to="/restaurants?pagina=1" class="flex flex-col items-center justify-center opacity-50">
					<icon class="w-8 h-8" name="ic:sharp-restaurant" size="1.5rem" />
					<span class="text-xs">Eten</span>
				</NuxtLink>
				<NuxtLink v-if="User" to="/reserveringen" class="flex flex-col items-center justify-center opacity-50">
					<icon class="w-8 h-8" name="ic:sharp-event" size="1.5rem" />
					<span class="text-xs"> Reservering </span>
				</NuxtLink>
				<NuxtLink v-if="User" to="/account/restaurants" class="flex flex-col items-center justify-center opacity-50">
					<icon class="w-8 h-8" name="ic:sharp-edit-location-alt" size="1.5rem" />
					<span class="text-xs"> Overzicht </span>
				</NuxtLink>
			</div>
		</footer>
		<div v-if="installed" :class="showWithDelay ? 'justify-between': ' justify-end'" class="fixed z-30 flex items-center w-full p-2 px-6 text-black top-12">
			<div v-if="showWithDelay" class="flex items-center justify-center p-1 text-black bg-gray-100 rounded-lg h-9 w-9">
				<button @click="router.back()" class="">
					<icon name="material-symbols:arrow-back-ios-new-rounded" size="1.5em" />
				</button>
			</div>
			<div v-if="!User" class="rounded-lg bg-[#3f7f4a] p-2 px-4 text-white">
				<button @click="handleModal" class="">Inloggen</button>
			</div>
			<div v-if="User" class="z-40 ">
				<NuxtLink to="/account">
					<NuxtImg draggable="false" class="w-12 h-12 border-2 rounded-full border-gray-50" :src="User.avatar_url ? User.avatar_url : '/image/placeholder.jpg'" alt="Profile picture" />
				</NuxtLink>
			</div>
		</div>

		<ModalAuth v-model:User="User" v-model:active="active" v-model:activeDelay="activeDelay" />
	</div>
</template>

<script setup lang="ts">
	const { $pwa } = useNuxtApp();

	const router = useRouter();
	const User = ref();
	const active = ref(false);
	const activeDelay = ref(false);
	const installed = ref(false);
	const navVisible = ref(false);
	const showWithDelay = ref(false);
	
	const IsRestaurants = computed(() => router.currentRoute.value.path.includes('/restaurants/'));

	watch(IsRestaurants, (value) => {
		if (value) setTimeout(() => showWithDelay.value = true, 500);
		else setTimeout(() => showWithDelay.value = false, 200);
	});
	
	
	




	const { OkStatus, DataUser } = defineModels<{
		OkStatus: boolean;
		DataUser: any;
	}>();

	if ($pwa?.isPWAInstalled) installed.value = true;

	const logout = async () => {
		const { error }: Record<string, any> = await useFetch("/api/auth/logout", { method: "delete" });
		if (!error.value) User.value = null;

		if (router.currentRoute.value.path.includes("/account") || router.currentRoute.value.path == "/reserveringen" || router.currentRoute.value.path.includes("/dashboard")) {
			navigateTo("/home");
		}
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

	const loaduser = async () => {
		const { data, error }: Record<string, any> = await useFetch("/api/users");

		OkStatus.value = error.value ? false : true;
		DataUser.value = data.value || error.value.data;
		User.value = data.value?.user || null;
	};

	watch(router.currentRoute, async (value) => {
		await loaduser();
		navVisible.value = false;
	});

	watch(User, (value) => {
		if (value) OkStatus.value = true;
		else OkStatus.value = false;
	});

	await loaduser();

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
