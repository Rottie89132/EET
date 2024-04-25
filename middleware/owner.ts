
export default defineNuxtRouteMiddleware(async (to, from) => {

    const restaurantId = to.params.id
    const { data, error }: any = await useFetch(`/api/restaurants/${restaurantId}/reserverigen`);
    if (!data.value?.auth || error.value) return navigateTo("/")

})

