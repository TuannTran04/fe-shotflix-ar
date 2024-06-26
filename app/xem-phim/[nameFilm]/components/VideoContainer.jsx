"use client";
import { useEffect, useRef, useState } from "react";
import Plyr from "plyr";
import Hls from "hls.js";
import videojs from "video.js";

import { useRouter } from "next/navigation";
import { useSelector } from "react-redux";
import axios from "axios";

let alreadyCalledVideoJs = false;
// console.log("alreadyCalledVideoJs", alreadyCalledVideoJs);

const VideoContainer = ({ movie, nameFilm }) => {
  const router = useRouter();
  const refVideo = useRef();
  console.log(movie);
  // console.log(refVideo.current);
  // let player = useRef(null);
  // const [playerInstance, setPlayerInstance] = useState(null);
  // console.log(">>> player <<<", playerInstance);
  // const [hlsInstance, setHLSInstance] = useState(null);
  let player = null;
  let hls = null;

  const [isLoading, setIsLoading] = useState(true);

  const user = useSelector((state) => state.auth.login.currentUser);
  const accessToken = user?.accessToken;
  const userId = user?._id;

  // console.log(movie);

  var config = {
    autoStartLoad: true,
    startPosition: -1,
    capLevelToPlayerSize: false,
    debug: false,
    defaultAudioCodec: undefined,
    initialLiveManifestSize: 1,
    // maxBufferLength: 30,
    maxBufferLength: 11,
    // maxMaxBufferLength: 600,
    maxMaxBufferLength: 11,
    // maxBufferSize: 60 * 1000 * 1000,
    maxBufferSize: 30 * 1000 * 1000,
    maxBufferHole: 0.5,
    // maxBufferHole: 0.1,
    lowBufferWatchdogPeriod: 0.5,
    highBufferWatchdogPeriod: 3,
    nudgeOffset: 0.1,
    nudgeMaxRetry: 3,
    maxFragLookUpTolerance: 0.2,
    liveSyncDurationCount: 3,
    liveMaxLatencyDurationCount: 10,
    // enableWorker: true,
    enableWorker: false,
    enableSoftwareAES: true,
    manifestLoadingTimeOut: 10000,
    manifestLoadingMaxRetry: 1,
    manifestLoadingRetryDelay: 500,
    manifestLoadingMaxRetryTimeout: 64000,
    startLevel: 0,
    levelLoadingTimeOut: 10000,
    levelLoadingMaxRetry: 4,
    levelLoadingRetryDelay: 500,
    levelLoadingMaxRetryTimeout: 64000,
    fragLoadingTimeOut: 20000,
    fragLoadingMaxRetry: 6,
    fragLoadingRetryDelay: 500,
    fragLoadingMaxRetryTimeout: 64000,
    startFragPrefetch: false,
    appendErrorMaxRetry: 3,
    // loader: customLoader,
    // fLoader: customFragmentLoader,
    // pLoader: customPlaylistLoader,
    // xhrSetup: XMLHttpRequestSetupCallback,
    // fetchSetup: FetchSetupCallback,
    // abrController: customAbrController,
    // timelineController: TimelineController,
    enableWebVTT: true,
    enableCEA708Captions: true,
    stretchShortVideoTrack: false,
    maxAudioFramesDrift: 1,
    forceKeyFrameOnDiscontinuity: true,
    abrEwmaFastLive: 5.0,
    abrEwmaSlowLive: 9.0,
    abrEwmaFastVoD: 4.0,
    abrEwmaSlowVoD: 15.0,
    abrEwmaDefaultEstimate: 500000,
    abrBandWidthFactor: 0.95,
    abrBandWidthUpFactor: 0.7,
    minAutoBitrate: 0,
  };

  const setupPlyr = async () => {
    // Chuyển đổi dữ liệu phụ đề thành định dạng Plyr
    if (Object.keys(movie).length > 0) {
      // console.log(movie);
      // let player;
      // let hls;
      const defaultOptions = {};
      // console.log(movie.video?.[0]);
      if (refVideo.current) {
        // console.log("have element video !");

        // Hls.isSupported()
        if (Hls.isSupported()) {
          // console.log("Hls.isSupported", Hls.isSupported);
          hls = new Hls(config);
          // console.log("have element video HLS !");

          hls.attachMedia(refVideo.current);

          hls.on(Hls.Events.MEDIA_ATTACHED, function () {
            // console.log("video and hls.js are now bound together !");

            // refVideo.current.src = `${process.env.NEXT_PUBLIC_URL}/api/v1/movie/videoHLS/JustaTee/bangkhuang.m3u8`;

            hls.loadSource(
              `${process.env.NEXT_PUBLIC_URL}/api/v1/movie/videoHLS/${
                movie.folderOnFirebase
              }/${movie.video?.[0].trim()}`
            );

            // hls.loadSource(
            //   `${process.env.NEXT_PUBLIC_URL}/api/v1/movie/videoHLS/test_hls/master.m3u8`
            // );

            hls.on(Hls.Events.MANIFEST_PARSED, function (event, data) {
              // console.log(
              //   "manifest loaded, found " +
              //     data.levels.length +
              //     " quality level"
              // );

              const availableQualities = hls.levels.map((l) => l.height);
              // console.log(availableQualities);

              hls.on(Hls.Events.SUBTITLE_TRACKS_UPDATED, () => {
                // console.log("update track");
                // Lựa chọn phụ đề (subtitle) bằng cách chỉ định GROUP-ID của phụ đề trong manifest
                const selectedSubtitleTrack = hls.subtitleTracks.find(
                  (track) => track.groupId === "subs"
                );
                // console.log("selectedSubtitleTrack", selectedSubtitleTrack);
                if (selectedSubtitleTrack) {
                  // Bật phụ đề
                  hls.subtitleTrack = selectedSubtitleTrack.index;
                }
              });

              // Initialize PLYR here
              player = new Plyr(refVideo.current, {
                title: "Example Title",
                controls: [
                  "play-large",
                  // "restart",
                  "rewind",
                  "play",
                  "fast-forward",
                  "progress",
                  "current-time",
                  "duration",
                  "mute",
                  "volume",
                  "captions",
                  "settings",
                  "pip",
                  "airplay",
                  "fullscreen",
                ],
                settings: ["captions", "quality", "speed", "loop"],
                captions: { active: true, language: "vi", update: true },
                tooltips: { controls: true, seek: true },
                keyboard: { focused: true, global: true },
                markers: {
                  enabled: true,
                  points: [{ time: 50, label: "con cec" }],
                },
                fullscreen: {
                  enabled: true,
                  fallback: true,
                  iosNative: true,
                  container: null,
                },
                disableContextMenu: false,
                playsinline: true,
                enabled: true,
                ...defaultOptions,
                // debug: true,
              });

              /////////////////////////////
              // setPlayerInstance(player);
              // setHLSInstance(hls);
              /////////////////////////////

              // Đặt sự kiện cho Plyr khi video load xong các data
              if (player.playing == false) {
                player.on("ready", async (event) => {
                  console.log("ready goooooooooooooooooooooooooo");
                  event.detail.plyr.poster = `${
                    process.env.NEXT_PUBLIC_URL
                  }/api/v1/movie/poster/${
                    movie.folderOnFirebase
                  }/${movie.photo?.[1]?.trim()}`;
                });

                // player.on("play", async (event) => {
                //   const durationVideo = event.detail.plyr.duration;
                //   const movieId = movie?._id;
                //   const data = { userId, movieId, durationVideo };
                //   const base_url = process.env.NEXT_PUBLIC_URL;

                //   try {
                //     const incrView = await axios.put(
                //       `${base_url}/api/v1/movie/update-views`,
                //       data
                //     );
                //     console.log(">>> update-views <<<", incrView);
                //   } catch (err) {
                //     console.log(err);
                //   }
                // });

                // Hide loader when data is loaded
                player.on("loadeddata", () => {
                  // loader.style.display = "none";
                  setIsLoading(false);
                  console.log("loadeddata");
                });

                player.on("loadedmetadata", (event) => {
                  // loader.style.display = "block";
                  setIsLoading(true);
                  console.log("loadedmetadata");

                  // console.log("readyyyy start");
                  // console.log(event.detail.plyr);
                  // console.log(event.detail.plyr.duration);
                  // Kiểm tra nếu có trạng thái xem video trong Local Storage
                  // const savedPlaybackTime = JSON.parse(
                  //   decryptData(localStorage.getItem(`${movie?._id}`), secretKey)
                  // );

                  const savedPlaybackTime = JSON.parse(
                    localStorage.getItem(`${movie?._id}`)
                  );
                  // console.log(savedPlaybackTime);
                  const currTimeLocal = savedPlaybackTime?.currentTime;
                  const videoIdLocal = savedPlaybackTime?.videoId;

                  if (videoIdLocal == movie._id && event.detail.plyr.duration) {
                    console.log("savedPlaybackTime canplay");

                    const setPlayerCurrentTime = (currentTime) => {
                      setTimeout(() => {
                        const minutes = Math.floor(currentTime / 60);
                        const seconds = Math.round(currentTime % 60);
                        if (true) {
                          // console.log(player.current);
                          // console.log("continue");
                          event.detail.plyr.muted = false;
                          event.detail.plyr.currentTime = currentTime;
                          // player.play();
                        } else {
                          console.log("begin");
                          player.muted = true;
                          player.currentTime = 0;
                          player.play();
                        }
                      }, 500);
                    };
                    setPlayerCurrentTime(currTimeLocal);
                  }
                });
              }

              // Đặt sự kiện cho Plyr khi video được update time
              let alreadyCalled = false;
              player.on("timeupdate", async (event) => {
                console.log("Video is timeupdate");
                let currentTime = event.detail.plyr.currentTime;
                const duration = event.detail.plyr.duration;
                console.log(
                  "currentTime >= duration / 2 >>",
                  currentTime,
                  duration,
                  currentTime >= duration / 2
                );

                if (
                  currentTime > 0 &&
                  currentTime >= duration / 2 &&
                  !alreadyCalled
                ) {
                  const movieId = movie?._id;
                  const data = { userId, movieId, duration };
                  const base_url = process.env.NEXT_PUBLIC_URL;

                  try {
                    const incrView = await axios.put(
                      `${base_url}/api/v1/movie/update-viewsV2`,
                      data
                    );
                    console.log(">>> update-views <<<", incrView);

                    alreadyCalled = true;
                  } catch (err) {
                    console.log(err);
                  }
                }

                // Thời gian hiện tại gần cuối video (1 giây trước khi kết thúc)
                if (duration && duration - currentTime < 1) {
                  // console.log("Video đã xem xong");
                  // Thực hiện các tác vụ khi video kết thúc hoặc đã xem xong
                  localStorage.removeItem(`${movie?._id}`);
                }

                // currTime > 0 và khi video chưa kết thúc thì set localStorage time update
                if (
                  currentTime &&
                  currentTime > 0 &&
                  duration &&
                  duration - currentTime > 1
                ) {
                  // console.log("sett", {
                  //   currentTime: currentTime,
                  //   videoId: movie._id,
                  // });

                  localStorage.setItem(
                    `${movie?._id}`,
                    JSON.stringify({
                      currentTime: currentTime,
                      videoId: movie._id,
                    })
                  );
                }
              });
            });
          });
        } else if (
          refVideo.current.canPlayType("application/vnd.apple.mpegurl")
          // true
        ) {
          if (refVideo.current) {
            ////////////////////////////////////////////////////////////
            player = videojs(refVideo.current, {
              html5: {
                hls: {
                  // Enable HLS support
                  enableLowInitialPlaylist: true, // Tạo hiệu ứng tải từng phần nhỏ
                  overrideNative: true,
                  withCredentials: true,
                },
              },
              // Tùy chọn để chỉ tải trước một đoạn nhỏ
              // autoStartLoad: true, // Tự động tải video khi player được tạo
              lowLatencyMode: true, // Kích hoạt chế độ tải trước đoạn nhỏ
              controls: true,
              autoplay: false,
              // responsive: true,
              // fluid: true,
              preload: "none",
              // crossOrigin: "use-credentials", // => sai` cai' nay` se err tren safari ios
              controlBar: {
                progressControl: true,
                remainingTimeDisplay: true,
                durationDisplay: true,
                currentTimeDisplay: true,
                timeDivider: true,
                // customControlSpacer: true, // Add spacer for custom controls
              },
            });

            // player.poster(
            //   "https://static-cse.canva.com/blob/1126190/poster.1896a7d6.jpg"
            // );

            // player.poster(`${movie.photo?.[0]}`);

            player.poster(
              `${process.env.NEXT_PUBLIC_URL}/api/v1/movie/poster/${
                movie.folderOnFirebase
              }/${movie.photo?.[1]?.trim()}`
            ),
              // Thêm nguồn video
              player.src({
                src: `${process.env.NEXT_PUBLIC_URL}/api/v1/movie/videoHLS/${
                  movie.folderOnFirebase
                }/${movie.video?.[0].trim()}`,

                // src: `${process.env.NEXT_PUBLIC_URL}/api/v1/movie/videoHLS/test_hls/v240p/index.m3u8`, // Thay thế bằng URL của video của bạn
                // type: "video/mp4", // Loại video
                type: "application/x-mpegURL", // Loại video
              });

            player.on("ready", function () {
              console.log("readyyyyyyyyyyyyyy");
            });

            player.on("loadedmetadata", function () {
              console.log("loadedmetadata");
              const duration = player.duration();

              const savedPlaybackTime = JSON.parse(
                localStorage.getItem(`${movie?._id}`)
              );
              // console.log(savedPlaybackTime);
              const currTimeLocal = savedPlaybackTime?.currentTime;
              const videoIdLocal = savedPlaybackTime?.videoId;

              if (videoIdLocal == movie._id && duration) {
                console.log("savedPlaybackTime canplay");

                const setPlayerCurrentTime = (currentTime) => {
                  setTimeout(() => {
                    const minutes = Math.floor(currentTime / 60);
                    const seconds = Math.round(currentTime % 60);
                    if (true) {
                      // console.log(player.current);
                      // console.log("continue");
                      // event.detail.plyr.muted = false;
                      // event.detail.plyr.currentTime = currentTime;

                      player.muted(false);
                      player.currentTime(currentTime);
                      // player.play();
                    } else {
                      console.log("begin");
                      player.muted = true;
                      player.currentTime = 0;
                      player.play();
                    }
                  }, 500);
                };
                setPlayerCurrentTime(currTimeLocal);
              }
            });

            player.on("waiting", () => {
              console.log("player is waiting");
            });

            player.on("timeupdate", async () => {
              console.log("alreadyCalledVideoJs", alreadyCalledVideoJs);

              // console.log("player is playing");
              let currentTime = player.currentTime();
              const duration = player.duration();
              console.log("Video is timeupdate", currentTime, duration);

              if (
                duration &&
                currentTime &&
                currentTime >= duration / 2 &&
                !alreadyCalledVideoJs
              ) {
                alreadyCalledVideoJs = true;
                console.log("call api update view ??????????????????????");
                const movieId = movie?._id;
                const data = { userId, movieId, duration };
                const base_url = process.env.NEXT_PUBLIC_URL;

                try {
                  const incrView = await axios.put(
                    `${base_url}/api/v1/movie/update-views`,
                    data
                  );
                  console.log(">>> update-views <<<", incrView);
                } catch (err) {
                  alreadyCalledVideoJs = true;
                  console.log(err);
                }
              }

              // Thời gian hiện tại gần cuối video (1 giây trước khi kết thúc)
              if (duration && duration - currentTime < 1) {
                // console.log("Video đã xem xong");
                // Thực hiện các tác vụ khi video kết thúc hoặc đã xem xong
                localStorage.removeItem(`${movie?._id}`);
              }

              // currTime > 0 và khi video chưa kết thúc thì set localStorage time update
              if (
                currentTime &&
                currentTime > 0 &&
                duration &&
                duration - currentTime > 1
              ) {
                // console.log("sett", {
                //   currentTime: currentTime,
                //   videoId: movie._id,
                // });

                localStorage.setItem(
                  `${movie?._id}`,
                  JSON.stringify({
                    currentTime: currentTime,
                    videoId: movie._id,
                  })
                );
              }
            });

            player.on("ended", function () {
              this.dispose();
            });

            //////////////////////////////////////////////////////////////
          }
        }
      }
    }
  };

  useEffect(() => {
    setupPlyr();

    return () => {
      // if (player && !Hls.isSupported()) {
      //   player.dispose();
      //   window.location.reload();
      // }
      // if (player && Hls.isSupported()) {
      //   player?.destroy();
      // }
      if (hls && Hls.isSupported()) {
        hls?.destroy();
      }
    };
  }, [movie, movie?._id, nameFilm, refVideo.current]);

  // useEffect(() => {
  //   if (!refVideo.current) {
  //     content = (
  //       <div className="players-container relative">
  //         <SkeletonImg />
  //       </div>
  //     );
  //   }
  // }, [refVideo.current]);

  return (
    <div className="players-container relative">
      <video
        className="video-js vjs-default-skin max-[480px]:h-[300px] min-[480px]:h-[450px] max-[767px]:h-[450px] md:h-[600px] w-full"
        id="myPlyr"
        ref={refVideo}
        crossOrigin="true"
        playsInline
        // preload="none"
        controls
        style={{ "--plyr-captions-background": "rgba(0, 0, 0, 0.1)" }}
      ></video>
    </div>
  );
};

export default VideoContainer;
