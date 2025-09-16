"use client";

import { Button, Input } from "@relume_io/relume-ui";
import React, { useState } from "react";
import {
  BiLogoFacebookCircle,
  BiLogoInstagram,
  BiLogoLinkedinSquare,
  BiLogoYoutube,
} from "react-icons/bi";
import { FaXTwitter } from "react-icons/fa6";

const useForm = () => {
  const [email, setEmail] = useState("");
  const handleSetEmail = (event) => {
    setEmail(event.target.value);
  };
  const handleSubmit = (event) => {
    event.preventDefault();
    console.log({ email });
  };
  return {
    email,
    handleSetEmail,
    handleSubmit,
  };
};

export function Footer1() {
  const formState = useForm();
  return (
    <footer id="relume" className="px-[5%] py-12 md:py-18 lg:py-20">
      <div className="container">
        <div className="grid grid-cols-1 gap-x-[8vw] gap-y-12 pb-12 md:gap-y-16 md:pb-18 lg:grid-cols-[0.75fr_1fr] lg:gap-y-4 lg:pb-20">
          <div className="flex flex-col">
            <a href="#" className="mb-5 md:mb-6">
              <img
                src="https://d22po4pjz3o32e.cloudfront.net/logo-image.svg"
                alt="Logo image"
                className="inline-block"
              />
            </a>
            <p className="mb-5 md:mb-6">
              Subscribe to our newsletter for the latest updates on features and
              releases.
            </p>
            <div className="w-full max-w-md">
              <form
                className="mb-3 grid grid-cols-1 gap-x-4 gap-y-3 sm:grid-cols-[1fr_max-content] md:gap-y-4"
                onSubmit={formState.handleSubmit}
              >
                <Input
                  id="email"
                  type="email"
                  placeholder="Your email here"
                  value={formState.email}
                  onChange={formState.handleSetEmail}
                />
                <Button title="Subscribe" variant="secondary" size="sm">
                  Subscribe
                </Button>
              </form>
              <p className="text-xs">
                By subscribing, you consent to our Privacy Policy and receiving
                updates.
              </p>
            </div>
          </div>
          <div className="grid grid-cols-1 items-start gap-y-10 sm:grid-cols-3 sm:gap-x-6 md:gap-x-8 md:gap-y-4">
            <div className="flex flex-col items-start justify-start">
              <h2 className="mb-3 font-semibold md:mb-4">Quick Links</h2>
              <ul>
                <li className="py-2 text-sm">
                  <a href="#" className="flex items-center gap-3">
                    <span>Adopt Today</span>
                  </a>
                </li>
                <li className="py-2 text-sm">
                  <a href="#" className="flex items-center gap-3">
                    <span>Volunteer Now</span>
                  </a>
                </li>
                <li className="py-2 text-sm">
                  <a href="#" className="flex items-center gap-3">
                    <span>Donate Here</span>
                  </a>
                </li>
                <li className="py-2 text-sm">
                  <a href="#" className="flex items-center gap-3">
                    <span>Contact Us</span>
                  </a>
                </li>
                <li className="py-2 text-sm">
                  <a href="#" className="flex items-center gap-3">
                    <span>Our Story</span>
                  </a>
                </li>
              </ul>
            </div>
            <div className="flex flex-col items-start justify-start">
              <h2 className="mb-3 font-semibold md:mb-4">Resources</h2>
              <ul>
                <li className="py-2 text-sm">
                  <a href="#" className="flex items-center gap-3">
                    <span>FAQs</span>
                  </a>
                </li>
                <li className="py-2 text-sm">
                  <a href="#" className="flex items-center gap-3">
                    <span>Adoption Process</span>
                  </a>
                </li>
                <li className="py-2 text-sm">
                  <a href="#" className="flex items-center gap-3">
                    <span>Privacy Policy</span>
                  </a>
                </li>
                <li className="py-2 text-sm">
                  <a href="#" className="flex items-center gap-3">
                    <span>Terms of Use</span>
                  </a>
                </li>
                <li className="py-2 text-sm">
                  <a href="#" className="flex items-center gap-3">
                    <span>Our Blog</span>
                  </a>
                </li>
              </ul>
            </div>
            <div className="flex flex-col items-start justify-start">
              <h2 className="mb-3 font-semibold md:mb-4">Stay Connected</h2>
              <ul className="flex flex-col items-start">
                <li className="py-2 text-sm">
                  <a href="#" className="flex items-center gap-3">
                    <BiLogoFacebookCircle className="size-6" />
                    <span>Facebook</span>
                  </a>
                </li>
                <li className="py-2 text-sm">
                  <a href="#" className="flex items-center gap-3">
                    <BiLogoInstagram className="size-6" />
                    <span>Instagram</span>
                  </a>
                </li>
                <li className="py-2 text-sm">
                  <a href="#" className="flex items-center gap-3">
                    <FaXTwitter className="size-6 p-0.5" />
                    <span>Twitter</span>
                  </a>
                </li>
                <li className="py-2 text-sm">
                  <a href="#" className="flex items-center gap-3">
                    <BiLogoLinkedinSquare className="size-6" />
                    <span>LinkedIn</span>
                  </a>
                </li>
                <li className="py-2 text-sm">
                  <a href="#" className="flex items-center gap-3">
                    <BiLogoYoutube className="size-6" />
                    <span>YouTube</span>
                  </a>
                </li>
              </ul>
            </div>
          </div>
        </div>
        <div className="h-px w-full bg-black" />
        <div className="flex flex-col-reverse items-start justify-between pt-6 pb-4 text-sm md:flex-row md:items-center md:pt-8 md:pb-0">
          <p className="mt-6 md:mt-0">© 2024 Relume. All rights reserved.</p>
          <ul className="grid grid-flow-row grid-cols-[max-content] justify-center gap-y-4 text-sm md:grid-flow-col md:gap-x-6 md:gap-y-0">
            <li className="underline">
              <a href="#">Privacy Policy</a>
            </li>
            <li className="underline">
              <a href="#">Terms of Service</a>
            </li>
            <li className="underline">
              <a href="#">Cookie Settings</a>
            </li>
          </ul>
        </div>
      </div>
    </footer>
  );
}
