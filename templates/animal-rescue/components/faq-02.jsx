"use client";

import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
  Button,
} from "@relume_io/relume-ui";
import React from "react";

export function Faq2() {
  return (
    <section id="relume" className="px-[5%] py-16 md:py-24 lg:py-28">
      <div className="container">
        <div className="rb-12 mb-12 w-full max-w-lg md:mb-18 lg:mb-20">
          <h2 className="rb-5 mb-5 text-5xl font-bold md:mb-6 md:text-7xl lg:text-8xl">
            FAQs
          </h2>
          <p className="md:text-md">
            Here are some common questions about adopting this wonderful animal.
          </p>
        </div>
        <Accordion type="multiple">
          <AccordionItem value="item-0">
            <AccordionTrigger className="md:py-5 md:text-md">
              What is the adoption fee?
            </AccordionTrigger>
            <AccordionContent className="md:pb-6">
              The adoption fee varies based on the animal's age and breed.
              Typically, it covers vaccinations, spaying/neutering, and
              microchipping. Please check our website for specific fees.
            </AccordionContent>
          </AccordionItem>
          <AccordionItem value="item-1">
            <AccordionTrigger className="md:py-5 md:text-md">
              How do I apply?
            </AccordionTrigger>
            <AccordionContent className="md:pb-6">
              To apply for adoption, fill out our online application form. Once
              submitted, our team will review it and contact you. We recommend
              applying early to secure your chance.
            </AccordionContent>
          </AccordionItem>
          <AccordionItem value="item-2">
            <AccordionTrigger className="md:py-5 md:text-md">
              What if I have pets?
            </AccordionTrigger>
            <AccordionContent className="md:pb-6">
              If you have existing pets, we recommend scheduling a
              meet-and-greet. This helps ensure compatibility between your
              current pets and the new addition. Our team can assist with this
              process.
            </AccordionContent>
          </AccordionItem>
          <AccordionItem value="item-3">
            <AccordionTrigger className="md:py-5 md:text-md">
              Can I foster first?
            </AccordionTrigger>
            <AccordionContent className="md:pb-6">
              Yes, we offer a foster program that allows you to care for an
              animal temporarily. This is a great way to see if the animal is a
              good fit for your home. Please inquire about our fostering
              process.
            </AccordionContent>
          </AccordionItem>
          <AccordionItem value="item-4">
            <AccordionTrigger className="md:py-5 md:text-md">
              What is the timeline?
            </AccordionTrigger>
            <AccordionContent className="md:pb-6">
              The adoption process typically takes a week or two, depending on
              application volume. We strive to keep you updated throughout the
              process. Your patience is appreciated as we find the perfect
              match.
            </AccordionContent>
          </AccordionItem>
        </Accordion>
        <div className="mt-12 md:mt-18 lg:mt-20">
          <h4 className="mb-3 text-2xl font-bold md:mb-4 md:text-3xl md:leading-[1.3] lg:text-4xl">
            Still have questions?
          </h4>
          <p className="md:text-md">
            We're here to help you with any inquiries!
          </p>
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
