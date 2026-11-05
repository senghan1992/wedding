import {
  BRIDE_FULLNAME,
  GROOM_FULLNAME,
  LOCATION,
  WEDDING_DATE,
  WEDDING_DATE_FORMAT,
} from "../../const"
import { COVER_IMAGE } from "../../images"
import { LazyDiv } from "../lazyDiv"
import "./index.scss"

const DAY_OF_WEEK = [
  "SUNDAY",
  "MONDAY",
  "TUESDAY",
  "WEDNESDAY",
  "THURSDAY",
  "FRIDAY",
  "SATURDAY",
]

/**
 * 초대장의 메인 커버 섹션입니다.
 */
export const Cover = () => {
  return (
    <LazyDiv className="card cover-editorial">
      {/* 상단 시네마틱 헤더 */}
      <div className="cover-header-tag">
        <span className="serif-eyebrow">WEDDING INVITATION</span>
        <div className="date-badge-row">
          <span className="date-num">{WEDDING_DATE.format("YYYY. MM. DD")}</span>
          <span className="dot">·</span>
          <span className="day-name">{DAY_OF_WEEK[WEDDING_DATE.day()]}</span>
        </div>
      </div>

      {/* 메인 커버 이미지 (시네마틱 프레임) */}
      <div className="cover-image-container">
        <img
          src={COVER_IMAGE}
          alt="변승환 ❤️ 김소윤 웨딩 커버 사진"
          className="main-cover-photo"
        />
        <div className="image-soft-gradient" />
      </div>

      {/* 하단 신랑 & 신부 타이틀 */}
      <div className="cover-bottom-info">
        <div className="names-row">
          <span className="name groom">{GROOM_FULLNAME}</span>
          <span className="and-symbol">&</span>
          <span className="name bride">{BRIDE_FULLNAME}</span>
        </div>

        <div className="schedule-box">
          <p className="full-date-text">
            {WEDDING_DATE.format("YYYY년 M월 D일 dddd A h시 m분")}
          </p>
          <p className="hall-text">{LOCATION} 2층 그랜드볼룸</p>
        </div>

        {/* 스크롤 다운 가이드 */}
        <div className="scroll-indicator">
          <span className="scroll-text">SCROLL</span>
          <div className="scroll-line" />
        </div>
      </div>
    </LazyDiv>
  )
}
