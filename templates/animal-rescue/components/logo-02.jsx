"use client";

import React from "react";

export function Logo2() {
  return (
    <section id="relume" className="px-[5%] py-12 md:py-16 lg:py-20">
      <div className="container grid grid-cols-1 items-start justify-start gap-x-12 gap-y-8 md:grid-cols-[max-content_1fr] md:items-center md:justify-between md:gap-y-4 lg:gap-x-16">
        <h1 className="leading-[1.2] font-bold md:max-w-[16rem] md:text-md md:leading-[1.2] lg:max-w-xxs">
          Trusted by top organizations in animal welfare
        </h1>
        <div className="grid grid-cols-2 items-center justify-end gap-x-4 gap-y-4 pt-4 sm:grid-cols-3 md:gap-x-8 md:pt-0 lg:grid-cols-5">
          <div className="flex items-start justify-center justify-self-center px-4 py-3 md:p-0">
            <img
              src="https://d22po4pjz3o32e.cloudfront.net/webflow-logo.svg"
              alt="Webflow logo 1"
              className="max-h-12 md:max-h-14"
            />
          </div>
          <div className="flex items-start justify-center justify-self-center px-4 py-3 md:p-0">
            <img
              src="https://d22po4pjz3o32e.cloudfront.net/relume-logo.svg"
              alt="Relume logo 1"
              className="max-h-12 md:max-h-14"
            />
          </div>
          <div className="flex items-start justify-center justify-self-center px-4 py-3 md:p-0">
            <img
              src="https://d22po4pjz3o32e.cloudfront.net/webflow-logo.svg"
              alt="Webflow logo 2"
              className="max-h-12 md:max-h-14"
            />
          </div>
          <div className="flex items-start justify-center justify-self-center px-4 py-3 md:p-0">
            <img
              src="https://d22po4pjz3o32e.cloudfront.net/relume-logo.svg"
              alt="Relume logo 2"
              className="max-h-12 md:max-h-14"
            />
          </div>
          <div className="flex items-start justify-center justify-self-center px-4 py-3 md:p-0">
            <img
              src="https://d22po4pjz3o32e.cloudfront.net/webflow-logo.svg"
              alt="Webflow logo 3"
              className="max-h-12 md:max-h-14"
            />
          </div>
        </div>
      </div>
    </section>
  );
}
