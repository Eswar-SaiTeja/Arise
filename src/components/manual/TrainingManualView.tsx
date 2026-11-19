import React, { useState, useEffect } from 'react';
import { 
  BookOpen, 
  Bookmark, 
  CheckCircle2, 
  Clock, 
  AlertTriangle, 
  Lightbulb, 
  ShieldAlert, 
  ChevronRight, 
  Search,
  Sparkles,
  ArrowLeft,
  Share2
} from 'lucide-react';
import { ManualChapter } from '../../types';
import { storageService } from '../../services/storageService';
import { hunterService } from '../../services/hunterService';

export const TrainingManualView: React.FC = () => {
  const [chapters, setChapters] = useState<ManualChapter[]>(() => storageService.getManualChapters());
  const [selectedChapterId, setSelectedChapterId] = useState<string>('ch-1');
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [readingProgress, setReadingProgress] = useState<Record<string, number>>(() => storageService.getReadingProgress());
  const [bookmarks, setBookmarks] = useState(() => storageService.getBookmarks());

  const activeChapter = chapters.find(c => c.id === selectedChapterId) || chapters[0];
  const isCurrentBookmarked = storageService.isBookmarked('chapter', activeChapter.id);

  const handleToggleBookmark = () => {
    storageService.toggleBookmark('chapter', activeChapter.id);
    setBookmarks(storageService.getBookmarks());
  };

  const handleMarkCompleted = () => {
    storageService.saveReadingProgress(activeChapter.id, 100);
    setReadingProgress(storageService.getReadingProgress());
    storageService.unlockAchievement('ach-manual-scholar');
    hunterService.awardXP(80, 'manual', `Completed Manual Chapter ${activeChapter.chapterNumber}: ${activeChapter.title}`);
  };

  // Filter chapters by search
  const filteredChapters = chapters.filter(c => 
    c.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
    c.overview.toLowerCase().includes(searchQuery.toLowerCase()) ||
    c.sections.some(s => s.title.toLowerCase().includes(searchQuery.toLowerCase()))
  );

  // Overall manual completion percentage
  const totalChapters = chapters.length;
  const completedChaptersCount = Object.values(readingProgress).filter(p => p >= 100).length;
  const overallPercent = Math.round((completedChaptersCount / totalChapters) * 100);

  return (
    <div className="space-y-6 pb-20">
      {/* Top Banner / Manual Stats Header */}
      <div className="bg-gradient-to-r from-[#141A28] to-[#0E121A] border border-[#252D3E] rounded-3xl p-6 relative overflow-hidden">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div className="space-y-2">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-lime-accent/10 border border-lime-accent/30 text-lime-accent font-mono text-xs font-semibold">
              <BookOpen className="w-3.5 h-3.5" />
              <span>THE COMPREHENSIVE TRAINING COMPENDIUM</span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-black text-white font-display">
              Comprehensive Fitness Manual
            </h1>
            <p className="text-sm text-gray-300 max-w-2xl">
              An evidence-based training curriculum engineered for physiological adaptation, injury resilience, progressive overload, and elite nutrition.
            </p>
          </div>

          {/* Reading Progress Dial / Bar */}
          <div className="bg-[#181E2B] border border-[#252D3E] rounded-2xl p-4 min-w-[220px]">
            <div className="flex items-center justify-between text-xs font-mono mb-2">
              <span className="text-gray-400">CURRICULUM PROGRESS</span>
              <span className="text-lime-accent font-bold">{overallPercent}%</span>
            </div>
            <div className="w-full h-2.5 bg-[#0A0D14] rounded-full overflow-hidden mb-2">
              <div 
                className="h-full bg-gradient-to-r from-lime-accent to-emerald-400 transition-all duration-500 rounded-full"
                style={{ width: `${overallPercent}%` }}
              />
            </div>
            <div className="text-[11px] text-gray-400 font-mono">
              {completedChaptersCount} of {totalChapters} Chapters Completed
            </div>
          </div>
        </div>
      </div>

      {/* Main Content Layout: Chapter Sidebar + Reader Pane */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        {/* Left Column: Chapters Navigation & Search (4 cols) */}
        <div className="lg:col-span-4 space-y-4">
          {/* Search Box */}
          <div className="relative">
            <Search className="w-4 h-4 text-gray-400 absolute left-3.5 top-3.5" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search chapters, drills, concepts..."
              className="w-full bg-[#141923] border border-[#252D3E] rounded-xl pl-10 pr-4 py-2.5 text-sm text-white placeholder-gray-500 focus:outline-none focus:border-lime-accent transition-colors"
            />
          </div>

          {/* Chapters List */}
          <div className="space-y-2">
            {filteredChapters.map((chapter) => {
              const isSelected = chapter.id === selectedChapterId;
              const progress = readingProgress[chapter.id] || 0;
              const isDone = progress >= 100;
              const isBookmarked = storageService.isBookmarked('chapter', chapter.id);

              return (
                <div
                  key={chapter.id}
                  onClick={() => setSelectedChapterId(chapter.id)}
                  className={`p-4 rounded-2xl cursor-pointer transition-all border ${
                    isSelected
                      ? 'bg-lime-accent/10 border-lime-accent/40 shadow-sm'
                      : 'bg-[#141923] border-[#252D3E] hover:border-white/20'
                  }`}
                >
                  <div className="flex items-center justify-between mb-1.5">
                    <span className="text-[11px] font-mono font-bold uppercase tracking-wider text-lime-accent">
                      Chapter {chapter.chapterNumber}
                    </span>
                    <div className="flex items-center gap-1.5">
                      {isBookmarked && (
                        <Bookmark className="w-3.5 h-3.5 text-amber-400 fill-amber-400" />
                      )}
                      {isDone && (
                        <CheckCircle2 className="w-4 h-4 text-lime-accent fill-lime-accent/20" />
                      )}
                    </div>
                  </div>

                  <h3 className="text-sm font-bold text-white mb-2 line-clamp-1">
                    {chapter.title.split(': ')[1] || chapter.title}
                  </h3>

                  <div className="flex items-center justify-between text-xs font-mono text-gray-400">
                    <span className="flex items-center gap-1">
                      <Clock className="w-3 h-3 text-gray-400" />
                      {chapter.estimatedReadTimeMin} min read
                    </span>
                    <span className={isDone ? 'text-lime-accent font-semibold' : 'text-gray-400'}>
                      {isDone ? 'Completed' : progress > 0 ? `${progress}% Read` : 'Unread'}
                    </span>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Right Column: Full Reader Pane (8 cols) */}
        <div className="lg:col-span-8 bg-[#141923] border border-[#252D3E] rounded-3xl p-6 sm:p-8 space-y-8">
          {/* Chapter Header */}
          <div className="space-y-3 pb-6 border-b border-[#252D3E]">
            <div className="flex items-center justify-between">
              <span className="text-xs font-mono font-bold uppercase tracking-widest text-lime-accent bg-lime-accent/10 px-3 py-1 rounded-full border border-lime-accent/30">
                CHAPTER {activeChapter.chapterNumber} OF {chapters.length}
              </span>

              <div className="flex items-center gap-2">
                <button
                  onClick={handleToggleBookmark}
                  className={`p-2 rounded-xl border transition-colors ${
                    isCurrentBookmarked
                      ? 'bg-amber-500/20 text-amber-300 border-amber-500/40'
                      : 'bg-white/5 text-gray-400 border-white/10 hover:text-white'
                  }`}
                  title="Bookmark Chapter"
                >
                  <Bookmark className={`w-4 h-4 ${isCurrentBookmarked ? 'fill-current' : ''}`} />
                </button>
                <button
                  onClick={handleMarkCompleted}
                  className="px-3 py-1.5 rounded-xl bg-lime-accent/10 border border-lime-accent/30 text-lime-accent hover:bg-lime-accent hover:text-black font-semibold text-xs transition-all flex items-center gap-1.5 font-mono"
                >
                  <CheckCircle2 className="w-4 h-4" />
                  <span>Mark Completed</span>
                </button>
              </div>
            </div>

            <h1 className="text-2xl sm:text-3xl font-black text-white font-display">
              {activeChapter.title}
            </h1>
            <p className="text-sm font-medium text-gray-300">
              {activeChapter.subtitle}
            </p>

            <div className="flex items-center gap-4 text-xs font-mono text-gray-400 pt-2">
              <span className="flex items-center gap-1.5">
                <Clock className="w-3.5 h-3.5 text-lime-accent" />
                Estimated read: {activeChapter.estimatedReadTimeMin} minutes
              </span>
              <span className="text-gray-400">•</span>
              <span>Evidence-based curriculum</span>
            </div>
          </div>

          {/* Chapter Overview Box */}
          <div className="p-5 rounded-2xl bg-[#181E2B] border-l-4 border-l-lime-accent border-r border-t border-b border-[#252D3E] text-gray-200 text-sm leading-relaxed">
            <strong className="block text-white font-semibold mb-1 text-xs uppercase tracking-wider font-mono text-lime-accent">
              EXECUTIVE BRIEF
            </strong>
            {activeChapter.overview}
          </div>

          {/* Structured Chapter Sections */}
          <div className="space-y-8">
            {activeChapter.sections.map((section, idx) => (
              <section key={idx} className="space-y-4">
                <h2 className="text-xl font-bold text-white font-display border-b border-white/5 pb-2">
                  {section.title}
                </h2>

                <div className="text-gray-300 text-sm leading-relaxed whitespace-pre-line space-y-3 font-normal">
                  {section.content}
                </div>

                {/* Important Tips Callout */}
                {section.tips && section.tips.length > 0 && (
                  <div className="p-4 rounded-2xl bg-emerald-950/20 border border-emerald-500/30 space-y-2">
                    <div className="flex items-center gap-2 text-emerald-400 font-semibold text-xs uppercase font-mono tracking-wider">
                      <Lightbulb className="w-4 h-4" />
                      <span>Elite Coaching Tips</span>
                    </div>
                    <ul className="list-disc list-inside space-y-1 text-xs text-gray-200">
                      {section.tips.map((tip, tIdx) => (
                        <li key={tIdx} className="leading-relaxed">{tip}</li>
                      ))}
                    </ul>
                  </div>
                )}

                {/* Common Mistakes */}
                {section.commonMistakes && section.commonMistakes.length > 0 && (
                  <div className="p-4 rounded-2xl bg-amber-950/20 border border-amber-500/30 space-y-2">
                    <div className="flex items-center gap-2 text-amber-400 font-semibold text-xs uppercase font-mono tracking-wider">
                      <AlertTriangle className="w-4 h-4" />
                      <span>Frequent Biomechanical Errors</span>
                    </div>
                    <ul className="list-disc list-inside space-y-1 text-xs text-gray-200">
                      {section.commonMistakes.map((mistake, mIdx) => (
                        <li key={mIdx} className="leading-relaxed">{mistake}</li>
                      ))}
                    </ul>
                  </div>
                )}

                {/* Safety Guidelines */}
                {section.safetyGuidelines && section.safetyGuidelines.length > 0 && (
                  <div className="p-4 rounded-2xl bg-red-950/20 border border-red-500/30 space-y-2">
                    <div className="flex items-center gap-2 text-red-400 font-semibold text-xs uppercase font-mono tracking-wider">
                      <ShieldAlert className="w-4 h-4" />
                      <span>Non-Negotiable Safety Protocols</span>
                    </div>
                    <ul className="list-disc list-inside space-y-1 text-xs text-gray-200">
                      {section.safetyGuidelines.map((safe, sIdx) => (
                        <li key={sIdx} className="leading-relaxed">{safe}</li>
                      ))}
                    </ul>
                  </div>
                )}
              </section>
            ))}
          </div>

          {/* Key Takeaways Box */}
          <div className="p-6 rounded-2xl bg-[#101520] border border-lime-accent/30 space-y-3">
            <h3 className="text-sm font-bold text-lime-accent font-display uppercase tracking-wider flex items-center gap-2">
              <Sparkles className="w-4 h-4" />
              <span>Chapter {activeChapter.chapterNumber} Core Principles</span>
            </h3>
            <ul className="space-y-2 text-sm text-gray-200">
              {activeChapter.keyTakeaways.map((point, kIdx) => (
                <li key={kIdx} className="flex items-start gap-2.5">
                  <CheckCircle2 className="w-4 h-4 text-lime-accent shrink-0 mt-0.5" />
                  <span>{point}</span>
                </li>
              ))}
            </ul>
          </div>

          {/* Footer Navigation: Next Chapter Button */}
          <div className="pt-6 border-t border-[#252D3E] flex items-center justify-between">
            <button
              onClick={() => {
                const prevIdx = chapters.findIndex(c => c.id === activeChapter.id) - 1;
                if (prevIdx >= 0) setSelectedChapterId(chapters[prevIdx].id);
              }}
              disabled={activeChapter.chapterNumber === 1}
              className="px-4 py-2.5 rounded-xl border border-[#252D3E] text-xs font-semibold text-gray-400 hover:text-white disabled:opacity-30 disabled:pointer-events-none flex items-center gap-2"
            >
              <ArrowLeft className="w-4 h-4" />
              <span>Previous Chapter</span>
            </button>

            <button
              onClick={() => {
                handleMarkCompleted();
                const nextIdx = chapters.findIndex(c => c.id === activeChapter.id) + 1;
                if (nextIdx < chapters.length) setSelectedChapterId(chapters[nextIdx].id);
              }}
              className="px-5 py-2.5 rounded-xl bg-lime-accent hover:bg-lime-400 text-black font-bold text-xs flex items-center gap-2 transition-all shadow-glow-lime"
            >
              <span>Complete & Proceed</span>
              <ChevronRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
