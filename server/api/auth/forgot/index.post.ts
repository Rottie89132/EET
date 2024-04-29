import { serverSupabaseServiceRole } from "#supabase/server";
import { useCompiler } from '#vue-email'
const { RedirectUrl } = useRuntimeConfig();

export default defineEventHandler((event) => {
    return new Promise( async(resolve, reject) => {

        const client = serverSupabaseServiceRole(event);
        const request: any = await readBody(event)

        if(!request) return reject({
            statusCode: 400,
            statusMessage: "Foute aanvraag",
            message: "Ontbrekende parameters"
        });

        const { email, wachtwoord: password, confirmatie } = request

        if (!email || !password || !confirmatie) return reject({
            statusCode: 400,
            statusMessage: "Foute aanvraag",
            message: "Ontbrekende parameters"
        })

        if (password !== confirmatie) return reject({
            statusCode: 400,
            statusMessage: "Foute aanvraag",
            message: "Wachtwoorden komen niet overeen"
        })
        
        const { data, error } = await client.auth.admin.listUsers()

        if (!error) {

            const user: any = data.users.find((user: any) => user.email === email)
            const SessionId = crypto.randomUUID()
            await useStorage("ResetPasswordByUserId").setItem(SessionId, { user_id: user.id, password })

            setTimeout(async () => {
                await useStorage("ResetPasswordByUserId").removeItem(SessionId)
            }, 30 * 60 * 1000);

            const template = await useCompiler('ResetPassword.vue', {
                props: {
                    url: `${RedirectUrl}/auth/reset/${user.id}/${SessionId}`,
                }
            }).catch((error) => {
                return reject({
                    statusCode: 500,
                    statusMessage: "Interne serverfout",
                    message: "Er is iets misgegaan",
                })
            })

            await useMail({
                recepient: email,
                subject: "Reset uw wachtwoord!",
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
                message: "Controleer je email voor een reset link."
            })
        }

        return reject({
            statusCode: 404,
            statusMessage: "Not Found",
            message: "Restaurant niet gevonden",
        });
        
    });
});
