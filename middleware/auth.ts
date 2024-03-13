export default defineNuxtRouteMiddleware(async (to, _from) => {

    const { error } = await useFetch("/api/users")
    if(error.value) return navigateTo("/")

})