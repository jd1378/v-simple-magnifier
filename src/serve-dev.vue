<script>
import Vue from 'vue';

export default Vue.extend({
  name: 'ServeDev',
});
</script>

<template>
  <div id="app">
    <img
      v-simple-magnifier
      src="https://www.google.com/images/branding/googlelogo/2x/googlelogo_color_272x92dp.png"
    />
  </div>
</template>

<style>
html,
body {
  width: 100%;
  height: 100%;
  display: flex;
  box-sizing: border-box;
  padding: 0;
  margin: 0;
}

.box {
  width: 300px;
  height: 300px;
  background-color: rgb(24, 104, 207);
}

#app {
  width: 100%;
  height: 100%;
  display: flex;
  justify-content: center;
  align-items: center;
  flex-direction: row;
}
</style>
