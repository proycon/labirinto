<template>
  <div id="container">
  <div id="toolbar">
      <enhanced-check-group v-model="enabled_interfaces" :label="interface_labels" :value="interfaces" inline rounded combine></enhanced-check-group>
  </div>
  <container width="100%">
    <grid v-if="registry_loaded" horizontal="center" vertical="middle" wrap="wrap">
      <grid-item size="1/4" v-for="tool in showtools" :key="tool.identifier" class="tool">
          <h2>{{tool.name}} <span class="version">{{tool.version}}</span></h2>
          <ul v-if="tool.author" class="authors">
              <li v-for="(author, authorindex) in getAuthors(tool)" :key="author">{{author}}<span v-if="authorindex < getAuthors(tool).length - 1">,&nbsp;</span></li>
          </ul>
          <ul class="affiliations">
              <template v-if="tool.producer">
                  <li v-for="organization in getOrganizations(tool, 'producer')" :key="organization">{{organization}}</li>
              </template>
              <template v-if="tool.publisher">
                  <li v-for="organization in getOrganizations(tool, 'publisher')" :key="organization">{{organization}}</li>
              </template>
              <template v-if="tool.funder">
                  <li v-for="organization in getOrganizations(tool, 'funder')" :key="organization">{{organization}}</li>
              </template>
          </ul>
          <div class="description">{{tool.description}}</div>
          <ul class="properties">
              <li v-if="tool.url" hint="Project website"><icon name="home"></icon>&nbsp;<a :href="tool.url">Website</a></li>
              <li v-if="tool.codeRepository" hint="Source code repository"><icon name="code"></icon>&nbsp;<a :href="tool.codeRepository">Source code</a></li>
              <li v-if="tool.issueTracker" hint="Issue Tracker"><icon name="bug"></icon>&nbsp;<a :href="tool.issueTracker">Issue Tracker</a></li>
              <li v-if="tool.license" class="license" hint="License"><icon name="copyright" flip="horizontal" :label="tool.license"></icon>&nbsp;<span>{{getLicense(tool)}}</span></li>
              <li v-if="tool.audience" class="audience" hint="Intended Audience"><icon name="users" :label="tool.audience"></icon>&nbsp;<span>{{getAudience(tool)}}</span></li>
              <template v-if="tool.programmingLanguage">
                  <li v-if="matchProgLangs(tool,'python')" class="proglang"><icon name="brands/python"></icon>&nbsp; <span>Python</span></li>
                  <li v-if="matchProgLangs(tool,'cython')" class="proglang"><icon name="brands/python"></icon>&nbsp; <span>Cython</span></li>
                  <li v-if="matchProgLangs(tool,'javascript')" class="proglang"><icon name="brands/js"></icon>&nbsp; <span>Javascript</span></li>
                  <li v-if="matchProgLangs(tool,'java')" class="proglang"><icon name="brands/java"></icon>&nbsp; <span>Java</span></li>
                  <li v-if="matchProgLangs(tool,'c++')" class="proglang"><icon name="closed-captioning"></icon>&nbsp; <span>C++</span></li>
                  <li v-else-if="matchProgLangs(tool,'cpp')" class="proglang"><icon name="closed-captioning"></icon>&nbsp; <span>C++</span></li>
                  <li v-if="matchProgLangs(tool,'php')" class="proglang"><icon name="brands/php"></icon>&nbsp; <span>PHP</span></li>
                  <li v-if="matchProgLangs(tool,'bash')" class="proglang"><icon name="terminal"></icon>&nbsp; <span>Shell</span></li>
                  <li v-else-if="matchProgLangs(tool,'shell')" class="proglang"><icon name="terminal"></icon>&nbsp; <span>Shell</span></li>
                  <li v-if="matchProgLangs(tool,'erlang')" class="proglang"><icon name="brands/erlang"></icon>&nbsp; <span>Erlang</span></li>
                  <li v-if="matchProgLangs(tool,'r')" class="proglang"><icon name="register"></icon>&nbsp; <span>R</span></li>
                  <li v-if="matchProgLangs(tool,'perl')" class="proglang"><icon name="brands/product-hunt"></icon>&nbsp; <span>Perl</span></li>
                  <li v-if="matchProgLangs(tool,'go')" class="proglang"><icon name="brands/google"></icon>&nbsp; <span>Go</span></li>
                  <li v-if="matchProgLangs(tool,'lua')" class="proglang"><icon name="moon"></icon>&nbsp; <span>Lua</span></li>
              </template>
          </ul>
          <ul v-if="tool.keywords" class="keywords">
              <li v-for="keyword in tool.keywords" :key="keyword">{{keyword}}</li>
          </ul>
          <ul class="entrypoints">
              <li v-for="entrypoint in tool.entryPoints" v-if="matchEntrypoint(entrypoint)"  :key="entrypoint.urlTemplate" :class="entrypoint.interfaceType == 'WUI' ? 'actionable' : 'inactionable'">
                <icon v-if="entrypoint.interfaceType == 'WUI'" name="sign-in-alt"></icon>
                <icon v-else-if="entrypoint.interfaceType == 'REST'" name="cog"></icon>
                <icon v-else-if="entrypoint.interfaceType == 'CLI'" name="terminal"></icon>
                <tt v-if="entrypoint.name">{{entrypoint.name}}</tt>
                <a v-if="entrypoint.interfaceType == 'WUI'" :href="entrypoint.urlTemplate">Open {{tool.name}} in browser<span class="url">{{entrypoint.urlTemplate}}</span></a>
                <a v-if="entrypoint.interfaceType == 'REST'" :href="entrypoint.urlTemplate">Webservice <span class="url">{{entrypoint.urlTemplate}}</span></a>
                <template v-if="entrypoint.interfaceType == 'REST' && entrypoint.specification">
                    <icon name="book"></icon> <a :href="entrypoint.specification">Webservice specification</a>
                </template>
                <span v-if="entrypoint.description" class="description">{{entrypoint.description}}</span>
              </li>
          </ul>
      </grid-item>
    </grid>
  </container>
  </div>
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
      interface_labels: [ "Web Applications", "Web Services", "Command line tools", "Programming Libraries", "Unspecified" ],
      interfaces: [ "WUI", "REST", "CLI", "LIB", "UNKNOWN" ],
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
              if (tool.entryPoints.length === 0) {
                  return this.enabled_interfaces.includes("UNKNOWN");
              }
          } else {
              return this.enabled_interfaces.includes("UNKNOWN");
          }
          return false;
      },
      matchEntrypoint: function (entrypoint) {
          if (entrypoint.interfaceType) {
              if (this.enabled_interfaces.includes(entrypoint.interfaceType)) {
                  return true
              }
          }
          return false;
      },
      getPropertyValues: function (obj, property, propcallback, valuecallback) {
          if (valuecallback === undefined) {
              valuecallback = function (x) { return x; }
          }
          var values = [];
          if ((obj !== undefined) && (obj !== null) && (obj.hasOwnProperty(property))) {
              if (obj[property].constructor === Object) {
                  values.push(valuecallback(propcallback(obj[property])));
              } else if (obj[property].constructor === Array) {
                  obj[property].forEach(function (item) {
                      if ((item !== undefined) && (item !== null)) {
                          if (item.constructor === Object) {
                              values.push(valuecallback(propcallback(item)));
                          } else {
                              values.push(valuecallback(item));
                          }
                      }
                  });
              } else {
                  //String or number
                  values.push(valuecallback(obj[property]))
              }
          }
          return values
      },
      getPropertyValue: function (obj, property, propcallback, valuecallback) {
          //get all values as one string
          var values = this.getPropertyValues(obj, property, propcallback, valuecallback);
          return values.join("; ");
      },
      getAuthors: function (tool) {
          return this.getPropertyValues(tool, 'author', function (author) {
             if ((author.givenName) && (author.familyName)) {
                 return author.givenName + " " + author.familyName;
             } else if (author.name) {
                 return author.name;
             } else {
                 return "";
             }
          });
      },
      getLicense: function (tool) {
          return this.getPropertyValue(tool, 'license', function (license) {
             return license.name;
          }, function (license) {
             license = license.replace("OSI Approved :: ", "")
             license = license.replace("https://spdx.org/licenses/", "")
             return license;
          });
      },
      getAudience: function (tool) {
          return this.getPropertyValue(tool, 'audience', function (audience) {
             //schema:Audience
             return audience.audienceType;
          })
      },
      getOrganizations: function (tool, property) {
          return this.getPropertyValues(tool, property, function (org) {
              var labels = []
              var locationparsed = false;
              var first = true;
              do {
                  if (!first) {
                      org = org.parentOrganization;
                  } else {
                      first = false;
                  }
                  labels.push(org.name);
                  if ((org.location) && (!locationparsed)) {
                      labels.push(org.location.name);
                      locationparsed = true;
                  }
              } while (org.parentOrganization !== undefined);
              return labels.join(", ")
          })
      },
      matchProgLangs: function (tool, lang) {
          return this.getPropertyValues(tool, 'programmingLanguage', function (proglang) {
              return proglang.name;
          }).some(function (proglang) {
              var pattern = " " + proglang.toLowerCase() + " ";
              return pattern.toLowerCase().includes(' ' + lang + ' ');
          });
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
div.tool {
    background: #ffffff;
    border: 1px solid #85a989;
    border-radius: 20px;
    margin: 10px;
    margin-bottom: 20px;
    padding: 10px;
    font-size: 80%;
}
div.tool:hover {
    background: #e9f3eb;
}
div.tool .authors li {
  font-style: italic;
}
div.tool span.version {
    font-weight: normal;
    font-size: 60%;
    font-style: italic;
}
div.tool .license span, div.tool .proglang span, div.tool .audience span {
    font-size: 65%;
}
div.tool ul.keywords li {
    font-size: 65%;
    color: #8350a7;
}
ul.entrypoints li {
    display: block;
    background: #ddd;
    padding: 2px;
    border-radius: 5px;
    margin-bottom: 2px;
}
ul.entrypoints li.actionable {
    background: #85a989;
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
ul.affiliations li {
    display: block;
    color: #85a989;
    font-size: 80%;
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
    padding: 0 0;
}
</style>
