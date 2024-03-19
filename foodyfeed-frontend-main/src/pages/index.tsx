import FoodCard from "@/components/common/FoodCard";
import Navbar from "@/components/common/Navbar";
import Cookies from "js-cookie";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Skeleton } from "@/components/ui/skeleton";
import axios from "axios";
import Image from "next/image";
import Link from "next/link";
// import { env } from "process";
import { useEffect, useState } from "react";
import { useRouter } from "next/router";
import { toast } from "sonner";

// export async function getServerSideProps() {
//   // server side env vars can be accessed in getServerSideProps() or
//   // getStaticProps() because they are executed on the server
//   // const myVar = process.env.
//   console.log('SERVER_SIDE_ONLY_VAR:', myVar);

//   return {
//       props: {}, // will be passed to the page component as props
//   }
// }

export type PropsData = {
  RecipeId: string;
  Name: string;
  AuthorId: string;
  AuthorName: string;
  CookTime: string;
  PrepTime: string;
  TotalTime: string;
  DatePublished: string;
  Description: string;
  Images: string[];
  RecipeCategory: string;
  Keywords: string[];
  RecipeIngredientQuantities: string[];
  RecipeIngredientParts: string[];
  AggregatedRating: string;
  ReviewCount: string;
  Calories: string;
  FatContent: string;
  SaturatedFatContent: string;
  CholesterolContent: string;
  SodiumContent: string;
  CarbohydrateContent: string;
  FiberContent: string;
  SugarContent: string;
  ProteinContent: string;
  RecipeServings: string;
  RecipeYield: string;
  RecipeInstructions: string[];
};

export type PropsFoodDataAccepeted = {
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
  uid: string;
};

export default function Home() {
  const [data, setData] = useState<PropsFoodDataAccepeted[]>([]);

  const router = useRouter();

  const [dataState, setDataState] = useState<"idle" | "loading">("idle");

  useEffect(() => {
    setDataState("loading");
    const fetchData = async () => {
      try {
        const response = await axios.get(
          "http://localhost:5000/search?page=1&limit=30"
        );
        console.log(response);
        if (response.status === 200) {
          setData(
            response.data.results.data.map((row: PropsData) => {
              if (row.Images[0] == "character(0") return;
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
    fetchData();
  }, []);

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
                  if (row?.uid === ruid) {
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
          <div className="grid md:grid-cols-2 lg:grid-cols-3 items-start gap-6 lg:gap-8">
            {dataState === "loading"
              ? Array.from({ length: 9 }).map((_, index) => {
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
              : data.map((row: PropsFoodDataAccepeted) => {
                  return (
                    <FoodCard
                      key={row?.uid}
                      bookmark={{
                        isBookmarked: row?.bookmark.isBookmarked,
                        toggleBookmark: (value: boolean) => {
                          if (Cookies.get("token")) {
                            addBookmark(row?.uid);
                          } else {
                            router.push("/auth/login");
                          }
                        },
                        // isBookmarked: false,
                        // toggleBookmark: (value: boolean) => {
                        //   if (Cookies.get("token")) {
                        //     console.log("Bookmarked");
                        //   } else {
                        //     router.push("/auth/login");
                        //   }
                        // },
                      }}
                      description={row?.description}
                      image={row?.image}
                      name={row?.name}
                      time={row?.time}
                      rating={row?.rating}
                      author={row?.author}
                    />
                  );
                })}
          </div>
        </div>
      </main>
    </div>
  );
}
