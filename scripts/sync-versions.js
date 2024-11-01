const fs = require('fs')
const path = require('path')

const packagesDirs = ['apps', 'packages']
const rootPackageJsonPath = path.join(__dirname, '..', 'package.json')

// Read root package.json
const rootPackageJson = JSON.parse(fs.readFileSync(rootPackageJsonPath, 'utf8'))
const newVersion = rootPackageJson.version

packagesDirs.forEach((dir) => {
  const packagesPath = path.join(__dirname, '..', dir)
  if (fs.existsSync(packagesPath)) {
    const packages = fs.readdirSync(packagesPath).filter((pkg) => {
      return fs.statSync(path.join(packagesPath, pkg)).isDirectory()
    })

    packages.forEach((pkg) => {
      const pkgJsonPath = path.join(packagesPath, pkg, 'package.json')
      if (fs.existsSync(pkgJsonPath)) {
        const pkgJson = JSON.parse(fs.readFileSync(pkgJsonPath, 'utf8'))
        pkgJson.version = newVersion
        fs.writeFileSync(
          pkgJsonPath,
          JSON.stringify(pkgJson, null, 2) + '\n',
          'utf8',
        )
        console.log(`Updated ${pkgJsonPath} to version ${newVersion}`)
      }
    })
  }
})
