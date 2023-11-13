<script lang="ts">
	import { onMount } from "svelte";
	import { database } from "../database";
	import { nanoid } from "nanoid";

	let sorular: any;
	const dersler: string[] = ["matematik", "biyoloji", "kimya", "fizik"];

	onMount(async () => {
		sorular = await getSorular();
	});

	async function soruKaydet(data: any) {
		const db = await database();

		await db.soru.insert({
			id: nanoid(),
			dogruSayisi: data.dogru,
			yanlisSayisi: data.yanlis,
			bosSayisi: data.bos,
			ders: data.ders,
		});

		sorular = await getSorular();
	}

	function onFormSubmit(event: Event) {
		let data = Object.fromEntries(new FormData(event.target));
		console.log(data);
		soruKaydet(data);
	}

	async function getSorular() {
		const db = await database();
		const allSorular = await db.soru.find().exec();

		return allSorular;
	}
</script>

<main>
	{#if sorular}
		<table>
			<tr>
				<th>Ders</th>
				<th>Dogru</th>
				<th>Yanlis</th>
				<th>Bos</th>
			</tr>

			{#each sorular as soru}
				<tr>
					<th>{soru.ders}</th>
					<th>{soru.dogruSayisi}</th>
					<th>{soru.yanlisSayisi}</th>
					<th>{soru.bosSayisi}</th>
				</tr>
			{/each}
		</table>
	{/if}

	<form on:submit|preventDefault={onFormSubmit}>
		<label for="dogru">Dogru: </label>
		<input type="number" min="0" max="100" value="0" name="dogru" />

		<label for="yanlis">Yanlis: </label>
		<input type="number" min="0" max="100" value="0" name="yanlis" />

		<label for="bos">Bos: </label>
		<input type="number" min="0" max="100" value="0" name="bos" />

		<label for="ders">Ders: </label>
		<select name="ders">
			{#each dersler as ders}
				<option value={ders}>{ders}</option>
			{/each}
		</select>
		<button type="submit"> Kaydet </button>
	</form>
</main>
