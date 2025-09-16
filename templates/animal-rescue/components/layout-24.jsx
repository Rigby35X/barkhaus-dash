"use client";

import React from "react";

export function Layout24() {
  return (
    <section id="relume" className="px-[5%] py-16 md:py-24 lg:py-28">
      <div className="container">
        <div className="grid grid-cols-1 gap-y-12 md:grid-cols-2 md:items-center md:gap-x-12 lg:gap-x-20">
          <div>
            <div className="rb-5 mb-5 md:mb-6">
              <img
                src="https://d22po4pjz3o32e.cloudfront.net/relume-icon.svg"
                className="size-12"
                alt="Relume logo"
              />
            </div>
            <h3 className="mb-5 text-4xl leading-[1.2] font-bold md:mb-6 md:text-5xl lg:text-6xl">
              Our Journey: Committed to Saving Lives and Finding Forever Homes
            </h3>
            <p className="md:text-md">
              Founded in 2010, our rescue has dedicated itself to rescuing and
              rehabilitating abandoned animals. With over 5,000 successful
              adoptions, we strive to create a compassionate community where
              every animal finds a loving home.
            </p>
          </div>
          <div>
            <img
              src="https://d22po4pjz3o32e.cloudfront.net/placeholder-image.svg"
              className="w-full rounded-image object-cover"
              alt="Relume placeholder image"
            />
          </div>
        </div>
      </div>
    </section>
  );
}
