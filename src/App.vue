<template>
  <div id="app">
    <div id="header" v-if="!iniframe">
        <img v-if="env.LOGO_LEFT && !smallscreen" id="logoleft" src="./assets/logo_left.png"/>
        <h1>{{env.TITLE}}</h1>
        <img v-if="env.LOGO_RIGHT && !smallscreen" id="logoright" src="./assets/logo_right.png"/>
    </div>
    <router-view/>
    <div id="footer" v-if="!iniframe">
        <strong>{{env.TITLE}}</strong> - powered by <a href="https://github.com/proycon/labirinto">Labirinto</a> v0.2.5 - <a :href="env.REGISTRY_URL">View raw metadata registry</a>
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
  },
  created () {
      document.title = process.env.TITLE;
  },
  computed: {
      smallscreen: function () {
          return window.innerWidth < 800;
      },
      iniframe: function () {
          try {
            return window.self !== window.top;
          } catch (e) {
            return true;
          }
      }
  }
}
</script>

<style>
@font-face {
    font-family: Lato;
    font-style: normal;
    font-weight: 400;
    src:
        local('./assets/Lato Regular'),
        local('./assets/Lato-Regular'),
        /* from https://fonts.gstatic.com/s/lato/v14/S6uyw4BMUTPHjx4wWg.eot */
        url('./assets/Lato_400.eot?#iefix') format('embedded-opentype'),
        /* from https://fonts.gstatic.com/s/lato/v14/S6uyw4BMUTPHjx4wWA.woff */
        url('./assets/Lato_400.woff') format('woff'),
        /* from https://fonts.gstatic.com/s/lato/v14/S6uyw4BMUTPHjx4wXg.woff2 */
        url('./assets/Lato_400.woff2') format('woff2'),
        /* from https://fonts.gstatic.com/l/font?kit=S6uyw4BMUTPHjx4wWQ&skey=2d58b92a99e1c086&v=v14#Lato */
        url('./assets/Lato_400.svg#Lato') format('svg'),
        /* from https://fonts.gstatic.com/s/lato/v14/S6uyw4BMUTPHjx4wWw.ttf */
        url('./assets/Lato_400.ttf') format('truetype');
}
@font-face {
    font-family: Lato;
    font-style: italic;
    font-weight: 400;
    src:
        local('./assets/Lato Italic'),
        local('./assets/Lato-Italic'),
        /* from https://fonts.gstatic.com/s/lato/v14/S6u8w4BMUTPHjxsAXC-u.eot */
        url('./assets/Lato_400i.eot?#iefix') format('embedded-opentype'),
        /* from https://fonts.gstatic.com/s/lato/v14/S6u8w4BMUTPHjxsAXC-s.woff */
        url('./assets/Lato_400i.woff') format('woff'),
        /* from https://fonts.gstatic.com/s/lato/v14/S6u8w4BMUTPHjxsAXC-q.woff2 */
        url('./assets/Lato_400i.woff2') format('woff2'),
        /* from https://fonts.gstatic.com/l/font?kit=S6u8w4BMUTPHjxsAXC-t&skey=51512958f8cff7a8&v=v14#Lato */
        url('./assets/Lato_400i.svg#Lato') format('svg'),
        /* from https://fonts.gstatic.com/s/lato/v14/S6u8w4BMUTPHjxsAXC-v.ttf */
        url('./assets/Lato_400i.ttf') format('truetype');
}
@font-face {
    font-family: Lato;
    font-style: normal;
    font-weight: 700;
    src:
        local('./assets/Lato Bold'),
        local('./assets/Lato-Bold'),
        /* from https://fonts.gstatic.com/s/lato/v14/S6u9w4BMUTPHh6UVSwiPHQ.eot */
        url('./assets/Lato_700.eot?#iefix') format('embedded-opentype'),
        /* from https://fonts.gstatic.com/s/lato/v14/S6u9w4BMUTPHh6UVSwiPHw.woff */
        url('./assets/Lato_700.woff') format('woff'),
        /* from https://fonts.gstatic.com/s/lato/v14/S6u9w4BMUTPHh6UVSwiPGQ.woff2 */
        url('./assets/Lato_700.woff2') format('woff2'),
        /* from https://fonts.gstatic.com/l/font?kit=S6u9w4BMUTPHh6UVSwiPHg&skey=3480a19627739c0d&v=v14#Lato */
        url('./assets/Lato_700.svg#Lato') format('svg'),
        /* from https://fonts.gstatic.com/s/lato/v14/S6u9w4BMUTPHh6UVSwiPHA.ttf */
        url('./assets/Lato_700.ttf') format('truetype');
}
@font-face {
    font-family: Raleway;
    font-style: normal;
    font-weight: 400;
    src:
        local('./assets/Raleway'),
        local('./assets/Raleway-Regular'),
        /* from https://fonts.gstatic.com/s/raleway/v12/1Ptug8zYS_SKggPNyC0ISw.eot */
        url('./assets/Raleway_400.eot?#iefix') format('embedded-opentype'),
        /* from https://fonts.gstatic.com/s/raleway/v12/1Ptug8zYS_SKggPNyC0ISQ.woff */
        url('./assets/Raleway_400.woff') format('woff'),
        /* from https://fonts.gstatic.com/s/raleway/v12/1Ptug8zYS_SKggPNyC0ITw.woff2 */
        url('./assets/Raleway_400.woff2') format('woff2'),
        /* from https://fonts.gstatic.com/l/font?kit=1Ptug8zYS_SKggPNyC0ISA&skey=30a27f2564731c64&v=v12#Raleway */
        url('./assets/Raleway_400.svg#Raleway') format('svg'),
        /* from https://fonts.gstatic.com/s/raleway/v12/1Ptug8zYS_SKggPNyC0ISg.ttf */
        url('./assets/Raleway_400.ttf') format('truetype');
}
@font-face {
    font-family: Raleway;
    font-style: italic;
    font-weight: 400;
    src:
        local('./assets/Raleway Italic'),
        local('./assets/Raleway-Italic'),
        /* from https://fonts.gstatic.com/s/raleway/v12/1Ptsg8zYS_SKggPNyCg4TYFu.eot */
        url('./assets/Raleway_400i.eot?#iefix') format('embedded-opentype'),
        /* from https://fonts.gstatic.com/s/raleway/v12/1Ptsg8zYS_SKggPNyCg4TYFs.woff */
        url('./assets/Raleway_400i.woff') format('woff'),
        /* from https://fonts.gstatic.com/s/raleway/v12/1Ptsg8zYS_SKggPNyCg4TYFq.woff2 */
        url('./assets/Raleway_400i.woff2') format('woff2'),
        /* from https://fonts.gstatic.com/l/font?kit=1Ptsg8zYS_SKggPNyCg4TYFt&skey=bf44ee29381a37b0&v=v12#Raleway */
        url('./assets/Raleway_400i.svg#Raleway') format('svg'),
        /* from https://fonts.gstatic.com/s/raleway/v12/1Ptsg8zYS_SKggPNyCg4TYFv.ttf */
        url('./assets/Raleway_400i.ttf') format('truetype');
}
@font-face {
    font-family: Raleway;
    font-style: normal;
    font-weight: 700;
    src:
        local('./assets/Raleway Bold'),
        local('./assets/Raleway-Bold'),
        /* from https://fonts.gstatic.com/s/raleway/v12/1Ptrg8zYS_SKggPNwJYtWqZPBA.eot */
        url('./assets/Raleway_700.eot?#iefix') format('embedded-opentype'),
        /* from https://fonts.gstatic.com/s/raleway/v12/1Ptrg8zYS_SKggPNwJYtWqZPBg.woff */
        url('./assets/Raleway_700.woff') format('woff'),
        /* from https://fonts.gstatic.com/s/raleway/v12/1Ptrg8zYS_SKggPNwJYtWqZPAA.woff2 */
        url('./assets/Raleway_700.woff2') format('woff2'),
        /* from https://fonts.gstatic.com/l/font?kit=1Ptrg8zYS_SKggPNwJYtWqZPBw&skey=e507c3e2b7915ad1&v=v12#Raleway */
        url('./assets/Raleway_700.svg#Raleway') format('svg'),
        /* from https://fonts.gstatic.com/s/raleway/v12/1Ptrg8zYS_SKggPNwJYtWqZPBQ.ttf */
        url('./assets/Raleway_700.ttf') format('truetype');
}
#logoleft {
    position: absolute;
    top: 0px;
    left: 0px;
    height: 183px;
}
#logoright {
    position: absolute;
    top: 1px;
    right: 1px;
    height: 50px;
}
#app {
  font-family: "Raleway" , sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
  color: #2c3e50;
  margin: 0 0;
  padding: 0 0;
}
a {
  color: #b82b2b;
}
body {
  background: #e1d8d1 url("./assets/diagonals.png") 0 0 repeat fixed;
  margin: 0 0;
  padding: 0 0;
}
#header {
    background-color: #b82b2b;
    width: 100%;
    max-width: 100%;
    min-height: 20px;
    border-bottom: 3px solid #ff9c00; /* #f45709;*/
    color: white;
}
#header h1,h2 {
    color: white;
}
#footer a {
    color: white;
    font-style: italic;
}
a:hover {
    color: #5c0f0f;
}
#footer {
    clear: both;
    color: white;
    bottom: 0px;
    background-color: #b82b2b;
    width: 100%;
    min-height: 20px;
    border-top: 3px solid #f45709;
    padding-top: 5px;
    font-family: monospace;
    font-size: 60%;
}
h1, h2 {
  font-family: Lato;
  font-weight: medium;
  color: #b82b2b;
}
h1 {
  font-family: Lato;
  margin: 0px;
  padding: 0px;
  font-weight: medium;
  color: #384d3a;
  padding-top: 10px;
  padding-bottom: 10px;
}

.tooltip {
  display: block !important;
  z-index: 10000;
  font-family: Lato;
  font-size: 10px;
  opacity: 85%;
}

.tooltip .tooltip-inner {
  background: black;
  color: white;
  border-radius: 16px;
  padding: 5px 10px 4px;
}

.tooltip .tooltip-arrow {
  width: 0;
  height: 0;
  border-style: solid;
  position: absolute;
  margin: 5px;
  border-color: black;
  z-index: 1;
}

.tooltip[x-placement^="top"] {
  margin-bottom: 5px;
}

.tooltip[x-placement^="top"] .tooltip-arrow {
  border-width: 5px 5px 0 5px;
  border-left-color: transparent !important;
  border-right-color: transparent !important;
  border-bottom-color: transparent !important;
  bottom: -5px;
  left: calc(50% - 5px);
  margin-top: 0;
  margin-bottom: 0;
}

.tooltip[x-placement^="bottom"] {
  margin-top: 5px;
}

.tooltip[x-placement^="bottom"] .tooltip-arrow {
  border-width: 0 5px 5px 5px;
  border-left-color: transparent !important;
  border-right-color: transparent !important;
  border-top-color: transparent !important;
  top: -5px;
  left: calc(50% - 5px);
  margin-top: 0;
  margin-bottom: 0;
}

.tooltip[x-placement^="right"] {
  margin-left: 5px;
}

.tooltip[x-placement^="right"] .tooltip-arrow {
  border-width: 5px 5px 5px 0;
  border-left-color: transparent !important;
  border-top-color: transparent !important;
  border-bottom-color: transparent !important;
  left: -5px;
  top: calc(50% - 5px);
  margin-left: 0;
  margin-right: 0;
}

.tooltip[x-placement^="left"] {
  margin-right: 5px;
}

.tooltip[x-placement^="left"] .tooltip-arrow {
  border-width: 5px 0 5px 5px;
  border-top-color: transparent !important;
  border-right-color: transparent !important;
  border-bottom-color: transparent !important;
  right: -5px;
  top: calc(50% - 5px);
  margin-left: 0;
  margin-right: 0;
}

.tooltip.popover .popover-inner {
  background: #f9f9f9;
  color: black;
  padding: 24px;
  border-radius: 5px;
  box-shadow: 0 5px 30px rgba(black, .1);
}

.tooltip.popover .popover-arrow {
  border-color: #f9f9f9;
}

.tooltip[aria-hidden='true'] {
  visibility: hidden;
  opacity: 0;
  transition: opacity .15s, visibility .15s;
}

.tooltip[aria-hidden='false'] {
  visibility: visible;
  opacity: 1;
  transition: opacity .15s;
}
</style>
