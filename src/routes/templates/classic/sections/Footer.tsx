const Footer = () => {
  return (
    <footer className="bg-gray-800 text-white py-6">
      <div className="max-w-6xl mx-auto px-4 text-center">
        <p>&copy; {new Date().getFullYear()} BarkHaus Rescue. All rights reserved.</p>
      </div>
    </footer>
  );
};

export default Footer;
