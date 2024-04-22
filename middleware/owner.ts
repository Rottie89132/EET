
export default defineNuxtRouteMiddleware(async (to, from) => {

    const restaurantId = to.params.id
    const { data, error }: any = await useFetch(`/api/restaurants/${restaurantId}/reserverigen`);

    if (!data.value?.auth ) throw showError({
        statusCode: 401,
        statusMessage: "Unauthorized",
        message: "Geen toegan tot deze data",
        fatal: true,
    })

    if ( error.value ) throw showError({
        statusCode: error.value.data.statusCode,
        message: error.value.data.message,
        statusMessage: error.value.data.statusMessage,
        fatal: true,
    })

})

