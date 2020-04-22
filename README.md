# v-simple-magnifier

a vue directive to use on img elements to zoom on hover

most of the credit goes to [anthinkingcoder](https://github.com/anthinkingcoder/vue-image-magnifier), I made my directive based on that


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