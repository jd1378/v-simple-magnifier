# v-simple-magnifier

a vue directive to use on img elements to zoom on hover

most of the credit goes to [anthinkingcoder](https://github.com/anthinkingcoder/vue-image-magnifier), I made my directive based on that

[![directive in action](https://thumbs.gfycat.com/HorribleLeanHoopoe-size_restricted.gif)](https://gfycat.com/HorribleLeanHoopoe)

[![Edit v-simple-magnifier](https://codesandbox.io/static/img/play-codesandbox.svg)](https://codesandbox.io/s/v-simple-magnifier-mm3j2?fontsize=14&hidenavigation=1&theme=dark)

## usage

```bash
npm install v-simple-magnifier
# or 
yarn add v-simple-magnifier
```

then add it to your vue application:

```js
// add it to your vue application:
import VSimpleMagnifier from 'v-simple-magnifier';
import Vue from 'vue';

Vue.use(VSimpleMagnifier);
```

then use it: 

```html
<template>
  <img src="some-image-src" v-simple-magnifier>
</template>
```