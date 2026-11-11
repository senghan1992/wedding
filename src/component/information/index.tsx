import { GROOM_FULLNAME, BRIDE_FULLNAME } from "../../const"
import { LazyDiv } from "../lazyDiv"
import { Button } from "../button"
import "./index.scss"

/**
 * 예식 및 하객 안내 섹션입니다.
 * 계좌번호가 화면에 대놓고 노출되지 않도록 단정한 버튼을 눌렀을 때만 모달로 안내하며,
 * 식사 안내와 정중한 감사 인사를 여유로운 레이아웃으로 담았습니다.
 */
export const Information = ({
  onOpenDonation,
}: {
  onOpenDonation?: () => void
}) => {
  return (
    <LazyDiv className="card information-page-card">
      {/* 1. 상단 섹션 타이틀 */}
      <div className="info-header">
        <span className="script-subtitle">Information</span>
        <h2 className="info-main-title">예식 및 하객 안내</h2>
        <p className="info-sub-desc">
          소중한 발걸음 해주시는 분들을 위한 안내사항입니다.
        </p>
      </div>

      {/* 2. 식사 안내 카드 (식 30분 전부터 가능 표기) */}
      <div className="dining-guide-card">
        <div className="dining-card-header">
          <span className="dining-eyebrow">RECEPTION & DINING</span>
          <h3 className="dining-main-title">식사 및 연회 안내</h3>
        </div>

        <div className="dining-fact-grid">
          <div className="dining-fact-item">
            <span className="fact-label">식사 시간</span>
            <span className="fact-value">식 30분 전부터</span>
            <span className="fact-sub">여유롭게 식사 가능</span>
          </div>
          <div className="dining-fact-item">
            <span className="fact-label">연회 장소</span>
            <span className="fact-value highlight">G-TOWER 1층</span>
            <span className="fact-sub">2층 본식 후 이동</span>
          </div>
        </div>

        <p className="dining-note">
          소중한 걸음 해주신 분들을 위해 1층 연회장에 정갈하고 맛있는 식사를 정성껏 준비했습니다.
        </p>
      </div>

      {/* 3. 마음 전하실 곳 카드 (버튼 클릭 시 모달 오픈) */}
      <div className="donation-card-block">
        <span className="block-eyebrow">CONGRATULATIONS</span>
        <h3 className="block-title">마음 전하실 곳</h3>
        <p className="block-desc">
          참석이 어려워 축하의 마음을 전하고자 하시는 분들을 위해
          <br />
          계좌번호를 안내해 드립니다.
        </p>
        <Button
          className="donation-trigger-button"
          onClick={onOpenDonation}
        >
          계좌번호 확인하기
        </Button>
      </div>

      {/* 4. 하단 감사 인사 클로징 */}
      <div className="info-closing">
        <p className="closing-message">
          저희 두 사람의 새로운 시작을 축복해 주시는
          <br />
          모든 분들께 진심으로 감사드립니다.
        </p>
        <p className="closing-names">
          신랑 <strong>{GROOM_FULLNAME}</strong> · 신부 <strong>{BRIDE_FULLNAME}</strong> 올림
        </p>
      </div>
    </LazyDiv>
  )
}
