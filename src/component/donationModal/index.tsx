import { useState } from "react"
import { BRIDE_INFO, GROOM_INFO } from "../../const"
import { Button } from "../button"
import { Modal } from "../modal"
import "./index.scss"

/**
 * 축의금 계좌번호 안내 모달 컴포넌트입니다.
 * 신랑측 / 신부측 탭을 전환하며 계좌번호를 확인하고 한 번의 터치로 복사할 수 있습니다.
 */
export const DonationModal = ({
  open,
  onClose,
}: {
  open: boolean
  onClose: () => void
}) => {
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
    <Modal
      modalState={[open, (n: boolean) => !n && onClose()]}
      className="donation-popup-modal"
      closeOnClickBackground={true}
    >
      <div className="header">
        <div className="title">마음 전하실 곳</div>
        <p className="subtitle">
          참석이 어려워 축하의 마음을 전하고자 하시는 분들을 위해
          <br />
          계좌번호를 안내해 드립니다.
        </p>

        {/* 신랑측 / 신부측 탭 전환 컨트롤 */}
        <div className="donation-tabs">
          <button
            type="button"
            className={`donation-tab-btn ${activeTab === "groom" ? "active" : ""}`}
            onClick={() => setActiveTab("groom")}
          >
            신랑측 계좌번호
          </button>
          <button
            type="button"
            className={`donation-tab-btn ${activeTab === "bride" ? "active" : ""}`}
            onClick={() => setActiveTab("bride")}
          >
            신부측 계좌번호
          </button>
        </div>
      </div>

      <div className="content">
        {currentInfoList
          .filter(({ account }) => !!account)
          .map(({ relation, name, account }) => {
            const isCopied = copiedKey === relation
            return (
              <div className="account-info-card" key={relation}>
                <div className="account-text-wrap">
                  <div className="name-row">
                    <span className="relation-tag">{relation}</span>
                    <span className="person-name">{name}</span>
                  </div>
                  <div className="account-num">{account}</div>
                </div>
                <button
                  type="button"
                  className={`copy-button ${isCopied ? "copied" : ""}`}
                  onClick={() => handleCopyAccount(account, relation)}
                  aria-label={`${name} 계좌번호 복사`}
                >
                  {isCopied ? "복사 완료 ✓" : "복사하기"}
                </button>
              </div>
            )
          })}
      </div>

      <div className="footer">
        <Button
          buttonStyle="style1"
          className="donation-close-btn"
          onClick={onClose}
        >
          닫기
        </Button>
      </div>
    </Modal>
  )
}
