"use client";

import React from "react";
import { BiEnvelope, BiMap, BiPhone } from "react-icons/bi";

export function Contact19() {
  return (
    <section id="relume" className="px-[5%] py-16 md:py-24 lg:py-28">
      <div className="container">
        <div className="rb-12 mb-12 max-w-lg md:mb-18 lg:mb-20">
          <p className="mb-3 font-semibold md:mb-4">Get in Touch</p>
          <h2 className="rb-5 mb-5 text-5xl font-bold md:mb-6 md:text-7xl lg:text-8xl">
            Contact Us
          </h2>
          <p className="md:text-md">
            We're here to help you connect with animals.
          </p>
        </div>
        <div className="grid auto-cols-fr grid-cols-1 gap-x-12 gap-y-12 md:grid-cols-3 md:gap-y-16">
          <div>
            <div className="mb-5 lg:mb-6">
              <BiEnvelope className="size-12" />
            </div>
            <h3 className="mb-3 text-2xl leading-[1.4] font-bold md:text-3xl lg:mb-4 lg:text-4xl">
              Email
            </h3>
            <p className="mb-5 md:mb-6">
              Reach out to us for any inquiries or support.
            </p>
            <a className="underline" href="#">
              hello@relume.io
            </a>
          </div>
          <div>
            <div className="mb-5 lg:mb-6">
              <BiPhone className="size-12" />
            </div>
            <h3 className="mb-3 text-2xl leading-[1.4] font-bold md:text-3xl lg:mb-4 lg:text-4xl">
              Phone
            </h3>
            <p className="mb-5 md:mb-6">
              Call us for immediate assistance or questions.
            </p>
            <a className="underline" href="#">
              +1 (555) 123-4567
            </a>
          </div>
          <div>
            <div className="mb-5 lg:mb-6">
              <BiMap className="size-12" />
            </div>
            <h3 className="mb-3 text-2xl leading-[1.4] font-bold md:text-3xl lg:mb-4 lg:text-4xl">
              Office
            </h3>
            <p className="mb-5 md:mb-6">
              Visit us at our location for more information.
            </p>
            <a className="underline" href="#">
              456 Animal Lane, Sydney NSW 2000 AU
            </a>
          </div>
        </div>
      </div>
    </section>
  );
}
