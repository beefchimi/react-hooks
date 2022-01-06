# This script is useful for Yarn only.

function nukeYarn() {
  rm -rf node_modules &&
  rm -rf yarn.lock &&
  # We don't always want to nuke these:
  # rm -rf .yarn &&
  # rm -rf .yarnrc.yml &&
  rm -rf .pnp.cjs &&
  rm -rf .pnp.loader.mjs &&
  yarn cache clean --all
}

nukeYarn
