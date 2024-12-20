import { serverSupabaseClient, serverSupabaseUser } from '#supabase/server'
import UseEmail from '~~/components/emails/Reservering.vue'
import { render } from '@vue-email/render'

const { RedirectUrl } = useRuntimeConfig()

export default eventHandler(async (event) => {
    return new Promise(async (resolve, reject) => {
        const client = await serverSupabaseClient(event)
        const { data: userdata }: Record<string, any> = await client.auth.getUser();
        const { user }: any = userdata
        const id = getRouterParams(event).id

        const request = await readBody(event)
        if (!request.datum || !request.tijd || !request.aantalPersonen || !request.email || !request.naam || !request.telefoon) return reject({
            statusCode: 400,
            statusMessage: "Foutieve aanvraag",
            message: "Ontbrekende verplichte velden",
        })

        const { data: reserveringen, error: reserveringenError }: any = await client.from("reserveringen_table").select("*").eq("datum", request.datum).eq("restaurant_id", id)
        const { data, error }: any = await client.from("restaurants_table").select("naam").eq("id", id).single()

        if (reserveringenError) return reject({
            statusCode: 500,
            statusMessage: "Interne serverfout",
            message: "Kon reserveringen niet ophalen",
        })

        const now = new Date();
        const requestTime = new Date(now.getFullYear(), now.getMonth(), now.getDate(), ...request.tijd.split(':').map(Number));
        const hoursLater = new Date(requestTime.getTime() + data.duur * 60 * 60 * 1000);
        const hoursEarlier = new Date(requestTime.getTime() - data.duur * 60 * 60 * 1000);

        const conflictingReservations = reserveringen.filter((reservering: { tijd: any }) => {
            const reservationTime = new Date(now.getFullYear(), now.getMonth(), now.getDate(), ...reservering.tijd.split(':').map(Number));
            const normalizedReservationTime = new Date(now.getFullYear(), now.getMonth(), now.getDate(), reservationTime.getHours(), reservationTime.getMinutes(), reservationTime.getSeconds());
            return (normalizedReservationTime >= hoursEarlier && normalizedReservationTime < requestTime) || (normalizedReservationTime >= requestTime && normalizedReservationTime < hoursLater);
        })

        if (conflictingReservations.length >= 8) return reject({
            statusCode: 400,
            statusMessage: "Foutieve aanvraag",
            message: "Reserveringstijd valt binnen 2 uur van een andere reservering",
        })

        if (!error) {
            const SessionId = crypto.randomUUID()
            await useStorage("VerifyRequired").setItem(SessionId, { ...request, id, user_id: user?.id })

            setTimeout(async () => {
                await useStorage("VerifyRequired").removeItem(SessionId)
            }, 30 * 60 * 1000);

            const template = await render(UseEmail, {
                url: `${RedirectUrl}/restaurants/${id}/reserveringen/verify/${SessionId}`,
                restaurant: data.naam,
                name: request.naam,
                datum: request.datum,
                tijd: request.tijd,
                personen: request.aantalPersonen,
            }).catch((error) => {
                return reject({
                    statusCode: 500,
                    statusMessage: "Interne serverfout",
                    message: "Er is iets misgegaan",
                })
            })

            await useMail({
                recepient: request.email,
                subject: "Bevestig uw reservering!",
                body: template,
            }).catch((error) => {
                return reject({
                    statusCode: 500,
                    statusMessage: "Interne serverfout",
                    message: "Er is iets misgegaan",
                })
            })

            return resolve({
                statusCode: 200,
                statusMessage: "OK",
                message: "E-mail verzonden!",
            })
        }

        if (error) return reject({
            statusCode: 404,
            statusMessage: "Niet gevonden",
            message: "Restaurant niet gevonden",
        })

        return reject({
            statusCode: 500,
            statusMessage: "Interne serverfout",
            message: "Er is iets misgegaan",
        })
    })
})
