import type { Context } from '@deepseek-ai/cordis'
import { DEEP_WHALE_BACKGROUND } from './background.generated.ts'
import './deep-whale.module.css'

const OWNER = 'deep-whale'
const TITLE = 'Deep Whale · DeepSeek Harness'
const PROPERTIES = ['background-image', 'background-position', 'background-size', 'background-attachment', 'background-repeat'] as const

export function apply(ctx: Context): void {
  const body = document.body
  const originalTitle = document.title
  const previous = new Map(PROPERTIES.map(property => [property, body.style.getPropertyValue(property)]))
  const meta = document.head.querySelector<HTMLMetaElement>('meta[name="theme-color"]')
  const previousThemeColor = meta?.content

  body.dataset.dshDeepWhale = ''
  body.style.setProperty('background-image', `url(${DEEP_WHALE_BACKGROUND})`)
  body.style.setProperty('background-position', 'center top')
  body.style.setProperty('background-size', 'cover')
  body.style.setProperty('background-attachment', 'fixed')
  body.style.setProperty('background-repeat', 'no-repeat')
  if (meta) meta.content = '#dff5ff'
  document.title = TITLE

  const ambience = document.createElement('div')
  ambience.dataset.skinChrome = 'deep-whale-ambience'
  ambience.dataset.skinOwner = OWNER
  ambience.setAttribute('aria-hidden', 'true')
  ambience.innerHTML = '<i></i><i></i><i></i><i></i><i></i>'
  body.prepend(ambience)

  const status = document.createElement('div')
  status.dataset.skinChrome = 'deep-whale-status'
  status.dataset.skinOwner = OWNER
  status.setAttribute('aria-hidden', 'true')
  status.innerHTML = '<span class="deep-whale-pulse"></span><span>DEEP WHALE</span><small>ocean link stable</small>'
  body.append(status)

  ctx.effect(() => () => {
    delete body.dataset.dshDeepWhale
    for (const [property, value] of previous) body.style.setProperty(property, value)
    document.querySelectorAll(`[data-skin-owner="${OWNER}"]`).forEach(element => element.remove())
    if (meta && previousThemeColor !== undefined) meta.content = previousThemeColor
    if (document.title === TITLE) document.title = originalTitle
  }, 'ui-skin-deep-whale: ocean glass theme')
}
