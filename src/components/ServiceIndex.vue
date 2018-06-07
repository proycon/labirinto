<template>
 <div id="container">
  <div id="toolbar" :class="{ 'fixedtoolbar': isScrolled }" v-if="showtoolbar" >
      <enhanced-check-group v-model="enabled_interfaces" :label="interface_labels" :value="interfaces" inline rounded combine></enhanced-check-group>
      <div id="collapser">
          <enhanced-check v-model="collapsed" label="Collapse?"></enhanced-check>
      </div>
      <div id="filters" v-if="env.ORGANIZATIONS || env.DOMAINS">
          <enhanced-check-group v-model="enabled_filters" :label="filter_labels" :value="filters" inline rounded combine></enhanced-check-group>
      </div>
  </div>
  <div id="details" v-if="showdetails">
      <button @click="showdetails=false">close window</button><br />
      <div class="scrollable">
          <vue-json-pretty v-if="details_type === 'json'" :data="details_json" :deep="metadata_depth"></vue-json-pretty>
          <vue-markdown v-if="details_type === 'markdown'" :source="details_markdown"></vue-markdown>
      </div>
  </div>
  <div v-html="env.DESCRIPTION" v-if="showdescription" class="description"></div>
  <div v-if="error" class="error">{{error}}</div>
  <div id="tools" v-if="registry_loaded">
      <tool v-for="tool in tools" :key="tool.identifier" :tool="tool" :interfaces="enabled_interfaces" :filters="enabled_filters" :selectedtool="selectedtool" :collapsed="collapsed" v-on:show-metadata="showMetadata" />
  </div>
 </div>
</template>

<script>
import axios from 'axios'
import { EnhancedCheck, EnhancedCheckGroup } from 'vue-enhanced-check'
import 'vue-awesome/icons'
import Icon from 'vue-awesome/components/Icon'
import VueMarkdown from 'vue-markdown'
import VueJsonPretty from 'vue-json-pretty'
import Tool from '@/components/Tool'

export default {
  name: 'ServiceIndex',
  props: {
      showtoolbar: { type: Boolean, default: true },
      showdescription: { type: Boolean, default: true },
      initial_filters: { type: Array, default: function () { return [ "thirdparty", "remote" ] } },
      initial_interfaces: { type: Array, default: function () { return [ "WUI", "REST" ] } },
      collapsed: { type: Boolean, default: false },
      hideheader: { type: Boolean, default: false },
      hidefooter: { type: Boolean, default: false }
  },
  components: {
    Tool,
    EnhancedCheck,
    EnhancedCheckGroup,
    Icon,
    'vue-markdown': VueMarkdown,
    VueJsonPretty
  },
  data () {
    return {
      env: process.env,
      interface_labels: [ "Web Applications", "Web Services", "Command line tools", "Programming Libraries", "Any" ],
      interfaces: [ "WUI", "REST", "CLI", "LIB", "UNKNOWN" ],
      filter_labels: [ "Third party tools", "Remote Services" ],
      filters: [ "thirdparty", "remote" ],
      enabled_interfaces: this.initial_interfaces,
      enabled_filters: this.initial_filters,
      registry: {},
      idmap: {},
      registry_loaded: false,
      isScrolled: false,
      showdetails: false,
      metadata_depth: 2,
      selectedtool: "",
      details_markdown: "",
      details_json: {},
      details_type: "json",
      error: "",
      enable_readmore: false
    }
  },
  created () {
      var config = {};
      if (this.env.REGISTRY_URL[0] === '/') {
          //registry URL is relative, set baseURL to current server
          config.baseURL = window.location.origin;
      }
      axios.get(this.env.REGISTRY_URL, config).then(response => {
          //process registry response, add each tool
          response.data['@graph'].forEach(tool => {
              console.log("Registered tool " + tool.identifier);
              this.resolve(tool);
              this.registry[tool.identifier] = tool
          });
          this.registry_loaded = true;
          this.$forceUpdate();
      }).catch(error => {
          if (this.env.REGISTRY_URL[0] === '/') {
              this.error = "Unable to obtain metadata registry from " + window.location.origin + this.env.REGISTRY_URL + " :" + error;
          } else {
              this.error = "Unable to obtain metadata registry from " + this.env.REGISTRY_URL + " :" + error;
          }
          console.log(error);
      });
      if (window.innerHeight > 500) {
          window.addEventListener('scroll', this.handleScroll);
      }
      //console.log("My organizations:", this.env.ORGANIZATIONS);
      //console.log("My domains:", this.env.DOMAINS);
  },
  computed: {
      tools: function () {
          return Object.keys(this.registry).sort().map(identifier => this.registry[identifier]);
      },
      smallscreen: function () {
          return window.innerWidth < 800 || window.innerHeight < 600;
      }
  },
  methods: {
      handleScroll: function () {
          var current = this.isScrolled;
          this.isScrolled = (window.scrollY > 50);
          if (current !== this.isScrolled) {
              this.$forceUpdate();
          }
      },
      uncollapse: function (tool) {
         this.selectedtool = tool.identifier;
      },
      showMetadata: function (tool) {
          this.details_json = tool;
          this.details_type = "json";
          this.showdetails = true;
          console.log(tool);
      },
      showReadMe: function (tool) {
          var url;
          if ((tool.readme.includes('github.com')) && (!tool.readme.includes('raw')) && (tool.readme.includes('blob'))) {
              //url is not raw yet
              url = tool.readme.replace('blob/', 'raw/');
          } else {
              url = tool.readme;
          }
          axios.get(url).then(response => {
              //add software
              this.details_type = "markdown";
              this.details_markdown = response;
              this.showdetails = true;
          });
      },
      resolve: function (data) {
          //resolves IDs
          for (var key in data) {
              if (data.hasOwnProperty(key)) {
                  if (data[key].constructor === Object) {
                      if (data[key]['@id'] !== undefined) {
                          var nrofkeys = Object.keys(data[key]).length;
                          if (nrofkeys > 1) {
                            //this is not a reference, register in idmap (possibly overwriting earlier definition!)
                            this.idmap[data[key]['@id']] = data[key];
                          } else if (nrofkeys === 1) {
                            //this is a a reference
                            if (this.idmap[data[key]['@id']] !== undefined) {
                                data[key] = this.idmap[data[key]['@id']];
                            } else {
                                console.log("Unable to resolve @id " + data[key]['@id']);
                            }
                         }
                      }
                      this.resolve(data[key])
                  } else if (data[key].constructor === Array) {
                      var newvalue = [];
                      for (var i = 0; i < data[key].length; i++) {
                            newvalue.push(this.resolve(data[key][i]));
                      }
                      data[key] = newvalue;
                  }
              }
          }
          return data;
      }
  }
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
ul {
  list-style-type: none;
  padding: 0;
}
li {
  display: inline-block;
  margin: 0 10px;
}
div#toolbar {
    width: 100%;
    text-align: center;
    margin: 0px;
    opacity: 0.8;
}
.fixedtoolbar {
    position: fixed;
    top: 0;
}
div.tool {
    float: left;
    width: 30%;
    background: #ffffff;
    border: 1px solid #ff9c00;
    border-radius: 20px;
    margin: 10px;
    margin-bottom: 20px;
    padding: 10px;
    font-size: 80%;
    min-width: 320px;
    max-width: 580px;
}
div.tool:hover {
    background: #f4ebdd;
}
#toolbar  {
    width: 100%;
    background: white;
    padding-top: 5px;
    padding-bottom: 5px;
    font-size: 80%;
}
#container {
    width: 100%;
    margin: 0 0;
    padding: 0;
    padding-bottom: 20px;
    min-height: 1200px;
}
div#container>div.description {
    padding: 10px;
    background: #fff;
    margin-left: auto;
    margin-right: auto;
    margin-top: 10px;
    margin-bottom: 10px;
    width: 50%;
    border-radius: 25px;
    color: #384d3a;
    box-shadow: 3px 3px #000000a0;
    font-size: 13px;
}
#services {
    width: 100%;
    margin: 0 0;
    padding: 0;
}
#collapser {
    margin-top: -5px;
    padding-right: 5px;
    float: right;
}
#filters {
    font-size: 80%;
    margin-top: 5px;
}
.tool h2 {
    cursor: pointer;
}
#details {
    border: 1px solid #85a989;
    border-radius: 20px;
    margin: 10px;
    margin-bottom: 20px;
    padding: 10px;
    font-size: 80%;
    background: white;
    position: fixed;
    left: 20%;
    top: 20px;
    width: 60%;
    height: 90%;
    text-align: left;
}
button {
    background: #ddd;
    border: 1px solid #85a989;
    font-weight: bold;
    cursor: pointer;
}
#details button {
    float: right;
}
#details .scrollable {
    overflow: scroll;
    width: 100%;
    height: 95%;
}
.error {
    background: #431d1d;
    color: white;
    font-weight: bold;
    padding: 20px;
    border: red solid 1px;
    border-radius: 25px;
    width: 75%;
    margin-left: auto;
    margin-right: auto;
}
</style>
