export default 
[
  {"title": 'All glory to... Gloria',
    "html":'Создал Свелт-приложение из  <a href="https://github.com/sveltejs/template">шаблона</a> ... и пошло-поехало, и все закрутилось ...',
    "code": `
$ cd /path/to/svelte-app
$ npm run dev
$ npm run build
$ surge public mche.us.to

   Running as *******@********* (Student)

        project: public
         domain: mche.us.to
         upload: [====================] 100% eta: 0.0s (227 files, 3275006 bytes)
            CDN: [====================] 100%

             IP: 138.197.235.123

   Success! - Published to mche.us.to

`,},
    /*
    **
    **
    */
  {"title":'Vue кириллические пропсы',
    "html":'Крутяк, но не проверил на сборщиках parcel, rollup',
    "code":`
// HTML
    <v-foo :пропс1=" ... " ></v-foo>
    
// JS компонент Foo
    const props = {
      "пропс1": ...,
      ...
    };
    
`},
];