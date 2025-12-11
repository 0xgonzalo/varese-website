export default function Music() {
  return (
    <div id="musica" className="relative min-h-screen w-full">
      {/* Background Image */}
      <div
        className="absolute inset-0 bg-cover bg-center bg-no-repeat"
        style={{ backgroundImage: "url('/bg-music.jpg')" }}
      >
        {/* Dark overlay */}
        <div className="absolute inset-0 bg-black/50" />
      </div>

      {/* Content */}
      <div className="relative z-10 flex min-h-screen flex-col items-center justify-center px-4 md:px-8 py-20">
        <h2 className="mb-12 text-4xl md:text-5xl font-bold tracking-wider text-white">
          MÚSICA
        </h2>

        <div className="rounded-lg bg-black/30 p-3 md:p-4 backdrop-blur-sm w-full max-w-sm">
          <iframe
            src="https://open.spotify.com/embed/artist/5DG278QHnEKfWW9zAGFeRg"
            width="100%"
            height="380"
            allow="encrypted-media"
            title="Spotify Player"
            className="rounded-lg"
          />
        </div>
      </div>
    </div>
  );
}
