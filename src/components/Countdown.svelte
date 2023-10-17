<script lang="ts">
	export let date: Date;
	export let name: string;

	const currentDate = Date.now();

	function updateDate(date: Date) {
		date.setSeconds(date.getSeconds() - 1);

		return date;
	}

	setInterval(() => {
		date = updateDate(date);
	}, 1000);

	function getRemainingDays(date: Date, currentDate: number) {
		const differenceInMillisecons = date.getTime() - currentDate;
		return Math.floor(differenceInMillisecons / (1000 * 60 * 60 * 24));
	}

	function getRemainingHours(date: Date, currentDate: number) {
		const differenceInMilliseconds = date.getTime() - currentDate;
		return Math.floor((differenceInMilliseconds / (1000 * 60 * 60)) % 24);
	}

	function getRemainingMinutes(date: Date, currentDate: number) {
		const differenceInMilliseconds = date.getTime() - currentDate;
		return Math.floor((differenceInMilliseconds / (1000 * 60)) % 60);
	}

	function getRemainingSeconds(date: Date, currentDate: number) {
		const differenceInMilliseconds = date.getTime() - currentDate;
		return Math.floor((differenceInMilliseconds / 1000) % 60);
	}
</script>

<main>
	<p>{name}'ye</p>

	<div class="container">
		<p>{getRemainingDays(date, currentDate)} <br />gun</p>
		<p>{getRemainingHours(date, currentDate)} <br />saat</p>
		<p>{getRemainingMinutes(date, currentDate)} <br />dakika</p>
		<p>{getRemainingSeconds(date, currentDate)} <br />saniye</p>
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
