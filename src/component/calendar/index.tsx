import { useEffect, useMemo, useState } from "react"
import {
  BRIDE_FIRSTNAME,
  GROOM_FIRSTNAME,
  HOLIDAYS,
  LOCATION,
  WEDDING_DATE,
  WEDDING_DATE_FORMAT,
} from "../../const"
import { LazyDiv } from "../lazyDiv"
import { downloadIcsCalendar, getGoogleCalendarUrl } from "../../utils/calendar"

// 해당 월의 첫 번째 날의 요일과 총 일수를 계산합니다.
const firstDayOfWeek = WEDDING_DATE.startOf("month").day()
const daysInMonth = WEDDING_DATE.daysInMonth()

/**
 * 결혼식 날짜를 표시하는 달력과 디데이 카운트다운, 캘린더 연동 컴포넌트입니다.
 */
export const Calendar = () => {
  const [tsDiff, setTsDiff] = useState(WEDDING_DATE.diff())
  const [saveSuccess, setSaveSuccess] = useState(false)

  const dayDiff = useMemo(() => {
    const dayOffset = WEDDING_DATE.diff(WEDDING_DATE.startOf("day"))
    return Math.ceil((tsDiff - dayOffset) / 1000 / 60 / 60 / 24)
  }, [tsDiff])

  useEffect(() => {
    const interval = setInterval(() => {
      const diff = WEDDING_DATE.diff()
      setTsDiff(diff)
    }, 1000)

    return () => clearInterval(interval)
  }, [])

  const diffs = useMemo(() => {
    const tsDiff_ = Math.abs(tsDiff)
    const seconds = Math.floor((tsDiff_ % 60000) / 1000)
    const minutes = Math.floor((tsDiff_ % 3600000) / 60000)
    const hours = Math.floor((tsDiff_ % 86400000) / 3600000)
    const days = Math.floor(tsDiff_ / 86400000)
    const isAfter = tsDiff < 0

    return { days, hours, minutes, seconds, isAfter }
  }, [tsDiff])

  const handleIcsDownload = () => {
    downloadIcsCalendar()
    setSaveSuccess(true)
    setTimeout(() => setSaveSuccess(false), 3000)
  }

  return (
    <LazyDiv className="card calendar">
      <div className="section-header">
        <span className="script-title">The Wedding Day</span>
        <h3 className="wedding-date-heading">
          {WEDDING_DATE.format("YYYY년 M월 D일")}
        </h3>
        <p className="wedding-time-sub">토요일 오후 3시 30분 · {LOCATION}</p>
      </div>

      {/* 달력 영역 */}
      <div className="calendar-wrapper">
        <div className="head holiday">
          <span>Su</span>
        </div>
        <div className="head">
          <span>Mo</span>
        </div>
        <div className="head">
          <span>Tu</span>
        </div>
        <div className="head">
          <span>We</span>
        </div>
        <div className="head">
          <span>Th</span>
        </div>
        <div className="head">
          <span>Fr</span>
        </div>
        <div className="head">
          <span>Sa</span>
        </div>

        {/* 첫 주 빈 공간 채우기 */}
        {Array.from({ length: firstDayOfWeek }).map((_, i) => (
          <div key={`empty-${i}`} />
        ))}

        {/* 날짜 표시 */}
        {Array.from({ length: daysInMonth }).map((_, i) => {
          const date = i + 1
          const classes = []
          const isSunday = (i + firstDayOfWeek) % 7 === 0

          if (isSunday || HOLIDAYS.includes(date)) {
            classes.push("holiday")
          }

          const isWeddingDate = date === WEDDING_DATE.date()
          if (isWeddingDate) {
            classes.push("wedding-date")
          }

          return (
            <div
              key={`day-${i}`}
              className={classes.length ? classes.join(" ") : undefined}
            >
              <span>{date}</span>
              {isWeddingDate && <div className="heart" />}
            </div>
          )
        })}
      </div>

      {/* 실시간 D-Day 카운트다운 영역 */}
      <div className="countdown-wrapper">
        <div className="countdown-boxes">
          <div className="count-box">
            <span className="num">{diffs.days}</span>
            <span className="lbl">DAYS</span>
          </div>
          <span className="colon">:</span>
          <div className="count-box">
            <span className="num">
              {diffs.hours.toString().padStart(2, "0")}
            </span>
            <span className="lbl">HOURS</span>
          </div>
          <span className="colon">:</span>
          <div className="count-box">
            <span className="num">
              {diffs.minutes.toString().padStart(2, "0")}
            </span>
            <span className="lbl">MINS</span>
          </div>
          <span className="colon">:</span>
          <div className="count-box">
            <span className="num">
              {diffs.seconds.toString().padStart(2, "0")}
            </span>
            <span className="lbl">SECS</span>
          </div>
        </div>

        <div className="dday-message">
          <span className="couple-names">
            {GROOM_FIRSTNAME} & {BRIDE_FIRSTNAME}
          </span>
          의 특별한 날까지{" "}
          {dayDiff > 0 ? (
            <span className="highlight">{dayDiff}일</span>
          ) : dayDiff === 0 ? (
            <span className="highlight">오늘입니다!</span>
          ) : (
            <span>행복하게 잘 살고 있습니다!</span>
          )}
        </div>
      </div>

      {/* 캘린더 등록 액션 바 */}
      <div className="calendar-actions">
        <button className="cal-btn ics-btn" onClick={handleIcsDownload}>
          <span className="icon">🗓️</span>
          <span>폰 캘린더에 일정 저장</span>
        </button>
        <a
          href={getGoogleCalendarUrl()}
          target="_blank"
          rel="noopener noreferrer"
          className="cal-btn google-btn"
        >
          <span className="icon">📅</span>
          <span>Google 캘린더</span>
        </a>
      </div>

      {saveSuccess && (
        <div className="toast-notice">
          캘린더 파일이 다운로드되었습니다. 열어서 바로 저장해보세요! ✨
        </div>
      )}
    </LazyDiv>
  )
}
