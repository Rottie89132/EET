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
		<div class=" px-6">
			<GoogleSignInButton @success="handleLoginSuccess"> </GoogleSignInButton>
		</div>
	</div>
</template>
