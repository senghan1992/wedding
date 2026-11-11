import {
  BRIDE_FULLNAME,
  BRIDE_INFO,
  BRIDE_FATHER,
  BRIDE_MOTHER,
  GROOM_FULLNAME,
  GROOM_INFO,
  GROOM_FATHER,
  GROOM_MOTHER,
  GROOM_TITLE,
  BRIDE_TITLE,
  LOCATION,
  WEDDING_DATE,
} from "../../const"
import { Modal } from "../modal"
import { Button } from "../button"
import { LazyDiv } from "../lazyDiv"
import PhoneIcon from "../../icons/phone-flip-icon.svg?react"
import EnvelopeIcon from "../../icons/envelope-icon.svg?react"
import { useState } from "react"

/**
 * 초대 메시지와 혼주 정보, 연락하기 기능을 제공하는 컴포넌트입니다.
 *
 * @returns {JSX.Element} 모시는 글 섹션
 */
export const Invitation = () => {
  const contactModalState = useState(false)
  return (
    <>
      <LazyDiv className="card invitation">
        <div className="invitation-top">
          <h2 className="english">Invitation</h2>

          {/* 초대 문구 헤드라인 */}
          <div className="invitation-headline">
            <span className="headline-names">
              {GROOM_FULLNAME} & {BRIDE_FULLNAME}
            </span>
            <span className="headline-date">
              {WEDDING_DATE.format("YYYY년 M월 D일 dddd")}
            </span>
          </div>

          {/* 정갈하고 compact한 초대 문구 */}
          <div className="invitation-text">
            <p>서로의 손을 잡고 평생을 함께할 약속을 합니다.</p>
            <p>비가 올 땐 우산이 되고</p>
            <p>바람 불 땐 품이 되어주며</p>
            <p>언제나 믿음직하고 따뜻한 부부로 살아가겠습니다.</p>
            <p className="highlight">저희의 첫걸음을 축복해 주시면 감사하겠습니다.</p>
          </div>

          {/* 혼주 및 신랑/신부 정보 */}
          <div className="name-block">
            <div className="name">
              {GROOM_FATHER} · {GROOM_MOTHER}
              <span className="relation">
                의 <span className="relation-name">{GROOM_TITLE}</span>
              </span>{" "}
              <span className="person-name">{GROOM_FULLNAME}</span>
            </div>
            <div className="name">
              {BRIDE_FATHER} · {BRIDE_MOTHER}
              <span className="relation">
                의 <span className="relation-name">{BRIDE_TITLE}</span>
              </span>{" "}
              <span className="person-name">{BRIDE_FULLNAME}</span>
            </div>
          </div>
        </div>

        <div className="invitation-bottom">
        {/* 하객이 한눈에 볼 수 있는 핵심 요약 */}
        <div className="fact-grid">
          <div className="fact-item">
            <span className="fact-label">DATE</span>
            <span className="fact-value">{WEDDING_DATE.format("YYYY. MM. DD")}</span>
            <span className="fact-note">{WEDDING_DATE.format("dddd")}</span>
          </div>
          <div className="fact-item">
            <span className="fact-label">TIME</span>
            <span className="fact-value">{WEDDING_DATE.format("A h시 m분")}</span>
            <span className="fact-note">식 30분 전부터 가능</span>
          </div>
          <div className="fact-item">
            <span className="fact-label">PLACE</span>
            <span className="fact-value">{LOCATION}</span>
            <span className="fact-note">G-TOWER 2층 그랜드볼룸</span>
          </div>
          <div className="fact-item">
            <span className="fact-label">PARKING</span>
            <span className="fact-value">2시간 무료</span>
            <span className="fact-note">지하주차장 1,400대</span>
          </div>
        </div>

        {/* 식사 안내 단정한 텍스트 문구 */}
        <p className="dining-guide-text">
          식사는 예식 30분 전부터 1층 연회장에서 가능합니다
        </p>

        <div className="btn-wrapper">
          <Button
            onClick={() => {
              contactModalState[1](true)
            }}
          >
            연락하기
          </Button>
        </div>
        </div>
      </LazyDiv>

      {/* 연락처 정보 모달 */}
      <Modal
        modalState={contactModalState}
        className="contact-modal"
        closeOnClickBackground={true}
      >
        <div className="header">
          <div className="title-group">
            <div className="title">축하 인사 전하기</div>
            <div className="subtitle">
              전화 또는 문자메시지로 따뜻한 축하를 전해보세요.
            </div>
          </div>
        </div>

        <div className="content">
          {/* 신랑측 연락처 */}
          <div className="contact-group">
            <div className="group-header">
              <span className="group-badge groom">신랑측</span>
            </div>
            <div className="contact-list">
              {GROOM_INFO.filter(({ phone }) => !!phone).map(
                ({ relation, name, phone }) => (
                  <div className="contact-item" key={relation}>
                    <div className="contact-person">
                      <span className="relation">{relation}</span>
                      <span className="person-name">{name}</span>
                    </div>
                    <div className="contact-actions">
                      <button
                        type="button"
                        className="action-btn call-btn"
                        onClick={() => {
                          window.open(`tel:${phone}`, "_self")
                        }}
                        aria-label={`${name}에게 전화 걸기`}
                      >
                        <PhoneIcon className="icon flip" />
                        <span className="action-text">전화</span>
                      </button>
                      <button
                        type="button"
                        className="action-btn sms-btn"
                        onClick={() => {
                          window.open(`sms:${phone}`, "_self")
                        }}
                        aria-label={`${name}에게 문자 보내기`}
                      >
                        <EnvelopeIcon className="icon" />
                        <span className="action-text">문자</span>
                      </button>
                    </div>
                  </div>
                ),
              )}
            </div>
          </div>

          <div className="contact-divider" />

          {/* 신부측 연락처 */}
          <div className="contact-group">
            <div className="group-header">
              <span className="group-badge bride">신부측</span>
            </div>
            <div className="contact-list">
              {BRIDE_INFO.filter(({ phone }) => !!phone).map(
                ({ relation, name, phone }) => (
                  <div className="contact-item" key={relation}>
                    <div className="contact-person">
                      <span className="relation">{relation}</span>
                      <span className="person-name">{name}</span>
                    </div>
                    <div className="contact-actions">
                      <button
                        type="button"
                        className="action-btn call-btn"
                        onClick={() => {
                          window.open(`tel:${phone}`, "_self")
                        }}
                        aria-label={`${name}에게 전화 걸기`}
                      >
                        <PhoneIcon className="icon flip" />
                        <span className="action-text">전화</span>
                      </button>
                      <button
                        type="button"
                        className="action-btn sms-btn"
                        onClick={() => {
                          window.open(`sms:${phone}`, "_self")
                        }}
                        aria-label={`${name}에게 문자 보내기`}
                      >
                        <EnvelopeIcon className="icon" />
                        <span className="action-text">문자</span>
                      </button>
                    </div>
                  </div>
                ),
              )}
            </div>
          </div>
        </div>

        <div className="footer">
          <Button
            buttonStyle="style1"
            className="contact-close-btn"
            onClick={() => contactModalState[1](false)}
          >
            닫기
          </Button>
        </div>
      </Modal>
    </>
  )
}
