const AvailablePets = () => {
  return (
    <section id="available-pets" className="bg-gray-100 py-16">
      <div className="max-w-6xl mx-auto px-4">
        <h2 className="text-3xl font-bold mb-8 text-center">Available Dogs</h2>
        {/* Replace below with dynamic pet card component in the future */}
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
          <div className="bg-white rounded-lg shadow p-4">
            <img src="/images/sample-dog.jpg" alt="Dog 1" className="rounded mb-4" />
            <h3 className="text-xl font-semibold">Buddy</h3>
            <p className="text-gray-600 text-sm">2-year-old Labrador mix looking for a loving home.</p>
          </div>
          <div className="bg-white rounded-lg shadow p-4">
            <img src="/images/sample-dog.jpg" alt="Dog 2" className="rounded mb-4" />
            <h3 className="text-xl font-semibold">Luna</h3>
            <p className="text-gray-600 text-sm">Sweet husky mix who loves cuddles and walks.</p>
          </div>
          <div className="bg-white rounded-lg shadow p-4">
            <img src="/images/sample-dog.jpg" alt="Dog 3" className="rounded mb-4" />
            <h3 className="text-xl font-semibold">Max</h3>
            <p className="text-gray-600 text-sm">Playful terrier ready to bring joy to your home.</p>
          </div>
        </div>
      </div>
    </section>
  );
};

export default AvailablePets;

