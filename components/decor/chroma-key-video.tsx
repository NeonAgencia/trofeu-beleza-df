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
      if (isProcessing) return;
      isProcessing = true;

      const loop = () => {
        if (video.paused || video.ended) {
          isProcessing = false;
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
            // Avoid breaking on initial frame loading
          }
        }

        animationId = requestAnimationFrame(loop);
      };

      animationId = requestAnimationFrame(loop);
    };

    const int_clamp = (val: number) => {
      return Math.min(255, Math.max(0, Math.round(val)));
    };

    video.addEventListener("play", processFrame);
    video.addEventListener("playing", processFrame);
    video.addEventListener("canplay", processFrame);

    if (!video.paused) {
      processFrame();
    }

    return () => {
      cancelAnimationFrame(animationId);
      video.removeEventListener("play", processFrame);
      video.removeEventListener("playing", processFrame);
      video.removeEventListener("canplay", processFrame);
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
        className="absolute pointer-events-none opacity-0 w-0 h-0"
      />
      <canvas ref={canvasRef} className="w-full h-full object-contain" />
    </div>
  );
}
