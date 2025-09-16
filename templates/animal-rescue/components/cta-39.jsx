"use client";

import { Button } from "@relume_io/relume-ui";
import React from "react";

export function Cta39() {
  return (
    <section id="relume" className="px-[5%] py-16 md:py-24 lg:py-28">
      <div className="container">
        <div className="grid auto-cols-fr grid-cols-1 lg:grid-cols-2 bg-white rounded-lg shadow-lg overflow-hidden">
          <div className="flex flex-col justify-center p-8 md:p-12">
            <div>
              <h2 className="mb-5 text-5xl font-bold md:mb-6 md:text-7xl lg:text-8xl">
                Join Us in Making a Difference
              </h2>
              <p className="md:text-md">
                Your support helps us rescue, rehabilitate, and find loving
                homes for animals in need.
              </p>
            </div>
            <div className="mt-6 flex flex-wrap items-center gap-4 md:mt-8">
              <Button title="Donate" variant="primary">
                Donate
              </Button>
              <Button title="Volunteer" variant="secondary">
                Volunteer
              </Button>
            </div>
          </div>
          <div className="flex items-center justify-center">
            <img
              src="https://d22po4pjz3o32e.cloudfront.net/placeholder-image-landscape4x3.svg"
              className="w-full object-cover"
              alt="Relume placeholder image"
            />
          </div>
        </div>
      </div>
    </section>
  );
}
