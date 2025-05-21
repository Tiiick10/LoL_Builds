export default function HeroSection() {
  return (
    <section className="bg-gradient-to-b from-gray-900 to-gray-800 text-white py-20 px-4 text-center">
      <h1 className="text-4xl md:text-5xl font-extrabold mb-4">League of Builds</h1>
      <p className="text-lg md:text-xl text-gray-300 mb-6">
        Discover, vote and share your favorite champions builds
      </p>
      <div className="flex justify-center gap-4">
        <a
          href="/builds"
          className="bg-indigo-600 hover:bg-indigo-500 text-white font-semibold py-3 px-6 rounded-full transition"
        >
          See builds
        </a>
        <a
          href="/articles"
          className="bg-gray-700 hover:bg-gray-600 text-white font-semibold py-3 px-6 rounded-full transition"
        >
          See articles
        </a>
      </div>
    </section>
  )
}
