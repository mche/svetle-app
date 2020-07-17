<main>
  <h1 on:click={handleClick}>{name}!</h1>
  <div>{ JSON.stringify(head)}</div>
  <!--p>Visit the <a href="https://svelte.dev/tutorial">Svelte tutorial</a> to learn how to build Svelte apps.</p-->
  <FooComponent1 text="{head.title}"/>
</main>



<script>
//~   import Vue from 'vue';
  import FooComponent1 from './components/FooComponent.svelte';
//~   console.log('FooComponent', FooComponent) ;
  export let name;
  export let head;
  
  function handleClick(event) {
    name += ' Х';
    head.title = name;
  }
//~   $: head.title = name;
  $: document.title = name;
//~   setTimeout(()=>{  }, 1000);
  
//~   console.log(new Vue());
  
</script>


<style>
  main {
    text-align: center;
    padding: 1em;
    max-width: 240px;
    margin: 0 auto;
  }

  h1 {
    color: #ff3e00;
    /*text-transform: uppercase;*/
    font-size: 5em;
    font-weight: 100;
  }

  @media (min-width: 640px) {
    main {
      max-width: none;
    }
  }
</style>