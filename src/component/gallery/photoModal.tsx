import { useState } from "react"
import { Modal } from "../modal"
import { GALLERY_IMAGES } from "../../images"

/**
 * 전체 사진 보기 모달 컴포넌트입니다.
 * 그리드 목록에서 사진을 선택하면 상세 뷰어로 전환되고,
 * 상세 뷰어에서는 좌우 화살표 또는 스와이프로 사진을 넘길 수 있습니다.
 *
 * @param {boolean} open - 모달 열림 여부
 * @param {() => void} onClose - 모달 닫기 핸들러
 * @returns {JSX.Element} 전체 사진 보기 모달
 */
export const AllPhotosModal = ({
  open,
  onClose,
}: {
  open: boolean
  onClose: () => void
}) => {
  const [selectedDetailIdx, setSelectedDetailIdx] = useState<number | null>(null)
  const [touchStartX, setTouchStartX] = useState<number | null>(null)

  const closeModal = () => {
    onClose()
    setSelectedDetailIdx(null)
  }

  /**
   * 상세 뷰어에서 스와이프 거리 계산
   */
  const handleDetailTouchStart = (e: React.TouchEvent) => {
    setTouchStartX(e.touches[0].clientX)
  }

  const handleDetailTouchEnd = (e: React.TouchEvent) => {
    if (touchStartX === null || selectedDetailIdx === null) return
    const touchEndX = e.changedTouches[0].clientX
    const diff = touchEndX - touchStartX
    if (diff > 40) {
      // 오른쪽으로 스와이프: 이전 사진
      setSelectedDetailIdx((prev) =>
        prev !== null
          ? prev === 0
            ? GALLERY_IMAGES.length - 1
            : prev - 1
          : null,
      )
    } else if (diff < -40) {
      // 왼쪽으로 스와이프: 다음 사진
      setSelectedDetailIdx((prev) =>
        prev !== null
          ? prev === GALLERY_IMAGES.length - 1
            ? 0
            : prev + 1
          : null,
      )
    }
    setTouchStartX(null)
  }

  return (
    <Modal
      modalState={[open, () => onClose()]}
      className="all-photo-modal"
      closeOnClickBackground={true}
      showCloseButton={false}
    >
      {/* 모바일 최적화 사진 전체보기 모달 */}
      {/* 모바일 바텀시트 상단 핸들 바 */}
      <div className="sheet-handle-bar">
        <div className="sheet-handle" />
      </div>

      {/* 모달 헤더 바 */}
      <div className="modal-header-bar">
        {selectedDetailIdx === null ? (
          <>
            <div className="header-title-group">
              <span className="subtitle">WEDDING GALLERY</span>
              <span className="main-title">
                사진 전체보기{" "}
                <span className="count-badge">{GALLERY_IMAGES.length}</span>
              </span>
            </div>
            <button
              className="modal-icon-btn close-btn"
              onClick={closeModal}
              aria-label="닫기"
            >
              ✕
            </button>
          </>
        ) : (
          <>
            <button
              className="modal-icon-btn back-btn"
              onClick={() => setSelectedDetailIdx(null)}
            >
              ← 목록
            </button>
            <div className="detail-counter">
              {selectedDetailIdx + 1} / {GALLERY_IMAGES.length}
            </div>
            <button
              className="modal-icon-btn close-btn"
              onClick={closeModal}
              aria-label="닫기"
            >
              ✕
            </button>
          </>
        )}
      </div>

      {/* 모달 콘텐츠 영역 */}
      <div className="modal-body-content">
        {selectedDetailIdx === null ? (
          /* 1. 모바일 2열 그리드 뷰 */
          <div className="grid-view-container">
            <div className="photo-grid">
              {GALLERY_IMAGES.map((image, idx) => (
                <div
                  key={idx}
                  className="grid-item-card"
                  onClick={() => setSelectedDetailIdx(idx)}
                >
                  <img
                    src={image}
                    alt={`웨딩 사진 ${idx + 1}`}
                    loading="lazy"
                  />
                  <div className="item-overlay">
                    <span className="zoom-hint">크게 보기</span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        ) : (
          /* 2. 풀스크린 상세 뷰어 (스와이프 지원) */
          <div
            className="detail-view-container"
            onTouchStart={handleDetailTouchStart}
            onTouchEnd={handleDetailTouchEnd}
          >
            <div className="detail-image-wrapper">
              <img
                src={GALLERY_IMAGES[selectedDetailIdx]}
                alt={`웨딩 사진 ${selectedDetailIdx + 1}`}
                draggable={false}
              />

              {/* 이전/다음 네비게이션 버튼 */}
              {GALLERY_IMAGES.length > 1 && (
                <>
                  <button
                    className="nav-arrow prev"
                    onClick={() =>
                      setSelectedDetailIdx((prev) =>
                        prev !== null
                          ? prev === 0
                            ? GALLERY_IMAGES.length - 1
                            : prev - 1
                          : null,
                      )
                    }
                    aria-label="이전 사진"
                  >
                    ‹
                  </button>
                  <button
                    className="nav-arrow next"
                    onClick={() =>
                      setSelectedDetailIdx((prev) =>
                        prev !== null
                          ? prev === GALLERY_IMAGES.length - 1
                            ? 0
                            : prev + 1
                          : null,
                      )
                    }
                    aria-label="다음 사진"
                  >
                    ›
                  </button>
                </>
              )}
            </div>

            {/* 하단 미니 썸네일 스트립 */}
            <div className="thumb-strip-scroll">
              {GALLERY_IMAGES.map((image, idx) => (
                <button
                  key={idx}
                  className={`thumb-btn${activeClass(idx, selectedDetailIdx)}`}
                  onClick={() => setSelectedDetailIdx(idx)}
                >
                  <img src={image} alt={`썸네일 ${idx + 1}`} />
                </button>
              ))}
            </div>
          </div>
        )}
      </div>

      {/* 모달 하단 푸터 바 */}
      <div className="modal-footer-bar">
        {selectedDetailIdx === null ? (
          <button className="full-close-btn" onClick={closeModal}>
            닫기
          </button>
        ) : (
          <button
            className="full-close-btn return-grid-btn"
            onClick={() => setSelectedDetailIdx(null)}
          >
            전체 목록 보기
          </button>
        )}
      </div>
    </Modal>
  )
}

/**
 * 썸네일 활성 상태 클래스 계산
 */
const activeClass = (idx: number, selected: number | null) =>
  idx === selected ? " active" : ""
