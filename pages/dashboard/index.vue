<template>

    <form @submit.prevent="createRestaurant" class="max-w-md mx-auto">
        <div class="mb-4">
            <label for="naam" class="block mb-2">Naam:</label>
            <input type="text" id="naam" v-model="naam" required class="w-full px-4 py-2 border rounded">
        </div>

        <div class="mb-4">
            <label for="plaats" class="block mb-2">Plaats:</label>
            <input type="text" id="plaats" v-model="plaats" required class="w-full px-4 py-2 border rounded">
        </div>

        <div class="mb-4">
            <label for="prijs" class="block mb-2">Prijs:</label>
            <select id="prijs" v-model="prijs" required class="w-full px-4 py-2 border rounded">
                <option value="Laag">€</option>
                <option value="Gemideld">€€</option>
                <option value="Hoog">€€€</option>
            </select>
        </div>

        <div class="mb-4">
            <label for="keuken" class="block mb-2">Keuken:</label>
            <input type="text" id="keuken" v-model="keuken" required class="w-full px-4 py-2 border rounded">
        </div>

        <div class="mb-4">
            <label for="beschrijving" class="block mb-2">Beschrijving:</label>
            <textarea id="beschrijving" v-model="beschrijving" required
                class="w-full px-4 py-2 border rounded"></textarea>
        </div>

        <div class="mb-4">
            <label for="thumbnail" class="block mb-2">Thumbnail:</label>
            <input type="file" id="thumbnail" @change="handleThumbnailChange" required class="">
        </div>

        <button type="submit" class="w-full px-4 py-2 bg-blue-500 text-white rounded">Create</button>
    </form>

</template>



<script setup>
const naam = ref('');
const plaats = ref('');
const prijs = ref('');
const keuken = ref('');
const beschrijving = ref('');
const thumbnail = ref('');



const createRestaurant = async () => {

    const formData = new FormData();
    formData.append('naam', naam.value);
    formData.append('plaats', plaats.value);
    formData.append('prijs', prijs.value);
    formData.append('keuken', keuken.value);
    formData.append('beschrijving', beschrijving.value);
    formData.append('file', thumbnail.value);


    const data = await $fetch("/api/restaurants", {
        method: "POST",
        body: formData
    });

    console.log(data);





};


const handleThumbnailChange = (e) => {
    const file = e.target.files[0];
    thumbnail.value = file;

};
</script>