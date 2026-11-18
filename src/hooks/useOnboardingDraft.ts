import { useCallback, useEffect, useMemo, useRef, useState } from 'react'
import { browserDraftStorage, clearDraft, loadDraft, saveDraft } from '../services/onboardingDraft'
import type { User } from '../types/auth'
import type { OnboardingDraft, OnboardingField } from '../types/onboarding'
import { LAST_STEP, createDraft, createEmptyFields, isDraftDirty } from '../utils/onboarding'

const SAVE_DELAY_MS = 300

/**
 * The onboarding form's state. It is saved on this device while the seller
 * types, and restored after a refresh. No UI in here.
 */
export function useOnboardingDraft(user: User) {
  const storage = useMemo(() => browserDraftStorage(), [])
  const baseline = useMemo(
    () => createEmptyFields({ email: user.email, country: user.country }),
    [user.email, user.country],
  )

  const [initial] = useState(() => loadDraft(storage, user.id, baseline))
  const [draft, setDraft] = useState<OnboardingDraft>(
    () => initial ?? createDraft({ email: user.email, country: user.country }),
  )
  const [saveFailed, setSaveFailed] = useState(false)

  const dirty = isDraftDirty(draft, baseline)
  const restored = initial !== null && isDraftDirty(initial, baseline)

  const active = useRef(true)
  const latest = useRef({ draft, dirty })

  useEffect(() => {
    latest.current = { draft, dirty }
  })

  // Save a moment after the last change
  useEffect(() => {
    if (!active.current || !dirty) return
    const timer = window.setTimeout(() => setSaveFailed(!saveDraft(storage, user.id, draft)), SAVE_DELAY_MS)
    return () => window.clearTimeout(timer)
  }, [draft, dirty, storage, user.id])

  // Save immediately when leaving, so the last change is never lost
  useEffect(
    () => () => {
      if (active.current && latest.current.dirty) saveDraft(storage, user.id, latest.current.draft)
    },
    [storage, user.id],
  )

  const setField = useCallback((key: OnboardingField, value: string) => {
    setDraft((previous) => ({ ...previous, fields: { ...previous.fields, [key]: value } }))
  }, [])

  const setAcceptedTerms = useCallback((value: boolean) => {
    setDraft((previous) => ({ ...previous, acceptedTerms: value }))
  }, [])

  const goTo = useCallback((step: number) => {
    const target = Math.min(LAST_STEP, Math.max(0, step))
    setDraft((previous) => ({ ...previous, step: target, furthest: Math.max(previous.furthest, target) }))
  }, [])

  /** Forget the saved progress and start with an empty form. */
  const discard = useCallback(() => {
    clearDraft(storage, user.id)
    setSaveFailed(false)
    setDraft(createDraft({ email: user.email, country: user.country }))
  }, [storage, user.id, user.email, user.country])

  /** The store was created: stop saving and remove the draft. */
  const finish = useCallback(() => {
    active.current = false
    clearDraft(storage, user.id)
  }, [storage, user.id])

  return { draft, dirty, restored, saveFailed, setField, setAcceptedTerms, goTo, discard, finish }
}
