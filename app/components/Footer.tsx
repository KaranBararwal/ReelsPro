"use client";

import { Footer } from "flowbite-react";
import Link from "next/link";

export default function Component() {
    const currentYear = new Date().getFullYear();

  return (
    <Footer container className="flex justify-between items-center py-4">

        {/* Left side : Copyright */}
      {/* <Footer.Copyright href="#" by="Flowbite™" year={currentYear} /> */}

      {/* Left Side: Custom Copyright */}
      <div className="flex items-center space-x-1">
      <span>&copy;</span>
      <span>{currentYear}</span>
        <Link href="/" className="hover:underline">ReelsPro™</Link>
      </div>

      {/* Right side : Links */}
      <Footer.LinkGroup className="flex space-x-4">
        <Footer.Link href="/about">About</Footer.Link>
        <Footer.Link href="/privacy-policy">Privacy Policy</Footer.Link>
        <Footer.Link href="/licensing">Licensing</Footer.Link>
        <Footer.Link href="/contact">Contact</Footer.Link>
      </Footer.LinkGroup>
    </Footer>
  );
}