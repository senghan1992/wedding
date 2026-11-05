import { LOCATION, LOCATION_ADDRESS, WEDDING_DATE } from "../const"

/**
 * 구글 캘린더 일정 등록 URL 생성
 */
export const getGoogleCalendarUrl = () => {
  const title = encodeURIComponent("변승환 ❤️ 김소윤 결혼식")
  // 2027-03-13 15:30 KST = 2027-03-13 06:30 UTC
  const startUtc = WEDDING_DATE.utc().format("YYYYMMDDTHHmmss[Z]")
  const endUtc = WEDDING_DATE.add(2, "hour").utc().format("YYYYMMDDTHHmmss[Z]")
  const details = encodeURIComponent(
    `변승환 ❤️ 김소윤의 결혼식에 소중한 분들을 모십니다.\n\n일시: 2027년 3월 13일 (토) 오후 3시 30분\n장소: ${LOCATION} (2층 그랜드볼룸)\n주소: ${LOCATION_ADDRESS}`,
  )
  const location = encodeURIComponent(`${LOCATION} (${LOCATION_ADDRESS})`)

  return `https://calendar.google.com/calendar/render?action=TEMPLATE&text=${title}&dates=${startUtc}/${endUtc}&details=${details}&location=${location}`
}

/**
 * 스마트폰 / PC용 iCalendar (.ics) 파일 다운로드 및 캘린더 앱 연동
 */
export const downloadIcsCalendar = () => {
  const startUtc = WEDDING_DATE.utc().format("YYYYMMDDTHHmmss[Z]")
  const endUtc = WEDDING_DATE.add(2, "hour").utc().format("YYYYMMDDTHHmmss[Z]")
  const nowUtc = new Date().toISOString().replace(/[-:]/g, "").split(".")[0] + "Z"

  const icsData = [
    "BEGIN:VCALENDAR",
    "VERSION:2.0",
    "PRODID:-//ByunAndKim//WeddingInvitation//KO",
    "CALSCALE:GREGORIAN",
    "METHOD:PUBLISH",
    "BEGIN:VEVENT",
    `UID:wedding-byun-kim-20270313-${Date.now()}@wedding`,
    `DTSTAMP:${nowUtc}`,
    `DTSTART:${startUtc}`,
    `DTEND:${endUtc}`,
    `SUMMARY:변승환 ❤️ 김소윤 결혼식`,
    `DESCRIPTION:변승환과 김소윤의 결혼식에 소중한 분들을 모십니다.\\n장소: ${LOCATION} 2층 그랜드볼룸\\n주소: ${LOCATION_ADDRESS}`,
    `LOCATION:${LOCATION} (${LOCATION_ADDRESS})`,
    "STATUS:CONFIRMED",
    "BEGIN:VALARM",
    "TRIGGER:-PT24H",
    "DESCRIPTION:변승환 김소윤 결혼식 하루 전 알림",
    "ACTION:DISPLAY",
    "END:VALARM",
    "BEGIN:VALARM",
    "TRIGGER:-PT2H",
    "DESCRIPTION:변승환 김소윤 결혼식 2시간 전 알림",
    "ACTION:DISPLAY",
    "END:VALARM",
    "END:VEVENT",
    "END:VCALENDAR",
  ].join("\r\n")

  const blob = new Blob([icsData], { type: "text/calendar;charset=utf-8" })
  const blobUrl = URL.createObjectURL(blob)

  const isIOS = /iPad|iPhone|iPod/.test(navigator.userAgent)

  if (isIOS) {
    // iOS Safari에서는 직접 링크 열기로 캘린더 등록 시트 호출
    window.location.href = blobUrl
  } else {
    const link = document.createElement("a")
    link.href = blobUrl
    link.setAttribute("download", "변승환_김소윤_결혼식.ics")
    document.body.appendChild(link)
    link.click()
    document.body.removeChild(link)
  }

  setTimeout(() => URL.revokeObjectURL(blobUrl), 10000)
}
