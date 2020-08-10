<main>
  <div class="clock">
    <Clock />
    Это SVG-часы Свелт-компонент.
  </div>
  <h1>Доброго всем</h1>
  
  <p><a href="https://ru.svelte.dev/tutorial">Svelte учебник</a> - официальный русскоязычный сайтег.</p>
  <p><a href="https://t.me/sveltejs">Телеграм Свелт</a> - официальный русскоязычый канал.</p>
  
  <h3><a  on:click={ Click }  href="javascript:" class="red-text">{name2}</a></h3>
  <!--div>{ JSON.stringify(head)}</div-->
  <p>Создал Свелт-приложение из  <a href="https://github.com/sveltejs/template">шаблона</a> ... и пошло-поехало, все закрутилось ...</p>
  <p class="code">
$ cd /path/to/svelte-app
$ npm run dev
$ npm run build
$ surge /path/to/svelte-app/public mche.us.to

   Running as *******@********* (Student)

        project: /path/to/svelte-app/public
         domain: mche.us.to
         upload: [====================] 100% eta: 0.0s (227 files, 3275006 bytes)
            CDN: [====================] 100%

             IP: 138.197.235.123

   Success! - Published to mche.us.to


  </p>

  <!--FooComponent1 text="{head.title}"/-->
</main>



<script>
//~   import Vue from 'vue';
  ///import { debounce } from 'underscore/modules/index';
  import Clock from './components/Clock.svelte';
//~   console.log('FooComponent', FooComponent) ;
  export let name;
//~   export let head;


  const Click = (event) => {
    name = ' ¡ ' +name + ' ! ';
//~     console.log('name', name);
    ///head.title = name;
  };//, 1000, true);
  
//~   $: head.title = name;
  ///$: document.title = name;
  $: name2 = name.toUpperCase();
  Click();
  
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
  }
  
  .red-text {
    color: #ff3e00;
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