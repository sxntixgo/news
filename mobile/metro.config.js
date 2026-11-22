// The API contract lives in ../shared, outside this project, and Metro assumes
// everything it bundles sits under the project root. Two things make the alias
// work, and both are load-bearing — dropping either produces a build that
// resolves `@shared/api` and then cannot read the file:
//
//   1. `watchFolders` below, so the directory is crawled and watched;
//   2. `resolveRequest` below, mapping the alias to an absolute path.
//
// SDK 58 removed Metro's on-demand filesystem; its app.json experiment is gone.
//
// The alias is also declared in tsconfig.json, for the type-checker's benefit.
const { getDefaultConfig } = require('expo/metro-config');
const path = require('node:path');

const projectRoot = __dirname;
const sharedRoot = path.resolve(projectRoot, '..', 'shared');
const ALIAS = '@shared';

const config = getDefaultConfig(projectRoot);

config.watchFolders = [...(config.watchFolders ?? []), sharedRoot];

config.resolver.resolveRequest = (context, moduleName, platform) => {
  if (moduleName === ALIAS || moduleName.startsWith(`${ALIAS}/`)) {
    const rest = moduleName.slice(ALIAS.length).replace(/^\//, '') || 'api';
    return context.resolveRequest(context, path.join(sharedRoot, rest), platform);
  }
  return context.resolveRequest(context, moduleName, platform);
};

module.exports = config;
