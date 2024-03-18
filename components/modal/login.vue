<template>
    <ClientOnly>
        <Transition name="modal">
            <div v-if="active"
                class="fixed top-0 z-50 flex items-end justify-center w-screen h-screen bg-black md:justify-end md:items-end bg-opacity-60 backdrop-blur-sm">
                <div tabindex="0" ref="modal">
                    <Transition :name="ismoble ? 'modalDelay' : 'modalSlide'">
                        <div :ref="ismoble ? 'modalDelay' : 'modalSlide'" v-if="activeDelay">
                            <div class="p-8 md:h-screen rounded-2xl md:rounded-none bg-white w-screen md:max-w-[30vw]">
                                <div class="flex items-center justify-between mb-2">
                                    <h1 class="text-3xl font-bold">Inloggen</h1>
                                    <button @click="closeModal" class="text-gray-500 hover:text-gray-700">
                                        <Icon name="pajamas:close-xs" size="2em"></Icon>
                                    </button>
                                </div>
                                <p class="mb-4">Vul hieronder je gegevens in om in te loggen.</p>
                                <Form @submit="handleRequest" :validation-schema="schema" v-slot="{ meta }">
                                    <FieldInput type="email" label="Email" name="email" v-model="email" />
                                    <FieldInput type="password" label="Wachtwoord" name="wachtwoord"
                                        v-model="password" />

                                    <div class="mb-4 mt-2">
                                        <button
                                            class="w-full p-2 bg-[#4e995b] text-white rounded-md hover:bg-[#43874e] focus:outline-none"
                                            type="submit">Inloggen</button>
                                    </div>
                                </Form>
                                <hr class="my-4" />
                                <GoogleSignInButton @success="handleLoginSuccess"></GoogleSignInButton>
                            </div>
                        </div>
                    </Transition>
                </div>
            </div>
        </Transition>
    </ClientOnly>
</template>

<script setup lang="ts">
import { configure } from "vee-validate";
import * as yup from "yup";

const { $pwa }: any = useNuxtApp();

const modal = ref(null);
const modalDelay = ref(null);
const modalSlide = ref(null);
const installed = ref(false);
const ismoble = ref(false);
const email = ref("");
const password = ref("");

const schema = yup.object().shape({
    email: yup.string().email("email moet geldig zijn").required("email is verplicht"),
    wachtwoord: yup.string().min(8, "wachtwoord moet minimaal 8 lang zijn").max(32, "wachtwoord mag maximaal 32 lang zijn").required("wachtwoord is verplicht"),
});

configure({
    validateOnBlur: true,
    validateOnChange: true,
    validateOnInput: true,
    validateOnModelUpdate: true,
});

const { active, activeDelay, User } = defineModels<{
    active: Boolean;
    activeDelay: Boolean;
    User: any;
}>();

const handleRequest = async (values: any, actions: any) => {
    const { data, error }: any = await useFetch("/api/auth", {
        method: "post",
        body: values,
    });

    if (!error.value) {
        User.value = data.value?.user.user_metadata;
        closeModal();
        actions.resetForm();
    } else {
        actions.setErrors({
            email: error.value.data.message,
            wachtwoord: error.value.data.message,
        });
        setTimeout(() => actions.resetForm(), 10000);
    }
};

const handleLoginSuccess = async (response: any) => {
    const { data, error }: any = await useFetch("/api/auth/google/identity", {
        method: "post",
        body: response,
    });

    if (!error.value) {
        setTimeout(() => {
            closeModal();
            User.value = data.value?.user.user_metadata;
        }, 500);
    }
};

const closeModal = () => {
    activeDelay.value = false;
    setTimeout(() => {
        active.value = false;
    }, 100);
};

onClickOutside(modal, () => {
    closeModal();
});

onMounted(() => {
    if ($pwa?.isPWAIscripted) installed.value = true;
    const Width = ref(window.innerWidth);

    ismoble.value = Width.value < 768;
    watch(Width, (newValue: any) => {
        ismoble.value = newValue < 768;
    });

    window.addEventListener("resize", () => {
        Width.value = window.innerWidth;
    });
});

onUnmounted(() => {
    window.removeEventListener("resize", () => { });
});
</script>

<style scoped>
.modal-enter-active,
.modal-leave-active {
    transition: all 0.8s ease;
}

.modal-enter-from,
.modal-leave-to {
    opacity: 0;
}

.modalDelay-enter-active,
.modalDelay-leave-active {
    transition: all 1s ease;
}

.modalDelay-enter-from,
.modalDelay-leave-to {
    opacity: 0;
    transform: translateY(12em);
}

.modalSlide-enter-active,
.modalSlide-leave-active {
    transition: all 1s ease;
}

.modalSlide-enter-from,
.modalSlide-leave-to {
    opacity: 0;
    transform: translatex(12em);
}
</style>
