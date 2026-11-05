import { Map } from "./map"
import CarIcon from "../../icons/car-icon.svg?react"
import BusIcon from "../../icons/bus-icon.svg?react"
import { LazyDiv } from "../lazyDiv"
import { LOCATION, LOCATION_ADDRESS } from "../../const"

/**
 * 오시는 길 정보를 표시하는 컴포넌트입니다.
 * 지도와 대중교통, 자가용 이용 방법을 안내합니다.
 *
 * @returns {JSX.Element} 오시는 길 섹션
 */
export const Location = () => {
  return (
    <>
      {/* 지도 및 주소 섹션 */}
      <LazyDiv className="card location">
        <h2 className="english">Location</h2>
        <div className="addr">
          {LOCATION}
          <div className="detail">{LOCATION_ADDRESS}</div>
        </div>
        <Map />
      </LazyDiv>

      {/* 대중교통 및 자가용 안내 섹션 */}
      <LazyDiv className="card location">
        {/* 대중교통 안내 */}
        <div className="location-info">
          <div className="transportation-icon-wrapper">
            <BusIcon className="transportation-icon" />
          </div>
          <div className="heading">지하철 및 셔틀버스</div>
          <div />
          <div className="content">
            <b>1호선 · 7호선 가산디지털단지역</b>
            <br />
            5번 출구 나와서 약 20m 직진 후 셔틀버스 탑승
          </div>
          <div />
          <div className="content">
            <b>2호선 구로디지털단지역</b>
            <br />
            4번 출구 나와서 약 100m 직진 후 셔틀버스 탑승
          </div>
          <div />
          <div className="content">
            <small style={{ color: "#777" }}>
              ※ 셔틀버스는 예식일 15분 간격으로 순환 운행됩니다.
            </small>
          </div>
          <div />
          <div className="content">
            <b>시내버스 이용 시</b>
            <br />
            - 지선: 5536, 5615 (지하이시티·G밸리보건지소 하차)
            <br />
            - 간선: 503, 504, 571, 652 (디지털단지오거리 하차)
          </div>
        </div>

        {/* 자가용 안내 */}
        <div className="location-info">
          <div className="transportation-icon-wrapper">
            <CarIcon className="transportation-icon" />
          </div>
          <div className="heading">자가용 및 주차</div>
          <div />
          <div className="content">
            네비게이션 검색:
            <br />
            <b>지타워컨벤션</b> 또는 <b>서울시 구로구 디지털로26길 38</b>
            <br />
            <small style={{ color: "#777" }}>
              (디지털로26길 이용하여 Gate 1, Gate 2 진입)
            </small>
          </div>
          <div />
          <div className="content">
            <b>단독 주차장 1,400대 동시 주차 가능</b>
            <br />
            하객 <b>2시간 무료 주차</b> 지원
          </div>
        </div>
      </LazyDiv>
    </>
  )
}
