<template>
	<div>
		<FormWizard :validation-schema="validationSchema" @submit="onSubmit">
			<FormStep>
				<FieldArea type="text" label="" name="recensie" value="Laat hier je beoordeling achter zodat wij onze service kunnen verbeteren" />
			</FormStep>
			<FormStep>
				<div class="pt-4 flex h-68 md:h-72 items-center w-full justify-center">
					<FieldSlider name="beoordeling" />
				</div>
			</FormStep>
		</FormWizard>
	</div>
</template>

<script setup lang="ts">
	import { configure } from "vee-validate";
	import * as yup from "yup";

	const { onSubmit } = defineModels<{
		onSubmit: any;
	}>();

	const wordCount = (value: any) => {
		if (!value) return false;
		const wordCount = value.trim().split(/\s+/).length;
		return wordCount > 10;
	};

	const validationSchema = [
		yup.object({
			recensie: yup.string().required("Recensie is verplicht").label("Recensie").min(25, "Recensie moet minimaal 25 tekens bevatten").max(2500, "Recensie mag maximaal 2500 tekens bevatten").test("word-count", "Recensie moet meer dan 10 woorden bevatten", wordCount),
		}),
		yup.object({
			beoordeling: yup.number().required("beoordeling is verplicht").label("beoordeling"),
		}),
	];

	configure({
		validateOnBlur: true,
		validateOnChange: true,
		validateOnInput: true,
		validateOnModelUpdate: true,
	});
</script>
