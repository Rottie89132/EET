<template>
    <FormWizard @submit="onSubmit" :validation-schema="Schema">
        <FormStep>
            <FieldInput type="text" label="Naam" name="naam" v-model="naam" :disabled="true" />
            <FieldInput type="text" label="Keuken" name="keuken" v-model="keuken" />
            <FieldInput type="tel" label="Telefoon" name="telefoon" value="06 12 34 56 78" v-model="telefoon" />
        </FormStep>
        <FormStep>
            <FieldArea type="text" label="Beschrijving" name="beschrijving" v-model="beschrijving" />
            <FieldSelect type="text" label="Prijs" name="prijs" :options v-model="prijs" />
        </FormStep>
        <FormStep>
            <FieldInput type="text" label="Stad" name="stad" v-model="stad" />
            <FieldInput type="text" label="Locatie" name="locatie" v-model="locatie" />
        </FormStep>
        <FormStep>
            <FieldOpeningstijden label="Openingstijden" name="openingstijden" v-model:openingTimes="openingTimes" />
        </FormStep>
        <FormStep>
            <FieldInput type="number" label="Tafels" name="tafels" v-model="tafels" />
            <FieldInput type="number" label="Capaciteit (Personen)" name="capaciteit" v-model="capaciteit" />
            <FieldInput type="number" label="Duur" name="duur" v-model="duur" />
        </FormStep>
        <FormStep>
            <FieldImage label="Thumbnail" name="thumbnail" :multipe="false" :max="1" v-model:preview="thumbnail"
                v-model:previewArray="thumbnailArray" />
        </FormStep>
        <FormStep>
            <FieldImage label="Afbeeldingen" name="afbeeldingen" :multipe="true" :max="3" v-model:preview="afbeeldingen"
                v-model:previewArray="afbeeldingenArray" />
        </FormStep>
        <FormStep>
            <FieldPdf label="Menu" name="menu" v-model:preview="menu" :bewerken="true" />
            <div v-if="result" class="flex gap-2 mt-6 mb-2">
                <hr class="my-3" />
                <p :class="result.statusCode != 200 ? 'text-red-600' : 'text-green-800'"
                    class="-ml-1 text-sm leading-4">
                    {{ result.message }}
                </p>
            </div>
        </FormStep>
    </FormWizard>
</template>

<script setup lang="ts">

    const naam = ref("");
    const keuken = ref("");
    const telefoon = ref("");
    const beschrijving = ref("");
    const prijs = ref("");
    const stad = ref("");
    const locatie = ref("");
    const tafels = ref("");
    const capaciteit = ref("");
    const duur = ref("");

    const openingTimes = ref([]);
    const thumbnail = ref([]);
    const thumbnailArray = ref([]);
    const afbeeldingen = ref([]);
    const afbeeldingenArray = ref([]);
    const menu = ref("");

    const { details, Schema, options, result, onSubmit } = defineModels<{
        details: any;
        Schema: any;
        options: any;
        result: any;
        onSubmit: (values: any, actions: any) => void;
    }>();

    const convertPriceToDescription = () => {
        const prijs = details.value.prijs;

        if (prijs == "€") return "Laag";
        else if (prijs == "€€") return "Gemiddeld";
        else return "Hoog";
    };

    naam.value = details.value.naam;
    keuken.value = details.value.keuken;
    telefoon.value = details.value.telefoon;
    beschrijving.value = details.value.beschrijving;
    prijs.value = convertPriceToDescription();
    stad.value = details.value.stad;
    locatie.value = details.value.locatie;
    tafels.value = details.value.aantaltafels;
    capaciteit.value = details.value.capaciteit;
    stad.value = details.value.plaats;
    duur.value = details.value.duur;
    openingTimes.value = details.value.Openingstijden.map((item: any) => {
        const [open, sluit] = item.tijd.split(' - ');
        return { dag: item.dag, open, sluit };
    });

    thumbnail.value = [details.value.thumbnail.data.publicUrl] as any;
    afbeeldingen.value = details.value.images.map((item: any) => item.data.publicUrl);
    menu.value = details.value.menu.data.publicUrl.split('/')[9];

    




</script>