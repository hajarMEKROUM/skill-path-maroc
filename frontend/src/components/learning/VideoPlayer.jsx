import React, { useRef, useState } from 'react';
import ReactPlayer from 'react-player';
import { Play, Pause, Maximize, Volume2, VolumeX } from 'lucide-react';
import useLearningStore from '../../store/learningStore';
import { lessonService } from '../../services/lesson.service';

const VideoPlayer = ({ url, lessonId }) => {
  const playerRef = useRef(null);
  const { markLessonComplete, selectLesson, getNextLessonId } = useLearningStore();
  
  const [playing, setPlaying] = useState(false);
  const [muted, setMuted] = useState(false);
  const [progress, setProgress] = useState(0);

  const handleProgress = (state) => {
    setProgress(state.played);
    
    // Auto-save progress every 10 seconds (mocked condition)
    if (Math.floor(state.playedSeconds) % 10 === 0) {
      lessonService.saveVideoProgress(lessonId, state.playedSeconds).catch(() => {});
    }
  };

  const handleEnded = () => {
    markLessonComplete(lessonId);
    
    // Auto-play next lesson
    const nextLessonId = getNextLessonId();
    if (nextLessonId) {
       selectLesson(nextLessonId);
    }
  };

  return (
    <div className="relative pt-[56.25%] bg-gray-900 rounded-2xl overflow-hidden shadow-2xl group">
      <div className="absolute top-0 left-0 w-full h-full">
        {url ? (
          <ReactPlayer
            ref={playerRef}
            url={url}
            width="100%"
            height="100%"
            playing={playing}
            muted={muted}
            onProgress={handleProgress}
            onEnded={handleEnded}
            controls={true} // Using native controls for robustness, but can build custom UI overlay
            config={{
              youtube: { playerVars: { showinfo: 0, modestbranding: 1 } },
              file: { attributes: { controlsList: 'nodownload' } }
            }}
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center text-gray-500 flex-col">
            <Play size={48} className="mb-4 opacity-50" />
            <p>No video available for this lesson.</p>
          </div>
        )}
      </div>

      {/* Custom Mock Overlay (Optional, if native controls are disabled) */}
      {!playing && url && (
        <div className="absolute inset-0 bg-black/40 flex items-center justify-center transition-opacity cursor-pointer" onClick={() => setPlaying(true)}>
           <div className="w-20 h-20 bg-primary-600/90 rounded-full flex items-center justify-center backdrop-blur-md shadow-glass hover:scale-110 transition-transform">
              <Play className="text-white ml-2" size={32} />
           </div>
        </div>
      )}
    </div>
  );
};

export default VideoPlayer;
