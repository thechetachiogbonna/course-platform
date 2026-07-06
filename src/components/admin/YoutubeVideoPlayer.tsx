"use client";

import { updateLessonProgress } from "@/features/lessons/action";
import { useEffect, useRef } from "react";
import YouTube, { YouTubeEvent } from "react-youtube";

type Prop1 = {
  action: true;
  videoId: string;
  userId: string;
  lessonId: string;
  stoppedAt: number;
};

type Prop2 = {
  action: false;
  videoId: string;
};

type YoutubeVideoPlayerProps = Prop1 | Prop2;

export default function YouTubeVideoPlayer(props: YoutubeVideoPlayerProps) {
  if (props.action) {
    return <YouTubeVideoPlayerWithProgress {...props} />;
  }

  return (
    <YouTube
      videoId={props.videoId}
      className="aspect-video"
      opts={{ width: "100%", height: "100%" }}
    />
  );
}

function YouTubeVideoPlayerWithProgress({
  videoId,
  userId,
  lessonId,
  stoppedAt,
}: Prop1) {
  const playerRef = useRef<YouTubeEvent["target"]>(null);
  const lastPosition = useRef(0);
  const isSeeking = useRef(false);

  const saveProgress = async () => {
    const player = playerRef.current;
    if (!player) return;
    if (isSeeking.current) return;

    const currentTime = Math.floor(player.getCurrentTime());
    const watchedSeconds = currentTime - lastPosition.current;

    await updateLessonProgress(userId, lessonId, currentTime, watchedSeconds);
    lastPosition.current = currentTime;
  };

  // Keep saveProgress reference up-to-date to avoid stale closures in the event listener
  const saveProgressRef = useRef(saveProgress);
  saveProgressRef.current = saveProgress;

  useEffect(() => {
    console.log(lastPosition.current)
    const handleVisibilityChange = () => {
      if (document.hidden) {
        if (lastPosition.current > 0) {
          saveProgressRef.current();
        }
      }
    };

    const handlePageHide = () => {
      if (lastPosition.current > 0) {
        saveProgressRef.current();
      }
    };

    window.addEventListener("pagehide", handlePageHide);
    document.addEventListener("visibilitychange", handleVisibilityChange);

    return () => {
      if (lastPosition.current > 0) {
        saveProgressRef.current();
      }

      document.removeEventListener("visibilitychange", handleVisibilityChange);
      window.removeEventListener("pagehide", handlePageHide);
    };
  }, []);

  const onReady = (event: YouTubeEvent) => {
    playerRef.current = event.target;
    const player = playerRef.current;

    if (stoppedAt) {
      const targetTime = Math.floor(stoppedAt);
      player.seekTo(targetTime, true);
      player.playVideo();
      lastPosition.current = targetTime;
    }
  };

  const onStateChange = (event: YouTubeEvent) => {
    if (event.data === 2) {
      saveProgress();
    }

    if (event.data === 3) {
      isSeeking.current = true;
    }

    if (event.data === 1) {
      isSeeking.current = false;
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
