<template>
    <div>
        <Navigation></Navigation>
        <div class=" pb-6">
            <div class="mt-2">
                <div :class="!installed ? 'top-[4rem] sticky -mt-14' : 'top-0 pt-14 md:top-0 md:-mt-5 fixed'"
                    class=" w-full z-10 px-6 bg-white">
                    <div class=" mb-4">
                        <h3 class="xl:text-3xl text-xl font-bold pt-5">Restaurants</h3>
                        <p class="xl:text-sm text-xs z-0 opacity-80 mb-2">
                            Hier zijn de restaurants die wij bieden voor jou!
                        </p>
                        <div class=" flex mb-1 mt-2 justify-between">
                            <div>
                                <form @submit.prevent="handleSearch">
                                    <input v-model="navstad"
                                        class=" placeholder:text-sm p-1 pl-3 border-2 xl:w-[10em] w-[9rem] appearance-none outline-none rounded-md"
                                        placeholder="zoeken op stad">
                                </form>
                            </div>
                            <div class=" flex gap-2">
                                <button v-if="pagina > 1" @click="vorigePagina"
                                    class="p-2 bg-[#F7F7F7] flex items-center justify-center rounded-md">
                                    <Icon name="ic:sharp-keyboard-arrow-left" size="1.2em"></Icon>
                                </button>
                                <button v-if="pagina < totalPagina" @click="volgendePagina"
                                    class="p-2 bg-[#F7F7F7] flex items-center justify-center rounded-md">
                                    <Icon name="ic:sharp-keyboard-arrow-right" size="1.2em"></Icon>
                                </button>

                                <button v-if="pagina == totalPagina" @click="eerstePagina"
                                    class="p-2 bg-[#F7F7F7] flex items-center justify-center rounded-md">
                                    <Icon name="ic:round-keyboard-double-arrow-left" size="1.2em"></Icon>
                                </button>

                                <button v-if="pagina < totalPagina" @click="laatstePagina"
                                    class="p-2 bg-[#F7F7F7] flex items-center justify-center rounded-md">
                                    <Icon name="ic:round-keyboard-double-arrow-right" size="1.2rem"></Icon>
                                </button>
                                <form @submit.prevent="navigeerPagina">
                                    <input v-model="NavPagina" name="page" type="number" aria-label="Search"
                                        class="p-[0.34rem] appearance-none outline-none w-9 text-center font-medium bg-[#4e995b] text-white flex items-center justify-center rounded-md" />
                                </form>
                            </div>
                        </div>
                    </div>
                    <hr class="pb-2" />
                </div>
                <div :class="!installed ? 'pb-6' : ' pb-[5.4rem] mt-[12rem] md:mt-[10.5rem]'"
                    class="grid h-fit pt-2 gap-4 px-6 xl:grid-cols-3 sm:grid-cols-2 grid-rows-1">
                    <div v-for="i in 9">
                        <Card :rating="4"></Card>
                    </div>
                </div>
            </div>
        </div>
    </div>
</template>

<script setup lang="ts">

const { $pwa }: any = useNuxtApp()
const installed = ref(false);

useSeoMeta({
    title: "EET | Restaurants",
    description: "",
    ogTitle: "EET | Restaurants",
    ogDescription: "",
    ogImage: "/image/banner.png",
    ogUrl: "https://eet.com",
    twitterTitle: "EET | Restaurants",
    twitterDescription: "",
    twitterImage: "/image/banner.png",
    twitterCard: "summary",
});

useHead({
    htmlAttrs: {
        lang: "nl",
    },
    link: [
        {
            rel: 'icon',
            type: 'image/svg',
            href: '/image/Logo.svg'
        }
    ]
});

onMounted(() => {
    if ($pwa?.isPWAInstalled) installed.value = true;
});

const stad = ref()
const pagina: number | any = ref(1)
const totalPagina = ref(9)
const NavPagina: number | any = ref()
const navstad: string | any = ref("")
const type: string | any = ref("")

pagina.value = useRoute().query.pagina
stad.value = useRoute().query.stad
type.value = useRoute().query.type
NavPagina.value = pagina.value

navstad.value = stad.value

if (!pagina.value) navigateTo(`/restaurants?pagina=1`)


const navigate = () => {

    if (type.value && navstad.value) navigateTo(`/restaurants?pagina=${pagina.value}&stad=${navstad.value || stad.value}&keuken=${type.value}`)
    else if (navstad.value) navigateTo(`/restaurants?pagina=${pagina.value}&stad=${navstad.value || stad.value}`)
    else if (type.value) navigateTo(`/restaurants?pagina=${pagina.value}&keuken=${type.value}`)
    else navigateTo(`/restaurants?pagina=${pagina.value}`)

}

const volgendePagina = () => {
    if (pagina.value == totalPagina.value) return
    pagina.value++
    NavPagina.value = pagina.value
    navigate()
}

const vorigePagina = () => {
    if (pagina.value == 1) return
    pagina.value--
    NavPagina.value = pagina.value
    navigate()
}

const eerstePagina = () => {
    pagina.value = 1
    NavPagina.value = pagina.value
    navigate()
}

const laatstePagina = () => {
    pagina.value = totalPagina.value
    NavPagina.value = pagina.value
    navigate()
}

const navigeerPagina = () => {
    pagina.value = NavPagina.value
    if (pagina.value < 1) pagina.value = 1
    if (pagina.value > totalPagina.value) pagina.value = totalPagina.value
    NavPagina.value = pagina.value
    navigate()
}

const handleSearch = () => {
    if (navstad.value === "") return navigateTo(`/restaurants?pagina=${pagina.value}`);
    else navigateTo(`/restaurants?pagina=${pagina.value}&stad=${navstad.value}`);
};



</script>

<style scoped></style>