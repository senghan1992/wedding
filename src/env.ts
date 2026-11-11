/**
 * 네이버 지도 클라이언트 ID
 * .env 파일 또는 배포 환경 변수에서 가져오며, 미지정 시 기본 클라이언트 ID를 사용합니다.
 */
export const NAVER_MAP_CLIENT_ID =
  import.meta.env.VITE_NAVER_MAP_CLIENT_ID || "0aeu3bz3u7"

/**
 * 카카오 SDK 자바스크립트 키
 * .env 파일 또는 배포 환경 변수에서 가져옵니다.
 */
export const KAKAO_SDK_JS_KEY =
  import.meta.env.VITE_KAKAO_SDK_JS_KEY || ""

/**
 * 백엔드 서버 URL (방명록 기능 등에 사용)
 * .env 파일의 VITE_SERVER_URL에서 가져옵니다.
 */
export const SERVER_URL =
  import.meta.env.VITE_SERVER_URL || ""

/**
 * 정적 페이지 모드 여부
 * true일 경우 서버 연동 기능이 비활성화됩니다.
 */
export const STATIC_ONLY =
  import.meta.env.VITE_STATIC_ONLY === "true" || !SERVER_URL
