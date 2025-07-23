const PublicLayout = ({ children }: { children: React.ReactNode }) => {
  return (
    <>
      <header className="bg-white shadow-sm p-4 sticky top-0 z-50">
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          <h1 className="text-2xl font-bold text-primary-600">Barkhaus</h1>
          <nav>
            <a href="/" className="text-gray-600 hover:text-primary-600 mx-4">Home</a>
            <a href="/templates" className="text-gray-600 hover:text-primary-600 mx-4">Templates</a>
            <a href="/login" className="text-primary-600 font-semibold">Login</a>
          </nav>
        </div>
      </header>

      <main>{children}</main>

      <footer className="bg-gray-100 text-center py-6 mt-16">
        <p className="text-sm text-gray-500">© {new Date().getFullYear()} Barkhaus. All rights reserved.</p>
      </footer>
    </>
  );
};

export default PublicLayout;
