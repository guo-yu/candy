import path from 'path'

export function findPath(basePath=process.cwd(), relativePath) {
  return path.resolve(basePath, relativePath)
}