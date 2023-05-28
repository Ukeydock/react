import axios from "@script/axios";
import React, { useEffect, useState } from "react";
import "@css/Row.css";
import { Swiper, SwiperSlide } from "swiper/react";
import { A11y, Navigation, Pagination, Scrollbar } from "swiper";
import { Video } from "@root/components/scripts/video";
import spinner from "@root/assets/images/Spinner-1s-200px.gif";

import "swiper/css";
import "swiper/css/navigation";
import "swiper/css/pagination";
import "swiper/css/scrollbar";
import KeywordUser from "./scripts/keywordUser";
import VideoModal from "./videoModal/videoModal";
import { VideoData } from "./Types/interface/video/videoData.interface";

interface props {
  keywordId: number;
  keyword: string;
}

function truncateString(str: string): string {
  if (str.length > 30) {
    return str.slice(0, 27) + "...";
  }
  return str;
}

export default function Row(props: props) {
  const [movies, setMovies] = useState<VideoData[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [isExistKeyword, setIsExistKeyword] = useState<boolean>(false);
  const [videoDbId, setVideoDbId] = useState<number | null>(null);

  // 컴포넌트가 마운트되었을 때 최초 한 번 무조건 실행
  // 의존성 배열 안의 값이 변했을 때
  useEffect(() => {
    const fetchMovie = async () => {
      const movieData = await Video.findByKeyword(props.keyword);
      setLoading(false);
      setMovies(movieData);
    };
    fetchMovie();
    fetchKeywordButton(props.keywordId);
  }, [props.keyword]);

  const fetchKeywordButton = async (keywordId: number) => {
    const keywordUserData = await KeywordUser.findOneByKeywordId(keywordId);
    setIsExistKeyword(keywordUserData);
  };

  const fetchVideoModal = async (videoDbId: number) => {
    setVideoDbId(videoDbId);
  };

  if (!loading && movies) {
    return (
      <section className="row" style={{ backgroundColor: "black" }}>
        <h2>
          {props.keyword}

          <button
            onClick={() => {
              if (isExistKeyword == true) {
                KeywordUser.deleteByKeywordId(props.keywordId);
                setIsExistKeyword(false);
              } else {
                KeywordUser.create(props.keywordId);
                setIsExistKeyword(true);
              }
            }}
            className={`video__button ${
              isExistKeyword == true ? "video__button__active" : ""
            }`}
          >
            {isExistKeyword == true ? "등록한 키워드!" : "키워드 추가"}
          </button>
        </h2>

        <Swiper
          modules={[Navigation, Pagination, Scrollbar, A11y]}
          loop={true} // loop 기능을 사용할 것인지
          breakpoints={{
            1378: {
              slidesPerView: 6, // 한번에 보이는 슬라이드 개수
              slidesPerGroup: 6, // 몇개씩 슬라이드 할지
            },
            998: {
              slidesPerView: 5,
              slidesPerGroup: 5,
            },
            625: {
              slidesPerView: 4,
              slidesPerGroup: 4,
            },
            0: {
              slidesPerView: 3,
              slidesPerGroup: 3,
            },
          }}
          navigation // arrow 버튼 사용 유무
          pagination={{ clickable: true }} // 페이지 버튼 보이게 할지
        >
          <div className="row__posters">
            {movies?.map((video: VideoData) => (
              <SwiperSlide key={video.videoId}>
                <img
                  key={video.videoDBId}
                  style={{ padding: "25px 0" }}
                  className={`row__poster`}
                  src={video.videoThumbnail}
                  alt="영화들 이미지"
                  onClick={() => fetchVideoModal(video.videoDBId)}
                />
                <p>{truncateString(video.videoTitle)}</p>
              </SwiperSlide>
            ))}
          </div>
        </Swiper>
        {videoDbId && (
          <VideoModal videoDbId={videoDbId} keywordId={props.keywordId} />
        )}
      </section>
    );
  }
  if (loading) {
    return <img src={spinner}></img>;
  }
  return <div></div>;
}

export {};
