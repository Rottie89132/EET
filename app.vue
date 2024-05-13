<template>
    <div v-show="isLoading && path != '/'">
        <div :class="installed ? ' top-[88.5%]' : ' top-0'" class="fixed z-50 left-0 w-full h-full">
            <div class=" ">
                <div class="h-2 animate bg-[#4e995b]" :style="{ width: progress + '%' }"></div>
            </div>
        </div>
    </div>
    <VitePwaManifest />
    <Navigation v-model:OkStatus="OkStatus" v-model:DataUser="User"></Navigation>
    <NuxtPage />
</template>

<script setup>
	const nuxtApp = useNuxtApp();
	const { $pwa } = useNuxtApp();
	
    const router = useRouter();
    const installed = ref(false);
	const OkStatus = ref(false);
    const User = ref();
	const path = ref("");

	provide("OkStatus", OkStatus);
    provide("User", User);

	const { progress, isLoading, start, finish, clear } = useLoadingIndicator({
		duration: 2000,
		throttle: 200,
		estimatedProgress: (duration, elapsed) => (2 / Math.PI) * 100 * Math.atan(((elapsed / duration) * 100) / 50),
	});

	addRouteMiddleware(
		"global-loader",
		(to, from) => {
			path.value = from.path;
			start();
		},
		{ global: true }
	);
	nuxtApp.hook("page:finish", () => finish());

	onMounted(() => {
		if ($pwa?.isPWAInstalled) installed.value = true;
	});
</script>

<style scoped>
	.animate {
		transition: width 0.2s ease-in-out;
	}
</style>
