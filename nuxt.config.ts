// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
  devtools: { enabled: true },
  modules: [
    "@nuxtjs/supabase",
    "@nuxtjs/tailwindcss",
    '@vueuse/nuxt',
    '@nuxt/image',
    'nuxt-icon',
    'nuxt-vue3-google-signin',
    '@vue-macros/nuxt',
  ],

  supabase: {
    redirectOptions: {
      login: '/login',
      callback: '/confirm',
      include: ["/test"],
      exclude: [],
      cookieRedirect: true,
    },
    clientOptions: {
      auth: {
        flowType: 'pkce',
        detectSessionInUrl: true,
        persistSession: true,
        autoRefreshToken: true
      },
    }

  },
  googleSignIn: {
    clientId: '319260519514-50k25g8eb58p6aqn41vuq0eb5pt286do.apps.googleusercontent.com',
  },
})