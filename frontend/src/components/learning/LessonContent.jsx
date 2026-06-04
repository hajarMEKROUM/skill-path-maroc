import React from 'react';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import { Download, FileText } from 'lucide-react';
import useLearningStore from '../../store/learningStore';

const LessonContent = () => {
  const { currentLesson } = useLearningStore();

  if (!currentLesson) return null;

  return (
    <div className="mt-8 bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
      
      {/* Header Tabs */}
      <div className="flex border-b border-gray-200">
        <button className="px-6 py-4 text-sm font-medium text-primary-600 border-b-2 border-primary-600">
          Lesson Overview
        </button>
        <button className="px-6 py-4 text-sm font-medium text-gray-500 hover:text-gray-700 transition-colors">
          Q&A
        </button>
        <button className="px-6 py-4 text-sm font-medium text-gray-500 hover:text-gray-700 transition-colors">
          Notes
        </button>
      </div>

      <div className="p-8">
        <h2 className="text-2xl font-bold text-gray-900 mb-6">{currentLesson.title}</h2>
        
        {/* Markdown Content rendered from backend API */}
        <div className="prose prose-blue max-w-none prose-headings:font-bold prose-a:text-primary-600">
          <ReactMarkdown remarkPlugins={[remarkGfm]}>
            {currentLesson.content || '*No textual content provided for this lesson.*'}
          </ReactMarkdown>
        </div>

        {/* Attachments Section */}
        {currentLesson.attachments && currentLesson.attachments.length > 0 && (
          <div className="mt-10 pt-8 border-t border-gray-100">
            <h3 className="text-lg font-bold text-gray-900 mb-4 flex items-center">
              <FileText className="mr-2 text-gray-400" size={20} />
              Resources & Downloads
            </h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {currentLesson.attachments.map((file, idx) => (
                <a 
                  key={idx} 
                  href={file.url} 
                  target="_blank" 
                  rel="noreferrer"
                  className="flex items-center p-4 border border-gray-200 rounded-xl hover:bg-gray-50 transition-colors group"
                >
                  <div className="w-10 h-10 bg-primary-50 text-primary-600 rounded-lg flex items-center justify-center mr-3 group-hover:bg-primary-100 transition-colors">
                    <Download size={20} />
                  </div>
                  <div>
                    <p className="text-sm font-medium text-gray-900">{file.name}</p>
                    <p className="text-xs text-gray-500">{file.size}</p>
                  </div>
                </a>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default LessonContent;
