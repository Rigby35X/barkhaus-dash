"use client";

import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
  Button,
} from "@relume_io/relume-ui";
import React from "react";

export function Faq1() {
  return (
    <section id="relume" className="px-[5%] py-16 md:py-24 lg:py-28">
      <div className="container max-w-lg">
        <div className="rb-12 mb-12 text-center md:mb-18 lg:mb-20">
          <h2 className="rb-5 mb-5 text-5xl font-bold md:mb-6 md:text-7xl lg:text-8xl">
            FAQs
          </h2>
          <p className="md:text-md">
            Here are some common questions about adopting animals from our
            shelter.
          </p>
        </div>
        <Accordion type="multiple">
          <AccordionItem value="item-0">
            <AccordionTrigger className="md:py-5 md:text-md">
              What is the adoption process?
            </AccordionTrigger>
            <AccordionContent className="md:pb-6">
              The adoption process begins with filling out an application. Once
              approved, you can meet the animal. After that, we finalize the
              adoption paperwork.
            </AccordionContent>
          </AccordionItem>
          <AccordionItem value="item-1">
            <AccordionTrigger className="md:py-5 md:text-md">
              What are adoption fees?
            </AccordionTrigger>
            <AccordionContent className="md:pb-6">
              Adoption fees vary based on the animal's age and breed. These fees
              help cover vaccinations and spaying/neutering. Please check our
              website for specific amounts.
            </AccordionContent>
          </AccordionItem>
          <AccordionItem value="item-2">
            <AccordionTrigger className="md:py-5 md:text-md">
              Can I return an animal?
            </AccordionTrigger>
            <AccordionContent className="md:pb-6">
              Yes, we understand circumstances can change. If you need to return
              an animal, please contact us. We want to ensure every animal finds
              a loving home.
            </AccordionContent>
          </AccordionItem>
          <AccordionItem value="item-3">
            <AccordionTrigger className="md:py-5 md:text-md">
              Do you offer fostering?
            </AccordionTrigger>
            <AccordionContent className="md:pb-6">
              Yes, we have a fostering program to help animals in need.
              Fostering allows you to provide temporary care. Interested
              individuals can apply through our website.
            </AccordionContent>
          </AccordionItem>
          <AccordionItem value="item-4">
            <AccordionTrigger className="md:py-5 md:text-md">
              What is your policy?
            </AccordionTrigger>
            <AccordionContent className="md:pb-6">
              Our policy is to prioritize the well-being of our animals. We
              conduct home checks and interviews. This ensures a safe
              environment for our pets.
            </AccordionContent>
          </AccordionItem>
        </Accordion>
        <div className="mx-auto mt-12 max-w-md text-center md:mt-18 lg:mt-20">
          <h4 className="mb-3 text-2xl font-bold md:mb-4 md:text-3xl md:leading-[1.3] lg:text-4xl">
            Still have questions?
          </h4>
          <p className="md:text-md">Feel free to reach out to us anytime!</p>
          <div className="mt-6 md:mt-8">
            <Button title="Contact" variant="secondary">
              Contact
            </Button>
          </div>
        </div>
      </div>
    </section>
  );
}
