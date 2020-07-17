<p on:click={handleClick}>
  FooComponent prop text:
  <span class="green-text">{text}</span>
</p>
<div bind:this={el1}> EL2: { el2 && el2.parentElement.innerHTML }</div>
<div bind:this={el2}> EL1: { el1 && el1.innerHTML }</div>

<script>
//~   export let foo;
  export let text;
  let el1, el2;
  
  $: el1 = el2;
  
  function handleClick(event){
//~     console.log(el2.parentElement);
    el2.innerHTML = text;
  }
  
  
  
</script>

<style>
.green-text {color: green;}
</style>