<template>
  <div id="app">
    <div id="header">
        <h1>{{env.TITLE}}</h1>
    </div>
    <router-view/>
    <div id="footer">
        <strong>{{env.TITLE}}</strong> - powered by <a href="https://github.com/proycon/labirinto">Labirinto</a> v{{env.VERSION}}
    </div>
  </div>
</template>

<script>
export default {
  name: 'App',
  data () {
      return {
          "env": process.env
      }
  }
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
#wallpaper {
    margin: 0;
    padding: 0;
    overflow: hidden;
}
#wallpaper:before {
  content: "";
  position: absolute;
  width: 400%;
  height: 400%;
  top: -200%;
  left: -200%;
  z-index: -1;
  background: url(./assets/maze.png) 0 0 repeat;
  -webkit-transform: rotate(45deg);
  transform: rotate(45deg);
  opacity: 0.5;
}

a {
  color: #384d3a;
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
    min-height: 20px;
    border-bottom: 3px solid #85a989;
}

#footer {
    position: fixed;
    bottom: 0px;
    background-color: #cbd7cc;
    width: 100%;
    min-height: 20px;
    border-top: 3px solid #85a989;
    padding-top: 5px;
    font-family: monospace;
    font-size: 60%;
}
h1 {
  margin: 0px;
  padding: 0px;
  font-weight: medium;
  color: #384d3a;
  padding-top: 10px;
  padding-bottom: 10px;
}
</style>
