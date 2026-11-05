import { useEffect, useState } from "react"
import "./index.scss"

const FONTS = [
  { id: "maruburi", name: "마루 부리 (추천)", desc: "감성 명조" },
  { id: "kyobohand", name: "교보 손글씨 2019", desc: "귀여운 손글씨" },
  { id: "kyobohand2020", name: "교보 2020", desc: "만년필체" },
  { id: "ridibatang", name: "리디 바탕", desc: "단정한 명조" },
  { id: "pretendard", name: "프리텐다드", desc: "깔끔 고딕" },
]

export const FontSelector = () => {
  const [currentFont, setCurrentFont] = useState(() => {
    return localStorage.getItem("wedding_font") || "maruburi"
  })
  const [isOpen, setIsOpen] = useState(false)

  const changeFont = (fontId: string) => {
    setCurrentFont(fontId)
    document.documentElement.setAttribute("data-font", fontId)
    localStorage.setItem("wedding_font", fontId)
  }

  useEffect(() => {
    document.documentElement.setAttribute("data-font", currentFont)
  }, [currentFont])

  return (
    <div className="font-selector-container">
      <button
        className="font-toggle-btn"
        onClick={() => setIsOpen(!isOpen)}
        title="폰트 실시간 비교"
      >
        🔤 폰트 변경 ({FONTS.find((f) => f.id === currentFont)?.name})
      </button>

      {isOpen && (
        <div className="font-menu">
          <div className="font-menu-header">
            <span>마음에 드는 글씨체를 골라보세요</span>
            <button className="close-btn" onClick={() => setIsOpen(false)}>
              ✕
            </button>
          </div>
          <div className="font-list">
            {FONTS.map((font) => (
              <button
                key={font.id}
                className={`font-item-btn ${currentFont === font.id ? "active" : ""}`}
                onClick={() => {
                  changeFont(font.id)
                }}
              >
                <span className="font-title">{font.name}</span>
                <span className="font-desc">{font.desc}</span>
              </button>
            ))}
          </div>
        </div>
      )}
    </div>
  )
}
