import { useCallback, useEffect, useRef, useState } from 'react'
import { useNavigate } from 'react-router-dom'

/**
 * Asks before the person leaves a page with changes. Covers closing or
 * reloading the tab and clicking any link inside the site.
 * (The browser's Back button cannot be intercepted with this router setup.)
 */
export function useLeaveGuard(active: boolean) {
  const navigate = useNavigate()
  const [pending, setPending] = useState<string | null>(null)
  const bypass = useRef(false)

  useEffect(() => {
    if (!active) return

    const onBeforeUnload = (event: BeforeUnloadEvent) => {
      if (bypass.current) return
      event.preventDefault()
      event.returnValue = ''
    }

    const onClick = (event: MouseEvent) => {
      if (bypass.current || event.defaultPrevented || event.button !== 0) return
      if (event.metaKey || event.ctrlKey || event.shiftKey || event.altKey) return
      if (!(event.target instanceof Element)) return

      const anchor = event.target.closest('a[href]')
      if (!(anchor instanceof HTMLAnchorElement)) return
      if (anchor.target !== '' && anchor.target !== '_self') return
      if (anchor.origin !== window.location.origin) return
      if (anchor.pathname === window.location.pathname && anchor.search === window.location.search) return

      event.preventDefault()
      event.stopPropagation()
      setPending(`${anchor.pathname}${anchor.search}${anchor.hash}`)
    }

    window.addEventListener('beforeunload', onBeforeUnload)
    // Capture phase: runs before the router's own link handler
    document.addEventListener('click', onClick, true)
    return () => {
      window.removeEventListener('beforeunload', onBeforeUnload)
      document.removeEventListener('click', onClick, true)
    }
  }, [active])

  const stay = useCallback(() => setPending(null), [])

  const leave = useCallback(() => {
    if (pending === null) return
    bypass.current = true
    setPending(null)
    navigate(pending)
  }, [navigate, pending])

  /** Call just before navigating on purpose, e.g. after submitting */
  const allowNavigation = useCallback(() => {
    bypass.current = true
  }, [])

  return { pending, stay, leave, allowNavigation }
}
