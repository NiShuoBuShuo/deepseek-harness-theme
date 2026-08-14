import test from 'node:test'
import assert from 'node:assert/strict'
import { readFile } from 'node:fs/promises'
import { resolve } from 'node:path'

const root = resolve(import.meta.dirname, '..')
test('bundle contains scoped CSS, embedded artwork and disposer', async () => {
  const bundle = await readFile(resolve(root, 'lib/client.js'), 'utf8')
  assert.match(bundle, /window\.__ModuleLoader__\.load/)
  assert.match(bundle, /id: "@local\/dsh-client-ui-skin-deep-whale"/)
  assert.match(bundle, /exports\.apply = apply/)
  assert.match(bundle, /data-dsh-deep-whale/)
  assert.equal(bundle.match(/data:image\/webp;base64,/g)?.length, 15)
  assert.match(bundle, /ctx\.effect/)
  assert.match(bundle, /data-skin-owner/)
  assert.match(bundle, /data-phase='hero'/)
  assert.match(bundle, /data-deep-whale-new-session/)
  assert.match(bundle, /data-deep-whale-workspace/)
  assert.match(bundle, /data-composer-card/)
  assert.match(bundle, /detailsCol/)
  assert.match(bundle, /data-deep-whale-settings-trigger/)
  assert.doesNotMatch(bundle, /right-border-habitat/)
  assert.match(bundle, /dw-sidebar-corner-frame/)
  assert.match(bundle, /contain: strict/)
  assert.doesNotMatch(bundle, /dw-active-companion/)
  assert.doesNotMatch(bundle, /https?:\/\//)
})

test('manifest exposes the public web client shape', async () => {
  const manifest = JSON.parse(await readFile(resolve(root, 'package.json'), 'utf8'))
  assert.deepEqual(manifest.dsh.client, { inject: [], platform: 'web' })
  assert.equal(manifest.exports['./client'], './lib/client.js')
})

test('visual harness exercises the same module-loader contract as dsh web', async () => {
  const harness = await readFile(resolve(root, 'tests/visual-harness.html'), 'utf8')
  assert.match(harness, /window\.__ModuleLoader__/)
  assert.match(harness, /await import\('\/lib\/client\.js'\)/)
  assert.doesNotMatch(harness, /import \{ apply \}/)
})
