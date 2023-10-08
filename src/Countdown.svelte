<script lang="ts">
	export let date: Date;
	export let name: string;

	const current_date = Date.now();

	function update_date(date: Date) {
		date.setSeconds(date.getSeconds() - 1);

		return date;
	}

	setInterval(() => {
		date = update_date(date);
	}, 1000);

	function get_remaining_days(date: Date, current_date: number) {
		const difference_in_milliseconds = date.getTime() - current_date;
		return Math.floor(difference_in_milliseconds / (1000 * 60 * 60 * 24));
	}

	function get_remaining_hours(date: Date, current_date: number) {
		const difference_in_milliseconds = date.getTime() - current_date;
		return Math.floor((difference_in_milliseconds / (1000 * 60 * 60)) % 24);
	}

	function get_remaining_minutes(date: Date, current_date: number) {
		const difference_in_milliseconds = date.getTime() - current_date;
		return Math.floor((difference_in_milliseconds / (1000 * 60)) % 60);
	}

	function get_remaining_seconds(date: Date, current_date: number) {
		const difference_in_milliseconds = date.getTime() - current_date;
		return Math.floor((difference_in_milliseconds / 1000) % 60);
	}
</script>

<main>
	<p>{name}'ye</p>

	<div class="container">
		<p>{get_remaining_days(date, current_date)} <br />gun</p>
		<p>{get_remaining_hours(date, current_date)} <br />saat</p>
		<p>{get_remaining_minutes(date, current_date)} <br />dakika</p>
		<p>{get_remaining_seconds(date, current_date)} <br />saniye</p>
	</div>

	<p>kaldi</p>
</main>

<style lang="css">
	main {
		text-align: center;
		margin: 10px;
		background-color: gray;
		width: 300px;
	}

	.container {
		display: flex;
		align-items: center;
		justify-content: space-evenly;
	}
</style>
