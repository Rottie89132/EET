<script setup lang="ts">
const supabase = useSupabaseClient()
const email = ref('')
const password = ref('')


const signInWithOtp = async () => {

    const { error } = await supabase.auth.signUp({
        email: email.value,
        password: password.value,
    })

    if (error) console.log(error)

}
</script>
<template>
    <div>
        <button @click="signInWithOtp">
            Sign In with E-Mail
        </button>
        <input v-model="email" type="email" />
        <input v-model="password" type="password" />

    </div>
</template>