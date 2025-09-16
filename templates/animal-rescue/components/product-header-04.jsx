"use client";

import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbSeparator,
  Button,
  Input,
  Label,
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from "@relume_io/relume-ui";
import React, { Fragment } from "react";

const Star = () => {
  const fullStars = Math.floor(rating);
  const hasHalfStar = rating % 1 !== 0;
  return (
    <div className="flex items-center gap-1">
      {[...Array(5)].map((_, i) => {
        const isFullStar = i < fullStars;
        const isHalfStar = hasHalfStar && i === fullStars;

        return (
          <div key={i}>
            {isFullStar ? (
              <BiSolidStar />
            ) : isHalfStar ? (
              <BiSolidStarHalf />
            ) : (
              <BiStar />
            )}
          </div>
        );
      })}
    </div>
  );
};

export function ProductHeader4() {
  return (
    <header id="relume" className="px-[5%] py-12 md:py-16 lg:py-20">
      <div className="container">
        <div className="grid grid-cols-1 gap-y-8 md:gap-y-10 lg:grid-cols-[1.25fr_1fr] lg:gap-x-20">
          <Fragment>
            <div className="block lg:hidden">
              <img
                src="https://d22po4pjz3o32e.cloudfront.net/placeholder-image.svg"
                alt="Relume placeholder image 1"
                className="aspect-[5/6] size-full object-cover"
              />
            </div>
            <div className="hidden lg:flex lg:flex-col lg:gap-y-4">
              <div className="block">
                <img
                  src="https://d22po4pjz3o32e.cloudfront.net/placeholder-image.svg"
                  alt="Relume placeholder image 1"
                  className="aspect-[5/6] size-full object-cover"
                />
              </div>
              <div className="block">
                <img
                  src="https://d22po4pjz3o32e.cloudfront.net/placeholder-image.svg"
                  alt="Relume placeholder image 2"
                  className="aspect-[5/6] size-full object-cover"
                />
              </div>
              <div className="block">
                <img
                  src="https://d22po4pjz3o32e.cloudfront.net/placeholder-image.svg"
                  alt="Relume placeholder image 3"
                  className="aspect-[5/6] size-full object-cover"
                />
              </div>
              <div className="block">
                <img
                  src="https://d22po4pjz3o32e.cloudfront.net/placeholder-image.svg"
                  alt="Relume placeholder image 4"
                  className="aspect-[5/6] size-full object-cover"
                />
              </div>
              <div className="block">
                <img
                  src="https://d22po4pjz3o32e.cloudfront.net/placeholder-image.svg"
                  alt="Relume placeholder image 5"
                  className="aspect-[5/6] size-full object-cover"
                />
              </div>
              <div className="block">
                <img
                  src="https://d22po4pjz3o32e.cloudfront.net/placeholder-image.svg"
                  alt="Relume placeholder image 6"
                  className="aspect-[5/6] size-full object-cover"
                />
              </div>
            </div>
          </Fragment>
          <div>
            <div className="lg:sticky lg:top-32">
              <Breadcrumb className="mb-6 flex flex-wrap items-center text-sm">
                <BreadcrumbList>
                  <Fragment>
                    <BreadcrumbItem>
                      <BreadcrumbLink href="#">View all</BreadcrumbLink>
                    </BreadcrumbItem>
                    <BreadcrumbSeparator />
                  </Fragment>
                  <Fragment>
                    <BreadcrumbItem>
                      <BreadcrumbLink href="#">Pets</BreadcrumbLink>
                    </BreadcrumbItem>
                    <BreadcrumbSeparator />
                  </Fragment>
                  <Fragment>
                    <BreadcrumbItem>
                      <BreadcrumbLink href="#">Bella Beagle</BreadcrumbLink>
                    </BreadcrumbItem>
                  </Fragment>
                </BreadcrumbList>
              </Breadcrumb>
              <div>
                <h1 className="mb-5 text-4xl leading-[1.2] font-bold md:mb-6 md:text-5xl lg:text-6xl">
                  Bella Beagle
                </h1>
                <div className="mb-5 flex flex-col flex-wrap sm:flex-row sm:items-center md:mb-6">
                  <p className="text-xl font-bold md:text-2xl">$75</p>
                  <div className="mx-4 hidden w-px self-stretch bg-background-alternative sm:block" />
                  <div className="flex flex-wrap items-center gap-3">
                    <Star rating={3.5} />
                    <p className="text-sm">(4.8 stars) • 15 reviews</p>
                  </div>
                </div>
                <p className="mb-5 md:mb-6">
                  Meet Bella, a playful and affectionate beagle looking for her
                  forever home. She loves to explore and is great with kids and
                  other pets.
                </p>
                <form className="mb-8">
                  <div className="grid grid-cols-1 gap-6">
                    <div className="flex flex-col">
                      <Label className="mb-2">Size</Label>
                      <Select>
                        <SelectTrigger>
                          <SelectValue placeholder="Choose" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="first-choice">
                            Option One
                          </SelectItem>
                          <SelectItem value="second-choice">
                            Option Two
                          </SelectItem>
                          <SelectItem value="third-choice">
                            Option Three
                          </SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                    <div className="flex flex-col">
                      <Label className="mb-2">Size</Label>
                      <div className="flex flex-wrap gap-4">
                        <a
                          href="#"
                          className="rounded-button inline-flex gap-3 items-center justify-center whitespace-nowrap transition-all duration-200 ease-in-out disabled:pointer-events-none disabled:opacity-50 focus-visible:outline-none border border-border-primary bg-background-alternative text-text-alternative px-4 py-2"
                        >
                          Small size
                        </a>
                        <a
                          href="#"
                          className="rounded-button inline-flex gap-3 items-center justify-center whitespace-nowrap transition-all duration-200 ease-in-out disabled:pointer-events-none disabled:opacity-50 focus-visible:outline-none border border-border-primary text-text-primary bg-background-primary px-4 py-2"
                        >
                          Medium size
                        </a>
                        <a
                          href="#"
                          className="rounded-button inline-flex gap-3 items-center justify-center whitespace-nowrap transition-all duration-200 ease-in-out disabled:pointer-events-none disabled:opacity-50 focus-visible:outline-none border border-border-primary text-text-primary bg-background-primary px-4 py-2 pointer-events-none opacity-25"
                        >
                          Large size
                        </a>
                      </div>
                    </div>
                  </div>
                  <div className="mt-8">
                    <div className="grid grid-cols-[1fr_4rem] gap-x-4">
                      <Button title="Add to cart">Add to cart</Button>
                      <div className="flex flex-col">
                        <Input type="number" placeholder="1" />
                      </div>
                    </div>
                    <div className="my-4">
                      <Button
                        title="Buy now"
                        variant="secondary"
                        className="w-full"
                      >
                        Buy now
                      </Button>
                    </div>
                    <p className="text-center text-xs">
                      Free shipping on orders
                    </p>
                  </div>
                </form>
                <Tabs defaultValue="tab-details">
                  <TabsList className="mb-5 flex-wrap items-center gap-6 md:mb-6">
                    <TabsTrigger
                      value="tab-details"
                      className="border-0 border-b-[1.5px] border-border-alternative px-0 py-2 duration-0 data-[state=active]:border-b-[1.5px] data-[state=active]:border-border-primary data-[state=active]:bg-transparent data-[state=active]:text-text-primary"
                    >
                      Info
                    </TabsTrigger>
                    <TabsTrigger
                      value="tab-shipping"
                      className="border-0 border-b-[1.5px] border-border-alternative px-0 py-2 duration-0 data-[state=active]:border-b-[1.5px] data-[state=active]:border-border-primary data-[state=active]:bg-transparent data-[state=active]:text-text-primary"
                    >
                      Delivery
                    </TabsTrigger>
                    <TabsTrigger
                      value="tab-returns"
                      className="border-0 border-b-[1.5px] border-border-alternative px-0 py-2 duration-0 data-[state=active]:border-b-[1.5px] data-[state=active]:border-border-primary data-[state=active]:bg-transparent data-[state=active]:text-text-primary"
                    >
                      Policy
                    </TabsTrigger>
                  </TabsList>
                  <TabsContent
                    value="tab-details"
                    className="data-[state=active]:animate-tabs"
                  >
                    <p>
                      Our return policy allows for a 14-day adjustment period.
                      If you find that Bella isn't the right fit, please contact
                      us. We want to ensure every pet finds their perfect home.
                    </p>
                  </TabsContent>
                  <TabsContent
                    value="tab-shipping"
                    className="data-[state=active]:animate-tabs"
                  >
                    <p>
                      Our return policy allows for a 14-day adjustment period.
                      If you find that Bella isn't the right fit, please contact
                      us. We want to ensure every pet finds their perfect home.
                    </p>
                  </TabsContent>
                  <TabsContent
                    value="tab-returns"
                    className="data-[state=active]:animate-tabs"
                  >
                    <p>
                      Our return policy allows for a 14-day adjustment period.
                      If you find that Bella isn't the right fit, please contact
                      us. We want to ensure every pet finds their perfect home.
                    </p>
                  </TabsContent>
                </Tabs>
              </div>
            </div>
          </div>
        </div>
      </div>
    </header>
  );
}
