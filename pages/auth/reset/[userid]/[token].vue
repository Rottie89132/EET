<template>
	<div>
        {{ result }}
    </div>
</template>

<script setup lang="ts">

const result = ref()
const { userid, token} = useRoute().params
const { data, error} = await useFetch(`/api/auth/forgot/verify/${userid}/${token}`)
result.value = data.value || error.value

if(!error.value) {}//navigateTo('/')
else throw showError({
    statusCode: 400,
    statusMessage: "Foutieve aanvraag",
    message: "Deze link is ongeldig of verlopen!",
})
	
</script>

