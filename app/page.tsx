import Link from 'next/link';

export default function Home() {
  return (
    <main className="min-h-screen flex flex-col items-center justify-center p-8">
      <div className="text-center max-w-2xl">
        <h1 className="text-6xl font-bold mb-4 text-blue-600">Skeledle</h1>
        <p className="text-xl mb-8 text-gray-700">
          Test your knowledge of human anatomy! Guess the highlighted body part in 6 tries.
        </p>

        <div className="flex gap-4 justify-center flex-wrap">
          <Link
            href="/daily"
            className="px-8 py-4 bg-blue-600 text-white text-xl font-semibold rounded-lg hover:bg-blue-700 transition-colors"
          >
            Daily Challenge
          </Link>
          <Link
            href="/endless"
            className="px-8 py-4 bg-green-600 text-white text-xl font-semibold rounded-lg hover:bg-green-700 transition-colors"
          >
            Endless Mode
          </Link>
          <Link
            href="/explore"
            className="px-8 py-4 bg-purple-600 text-white text-xl font-semibold rounded-lg hover:bg-purple-700 transition-colors"
          >
            Explorer Mode
          </Link>
        </div>

        <div className="mt-6 flex justify-center">
          <Link
            href="/svg-creator"
            className="px-6 py-3 bg-orange-600 text-white text-lg font-semibold rounded-lg hover:bg-orange-700 transition-colors"
          >
            SVG Annotation Tool
          </Link>
        </div>

        <div className="mt-12 text-left bg-white p-6 rounded-lg shadow-md">
          <h2 className="text-2xl font-bold mb-4">How to Play</h2>
          <ul className="space-y-2 text-gray-700">
            <li>A body part will be highlighted on the diagram</li>
            <li>Search and guess the medical name of the highlighted part</li>
            <li>Get feedback on whether you guessed the correct system and region</li>
            <li>You have 6 guesses to get it right</li>
            <li>Daily mode gives you one puzzle per day</li>
            <li>Endless mode lets you play as many rounds as you want</li>
            <li>Explorer mode lets you study by hovering over bones to see their names</li>
          </ul>
        </div>
      </div>
    </main>
  );
}
