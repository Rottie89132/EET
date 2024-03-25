<template>
	<div>
		{{ data }}
	</div>
</template>

<script setup lang="ts">
	const { data } = await useFetch("/api/users");
	if (data.value) navigateTo("/account");
	
</script>

<style scoped></style>
