# Labirinto

Labirinto is a *virtual laboratory portal*, it makes a collection of software browseable and searchable for the
end-user. Labirinto presents the software's metadata in an intuitive way and allows the user to filter and perform a limited search.
The portal gives access to software if it offers web-based interfaces.

This system is specifically geared towards research software, and for instance allows linking to relevant scientific publications for each tool.

## Architecture

Labirinto is a front-end only, it runs fully client-side and is written in Javascript using the [Vue.js](https://vuejs.org) framework.

Labirinto relies on software metadata specifications according to the [CodeMeta](https://codemeta.github.io) standard
(linked open data / JSON-LD). Metadata of the desired software collection should be combined into a single registry
(JSON-LD), which can be hosted and obtained from wherever you want. [CodeMetaPy](https://github.com/proycon/codemetapy)
can be used to build such a registry from individual ``codemeta.json`` files.

Note that Labirinto does not and will never offer an editable database or metadata editor for the software metadata;
this is a front-end that does not even require a database backend or any server-side component for that matter. Our
philosophy is that software metadata should be in a simple format and either live right alongside the source code in a
version controlled repository (e.g. on github, bitbucket, etc), or be obtained from a software repository such as as the
Python Package Index, CRAN, CPAN, Maven Central and automatically converted to a unified format.

Labirinto is used by and included in the [LaMachine](https://github.com/proycon/LaMachine) software distribution,
providing an overview and access to all software installed in LaMachine. The metadata for tools participating in
LaMachine is, when not explicitly provided in yet, *automatically* converted to the CodeMeta standard (by
[CodeMetaPy](https://github.com/proycon/codemetapy) or [CodeMetar](https://ropensci.github.io/codemetar/)), and
subsequently combined into a single registry for use with Labirinto.


## Build Setup

``` bash
# install dependencies
npm install

# serve with hot reload at localhost:8080
npm run dev

# build for production with minification
npm run build

# build for production and view the bundle analyzer report
npm run build --report

# run unit tests
npm run unit

# run all tests
npm test
```

