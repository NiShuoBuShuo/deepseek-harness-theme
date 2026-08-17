import test from 'node:test'
import assert from 'node:assert/strict'
import { readFile } from 'node:fs/promises'
import { resolve } from 'node:path'

const root = resolve(import.meta.dirname, '..')
test('bundle contains scoped CSS, embedded artwork and disposer', async () => {
  const bundle = await readFile(resolve(root, 'lib/client.js'), 'utf8')
  assert.match(bundle, /window\.__ModuleLoader__\.load/)
  assert.match(bundle, /id: "@nishuobushuo\/dsh-client-ui-skin-deep-whale"/)
  assert.match(bundle, /exports\.apply = apply/)
  assert.match(bundle, /data-dsh-deep-whale/)
  assert.equal(bundle.match(/data:image\/webp;base64,/g)?.length, 13)
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
  // Collapsed rail (<=120px) must keep the native whale toggle inside the 56px
  // edge: no 43px logo gutter and no decorative brand whale, or the toggle
  // button is clipped past the rail and the icon stops expanding the sidebar.
  assert.match(bundle, /\[data-deep-whale-sidebar-size='rail'\] \[data-deep-whale-logo\][\s\S]*?padding-left: 0/)
  assert.match(bundle, /\[data-deep-whale-sidebar-size='rail'\] \[data-skin-chrome='brand-whale'\][\s\S]*?display: none/)
  assert.doesNotMatch(bundle, /dw-active-companion/)
  assert.doesNotMatch(bundle, /@local\/dsh-client-ui-skin-deep-whale/)
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
