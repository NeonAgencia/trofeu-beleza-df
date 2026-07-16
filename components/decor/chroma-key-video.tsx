"use client";

import { useEffect, useRef } from "react";

type ChromaKeyVideoProps = {
  src: string;
  className?: string;
};

export function ChromaKeyVideo({ src, className }: ChromaKeyVideoProps) {
  const videoRef = useRef<HTMLVideoElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const video = videoRef.current;
    const canvas = canvasRef.current;
    if (!video || !canvas) return;

    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    let animationId: number;
    let isProcessing = false;

    const processFrame = () => {
      if (video.paused || video.ended) {
        animationId = requestAnimationFrame(processFrame);
        return;
      }

      // Configure dimensions of canvas to match video
      if (canvas.width !== video.videoWidth && video.videoWidth > 0) {
        canvas.width = video.videoWidth;
        canvas.height = video.videoHeight;
      }

      if (canvas.width > 0 && canvas.height > 0) {
        ctx.drawImage(video, 0, 0, canvas.width, canvas.height);
        try {
          const frame = ctx.getImageData(0, 0, canvas.width, canvas.height);
          const data = frame.data;
          const length = data.length;

          for (let i = 0; i < length; i += 4) {
            const r = data[i + 0];
            const g = data[i + 1];
            const b = data[i + 2];

            // Dominant green color keying formula
            // Green screen is pure vibrant green (e.g. #00b140 or similar)
            if (g > 80 && g > r * 1.3 && g > b * 1.3) {
              data[i + 3] = 0; // set alpha transparent
            } else {
              // Apply soft spill suppression on edges
              const green_excess = g - Math.max(r, b);
              if (green_excess > 10) {
                data[i + 1] = Math.max(r, b); // neutralize green tint
                data[i + 3] = Math.max(0, 255 - int_clamp(green_excess * 4.5)); // smooth edge transparency
              }
            }
          }
          ctx.putImageData(frame, 0, 0);
        } catch (e) {
          // Avoid breaking on initial frame loading or cross-origin hiccups
        }
      }

      animationId = requestAnimationFrame(processFrame);
    };

    const int_clamp = (val: number) => {
      return Math.min(255, Math.max(0, Math.round(val)));
    };

    video.addEventListener("play", () => {
      processFrame();
    });

    if (!video.paused) {
      processFrame();
    }

    return () => {
      cancelAnimationFrame(animationId);
    };
  }, [src]);

  return (
    <div className={className}>
      <video
        ref={videoRef}
        src={src}
        autoPlay
        loop
        muted
        playsInline
        crossOrigin="anonymous"
        className="hidden"
      />
      <canvas ref={canvasRef} className="w-full h-full object-contain" />
    </div>
  );
}
