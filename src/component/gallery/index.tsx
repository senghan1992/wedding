import { useCallback, useEffect, useMemo, useRef, useState } from "react"
import ArrowLeft from "../../icons/angle-left-sm.svg?react"
import { LazyDiv } from "../lazyDiv"
import { Button } from "../button"
import { Modal } from "../modal"
import { GALLERY_IMAGES } from "../../images"

/**
 * 캐러셀 아이템 요소 생성
 */
const CAROUSEL_ITEMS = GALLERY_IMAGES.map((item, idx) => (
  <div className="carousel-item" key={idx}>
    <img src={item} draggable={false} alt={`${idx}`} />
  </div>
))

// 드래그 감도 설정
const DRAG_SENSITIVITY = 15

/**
 * 캐러셀 상태 타입 정의
 */
type Status =
  | "stationary"
  | "clicked"
  | "clickCanceled"
  | "dragging"
  | "dragEnding"
  | "moving-left"
  | "moving-right"

/**
 * 드래그 옵션 타입 정의
 */
type DragOption = {
  startingClientX: number
  startingClientY: number
  currentTranslateX: number
}

type ClickMove = "left" | "right" | null

/**
 * 갤러리 컴포넌트입니다.
 * 사진 캐러셀 기능과 전체 사진 보기 모달 기능을 제공합니다.
 * 터치 및 마우스 드래그를 지원합니다.
 *
 * @returns {JSX.Element} 갤러리 섹션
 */
export const Gallery = () => {
  const modalState = useState(false)
  const [selectedDetailIdx, setSelectedDetailIdx] = useState<number | null>(null)
  const touchStartXRef = useRef<number | null>(null)
  const carouselRef = useRef<HTMLDivElement>({} as HTMLDivElement)

  const handleDetailTouchStart = (e: React.TouchEvent) => {
    touchStartXRef.current = e.touches[0].clientX
  }

  const handleDetailTouchEnd = (e: React.TouchEvent) => {
    if (touchStartXRef.current === null || selectedDetailIdx === null) return
    const touchEndX = e.changedTouches[0].clientX
    const diff = touchEndX - touchStartXRef.current
    if (diff > 40) {
      // 오른쪽으로 스와이프: 이전 사진
      setSelectedDetailIdx((prev) =>
        prev !== null ? (prev === 0 ? GALLERY_IMAGES.length - 1 : prev - 1) : null,
      )
    } else if (diff < -40) {
      // 왼쪽으로 스와이프: 다음 사진
      setSelectedDetailIdx((prev) =>
        prev !== null ? (prev === GALLERY_IMAGES.length - 1 ? 0 : prev + 1) : null,
      )
    }
    touchStartXRef.current = null
  }

  useEffect(() => {
    // 이미지 프리로드 (Preload)
    GALLERY_IMAGES.forEach((image) => {
      const img = new Image()
      img.src = image
    })
  }, [])

  // 슬라이드 인덱스 상태
  const [slide, _setSlide] = useState(0)
  const slideRef = useRef(0)
  const setSlide = (slide: number) => {
    _setSlide(slide)
    slideRef.current = slide
  }

  // 캐러셀 동작 상태
  const [status, _setStatus] = useState<Status>("stationary")
  const statusRef = useRef<Status>("stationary")
  const setStatus = (status: Status) => {
    _setStatus(status)
    statusRef.current = status
  }

  // 드래그 정보 상태
  const [dragOption, _setDragOption] = useState<DragOption>({
    startingClientX: 0,
    startingClientY: 0,
    currentTranslateX: 0,
  })
  const dragOptionRef = useRef<DragOption>({
    startingClientX: 0,
    startingClientY: 0,
    currentTranslateX: 0,
  })
  const setDragOption = (dragOption: DragOption) => {
    _setDragOption(dragOption)
    dragOptionRef.current = dragOption
  }

  const [moveOption, setMoveOption] = useState({
    srcIdx: 0,
    dstIdx: 0,
  })

  const clickMoveRef = useRef<ClickMove>(null)
  const setClickMove = (clickMove: ClickMove) => {
    clickMoveRef.current = clickMove
  }

  /**
   * 마우스/터치 다운 이벤트 처리
   */
  const click = (
    status: Status,
    clientX: number,
    clientY: number,
    carouselWidth: number,
  ) => {
    if (status !== "stationary") return
    setDragOption({
      startingClientX: clientX,
      startingClientY: clientY,
      currentTranslateX: -carouselWidth,
    })
    setStatus("clicked")
  }

  /**
   * 드래그 중 처리
   */
  const dragging = useCallback(
    (dragOption: DragOption, clientX: number, carouselWidth: number) => {
      let moveTranslateX = clientX - dragOption.startingClientX

      // 드래그 범위 제한
      if (moveTranslateX > carouselWidth) {
        moveTranslateX = carouselWidth
      } else if (moveTranslateX < -carouselWidth) {
        moveTranslateX = -carouselWidth
      }

      setDragOption({
        ...dragOption,
        currentTranslateX: moveTranslateX - carouselWidth,
      })
    },
    [],
  )

  /**
   * 드래그 종료 시 슬라이드 이동 결정 및 애니메이션 처리
   */
  const dragEnd = useCallback(
    (slide: number, dragOption: DragOption, carouselWidth: number) => {
      let move = 0
      // 10% 이상 드래그했을 때 다음/이전 슬라이드로 이동
      if (dragOption.currentTranslateX < -carouselWidth * 1.1) {
        move = 1
      } else if (dragOption.currentTranslateX > -carouselWidth * 0.9) {
        move = -1
      }

      setDragOption({
        ...dragOption,
        currentTranslateX: -carouselWidth * (move + 1),
      })

      setStatus("dragEnding")

      setTimeout(() => {
        setDragOption({
          ...dragOption,
          currentTranslateX: -carouselWidth,
        })
        setStatus("stationary")
        setSlide((slide + move + CAROUSEL_ITEMS.length) % CAROUSEL_ITEMS.length)
      }, 300)
    },
    [],
  )

  /**
   * 버튼 클릭 등에 의한 슬라이드 이동 처리
   */
  const move = useCallback((srcIdx: number, dstIdx: number) => {
    setSlide(dstIdx)
    if (srcIdx < dstIdx) {
      setStatus("moving-right")
    } else {
      setStatus("moving-left")
    }

    setMoveOption({ srcIdx, dstIdx })

    setTimeout(() => {
      setClickMove(null)
      setStatus("stationary")
    }, 300)
  }, [])

  /* 이벤트 핸들러 */
  const onMouseMove = useCallback(
    (e: MouseEvent) => {
      const status = statusRef.current

      if (status === "clicked") {
        setStatus("dragging")
      } else if (status === "dragging") {
        e.preventDefault()
        dragging(
          dragOptionRef.current,
          e.clientX,
          carouselRef.current.clientWidth,
        )
      }
    },
    [dragging],
  )

  const onTouchMove = useCallback(
    (e: TouchEvent) => {
      const status = statusRef.current

      if (status === "clicked") {
        e.preventDefault()
        const xMove =
          e.targetTouches[0].clientX - dragOptionRef.current.startingClientX
        const yMove =
          e.targetTouches[0].clientY - dragOptionRef.current.startingClientY
        // 일정 거리 이상 움직였을 때만 드래그로 간주
        if (Math.abs(xMove) > DRAG_SENSITIVITY) {
          setStatus("dragging")
        } else if (Math.abs(yMove) > DRAG_SENSITIVITY) {
          setStatus("clickCanceled")
        }
      } else if (status === "dragging") {
        e.preventDefault()
        dragging(
          dragOptionRef.current,
          e.targetTouches[0].clientX,
          carouselRef.current.clientWidth,
        )
      }
    },
    [dragging],
  )

  const onMouseTouchUp = useCallback(() => {
    const status = statusRef.current
    const clickMove = clickMoveRef.current
    const slide = slideRef.current

    if (status === "clicked") {
      if (clickMove === "left") {
        move(slide, (slide + CAROUSEL_ITEMS.length - 1) % CAROUSEL_ITEMS.length)
      } else if (clickMove === "right") {
        move(slide, (slide + 1) % CAROUSEL_ITEMS.length)
      } else {
        setStatus("stationary")
      }
    } else if (status === "dragging") {
      dragEnd(slide, dragOptionRef.current, carouselRef.current.clientWidth)
    } else if (status === "clickCanceled") {
      setStatus("stationary")
    }
  }, [dragEnd, move])

  useEffect(() => {
    const carouselElement = carouselRef.current

    window.addEventListener("mousemove", onMouseMove)
    carouselElement.addEventListener("touchmove", onTouchMove)
    window.addEventListener("mouseup", onMouseTouchUp)
    window.addEventListener("touchend", onMouseTouchUp)
    return () => {
      window.removeEventListener("mousemove", onMouseMove)
      carouselElement.removeEventListener("touchmove", onTouchMove)
      window.removeEventListener("mouseup", onMouseTouchUp)
      window.removeEventListener("touchend", onMouseTouchUp)
    }
  }, [onMouseMove, onTouchMove, onMouseTouchUp])

  /**
   * 인디케이터 클릭 시 해당 슬라이드로 이동
   */
  const onIndicatorClick = useCallback(
    (status: Status, srcIdx: number, dstIdx: number) => {
      if (status !== "stationary" || srcIdx === dstIdx) return
      move(srcIdx, dstIdx)
    },
    [move],
  )

  const transformStyle = useMemo(() => {
    switch (status) {
      case "dragging":
      case "dragEnding":
        return { transform: `translateX(${dragOption.currentTranslateX}px)` }
      default:
        return {}
    }
  }, [status, dragOption])

  const transformClass = useMemo(() => {
    const className = "carousel-list"
    switch (status) {
      case "dragEnding":
        return className + " transitioning"
      case "moving-left":
        return className + " moving-left"
      case "moving-right":
        return className + " moving-right"
      default:
        return className
    }
  }, [status])

  return (
    <>
      <LazyDiv className="card gallery">
        <h2 className="english">Gallery</h2>
        <div className="carousel-wrapper">
          <div
            className="carousel"
            ref={carouselRef}
            onMouseDown={(e) =>
              click(
                statusRef.current,
                e.clientX,
                e.clientY,
                e.currentTarget.clientWidth,
              )
            }
            onTouchStart={(e) =>
              click(
                statusRef.current,
                e.targetTouches[0].clientX,
                e.targetTouches[0].clientY,
                e.currentTarget.clientWidth,
              )
            }
          >
            <div className={transformClass} style={transformStyle}>
              {/* 무한 캐러셀을 위한 슬라이드 구성 */}
              {["dragging", "dragEnding"].includes(status) && [
                ...(slide === 0
                  ? [CAROUSEL_ITEMS[CAROUSEL_ITEMS.length - 1]]
                  : []),
                ...CAROUSEL_ITEMS.slice(slide === 0 ? 0 : slide - 1, slide + 2),
                ...(slide === CAROUSEL_ITEMS.length - 1
                  ? [CAROUSEL_ITEMS[0]]
                  : []),
              ]}
              {status === "moving-right" &&
                CAROUSEL_ITEMS.slice(moveOption.srcIdx, moveOption.dstIdx + 1)}
              {status === "moving-left" &&
                CAROUSEL_ITEMS.slice(moveOption.dstIdx, moveOption.srcIdx + 1)}
              {["stationary", "clicked", "clickCanceled"].includes(status) &&
                CAROUSEL_ITEMS[slide]}
            </div>

            {/* 좌우 화살표 컨트롤 */}
            <div className="carousel-control">
              <div
                className="control left"
                onMouseDown={() => {
                  if (statusRef.current === "stationary") setClickMove("left")
                }}
                onTouchStart={() => {
                  if (statusRef.current === "stationary") setClickMove("left")
                }}
              >
                <ArrowLeft className="arrow" />
              </div>
              <div
                className="control right"
                onMouseDown={() => {
                  if (statusRef.current === "stationary") setClickMove("right")
                }}
                onTouchStart={() => {
                  if (statusRef.current === "stationary") setClickMove("right")
                }}
              >
                <ArrowLeft className="arrow right" />
              </div>
            </div>
          </div>

          {/* 하단 인디케이터 (점) */}
          <div className="carousel-indicator">
            {CAROUSEL_ITEMS.map((_, idx) => (
              <button
                key={idx}
                className={`indicator${idx === slide ? " active" : ""}`}
                onClick={() =>
                  onIndicatorClick(statusRef.current, slideRef.current, idx)
                }
              />
            ))}
          </div>
        </div>

        <div className="break" />

        <Button onClick={() => modalState[1](true)}>사진 전체보기</Button>
      </LazyDiv>

      {/* 모바일 최적화 사진 전체보기 모달 */}
      <Modal
        modalState={modalState}
        className="all-photo-modal"
        closeOnClickBackground={true}
        showCloseButton={false}
      >
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
                  사진 전체보기 <span className="count-badge">{GALLERY_IMAGES.length}</span>
                </span>
              </div>
              <button
                className="modal-icon-btn close-btn"
                onClick={() => {
                  modalState[1](false)
                  setSelectedDetailIdx(null)
                }}
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
                onClick={() => {
                  modalState[1](false)
                  setSelectedDetailIdx(null)
                }}
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

                {/* 이전/다음 네비게이션 버튼 (화면 터치 외 직관적 버튼 제공) */}
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
                    className={`thumb-btn ${idx === selectedDetailIdx ? "active" : ""}`}
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
            <button
              className="full-close-btn"
              onClick={() => {
                modalState[1](false)
                setSelectedDetailIdx(null)
              }}
            >
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
    </>
  )
}
