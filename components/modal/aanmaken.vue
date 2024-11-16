<template>
	<FormWizard @submit="onSubmit" :validation-schema="Schema">
		<FormStep>
			<FieldInput type="text" label="Naam" name="naam" />
			<FieldInput type="text" label="Keuken" name="keuken" />
			<FieldInput type="tel" label="Telefoon" name="telefoon" value="612345678" />
		</FormStep>
		<FormStep>
			<FieldArea type="text" label="Beschrijving" name="beschrijving" />
			<FieldSelect type="text" label="Prijs" name="prijs" :options />
		</FormStep>
		<FormStep>
			<FieldInput type="text" label="Stad" name="stad" />
			<FieldInput type="text" label="Locatie" name="locatie" />
		</FormStep>
		<FormStep>
			<FieldOpeningstijden label="Openingstijden" name="openingstijden" v-model:openingTimes="openingTimes" />
		</FormStep>
		<FormStep>
			<FieldInput type="number" label="Tafels" name="tafels" />
			<FieldInput type="number" label="Capaciteit (Personen)" name="capaciteit" />
			<FieldInput type="number" label="Duur" name="duur" />
		</FormStep>
		<FormStep>
			<FieldImage label="Thumbnail" name="thumbnail" :multipe="false" :max="1" v-model:preview="thumbnail" v-model:previewArray="thumbnailArray" />
		</FormStep>
		<FormStep>
			<FieldImage label="Afbeeldingen" name="afbeeldingen" :multipe="true" :max="3" v-model:preview="afbeeldingen" v-model:previewArray="afbeeldingenArray" />
		</FormStep>
		<FormStep>
			<FieldPdf label="Menu" name="menu" v-model:preview="menu" :bewerken="false" />
			<div v-if="result" class="flex gap-2 mt-6 mb-2">
				<hr class="my-3" />
				<p :class="result.statusCode != 200 ? 'text-red-600' : 'text-green-800'" class="-ml-1 text-sm leading-4">
					{{ result.message }}
				</p>
			</div>
		</FormStep>
	</FormWizard>
</template>

<script setup lang="ts">
	const { Schema, options, openingTimes, thumbnail, thumbnailArray, afbeeldingen, afbeeldingenArray, menu, result, onSubmit } = defineModels<{
		Schema: any;
		options: any;
		openingTimes: any;
		thumbnail: any;
		thumbnailArray: any;
		afbeeldingen: any;
		afbeeldingenArray: any;
		menu: any;
		result: any;
		onSubmit: (values: any, actions: any) => void;
	}>();
</script>
