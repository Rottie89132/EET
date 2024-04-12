<template>
    <field :name="name" v-slot="{ field, meta }">
        <label v-if="label != ''" class="text-base font-bold text-neutral-900" :for="type">{{ label }}</label>
        <textarea :placeholder="value"
            :class="meta.touched && !meta.valid ? ' mt-2 mb-2 border-[#B92538] focus:border-[#B92538] ' : ' border-gray-300 mt-2 mb-2'" 
            class="w-full max-h-96 min-h-28 p-2 border rounded-md outline-none appearance-none" :ref="type" :type="type" v-bind="field"
            :aria-label="type" :autocomplete="`current-${probs.type}`" />
        <ErrorMessage class="mb-2 -mt-2 text-xs text-[#B92538] block" :name="name"></ErrorMessage>
    </field>
</template>

<script setup lang="ts">
const probs = defineProps({
    type: { type: String, default: "text" },
    label: { type: String, default: "" },
    name: { type: String, default: "Input" },
    value: { type: String, default: "" },
});
</script>
