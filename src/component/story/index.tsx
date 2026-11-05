import { useState } from "react"
import { LazyDiv } from "../lazyDiv"
import "./index.scss"

const STORIES = {
  groom: {
    label: "신랑 승환 이야기",
    role: "Groom's Interview",
    name: "변승환",
    avatar: "🤵‍♂️",
    items: [
      {
        q: "소윤이를 처음 만났을 때?",
        a: "첫눈에 밝고 따뜻한 에너지가 느껴졌어요. 함께 이야기하는 내내 웃음이 끊이지 않았던 그날의 기억이 지금도 생생합니다.",
      },
      {
        q: "이 사람과 결혼해야겠다고 확신한 순간은?",
        a: "어떤 힘든 순간에도 제 손을 꼭 잡아주고 제 편이 되어주는 모습을 보며, 이 사람과 함께라면 어떤 미래도 두렵지 않겠다는 확신이 들었습니다.",
      },
      {
        q: "소윤이에게 꼭 하고 싶은 약속?",
        a: "평생 가장 친한 친구이자 든든한 버팀목이 되어, 소윤이의 얼굴에 항상 미소가 피어나도록 아끼고 사랑하겠습니다.",
      },
    ],
  },
  bride: {
    label: "신부 소윤 이야기",
    role: "Bride's Interview",
    name: "김소윤",
    avatar: "👰‍♀️",
    items: [
      {
        q: "승환이의 가장 멋진 매력은?",
        a: "언제나 한결같이 다정하고 듬직해요. 사소한 말 한마디도 기억해 주고, 묵묵히 저를 배려해 주는 따뜻한 마음이 가장 큰 매력이에요.",
      },
      {
        q: "결혼을 결심하게 된 이유는?",
        a: "함께 있을 때 가장 나다운 모습으로 편안하게 웃을 수 있었어요. 평생의 여정을 함께 걸어갈 단 한 사람이라는 믿음이 생겼습니다.",
      },
      {
        q: "승환이에게 전하는 한마디!",
        a: "우리가 함께 그려갈 앞으로의 날들이 정말 기대돼. 지금처럼 서로를 존중하며 매일 감사하고 행복하게 살아가자!",
      },
    ],
  },
  ourStory: {
    label: "우리의 약속",
    role: "Our Promise",
    name: "승환 & 소윤",
    avatar: "💍",
    items: [
      {
        q: "우리가 함께 꿈꾸는 가정?",
        a: "퇴근 후 문을 열었을 때 따스한 온기와 웃음이 반겨주는 집, 기쁜 일은 두 배로 나누고 슬픈 일은 서로의 품에서 위로받는 가정을 꿈꿉니다.",
      },
      {
        q: "귀한 걸음 해주실 하객분들께",
        a: "저희 두 사람의 새로운 출발선에 서는 날, 소중한 시간을 내어 축복해 주셔서 진심으로 감사드립니다. 보내주신 사랑 잊지 않고 예쁘게 살겠습니다.",
      },
    ],
  },
}

type TabKey = keyof typeof STORIES

export const Story = () => {
  const [activeTab, setActiveTab] = useState<TabKey>("groom")
  const current = STORIES[activeTab]

  return (
    <LazyDiv className="card story-card">
      <div className="section-header">
        <span className="script-title">Our Story</span>
        <h3 className="section-title">신랑 & 신부 미니 인터뷰</h3>
        <p className="section-desc">저희 두 사람의 솔직하고 소소한 이야기</p>
      </div>

      {/* 탭 버튼 */}
      <div className="story-tab-bar">
        {(Object.keys(STORIES) as TabKey[]).map((key) => (
          <button
            key={key}
            type="button"
            className={`story-tab-btn ${activeTab === key ? "active" : ""}`}
            onClick={() => setActiveTab(key)}
          >
            <span className="tab-avatar">{STORIES[key].avatar}</span>
            <span className="tab-text">{STORIES[key].name}</span>
          </button>
        ))}
      </div>

      {/* 인터뷰 카드 목록 */}
      <div className="interview-container">
        <div className="interview-badge">{current.role}</div>

        <div className="interview-items">
          {current.items.map((item, idx) => (
            <div key={idx} className="interview-bubble-card">
              <div className="question-row">
                <span className="q-tag">Q</span>
                <span className="question-text">{item.q}</span>
              </div>
              <div className="answer-row">
                <span className="a-tag">A</span>
                <p className="answer-text">{item.a}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </LazyDiv>
  )
}
