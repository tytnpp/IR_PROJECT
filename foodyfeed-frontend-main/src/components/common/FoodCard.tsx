import Image from "next/image";
import Link from "next/link";
import React from "react";
import { Button } from "../ui/button";
import { ClockIcon, StarIcon } from "lucide-react";

type Props = {
  name: string;
  description: string;
  image: string;
  time: number;
  rating: number;
  author: string;
  bookmark: {
    isBookmarked: boolean;
    toggleBookmark: (value: boolean) => void;
  };
  link?: string;
};

export default function FoodCard(props: Props) {
  return (
    <div className="relative group">
      <Link className="absolute inset-0 z-10" href="/">
        <span className="sr-only">View</span>
      </Link>
      <Button
        className="absolute top-2 right-2 z-20"
        variant={"outline"}
        size={"icon"}
        onClick={() =>
          props.bookmark.toggleBookmark(!props.bookmark.isBookmarked)
        }
      >
        <StarIcon />
      </Button>

      <Image
        alt={props.image}
        className="object-cover w-full h-52 sm:h-60"
        height="250"
        unoptimized
        src={props.image}
        blurDataURL="data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAQAAAC1HAwCAAAAC0lEQVR42mP8/w8AAwAB/8A3F6e5AAAAAElFTkSuQmCC"
        placeholder="blur"
        loader={({ src }) => src}
        loading="lazy"
        style={{
          aspectRatio: "400/250",
          objectFit: "cover",
        }}
        width="400"
      />
      <div className="bg-white shadow-lg dark:bg-gray-950 group-hover:translate-y-1 group-hover:shadow-xl transition-all translate-y-0/60 dark:group-hover:translate-y-0/60">
        <div className="grid gap-2 p-4">
          <h3 className="font-semibold">{props.name}</h3>
          <h4 className="text-sm text-gray-500 dark:text-gray-400 underline">
            <span className="sr-only">By</span>
            {props.author}
          </h4>
          <p className="text-sm text-gray-500 dark:text-gray-400">
            {props.description}
          </p>
        </div>
        <div className="border-t border-gray-100 dark:border-gray-800 p-4 flex justify-between">
          <h4 className="font-semibold inline-flex gap-2 items-center">
            <ClockIcon /> {props.time}
          </h4>

          <div>
            <span className="sr-only">Rating</span>
            <span className="flex items-center gap-1">
              <StarIcon />
              <span>{props.rating}</span>
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}
