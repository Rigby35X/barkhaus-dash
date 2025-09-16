"use client";

import { Badge, Button } from "@relume_io/relume-ui";
import React from "react";
import { RxChevronRight } from "react-icons/rx";

export function Portfolio13() {
  return (
    <section id="relume" className="px-[5%] py-16 md:py-24 lg:py-28">
      <div className="container">
        <div className="mx-auto mb-12 max-w-lg text-center md:mb-18 lg:mb-20">
          <p className="mb-3 font-semibold md:mb-4">Animals</p>
          <h2 className="mb-5 text-5xl font-bold md:mb-6 md:text-7xl lg:text-8xl">
            Meet Our Available Pets
          </h2>
          <p className="md:text-md">Find your new best friend today!</p>
        </div>
        <div className="grid grid-cols-1 gap-x-8 gap-y-12 md:grid-cols-2 md:gap-y-16 lg:grid-cols-3">
          <div>
            <div>
              <a href="#">
                <img
                  src="https://d22po4pjz3o32e.cloudfront.net/placeholder-image-landscape.svg"
                  className="w-full object-cover"
                  alt="Relume placeholder image"
                />
              </a>
            </div>
            <div className="px-5 py-6 sm:px-6">
              <h3 className="mb-2 text-xl font-bold md:text-2xl">
                <a href="#">Adoptable Dogs</a>
              </h3>
              <p>Lorem ipsum dolor sit amet, consectetur adipiscing elit.</p>
              <div className="mt-3 flex flex-wrap gap-2 md:mt-4">
                <Badge>
                  <a href="#">Dog Adoption</a>
                </Badge>
                <Badge>
                  <a href="#">Cat Adoption</a>
                </Badge>
                <Badge>
                  <a href="#">Small Animals</a>
                </Badge>
              </div>
              <Button
                title="View Details"
                variant="link"
                size="link"
                iconRight={<RxChevronRight />}
                className="mt-5 md:mt-6"
              >
                <a href="#">View Details</a>
              </Button>
            </div>
          </div>
          <div>
            <div>
              <a href="#">
                <img
                  src="https://d22po4pjz3o32e.cloudfront.net/placeholder-image-landscape.svg"
                  className="w-full object-cover"
                  alt="Relume placeholder image"
                />
              </a>
            </div>
            <div className="px-5 py-6 sm:px-6">
              <h3 className="mb-2 text-xl font-bold md:text-2xl">
                <a href="#">Adoptable Cats</a>
              </h3>
              <p>Lorem ipsum dolor sit amet, consectetur adipiscing elit.</p>
              <div className="mt-3 flex flex-wrap gap-2 md:mt-4">
                <Badge>
                  <a href="#">Cat Adoption</a>
                </Badge>
                <Badge>
                  <a href="#">Kitten Rescue</a>
                </Badge>
                <Badge>
                  <a href="#">Senior Cats</a>
                </Badge>
              </div>
              <Button
                title="View Details"
                variant="link"
                size="link"
                iconRight={<RxChevronRight />}
                className="mt-5 md:mt-6"
              >
                <a href="#">View Details</a>
              </Button>
            </div>
          </div>
          <div>
            <div>
              <a href="#">
                <img
                  src="https://d22po4pjz3o32e.cloudfront.net/placeholder-image-landscape.svg"
                  className="w-full object-cover"
                  alt="Relume placeholder image"
                />
              </a>
            </div>
            <div className="px-5 py-6 sm:px-6">
              <h3 className="mb-2 text-xl font-bold md:text-2xl">
                <a href="#">Project name here</a>
              </h3>
              <p>Lorem ipsum dolor sit amet, consectetur adipiscing elit.</p>
              <div className="mt-3 flex flex-wrap gap-2 md:mt-4">
                <Badge>
                  <a href="#">Tag one</a>
                </Badge>
                <Badge>
                  <a href="#">Tag two</a>
                </Badge>
                <Badge>
                  <a href="#">Tag three</a>
                </Badge>
              </div>
              <Button
                title="View project"
                variant="link"
                size="link"
                iconRight={<RxChevronRight />}
                className="mt-5 md:mt-6"
              >
                <a href="#">View project</a>
              </Button>
            </div>
          </div>
        </div>
        <div className="mt-12 flex justify-center md:mt-18 lg:mt-20">
          <Button title="View all" variant="secondary" size="primary">
            View all
          </Button>
        </div>
      </div>
    </section>
  );
}
