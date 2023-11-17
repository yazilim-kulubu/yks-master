<!-- 
                    | Task | -> input
                        | Timer |
            | Start | | Break | | Finish |

                DB (id -> timestamp)
            -> Save Month & Day & Year
            -> Save Task
            -> Save Start Time
            -> Save Total Breaktimes
            -> Save Worktime
            -> Save Finish Time
-->

<script lang="ts">
    import { onMount } from "svelte";

    enum FLOWTIME_STATE {
        WORKING,
        BREAKING,
        NONE
    }

    let state: FLOWTIME_STATE = FLOWTIME_STATE.NONE

    class timer {
        startTime: number = 0;
        elapsedTime: number = 0;
        oldElapsedTime: number = 0;
        paused: boolean = true;
        interval: number | null = null;

        start() {
            this.startTime = Date.now();
            this.interval = window.setInterval(() => {
                if (!this.paused) {
                    const endTime = Date.now();
                    this.elapsedTime = endTime - this.startTime + this.oldElapsedTime;
                }
            }, 1000)
        }

        resume() {
            this.startTime = Date.now();
            this.paused = false;
        }

        pause() {
            this.oldElapsedTime = this.elapsedTime;
            this.paused = true;
        }

        format() {
            return {
                "mins": String(Math.floor(Math.floor(this.elapsedTime / 1000) / 60)).padStart(2, "0"),
                "secs": String(Math.floor(Math.floor(this.elapsedTime / 1000) % 60)).padStart(2, "0")
            }
        }
    }

    let start: boolean = true;
    let work_timer_fired: boolean = false;
    let break_timer_fired: boolean = false;

    let work_timer = new timer();
    let break_timer = new timer();

    let dates = {
        "mins": "00",
        "secs": "00"
    }

    const do_task = () => {
        if (start) {
            break_timer.pause();
            if (!work_timer_fired) {
                work_timer.start();
                work_timer_fired = true;
            }
            work_timer.resume();
            state = FLOWTIME_STATE.WORKING;
        } else {
            work_timer.pause();
            if (!break_timer_fired) {
                break_timer.start();
                break_timer_fired = true;
            }
            break_timer.resume();
            state = FLOWTIME_STATE.BREAKING;
        }
        start = !start;

    }

    const setDate = () => {
        dates = state === FLOWTIME_STATE.WORKING ? work_timer.format()
                                                : state === FLOWTIME_STATE.BREAKING ? break_timer.format()
                                                : {"mins": "00", "secs": "00"}
    }

    onMount(() => {
        const interval = setInterval(setDate, 1000);
        return () => clearInterval(interval);
    })
</script>

<div class="main-flowtime-container">


    <!-- <p class="center-text">Task: <input type="text" id="task-input"></p> -->
    <div class="timer-container center-div">
        <div id="timer-text" class="center-text">
            <span class="minute">{dates["mins"]}</span>
            :
            <span class="seconds">{dates["secs"]}</span>
        </div>
    </div>

    <div class="button-container center-div">
        <button on:click={do_task}>
            {start ? "çalış" : "ara ver"}
        </button>
    </div>
</div>

<style>
    .main-flowtime-container {
        background: rgb(221, 221, 221);
        width: 40rem;
    }

    .timer-container {
        width: 20rem;
    }

    .center-div {
        margin: auto;
        padding: 10px;
    }

    .button-container {
        display: flex;
        padding: 0.5rem 0.5rem;
        justify-content: space-evenly;
        gap: 0.5rem;
    }

    .button-container button {
        width: 100%;
        height: 2rem;
        text-transform: uppercase;
        font-size: 0.7rem;
    }

    .center-text {
        text-align: center;
    }

    #timer-text {
        font-size: 3.5rem;
        user-select: none;
    }
</style>
