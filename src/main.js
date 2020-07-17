import App from './App.svelte';
import Head from './Head.svelte';

//~ import Vue from 'vue';


let props = {
  //~ Vue,
  name: 'Svelte app',
  "head": {
    "title": 'заголовок',
  },
};

new App({
  target: document.body,
  props,
});

new Head({
  target: document.head,///.body,
  props,
});

///export default app;