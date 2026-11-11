/* eslint-disable @typescript-eslint/no-explicit-any */
import { useState } from "react"
import {
  BRIDE_FULLNAME,
  GROOM_FULLNAME,
  LOCATION,
  WEDDING_DATE,
  WEDDING_DATE_FORMAT,
} from "../../const"
import ktalkIcon from "../../icons/ktalk-icon.png"
import { LazyDiv } from "../lazyDiv"
import { useKakao } from "../store"
import "./index.scss"

const baseUrl = import.meta.env.BASE_URL

/**
 * 카카오톡 초대장 공유 및 링크 공유 컴포넌트입니다.
 * 1) 카카오 SDK 사용 가능한 경우 카카오톡 공식 피드 카드로 공유
 * 2) 카카오 SDK 미지원 또는 오류 시 모바일 시스템 기본 공유(Web Share API)
 * 3) 미지원 환경에서는 클립보드에 초대장 링크를 즉시 복사하고 토스트 안내
 */
export const ShareButton = () => {
  const kakao = useKakao()
  const [toastMessage, setToastMessage] = useState<string | null>(null)

  const showToast = (msg: string) => {
    setToastMessage(msg)
    setTimeout(() => {
      setToastMessage(null)
    }, 3000)
  }

  const handleShare = async () => {
    const shareTitle = `${GROOM_FULLNAME} ❤️ ${BRIDE_FULLNAME}의 결혼식에 초대합니다.`
    const shareDesc = `${WEDDING_DATE.format(WEDDING_DATE_FORMAT)}\n${LOCATION} 2층 그랜드볼룸`
    const cleanBase = baseUrl.endsWith("/") ? baseUrl : `${baseUrl}/`
    const currentUrl = `${window.location.origin}${cleanBase}`
    const previewImgUrl = `${window.location.origin}${cleanBase}preview_image.png`

    // 1. 카카오 SDK가 정상 로드 및 초기화된 경우 카카오톡 피드 카드 전송
    if (kakao?.Share?.sendDefault) {
      try {
        kakao.Share.sendDefault({
          objectType: "feed",
          content: {
            title: shareTitle,
            description: shareDesc,
            imageUrl: previewImgUrl,
            link: {
              mobileWebUrl: currentUrl,
              webUrl: currentUrl,
            },
          },
          buttons: [
            {
              title: "모바일 청첩장 보기",
              link: {
                mobileWebUrl: currentUrl,
                webUrl: currentUrl,
              },
            },
            {
              title: "오시는 길 안내",
              link: {
                mobileWebUrl: `${currentUrl}#section-location`,
                webUrl: `${currentUrl}#section-location`,
              },
            },
          ],
        })
        return
      } catch (err) {
        console.warn("Kakao share failed, switching to fallback:", err)
      }
    }

    // 2. 모바일 Web Share API (시스템 기본 공유 창: 카카오톡, 메시지 등)
    if (navigator.share) {
      try {
        await navigator.share({
          title: shareTitle,
          text: `${shareTitle}\n${shareDesc}`,
          url: currentUrl,
        })
        return
      } catch (err: any) {
        if (err.name !== "AbortError") {
          console.warn("Web share failed:", err)
        } else {
          return
        }
      }
    }

    // 3. 최후 수단: 클립보드 URL 복사 및 토스트 피드백
    try {
      if (navigator.clipboard && window.isSecureContext) {
        await navigator.clipboard.writeText(currentUrl)
      } else {
        const textarea = document.createElement("textarea")
        textarea.value = currentUrl
        document.body.appendChild(textarea)
        textarea.select()
        document.execCommand("copy")
        document.body.removeChild(textarea)
      }
      showToast("청첩장 링크가 복사되었습니다! ✨")
    } catch {
      alert("링크 복사에 실패했습니다.")
    }
  }

  return (
    <>
      <LazyDiv className="footer share-button">
        <button
          type="button"
          className="ktalk-share"
          onClick={handleShare}
          aria-label="청첩장 공유하기"
        >
          <img src={ktalkIcon} alt="ktalk-icon" />
          <span>공유하기</span>
        </button>
      </LazyDiv>

      {/* 링크 복사 토스트 알림 */}
      {toastMessage && (
        <div className="share-toast" role="status">
          {toastMessage}
        </div>
      )}
    </>
  )
}
