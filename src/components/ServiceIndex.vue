<template>
  <container width="100%">
    <grid horizontal="center" vertical="middle" wrap="wrap">
      <grid-item size="1/4" v-for="tool in tools" :key="tool.identifier" class="tool">
          <h2>{{tool.name}}</h2>
          <ul class="authors">
              <li v-for="author in tool.author" :key="author.familyName">{{author.givenName}} {{author.familyName}}</li>
          </ul>
          <div class="description">{{tool.description}}</div>
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

const config = {
  container: '1020px',
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
    GridItem: Vue.extend({ extends: GridItem, config })
  },
  data () {
    return {
      identifiers: [],
      registry: {},
      registry_url: "http://mhysa.anaproy.nl:8080/metadata.json",
      tools: []
    }
  },
  created () {
      axios.get(this.registry_url).then(response => {
          //add software
          response.data['@graph'].forEach(tool => {
              this.registry[tool.identifier] = tool
          })
          this.tools = Object.keys(this.registry).sort().map(identifier => this.registry[identifier]);
      })
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
div.tool {
    border: 1px solid #444;
    border-radius: 20px;
    margin: 10px;
    margin-bottom: 20px;
    padding: 10px;
    font-size: 80%;
}
div.tool:hover {
    background: #ddd;
}
div.tool .authors li {
  font-style: italic;
}
</style>
