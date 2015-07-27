import path from 'path'

export function findPath(basePath = process.cwd(), relativePath) {
  return path.resolve(basePath, relativePath)
}

export function isPage(p) {
  if (!p) 
    return false

  var n = parseInt(p)

  if (isNaN(n)) 
    return false

  return n
}