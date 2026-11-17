import { useCallback, useEffect, useRef, useState } from 'react'

export type ShareStatus = 'idle' | 'shared' | 'copied' | 'manual'

const RESET_AFTER_MS = 2500

/**
 * Shares the current page: native share sheet when the browser has one,
 * otherwise copies the link. "manual" means neither worked.
 */
export function useShareLink(title: string, text: string) {
  const [status, setStatus] = useState<ShareStatus>('idle')
  const timer = useRef<number>(0)

  useEffect(() => () => window.clearTimeout(timer.current), [])

  const show = useCallback((next: ShareStatus) => {
    setStatus(next)
    window.clearTimeout(timer.current)
    timer.current = window.setTimeout(() => setStatus('idle'), RESET_AFTER_MS)
  }, [])

  const share = useCallback(async () => {
    const url = window.location.href

    if (typeof navigator.share === 'function') {
      try {
        await navigator.share({ title, text, url })
        show('shared')
        return
      } catch (error) {
        // The person closed the share sheet: nothing to report
        if (error instanceof DOMException && error.name === 'AbortError') return
      }
    }

    try {
      await navigator.clipboard.writeText(url)
      show('copied')
    } catch {
      show('manual')
    }
  }, [show, text, title])

  return { status, share }
}
