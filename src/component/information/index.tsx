import { useState } from "react"
import { BRIDE_INFO, GROOM_INFO, GROOM_FULLNAME, BRIDE_FULLNAME } from "../../const"
import { LazyDiv } from "../lazyDiv"
import "./index.scss"

/**
 * 마음 전하실 곳 & 식사 안내 섹션입니다.
 * 팝업 모달 대신 화면 안에서 신랑측/신부측 계좌번호를 탭으로 바로 확인하고 복사할 수 있으며,
 * 예식 당일 식사 안내와 정중한 감사 인사를 여유로운 레이아웃으로 담았습니다.
 */
export const Information = () => {
  const [activeTab, setActiveTab] = useState<"groom" | "bride">("groom")
  const [copiedKey, setCopiedKey] = useState<string | null>(null)

  const handleCopyAccount = async (account: string, key: string) => {
    try {
      if (navigator.clipboard && window.isSecureContext) {
        await navigator.clipboard.writeText(account)
      } else {
        const textArea = document.createElement("textarea")
        textArea.value = account
        document.body.appendChild(textArea)
        textArea.select()
        document.execCommand("copy")
        document.body.removeChild(textArea)
      }
      setCopiedKey(key)
      setTimeout(() => {
        setCopiedKey(null)
      }, 2000)
    } catch {
      alert("계좌번호 복사에 실패했습니다.")
    }
  }

  const currentInfoList = activeTab === "groom" ? GROOM_INFO : BRIDE_INFO

  return (
    <LazyDiv className="card information-page-card">
      {/* 1. 상단 섹션 타이틀 */}
      <div className="info-header">
        <span className="script-subtitle">Information</span>
        <h2 className="info-main-title">마음 전하실 곳</h2>
        <p className="info-sub-desc">
          참석이 어려워 축하의 마음을 전하고자 하시는 분들을 위해
          <br />
          계좌번호를 안내해 드립니다.
        </p>
      </div>

      {/* 2. 신랑측 / 신부측 계좌 인페이지 탭 & 카드 리스트 */}
      <div className="account-inpage-section">
        {/* 세그먼트 탭 */}
        <div className="account-tab-control" role="tablist">
          <button
            type="button"
            role="tab"
            aria-selected={activeTab === "groom"}
            className={`tab-btn ${activeTab === "groom" ? "active" : ""}`}
            onClick={() => setActiveTab("groom")}
          >
            신랑측 계좌번호
          </button>
          <button
            type="button"
            role="tab"
            aria-selected={activeTab === "bride"}
            className={`tab-btn ${activeTab === "bride" ? "active" : ""}`}
            onClick={() => setActiveTab("bride")}
          >
            신부측 계좌번호
          </button>
        </div>

        {/* 계좌 카드 목록 */}
        <div className="account-cards-list">
          {currentInfoList
            .filter(({ account }) => !!account)
            .map(({ relation, name, account }) => {
              const isCopied = copiedKey === relation
              return (
                <div className="account-card-item" key={relation}>
                  <div className="account-meta">
                    <div className="person-row">
                      <span className="relation-tag">{relation}</span>
                      <span className="person-name">{name}</span>
                    </div>
                    <div className="account-number-text">{account}</div>
                  </div>
                  <button
                    type="button"
                    className={`account-copy-btn ${isCopied ? "copied" : ""}`}
                    onClick={() => handleCopyAccount(account, relation)}
                    aria-label={`${name} 계좌번호 복사`}
                  >
                    {isCopied ? "복사 완료 ✓" : "복사하기"}
                  </button>
                </div>
              )
            })}
        </div>
      </div>

      {/* 3. 식사 안내 카드 (정갈한 2-Cell 다이닝 가이드) */}
      <div className="dining-guide-card">
        <div className="dining-card-header">
          <span className="dining-eyebrow">RECEPTION & DINING</span>
          <h3 className="dining-main-title">식사 및 연회 안내</h3>
        </div>

        <div className="dining-fact-grid">
          <div className="dining-fact-item">
            <span className="fact-label">식사 시간</span>
            <span className="fact-value">15:00 ~ 17:00</span>
            <span className="fact-sub">예식 30분 전부터 이용 가능</span>
          </div>
          <div className="dining-fact-item">
            <span className="fact-label">연회 장소</span>
            <span className="fact-value highlight">G-TOWER 1층</span>
            <span className="fact-sub">2층 본식 후 1층 이동</span>
          </div>
        </div>

        <p className="dining-note">
          소중한 걸음 해주신 분들을 위해 정갈하고 맛있는 식사를 정성껏 준비했습니다.
        </p>
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
