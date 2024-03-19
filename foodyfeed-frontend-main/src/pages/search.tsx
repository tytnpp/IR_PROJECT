import Navbar from "@/components/common/Navbar";
import { Input } from "@/components/ui/input";
import axios from "axios";
import { SearchIcon } from "lucide-react";
import React, { useEffect, useState } from "react";
import { PropsData, PropsFoodDataAccepeted } from ".";
import { Skeleton } from "@/components/ui/skeleton";
import FoodCard from "@/components/common/FoodCard";
import { Label } from "@/components/ui/label";
import { toast } from "sonner";

import Cookies from "js-cookie";

type Props = {};

export default function Search({}: Props) {
  const [data, setData] = useState<PropsFoodDataAccepeted[]>([]); // for init data

  const [dataState, setDataState] = useState<"idle" | "loading">("idle");

  const [meta, setMeta] = useState({
    page: 1,
    limit: 15,
    query: "",
  });

  useEffect(() => {
    setDataState("loading");
    setData([]);
    const fetchData = async ({
      page,
      limit,
      query,
    }: {
      page: number;
      limit: number;
      query: string;
    }) => {
      try {
        const response = await axios.get(
          `http://localhost:5000/search?page=${page}&limit=${limit}&q=${query}`
        );
        // console.log(response);
        if (response.status === 200) {
          await setData(
            response.data.results.data.map((row: PropsData) => {
              return {
                name: row.Name,
                description: row.Description,
                image: row.Images[0],
                time: row.CookTime,
                rating: row.ReviewCount,
                author: row.AuthorName,
                bookmark: {
                  isBookmarked: false,
                  toggleBookmark: (value: boolean) => value,
                },
                uid: row.RecipeId,
              };
            })
          );
        }
      } catch (error) {
        console.log(error);
      } finally {
        setDataState("idle");
      }
    };
    fetchData({
      page: meta.page,
      limit: meta.limit,
      query: meta.query,
    });
  }, [meta.query, meta.page, meta.limit]);

  const addBookmark = async (ruid: string) => {
    try {
      toast.promise(
        axios.post(
          `http://localhost:5000/user/bookmark`,
          {
            ruid: ruid,
          },
          {
            headers: {
              Authorization: `Bearer ${Cookies.get("token")}`,
            },
          }
        ),
        {
          loading: "Adding to bookmark",
          success: (res) => {
            // console.log(res.data.results.data, "success");
            if (res.data.results.message === "Bookmark added") {
              setData((prev) => {
                return prev.map((row) => {
                  if (row.uid === ruid) {
                    // console.log(row.uid, ruid, "row.uid === ruid");
                    // console.log(row.uid === ruid);
                    return {
                      ...row,
                      bookmark: {
                        ...row.bookmark,
                        isBookmarked: true,
                      },
                    };
                  }
                  return row;
                });
              });
            }
            return res.data.results.message;
          },
          error: (error) => {
            console.log(error);
            return "Failed to add to bookmark";
          },
        }
      );
    } catch (error) {
      console.log(error, "error");
    }
  };

  return (
    <div className="flex flex-col w-full min-h-screen">
      <Navbar />

      <main className="flex-1 w-full">
        <div className="mx-auto max-w-7xl grid gap-6 lg:gap-8 px-4 md:px-6">
          <div className="flex flex-col items-center justify-center space-y-2 lg:space-y-4">
            <h1 className="text-3xl font-bold tracking-tighter sm:text-5xl lg:text-6xl/none">
              Foodyfeed
            </h1>
            <p className="mx-auto max-w-[700px] text-center text-gray-500 dark:text-gray-400">
              Explore our wide variety of delicious foods. From appetizers to
              desserts, we have it all.
            </p>
          </div>
          <div className="flex flex-col items-center max-w-2xl mx-auto border w-full p-8 rounded-md gap-4">
            <div className="flex items-start">
              <Label>
                <span className="sr-only">Search</span>
                Search for your favorite food
              </Label>
            </div>
            <div className="w-full">
              <div className="relative">
                <SearchIcon className="absolute left-2.5 top-2.5 w-4 h-4 text-gray-300 dark:text-gray-700" />
                <Input
                  className="pl-8 w-full"
                  placeholder="Search"
                  type="search"
                  value={meta.query}
                  onChange={(e) => {
                    setMeta((prev) => ({ ...prev, query: e.target.value }));
                  }}
                />
              </div>
            </div>
          </div>
          <div className="grid md:grid-cols-2 lg:grid-cols-3 items-start gap-6 lg:gap-8">
            {dataState === "loading" ? (
              Array.from({ length: meta.limit }).map((_, index) => {
                return (
                  <div key={index} className="flex flex-col space-y-3">
                    <Skeleton className="min-h-[250px] w-full min-w-[250px] rounded-xl" />
                    <div className="space-y-2">
                      <Skeleton className="h-4 w-[250px]" />
                      <Skeleton className="h-4 w-[200px]" />
                    </div>
                  </div>
                );
              })
            ) : data.length === 0 ? (
              <div className="flex flex-col items-center justify-center space-y-2 lg:space-y-4 w-full min-h-[80dvh] col-span-full">
                <h1 className="text-3xl font-bold tracking-tighter sm:text-5xl lg:text-6xl/none">
                  No results found
                </h1>
                <p className="mx-auto max-w-[700px] text-center text-gray-500 dark:text-gray-400">
                  {`We couldn't find any results for your query. Please try again.`}
                </p>
              </div>
            ) : (
              data.map((row: PropsFoodDataAccepeted) => {
                if (row.image == "character(0") return;
                return (
                  <FoodCard
                    key={row.uid}
                    bookmark={{
                      isBookmarked: row.bookmark.isBookmarked,
                      toggleBookmark: (value: boolean) => {
                        addBookmark(row.uid);
                      },
                    }}
                    description={row.description}
                    image={row.image}
                    name={row.name}
                    time={row.time}
                    rating={row.rating}
                    author={row.author}
                  />
                );
              })
            )}
          </div>
        </div>
      </main>
    </div>
  );
}
