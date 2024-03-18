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
    '@vite-pwa/nuxt',
    "@formkit/auto-animate",
    "@vee-validate/nuxt",
  ],
  nitro: {
    experimental: {
      websocket: true,
    }
  },
  veeValidate: {
    autoImports: true,
  },
  pwa: {
    strategies: "injectManifest",
    registerType: 'autoUpdate',
    manifest: {
      name: "EET",
      short_name: "EET",
      description: "EET",
      prefer_related_applications: true,
      orientation: "portrait",
      background_color: "#FFFFFF",
      theme_color: "#FFFFFF",
      display_override: ["window-controls-overlay", "standalone", "minimal-ui", "fullscreen", "browser"],
      icons: [
        {
          src: "icons/icon_144.png",
          sizes: "144x144",
          type: "image/png",
        },
        {
          src: "icons/icon_152.png",
          sizes: "152x152",
          type: "image/png",
        },
        {
          src: "icons/icon_192.png",
          sizes: "192x192",
          type: "image/svg",
        },
        {
          src: "icons/icon_512.png",
          sizes: "512x512",
          type: "image/png",
        },
      ],
      launch_handler: {
        client_mode: ["navigate-existing", "auto"]
      }
    },
    workbox: {
      navigateFallback: '/',
    },
    devOptions: {
      enabled: true,
      type: "module",
      suppressWarnings: true,
    },
  },
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
  app: {
    head: {
      meta: [
        { name: 'theme-color', media: '(prefers-color-scheme: light)', content: "#FFFFFF" },
        { name: "apple-mobile-web-app-status-bar-style", content: "black-translucent" },
      ],
      link: [
        { rel: 'icon', type: 'image/png', href: '/icons/icon_144.png' },
      ],
      charset: 'utf-8',
      viewport: 'viewport-fit=cover, width=device-width, initial-scale=1.0, minimum-scale=1.0, maximum-scale=1.0, user-scalable=no',
    }
  },
})