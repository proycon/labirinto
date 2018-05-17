<template>
  <div id="container">
  <div id="toolbar" :class="{ 'fixedtoolbar': isScrolled }">
      <enhanced-check-group v-model="enabled_interfaces" :label="interface_labels" :value="interfaces" inline rounded combine></enhanced-check-group>
      <div id="collapser">
          <enhanced-check v-model="collapsed" label="Collapse?"></enhanced-check>
      </div>
      <div id="filters" v-if="env.ORGANIZATIONS || env.DOMAINS">
          <enhanced-check-group v-model="enabled_filters" :label="filter_labels" :value="filters" inline rounded combine></enhanced-check-group>
      </div>
  </div>
  <div v-html="env.DESCRIPTION" class="description"></div>
  <container width="100%">
    <grid v-if="registry_loaded" horizontal="center" vertical="top" wrap="wrap">
      <grid-item size="1/4" v-for="tool in showtools" :key="tool.identifier" class="tool">
          <h2 v-on:mouseover="uncollapse(tool)">{{tool.name}} <span class="version">{{tool.version}}</span></h2>
          <div v-show="!collapsed || selectedtool == tool.identifier" class="toolbody">
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
              <li v-for="publication in getPublications(tool)" :key="publication.name" class="publication">
                  <div v-if="publication.author" class="authors">{{publication.authors}}</div>
                  <icon name="book"></icon> <a v-if="publication.url" :href="publication.url">{{publication.name}}</a>
                  <span v-if="!publication.url">{{publication.name}}</span>
                  <div v-if="publication.isPartOf" class="journal">in: {{publication.isPartOf.name}} <template v-if="publication.isPartOf.issue">{{publication.isPartOf.issue}}</template></div>
                  <span v-if="publication.datePublished" class="date">({{publication.datePublished}})</span>
                  <span v-else-if="publication.isPartOf && publication.isPartOf.datePublished" class="date">({{publication.isPartOf.datePublished}})</span>
              </li>
          </ul>
          </div>
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
import { EnhancedCheck, EnhancedCheckGroup } from 'vue-enhanced-check'
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
    EnhancedCheck,
    EnhancedCheckGroup,
    Icon
  },
  data () {
    return {
      env: process.env,
      interface_labels: [ "Web Applications", "Web Services", "Command line tools", "Programming Libraries", "Any" ],
      interfaces: [ "WUI", "REST", "CLI", "LIB", "UNKNOWN" ],
      filter_labels: [ "Third party tools", "Remote Services" ],
      filters: [ "thirdparty", "remote" ],
      enabled_filters: [ "thirdparty", "remote" ],
      enabled_interfaces: [ "WUI", "REST" ],
      registry: {},
      registry_loaded: false,
      collapsed: false,
      isScrolled: false,
      selectedtool: ""
    }
  },
  created () {
      axios.get(this.env.REGISTRY_URL).then(response => {
          //add software
          response.data['@graph'].forEach(tool => {
              console.log("Registered tool " + tool.identifier);
              this.registry[tool.identifier] = tool
          });
          this.registry_loaded = true;
          this.$forceUpdate();
      });
      window.addEventListener('scroll', this.handleScroll);
  },
  computed: {
      showtools: function () {
          return Object.keys(this.registry).sort().map(identifier => this.registry[identifier]).filter(this.matchTool, this.enabled_interfaces);
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
      matchTool: function (tool) {
          console.log("Processing tool " + tool.identifier);
          if (tool.interfaceType) {
              if (this.enabled_interfaces.includes(tool.interfaceType)) {
                  return true;
              }
          }
          if (!this.enabled_filters.includes("thirdparty")) {
              if (this.isThirdParty(tool)) {
                  console.log("Tool " + tool.identifier + " is third party, not showing");
                  return false;
              }
          }
          if (!this.enabled_filters.includes("remote")) {
              if (this.isRemote(tool)) {
                  console.log("Tool " + tool.identifier + " is remote, not showing");
                  return false;
              }
          }
          if (tool.entryPoints !== undefined) {
              var found = false;
              tool.entryPoints.forEach(entrypoint => {
                  if (this.matchEntrypoint(entrypoint)) {
                      found = true;
                  }
              });
              if (found) {
                  console.log("Showing tool " + tool.identifier + ", matching entrypoints");
                  return true;
              } else {
                  console.log("Tool " + tool.identifier + " has no matching entrypoints, not showing");
              }
          }
          return this.enabled_interfaces.includes("UNKNOWN");
      },
      matchEntrypoint: function (entrypoint) {
          if (entrypoint.interfaceType) {
              if (this.enabled_interfaces.includes(entrypoint.interfaceType)) {
                  return true
              }
          }
          return false;
      },
      isThirdParty: function (tool) {
            /* determines whether the tool is a 3rd party tool by matching
               the producer, publisher or sourceOrganization properties, or
               any of the authors affiliations
            */
           if (this.env.ORGANIZATIONS.length === 0) return false; //no first parties specified
           var getOrganizationLabel = this.getOrganizationLabel; //function alias
           var organizations = this.getPropertyValues(tool, 'author', function (author) {
                 if (author.affiliation) {
                     return getOrganizationLabel(author.affiliation);
                 } else {
                     return "";
                 }
           });
           organizations += this.getPropertyValues(tool, 'producer', function (producer) {
                 return getOrganizationLabel(producer);
           });
           organizations += this.getPropertyValues(tool, 'publisher', function (producer) {
                 return getOrganizationLabel(producer);
           });
           organizations += this.getPropertyValues(tool, 'sourceOrganization', function (producer) {
                 return getOrganizationLabel(producer);
           });
           //check if any of the gathered organizations matches the first party organizations
           var firstparty = organizations.some(function (org) {
               return this.env.ORGANIZATIONS.some(function (reforg) {
                   return org.includes(reforg);
               });
           });
           return !firstparty;
      },
      isRemote: function (tool) {
          /* determines whether the tool is a remote or local tool
             by checking whether the url contains any of the pre-configured own domains
          */
          if (this.env.DOMAINS.length === 0) return false; //no first parties specified
          if (tool.entryPoints !== undefined) {
              return tool.entryPoints.some(function (entrypoint) {
                  return this.env.DOMAINS.some(function (domain) {
                      return entrypoint.urlTemplate.includes(domain);
                  });
              });
          } else {
              return false;
          }
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
      getPublications: function (tool) {
          return this.getPropertyValues(tool, 'referencePublication', function (publication) {
             publication.authors = publication.author.join(", ");
             return publication;
          })
      },
      getOrganizationLabel: function (org) {
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
      },
      getOrganizations: function (tool, property) {
          return this.getPropertyValues(tool, property, this.getOrganizationLabel);
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
.fixedtoolbar {
    position: fixed;
    top: 0;
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
ul.entrypoints li.actionable a {
    color: white;
}
ul.entrypoints li a {
    color: #30503a;
    font-weight: bold;
    text-decoration: none;
}
ul.entrypoints li.actionable:hover {
    background: #cbcba8;
}
ul.entrypoints li:hover a {
    color: #812c7f;
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
li.publication .authors, li.publication .journal, li.publication .date {
    font-style: italic;
    font-size: 60%;
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
}
div.toolbody {
    margin: 0;
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
div.tool:hover div.toolbody {
    display: block;
    visibility: visible;
}
.tool h2 {
    cursor: pointer;
}
</style>
