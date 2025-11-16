'use client';

import { Guess } from '@/lib/models/GameState';

interface GuessHistoryProps {
  guesses: Guess[];
}

export default function GuessHistory({ guesses }: GuessHistoryProps) {
  if (guesses.length === 0) {
    return null;
  }

  return (
    <div className="w-full max-w-2xl mx-auto mt-6">
      <h2 className="text-xl font-bold mb-3">Your Guesses</h2>
      <div className="space-y-2">
        {guesses.map((guess, index) => (
          <div
            key={index}
            className="border-2 border-gray-300 rounded-lg p-4 bg-white"
          >
            <div className="flex justify-between items-start">
              <div>
                <div className="font-semibold text-lg">{guess.part.name}</div>
                <div className="text-sm text-gray-600">{guess.part.commonName}</div>
              </div>
              <div className="text-right text-sm">
                <div className="space-y-1">
                  <div className={`px-2 py-1 rounded ${guess.hint.correctSystem ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'}`}>
                    System: {guess.hint.correctSystem ? '✓' : '✗'}
                  </div>
                  <div className={`px-2 py-1 rounded ${guess.hint.correctRegion ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'}`}>
                    Region: {guess.hint.correctRegion ? '✓' : '✗'}
                  </div>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
