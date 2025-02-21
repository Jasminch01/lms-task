import Link from "next/link";

const Footer = () => {
  return (
    <footer className="bg-gray-100 text-black py-20">
      <div className="max-w-7xl mx-auto px-6 grid grid-cols-1 md:grid-cols-3 gap-8">
        <div>
          <h2 className="text-xl font-bold">TachStack</h2>
          <p className="mt-2 ">Your gateway to learning.</p>
          <p className="mt-4 ">1234 Learning St, Education City</p>
          <p className=""> +1 (234) 567-890</p>
        </div>
        <div>
          <h3 className="text-lg font-semibold mb-3">Information</h3>
          <ul className="space-y-2">
            <li>
              <Link href="/about" className="transition">
                About Us
              </Link>
            </li>
            <li>
              <Link href="/courses" className="transition">
                Courses
              </Link>
            </li>
            <li>
              <Link href="/faq" className="transition">
                FAQs
              </Link>
            </li>
          </ul>
        </div>
        <div>
          <h3 className="text-lg font-semibold mb-3">Quick Links</h3>
          <ul className="space-y-2">
            <li>
              <Link href="/" className="transition">
                Home
              </Link>
            </li>
            <li>
              <Link href="/contact" className="transition">
                Contact Us
              </Link>
            </li>
            <li>
              <Link href="/dashboard" className="transition">
                Dashboard
              </Link>
            </li>
          </ul>
        </div>
      </div>
      <div className="mt-8 text-center text-sm border-t border-gray-400 pt-10">
        © {new Date().getFullYear()} TachStack All rights reserved.
      </div>
    </footer>
  );
};

export default Footer;
