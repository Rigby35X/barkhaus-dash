import type React from "react";
import { useLiveSite } from "../../../../contexts/LiveSiteContext";
import { ArrowRight, Heart } from "lucide-react";

const Hero = () => {
  const { siteContent, designSettings } = useLiveSite();
  const { organization } = siteContent;
  const heroData = siteContent.pages.home.heroSection;

  const SectionWrapper = ({
    children,
    id,
    className = "",
  }: {
    children: React.ReactNode;
    id?: string;
    className?: string;
  }) => (
    <section
      id={id}
      className={`py-16 md:py-20 bg-gray-50 ${className}`}
      style={{ fontFamily: designSettings.fontFamily }}
    >
      {children}
    </section>
  );

  const Button = ({
    children,
    variant = "primary",
    size = "md",
    href,
    className = "",
  }: {
    children: React.ReactNode;
    variant?: "primary" | "outline";
    size?: "sm" | "md" | "lg";
    href?: string;
    className?: string;
  }) => {
    const baseClasses =
      "inline-flex items-center justify-center font-semibold rounded-full transition-all duration-200 hover:opacity-90 hover:transform hover:scale-105 focus:outline-none focus:ring-2 focus:ring-offset-2";

    const variantClasses =
      variant === "primary"
        ? "text-white border-2"
        : "border-2 bg-transparent";

    const sizeClasses =
      size === "lg"
        ? "px-8 py-4 text-lg"
        : size === "sm"
        ? "px-4 py-2 text-sm"
        : "px-6 py-3 text-base";

    const style =
      variant === "primary"
        ? {
            backgroundColor: designSettings.primaryColor,
            borderColor: designSettings.primaryColor,
          }
        : {
            color: designSettings.primaryColor,
            borderColor: designSettings.primaryColor,
          };

    const combined = `${baseClasses} ${variantClasses} ${sizeClasses} ${className}`;

    return href ? (
      <a href={href} className={combined} style={style}>
        {children}
      </a>
    ) : (
      <button className={combined} style={style}>
        {children}
      </button>
    );
  };

  return (
    <SectionWrapper id="hero">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Navigation */}
        <nav className="flex items-center justify-between py-6 mb-12">
          <div className="flex items-center space-x-3">
            <img
              src={organization.logo || "/placeholder.svg"}
              alt={organization.siteName}
              className="h-12 w-12 rounded-full object-cover"
            />
            <div>
              <h1
                className="text-xl font-bold text-gray-900"
                style={{ fontFamily: designSettings.headingFont }}
              >
                {organization.siteName}
              </h1>
              <p className="text-sm text-gray-600">{organization.tagline}</p>
            </div>
          </div>
          <div className="hidden md:flex items-center space-x-6">
            <a href="#about" className="text-gray-700 hover:text-gray-900">
              About
            </a>
            <a href="#pets" className="text-gray-700 hover:text-gray-900">
              Pets
            </a>
            <a href="#success-stories" className="text-gray-700 hover:text-gray-900">
              Stories
            </a>
            <a href="#contact" className="text-gray-700 hover:text-gray-900">
              Contact
            </a>
          </div>
        </nav>

        {/* Hero Content */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
          <div className="text-center lg:text-left">
            <h2
              className="text-4xl md:text-5xl lg:text-6xl font-bold mb-6"
              style={{
                fontFamily: designSettings.headingFont,
                color: designSettings.textColor,
              }}
            >
              {heroData.title}
            </h2>
            <p className="text-lg md:text-xl text-gray-600 max-w-3xl mx-auto lg:mx-0 leading-relaxed mb-8">
              {heroData.subtitle}
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center lg:justify-start">
              <Button
                variant="primary"
                size="lg"
                href={heroData.ctaLink}
                className="inline-flex items-center"
              >
                {heroData.ctaText}
                <ArrowRight className="ml-2 h-5 w-5" />
              </Button>
              <Button
                variant="outline"
                size="lg"
                href="#about"
                className="inline-flex items-center bg-transparent"
              >
                <Heart className="mr-2 h-5 w-5" />
                Learn More
              </Button>
            </div>

            {/* Quick Stats */}
            <div className="mt-12 grid grid-cols-3 gap-4 text-center lg:text-left">
              <div>
                <div
                  className="text-2xl font-bold text-gray-900"
                  style={{ color: designSettings.primaryColor }}
                >
                  500+
                </div>
                <div className="text-sm text-gray-600">Rescued</div>
              </div>
              <div>
                <div
                  className="text-2xl font-bold text-gray-900"
                  style={{ color: designSettings.primaryColor }}
                >
                  450+
                </div>
                <div className="text-sm text-gray-600">Adopted</div>
              </div>
              <div>
                <div
                  className="text-2xl font-bold text-gray-900"
                  style={{ color: designSettings.primaryColor }}
                >
                  {new Date().getFullYear() -
                    (organization.foundedYear || 2015)}
                  +
                </div>
                <div className="text-sm text-gray-600">Years</div>
              </div>
            </div>
          </div>

          <div className="relative">
            <div className="bg-white rounded-2xl shadow-2xl p-8 transform rotate-3 hover:rotate-0 transition-transform duration-300">
              <img
                src="/placeholder.svg"
                alt="Happy rescued pet"
                className="w-full h-64 object-cover rounded-xl mb-4"
              />
              <div className="text-center">
                <h3 className="font-bold text-xl text-gray-900 mb-2">
                  Success Story!
                </h3>
                <p className="text-gray-600">Found their forever home</p>
                <div className="mt-4 flex justify-center">
                  <div className="flex -space-x-2">
                    {["red", "blue", "green"].map((color, i) => (
                      <div
                        key={i}
                        className={`w-8 h-8 bg-${color}-400 rounded-full border-2 border-white flex items-center justify-center`}
                      >
                        <Heart className="w-4 h-4 text-white" />
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </SectionWrapper>
  );
};

export default Hero;
