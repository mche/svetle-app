<svg xmlns="http://www.w3.org/2000/svg"  xmlns:xlink="http://www.w3.org/1999/xlink" viewBox="-{r} -{r} {2*r} {2*r}" class="z-depth-3 green lighten-4">

  <circle class="clock-face" r={r-2} />

  <!-- отметки 1 минута - 6 градусов -->
  {#each [0, 5, 10, 15, 20, 25, 30, 35, 40, 45, 50, 55] as minute}
    <line  class="major {minute % 15  ? '' : 'major2' } { minute == seconds ? 'major-second-on' : '' }"  y1=-{(0.7+(minute % 15 ? 0 : -0.1))*r}  y2=-{0.8*r}  transform="rotate({6*minute})" />
    {#each [1, 2, 3, 4] as offset}
      <circle class="minor { minute+offset == seconds ? 'minor-second-on' : '' }" r={minute+offset == seconds ? 2 : 1} cy={ Math.sin(ItemRadian(minute + offset-15))*(r-(0.22*r)) } cx={ Math.cos(ItemRadian(minute + offset-15))*(r-(0.22*r)) } />
    {/each}
  {/each}

  <!-- часовая стрелка -->
  <!-- line class="hour" y1=2 y2=-{0.4*r} transform="rotate({ (30*hours + minutes / 2) })" / -->
  <g class="hour" transform="rotate({ 30 * hours + minutes / 2 })" >
    <line y1=2 y2={-0.4*r} />
    <circle r=7 cy=-25></circle>
  </g>

  <!-- минутная стрелка -->
  <line class="minute" y1=4 y2={-0.6*r} transform="rotate({ 6 * minutes + seconds / 10 })" />

  <!-- секундная стрелка-->
  <g transform="rotate({ 6 * (seconds+milliseconds/1000) })">
    <line class="second" y1={0.2*r} y2={-0.76*r} />
    <line class="second-counterweight" y1={0.2*r}  y2=2 />
  </g>
    <text x={-0.2*r} y={0.5*r} class="digits">{ hours.toString().length === 1 ? '0'+hours.toString() : hours }</text>
    {#if !(seconds%2) }<text x=-1 y={0.5*r} class="digits tick">:</text>{/if}
    <text x=4 y={0.5*r} class="digits">{ minutes.toString().length === 1 ? '0'+minutes.toString() : minutes }</text>
</svg>


<script>
  ///import { onMount } from "svelte";

  let time = new Date();
  let r = 100;/// радиус циферблата 

  // эти переменные автоматически обновляются, каждый раз
  // когда изменяется `time`, блягодаря префиксу `$:`
  $: hours = time.getHours();
  $: minutes = time.getMinutes();
  $: seconds = time.getSeconds();
  $: milliseconds = time.getMilliseconds();
//~   $: classMinuteOn = Array(60).fill('').map((minute, idx) => {return idx == seconds ? 'major-second-on' : ''; });///console.log('$classMinuteOn', seconds)
  const ItemRadian = (item)=>(2*Math.PI/60)*item;/// перевод 60 позиций в радианы безотносительно начала отсчета
  
  setInterval(() => {
      time = new Date();
    }, 100);
  
//~   onMount(() => {
//~     const interval = 

//~     return () => {
//~       clearInterval(interval);
//~     };
//~   });
  
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
    fill: $clr2;
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
    stroke: $clr1;
    stroke-width: 5;
  }
  .hour circle {
    stroke-width: 2;
    fill: $bg;
  }

  .minute {
    stroke: $clr1;
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
    font-size: 1rem;
  }
  .tick {
    font-size:1rem;
  }
  .z-depth-3 {
    box-shadow: 0 6px 10px 0 rgba(0, 0, 0, 0.14), 0 1px 18px 0 rgba(0, 0, 0, 0.12), 0 3px 5px -1px rgba(0, 0, 0, 0.3);
  }
  .green.lighten-4 {
    background-color: $bg;
  }
  
  .second-on {
    background-color: grey;
  }

</style>

