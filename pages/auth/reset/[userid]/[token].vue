<template>
    <div :class="!installed ? 'absolute' : ' fixed'"
        class="bg-white h-screen w-screen flex items-center justify-center z-30 top-0">
        <div class="flex flex-col gap-6 z-20 items-center justify-center">
            <Icon class="w-52 h-52 text-[#4e995b]" name="material-symbols:check-circle" />
            <p class="text-6xl font-semibold">Gelukt!</p>
            <p class="text-lg max-w-[80%] -mt-4 opacity-65 leading-5 text-balance text-center">
                Je wachtwacht is gewijzigd. Je kunt nu inloggen en reserveren.
            </p>
            <NuxtLink to="/home" class=" bg-[#4e995b] p-1 px-8 text-white rounded-lg">
                Terug naar home
            </NuxtLink>
        </div>
    </div>
</template>

<script setup lang="ts">

    const { $pwa } = useNuxtApp();
    const installed = ref(false);
    const result = ref()
    const { userid, token } = useRoute().params
    const { data, error } = await useFetch(`/api/auth/forgot/verify/${userid}/${token}`)
    result.value = data.value || error.value

    onMounted(() => {
        if ($pwa?.isPWAInstalled) installed.value = true;
    });

    if (error.value) throw showError({
        statusCode: 400,
        statusMessage: "Foutieve aanvraag",
        message: "Deze link is ongeldig of verlopen!",
    })

</script>
