import React, { useState, useEffect, useRef } from 'react';
import { Volume2, VolumeX, Music } from 'lucide-react';

export const BackgroundMusicPlayer: React.FC = () => {
  const [isPlaying, setIsPlaying] = useState<boolean>(false);
  const [userToggled, setUserToggled] = useState<boolean>(false);
  const audioRef = useRef<HTMLAudioElement | null>(null);

  useEffect(() => {
    // Check if user previously muted
    const storedPreference = localStorage.getItem('displaceos_bg_music');
    const isMuted = storedPreference === 'muted';

    const audio = new Audio('/background-sound.mp3');
    audio.loop = true;
    audio.volume = 0.45;
    audioRef.current = audio;

    // Fallback if background-sound fails, try background sound.mp3
    audio.onerror = () => {
      if (audioRef.current && audioRef.current.src.includes('background-sound.mp3')) {
        audioRef.current.src = encodeURI('/background sound.mp3');
        if (isPlaying) {
          audioRef.current.play().catch(() => {});
        }
      }
    };

    // Try auto-play on first click anywhere on the page
    const startAudioOnInteraction = () => {
      if (!isMuted && audioRef.current && audioRef.current.paused) {
        audioRef.current
          .play()
          .then(() => {
            setIsPlaying(true);
          })
          .catch(() => {
            // Autoplay blocked until further user gesture
          });
      }
    };

    if (!isMuted) {
      window.addEventListener('click', startAudioOnInteraction, { once: true });
      window.addEventListener('keydown', startAudioOnInteraction, { once: true });
      window.addEventListener('touchstart', startAudioOnInteraction, { once: true });
    }

    return () => {
      window.removeEventListener('click', startAudioOnInteraction);
      window.removeEventListener('keydown', startAudioOnInteraction);
      window.removeEventListener('touchstart', startAudioOnInteraction);
      if (audioRef.current) {
        audioRef.current.pause();
      }
    };
  }, []);

  const toggleAudio = (e: React.MouseEvent) => {
    e.stopPropagation();
    setUserToggled(true);
    if (!audioRef.current) return;

    if (isPlaying) {
      audioRef.current.pause();
      setIsPlaying(false);
      localStorage.setItem('displaceos_bg_music', 'muted');
    } else {
      audioRef.current
        .play()
        .then(() => {
          setIsPlaying(true);
          localStorage.setItem('displaceos_bg_music', 'playing');
        })
        .catch((err) => {
          console.warn('Audio play failed:', err);
        });
    }
  };

  return (
    <div className="fixed bottom-4 right-4 z-50">
      <button
        onClick={toggleAudio}
        title={isPlaying ? 'Mute Background Audio' : 'Play Background Audio'}
        className={`flex items-center gap-2 px-3 py-2 rounded-full border shadow-2xl backdrop-blur-md transition-all duration-300 font-mono text-xs select-none ${
          isPlaying
            ? 'bg-cyan-950/90 border-cyan-400/60 text-cyan-300 shadow-cyan-500/20 hover:scale-105'
            : 'bg-slate-900/90 border-slate-700/80 text-slate-400 hover:text-slate-200 hover:border-slate-500'
        }`}
      >
        {isPlaying ? (
          <>
            <div className="flex items-center gap-0.5 h-3">
              <span className="w-0.5 h-3 bg-cyan-400 animate-pulse rounded-full"></span>
              <span className="w-0.5 h-2 bg-cyan-400 animate-pulse delay-75 rounded-full"></span>
              <span className="w-0.5 h-3.5 bg-cyan-400 animate-pulse delay-150 rounded-full"></span>
              <span className="w-0.5 h-1.5 bg-cyan-400 animate-pulse delay-100 rounded-full"></span>
            </div>
            <Volume2 className="w-4 h-4 text-cyan-400" />
            <span className="font-bold tracking-wider text-[11px] uppercase">AUDIO ON</span>
          </>
        ) : (
          <>
            <VolumeX className="w-4 h-4 text-slate-400" />
            <span className="font-medium tracking-wider text-[11px] uppercase">AUDIO OFF</span>
          </>
        )}
      </button>
    </div>
  );
};
