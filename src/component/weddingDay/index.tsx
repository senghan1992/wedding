import { useRef, useState } from "react"
import { GALLERY_IMAGES } from "../../images"
import { LazyDiv } from "../lazyDiv"
import { Button } from "../button"
import { AllPhotosModal } from "../gallery"
import "./index.scss"

/**
 * Our Moments (웨딩 갤러리) 섹션입니다.
 * 두 사람의 웨딩 화보가 주인공이 되는 감성 갤러리 공간으로,
 * 사진을 여유롭고 몰입감 있게 감상할 수 있도록 구성했습니다.
 */
export const WeddingDay = () => {
  const [photoModalState, setPhotoModalState] = useState(false)
  const [currentIdx, setCurrentIdx] = useState(0)

  // 터치 제스처 & 실시간 드래그 애니메이션 상태
  const [dragOffset, setDragOffset] = useState(0)
  const [isDragging, setIsDragging] = useState(false)
  const touchStartRef = useRef<{ x: number; y: number } | null>(null)
  const isHorizontalSwipeRef = useRef<boolean | null>(null)
  const hasMovedRef = useRef(false)

  const nextPhoto = (e?: React.MouseEvent) => {
    e?.stopPropagation()
    setCurrentIdx((prev) => (prev + 1) % GALLERY_IMAGES.length)
  }

  const prevPhoto = (e?: React.MouseEvent) => {
    e?.stopPropagation()
    setCurrentIdx((prev) =>
      prev === 0 ? GALLERY_IMAGES.length - 1 : prev - 1,
    )
  }

  // 터치 인터랙션 핸들러
  const handleTouchStart = (e: React.TouchEvent) => {
    touchStartRef.current = {
      x: e.touches[0].clientX,
      y: e.touches[0].clientY,
    }
    isHorizontalSwipeRef.current = null
    hasMovedRef.current = false
    setIsDragging(true)
  }

  const handleTouchMove = (e: React.TouchEvent) => {
    if (!touchStartRef.current) return

    const currentX = e.touches[0].clientX
    const currentY = e.touches[0].clientY
    const deltaX = currentX - touchStartRef.current.x
    const deltaY = currentY - touchStartRef.current.y

    if (isHorizontalSwipeRef.current === null) {
      if (Math.abs(deltaX) > 6 || Math.abs(deltaY) > 6) {
        isHorizontalSwipeRef.current = Math.abs(deltaX) > Math.abs(deltaY)
      }
    }

    if (isHorizontalSwipeRef.current) {
      hasMovedRef.current = true
      let offset = deltaX
      const isAtFirst = currentIdx === 0 && deltaX > 0
      const isAtLast = currentIdx === GALLERY_IMAGES.length - 1 && deltaX < 0
      if (isAtFirst || isAtLast) {
        offset = deltaX * 0.3
      }
      setDragOffset(offset)
    }
  }

  const handleTouchEnd = () => {
    if (!touchStartRef.current) return

    if (isHorizontalSwipeRef.current) {
      if (dragOffset < -40) {
        nextPhoto()
      } else if (dragOffset > 40) {
        prevPhoto()
      }
    }

    setIsDragging(false)
    setDragOffset(0)
    touchStartRef.current = null
    isHorizontalSwipeRef.current = null
  }

  const handleCardClick = () => {
    if (hasMovedRef.current) {
      hasMovedRef.current = false
      return
    }
    setPhotoModalState(true)
  }

  return (
    <>
      <LazyDiv className="card wedding-moments-card">
        {/* 1. 상단 갤러리 헤더 */}
        <div className="moments-header">
          <span className="script-subtitle">Our Moments</span>
          <h2 className="moments-title">웨딩 갤러리</h2>
          <p className="moments-desc">
            함께 걸어갈 두 사람의 찬란한 순간들
          </p>
        </div>

        {/* 2. 대화면 웨딩 화보 쇼케이스 (매끄러운 슬라이딩 트랙) */}
        <div
          className="moments-photo-showcase"
          onTouchStart={handleTouchStart}
          onTouchMove={handleTouchMove}
          onTouchEnd={handleTouchEnd}
          onClick={handleCardClick}
          role="button"
          tabIndex={0}
          aria-label="사진 전체보기"
        >
          <div className="photo-card-frame">
            {/* 가로 슬라이딩 트랙 */}
            <div
              className={`photo-slide-track ${isDragging ? "dragging" : "smooth"}`}
              style={{
                transform: `translateX(calc(-${currentIdx * 100}% + ${dragOffset}px))`,
              }}
            >
              {GALLERY_IMAGES.map((img, idx) => {
                const isActive = idx === currentIdx
                return (
                  <div
                    key={idx}
                    className={`photo-slide-item ${isActive ? "active" : ""}`}
                    aria-hidden={!isActive}
                  >
                    <img
                      src={img}
                      alt={`웨딩 화보 ${idx + 1}`}
                      className="showcase-img"
                      draggable={false}
                    />
                  </div>
                )
              })}
            </div>

            {/* 좌우 넘김 버튼 */}
            {GALLERY_IMAGES.length > 1 && (
              <>
                <button
                  type="button"
                  className="photo-nav-btn prev"
                  onClick={prevPhoto}
                  aria-label="이전 사진 보기"
                >
                  ‹
                </button>
                <button
                  type="button"
                  className="photo-nav-btn next"
                  onClick={nextPhoto}
                  aria-label="다음 사진 보기"
                >
                  ›
                </button>
              </>
            )}

            {/* 하단 인디케이터 바 (프로그레스 바 & 카운터) */}
            <div
              className="photo-indicator-bar"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="photo-progress-track">
                <div
                  className="photo-progress-fill"
                  style={{
                    width: `${((currentIdx + 1) / GALLERY_IMAGES.length) * 100}%`,
                  }}
                />
              </div>
              <span className="count-pill">
                {currentIdx + 1} / {GALLERY_IMAGES.length}
              </span>
            </div>
          </div>
        </div>

        {/* 3. 하단 감성 문구 & 전체보기 버튼 */}
        <div className="moments-bottom">
          <p className="bottom-caption">
            &ldquo;가장 따뜻한 계절, 서로의 봄이 되어주겠습니다&rdquo;
          </p>

          <Button
            className="all-photo-btn"
            onClick={() => setPhotoModalState(true)}
          >
            사진 전체보기 ({GALLERY_IMAGES.length})
          </Button>
        </div>
      </LazyDiv>

      {/* 전체 사진 모아보기 모달 (모바일 바텀시트) */}
      <AllPhotosModal
        open={photoModalState}
        onClose={() => setPhotoModalState(false)}
      />
    </>
  )
}
