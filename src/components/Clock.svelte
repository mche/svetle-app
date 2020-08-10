<svg xmlns="http://www.w3.org/2000/svg"  xmlns:xlink="http://www.w3.org/1999/xlink" viewBox="-{r} -{r} {2*r} {2*r}" class="z-depth-3 green lighten-4">

  <circle class="clock-face" r={r-2}/>

  <!-- отметки -->
  {#each [0, 5, 10, 15, 20, 25, 30, 35, 40, 45, 50, 55] as minute}
    <line  class="major {minute % 15  ? '' : 'major2' } { minute == seconds ? 'major-second-on' : '' }"  y1=35  y2=45 transform="rotate({30 * minute})" />

    {#each [1, 2, 3, 4] as offset}
      <circle class="minor { minute+offset == seconds ? 'minor-second-on' : '' }" r=1 cy={ Math.sin((2*Math.PI/60)*(minute + offset))*(r-12) } cx={ Math.cos((2*Math.PI/60)*(minute + offset))*(r-12) } />
    {/each}
  {/each}

  <!-- часовая стрелка -->
  <line class="hour" y1=2 y2=-20 transform="rotate({ 30 * hours + minutes / 2 })" />

  <!-- минутная стрелка -->
  <line class="minute" y1=4 y2=-30 transform="rotate({ 6 * minutes + seconds / 10 })" />

  <!-- секундная стрелка-->
  <g transform="rotate({ 6 * (seconds+milliseconds/1000) })">
    <line class="second" y1=10 y2=-38 />
    <line class="second-counterweight" y1=10 y2=2 />
  </g>
    <text x=-10 y=30 class="digits">{ hours.toString().length === 1 ? '0'+hours.toString() : hours }</text>
    {#if !(seconds%2) }<text x=-1 y=30 class="digits tick">:</text>{/if}
    <text x=2 y=30 class="digits">{ minutes.toString().length === 1 ? '0'+minutes.toString() : minutes }</text>
</svg>
<!--div>{ classMinuteOn[seconds] }</div-->

<script>
  import { onMount } from "svelte";

  let time = new Date();
  let r = 50;/// радиус циферблата 

  // эти переменные автоматически обновляются, каждый раз
  // когда изменяется `time`, блягодаря префиксу `$:`
  $: hours = time.getHours();
  $: minutes = time.getMinutes();
  $: seconds = time.getSeconds();
  $: milliseconds = time.getMilliseconds();
//~   $: classMinuteOn = Array(60).fill('').map((minute, idx) => {return idx == seconds ? 'major-second-on' : ''; });///console.log('$classMinuteOn', seconds)
  
  onMount(() => {
    const interval = setInterval(() => {
      time = new Date();
    }, 100);

    return () => {
      clearInterval(interval);
    };
  });
  
</script>

<style lang="scss">
  $bg: #C8E6C9;
  $clr1: #1B5E20;
  $clr2: rgb(180,0,0);
  $clr3: blue;

  svg {

  }

  .clock-face {
    fill: $bg;
  }

  .minor {
    stroke-width: 0;
  }
  .minor-second-on {
    fill: $clr3;
  }

  .major {
    stroke: $clr3;
    stroke-width: 1.5;
  }
  
  .major2 {/* 0,15,30,45 минуты */
    stroke-width: 3;
  }
  .major-second-on {
    stroke: $clr2;
  }
  

  .hour {
    stroke: black;
    stroke-width: 3;
  }

  .minute {
    stroke: #666;
    stroke-width: 2;
  }

  .second, .second-counterweight {
    stroke: $clr2;
    stroke-width: 0.5;
  }

  .second-counterweight {
    stroke-width: 2;
  }
  
  .digits {
    fill: $clr1;
    font-size: 0.5rem;
  }
  .tick {
    font-size:0.6rem;
  }
  .z-depth-3 {
    box-shadow: 0 6px 10px 0 rgba(0, 0, 0, 0.14), 0 1px 18px 0 rgba(0, 0, 0, 0.12), 0 3px 5px -1px rgba(0, 0, 0, 0.3);
  }
  .green.lighten-4 {
    background-color: $bg;
  }

</style>

