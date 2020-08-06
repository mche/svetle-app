import App from './App.svelte';
import Head from './Head.svelte';
//~ import Vue from 'vue';


let props = {
  //~ Vue,
  name: 'All Glory to Gloria',
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