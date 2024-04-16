<template>
    <div class=" select-none">
        <Field :name="name" tabindex="1" class=" sr-only " type="number" v-model="personen" />
        <div class="grid grid-cols-4 gap-2 mt-2 mb-4">
            <button v-for="persoon in 8" :key="persoon" tabindex="0" @keydown.enter="pick(persoon)" @click="pick(persoon)"
            :class="personen === persoon ? 'bg-[#4e995b] hover:bg-[#42834d] border-[#4e995b] text-white' : 'hover:bg-gray-200 border-gray-300'" class="flex items-center justify-center p-2 border transition-all delay-100 ease-in rounded-md ">{{ persoon }}</button>
        </div>
        <ErrorMessage class="mb-2 -mt-2 text-xs text-[#B92538] block" :name="name" />
    </div>
</template>

<script setup lang="ts">
    
    const { name, personen} = defineModels<{
        name: string;
        personen: number;
    }>();

    const pick = (persoon: number) => {
        personen.value = persoon;
    };



</script>

