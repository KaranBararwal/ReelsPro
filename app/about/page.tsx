"use client";

export default function About() {
  return (
    <main className="container mx-auto px-4 py-12">
      <h1 className="text-4xl font-bold mb-6 text-center">About Us</h1>
      <p className="text-lg text-gray-700 mb-6 text-center">
        Welcome to <span className="font-semibold">Image Kit ReelsPro</span> — your ultimate platform for sharing and discovering amazing videos.
      </p>

      <section className="grid grid-cols-1 md:grid-cols-2 gap-8">
        <div>
          <h2 className="text-2xl font-semibold mb-4">Our Mission</h2>
          <p className="text-gray-600">
            At Image Kit ReelsPro, our mission is to empower creators to share their stories through short-form videos. We strive to build a vibrant community where creativity thrives.
          </p>
        </div>

        <div>
          <h2 className="text-2xl font-semibold mb-4">Our Story</h2>
          <p className="text-gray-600">
            Founded in 2025, we started with a vision to make video sharing simple, fun, and accessible to everyone. Today, we’re proud to host thousands of creators from around the world.
          </p>
        </div>
      </section>

      <section className="mt-12 text-center">
        <h2 className="text-2xl font-semibold mb-4">Get in Touch</h2>
        <p className="text-gray-600 mb-4">
          Have questions or feedback? W&apos;d love to hear from you!
        </p>
        <a href="mailto:support@reelspro.com" className="text-blue-600 underline">
          support@reelspro.com
        </a>
      </section>
    </main>
  );
}
