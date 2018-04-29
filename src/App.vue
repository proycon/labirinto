<template>
  <div id="app">
    <div id="header">
    </div>
    <router-view/>
  </div>
</template>

<script>
export default {
  name: 'App'
}
</script>

<style>
#app {
  font-family: 'Avenir', Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
  color: #2c3e50;
  margin: 0 0;
  padding: 0 0;
}
body {
  background: #ededed; /*url(./assets/back.png);*/
  margin: 0 0;
  padding: 0 0;
}

#header {
    background-color: #cbd7cc;
    width: 100%;
    max-width: 100%;
    height: 20px;
    border-bottom: 3px solid #85a989;
}
</style>
