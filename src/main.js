import App from './App.svelte';
import Head from './Head.svelte';
//~ import Vue from 'vue';
///import посты from './посты.js';


let props = {
  "head": {
    "title": 'Михаил ★ mche.us.to',
  },
  ///посты,
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