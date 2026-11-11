/* eslint-disable @typescript-eslint/no-explicit-any */

import { useContext, useEffect } from "react"
import { StoreContext } from "./context"
import { KAKAO_SDK_JS_KEY, NAVER_MAP_CLIENT_ID } from "../../env"

const baseUrl = import.meta.env.BASE_URL

// 네이버 지도 및 카카오 SDK를 로드하기 위한 외부 스크립트 URL (신규 네이버 Maps API 공식 규격: ncpKeyId)
const NAVER_MAP_URL = `https://oapi.map.naver.com/openapi/v3/maps.js?ncpKeyId=${NAVER_MAP_CLIENT_ID}`
const KAKAO_SDK_URL = `${baseUrl}/kakao_js_sdk/2.7.1/kakao.min.js`

/**
 * 네이버 지도 SDK를 로드하고 사용할 수 있게 해주는 Hook입니다.
 *
 * @returns {any} 네이버 지도 SDK 객체 (로딩 전에는 null)
 */
export const useNaver = () => {
  const { naver, setNaver } = useContext(StoreContext)
  useEffect(() => {
    // 클라이언트 ID가 없으면 중단
    if (!NAVER_MAP_CLIENT_ID) {
      return
    }

    // 이미 전역에 naver 객체가 존재하면 바로 설정
    if ((window as any).naver?.maps) {
      setNaver((window as any).naver)
      return
    }

    // 스크립트가 이미 DOM에 존재하면 load 이벤트 리스너 추가
    const existingScript = document.querySelector(
      `script[src*="oapi.map.naver.com"]`,
    ) as HTMLScriptElement | null

    if (existingScript) {
      const handleLoad = () => {
        if ((window as any).naver?.maps) {
          setNaver((window as any).naver)
        }
      }
      existingScript.addEventListener("load", handleLoad)
      return () => existingScript.removeEventListener("load", handleLoad)
    }

    // 스크립트가 없으면 새로 추가
    const script = document.createElement("script")
    script.src = NAVER_MAP_URL
    script.async = true
    script.addEventListener("load", () => {
      if ((window as any).naver?.maps) {
        setNaver((window as any).naver)
      }
    })
    script.addEventListener("error", (e) => {
      console.error("Failed to load Naver Map SDK:", e)
    })
    document.head.appendChild(script)
  }, [setNaver])

  return naver
}

/**
 * 카카오 SDK를 로드하고 사용할 수 있게 해주는 Hook입니다.
 *
 * @returns {any} 카카오 SDK 객체 (로딩 전에는 null)
 */
export const useKakao = () => {
  const { kakao, setKakao } = useContext(StoreContext)
  useEffect(() => {
    // SDK 키가 없으면 중단
    if (!KAKAO_SDK_JS_KEY) {
      return
    }

    // 스크립트가 아직 로드되지 않았으면 동적으로 추가
    if (!document.querySelector(`script[src="${KAKAO_SDK_URL}"]`)) {
      const script = document.createElement("script")
      script.addEventListener("load", () => {
        // 카카오 SDK 초기화
        if (!(window as any).Kakao.isInitialized()) {
          ;(window as any).Kakao.init(KAKAO_SDK_JS_KEY)
        }
        setKakao((window as any).Kakao)
      })
      script.src = KAKAO_SDK_URL
      document.head.appendChild(script)
    }
  }, [setKakao])

  return kakao
}
