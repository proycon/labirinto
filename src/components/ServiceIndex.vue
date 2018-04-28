<template>
  <container width="100%">
    <div id="toolbar">
        <enhanced-check-group v-model="enabled_interfaces" :label="interface_labels" :value="interfaces" inline rounded></enhanced-check-group>
    </div>
    <grid v-if="registry_loaded" horizontal="center" vertical="middle" wrap="wrap">
      <grid-item size="1/3" v-for="tool in showtools" :key="tool.identifier" class="tool">
          <h2>{{tool.name}} <span class="version">{{tool.version}}</span></h2>
          <ul class="authors">
              <li v-for="author in tool.author" :key="author.familyName">{{author.givenName}} {{author.familyName}}</li>
          </ul>
          <div class="description">{{tool.description}}</div>
          <ul class="properties">
              <li v-if="tool.url"><icon name="home"></icon>&nbsp;<a :href="tool.url">Website</a></li>
              <li v-if="tool.codeRepository"><icon name="code"></icon>&nbsp;<a :href="tool.codeRepository">Source code</a></li>
              <li v-if="tool.issueTracker"><icon name="bug"></icon>&nbsp;<a :href="tool.issueTracker">Issue Tracker</a></li>
              <li v-if="tool.license" class="license"><icon name="copyright" flip="horizontal" :label="tool.license"></icon>&nbsp;<span>{{tool.license}}</span></li>
              <template v-if="tool.programmingLanguage">
                  <li v-if="matchProgLangs(tool,'python')" class="proglang"><icon name="python"></icon>&nbsp; <span>Python</span></li>
                  <li v-if="matchProgLangs(tool,'cython')" class="proglang"><icon name="python"></icon>&nbsp; <span>Cython</span></li>
                  <li v-if="matchProgLangs(tool,'javascript')" class="proglang"><icon name="js"></icon>&nbsp; <span>Javascript</span></li>
                  <li v-if="matchProgLangs(tool,'java')" class="proglang"><icon name="java"></icon>&nbsp; <span>Java</span></li>
                  <li v-if="matchProgLangs(tool,'c++')" class="proglang"><icon name="closed-captioning"></icon>&nbsp; <span>C++</span></li>
                  <li v-else-if="matchProgLangs(tool,'cpp')" class="proglang"><icon name="closed-captioning"></icon>&nbsp; <span>C++</span></li>
                  <li v-if="matchProgLangs(tool,'php')" class="proglang"><icon name="php"></icon>&nbsp; <span>PHP</span></li>
                  <li v-if="matchProgLangs(tool,'bash')" class="proglang"><icon name="terminal"></icon>&nbsp; <span>Shell</span></li>
                  <li v-else-if="matchProgLangs(tool,'shell')" class="proglang"><icon name="terminal"></icon>&nbsp; <span>Shell</span></li>
                  <li v-if="matchProgLangs(tool,'erlang')" class="proglang"><icon name="erlang"></icon>&nbsp; <span>Erlang</span></li>
                  <li v-if="matchProgLangs(tool,'r')" class="proglang"><icon name="register"></icon>&nbsp; <span>R</span></li>
                  <li v-if="matchProgLangs(tool,'perl')" class="proglang"><icon name="product-hunt"></icon>&nbsp; <span>Perl</span></li>
                  <li v-if="matchProgLangs(tool,'go')" class="proglang"><icon name="google"></icon>&nbsp; <span>Go</span></li>
                  <li v-if="matchProgLangs(tool,'lua')" class="proglang"><icon name="moon"></icon>&nbsp; <span>Lua</span></li>
              </template>
          </ul>
          <ul class="entrypoints">
              <li v-for="entrypoint in tool.entryPoints" v-if="matchEntrypoint(entrypoint)"  :key="entrypoint.urlTemplate" :class="entrypoint.interfaceType == 'WUI' ? 'actionable' : 'inactionable'">
                <icon v-if="entrypoint.interfaceType == 'WUI'" name="sign-in-alt"></icon>
                <icon v-else-if="entrypoint.interfaceType == 'REST'" name="cog"></icon>
                <icon v-else-if="entrypoint.interfaceType == 'CLI'" name="terminal"></icon>
                <tt v-if="entrypoint.name">{{entrypoint.name}}</tt>
                <a v-if="entrypoint.interfaceType == 'WUI'" :href="entrypoint.urlTemplate">Open {{tool.name}} in browser<span class="url">{{entrypoint.urlTemplate}}</span></a>
                <a v-if="entrypoint.interfaceType == 'REST'" :href="entrypoint.urlTemplate">Webservice <span class="url">{{entrypoint.urlTemplate}}</span></a>
                <span v-if="entrypoint.description" class="description">{{entrypoint.description}}</span>
              </li>
          </ul>
      </grid-item>
    </grid>
  </container>
</template>

<script>
import axios from 'axios'
import Vue from 'vue'
import Container from 'vue-fraction-grid/components/Container'
import Grid from 'vue-fraction-grid/components/Grid'
import GridItem from 'vue-fraction-grid/components/GridItem'
import { EnhancedCheckGroup } from 'vue-enhanced-check'
import 'vue-awesome/icons'
import Icon from 'vue-awesome/components/Icon'

const config = {
  container: '90%',
  gutter: '24px',
  approach: 'desktop-first',
  breakpoints: {
    compact: '320px 414px'
  }
}

export default {
  name: 'ServiceIndex',
  components: {
    Container: Vue.extend({ extends: Container, config }),
    Grid: Vue.extend({ extends: Grid, config }),
    GridItem: Vue.extend({ extends: GridItem, config }),
    EnhancedCheckGroup,
    Icon
  },
  data () {
    return {
      interface_labels: [ "Web Applications", "Webservices", "Command line tools", "Programming Libraries" ],
      interfaces: [ "WUI", "REST", "CLI", "LIB" ],
      enabled_interfaces: [ "WUI", "REST" ],
      registry: {},
      registry_url: "http://mhysa.anaproy.nl:8080/metadata.json",
      registry_loaded: false
    }
  },
  created () {
      axios.get(this.registry_url).then(response => {
          //add software
          response.data['@graph'].forEach(tool => {
              this.registry[tool.identifier] = tool
          });
          this.registry_loaded = true;
          this.$forceUpdate();
      })
  },
  computed: {
      showtools: function () {
          return Object.keys(this.registry).sort().map(identifier => this.registry[identifier]).filter(this.matchTool, this.enabled_interfaces);
      }
  },
  methods: {
      matchTool: function (tool) {
          if (tool.interfaceType) {
              if (this.enabled_interfaces.includes(tool.interfaceType)) {
                  return true;
              }
          }
          if (tool.entryPoints !== undefined) {
              var found = false;
              tool.entryPoints.forEach(entrypoint => {
                  if (this.matchEntrypoint(entrypoint)) {
                      found = true;
                  }
              });
              if (found) return true;
          }
          return false
      },
      matchEntrypoint: function (entrypoint) {
          if (entrypoint.interfaceType) {
              if (this.enabled_interfaces.includes(entrypoint.interfaceType)) {
                  return true
              }
          }
          return false
      },
      matchProgLangs: function (tool, lang) {
          if ((tool.programmingLanguage) && (tool.programmingLanguage !== null)) {
              var pattern = " ";
              if (tool.programmingLanguage.constructor === Object) {
                  pattern += tool.programmingLanguage.name
              } else if (tool.programmingLanguage.constructor === Array) {
                  pattern += tool.programmingLanguage.join(" ")
              } else if (tool.programmingLanguage.constructor === String) {
                  pattern += tool.programmingLanguage
              }
              pattern += " ";
              return pattern.toLowerCase().includes(' ' + lang + ' ');
          }
          return false;
      }
  }
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
h1, h2 {
  font-weight: normal;
}
ul {
  list-style-type: none;
  padding: 0;
}
li {
  display: inline-block;
  margin: 0 10px;
}
a {
  color: #42b983;
}
div#toolbar {
    width: 100%;
    text-align: center;
}
div.tool {
    border: 1px solid #444;
    border-radius: 20px;
    margin: 10px;
    margin-bottom: 20px;
    padding: 10px;
    font-size: 80%;
}
div.tool:hover {
    background: #eee;
}
div.tool .authors li {
  font-style: italic;
}
div.tool span.version {
    font-weight: normal;
    font-size: 60%;
    font-style: italic;
}
div.tool .license span, div.tool .proglang span {
    font-size: 65%;
}
ul.entrypoints li {
    display: block;
    background: #ddd;
    padding: 2px;
    border-radius: 5px;
    margin-bottom: 2px;
}
ul.entrypoints li.actionable {
    background: #a8cba9;
}
ul.entrypoints li a {
    color: #30503a;
    font-weight: bold;
    text-decoration: none;
}
ul.entrypoints li.actionable:hover {
    background: #cbcba8;
}
ul.entrypoints li.actionable:hover a {
    color: black;
}
ul.entrypoints span.url {
    display: block;
    font-weight: normal;
    font-size: 60%;
    font-family: monospace;
    font-style: italic;
}
ul.entrypoints span.description {
    display: block;
    font-style: italic;
}
</style>
