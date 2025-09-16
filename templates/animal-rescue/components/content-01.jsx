"use client";

import React from "react";

export function Content1() {
  return (
    <section id="relume" className="px-[5%] py-16 md:py-24 lg:py-28">
      <div className="container">
        <div className="grid grid-cols-1 items-start gap-y-12 md:grid-cols-2 md:gap-x-12 lg:gap-x-20">
          <div>
            <h2 className="rb-5 mb-5 text-5xl font-bold md:mb-6 md:text-7xl lg:text-8xl">
              Meet Our Adoptable Animals
            </h2>
            <div className="prose">
              <div>
                <p>
                  Morbi sed imperdiet in ipsum, adipiscing elit dui lectus.
                  Tellus id scelerisque est ultricies ultricies. Duis est sit
                  sed leo nisl, blandit elit sagittis. Quisque tristique
                  consequat quam sed. Nisl at scelerisque amet nulla purus
                  habitasse.
                </p>
                <p>
                  Nunc sed faucibus bibendum feugiat sed interdum. Ipsum egestas
                  condimentum mi massa. In tincidunt pharetra consectetur sed
                  duis facilisis metus. Etiam egestas in nec sed et. Quis
                  lobortis at sit dictum eget nibh tortor commodo cursus.
                </p>
                <p>
                  Odio felis sagittis, morbi feugiat tortor vitae feugiat fusce
                  aliquet. Nam elementum urna nisi aliquet erat dolor enim.
                  Ornare id morbi eget ipsum. Aliquam senectus neque ut id eget
                  consectetur dictum. Donec posuere pharetra odio consequat
                  scelerisque et, nunc tortor. Nulla adipiscing erat a erat.
                  Condimentum lorem posuere gravida enim posuere cursus diam.
                </p>
              </div>
            </div>
          </div>
          <div>
            <div>
              <img
                src="https://d22po4pjz3o32e.cloudfront.net/placeholder-image.svg"
                className="object-coverrounded-image w-full"
                alt="Relume placeholder image"
              />
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
