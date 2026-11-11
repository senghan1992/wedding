import { useState } from "react"
import { Map } from "./map"
import { LazyDiv } from "../lazyDiv"
import { LOCATION, LOCATION_ADDRESS } from "../../const"
import "./index.scss"

type TransportTab = "gasan" | "guro" | "car"

export const Location = () => {
  const [activeTab, setActiveTab] = useState<TransportTab>("gasan")
  const [copied, setCopied] = useState(false)

  const handleCopyAddress = () => {
    navigator.clipboard.writeText(LOCATION_ADDRESS)
    setCopied(true)
    setTimeout(() => setCopied(false), 2500)
  }

  return (
    <LazyDiv className="card location-combined-card">
      <div className="section-header">
        <span className="script-title">Location</span>
        <h3 className="location-name">{LOCATION}</h3>
        <div className="addr-badge-group">
          <span className="detail-addr">{LOCATION_ADDRESS}</span>
          <button
            className={`copy-addr-btn ${copied ? "copied" : ""}`}
            onClick={handleCopyAddress}
          >
            {copied ? "✓ 복사완료" : "주소 복사"}
          </button>
        </div>
      </div>

      {/* 지도 컴포넌트 */}
      <Map />

      {/* 교통편 탭형 안내 섹션 */}
      <div className="transport-section">
        <div className="transport-tab-nav">
          <button
            type="button"
            className={`tab-btn ${activeTab === "gasan" ? "active" : ""}`}
            onClick={() => setActiveTab("gasan")}
          >
            <span>1·7호선 가산역</span>
          </button>
          <button
            type="button"
            className={`tab-btn ${activeTab === "guro" ? "active" : ""}`}
            onClick={() => setActiveTab("guro")}
          >
            <span>2호선 구로디지털단지역</span>
          </button>
          <button
            type="button"
            className={`tab-btn ${activeTab === "car" ? "active" : ""}`}
            onClick={() => setActiveTab("car")}
          >
            <span>자가용 & 주차</span>
          </button>
        </div>

        <div className="transport-tab-content">
          {activeTab === "gasan" && (
            <div className="tab-pane">
              <div className="subway-badge gasan-badge">
                <span className="line line-1">1호선</span>
                <span className="line line-7">7호선</span>
                <span className="station">가산디지털단지역</span>
              </div>
              <div className="step-list">
                <div className="step-item">
                  <span className="step-num">1</span>
                  <div className="step-desc">
                    <b>5번 출구</b> 나와서 <b>약 20m 직진</b>
                  </div>
                </div>
                <div className="step-item highlight-step">
                  <span className="step-num">2</span>
                  <div className="step-desc">
                    <b>지타워컨벤션 전용 셔틀버스</b> 탑승 (15분 간격 운행)
                  </div>
                </div>
                <div className="step-item">
                  <span className="step-num">3</span>
                  <div className="step-desc">
                    <b>2층 그랜드볼룸</b>에서 예식이 열립니다
                  </div>
                </div>
              </div>
              <div className="tab-note">
                하객 주차 <b>2시간 무료</b> · 지하주차장 1,400대
              </div>
            </div>
          )}

          {activeTab === "guro" && (
            <div className="tab-pane">
              <div className="subway-badge guro-badge">
                <span className="line line-2">2호선</span>
                <span className="station">구로디지털단지역</span>
              </div>
              <div className="step-list">
                <div className="step-item">
                  <span className="step-num">1</span>
                  <div className="step-desc">
                    <b>4번 출구</b> 나와서 <b>약 100m 직진</b>
                  </div>
                </div>
                <div className="step-item highlight-step">
                  <span className="step-num">2</span>
                  <div className="step-desc">
                    <b>지타워컨벤션 전용 셔틀버스</b> 탑승 (15분 간격 운행)
                  </div>
                </div>
                <div className="step-item">
                  <span className="step-num">3</span>
                  <div className="step-desc">
                    <b>2층 그랜드볼룸</b>에서 예식이 열립니다
                  </div>
                </div>
              </div>
              <div className="tab-note">
                하객 주차 <b>2시간 무료</b> · 지하주차장 1,400대
              </div>
            </div>
          )}

          {activeTab === "car" && (
            <div className="tab-pane car-pane">
              <div className="car-info-box">
                <div className="car-title">🚗 네비게이션 검색</div>
                <div className="car-text">
                  <b>지타워컨벤션</b> (서울 구로구 디지털로26길 38)
                  <span className="car-subtext">디지털로26길 진입 후 Gate 1, 2 이용</span>
                </div>
              </div>

              <div className="car-info-box parking-highlight">
                <div className="car-title">🅿️ 1,400대 동시 주차</div>
                <div className="car-text">
                  넓고 쾌적한 지하주차장 · 하객 <b>2시간 무료 주차</b>
                </div>
              </div>
              <div className="tab-note">
                네비에 <b>지타워컨벤션</b> 검색 후 디지털로26길로 진입해 주세요
              </div>
            </div>
          )}
        </div>
      </div>
    </LazyDiv>
  )
}
