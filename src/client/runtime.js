const OWNER = 'deep-whale'
const TITLE = 'Deep Whale · DeepSeek Harness'
const SIDEBAR = ":is([data-pane='sidebar'], [class*='sidebarCol'])"
const STYLE_PROPERTIES = [
  'background-image', 'background-position', 'background-size', 'background-attachment', 'background-repeat',
  '--deep-whale-sidebar-width', '--deep-whale-details-width',
  ...Object.keys(assets).map(name => `--dw-${name.replace(/[A-Z]/g, letter => `-${letter.toLowerCase()}`)}`),
]

function chrome(type, html = '') {
  const element = document.createElement('div')
  element.dataset.skinChrome = type
  element.dataset.skinOwner = OWNER
  element.setAttribute('aria-hidden', 'true')
  element.innerHTML = html
  return element
}

function ensureChrome(parent, type, html) {
  let element = parent.querySelector(`:scope > [data-skin-chrome='${type}']`)
  if (!element) {
    element = chrome(type, html)
    parent.append(element)
  }
  return element
}

function imageMarkup(className, assetName) {
  return `<img class="${className}" src="${assets[assetName]}" alt="" draggable="false">`
}

function decorateBody() {
  if (!document.body.querySelector(":scope > [data-skin-chrome='deep-whale-ambience']")) {
    document.body.prepend(chrome('deep-whale-ambience', '<i></i><i></i><i></i><i></i><i></i><i></i>'))
  }
  ensureChrome(document.body, 'top-current', '<span></span><b>DEEP WHALE</b><small>HARNESS OCEAN INTERFACE</small>')
  ensureChrome(document.body, 'right-border-habitat', imageMarkup('dw-right-border-scene', 'sidebarHabitat'))
  ensureChrome(document.body, 'character-stage', [
    imageMarkup('dw-hero-girl-whale', 'heroGirlWhale'),
    imageMarkup('dw-details-girl', 'detailsGirl'),
  ].join(''))
  ensureChrome(document.body, 'seafloor-stage', '<span class="dw-hero-seafloor"></span><span class="dw-composer-seafloor"></span>')
}

function decorateConversation() {
  const center = document.querySelector("[class*='centerCol']")
  if (!center) return
  center.dataset.deepWhaleCenter = ''
  const seafloorStage = document.querySelector("[data-skin-chrome='seafloor-stage']")
  if (seafloorStage?.parentElement !== center) center.append(seafloorStage)
}

function decorateSidebar() {
  const sidebar = document.querySelector(SIDEBAR)
  const root = sidebar?.querySelector(':scope > div')
  if (!sidebar || !root) return
  const logoRow = root.querySelector("[class*='logoRow']")
  if (logoRow) {
    logoRow.dataset.deepWhaleLogo = ''
    ensureChrome(logoRow, 'brand-whale', imageMarkup('dw-brand-whale', 'brandWhale'))
  }
  const newSession = root.querySelector("button[class*='newSession']")
  if (newSession) newSession.dataset.deepWhaleNewSession = ''
  const settings = root.querySelector("[class*='settingsArea']")
  if (settings) {
    settings.dataset.deepWhaleSettings = ''
    const trigger = settings.querySelector(":scope > button, :scope > [role='button']")
    if (trigger) trigger.dataset.deepWhaleSettingsTrigger = ''
  }
  const footer = root.querySelector("[class*='footArea']")
  if (footer) footer.dataset.deepWhaleFooter = ''
  const habitat = ensureChrome(footer || root, 'sidebar-habitat', [
    imageMarkup('dw-sidebar-corner-frame', 'detailsCorner'),
    imageMarkup('dw-status-whale', 'statusWhale'),
    '<span class="dw-theme-status"><i></i><b>DEEP WHALE</b><small>ONLINE</small></span>',
  ].join(''))
  habitat.hidden = sidebar.getBoundingClientRect().width <= 120
}

function markWorkspaceTree() {
  const sidebar = document.querySelector(SIDEBAR)
  if (!sidebar) return
  sidebar.querySelectorAll('[data-deep-whale-workspace], [data-deep-whale-workspace-active], [data-deep-whale-session], [data-deep-whale-session-first], [data-deep-whale-session-last], [data-deep-whale-session-flat]').forEach((element) => {
    delete element.dataset.deepWhaleWorkspace
    delete element.dataset.deepWhaleWorkspaceActive
    delete element.dataset.deepWhaleSession
    delete element.dataset.deepWhaleSessionFirst
    delete element.dataset.deepWhaleSessionLast
    delete element.dataset.deepWhaleSessionFlat
  })
  sidebar.querySelectorAll("[role='tree']").forEach((tree) => {
    const rows = [...tree.querySelectorAll("[role='treeitem']")]
    if (!rows.some(row => row.hasAttribute('aria-expanded'))) {
      rows.forEach(row => {
        row.dataset.deepWhaleSession = ''
        row.dataset.deepWhaleSessionFlat = ''
      })
      return
    }
    let workspace
    let sessions = []
    const finish = () => {
      if (!workspace) return
      workspace.dataset.deepWhaleWorkspace = ''
      sessions.forEach(row => { row.dataset.deepWhaleSession = '' })
      if (sessions[0]) sessions[0].dataset.deepWhaleSessionFirst = ''
      if (sessions.at(-1)) sessions.at(-1).dataset.deepWhaleSessionLast = ''
      if (workspace.getAttribute('aria-expanded') === 'true' && sessions.some(row => row.getAttribute('aria-selected') === 'true')) {
        workspace.dataset.deepWhaleWorkspaceActive = ''
      }
    }
    rows.forEach((row) => {
      if (row.hasAttribute('aria-expanded')) {
        finish()
        workspace = row
        sessions = []
      } else if (workspace) {
        sessions.push(row)
      }
    })
    finish()
  })
}

function decorateDetails() {
  const details = document.querySelector("[class*='detailsCol']")
  if (!details) return
  ensureChrome(details, 'details-corner', '')
  const meaningful = [...details.children].some(child => !child.hasAttribute('data-skin-owner') && (child.textContent?.trim() || child.querySelector('button, input, textarea, [role]')))
  details.dataset.deepWhaleEmpty = meaningful ? 'false' : 'true'
}

function decorateTitlebar() {
  const titlebar = document.querySelector("[class*='titlebar']")
  if (!titlebar || titlebar.querySelector(":scope > [data-skin-chrome='titlebar-brand']")) return
  titlebar.prepend(chrome('titlebar-brand', '<span></span><strong>DEEP WHALE</strong><small>HARNESS SKIN</small>'))
}

export function apply(ctx) {
  installCss()
  const body = document.body
  const originalTitle = document.title
  const previous = new Map(STYLE_PROPERTIES.map(property => [property, body.style.getPropertyValue(property)]))
  let meta
  let previousThemeColor
  const syncThemeColor = () => {
    const current = document.head.querySelector('meta[name="theme-color"]')
    if (!current) return
    if (current !== meta) { meta = current; previousThemeColor = current.content }
    if (current.content !== '#eaf7ff') current.content = '#eaf7ff'
  }
  const headObserver = new MutationObserver(syncThemeColor)
  headObserver.observe(document.head, { attributes: true, attributeFilter: ['content'], childList: true, subtree: true })

  body.dataset.dshDeepWhale = ''
  for (const [name, value] of Object.entries(assets)) {
    const property = `--dw-${name.replace(/[A-Z]/g, letter => `-${letter.toLowerCase()}`)}`
    body.style.setProperty(property, `url("${value}")`)
  }
  body.style.setProperty('background-image', 'var(--dw-current-background)')
  body.style.setProperty('background-position', 'center top')
  body.style.setProperty('background-size', 'cover')
  body.style.setProperty('background-attachment', 'fixed')
  body.style.setProperty('background-repeat', 'no-repeat')
  document.title = TITLE
  syncThemeColor()
  decorateBody()

  let observedSidebar
  let observedDetails
  const resizeObserver = typeof ResizeObserver === 'undefined' ? undefined : new ResizeObserver(syncGeometry)
  function syncGeometry() {
    const sidebar = document.querySelector(SIDEBAR)
    const details = document.querySelector("[class*='detailsCol']")
    const sidebarWidth = Math.max(0, sidebar?.getBoundingClientRect().width ?? 0)
    const detailsWidth = Math.max(0, details?.getBoundingClientRect().width ?? 0)
    body.style.setProperty('--deep-whale-sidebar-width', `${Math.round(sidebarWidth)}px`)
    body.style.setProperty('--deep-whale-details-width', `${Math.round(detailsWidth)}px`)
    body.dataset.deepWhaleSidebarSize = sidebarWidth <= 120 ? 'rail' : sidebarWidth <= 220 ? 'narrow' : 'wide'
    body.dataset.deepWhaleDetails = detailsWidth <= 16 ? 'closed' : 'open'
    if (resizeObserver && sidebar !== observedSidebar) {
      if (observedSidebar) resizeObserver.unobserve(observedSidebar)
      observedSidebar = sidebar
      if (sidebar) resizeObserver.observe(sidebar)
    }
    if (resizeObserver && details !== observedDetails) {
      if (observedDetails) resizeObserver.unobserve(observedDetails)
      observedDetails = details
      if (details) resizeObserver.observe(details)
    }
  }

  const sync = () => {
    decorateTitlebar()
    decorateSidebar()
    decorateConversation()
    markWorkspaceTree()
    decorateDetails()
    syncGeometry()
    const phase = document.querySelector("[data-phase='hero'], [data-phase='settling'], [data-phase='active']")?.dataset.phase
    if (phase) body.dataset.deepWhalePhase = phase
  }
  sync()
  let syncFrame
  const scheduleSync = () => {
    if (syncFrame !== undefined) return
    syncFrame = requestAnimationFrame(() => {
      syncFrame = undefined
      sync()
    })
  }
  const observer = new MutationObserver((records) => {
    if (records.some(record => record.type === 'childList' || ['aria-expanded', 'aria-selected', 'data-phase'].includes(record.attributeName))) scheduleSync()
  })
  observer.observe(body, { attributes: true, attributeFilter: ['aria-expanded', 'aria-selected', 'data-phase'], childList: true, subtree: true })

  ctx.effect(() => () => {
    observer.disconnect()
    headObserver.disconnect()
    resizeObserver?.disconnect()
    if (syncFrame !== undefined) cancelAnimationFrame(syncFrame)
    delete body.dataset.dshDeepWhale
    delete body.dataset.deepWhaleSidebarSize
    delete body.dataset.deepWhaleDetails
    delete body.dataset.deepWhalePhase
    for (const [property, value] of previous) body.style.setProperty(property, value)
    document.querySelectorAll(`[data-skin-owner="${OWNER}"]`).forEach(element => element.remove())
    document.querySelectorAll('[data-deep-whale-center], [data-deep-whale-logo], [data-deep-whale-new-session], [data-deep-whale-settings], [data-deep-whale-settings-trigger], [data-deep-whale-footer], [data-deep-whale-empty], [data-deep-whale-workspace], [data-deep-whale-workspace-active], [data-deep-whale-session], [data-deep-whale-session-first], [data-deep-whale-session-last], [data-deep-whale-session-flat]').forEach((element) => {
      for (const key of Object.keys(element.dataset).filter(key => key.startsWith('deepWhale'))) delete element.dataset[key]
    })
    if (meta?.isConnected && previousThemeColor !== undefined) meta.content = previousThemeColor
    if (document.title === TITLE) document.title = originalTitle
  }, 'ui-skin-deep-whale: layered anime ocean interface')
}
