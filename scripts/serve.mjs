import { createServer } from 'node:http'
import { readFile, stat } from 'node:fs/promises'
import { extname, join, normalize, resolve, sep } from 'node:path'

const root = resolve(import.meta.dirname, '..')
const port = Number(process.env.PORT || 4173)
const host = process.env.HOST || '127.0.0.1'

const MIME = {
  '.html': 'text/html; charset=utf-8',
  '.js': 'text/javascript; charset=utf-8',
  '.mjs': 'text/javascript; charset=utf-8',
  '.css': 'text/css; charset=utf-8',
  '.json': 'application/json; charset=utf-8',
  '.webp': 'image/webp',
  '.jpg': 'image/jpeg',
  '.jpeg': 'image/jpeg',
  '.png': 'image/png',
  '.svg': 'image/svg+xml',
  '.ico': 'image/x-icon',
  '.yml': 'text/yaml; charset=utf-8',
  '.md': 'text/markdown; charset=utf-8',
  '.map': 'application/json; charset=utf-8',
}

const server = createServer(async (request, response) => {
  try {
    const url = new URL(request.url, `http://${host}:${port}`)
    const rawPath = decodeURIComponent(url.pathname)
    let relative = rawPath === '/' ? 'tests/visual-harness.html' : rawPath.replace(/^\/+/, '')
    const target = normalize(join(root, relative))
    if (target !== root && !target.startsWith(root + sep)) {
      response.writeHead(403, { 'content-type': 'text/plain' })
      response.end('Forbidden')
      return
    }
    const info = await stat(target).catch(() => null)
    const file = info?.isDirectory() ? join(target, 'index.html') : target
    const data = await readFile(file)
    const type = MIME[extname(file).toLowerCase()] ?? 'application/octet-stream'
    response.writeHead(200, {
      'content-type': type,
      'content-length': data.length,
      'cache-control': 'no-store',
    })
    response.end(data)
  } catch {
    response.writeHead(404, { 'content-type': 'text/plain; charset=utf-8' })
    response.end('404 Not Found')
  }
})

server.listen(port, host, () => {
  console.log(`Deep Whale preview: http://${host}:${port}/tests/visual-harness.html?phase=hero&dark=1&preview=1`)
})