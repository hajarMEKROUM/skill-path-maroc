import React from 'react';
import { Play } from 'lucide-react';

const isYouTubeEmbed = (url) => /youtube\.com\/embed\/[a-zA-Z0-9_-]+/.test(url ?? '');

const VideoPlayer = ({ url }) => {
  if (!url) {
    return null;
  }

  if (isYouTubeEmbed(url)) {
    return (
      <div className="w-full aspect-video bg-gray-900 rounded-xl overflow-hidden shadow-lg ring-1 ring-gray-200">
        <iframe
          src={url}
          title="Vidéo de la leçon"
          className="w-full h-full border-0"
          allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
          allowFullScreen
        />
      </div>
    );
  }

  return (
    <div className="w-full aspect-video bg-gray-900 rounded-xl overflow-hidden shadow-lg ring-1 ring-gray-200 flex items-center justify-center">
      <a
        href={url}
        target="_blank"
        rel="noreferrer"
        className="inline-flex items-center gap-2 px-5 py-3 bg-primary-600 text-white rounded-lg hover:bg-primary-700 transition-colors"
      >
        <Play size={20} />
        Ouvrir la vidéo
      </a>
    </div>
  );
};

export default VideoPlayer;
