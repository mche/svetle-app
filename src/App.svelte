<main>
  <div>Доброго всем</div>
  <h1><a  on:click={ Click }  href="javascript:" class="red-text">{name2}</a></h1>
  <!--div>{ JSON.stringify(head)}</div-->
  <div class="code">
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


  </div>
  <p><a href="https://ru.svelte.dev/tutorial">Svelte tutorial</a> to learn how to build Svelte apps.</p>
  <!--FooComponent1 text="{head.title}"/-->
</main>



<script>
//~   import Vue from 'vue';
  ///import { debounce } from 'underscore/modules/index';
  //import FooComponent1 from './components/FooComponent.svelte';
//~   console.log('FooComponent', FooComponent) ;
  export let name;
//~   export let head;


  const Click = (event) => {
    name = ' ¡ ' +name + ' ! ';
//~     console.log('name', name);
    ///head.title = name;
  };//, 1000, true);
  
//~   $: head.title = name;
  $: document.title = name;
  $: name2 = name.toUpperCase();
  Click();
  
</script>


<style>
  main {
    padding: 1em;
    margin: 0 auto;
  }

  h1 {
    /*text-transform: uppercase;*/
    font-size: 5em;
    font-weight: 100;
  }
  
  .red-text {
    color: #ff3e00;
  }
  
  .code {
    padding: 0.5rem;
    white-space: pre-wrap;
    text-align: left;
    background-color: black;
    color: wheat;
  }


  @media (min-width: 640px) {
    main {
      max-width: none;
    }
  }
</style>