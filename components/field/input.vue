<template>
    <field :name="name" v-slot="{ field, meta }">
        <label class="text-base font-bold text-neutral-900" :for="type">{{ label }}</label>
        <input :disabled="disabled" :placeholder="value"
            :class="meta.touched && !meta.valid ? ' mt-2 mb-5 border-[#B92538] focus:border-[#B92538] ' : ' border-gray-300 mt-2 mb-5'"
            class="w-full p-2 border rounded-md outline-none appearance-none" :ref="type" :type="type" v-bind="field"
            :aria-label="type" :autocomplete="`current-${probs.type}`" />
        <ErrorMessage class="mb-1 -mt-3 text-xs text-[#B92538] block" :name="name"></ErrorMessage>
    </field>
</template>

<script setup lang="ts">
const probs = defineProps({
    type: { type: String, required: true },
    label: { type: String, required: true },
    name: { type: String, required: true },
    value: { type: String, default: "" },
    disabled: { type: Boolean, default: false },
})
</script>
