"use client";

import { updateLessonProgress } from "@/features/lessons/action";
import { useEffect, useRef } from "react";
import YouTube, { YouTubeEvent } from "react-youtube";

type Prop1 = {
  action: true;
  videoId: string;
  userId: string | null;
  lessonId: string;
  stoppedAt: number;
  completed: boolean;
};

type Prop2 = {
  action: false;
  videoId: string;
  setLessonDuration: (duration: number) => void;
};

type YoutubeVideoPlayerProps = Prop1 | Prop2;

export default function YouTubeVideoPlayer(props: YoutubeVideoPlayerProps) {
  if (props.action && props.userId) {
    return <YouTubeVideoPlayerWithProgress {...props} />;
  }

  const onReady = (event: YouTubeEvent) => {
    if ("setLessonDuration" in props) {
      const duration = Math.floor(event.target.getDuration());
      props.setLessonDuration(duration);
    }
  };

  console.log("using default yotube video player...");

  return (
    <YouTube
      videoId={props.videoId}
      className="aspect-video"
      opts={{ width: "100%", height: "100%" }}
      onReady={onReady}
    />
  );
}

function YouTubeVideoPlayerWithProgress({
  videoId,
  userId,
  lessonId,
  stoppedAt,
  completed: initialCompleted,
}: Prop1) {
  const playerRef = useRef<YouTubeEvent["target"]>(null);
  const lastPosition = useRef(0);
  const completed = useRef(initialCompleted);

  const saveProgress = async () => {
    const player = playerRef.current;
    if (!player) return;

    const currentTime = Math.floor(player.getCurrentTime());

    if (lastPosition.current === currentTime) return;

    const watchedSeconds = currentTime - lastPosition.current;

    await updateLessonProgress(
      userId,
      lessonId,
      currentTime,
      watchedSeconds,
      completed.current,
    );
    lastPosition.current = currentTime;
  };

  const sendProgressBeacon = () => {
    const player = playerRef.current;
    if (!player) return;

    const currentTime = Math.floor(player.getCurrentTime());

    if (lastPosition.current === currentTime) return;

    const watchedSeconds = currentTime - lastPosition.current;

    navigator.sendBeacon(
      "/api/progress",
      JSON.stringify({
        userId,
        lessonId,
        currentTime,
        watchedSeconds,
        completed: completed.current,
      }),
    );
  };

  // Keep saveProgress reference up-to-date to avoid stale closures in the event listener
  const saveProgressRef = useRef(saveProgress);
  saveProgressRef.current = saveProgress;

  useEffect(() => {
    const handleVisibilityChange = () => {
      if (document.hidden) {
        if (lastPosition.current > 0) {
          saveProgressRef.current();
        }
      }
    };

    const handlePageHide = () => {
      sendProgressBeacon();
    };

    document.addEventListener("visibilitychange", handleVisibilityChange);
    window.addEventListener("pagehide", handlePageHide);

    return () => {
      sendProgressBeacon();

      document.removeEventListener("visibilitychange", handleVisibilityChange);
      window.removeEventListener("pagehide", handlePageHide);
    };
  }, []);

  const markLessonAsComplete = async (currentTime: number) => {
    await updateLessonProgress(userId, lessonId, currentTime, 0, true);
    lastPosition.current = 0;
    completed.current = true;
  };

  const onReady = (event: YouTubeEvent) => {
    playerRef.current = event.target;
    const player = playerRef.current;

    if (stoppedAt) {
      const targetTime = Math.floor(stoppedAt - 5);
      player.seekTo(targetTime, true);
      player.playVideo();
      lastPosition.current = targetTime;
    }
  };

  const onStateChange = (event: YouTubeEvent) => {
    // if user pauses the video
    if (event.data === 2) {
      saveProgress();
    }

    // if user completes the video
    if (event.data === 0) {
      markLessonAsComplete(Math.floor(event.target.getDuration()));
    }
  };

  return (
    <YouTube
      videoId={videoId}
      className="aspect-video"
      opts={{ width: "100%", height: "100%" }}
      onReady={onReady}
      onStateChange={onStateChange}
    />
  );
}
