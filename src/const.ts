import dayjs from "dayjs"
import utc from "dayjs/plugin/utc"
import timezone from "dayjs/plugin/timezone"
import "dayjs/locale/ko"

// dayjs 설정: UTC 및 타임존 플러그인 확장, 한국어 로캘 설정
dayjs.extend(utc)
dayjs.extend(timezone)
dayjs.locale("ko")

export { dayjs }

/**
 * 예식 일시 설정
 * 2027년 3월 13일 오후 3시 30분
 */
export const WEDDING_DATE = dayjs.tz("2027-03-13 15:30", "Asia/Seoul")

/**
 * 예식 일시 포맷
 * 분이 0이면 분을 생략하고, 그 외에는 표시합니다.
 * 예: 2027년 3월 13일 토요일 오후 3시 30분
 */
export const WEDDING_DATE_FORMAT = `YYYY년 MMMM D일 dddd A h시${WEDDING_DATE.minute() === 0 ? "" : " m분"}`

/**
 * 예식 당월 휴무일 (달력 표시용)
 * 2027년 3월 1일 삼일절
 */
export const HOLIDAYS = [1]

/**
 * 예식 장소 명칭
 */
export const LOCATION = "지타워컨벤션"

/**
 * 예식 장소 상세 주소
 */
export const LOCATION_ADDRESS = "서울시 구로구 디지털로26길 38 G-TOWER 2층"

/**
 * 카카오톡 공유 시 사용할 위치 정보 주소
 */
export const SHARE_ADDRESS = "서울시 구로구 디지털로26길 38"

/**
 * 카카오톡 공유 시 표시될 위치 제목
 */
export const SHARE_ADDRESS_TITLE = "지타워컨벤션 2층 (그랜드볼룸)"

/**
 * 지도 서비스(네이버, 카카오)에 사용할 좌표 [경도, 위도]
 * 서울 구로구 디지털로26길 38 (지타워)
 */
export const WEDDING_HALL_POSITION = [126.895318, 37.479848]

/**
 * 네이버 지도 장소 ID (NMAP_PLACE_ID)
 */
export const NMAP_PLACE_ID = 1170751996

/**
 * 카카오 지도 장소 ID (KMAP_PLACE_ID)
 */
export const KMAP_PLACE_ID = 766128031

// 신부 정보 설정
export const BRIDE_FULLNAME = "김소윤"
export const BRIDE_FIRSTNAME = "소윤"
export const BRIDE_TITLE = "장녀"
export const BRIDE_FATHER = "신부측 아버님"
export const BRIDE_MOTHER = "신부측 어머님"

/**
 * 신부측 연락처 및 계좌 정보 (추후 실제 정보로 교체)
 */
export const BRIDE_INFO = [
  {
    relation: "신부",
    name: BRIDE_FULLNAME,
    phone: "010-0000-0000",
    account: "신부 계좌번호 입력",
  },
  {
    relation: "신부 아버지",
    name: BRIDE_FATHER,
    phone: "010-0000-0000",
    account: "신부 아버지 계좌번호 입력",
  },
  {
    relation: "신부 어머니",
    name: BRIDE_MOTHER,
    phone: "010-0000-0000",
    account: "신부 어머니 계좌번호 입력",
  },
]

// 신랑 정보 설정
export const GROOM_FULLNAME = "변승환"
export const GROOM_FIRSTNAME = "승환"
export const GROOM_TITLE = "장남"
export const GROOM_FATHER = "신랑측 아버님"
export const GROOM_MOTHER = "신랑측 어머님"

/**
 * 신랑측 연락처 및 계좌 정보 (추후 실제 정보로 교체)
 */
export const GROOM_INFO = [
  {
    relation: "신랑",
    name: GROOM_FULLNAME,
    phone: "010-0000-0000",
    account: "신랑 계좌번호 입력",
  },
  {
    relation: "신랑 아버지",
    name: GROOM_FATHER,
    phone: "010-0000-0000",
    account: "신랑 아버지 계좌번호 입력",
  },
  {
    relation: "신랑 어머니",
    name: GROOM_MOTHER,
    phone: "010-0000-0000",
    account: "신랑 어머니 계좌번호 입력",
  },
]
