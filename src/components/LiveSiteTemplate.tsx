import React, { useState } from 'react';
import { Heart, Star, MapPin, Phone, Mail, Facebook, Instagram, Twitter, ArrowRight, Users, Home as HomeIcon, Send, Menu, X } from 'lucide-react';

interface LiveSiteTemplateProps {
  config: any;
  pets: any[];
  successStories: any[];
}

const LiveSiteTemplate: React.FC<LiveSiteTemplateProps> = ({ config, pets, successStories }) => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const availablePets = pets.filter(pet => pet.published && pet.status === 'available');
  const adoptedPets = pets.filter(pet => pet.status === 'adopted');

  return (
    <div className="min-h-screen bg-white">
      {/* Header - Mobile Responsive with Hamburger */}
      <header className="bg-white shadow-sm sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-3 md:py-4">
            <div className="flex items-center space-x-2 md:space-x-3">
              <img src={config.logo} alt={config.siteName} className="h-8 w-8 md:h-12 md:w-12 rounded-full object-cover" />
              <h1 className="text-lg md:text-2xl font-bold text-gray-900 truncate">{config.siteName}</h1>
            </div>
            
            {/* Desktop Navigation */}
            <nav className="hidden md:flex items-center space-x-6 lg:space-x-8">
              <a href="#home" className="text-gray-700 hover:text-primary-600 font-medium transition-colors">Home</a>
              <a href="#about" className="text-gray-700 hover:text-primary-600 font-medium transition-colors">About</a>
              <a href="#pets" className="text-gray-700 hover:text-primary-600 font-medium transition-colors">Find a Pet</a>
              <a href="#success-stories" className="text-gray-700 hover:text-primary-600 font-medium transition-colors">Success Stories</a>
              <a href="#contact" className="text-gray-700 hover:text-primary-600 font-medium transition-colors">Contact</a>
            </nav>
            
            {/* Desktop CTA Button */}
            <button className="hidden md:block bg-primary-600 text-white px-4 lg:px-6 py-2 rounded-full font-medium hover:bg-primary-700 transition-colors text-sm lg:text-base">
              Adopt Now
            </button>
            
            {/* Mobile Menu Button */}
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="md:hidden p-2 rounded-md text-gray-700 hover:text-primary-600 hover:bg-gray-100 transition-colors"
            >
              {mobileMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
            </button>
          </div>
          
          {/* Mobile Navigation Menu */}
          {mobileMenuOpen && (
            <div className="md:hidden border-t border-gray-200 py-4">
              <nav className="flex flex-col space-y-3">
                <a href="#home" className="text-gray-700 hover:text-primary-600 font-medium transition-colors py-2" onClick={() => setMobileMenuOpen(false)}>Home</a>
                <a href="#about" className="text-gray-700 hover:text-primary-600 font-medium transition-colors py-2" onClick={() => setMobileMenuOpen(false)}>About</a>
                <a href="#pets" className="text-gray-700 hover:text-primary-600 font-medium transition-colors py-2" onClick={() => setMobileMenuOpen(false)}>Find a Pet</a>
                <a href="#success-stories" className="text-gray-700 hover:text-primary-600 font-medium transition-colors py-2" onClick={() => setMobileMenuOpen(false)}>Success Stories</a>
                <a href="#contact" className="text-gray-700 hover:text-primary-600 font-medium transition-colors py-2" onClick={() => setMobileMenuOpen(false)}>Contact</a>
                <button className="bg-primary-600 text-white px-6 py-3 rounded-full font-medium hover:bg-primary-700 transition-colors text-center mt-2">
                  Adopt Now
                </button>
              </nav>
            </div>
          )}
        </div>
      </header>

      {/* Hero Section - Mobile Responsive */}
      <section id="home" className="relative bg-gradient-to-br from-primary-50 to-orange-50 py-12 md:py-20 lg:py-32 overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-r from-primary-600/10 to-orange-500/10"></div>
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-12 items-center">
            <div className="text-center lg:text-left">
              <div className="inline-flex items-center bg-primary-100 text-primary-800 px-3 md:px-4 py-2 rounded-full text-xs md:text-sm font-medium mb-4 md:mb-6">
                <Heart className="h-3 w-3 md:h-4 md:w-4 mr-2" />
                {availablePets.length} pets looking for homes
              </div>
              <h1 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl xl:text-6xl font-bold text-gray-900 leading-tight mb-4 md:mb-6">
                {config.pages.home.heroSection.title}
              </h1>
              <p className="text-base md:text-lg lg:text-xl text-gray-600 mb-6 md:mb-8 leading-relaxed max-w-2xl mx-auto lg:mx-0">
                {config.pages.home.heroSection.subtitle}
              </p>
              <div className="flex flex-col sm:flex-row gap-3 md:gap-4 justify-center lg:justify-start">
                <button className="bg-primary-600 text-white px-6 md:px-8 py-3 md:py-4 rounded-full font-semibold text-base md:text-lg hover:bg-primary-700 transition-colors inline-flex items-center justify-center">
                  Find Your Pet
                  <ArrowRight className="ml-2 h-4 w-4 md:h-5 md:w-5" />
                </button>
                <button className="border-2 border-primary-600 text-primary-600 px-6 md:px-8 py-3 md:py-4 rounded-full font-semibold text-base md:text-lg hover:bg-primary-600 hover:text-white transition-colors">
                  Learn More
                </button>
              </div>
            </div>
            <div className="relative mt-8 lg:mt-0">
              <div className="grid grid-cols-2 gap-3 md:gap-4">
                {availablePets.slice(0, 4).map((pet, index) => (
                  <div key={pet.id} className={`bg-white rounded-xl md:rounded-2xl p-3 md:p-4 shadow-lg transform ${index % 2 === 0 ? 'rotate-1 md:rotate-2' : '-rotate-1 md:-rotate-2'} hover:rotate-0 transition-transform duration-300`}>
                    <img
                      src={pet.image}
                      alt={pet.name}
                      className="w-full h-20 sm:h-24 md:h-32 object-cover rounded-lg md:rounded-xl mb-2 md:mb-3"
                    />
                    <h3 className="font-bold text-gray-900 text-sm md:text-base">{pet.name}</h3>
                    <p className="text-xs md:text-sm text-gray-600">{pet.breed}</p>
                    <div className="flex items-center mt-1 md:mt-2">
                      <MapPin className="h-2 w-2 md:h-3 md:w-3 text-gray-400 mr-1" />
                      <span className="text-xs text-gray-500">{pet.location}</span>
                    </div>
                  </div>
                ))}
              </div>
              <div className="absolute -top-2 md:-top-4 -right-2 md:-right-4 bg-orange-400 text-white px-2 md:px-4 py-1 md:py-2 rounded-full font-semibold text-xs md:text-sm animate-bounce">
                Adopt Today!
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Stats Section - Mobile Responsive */}
      <section className="py-8 md:py-16 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 md:gap-8">
            <div className="text-center">
              <div className="text-2xl md:text-3xl lg:text-4xl font-bold text-primary-600 mb-1 md:mb-2">{pets.length}</div>
              <div className="text-gray-600 text-sm md:text-base">Animals Rescued</div>
            </div>
            <div className="text-center">
              <div className="text-2xl md:text-3xl lg:text-4xl font-bold text-green-600 mb-1 md:mb-2">{adoptedPets.length}</div>
              <div className="text-gray-600 text-sm md:text-base">Happy Adoptions</div>
            </div>
            <div className="text-center">
              <div className="text-2xl md:text-3xl lg:text-4xl font-bold text-orange-600 mb-1 md:mb-2">{availablePets.length}</div>
              <div className="text-gray-600 text-sm md:text-base">Looking for Homes</div>
            </div>
            <div className="text-center">
              <div className="text-2xl md:text-3xl lg:text-4xl font-bold text-purple-600 mb-1 md:mb-2">100+</div>
              <div className="text-gray-600 text-sm md:text-base">Volunteers</div>
            </div>
          </div>
        </div>
      </section>

      {/* About Section - Mobile Responsive */}
      <section id="about" className="py-12 md:py-20 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-12 items-center">
            <div className="order-2 lg:order-1">
              <h2 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-bold text-gray-900 mb-4 md:mb-6 text-center lg:text-left">
                {config.pages.about.aboutSection.title}
              </h2>
              <p className="text-base md:text-lg text-gray-600 mb-6 md:mb-8 leading-relaxed text-center lg:text-left">
                {config.pages.about.aboutSection.content}
              </p>
              <div className="space-y-3 md:space-y-4">
                <div className="flex items-center">
                  <div className="bg-primary-100 p-2 rounded-lg mr-3 md:mr-4 flex-shrink-0">
                    <Heart className="h-4 w-4 md:h-6 md:w-6 text-primary-600" />
                  </div>
                  <div>
                    <h3 className="font-semibold text-gray-900 text-sm md:text-base">Compassionate Care</h3>
                    <p className="text-gray-600 text-sm md:text-base">Every animal receives love and medical attention</p>
                  </div>
                </div>
                <div className="flex items-center">
                  <div className="bg-green-100 p-2 rounded-lg mr-3 md:mr-4 flex-shrink-0">
                    <HomeIcon className="h-4 w-4 md:h-6 md:w-6 text-green-600" />
                  </div>
                  <div>
                    <h3 className="font-semibold text-gray-900 text-sm md:text-base">Forever Homes</h3>
                    <p className="text-gray-600 text-sm md:text-base">Matching pets with perfect families</p>
                  </div>
                </div>
                <div className="flex items-center">
                  <div className="bg-orange-100 p-2 rounded-lg mr-3 md:mr-4 flex-shrink-0">
                    <Users className="h-4 w-4 md:h-6 md:w-6 text-orange-600" />
                  </div>
                  <div>
                    <h3 className="font-semibold text-gray-900 text-sm md:text-base">Community Support</h3>
                    <p className="text-gray-600 text-sm md:text-base">Building a network of animal lovers</p>
                  </div>
                </div>
              </div>
            </div>
            <div className="order-1 lg:order-2 grid grid-cols-2 gap-3 md:gap-4">
              <img 
                src="https://images.unsplash.com/photo-1552053831-71594a27632d?w=400&h=300&fit=crop&crop=face" 
                alt="Happy dog" 
                className="rounded-xl md:rounded-2xl shadow-lg w-full h-32 sm:h-40 md:h-48 object-cover"
              />
              <img 
                src="https://images.unsplash.com/photo-1574158622682-e40e69881006?w=400&h=300&fit=crop&crop=face" 
                alt="Cute cat" 
                className="rounded-xl md:rounded-2xl shadow-lg mt-4 md:mt-8 w-full h-32 sm:h-40 md:h-48 object-cover"
              />
            </div>
          </div>
        </div>
      </section>

      {/* Available Pets Section - Mobile Responsive */}
      <section id="pets" className="py-12 md:py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-8 md:mb-16">
            <h2 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-bold text-gray-900 mb-3 md:mb-4">
              Find Your Perfect Companion
            </h2>
            <p className="text-base md:text-xl text-gray-600 max-w-2xl mx-auto">
              Meet our wonderful animals who are looking for their forever homes
            </p>
          </div>
          
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-6 lg:gap-8">
            {availablePets.slice(0, 6).map((pet) => (
              <div key={pet.id} className="bg-white rounded-xl md:rounded-2xl shadow-lg overflow-hidden hover:shadow-xl transition-shadow duration-300 group">
                <div className="relative">
                  <img
                    src={pet.image}
                    alt={pet.name}
                    className="w-full h-48 md:h-64 object-cover group-hover:scale-105 transition-transform duration-300"
                  />
                  <div className="absolute top-3 md:top-4 right-3 md:right-4 bg-white/90 backdrop-blur-sm px-2 md:px-3 py-1 rounded-full">
                    <span className="text-xs md:text-sm font-medium text-gray-700">{pet.age}</span>
                  </div>
                </div>
                <div className="p-4 md:p-6">
                  <h3 className="text-lg md:text-xl font-bold text-gray-900 mb-2">{pet.name}</h3>
                  <p className="text-gray-600 mb-2 md:mb-3 text-sm md:text-base">{pet.breed} • {pet.gender}</p>
                  <p className="text-gray-600 text-sm mb-3 md:mb-4 line-clamp-2">{pet.description}</p>
                  <div className="flex items-center justify-between">
                    <div className="flex items-center text-xs md:text-sm text-gray-500">
                      <MapPin className="h-3 w-3 md:h-4 md:w-4 mr-1" />
                      {pet.location}
                    </div>
                    <button className="bg-primary-600 text-white px-3 md:px-4 py-2 rounded-full text-xs md:text-sm font-medium hover:bg-primary-700 transition-colors">
                      Meet {pet.name}
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
          
          {availablePets.length > 6 && (
            <div className="text-center mt-8 md:mt-12">
              <button className="bg-primary-600 text-white px-6 md:px-8 py-3 rounded-full font-semibold hover:bg-primary-700 transition-colors text-sm md:text-base">
                View All Available Pets
              </button>
            </div>
          )}
        </div>
      </section>

      {/* Success Stories Section - Mobile Responsive */}
      <section id="success-stories" className="py-12 md:py-20 bg-gradient-to-br from-green-50 to-blue-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-8 md:mb-16">
            <h2 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-bold text-gray-900 mb-3 md:mb-4">
              {config.pages.successStories.headerSection.title}
            </h2>
            <p className="text-base md:text-xl text-gray-600 max-w-2xl mx-auto">
              {config.pages.successStories.headerSection.content}
            </p>
          </div>
          
          {/* Success Stories Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-6 lg:gap-8 mb-8 md:mb-16">
            {successStories.slice(0, 3).map((story, index) => (
              <div key={index} className="bg-white rounded-xl md:rounded-2xl p-4 md:p-6 shadow-lg">
                <div className="flex items-center mb-3 md:mb-4">
                  <img
                    src={story.image}
                    alt={story.petName}
                    className="w-12 h-12 md:w-16 md:h-16 rounded-full object-cover mr-3 md:mr-4"
                  />
                  <div>
                    <h3 className="font-bold text-gray-900 text-sm md:text-base">{story.petName}</h3>
                    <p className="text-xs md:text-sm text-gray-600">Adopted by {story.adopter}</p>
                  </div>
                </div>
                <p className="text-gray-600 italic text-sm md:text-base">"{story.story}"</p>
                <div className="flex items-center mt-3 md:mt-4">
                  {[...Array(5)].map((_, i) => (
                    <Star key={i} className="h-3 w-3 md:h-4 md:w-4 text-yellow-400 fill-current" />
                  ))}
                </div>
              </div>
            ))}
          </div>

          {/* Adopted Pets Grid */}
          <div className="mb-8 md:mb-16">
            <h3 className="text-xl md:text-2xl font-bold text-gray-900 text-center mb-4 md:mb-8">Recently Adopted</h3>
            <div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-6 gap-3 md:gap-4">
              {adoptedPets.slice(0, 6).map((pet) => (
                <div key={pet.id} className="text-center">
                  <img
                    src={pet.image}
                    alt={pet.name}
                    className="w-full h-16 sm:h-20 md:h-24 object-cover rounded-full mx-auto mb-1 md:mb-2"
                  />
                  <p className="font-medium text-gray-900 text-xs md:text-sm">{pet.name}</p>
                  <p className="text-xs text-gray-600">Adopted!</p>
                </div>
              ))}
            </div>
          </div>

          {/* Success Story Submission Form */}
          <div className="bg-white rounded-xl md:rounded-2xl p-4 md:p-8 shadow-lg">
            <div className="text-center mb-6 md:mb-8">
              <h3 className="text-xl md:text-2xl font-bold text-gray-900 mb-3 md:mb-4">
                Share Your Success Story
              </h3>
              <p className="text-gray-600 text-sm md:text-base">
                Have you adopted from us? We'd love to hear how your new family member is doing!
              </p>
            </div>
            
            <form className="max-w-2xl mx-auto space-y-4 md:space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3 md:gap-4">
                <input
                  type="text"
                  placeholder="First Name"
                  className="w-full px-3 md:px-4 py-2 md:py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent text-sm md:text-base"
                />
                <input
                  type="text"
                  placeholder="Last Name"
                  className="w-full px-3 md:px-4 py-2 md:py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent text-sm md:text-base"
                />
              </div>
              
              <input
                type="email"
                placeholder="Email Address"
                className="w-full px-3 md:px-4 py-2 md:py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent text-sm md:text-base"
              />
              
              <input
                type="text"
                placeholder="Pet's Name"
                className="w-full px-3 md:px-4 py-2 md:py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent text-sm md:text-base"
              />
              
              <textarea
                rows={4}
                placeholder="Tell us your story..."
                className="w-full px-3 md:px-4 py-2 md:py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent text-sm md:text-base"
              ></textarea>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Photos</label>
                <input
                  type="file"
                  multiple
                  accept="image/*"
                  className="w-full px-3 md:px-4 py-2 md:py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent text-sm md:text-base"
                />
              </div>
              
              <button
                type="submit"
                className="w-full bg-primary-600 text-white py-2 md:py-3 rounded-lg font-semibold hover:bg-primary-700 transition-colors flex items-center justify-center text-sm md:text-base"
              >
                <Send className="mr-2 h-4 w-4 md:h-5 md:w-5" />
                Submit Your Story
              </button>
            </form>
          </div>
        </div>
      </section>

      {/* Applications Section - Mobile Responsive */}
      <section id="applications" className="py-12 md:py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-8 md:mb-16">
            <h2 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-bold text-gray-900 mb-3 md:mb-4">
              Get Involved
            </h2>
            <p className="text-base md:text-xl text-gray-600 max-w-2xl mx-auto">
              Ready to make a difference? Choose how you'd like to help our mission
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 md:gap-6 lg:gap-8">
            <div className="bg-gradient-to-br from-blue-50 to-blue-100 rounded-xl md:rounded-2xl p-6 md:p-8 text-center hover:shadow-lg transition-shadow">
              <div className="bg-blue-600 w-12 h-12 md:w-16 md:h-16 rounded-full flex items-center justify-center mx-auto mb-4 md:mb-6">
                <Heart className="h-6 w-6 md:h-8 md:w-8 text-white" />
              </div>
              <h3 className="text-lg md:text-xl font-bold text-gray-900 mb-3 md:mb-4">Adopt a Pet</h3>
              <p className="text-gray-600 mb-4 md:mb-6 text-sm md:text-base">
                Give a loving animal their forever home. Our adoption process ensures the perfect match.
              </p>
              <button className="bg-blue-600 text-white px-4 md:px-6 py-2 md:py-3 rounded-full font-semibold hover:bg-blue-700 transition-colors w-full text-sm md:text-base">
                Start Adoption Application
              </button>
            </div>
            
            <div className="bg-gradient-to-br from-green-50 to-green-100 rounded-xl md:rounded-2xl p-6 md:p-8 text-center hover:shadow-lg transition-shadow">
              <div className="bg-green-600 w-12 h-12 md:w-16 md:h-16 rounded-full flex items-center justify-center mx-auto mb-4 md:mb-6">
                <HomeIcon className="h-6 w-6 md:h-8 md:w-8 text-white" />
              </div>
              <h3 className="text-lg md:text-xl font-bold text-gray-900 mb-3 md:mb-4">Foster a Pet</h3>
              <p className="text-gray-600 mb-4 md:mb-6 text-sm md:text-base">
                Provide temporary care for animals in need. Fostering saves lives and helps with socialization.
              </p>
              <button className="bg-green-600 text-white px-4 md:px-6 py-2 md:py-3 rounded-full font-semibold hover:bg-green-700 transition-colors w-full text-sm md:text-base">
                Apply to Foster
              </button>
            </div>
            
            <div className="bg-gradient-to-br from-purple-50 to-purple-100 rounded-xl md:rounded-2xl p-6 md:p-8 text-center hover:shadow-lg transition-shadow">
              <div className="bg-purple-600 w-12 h-12 md:w-16 md:h-16 rounded-full flex items-center justify-center mx-auto mb-4 md:mb-6">
                <Users className="h-6 w-6 md:h-8 md:w-8 text-white" />
              </div>
              <h3 className="text-lg md:text-xl font-bold text-gray-900 mb-3 md:mb-4">Volunteer</h3>
              <p className="text-gray-600 mb-4 md:mb-6 text-sm md:text-base">
                Join our team of dedicated volunteers. Help with events, animal care, and administrative tasks.
              </p>
              <button className="bg-purple-600 text-white px-4 md:px-6 py-2 md:py-3 rounded-full font-semibold hover:bg-purple-700 transition-colors w-full text-sm md:text-base">
                Volunteer Application
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* Contact Section - Mobile Responsive */}
      <section id="contact" className="py-12 md:py-20 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-12">
            <div>
              <h2 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-bold text-gray-900 mb-4 md:mb-6 text-center lg:text-left">
                Get in Touch
              </h2>
              <p className="text-base md:text-xl text-gray-600 mb-6 md:mb-8 leading-relaxed text-center lg:text-left">
                Have questions? We'd love to hear from you. Send us a message and we'll respond as soon as possible.
              </p>
              
              <div className="space-y-3 md:space-y-4 mb-6 md:mb-8">
                <div className="flex items-center">
                  <div className="bg-primary-100 p-2 md:p-3 rounded-lg mr-3 md:mr-4 flex-shrink-0">
                    <MapPin className="h-4 w-4 md:h-6 md:w-6 text-primary-600" />
                  </div>
                  <div>
                    <h3 className="font-semibold text-gray-900 text-sm md:text-base">Address</h3>
                    <p className="text-gray-600 text-sm md:text-base">{config.contactInfo.address}</p>
                  </div>
                </div>
                <div className="flex items-center">
                  <div className="bg-primary-100 p-2 md:p-3 rounded-lg mr-3 md:mr-4 flex-shrink-0">
                    <Phone className="h-4 w-4 md:h-6 md:w-6 text-primary-600" />
                  </div>
                  <div>
                    <h3 className="font-semibold text-gray-900 text-sm md:text-base">Phone</h3>
                    <p className="text-gray-600 text-sm md:text-base">{config.contactInfo.phone}</p>
                  </div>
                </div>
                <div className="flex items-center">
                  <div className="bg-primary-100 p-2 md:p-3 rounded-lg mr-3 md:mr-4 flex-shrink-0">
                    <Mail className="h-4 w-4 md:h-6 md:w-6 text-primary-600" />
                  </div>
                  <div>
                    <h3 className="font-semibold text-gray-900 text-sm md:text-base">Email</h3>
                    <p className="text-gray-600 text-sm md:text-base">{config.contactInfo.email}</p>
                  </div>
                </div>
              </div>

              <div className="flex space-x-3 md:space-x-4 justify-center lg:justify-start">
                <a href="#" className="bg-blue-600 text-white p-2 md:p-3 rounded-full hover:bg-blue-700 transition-colors">
                  <Facebook className="h-4 w-4 md:h-5 md:w-5" />
                </a>
                <a href="#" className="bg-pink-600 text-white p-2 md:p-3 rounded-full hover:bg-pink-700 transition-colors">
                  <Instagram className="h-4 w-4 md:h-5 md:w-5" />
                </a>
                <a href="#" className="bg-blue-400 text-white p-2 md:p-3 rounded-full hover:bg-blue-500 transition-colors">
                  <Twitter className="h-4 w-4 md:h-5 md:w-5" />
                </a>
              </div>
            </div>
            
            <div className="bg-white rounded-xl md:rounded-2xl p-4 md:p-8 shadow-lg">
              <h3 className="text-xl md:text-2xl font-bold text-gray-900 mb-4 md:mb-6">Send us a Message</h3>
              <form className="space-y-3 md:space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-3 md:gap-4">
                  <input
                    type="text"
                    placeholder="First Name"
                    className="w-full px-3 md:px-4 py-2 md:py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent text-sm md:text-base"
                  />
                  <input
                    type="text"
                    placeholder="Last Name"
                    className="w-full px-3 md:px-4 py-2 md:py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent text-sm md:text-base"
                  />
                </div>
                
                <input
                  type="email"
                  placeholder="Email Address"
                  className="w-full px-3 md:px-4 py-2 md:py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent text-sm md:text-base"
                />
                
                <input
                  type="text"
                  placeholder="Subject"
                  className="w-full px-3 md:px-4 py-2 md:py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent text-sm md:text-base"
                />
                
                <textarea
                  rows={4}
                  placeholder="Your message..."
                  className="w-full px-3 md:px-4 py-2 md:py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent text-sm md:text-base"
                ></textarea>
                
                <button
                  type="submit"
                  className="w-full bg-primary-600 text-white py-2 md:py-3 rounded-lg font-semibold hover:bg-primary-700 transition-colors flex items-center justify-center text-sm md:text-base"
                >
                  <Send className="mr-2 h-4 w-4 md:h-5 md:w-5" />
                  Send Message
                </button>
              </form>
            </div>
          </div>
        </div>
      </section>

      {/* Footer - Mobile Responsive */}
      <footer className="bg-gray-900 text-white py-8 md:py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-6 md:gap-8">
            <div className="sm:col-span-2 md:col-span-1">
              <div className="flex items-center space-x-2 md:space-x-3 mb-3 md:mb-4">
                <img src={config.logo} alt={config.siteName} className="h-8 w-8 md:h-10 md:w-10 rounded-full object-cover" />
                <h3 className="text-lg md:text-xl font-bold">{config.siteName}</h3>
              </div>
              <p className="text-gray-400 leading-relaxed text-sm md:text-base">
                {config.aboutUs}
              </p>
            </div>
            <div>
              <h3 className="font-bold text-base md:text-lg mb-3 md:mb-4">Quick Links</h3>
              <ul className="space-y-1 md:space-y-2 text-gray-400 text-sm md:text-base">
                <li><a href="#home" className="hover:text-white transition-colors">Home</a></li>
                <li><a href="#about" className="hover:text-white transition-colors">About</a></li>
                <li><a href="#pets" className="hover:text-white transition-colors">Available Pets</a></li>
                <li><a href="#success-stories" className="hover:text-white transition-colors">Success Stories</a></li>
              </ul>
            </div>
            <div>
              <h3 className="font-bold text-base md:text-lg mb-3 md:mb-4">Get Involved</h3>
              <ul className="space-y-1 md:space-y-2 text-gray-400 text-sm md:text-base">
                <li><a href="#applications" className="hover:text-white transition-colors">Adopt</a></li>
                <li><a href="#applications" className="hover:text-white transition-colors">Foster</a></li>
                <li><a href="#applications" className="hover:text-white transition-colors">Volunteer</a></li>
                <li><a href="#contact" className="hover:text-white transition-colors">Donate</a></li>
              </ul>
            </div>
            <div>
              <h3 className="font-bold text-base md:text-lg mb-3 md:mb-4">Contact Info</h3>
              <ul className="space-y-1 md:space-y-2 text-gray-400 text-sm md:text-base">
                <li>{config.contactInfo.address}</li>
                <li>{config.contactInfo.phone}</li>
                <li>{config.contactInfo.email}</li>
              </ul>
            </div>
          </div>
          <div className="border-t border-gray-800 mt-6 md:mt-8 pt-6 md:pt-8 text-center text-gray-400 text-sm md:text-base">
            <p>&copy; 2025 {config.siteName}. All rights reserved. Powered by BarkHaus.</p>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default LiveSiteTemplate;