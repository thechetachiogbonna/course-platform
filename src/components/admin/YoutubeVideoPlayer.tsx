"use client";

import { updateLessonProgress } from "@/features/lessons/action";
import { useEffect, useRef } from "react";
import YouTube, { YouTubeEvent } from "react-youtube";
import { Button } from "../ui/button";

type Prop1 = {
  action: true;
  videoId: string;
  userId: string;
  lessonId: string;
  stoppedAt: number;
  completed: boolean
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
  completed
}: Prop1) {
  const playerRef = useRef<YouTubeEvent["target"]>(null);
  const lastPosition = useRef(0);
  const isSeeking = useRef(false);

  const saveProgress = async () => {
    const player = playerRef.current;
    if (!player) return;

    const currentTime = Math.floor(player.getCurrentTime());

    if (lastPosition.current === currentTime) return;

    if (isSeeking.current) {
      lastPosition.current = currentTime;
      isSeeking.current = false;
      return;
    }

    const watchedSeconds = currentTime - lastPosition.current;

    await updateLessonProgress(userId, lessonId, currentTime, watchedSeconds, completed);
    lastPosition.current = currentTime;
  };

  const sendProgressBeacon = () => {
    const player = playerRef.current;
    if (!player) return;

    const currentTime = Math.floor(player.getCurrentTime());

    if (lastPosition.current === currentTime) return;

    if (isSeeking.current) {
      lastPosition.current = currentTime;
      isSeeking.current = false;
      return;
    }

    const watchedSeconds = currentTime - lastPosition.current;

    navigator.sendBeacon(
      "/api/progress",
      JSON.stringify({
        userId,
        lessonId,
        currentTime,
        watchedSeconds,
        completed
      })
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
    
    // if user seeks the video
    if (event.data === 3) {
      isSeeking.current = true;
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
