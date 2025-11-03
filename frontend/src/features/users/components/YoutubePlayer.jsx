import { useState, useEffect, useRef } from "react";
import { motion } from "framer-motion";
import YouTube from "react-youtube";

export default function YoutubePlayer({ url, playRef, onMessage }) {
  const [playing, setPlaying] = useState(false);
  const [mute, setMute] = useState(false);
  const [volume, setVolume] = useState(80);
  const [duration, setDuration] = useState(0);
  const [currentTime, setCurrentTime] = useState(0);
  const [isLoading, setIsLoading] = useState(true);

  const onReady = (event) => {
    playRef.current = event.target;
    setDuration(event.target.getDuration());
    setIsLoading(false);
  };

  const handleSeek = (e) => {
    const newTime = parseFloat(e.target.value);
    playRef.current?.seekTo(newTime);
    setCurrentTime(newTime);
  };

  const handleVolumeChange = (e) => {
    const newVolume = parseInt(e.target.value);
    setVolume(newVolume);
    playRef.current?.setVolume(newVolume);
  };

  const handleMute = () => {
    if (mute) playRef.current?.unMute();
    else playRef.current?.mute();
    setMute((prev) => !prev);
  };

  const handlePlayPause = () => {
    if (playing) playRef.current?.pauseVideo();
    else playRef.current?.playVideo();
    setPlaying((prev) => !prev);
  };

  useEffect(() => {
    const interval = setInterval(() => {
      if (playRef.current && playing) {
        setCurrentTime(playRef.current.getCurrentTime());
      }
    }, 1000);
    return () => clearInterval(interval);
  }, [playing]);

  const formatTime = (time) => {
    const minutes = Math.floor(time / 60);
    const seconds = Math.floor(time % 60);
    return `${minutes}:${seconds.toString().padStart(2, "0")}`;
  };

  return (
    <div className="w-full flex flex-col items-center my-6">
      {/* Player Box */}
      <div className="relative w-full max-w-4xl rounded-xl overflow-hidden shadow-2xl">
        {isLoading && (
          <div className="absolute inset-0 flex items-center justify-center bg-gray-900/90">
            <motion.div
              animate={{ rotate: 360 }}
              transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
              className="w-10 h-10 border-4 border-indigo-500 border-t-transparent rounded-full"
            />
          </div>
        )}
        <YouTube
          videoId="Sv6dMFF_yts"
          onReady={onReady}
          opts={{
            height: "480",
            width: "100%",
            playerVars: { autoplay: 0, controls: 0 },
          }}
          className="w-full aspect-video"
        />
      </div>

      {/* Controls Below */}
      <div className="w-full max-w-4xl bg-gray-900 text-white p-4 rounded-b-xl mt-1 space-y-4">
        {/* Progress Bar */}
        <div className="flex items-center gap-3 text-sm">
          <span className="w-12 text-right text-gray-300">
            {formatTime(currentTime)}
          </span>
          <input
            type="range"
            min={0}
            max={duration}
            step="0.1"
            value={currentTime}
            onChange={handleSeek}
            className="w-full accent-red-500 cursor-pointer"
          />
          <span className="w-12 text-gray-300">{formatTime(duration)}</span>
        </div>

        {/* Buttons Row */}
        <div className="flex justify-between items-center">
          <div className="flex items-center gap-4">
            <button
              onClick={handlePlayPause}
              className="bg-red-600 hover:bg-red-700 px-6 py-2 rounded-md font-semibold shadow-md transition"
            >
              {playing ? "⏸ Pause" : "▶ Play"}
            </button>
            <button
              onClick={handleMute}
              className="bg-gray-700 hover:bg-gray-600 px-6 py-2 rounded-md font-semibold shadow-md transition"
            >
              {mute ? "🔊 Unmute" : "🔇 Mute"}
            </button>
          </div>

          <div className="flex items-center gap-2">
            <span className="text-sm text-gray-300">Volume</span>
            <input
              type="range"
              min={0}
              max={100}
              step="1"
              value={volume}
              onChange={handleVolumeChange}
              className="accent-blue-400 cursor-pointer w-32"
            />
          </div>
        </div>
      </div>
    </div>
  );
}
