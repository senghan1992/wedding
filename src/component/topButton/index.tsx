import { useEffect, useState } from "react"
import "./index.scss"

/**
 * 맨 위로 올라가기 버튼 컴포넌트입니다.
 *
 * 자석 스크롤 뷰포트(.snap-scroll-viewport)를 최상단(커버 페이지)으로 부드럽게 이동시킵니다.
 * 첫 페이지에 있을 때는 버튼을 숨기고, 스크롤이 시작되면 나타납니다.
 *
 * @returns {JSX.Element} 맨 위로 버튼
 */
export const TopButton = () => {
  const [visible, setVisible] = useState(false)

  useEffect(() => {
    const viewport = document.querySelector(".snap-scroll-viewport")
    if (!viewport) return

    const update = () => {
      setVisible(viewport.scrollTop > 10)
    }

    viewport.addEventListener("scroll", update, { passive: true })
    update()
    return () => viewport.removeEventListener("scroll", update)
  }, [])

  /**
   * 스크롤 뷰포트를 맨 위로 이동시킵니다.
   */
  const scrollToTop = () => {
    document
      .querySelector(".snap-scroll-viewport")
      ?.scrollTo({ top: 0, behavior: "smooth" })
  }

  return (
    <button
      type="button"
      className={`top-button${visible ? " top-button-visible" : ""}`}
      onClick={scrollToTop}
      aria-label="맨 위로 가기"
    >
      <svg viewBox="0 0 24 24" width="16" height="16" aria-hidden="true">
        <path
          d="M12 5.5 4.5 13l1.4 1.4L12 8.3l6.1 6.1 1.4-1.4z"
          fill="currentColor"
        />
      </svg>
    </button>
  )
}
