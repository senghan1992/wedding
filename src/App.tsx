import { useEffect, useState } from "react"
import { Cover } from "./component/cover"
import { Location } from "./component/location"
import "./App.scss"
import { BGEffect } from "./component/bgEffect"
import { Invitation } from "./component/invitation"
import { WeddingDay } from "./component/weddingDay"
import { ShareButton } from "./component/shareButton"
import { TopButton } from "./component/topButton"
import { DonationModal } from "./component/donationModal"
import { SECTION_IDS } from "./const"

/**
 * 페이지 진행률을 나타내는 상단 진행 바 컴포넌트입니다.
 * 자석 스크롤에서 현재 몇 번째 페이지인지 시각적으로 알려줍니다.
 */
const PageProgress = () => {
  const [progress, setProgress] = useState(0)

  useEffect(() => {
    const viewport = document.querySelector(".snap-scroll-viewport")
    if (!viewport) return

    const update = () => {
      const max = viewport.scrollHeight - viewport.clientHeight
      setProgress(max > 0 ? viewport.scrollTop / max : 0)
    }

    viewport.addEventListener("scroll", update, { passive: true })
    update()
    return () => viewport.removeEventListener("scroll", update)
  }, [])

  return (
    <div className="page-progress" aria-hidden="true">
      <div
        className="page-progress-bar"
        style={{ transform: `scaleX(${progress})` }}
      />
    </div>
  )
}

/**
 * 메인 애플리케이션 컴포넌트입니다.
 *
 * [자석 효과(Snap Scroll)]:
 * 한 화면(100dvh)에 하나의 페이지만 정확히 담기도록 섹션을 구성했습니다.
 * 내용이 많지 않은 섹션은 서로 묶어 한 페이지로 합쳤고,
 * 각 페이지는 여백이 남지 않도록 콘텐츠가 화면 높이를 가득 채웁니다.
 *
 * @returns {JSX.Element} 애플리케이션 화면
 */
function App() {
  const [donationModalOpen, setDonationModalOpen] = useState(false)

  return (
    <div className="background">
      {/* 배경 애니메이션 효과 (꽃잎 내리기) */}
      <BGEffect />

      {/* 현재 페이지 진행률 */}
      <PageProgress />

      {/* 자석 효과(Snap Scroll) 메인 뷰포트 컨테이너 */}
      <main className="snap-scroll-viewport">
        {/* 1. 메인 커버 섹션 */}
        <section id={SECTION_IDS.cover} className="snap-page-container">
          <Cover onOpenDonation={() => setDonationModalOpen(true)} />
        </section>

        {/* 2. 모시는 글 및 하객 요약 안내 */}
        <section id={SECTION_IDS.invitation} className="snap-page-container">
          <Invitation />
        </section>

        {/* 3. 웨딩 화보 갤러리 및 D-Day 카운트 (Our Moments) */}
        <section id={SECTION_IDS.weddingDay} className="snap-page-container">
          <WeddingDay />
        </section>

        {/* 4. 오시는 길 및 지도/교통편 안내 */}
        <section id={SECTION_IDS.location} className="snap-page-container">
          <Location />
        </section>
      </main>

      {/* 카카오톡 / 링크 공유 플로팅 버튼 */}
      <ShareButton />

      {/* 맨 위로 올라가기 버튼 (왼쪽 고정) */}
      <TopButton />

      {/* 축의금 계좌 안내 모달 (첫 페이지 목차에서 호출) */}
      <DonationModal
        open={donationModalOpen}
        onClose={() => setDonationModalOpen(false)}
      />
    </div>
  )
}

export default App
