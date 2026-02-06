import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'About | FanverseDaily',
  description: 'Learn about FanverseDaily - your ultimate source for entertainment news covering Gaming, Movies, TV, Anime and Pop Culture.',
  alternates: {
    canonical: '/about',
  },
};

// About page with SSR
export default function AboutPage() {
  return (
    <main className="pt-24 pb-16">
      <div className="container px-4 md:px-6 max-w-4xl">
        <h1 className="text-4xl md:text-5xl font-bold mb-12">
          About
        </h1>

        <div className="prose prose-lg dark:prose-invert max-w-none">
          <p className="text-xl text-foreground mb-8">
            <strong>FanverseDaily</strong> is your daily destination for everything
            entertainment — from the latest gaming releases and movie news to TV show
            updates, anime drops, and the pulse of pop culture.
          </p>

          <p className="text-muted-foreground mb-6">
            We cover the stories that matter to fans. Whether it's a surprise game
            announcement, a blockbuster trailer breakdown, the next big anime season,
            or trending moments across the entertainment world — we're here to keep
            you in the loop.
          </p>

          <p className="text-muted-foreground mb-6">
            Our coverage spans across <strong>Gaming</strong>, <strong>Movies</strong>,
            <strong> TV</strong>, <strong>Anime</strong>, and <strong>Pop Culture</strong>.
            We believe entertainment news should be accessible, timely, and genuinely
            useful for fans who want to stay connected to the worlds they love.
          </p>

          <p className="text-muted-foreground mb-6">
            FanverseDaily isn't just about reporting news — it's about celebrating
            fan culture and the communities that make entertainment exciting. From
            casual viewers to dedicated enthusiasts, there's something here for everyone.
          </p>

          <p className="text-muted-foreground">
            Thanks for stopping by. Stay curious, stay entertained.
          </p>
        </div>
      </div>
    </main>
  );
}

