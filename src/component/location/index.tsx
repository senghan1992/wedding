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
    <>
      <LazyDiv className="card location">
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
      </LazyDiv>

      {/* 교통편 탭형 안내 섹션 */}
      <LazyDiv className="card location-details-card">
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
            <span>2호선 구로역</span>
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
                    <b>5번 출구</b>로 나와서 <b>약 20m 직진</b>
                  </div>
                </div>
                <div className="step-item highlight-step">
                  <span className="step-num">2</span>
                  <div className="step-desc">
                    <b>지타워컨벤션 전용 셔틀버스</b> 탑승
                    <div className="tip-note">
                      ※ 예식 당일 15분 간격 순환 운행
                    </div>
                  </div>
                </div>
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
                    <b>4번 출구</b>로 나와서 <b>약 100m 직진</b>
                  </div>
                </div>
                <div className="step-item highlight-step">
                  <span className="step-num">2</span>
                  <div className="step-desc">
                    <b>지타워컨벤션 전용 셔틀버스</b> 탑승
                    <div className="tip-note">
                      ※ 예식 당일 15분 간격 순환 운행
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}

          {activeTab === "car" && (
            <div className="tab-pane car-pane">
              <div className="car-info-box">
                <div className="car-title">🚗 네비게이션 검색</div>
                <div className="car-text">
                  <b>지타워컨벤션</b> 또는 <b>서울시 구로구 디지털로26길 38</b>
                  <div className="car-subtext">
                    디지털로26길 진입 후 <b>Gate 1, Gate 2</b> 이용
                  </div>
                </div>
              </div>

              <div className="car-info-box parking-highlight">
                <div className="car-title">🅿️ 주차 꿀팁 (1,400대 동시 주차)</div>
                <div className="car-text">
                  단독 지하주차장이 매우 넓고 쾌적합니다.
                  <br />
                  하객 여러분께 <b>2시간 무료 주차</b>를 지원합니다.
                </div>
              </div>
            </div>
          )}
        </div>
      </LazyDiv>
    </>
  )
}
