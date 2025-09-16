"use client";

import React from "react";



export function Cta4() {
  return (
    <section id="relume" className="relative px-[5%] py-16 md:py-24 lg:py-28">
      <div className="relative z-10 container">
        <div className="w-full max-w-lg">
          <h2 className="mb-5 text-5xl font-bold text-text-alternative md:mb-6 md:text-7xl lg:text-8xl">
            Adopt Your New Best Friend
          </h2>
          <p className="text-text-alternative md:text-md">
            Fill out the form below to express your interest in adopting a furry companion.
          </p>
          <div className="mt-6 w-full max-w-sm md:mt-8">
            <form className="rb-4 mb-4 grid max-w-sm grid-cols-1 gap-y-3 sm:grid-cols-[1fr_max-content] sm:gap-4">
              <input
                id="email"
                type="email"
                placeholder="Your Email Address"
                className="px-3 py-2 border border-gray-300 rounded-md"
              />
              <button
                type="submit"
                className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
              >
                Submit
              </button>
            </form>
            <div>
              <p className="text-xs text-text-alternative">
                By clicking Sign Up you're confirming that you agree with our{' '}
                <a href="#" className="underline">Terms and Conditions</a>.
              </p>
            </div>
          </div>
        </div>
      </div>
      <div className="absolute inset-0 z-0">
        <img
          src="https://d22po4pjz3o32e.cloudfront.net/placeholder-image.svg"
          className="size-full object-cover"
          alt="Relume placeholder image"
        />
        <div className="absolute inset-0 bg-black/50" />
      </div>
    </section>
  );
}