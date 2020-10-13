<main>
  <div class="clock">
    <Clock />
    Это SVG-часы Свелт-компонент.
  </div>
  <h1><span class="svelt-color">{head.title}</span> доброго всем</h1>
  
  <p><a href="https://ru.svelte.dev/tutorial">Svelte учебник</a> - на официальном русскоязычном сайтеге.</p>
  <p><a href="https://t.me/sveltejs">Телеграм Свелт</a> - официальный русскоязычный канал.</p>
  

{ #each posts as p }
  <h2 class="center"><a  on:click={ Click(p) }  href="javascript:" class="gr-color">{ p.title }</a></h2>
  <p>{@html p.html }</p>
  <p class="code">{ p.code }</p>
{ /each }
  <!--FooComponent1 text="{head.title}"/-->
</main>



<script>
//~   import Vue from 'vue';
  ///import { debounce } from 'underscore/modules/index';
  import Clock from './components/Clock.svelte';
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
    posts = posts;///!!!!
//~ console.log('Click', посты);
  };
  
//~   $: head.title = name;
  ///$: document.title = name;
 
/// $: name2 = name.toUpperCase();
  ///Click();
  
</script>


<style>
  main {
    padding: 1em;
    /*margin: 0 auto;*/
  }

  h1 {
    /*text-transform: uppercase;*/
    font-size: 3em;
    font-weight: 100;
    margin:0;
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
    padding: 0.5rem;
    white-space: pre-wrap;
    text-align: left;
    background-color: black;
    color: wheat;
  }

</style>