const Header = () => {
  return (
    <header className="bg-gray-800 text-white py-4">
      <div className="max-w-6xl mx-auto px-4 flex items-center justify-between">
        <h1 className="text-lg font-semibold">BarkHaus Rescue</h1>
        <nav className="space-x-4">
          <a href="/" className="hover:underline">
            Home
          </a>
          <a href="/about" className="hover:underline">
            About
          </a>
          <a href="/adopt" className="hover:underline">
            Adopt
          </a>
          <a href="/contact" className="hover:underline">
            Contact
          </a>
        </nav>
      </div>
    </header>
  );
};

export default Header;
