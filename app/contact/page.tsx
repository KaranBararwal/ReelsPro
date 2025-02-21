"use client";

export default function Contact() {
  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-6">Contact Us</h1>
      <p className="text-gray-700 mb-4">
        Have questions or need support? Feel free to reach out!
      </p>

      <div className="space-y-4">
        <div>
          <h2 className="text-xl font-semibold">Email</h2>
          <p className="text-gray-700">support@reelspro.com</p>
        </div>

        <div>
          <h2 className="text-xl font-semibold">Phone</h2>
          <p className="text-gray-700">+1 (555) 123-4567</p>
        </div>

        <div>
          <h2 className="text-xl font-semibold">Address</h2>
          <p className="text-gray-700">
            123 Reel Street, Suite 456<br />
            San Francisco, CA 94107<br />
            USA
          </p>
        </div>
      </div>
    </div>
  );
}