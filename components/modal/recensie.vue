<template>
	<div>
		<FormWizard :validation-schema="validationSchema" @submit="onSubmit">
			<FormStep>
				<FieldArea type="text" label="" name="recensie" value="Laat hier je beoordeling achter zodat wij onze service kunnen verbeteren" />
			</FormStep>
			<FormStep>
				<div>
					<FieldSlider name="beoordeling" />
				</div>
			</FormStep>
			<p v-if="isSuccess" class="text-green-800 text-sm leading-4 mb-5">
				Recensie is gelukt! Bedankt voor je feedback.
			</p>
		</FormWizard>
	</div>
</template>

<script setup lang="ts">
	import { configure } from "vee-validate";
	import * as yup from "yup";

	const { onSubmit, isSuccess } = defineModels<{
		onSubmit: any;
		isSuccess: boolean;
	}>();

	const wordCount = (value: any) => {
		if (!value) return false;
		const wordCount = value.trim().split(/\s+/).length;
		return wordCount > 2;
	};

	const validationSchema = [
		yup.object({
			recensie: yup.string().required("Recensie is verplicht").label("Recensie").min(10, "Recensie moet minimaal 10 tekens bevatten").max(2500, "Recensie mag maximaal 2500 tekens bevatten").test("word-count", "Recensie moet meer dan 2 woorden bevatten", wordCount),
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
