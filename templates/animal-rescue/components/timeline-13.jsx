"use client";

import { Button } from "@relume_io/relume-ui";
import { useScroll, useTransform } from "framer-motion";
import React, { Fragment, useRef } from "react";
import { RxChevronRight } from "react-icons/rx";

const Circle = () => {
  const circleRef = useRef(null);
  const { scrollYProgress } = useScroll({
    target: circleRef,
    offset: ["end end", "end center"],
  });
  const backgroundColor = {
    backgroundColor: useTransform(scrollYProgress, [0.85, 1], ["#ccc", "#000"]),
  };
  return (
    <motion.div
      ref={circleRef}
      style={backgroundColor}
      className="z-20 mt-7 size-[0.9375rem] rounded-full shadow-[0_0_0_8px_white] md:mt-8"
    />
  );
};

export function Timeline13() {
  return (
    <section id="relume" className="px-[5%] py-16 md:py-24 lg:py-28">
      <div className="container">
        <div className="flex flex-col items-center">
          <div className="mb-12 text-center md:mb-18 lg:mb-20">
            <div className="relative z-10 w-full max-w-lg">
              <p className="mb-3 font-semibold md:mb-4">Adoption</p>
              <h2 className="mb-5 text-5xl font-bold md:mb-6 md:text-7xl lg:text-8xl">
                Your Journey to Adopting a Pet
              </h2>
              <p className="md:text-md">
                Adopting a pet is a rewarding experience. Follow our timeline to
                understand each step.
              </p>
              <div className="mt-6 flex items-center justify-center gap-x-4 md:mt-8">
                <Button title="Start" variant="secondary">
                  Start
                </Button>
                <Button
                  title="Learn"
                  variant="link"
                  size="link"
                  iconRight={<RxChevronRight />}
                >
                  Learn
                </Button>
              </div>
            </div>
          </div>
          <div className="relative grid auto-cols-fr grid-cols-1 justify-items-center gap-20">
            <div className="absolute flex h-full w-8 flex-col items-center justify-self-start md:justify-self-auto">
              <div className="absolute z-10 h-16 w-1 bg-gradient-to-b from-background-primary to-transparent" />
              <div className="sticky top-0 mt-[-50vh] h-[50vh] w-[3px] bg-neutral-black" />
              <div className="h-full w-[3px] bg-neutral-lighter" />
              <div className="absolute bottom-0 z-0 h-16 w-1 bg-gradient-to-b from-transparent to-background-primary" />
              <div className="absolute top-[-50vh] h-[50vh] w-full bg-background-primary" />
            </div>
            <div className="grid auto-cols-fr grid-cols-[max-content_1fr] items-start justify-items-center gap-4 md:grid-cols-[1fr_max-content_1fr] md:gap-8 lg:gap-12">
              <Fragment>
                <div className="order-last w-full overflow-hidden md:order-none md:w-auto">
                  <img
                    src="https://d22po4pjz3o32e.cloudfront.net/placeholder-image.svg"
                    alt="Relume placeholder image 1"
                    className="w-full rounded-image"
                  />
                </div>
                <div className="col-span-1 row-span-2 flex h-full w-8 justify-center">
                  <Circle />
                </div>
                <div className="mt-4 grid grid-cols-1 gap-8 md:gap-12">
                  <div>
                    <h3 className="mb-5 text-4xl leading-[1.2] font-bold md:mb-6 md:text-5xl lg:text-6xl">
                      Step 1
                    </h3>
                    <h4 className="mb-3 text-xl font-bold md:mb-4 md:text-2xl">
                      Find Your Match
                    </h4>
                    <p>
                      Browse through our available animals. Take your time to
                      find the perfect companion.
                    </p>
                    <div className="mt-6 flex flex-wrap items-center gap-4 md:mt-8">
                      <Button title="Next" variant="secondary">
                        Next
                      </Button>
                      <Button
                        title="Details"
                        variant="link"
                        size="link"
                        iconRight={<RxChevronRight />}
                      >
                        Details
                      </Button>
                    </div>
                  </div>
                </div>
              </Fragment>
            </div>
            <div className="grid auto-cols-fr grid-cols-[max-content_1fr] items-start justify-items-center gap-4 md:grid-cols-[1fr_max-content_1fr] md:gap-8 lg:gap-12">
              <Fragment>
                <div className="mt-4 grid grid-cols-1 items-start gap-8 text-left md:items-end md:gap-12 md:text-right">
                  <div>
                    <h3 className="mb-5 text-4xl leading-[1.2] font-bold md:mb-6 md:text-5xl lg:text-6xl">
                      Step 2
                    </h3>
                    <h4 className="mb-3 text-xl font-bold md:mb-4 md:text-2xl">
                      Complete Application
                    </h4>
                    <p>
                      Fill out our adoption application form. Make sure to
                      provide accurate information.
                    </p>
                    <div className="mt-6 flex flex-wrap items-center gap-4 md:mt-8 md:justify-end">
                      <Button title="Submit" variant="secondary">
                        Submit
                      </Button>
                      <Button
                        title="Check"
                        variant="link"
                        size="link"
                        iconRight={<RxChevronRight />}
                      >
                        Check
                      </Button>
                    </div>
                  </div>
                </div>
                <div className="order-first col-span-1 row-span-2 flex h-full w-8 justify-center md:order-none">
                  <Circle />
                </div>
                <div className="order-last w-full overflow-hidden md:order-none md:w-auto">
                  <img
                    src="https://d22po4pjz3o32e.cloudfront.net/placeholder-image.svg"
                    alt="Relume placeholder image 2"
                    className="w-full rounded-image"
                  />
                </div>
              </Fragment>
            </div>
            <div className="grid auto-cols-fr grid-cols-[max-content_1fr] items-start justify-items-center gap-4 md:grid-cols-[1fr_max-content_1fr] md:gap-8 lg:gap-12">
              <Fragment>
                <div className="order-last w-full overflow-hidden md:order-none md:w-auto">
                  <img
                    src="https://d22po4pjz3o32e.cloudfront.net/placeholder-image.svg"
                    alt="Relume placeholder image 3"
                    className="w-full rounded-image"
                  />
                </div>
                <div className="col-span-1 row-span-2 flex h-full w-8 justify-center">
                  <Circle />
                </div>
                <div className="mt-4 grid grid-cols-1 gap-8 md:gap-12">
                  <div>
                    <h3 className="mb-5 text-4xl leading-[1.2] font-bold md:mb-6 md:text-5xl lg:text-6xl">
                      Step 3
                    </h3>
                    <h4 className="mb-3 text-xl font-bold md:mb-4 md:text-2xl">
                      Meet Your Pet
                    </h4>
                    <p>
                      Schedule a meet-and-greet with your chosen animal. This is
                      a crucial step to ensure compatibility.
                    </p>
                    <div className="mt-6 flex flex-wrap items-center gap-4 md:mt-8">
                      <Button title="Confirm" variant="secondary">
                        Confirm
                      </Button>
                      <Button
                        title="Adopt"
                        variant="link"
                        size="link"
                        iconRight={<RxChevronRight />}
                      >
                        Adopt
                      </Button>
                    </div>
                  </div>
                </div>
              </Fragment>
            </div>
            <div className="grid auto-cols-fr grid-cols-[max-content_1fr] items-start justify-items-center gap-4 md:grid-cols-[1fr_max-content_1fr] md:gap-8 lg:gap-12">
              <Fragment>
                <div className="mt-4 grid grid-cols-1 items-start gap-8 text-left md:items-end md:gap-12 md:text-right">
                  <div>
                    <h3 className="mb-5 text-4xl leading-[1.2] font-bold md:mb-6 md:text-5xl lg:text-6xl">
                      Step 4
                    </h3>
                    <h4 className="mb-3 text-xl font-bold md:mb-4 md:text-2xl">
                      Finalize Adoption
                    </h4>
                    <p>
                      Complete the adoption paperwork and pay the fee. Welcome
                      your new pet home!
                    </p>
                    <div className="mt-6 flex flex-wrap items-center gap-4 md:mt-8 md:justify-end">
                      <Button title="Celebrate" variant="secondary">
                        Celebrate
                      </Button>
                      <Button
                        title="Share"
                        variant="link"
                        size="link"
                        iconRight={<RxChevronRight />}
                      >
                        Share
                      </Button>
                    </div>
                  </div>
                </div>
                <div className="order-first col-span-1 row-span-2 flex h-full w-8 justify-center md:order-none">
                  <Circle />
                </div>
                <div className="order-last w-full overflow-hidden md:order-none md:w-auto">
                  <img
                    src="https://d22po4pjz3o32e.cloudfront.net/placeholder-image.svg"
                    alt="Relume placeholder image 4"
                    className="w-full rounded-image"
                  />
                </div>
              </Fragment>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
