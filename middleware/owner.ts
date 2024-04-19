export default defineNuxtRouteMiddleware(async (to, from) => {

    const restaurantId = to.params.id
    const { data: reserveringen, error }: any = await useFetch(`/api/restaurants/${restaurantId}/reserverigen`);

    if (error.value) throw createError({
        statusCode: error.value.data.statusCode,
        message: error.value.data.message,
        statusMessage: error.value.data.statusMessage,
        fatal: true,
        
    })
    

})

