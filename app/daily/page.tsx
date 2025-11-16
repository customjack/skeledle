'use client';

import { useState, useEffect } from 'react';
import { GameEngine } from '@/lib/services/GameEngine';
import { GameState, GameStatus } from '@/lib/models/GameState';
import { AnatomicalPart } from '@/lib/models/AnatomicalPart';
import SearchableDropdown from '@/components/SearchableDropdown';
import BodyDiagramSVG from '@/components/BodyDiagramSVG';
import GuessHistory from '@/components/GuessHistory';
import Link from 'next/link';

export default function DailyChallenge() {
  const [gameEngine] = useState(() => new GameEngine());
  const [gameState, setGameState] = useState<GameState | null>(null);
  const [allParts, setAllParts] = useState<AnatomicalPart[]>([]);

  useEffect(() => {
    setAllParts(gameEngine.searchParts(''));
    const newGame = gameEngine.createDailyGame();
    setGameState(newGame);
  }, [gameEngine]);

  const handleGuess = (part: AnatomicalPart) => {
    if (!gameState) return;

    const newState = gameState.makeGuess(part);
    setGameState(newState);
  };

  const resetGame = () => {
    const newGame = gameEngine.createDailyGame();
    setGameState(newGame);
  };

  if (!gameState) {
    return (
      <main className="min-h-screen flex items-center justify-center">
        <p>Loading...</p>
      </main>
    );
  }

  const isGameOver = gameState.status !== GameStatus.PLAYING;
  const hasWon = gameState.status === GameStatus.WON;

  return (
    <main className="min-h-screen p-8">
      <div className="max-w-6xl mx-auto">
        <div className="text-center mb-8">
          <h1 className="text-5xl font-bold mb-2 text-blue-600">Skeledle</h1>
          <p className="text-lg text-gray-600">Daily Challenge</p>
        </div>

        <div className="grid md:grid-cols-2 gap-8">
          {/* Left side - Body diagram */}
          <div className="flex flex-col items-center">
            <div className="bg-white p-6 rounded-lg shadow-lg w-full">
              <h2 className="text-2xl font-bold mb-4 text-center">
                What is this part?
              </h2>
              <BodyDiagramSVG highlightedPart={gameState.targetPart} />
            </div>
          </div>

          {/* Right side - Game controls */}
          <div className="flex flex-col">
            <div className="bg-white p-6 rounded-lg shadow-lg mb-4">
              <div className="mb-4">
                <div className="flex justify-between items-center mb-2">
                  <span className="text-lg font-semibold">
                    Guesses Remaining: {gameState.getRemainingGuesses()}
                  </span>
                  <Link
                    href="/"
                    className="px-4 py-2 bg-gray-200 text-gray-800 rounded-lg hover:bg-gray-300 transition-colors"
                  >
                    Back to Menu
                  </Link>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-2">
                  <div
                    className="bg-blue-600 h-2 rounded-full transition-all"
                    style={{
                      width: `${(gameState.getRemainingGuesses() / 6) * 100}%`,
                    }}
                  />
                </div>
              </div>

              {!isGameOver ? (
                <>
                  <SearchableDropdown
                    parts={allParts}
                    onSelect={handleGuess}
                    disabled={isGameOver}
                  />
                  <p className="text-sm text-gray-600 mt-2">
                    Type to search for anatomical parts
                  </p>
                </>
              ) : (
                <div className="text-center py-8">
                  {hasWon ? (
                    <>
                      <h2 className="text-3xl font-bold text-green-600 mb-2">
                        Congratulations!
                      </h2>
                      <p className="text-xl mb-4">
                        You correctly identified the {gameState.targetPart.name}!
                      </p>
                    </>
                  ) : (
                    <>
                      <h2 className="text-3xl font-bold text-red-600 mb-2">
                        Game Over
                      </h2>
                      <p className="text-xl mb-4">
                        The correct answer was: <br />
                        <span className="font-bold">{gameState.targetPart.name}</span>
                        <br />
                        <span className="text-gray-600">
                          ({gameState.targetPart.commonName})
                        </span>
                      </p>
                    </>
                  )}

                  <button
                    onClick={resetGame}
                    className="px-8 py-3 bg-blue-600 text-white text-lg font-semibold rounded-lg hover:bg-blue-700 transition-colors"
                  >
                    Play Again Tomorrow
                  </button>
                </div>
              )}
            </div>

            <GuessHistory guesses={gameState.guesses} />
          </div>
        </div>
      </div>
    </main>
  );
}
