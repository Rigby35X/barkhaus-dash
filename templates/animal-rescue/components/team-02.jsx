"use client";

import { Button } from "@relume_io/relume-ui";
import React from "react";
import { BiLogoDribbble, BiLogoLinkedinSquare } from "react-icons/bi";
import { FaXTwitter } from "react-icons/fa6";

export function Team2() {
  return (
    <section id="relume" className="px-[5%] py-16 md:py-24 lg:py-28">
      <div className="container">
        <div className="mx-auto mb-12 max-w-lg text-center md:mb-18 lg:mb-20">
          <p className="mb-3 font-semibold md:mb-4">Dedicated</p>
          <h2 className="rb-5 mb-5 text-5xl font-bold md:mb-6 md:text-7xl lg:text-8xl">
            Our Team
          </h2>
          <p className="md:text-md">
            Meet the passionate individuals behind our rescue efforts.
          </p>
        </div>
        <div className="grid grid-cols-1 items-start justify-center gap-x-8 gap-y-12 md:grid-cols-2 md:gap-y-16 lg:grid-cols-4">
          <div className="flex flex-col text-center">
            <div className="relative mb-5 size-full overflow-hidden pt-[66%] md:mb-6 md:pt-[100%]">
              <img
                src="https://d22po4pjz3o32e.cloudfront.net/placeholder-image.svg"
                alt="Relume placeholder image"
                className="absolute inset-0 size-full object-cover"
              />
            </div>
            <div className="mb-3 md:mb-4">
              <h5 className="text-md font-semibold md:text-lg">Jane Doe</h5>
              <h6 className="md:text-md">Team Leader</h6>
            </div>
            <p>
              With over 10 years of experience in animal rescue, Jane leads our
              dedicated team.
            </p>
            <div className="mt-6 grid grid-flow-col grid-cols-[max-content] gap-3.5 self-center">
              <a href="#">
                <BiLogoLinkedinSquare className="size-6" />
              </a>
              <a href="#">
                <FaXTwitter className="size-6 p-0.5" />
              </a>
              <a href="#">
                <BiLogoDribbble className="size-6" />
              </a>
            </div>
          </div>
          <div className="flex flex-col text-center">
            <div className="relative mb-5 size-full overflow-hidden pt-[66%] md:mb-6 md:pt-[100%]">
              <img
                src="https://d22po4pjz3o32e.cloudfront.net/placeholder-image.svg"
                alt="Relume placeholder image"
                className="absolute inset-0 size-full object-cover"
              />
            </div>
            <div className="mb-3 md:mb-4">
              <h5 className="text-md font-semibold md:text-lg">John Smith</h5>
              <h6 className="md:text-md">Volunteer Coordinator</h6>
            </div>
            <p>
              John organizes volunteer efforts and ensures our team is
              well-supported and trained.
            </p>
            <div className="mt-6 grid grid-flow-col grid-cols-[max-content] gap-3.5 self-center">
              <a href="#">
                <BiLogoLinkedinSquare className="size-6" />
              </a>
              <a href="#">
                <FaXTwitter className="size-6 p-0.5" />
              </a>
              <a href="#">
                <BiLogoDribbble className="size-6" />
              </a>
            </div>
          </div>
          <div className="flex flex-col text-center">
            <div className="relative mb-5 size-full overflow-hidden pt-[66%] md:mb-6 md:pt-[100%]">
              <img
                src="https://d22po4pjz3o32e.cloudfront.net/placeholder-image.svg"
                alt="Relume placeholder image"
                className="absolute inset-0 size-full object-cover"
              />
            </div>
            <div className="mb-3 md:mb-4">
              <h5 className="text-md font-semibold md:text-lg">
                Emily Johnson
              </h5>
              <h6 className="md:text-md">Foster Manager</h6>
            </div>
            <p>
              Emily connects foster families with animals in need of temporary
              homes.
            </p>
            <div className="mt-6 grid grid-flow-col grid-cols-[max-content] gap-3.5 self-center">
              <a href="#">
                <BiLogoLinkedinSquare className="size-6" />
              </a>
              <a href="#">
                <FaXTwitter className="size-6 p-0.5" />
              </a>
              <a href="#">
                <BiLogoDribbble className="size-6" />
              </a>
            </div>
          </div>
          <div className="flex flex-col text-center">
            <div className="relative mb-5 size-full overflow-hidden pt-[66%] md:mb-6 md:pt-[100%]">
              <img
                src="https://d22po4pjz3o32e.cloudfront.net/placeholder-image.svg"
                alt="Relume placeholder image"
                className="absolute inset-0 size-full object-cover"
              />
            </div>
            <div className="mb-3 md:mb-4">
              <h5 className="text-md font-semibold md:text-lg">
                Michael Brown
              </h5>
              <h6 className="md:text-md">Adoption Specialist</h6>
            </div>
            <p>
              Michael guides families through the adoption process, ensuring a
              perfect match.
            </p>
            <div className="mt-6 grid grid-flow-col grid-cols-[max-content] gap-3.5 self-center">
              <a href="#">
                <BiLogoLinkedinSquare className="size-6" />
              </a>
              <a href="#">
                <FaXTwitter className="size-6 p-0.5" />
              </a>
              <a href="#">
                <BiLogoDribbble className="size-6" />
              </a>
            </div>
          </div>
          <div className="flex flex-col text-center">
            <div className="relative mb-5 size-full overflow-hidden pt-[66%] md:mb-6 md:pt-[100%]">
              <img
                src="https://d22po4pjz3o32e.cloudfront.net/placeholder-image.svg"
                alt="Relume placeholder image"
                className="absolute inset-0 size-full object-cover"
              />
            </div>
            <div className="mb-3 md:mb-4">
              <h5 className="text-md font-semibold md:text-lg">Sarah Davis</h5>
              <h6 className="md:text-md">Outreach Coordinator</h6>
            </div>
            <p>
              Sarah raises awareness about our mission and connects with the
              community.
            </p>
            <div className="mt-6 grid grid-flow-col grid-cols-[max-content] gap-3.5 self-center">
              <a href="#">
                <BiLogoLinkedinSquare className="size-6" />
              </a>
              <a href="#">
                <FaXTwitter className="size-6 p-0.5" />
              </a>
              <a href="#">
                <BiLogoDribbble className="size-6" />
              </a>
            </div>
          </div>
          <div className="flex flex-col text-center">
            <div className="relative mb-5 size-full overflow-hidden pt-[66%] md:mb-6 md:pt-[100%]">
              <img
                src="https://d22po4pjz3o32e.cloudfront.net/placeholder-image.svg"
                alt="Relume placeholder image"
                className="absolute inset-0 size-full object-cover"
              />
            </div>
            <div className="mb-3 md:mb-4">
              <h5 className="text-md font-semibold md:text-lg">
                We're hiring!
              </h5>
              <h6 className="md:text-md">
                Join our team and make a difference today!
              </h6>
            </div>
            <p>Explore exciting opportunities to help animals in need.</p>
            <div className="mt-6 grid grid-flow-col grid-cols-[max-content] gap-3.5 self-center">
              <a href="#">
                <BiLogoLinkedinSquare className="size-6" />
              </a>
              <a href="#">
                <FaXTwitter className="size-6 p-0.5" />
              </a>
              <a href="#">
                <BiLogoDribbble className="size-6" />
              </a>
            </div>
          </div>
          <div className="flex flex-col text-center">
            <div className="relative mb-5 size-full overflow-hidden pt-[66%] md:mb-6 md:pt-[100%]">
              <img
                src="https://d22po4pjz3o32e.cloudfront.net/placeholder-image.svg"
                alt="Relume placeholder image"
                className="absolute inset-0 size-full object-cover"
              />
            </div>
            <div className="mb-3 md:mb-4">
              <h5 className="text-md font-semibold md:text-lg">
                Open Positions
              </h5>
              <h6 className="md:text-md">Various Roles</h6>
            </div>
            <p>Check out our current job openings and apply to join us!</p>
            <div className="mt-6 grid grid-flow-col grid-cols-[max-content] gap-3.5 self-center">
              <a href="#">
                <BiLogoLinkedinSquare className="size-6" />
              </a>
              <a href="#">
                <FaXTwitter className="size-6 p-0.5" />
              </a>
              <a href="#">
                <BiLogoDribbble className="size-6" />
              </a>
            </div>
          </div>
          <div className="flex flex-col text-center">
            <div className="relative mb-5 size-full overflow-hidden pt-[66%] md:mb-6 md:pt-[100%]">
              <img
                src="https://d22po4pjz3o32e.cloudfront.net/placeholder-image.svg"
                alt="Relume placeholder image"
                className="absolute inset-0 size-full object-cover"
              />
            </div>
            <div className="mb-3 md:mb-4">
              <h5 className="text-md font-semibold md:text-lg">
                Volunteer Today
              </h5>
              <h6 className="md:text-md">Make Impact</h6>
            </div>
            <p>
              Your time can change lives—volunteer with us and help animals find
              homes.
            </p>
            <div className="mt-6 grid grid-flow-col grid-cols-[max-content] gap-3.5 self-center">
              <a href="#">
                <BiLogoLinkedinSquare className="size-6" />
              </a>
              <a href="#">
                <FaXTwitter className="size-6 p-0.5" />
              </a>
              <a href="#">
                <BiLogoDribbble className="size-6" />
              </a>
            </div>
          </div>
        </div>
        <div className="mx-auto mt-14 w-full max-w-md text-center md:mt-20 lg:mt-24">
          <h4 className="mb-3 text-2xl font-bold md:mb-4 md:text-3xl md:leading-[1.3] lg:text-4xl">
            We're hiring!
          </h4>
          <p className="md:text-md">
            Join our passionate team and help save lives.
          </p>
          <div className="mt-6 flex items-center justify-center gap-x-4 text-center md:mt-8">
            <Button variant="secondary">Open Positions</Button>
          </div>
        </div>
      </div>
    </section>
  );
}
