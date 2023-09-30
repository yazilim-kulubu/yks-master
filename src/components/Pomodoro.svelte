<script lang="ts">
    import { onMount } from "svelte";

    // Settings
    const alarmSoundUrl = "https://cdn.freesound.org/sounds/250/250629-b3602f53-1fbe-4ff9-b950-5703c545c057?filename=250629__kwahmah_02__alarm1.mp3";
    const visualAlarmDurationMS = 1500;

    // Preferences
    let workMins = 25;
    let shortBreakMins = 5;
    let longBreakMins = 15;
    let worksBeforeLongBreak = 4;
    let pauseBeforeWork = true;
    let pauseBeforeBreak = false;
    let visualAlarm = true;
    let soundAlarm = true;
    let alarmPlaysUntilUnpaused = false;

    // App State
    let timeLeftSecs = workMins * 60;
    let worksInSequence = 0;
    let isPaused = pauseBeforeWork;
    let isWorking = true;
    let isSettingsVisible = false;
    let runVisualAlarm = false;

    let minsDisplay: string;
    let secsDisplay: string;
    let alarmElem: HTMLAudioElement;

    $: if (!isPaused)
        alarmElem.loop = false;

    $: if (worksInSequence > worksBeforeLongBreak)
        worksInSequence = 0;

    $: {
        minsDisplay = String(Math.floor(timeLeftSecs / 60)).padStart(2, "0");
        secsDisplay = String(Math.floor(timeLeftSecs % 60)).padStart(2, "0");
    }

    function setJustCompleted() {
        if (soundAlarm) {
            alarmElem.currentTime = 0;
            alarmElem.loop = alarmPlaysUntilUnpaused;
            alarmElem.play();
        }

        runVisualAlarm = true;
        setTimeout(() => {
            runVisualAlarm = false;
        }, visualAlarmDurationMS);
    }

    function nextState() {
        if (isWorking) {
            worksInSequence++;
            timeLeftSecs = worksInSequence % worksBeforeLongBreak
                         ? shortBreakMins * 60
                         : longBreakMins * 60;
            isPaused = isPaused || pauseBeforeBreak;
        }
        else {
            timeLeftSecs = workMins * 60;
            // Reset the progress bar *after* the break is over
            worksInSequence %= worksBeforeLongBreak;
            isPaused = isPaused || pauseBeforeWork;
        }

        // Trigger reactivity
        isPaused = !isPaused;
        isPaused = !isPaused;

        isWorking = !isWorking
        setJustCompleted();
    }

    function everySecond() {
        if (!isPaused)
            timeLeftSecs--;

        if (timeLeftSecs <= 0)
            nextState();
    }

    function resetTimer() {
        timeLeftSecs = workMins * 60;
        worksInSequence = 0;
        isPaused = pauseBeforeWork;
        isWorking = true;
    }

    function resetSettings() {
        workMins = 25;
        shortBreakMins = 5;
        longBreakMins = 15;
        worksBeforeLongBreak = 4;
        pauseBeforeWork = true;
        pauseBeforeBreak = false;
        visualAlarm = true;
        soundAlarm = false;
        alarmPlaysUntilUnpaused = true;
    }

    onMount(() => {
        const interval = setInterval(everySecond, 1000);
        return () => clearInterval(interval);
    })
</script>

<div class="main-container">
    <audio bind:this={alarmElem} src={alarmSoundUrl} muted={!soundAlarm}></audio>
    <div class="timer-and-controls">
        <div class="timer" class:flash={runVisualAlarm && visualAlarm}>
            <div class="header">
                <p>{isWorking ? "Çalışma" : "Mola"}</p>
            </div>
            <div class="display">
                <p class="minute">{minsDisplay}</p>
                <p class="min-sec-seper">:</p>
                <p class="seconds">{secsDisplay}</p>
            </div>
        </div>
        <div class="bottom-container">
            <div class="controls">
                <button on:click={() => isSettingsVisible = !isSettingsVisible}>
                    Seçenekler
                </button>
                <button on:click={() => timeLeftSecs -= 60}>
                    -1 dk
                </button>
                <button on:click={() => isPaused = !isPaused}>
                    {isPaused ? "Başlat" : "Durdur"}
                </button>
                <button on:click={() => timeLeftSecs += 60}>
                    +1 dk
                </button>
                <button on:click={nextState}>
                    Sıradaki
                </button>
            </div>
            <div class="sequence-progress-bar">
                <div
                    class="progressed-bar"
                    style="width: {worksInSequence/worksBeforeLongBreak*100}%"
                ></div>
            </div>
        </div>
    </div>
    {#if isSettingsVisible}
        <div class="settings">
            <div class="settings-group">
                <label for="time-setting-groups">Süreler (Dakika)</label>
                <div class="time-setting-groups" id="time-setting-groups">
                    <div class="time-setting-group">
                        <label for="work-mins">Çalışma</label>
                        <input type="number" id="work-mins" min="1" bind:value={workMins}>
                    </div>
                    <div class="time-setting-group">
                        <label for="short-mins">Kısa Mola</label>
                        <input type="number" id="short-mins" min="1" bind:value={shortBreakMins}>
                    </div>
                    <div class="time-setting-group">
                        <label for="long-mins">Uzun Mola</label>
                        <input type="number" id="long-mins" min="1" bind:value={longBreakMins}>
                    </div>
                </div>
            </div>
            <div class="settings-group">
                <label for="">Diğer Seçenekler</label>
                <div class="settings-row">
                    <label for="works-before-long">Uzun Mola Öncesi Çalışma Sayısı</label>
                    <input type="number" id="works-before-long" min="1" bind:value={worksBeforeLongBreak}>
                </div>
                <div class="settings-row">
                    <label for="visual-alarm">Süre Dolunca Görsel Olarak Uyar</label>
                    <input type="checkbox" id="visual-alarm" bind:checked={visualAlarm}>
                </div>
                <div class="settings-row">
                    <label for="sound-alarm">Süre Dolunca Alarm Çal</label>
                    <input type="checkbox" id="sound-alarm" bind:checked={soundAlarm}>
                </div>
                <div class="settings-row">
                    <label for="alarm-plays-till">Süre Başlatılana Kadar Alarm Çalmaya Devam Etsin</label>
                    <input type="checkbox" id="alarm-plays-till" bind:checked={alarmPlaysUntilUnpaused}>
                </div>
                <div class="settings-row">
                    <label for="pause-before-work">Çalışma Süresini Manuel Olarak Başlat</label>
                    <input type="checkbox" id="pause-before-work" bind:checked={pauseBeforeWork}>
                </div>
                <div class="settings-row">
                    <label for="pause-before-break">Mola Süresini Manuel Olarak Başlat</label>
                    <input type="checkbox" id="pause-before-break" bind:checked={pauseBeforeBreak}>
                </div>
                <div class="settings-row">
                    <button on:click={resetTimer}>Zamanlayıcıyı Sıfırla</button>
                    <button on:click={resetSettings}>Varsayılan Ayarlara Dön</button>
                </div>
            </div>
        </div>
    {/if}
</div>

<style>
    @keyframes flash {
        25% { color: red; }
        50% { color: white; }
        75% { color: red; }
    }

    .flash {
        animation: flash;
        animation-iteration-count: infinite;
        animation-duration: 0.15s;
    }

    .main-container {
        width: 40rem;
        background: #eee;
    }

    .timer-and-controls {
        display: flex;
        flex-direction: column;
        justify-content: space-between;
        padding-bottom: 0.2rem;
    }

    .sequence-progress-bar {
        width: 100%;
        height: 0.4rem;
        background: #77f;
    }

    .progressed-bar {
        height: 100%;
        background: #22f;
    }

    .timer {
        margin: 2rem 0;
    }

    .header {
        text-align: center;
        text-transform: uppercase;
        font-size: 1.3rem;
    }

    .display {
        height: 100%;
        display: flex;
        justify-content: center;
        align-items: center;
        gap: 1rem;
    }

    .display p {
        font-size: 5rem;
        user-select: none;
    }

    .controls {
        display: flex;
        padding: 0.5rem 0.5rem;
        justify-content: space-evenly;
        gap: 0.5rem;
    }

    .controls button {
        width: 100%;
        height: 2rem;
        text-transform: uppercase;
        font-size: 0.7rem;
    }

    .settings {
        padding: 0 0.5rem;
    }

    .settings-group {
        margin-top: 0.5rem;
    }

    .settings-group > label {
        font-weight: 600;
        text-transform: uppercase;
        font-size: 0.75rem;
    }

    .settings-row {
        display: flex;
        align-items: center;
        justify-content: space-between;
    }

    .settings-row label {
        font-size: 0.85rem;
    }

    .time-setting-groups label {
        text-transform: uppercase;
        font-size: 0.65rem;
    }

    .time-setting-groups input {
        text-align: right;
        width: 100%;
    }

    .time-setting-groups {
        display: flex;
        gap: 0.5rem;
        justify-content: space-evenly;
    }
</style>
