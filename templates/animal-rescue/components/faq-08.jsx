"use client";

import { Button } from "@relume_io/relume-ui";
import React from "react";

export function Faq8() {
  return (
    <section id="relume" className="px-[5%] py-16 md:py-24 lg:py-28">
      <div className="container grid grid-cols-1 gap-y-12 md:grid-cols-2 md:gap-x-12 lg:grid-cols-[.75fr,1fr] lg:gap-x-20">
        <div>
          <h2 className="rb-5 mb-5 text-5xl font-bold md:mb-6 md:text-7xl lg:text-8xl">
            FAQs
          </h2>
          <p className="md:text-md">
            Find answers to your questions about visiting, adopting, and
            volunteering with us.
          </p>
          <div className="mt-6 md:mt-8">
            <Button title="Contact" variant="secondary">
              Contact
            </Button>
          </div>
        </div>
        <div className="grid grid-cols-1 gap-x-12 gap-y-10 md:gap-y-12">
          <div>
            <h2 className="mb-3 text-base font-bold md:mb-4 md:text-md">
              What are visiting hours?
            </h2>
            <p>
              Our shelter is open from 10 AM to 5 PM, Tuesday through Sunday. We
              are closed on Mondays. Feel free to drop by during these hours to
              meet our animals!
            </p>
          </div>
          <div>
            <h2 className="mb-3 text-base font-bold md:mb-4 md:text-md">
              How to adopt a pet?
            </h2>
            <p>
              To adopt a pet, visit our Available Animals page to view profiles.
              Once you find a match, fill out an adoption application. Our team
              will guide you through the process!
            </p>
          </div>
          <div>
            <h2 className="mb-3 text-base font-bold md:mb-4 md:text-md">
              Can I volunteer?
            </h2>
            <p>
              Absolutely! We welcome volunteers to help with various tasks.
              Please fill out our volunteer form, and we will reach out to
              discuss opportunities.
            </p>
          </div>
          <div>
            <h2 className="mb-3 text-base font-bold md:mb-4 md:text-md">
              Do you need fosters?
            </h2>
            <p>
              Yes, we are always in need of foster homes for our animals.
              Fostering helps us provide care and socialization. If you're
              interested, please contact us for more details.
            </p>
          </div>
          <div>
            <h2 className="mb-3 text-base font-bold md:mb-4 md:text-md">
              How to reach you?
            </h2>
            <p>
              You can reach us via email at info@shelter.org or call us at (555)
              123-4567. We’re here to help with any questions you may have!
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}
