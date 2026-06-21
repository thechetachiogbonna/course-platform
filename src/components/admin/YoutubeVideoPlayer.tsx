"use client"

import YouTube from "react-youtube"

export default function YouTubeVideoPlayer({
  videoId,
  onFinishedVideo,
}: {
  videoId: string
  onFinishedVideo?: () => void
}) {
  return (
    <YouTube
      videoId={videoId}
      className="aspect-video"
      opts={{ width: "100%", height: "100%" }}
      onEnd={onFinishedVideo}
    />
  )
}