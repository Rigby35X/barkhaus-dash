"use client";

import React from "react";

export function Layout90() {
  return (
    <section id="relume" className="px-[5%] py-16 md:py-24 lg:py-28">
      <div className="container">
        <div className="mb-12 grid grid-cols-1 items-start justify-between gap-x-12 gap-y-8 md:mb-18 md:grid-cols-2 md:gap-x-12 md:gap-y-8 lg:mb-20 lg:gap-x-20">
          <h3 className="text-4xl leading-[1.2] font-bold md:text-5xl lg:text-6xl">
            Transform Lives: Volunteer and Foster to Make a Difference for
            Animals
          </h3>
          <p className="md:text-md">
            Volunteering and fostering not only enrich the lives of animals in
            need but also provide you with invaluable personal growth
            experiences. You'll develop new skills, create lasting connections,
            and feel the joy of making a real impact. Join us in giving these
            animals a second chance at life while discovering the fulfillment
            that comes from helping others.
          </p>
        </div>
        <img
          src="https://d22po4pjz3o32e.cloudfront.net/placeholder-image-landscape.svg"
          className="w-full rounded-image object-cover"
          alt="Relume placeholder image"
        />
      </div>
    </section>
  );
}
