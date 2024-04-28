import {readFileSync, writeFileSync} from 'fs'

const targetVersion = process.env.npm_package_version

// update versions.json with target version and minAppVersion from manifest.json
let versions = JSON.parse(readFileSync('versions.json', 'utf8'))

// read minAppVersion from manifest.json and bump version to target version
let manifest = JSON.parse(readFileSync('manifest.json', 'utf8'))
manifest.version = targetVersion
writeFileSync('manifest.json', JSON.stringify(manifest, null, ' '))
versions[manifest.version] = manifest.minAppVersion

// read minAppVersion from manifest.json and bump version to target version
let manifest_beta = JSON.parse(readFileSync('manifest-beta.json', 'utf8'))
manifest.version = `${targetVersion}-beta`
writeFileSync('manifest-beta.json', JSON.stringify(manifest, null, ' '))
versions[manifest_beta.version] = manifest_beta.minAppVersion

writeFileSync('versions.json', JSON.stringify(versions, null, ' '))
