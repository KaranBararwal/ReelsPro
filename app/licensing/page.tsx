"use client";

import Link from "next/link";

export default function Licensing() {
  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-6">Licensing</h1>
      <p className="text-gray-700 mb-4">
        All content on Image Kit ReelsPro is licensed under the Creative Commons Attribution-NonCommercial 4.0 International License.
      </p>
      <p className="text-gray-700 mb-4">
        You are free to share and adapt the materials for non-commercial purposes, as long as appropriate credit is given and changes are indicated.
      </p>
      <p className="text-gray-700">
        For more information, please visit the official{" "}
        <Link
          href="https://creativecommons.org/licenses/by-nc/4.0/"
          target="_blank"
          className="text-blue-600 underline"
        >
          Creative Commons License
        </Link>.
      </p>
    </div>
  );
}