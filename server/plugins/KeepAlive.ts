import { useScheduler } from "#scheduler"

const { RedirectUrl }: any = useRuntimeConfig()
export default defineNitroPlugin(() => {
    const scheduler = useScheduler();
    scheduler.run(() => {
        setTimeout(async () => await fetch(`${RedirectUrl}/api/status`).catch(err => console.error(err)))
    }).everyMinutes(5)
})



