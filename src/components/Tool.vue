<template>
    <div class="tool" v-if="matchTool(tool)" v-on:mouseenter="hover = true" v-on:mouseleave="hover = false">
          <h2>{{tool.name}} <span class="version" v-if="tool.version !== undefined && tool.version !== 'unknown' && tool.version !== 'unspecified'">{{tool.version}}</span></h2>
          <div v-show="collapsed && !hover" class="description_short">
              {{tool.description|truncate(30,true)}}
          </div>
          <div v-show="!collapsed || hover" class="toolbody">
          <ul v-if="tool.author" class="authors">
              <li v-for="(author, authorindex) in getAuthors(tool)" :key="authorindex">{{author}}<span v-if="authorindex < getAuthors(tool).length - 1">,&nbsp;</span></li>
          </ul>
          <ul class="affiliations">
              <template v-if="tool.producer">
                  <li v-for="organization in getOrganizations(tool, 'producer')" :key="organization.name">{{organization}}</li>
              </template>
              <template v-if="tool.publisher">
                  <li v-for="organization in getOrganizations(tool, 'publisher')" :key="organization.name">{{organization}}</li>
              </template>
              <template v-if="tool.funder">
                  <li v-for="organization in getOrganizations(tool, 'funder')" class="funder" :key="organization.name">{{organization}}</li>
              </template>
          </ul>
          <div class="description">
              {{tool.description}}
              <button @click="showReadMe(tool)" v-if="tool.readme !== undefined && enable_readmore">read more...</button>
          </div>
          <ul class="properties">
              <li v-if="tool.url" hint="Project website"><icon name="home"></icon>&nbsp;<a :href="tool.url">Website</a></li>
              <li v-if="tool.codeRepository" hint="Source code repository"><icon name="code"></icon>&nbsp;<a :href="tool.codeRepository">Source code</a></li>
              <li v-if="tool.issueTracker" hint="Issue Tracker"><icon name="bug"></icon>&nbsp;<a :href="tool.issueTracker">Issue Tracker</a></li>
              <li v-if="tool.license" class="license" hint="License"><icon name="copyright" :label="getLicense(tool)"></icon>&nbsp;<span>{{getLicense(tool)}}</span></li>
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
                  <li v-if="matchProgLangs(tool,'r')" class="proglang"><icon name="brands/r-project"></icon>&nbsp; <span>R</span></li>
                  <li v-if="matchProgLangs(tool,'perl')" class="proglang"><icon name="brands/product-hunt"></icon>&nbsp; <span>Perl</span></li>
                  <li v-if="matchProgLangs(tool,'go')" class="proglang"><icon name="brands/google"></icon>&nbsp; <span>Go</span></li>
                  <li v-if="matchProgLangs(tool,'lua')" class="proglang"><icon name="moon"></icon>&nbsp; <span>Lua</span></li>
              </template>
              <li v-if="tool.audience" class="audience" hint="Intended Audience"><icon name="users" :label="getAudience(tool)"></icon>&nbsp;<span>{{getAudience(tool)}}</span></li>
              <!-- begin CLARIN specific -->
              <li v-if="tool.researchdomain" class="researchdomain" hint="Research Domain"><icon name="graduation-cap" :label="getResearchdomain(tool)"></icon>&nbsp;<span>{{getPropertyValue(tool, 'researchDomain')}}</span></li>
              <li v-if="tool.linguisticssubject" class="linguisticssubject" hint="Linguistics Subject">&nbsp;<span>({{getPropertyValue(tool, 'linguisticsSubject')}})</span></li>
              <li v-if="tool.researchphase" class="researchphase" hint="Research Phase">&nbsp;<span>{{getPropertyValue(tool, 'researchPhase')}}</span></li>
              <!-- end CLARIN specific -->
              <li class="link"><icon name="database" @click="$emit('show-metadata', tool)"><icon name="graduation-cap" :label="getResearchdomain(tool)"></icon>&nbsp;<span @click="$emit('show-metadata', tool)">Metadata</span></li>
          </ul>
          <ul v-if="tool.keywords" class="keywords">
              <li v-for="keyword in tool.keywords" :key="keyword">{{keyword}}</li>
          </ul>
          <ul v-if="tool.tooltask" class="keywords"> <!-- CLARIN specific -->
              <li v-for="keyword in tool.tooltask" :key="keyword">{{keyword}}</li>
          </ul>
          <ul class="entrypoints">
              <li v-for="entrypoint in tool.entryPoints" v-if="matchEntrypoint(entrypoint)"  :key="(entrypoint.urlTemplate, entrypoint.interfaceType)" :class="entrypoint.interfaceType == 'WUI' ? 'actionable' : 'inactionable'">
                <icon v-if="entrypoint.interfaceType == 'WUI'" name="sign-in-alt"></icon>
                <icon v-else-if="entrypoint.interfaceType == 'REST'" name="cog"></icon>
                <icon v-else-if="entrypoint.interfaceType == 'CLI'" name="terminal"></icon>
                <tt v-if="entrypoint.name">{{entrypoint.name}}<br/></tt>
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
    </div>
</template>

<script>
import 'vue-awesome/icons'
import Icon from 'vue-awesome/components/Icon'

export default {
  name: 'tool',
  components: {
    Icon
  },
  props: {
      tool: Object,
      collapsed: Boolean,
      interfaces: Array,
      filters: Array
  },
  data () {
    return {
      env: process.env,
      enable_readmore: false,
      hover: false
    }
  },
  methods: {
      matchTool: function (tool) {
          if (!this.filters.includes("thirdparty")) {
              if (this.isThirdParty(tool)) {
                  //console.log("Tool " + tool.identifier + " is third party, not showing");
                  return false;
              }
          }
          if (!this.filters.includes("remote")) {
              if (this.isRemote(tool)) {
                  //console.log("Tool " + tool.identifier + " is remote, not showing");
                  return false;
              }
          }
          if (tool.interfaceType) {
              if (this.interfaces.includes(tool.interfaceType)) {
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
              if (found) {
                  return true;
              }
          }
          return this.interfaces.includes("UNKNOWN");
      },
      matchEntrypoint: function (entrypoint) {
          if (entrypoint.interfaceType) {
              if (this.interfaces.includes(entrypoint.interfaceType)) {
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
           organizations = organizations.concat(this.getPropertyValues(tool, 'producer', function (producer) {
                 return getOrganizationLabel(producer);
           }));
           organizations = organizations.concat(this.getPropertyValues(tool, 'publisher', function (producer) {
                 return getOrganizationLabel(producer);
           }));
           organizations = organizations.concat(this.getPropertyValues(tool, 'sourceOrganization', function (producer) {
                 return getOrganizationLabel(producer);
           }));
           //check if any of the gathered organizations matches the first party organizations
           var reforgs = this.env.ORGANIZATIONS;
           var firstparty = organizations.some(function (org) {
               return reforgs.some(function (reforg) {
                   return (org !== "") && (reforg !== "") && org.toLowerCase().includes(reforg.toLowerCase());
               });
           });
           return !firstparty;
      },
      isRemote: function (tool) {
          /* determines whether the tool is a remote or local tool
             by checking whether the url contains any of the pre-configured own domains
          */
          if (this.env.DOMAINS.length === 0) return false; //no first parties specified
          var domains = this.env.DOMAINS;
          if (tool.entryPoints !== undefined) {
              return tool.entryPoints.some(function (entrypoint) {
                  return domains.some(function (domain) {
                      return (domain !== "") && (entrypoint.urlTemplate.includes(domain));
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
              if (org.name !== undefined) {
                  labels.push(org.name);
              } else if (org['@id'] !== undefined) { //fallback to ID if it there is no name
                  labels.push(org['@id']);
              }
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
.authors li {
  font-style: italic;
}
span.version {
    font-weight: normal;
    font-size: 60%;
    font-style: italic;
}
.license span, div.tool .proglang span, div.tool .audience span, div.tool .researchphase span, div.tool .researchdomain span, div.tool .linguisticssubject span {
    font-size: 65%;
}
.tool .link span {
    font-size: 65%;
    cursor: pointer;
}
ul.keywords li {
    font-size: 65%;
    color: #89370e;
}
ul.entrypoints li {
    display: block;
    background: #e1d8d1;
    padding: 2px;
    border-radius: 5px;
    margin-bottom: 2px;
}
ul.entrypoints li.actionable {
    background: #ff9c00;
}
ul.entrypoints li.actionable a {
    color: white;
}
ul.entrypoints li a {
    color: black;
    font-weight: bold;
    text-decoration: none;
}
ul.entrypoints li.actionable:hover {
    background: #ff9c00;
}
ul.entrypoints li:hover a {
    color: #b82b2b;
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
    color: #f25609;
    font-size: 80%;
}
ul.affiliations li.funder {
    color: #89370e;
    font-style: italic;
}
li.publication .authors, li.publication .journal, li.publication .date {
    font-style: italic;
    font-size: 60%;
}
div.toolbody {
    margin: 0;
    padding: 0;
}
div.tool:hover div.toolbody {
    display: block;
    visibility: visible;
}
div.tool h2 {
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
.description_short {
    font-size: 11px;
}
</style>
