import { serverSupabaseClient } from "#supabase/server";

export default defineEventHandler((event) => {
    return new Promise((resolve, reject) => {
        setTimeout(async () => {
            const request = await readBody(event)
            if (!request) {
                return {
                    statusCode: 400,
                    statusMessage: "Fout verzoek",
                    message: "Het verzoek kon niet worden begrepen door de server vanwege een onjuiste syntaxis."
                };
            }

            const { email, wachtwoord }: any = await readBody(event);
            if (!email || !wachtwoord) {
                return {
                    statusCode: 400,
                    statusMessage: "Fout verzoek",
                    message: "Het verzoek kon niet worden begrepen door de server vanwege een onjuiste syntaxis."
                };
            }

            const client = await serverSupabaseClient(event)

            const { data, error } = await client.auth.signInWithPassword({
                email, password: wachtwoord
            })

            if (error) return reject({
                statusCode: 404,
                statusMessage: "Niet gevonden",
                message: "Het e-mailadres of wachtwoord is onjuist."
            });

            const { user, session } = data

            setCookie(event, "sb-access-token", session?.access_token)
            setCookie(event, "sb-refresh-token", session?.refresh_token)

            return resolve({
                statusCode: 200,
                statusMessage: "OK",
                message: "Je bent succesvol ingelogd.",
                user
            });
        }, 2000);
    });
});
