// Drives a real Chrome via CDP against http://127.0.0.1:3001 to verify the
// deep-whale theme's sidebar toggle across wide -> rail -> wide transitions.
import { spawn } from 'node:child_process'
import { setTimeout as sleep } from 'node:timers/promises'
import { writeFileSync } from 'node:fs'
import { createRequire } from 'node:module'

const require = createRequire('C:/Users/HPC/AppData/Roaming/npm/node_modules/@deepseek-ai/dsh/node_modules/')
const WebSocket = require('ws')

const CHROME = 'C:/Program Files/Google/Chrome/Application/chrome.exe'
const PORT = 9333
const URL = 'http://127.0.0.1:3001/'

const chrome = spawn(CHROME, [
  '--remote-debugging-port=' + PORT,
  '--headless=new',
  '--disable-gpu',
  '--window-size=1440,900',
  '--user-data-dir=C:/Users/HPC/AppData/Local/Temp/dw-cdp-profile',
  '--no-first-run',
  '--no-default-browser-check',
  'about:blank',
], { stdio: 'ignore' })

let ws
let nextId = 1
const pending = new Map()
function send(method, params) {
  return new Promise((resolve, reject) => {
    const id = nextId++
    pending.set(id, { resolve, reject })
    ws.send(JSON.stringify({ id: id, method: method, params: params || {} }))
  })
}

async function waitDevtools() {
  for (let i = 0; i < 50; i++) {
    try {
      const res = await fetch('http://127.0.0.1:' + PORT + '/json/version')
      return await res.json()
    } catch {
      await sleep(200)
    }
  }
  throw new Error('devtools never came up')
}

const report = {}
const themeState = '(' +
  '() => {' +
  "  const sidebar = document.querySelector(\":is([data-pane='sidebar'], [class*='sidebarCol'])\");" +
  "  const logoRow = sidebar?.querySelector(':scope > div')?.querySelector(\"[class*='logoRow']\");" +
  "  const toggle = logoRow?.querySelector(\"button[class*='toggle']\");" +
  "  const brand = logoRow?.querySelector(\"[data-skin-chrome='brand-whale']\");" +
  '  const tr = toggle?.getBoundingClientRect();' +
  '  const cx = tr ? tr.left + tr.width / 2 : 0, cy = tr ? tr.top + tr.height / 2 : 0;' +
  '  const at = (cx > 0 && cy > 0) ? document.elementFromPoint(cx, cy) : null;' +
  '  return {' +
  "    size: document.body.dataset.deepWhaleSidebarSize || null," +
  "    widthVar: getComputedStyle(document.body).getPropertyValue('--deep-whale-sidebar-width')," +
  '    sidebarW: sidebar ? Math.round(sidebar.getBoundingClientRect().width) : null,' +
  "    logoMarked: !!document.querySelector('[data-deep-whale-logo]')," +
  '    brandWhalePresent: !!brand,' +
  '    brandDisplay: brand ? getComputedStyle(brand).display : null,' +
  '    logoPaddingLeft: logoRow ? getComputedStyle(logoRow).paddingLeft : null,' +
  "    habitat: !!document.querySelector(\"[data-skin-chrome='sidebar-habitat']\")," +
  "    footerMarked: !!document.querySelector('[data-deep-whale-footer]')," +
  '    title: document.title,' +
  "    toggleAria: toggle?.getAttribute('aria-label') || null," +
  '    clickReachesToggle: !!at && (at === toggle || toggle.contains(at)),' +
  "    elementAtToggle: at ? String(at.className).slice(0, 50) : null," +
  '  };' +
  '}' +
')()'

async function evaluate(expression) {
  const r = await send('Runtime.evaluate', { expression: expression, returnByValue: true, awaitPromise: true })
  if (r.exceptionDetails) throw new Error(JSON.stringify(r.exceptionDetails))
  return r.result.value
}

async function shot(path) {
  const r = await send('Page.captureScreenshot', { format: 'png' })
  writeFileSync(path, Buffer.from(r.data, 'base64'))
  console.log('screenshot -> ' + path)
}

try {
  await waitDevtools()
  const tab = await (await fetch('http://127.0.0.1:' + PORT + '/json/new?' + URL, { method: 'PUT' })).json()
  ws = new WebSocket(tab.webSocketDebuggerUrl)
  await new Promise((r) => { ws.on('open', r) })
  ws.on('message', (data) => {
    const msg = JSON.parse(data)
    if (msg.id && pending.has(msg.id)) {
      const p = pending.get(msg.id)
      pending.delete(msg.id)
      if (msg.error) p.reject(new Error(JSON.stringify(msg.error)))
      else p.resolve(msg.result)
    }
  })
  await send('Page.enable')
  await send('Runtime.enable')

  for (let i = 0; i < 60; i++) {
    const t = await evaluate('document.title').catch(() => '')
    if (String(t).includes('Deep Whale')) break
    await sleep(300)
  }
  await sleep(2500)

  report.wide = await evaluate(themeState)
  await shot('tests/shot-1-wide.png')

  await evaluate("document.querySelector(\"button[class*='toggle']\").click()")
  await sleep(2000)
  report.rail = await evaluate(themeState)
  await shot('tests/shot-2-rail.png')

  await evaluate("document.querySelector(\"button[class*='toggle']\").click()")
  await sleep(2000)
  report.reopened = await evaluate(themeState)
  await shot('tests/shot-3-reopened.png')
} finally {
  try { ws && ws.close() } catch {}
  try { process.kill(chrome.pid, 'SIGKILL') } catch {}
}

console.log(JSON.stringify(report, null, 2))