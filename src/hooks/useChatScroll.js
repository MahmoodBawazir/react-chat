import { useEffect, useRef, useCallback } from 'react'

const useChatScroll = (ref, messages) => {
  const scrollHeightRef = useRef()
  const isScrolledDownRef = useRef(true)

  const hasOverflow = (el) => el.clientHeight < el.scrollHeight

  const isScrolledDown = (el, threshold = 150) => {
    const bottom = el.scrollTop + el.clientHeight
    return bottom >= el.scrollHeight - threshold
  }

  const isScrolledUp = (el) => el.scrollTop === 0

  const scrollDown = (el) => (el.scrollTop = el.scrollHeight - el.clientHeight)

  const scrollDownBy = (el, amount) => (el.scrollTop += amount)

  const scrollDownIfNeeded = useCallback(() => {
    if (isScrolledDownRef.current && hasOverflow(ref.current)) {
      scrollDown(ref.current)
    }
  }, [ref])

  const handleScroll = () => {
    isScrolledDownRef.current = isScrolledDown(ref.current)
  }

  useEffect(() => {
    if (ref.current) {
      scrollDownIfNeeded()
    }
  }, [ref, messages, scrollDownIfNeeded])

  useEffect(() => {
    if (ref.current) {
      scrollHeightRef.current = ref.current.scrollHeight
    }
  }, [ref, scrollHeightRef])

  useEffect(() => {
    if (ref.current) {
      /* if the list is scrolled all the way up and new messages are added, preserve the current scroll position */
      if (isScrolledUp(ref.current) && scrollHeightRef.current !== null) {
        /* the scroll height increased by this much during the update */
        const difference = ref.current.scrollHeight - scrollHeightRef.current

        scrollHeightRef.current = null
        scrollDownBy(ref.current, difference)
      } else {
        scrollDownIfNeeded()
      }
    }
  }, [ref, scrollHeightRef, messages, scrollDownIfNeeded])

  return handleScroll
}

export default useChatScroll
