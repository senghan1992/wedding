import { useState } from "react"
import { LazyDiv } from "../lazyDiv"
import "./index.scss"

interface FloatingHeart {
  id: number
  left: number
  scale: number
}

export const LikeButton = ({ standalone = false }: { standalone?: boolean }) => {
  const [likes, setLikes] = useState(() => {
    const saved = localStorage.getItem("wedding_likes")
    return saved ? parseInt(saved, 10) : 77
  })
  const [hearts, setHearts] = useState<FloatingHeart[]>([])

  const handleLike = () => {
    const next = likes + 1
    setLikes(next)
    localStorage.setItem("wedding_likes", next.toString())

    // 퐁퐁 튀어오르는 하트 생성
    const newHeart: FloatingHeart = {
      id: Date.now() + Math.random(),
      left: Math.random() * 60 + 20, // 20% ~ 80% 사이
      scale: Math.random() * 0.4 + 0.8,
    }
    setHearts((prev) => [...prev, newHeart])

    setTimeout(() => {
      setHearts((prev) => prev.filter((h) => h.id !== newHeart.id))
    }, 1200)
  }

  const content = (
    <div className="like-wrapper">
      <div className="like-text-group">
        <span className="like-title">두 사람의 시작을 축복해 주세요 💕</span>
        <span className="like-subtitle">
          하트를 눌러 따뜻한 축하의 마음을 전해주세요
        </span>
      </div>

      <div className="heart-button-container">
        {/* 플로팅 하트 파티클 */}
        {hearts.map((h) => (
          <span
            key={h.id}
            className="floating-heart"
            style={{
              left: `${h.left}%`,
              transform: `scale(${h.scale})`,
            }}
          >
            ❤️
          </span>
        ))}

        <button className="big-heart-btn" onClick={handleLike} aria-label="축하 하트 보내기">
          <span className="heart-emoji">💖</span>
          <span className="heart-label">축하의 마음 전하기</span>
          <span className="like-count-pill">{likes}</span>
        </button>
      </div>
    </div>
  )

  if (standalone) {
    return <LazyDiv className="card like-section-card">{content}</LazyDiv>
  }
  return content
}
