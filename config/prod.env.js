'use strict'
module.exports = {
  NODE_ENV: '"production"',
  TITLE: '"Language Tool Portal"',
  DESCRIPTION: '"This portal provides an overview of available Natural Language Processing software, use the filters above to broaden or narrow the selection."',
  REGISTRY_URL: '"/metadata.json"',
  REMOTE_REGISTRIES: '[]', //remote metadata.json files whose services are to be included
  REMOTE_INCLUDE: '[]', //remote tool identifiers to include, leave empty for all
  REMOTE_EXCLUDE: '[]', //remote tool identifiers to exclude
  BASE: '"/"',
  LOGO_RIGHT: 'true',
  LOGO_LEFT: 'true',
  ORGANIZATIONS: '["Radboud"]',
  DOMAINS: '[]',
  REWRITE_HOST: '""',
  FORCE_HTTPS: 'true',
}
