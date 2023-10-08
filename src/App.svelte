<script>
	import Countdown from "./Countdown.svelte";
	import Pomodoro from "./components/Pomodoro.svelte";
</script>

<main>
	<h1>Hello, World!</h1>
	<Pomodoro />
	<Countdown date={new Date("2024-06-15T10:15:00")} name={"TYT"} />
	<Countdown date={new Date("2024-06-16T10:15:00")} name={"AYT/YDT"} />
</main>
