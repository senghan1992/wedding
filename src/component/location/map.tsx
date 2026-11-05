import { useEffect, useState, useRef } from "react"
import { useKakao, useNaver } from "../store"
import nmapIcon from "../../icons/nmap-icon.png"
import knaviIcon from "../../icons/knavi-icon.png"
import tmapIcon from "../../icons/tmap-icon.png"
import LockIcon from "../../icons/lock-icon.svg?react"
import UnlockIcon from "../../icons/unlock-icon.svg?react"
import MarkerIcon from "../../icons/marker-icon.svg?react"
import {
  LOCATION,
  LOCATION_ADDRESS,
  WEDDING_HALL_POSITION,
} from "../../const"
import { NAVER_MAP_CLIENT_ID } from "../../env"

/**
 * 지도를 표시하고 길찾기 앱(네이버, 카카오, 티맵) 연동 기능을 제공하는 컴포넌트입니다.
 *
 * @returns {JSX.Element} 지도 컴포넌트
 */
export const Map = () => {
  const kakao = useKakao()

  const checkDevice = () => {
    const userAgent = window.navigator.userAgent
    if (userAgent.match(/(iPhone|iPod|iPad)/)) {
      return "ios"
    } else if (userAgent.match(/(Android)/)) {
      return "android"
    } else {
      return "other"
    }
  }

  return (
    <>
      {NAVER_MAP_CLIENT_ID ? (
        <NaverMap />
      ) : (
        <div
          className="map-wrapper"
          style={{
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            justifyContent: "center",
            background: "#f8f9fa",
            border: "1px solid #eee",
            borderRadius: "8px",
            height: "220px",
            color: "#666",
            gap: "8px",
            textAlign: "center",
            padding: "20px",
          }}
        >
          <MarkerIcon style={{ width: "32px", height: "32px", fill: "#c49a6c" }} />
          <div style={{ fontWeight: 600, fontSize: "1.05rem", color: "#333" }}>
            {LOCATION}
          </div>
          <div style={{ fontSize: "0.85rem", color: "#777" }}>
            {LOCATION_ADDRESS}
          </div>
        </div>
      )}

      {/* 내비게이션 앱 연결 버튼 모음 */}
      <div className="navigation">
        {/* 네이버 지도 연동 */}
        <button
          onClick={() => {
            const isMobile = checkDevice() !== "other"
            if (isMobile) {
              window.open(
                `nmap://search?query=${encodeURIComponent(LOCATION)}&appname=wedding`,
                "_self",
              )
              setTimeout(() => {
                window.open(
                  `https://map.naver.com/p/search/${encodeURIComponent(LOCATION)}`,
                  "_blank",
                )
              }, 1000)
            } else {
              window.open(
                `https://map.naver.com/p/search/${encodeURIComponent(LOCATION)}`,
                "_blank",
              )
            }
          }}
        >
          <img src={nmapIcon} alt="naver-map-icon" />
          네이버 지도
        </button>

        {/* 카카오 내비/지도 연동 */}
        <button
          onClick={() => {
            const isMobile = checkDevice() !== "other"
            if (isMobile && kakao?.Navi) {
              kakao.Navi.start({
                name: LOCATION,
                x: WEDDING_HALL_POSITION[0],
                y: WEDDING_HALL_POSITION[1],
                coordType: "wgs84",
              })
            } else {
              window.open(
                `https://map.kakao.com/link/search/${encodeURIComponent(LOCATION)}`,
                "_blank",
              )
            }
          }}
        >
          <img src={knaviIcon} alt="kakao-navi-icon" />
          카카오 내비
        </button>

        {/* 티맵 연동 */}
        <button
          onClick={() => {
            const isMobile = checkDevice() !== "other"
            if (isMobile) {
              const params = new URLSearchParams({
                goalx: WEDDING_HALL_POSITION[0].toString(),
                goaly: WEDDING_HALL_POSITION[1].toString(),
                goalName: LOCATION,
              })
              window.open(`tmap://route?${params.toString()}`, "_self")
            } else {
              alert("모바일 기기에서 앱으로 바로 연결됩니다.")
            }
          }}
        >
          <img src={tmapIcon} alt="t-map-icon" />
          티맵
        </button>
      </div>
    </>
  )
}

/**
 * 네이버 지도를 실제로 렌더링하는 내부 컴포넌트입니다.
 */
const NaverMap = () => {
  const naver = useNaver()
  const ref = useRef<HTMLDivElement>(null)

  // 모바일에서 스크롤 중 지도가 조작되는 것을 방지하기 위한 잠금 상태
  const [locked, setLocked] = useState(true)
  const [showLockMessage, setShowLockMessage] = useState(false)
  const lockMessageTimeout = useRef<number | null>(null)

  useEffect(() => {
    // 네이버 지도 SDK가 로드되면 지도를 초기화합니다.
    if (naver && ref.current) {
      const map = new naver.maps.Map(ref.current, {
        center: new naver.maps.LatLng(
          WEDDING_HALL_POSITION[1],
          WEDDING_HALL_POSITION[0],
        ),
        zoom: 17,
      })

      // 마커 추가
      new naver.maps.Marker({
        position: new naver.maps.LatLng(
          WEDDING_HALL_POSITION[1],
          WEDDING_HALL_POSITION[0],
        ),
        map,
      })

      return () => {
        map.destroy()
      }
    }
  }, [naver])

  return (
    <div className="map-wrapper">
      {/* 잠금 상태일 때 오버레이 표시 */}
      {locked && (
        <div
          className="lock"
          onTouchStart={() => {
            setShowLockMessage(true)
            if (lockMessageTimeout.current !== null) {
              clearTimeout(lockMessageTimeout.current)
            }
            lockMessageTimeout.current = window.setTimeout(
              () => setShowLockMessage(false),
              3000,
            )
          }}
          onMouseDown={() => {
            setShowLockMessage(true)
            if (lockMessageTimeout.current !== null) {
              clearTimeout(lockMessageTimeout.current)
            }
            lockMessageTimeout.current = window.setTimeout(
              () => setShowLockMessage(false),
              3000,
            )
          }}
        >
          {showLockMessage && (
            <div className="lock-message">
              <LockIcon /> 자물쇠 버튼을 눌러
              <br />
              터치 잠금 해제 후 확대 및 이동해 주세요.
            </div>
          )}
        </div>
      )}

      {/* 잠금 해제 버튼 */}
      <button
        className={"lock-button" + (locked ? "" : " unlocked")}
        onClick={() => {
          if (lockMessageTimeout.current !== null) {
            clearTimeout(lockMessageTimeout.current)
          }
          setShowLockMessage(false)
          setLocked((locked) => !locked)
        }}
      >
        {locked ? <LockIcon /> : <UnlockIcon />}
      </button>

      {/* 지도가 렌더링될 실제 요소 */}
      <div className="map-inner" ref={ref}></div>
    </div>
  )
}
