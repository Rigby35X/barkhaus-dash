// src/pages/templates/modern/sections/Gallery.tsx

const Gallery = () => {
  const images = [
    { src: "/gallery/pet1.jpg", alt: "Happy adopted dog" },
    { src: "/gallery/pet2.jpg", alt: "Cat playing" },
    { src: "/gallery/pet3.jpg", alt: "Volunteer with pets" },
    { src: "/gallery/pet4.jpg", alt: "Adoption event" },
    { src: "/gallery/pet5.jpg", alt: "Pet care" },
    { src: "/gallery/pet6.jpg", alt: "Happy family with new pet" }
  ];

  return (
    <section className="py-20 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <h2 className="text-4xl font-bold text-gray-900 mb-4">
            Success Stories
          </h2>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            See the joy and happiness we've helped create through successful adoptions and community support.
          </p>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {images.map((image, index) => (
            <div key={index} className="group relative overflow-hidden rounded-xl aspect-square">
              <img 
                src={image.src} 
                alt={image.alt}
                className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-110"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                <div className="absolute bottom-4 left-4 text-white">
                  <p className="font-semibold">{image.alt}</p>
                </div>
              </div>
            </div>
          ))}
        </div>
        
        <div className="text-center mt-12">
          <button className="bg-blue-600 text-white px-8 py-3 rounded-lg font-semibold hover:bg-blue-700 transition-colors">
            View All Stories
          </button>
        </div>
      </div>
    </section>
  );
};

export default Gallery;
