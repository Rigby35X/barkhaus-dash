"use client";

import { Button, Checkbox, Input, Label, Textarea } from "@relume_io/relume-ui";
import React from "react";

export function Contact3() {
  return (
    <section id="relume" className="px-[5%] py-16 md:py-24 lg:py-28">
      <div className="container">
        <div className="mb-8 w-full max-w-lg md:mb-10 lg:mb-12">
          <p className="mb-3 font-semibold md:mb-4">Join</p>
          <h2 className="rb-5 mb-5 text-5xl font-bold md:mb-6 md:text-7xl lg:text-8xl">
            Get Involved
          </h2>
          <p className="md:text-md">
            Become a vital part of our rescue community.
          </p>
        </div>
        <form className="grid w-full max-w-md grid-cols-1 gap-6">
          <div className="grid w-full items-center">
            <Label htmlFor="name" className="mb-2">
              Name
            </Label>
            <Input type="text" id="name" />
          </div>
          <div className="grid w-full items-center">
            <Label htmlFor="email" className="mb-2">
              Email
            </Label>
            <Input type="email" id="email" />
          </div>
          <div className="grid w-full items-center">
            <Label htmlFor="message" className="mb-2">
              Message
            </Label>
            <Textarea
              id="message"
              placeholder="Type your message..."
              className="min-h-[11.25rem] overflow-auto"
            />
          </div>
          <div className="mb-3 flex items-center space-x-2 text-sm md:mb-4">
            <Checkbox id="terms" />
            <Label htmlFor="terms" className="cursor-pointer">
              I accept the Terms
            </Label>
          </div>
          <div>
            <Button title="Submit">Submit</Button>
          </div>
        </form>
      </div>
    </section>
  );
}
