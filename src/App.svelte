<main>
  <div class="clock">
    <Clock />
    Это SVG-часы Свелт-компонент.
  </div>
  <h1>
    <Me />
    <span class="svelt-color font-effect-3d-float">{head.title}</span>
    <span>доброго всем</span>
    
  </h1>
  
  <p><a href="https://ru.svelte.dev/tutorial">Svelte учебник</a> - на официальном русскоязычном сайтеге.</p>
  <p><a href="https://t.me/sveltejs">Телеграм Свелт</a> - официальный русскоязычный канал.</p>
  

{ #each posts as p }
  <h2 class="center-000"><a  on:click={ Click(p) }  href="javascript:" class="gr-color">{ p.title }</a></h2>
  <p>{@html p.html }</p>
  <code class="code">{ p.code }</code>
{ /each }
  <!--FooComponent1 text="{head.title}"/-->
</main>



<script>
//~   import Vue from 'vue';
  ///import { debounce } from 'underscore/modules/index';
  import Clock from './components/Clock.svelte';
  import Me from './components/Me.svelte';
  import посты from './посты.js';
//~   console.log('FooComponent', FooComponent) ;
  ///export let name;
  export let head;
  ///export let посты;
  
  $: posts = посты;


  const Click = (post) => {
    post.title = ' ¡ ' +post.title + ' ! ';
//~     
//~ посты.push({"title":'New'});
    posts = posts;///!!!! реактивность массива
//~ console.log('Click', посты);
  };
  
//~   $: head.title = name;
  ///$: document.title = name;
 
/// $: name2 = name.toUpperCase();
  ///Click();
  
</script>


<style lang="scss">
  main {
    padding: 1em;
    /*margin: 0 auto;*/
  }
  
  .font-effect-3d-float {
      text-shadow: 0 0.15em 0.11em rgba(0, 0, 0, 0.15), 0 0.25em 0.021em rgba(0, 0, 0, 0.1), 0 0.32em 0.32em rgba(0, 0, 0, 0.1);
  }

  h1 {
    /*text-transform: uppercase;*/
    font-size: 3em;
    font-weight: 100;
    margin:0;
  }
  h2 {
    font-weight: 500;
  }
  
  .svelt-color {
    color: #ff3e00;
  }
  .gr-color {
    color: #1B5E20;
  }
  .center {
    text-align: center;
  }
  
  .clock {
    width: 10rem;
    float: right;
  }
  
  .code {
    display:block;
    padding: 0 0.5rem;
    white-space: pre-wrap;
    text-align: left;
    background-color: black;
    color: wheat;
  }

</style>