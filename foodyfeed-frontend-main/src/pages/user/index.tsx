import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import axios from "axios";
import {
  Bookmark,
  DeleteIcon,
  HomeIcon,
  SearchIcon,
  TrashIcon,
} from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/router";
import { useEffect, useState } from "react";

import Cookies from "js-cookie";

type Props = {};

type PropsData = {
  uid: string;
  ruid: string;
  uuid: string;
  name: string;
  description: string;
  imageURL: string[];
};

export default function User({}: Props) {
  const router = useRouter();

  const [bookmarks, setBookmarks] = useState<PropsData[]>([]); // for init data

  // get all bookmarks
  // can delete bookmarks

  useEffect(() => {
    const getBookmarks = async () => {
      const token = Cookies.get("token");
      if (!token) {
        router.push("/login");
      }
      try {
        // console.log(token);
        const res = await axios.get("http://localhost:5000/user/bookmark", {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        // console.log(res.data.stats);
        if (res.status === 200) {
          if (res.data.status == "success") {
            console.log(res.data.results);
            if (res.data.status == "success") {
              setBookmarks(res.data.results);
            }
            // setBookmarks(res.data.results.data);
          }
        }
        // setBookmarks(
        //   res.data.results.data.map((row: PropsData) => {
        //     return {
        //       name: row.Name,
        //       description: row.Description,
        //       image: row.Images[0],
        //       time: row.CookTime,
        //       rating: row.ReviewCount,

        // console.log(res);
        // setBookmarks(data);
      } catch (error) {
        console.error(error);
      }
    };
    getBookmarks();
    // get all bookmarks
    // setBookmarks(data)
  }, [router]);

  return (
    <div className="flex min-h-screen w-full">
      <div className="hidden border-r bg-gray-100/40 md:block dark:bg-gray-800/40 max-w-[14rem] w-full">
        <div className="flex h-full max-h-screen flex-col gap-2">
          <div className="flex h-[60px] items-center border-b px-6">
            <Link className="flex items-center gap-2 font-semibold" href="/">
              🍔
              <span className="">Foodyfeed</span>
            </Link>
            {/* <Button className="ml-auto h-8 w-8" size="icon" variant="outline">
              <BellIcon className="h-4 w-4" />
              <span className="sr-only">Toggle notifications</span>
            </Button> */}
          </div>
          <div className="flex-1 overflow-auto py-2">
            <nav className="grid items-start px-4 text-sm font-medium">
              <Link
                className="flex items-center gap-3 rounded-lg px-3 py-2 text-gray-500 transition-all hover:text-gray-900 dark:text-gray-400 dark:hover:text-gray-50"
                href="/"
              >
                <HomeIcon className="h-4 w-4" />
                Home
              </Link>
              <Link
                className="flex items-center gap-3 rounded-lg px-3 py-2 text-gray-500 transition-all hover:text-gray-900 dark:text-gray-400 dark:hover:text-gray-50"
                href="/"
              >
                <SearchIcon className="h-4 w-4" />
                Search
              </Link>
              <Link
                className="flex items-center gap-3 rounded-lg bg-gray-100 px-3 py-2 text-gray-900  transition-all hover:text-gray-900 dark:bg-gray-800 dark:text-gray-50 dark:hover:text-gray-50"
                href="/user"
              >
                <Bookmark className="h-4 w-4" />
                Bookmarks
              </Link>
            </nav>
          </div>
        </div>
      </div>
      <div className="flex flex-col w-full">
        <header className="flex h-14 lg:h-[60px] items-center gap-4 border-b bg-gray-100/40 px-6 dark:bg-gray-800/40">
          <Link className="lg:hidden" href="/">
            <HomeIcon />
            <span className="sr-only">Home</span>
          </Link>
          <div className="w-full flex-1">
            <form>
              <div className="relative">
                <SearchIcon className="absolute left-2.5 top-2.5 h-4 w-4 text-gray-500 dark:text-gray-400" />
                <Input
                  className="w-full bg-white shadow-none appearance-none pl-8 md:w-2/3 lg:w-1/3 dark:bg-gray-950"
                  placeholder="Search products..."
                  type="search"
                />
              </div>
            </form>
          </div>
          {/* <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button
                className="rounded-full border border-gray-200 w-8 h-8 dark:border-gray-800"
                size="icon"
                variant="ghost"
              >
                <Image
                  alt="Avatar"
                  className="rounded-full"
                  height="32"
                  src="/placeholder.svg"
                  style={{
                    aspectRatio: "32/32",
                    objectFit: "cover",
                  }}
                  width="32"
                />
                <span className="sr-only">Toggle user menu</span>
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="bg-white p-2">
              <DropdownMenuLabel>My Account</DropdownMenuLabel>
              <DropdownMenuSeparator />
              <DropdownMenuItem>Settings</DropdownMenuItem>
              <DropdownMenuItem>Support</DropdownMenuItem>
              <DropdownMenuSeparator />
              <DropdownMenuItem>Logout</DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu> */}
        </header>
        <main className="flex flex-1 flex-col gap-4 p-4 md:gap-8 md:p-6">
          <div className="flex items-center">
            <h1 className="font-semibold text-lg md:text-2xl">Bookmarks</h1>
            <Button
              className="ml-auto"
              size="sm"
              onClick={() => {
                router.push("/search");
              }}
            >
              Add Bookmark
            </Button>
          </div>
          <div className="border shadow-sm rounded-lg">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead className="max-w-[150px]">Name</TableHead>
                  <TableHead className="hidden md:table-cell">Author</TableHead>
                  <TableHead className="hidden md:table-cell">Review</TableHead>
                  <TableHead>Author</TableHead>
                  <TableHead>Action</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {bookmarks.map((row: PropsData) => {
                  if (row.imageURL[0] === "") {
                    return null;
                  }
                  return (
                    <TableRow key={row.uid}>
                      <TableCell className="font-medium">{row.name}</TableCell>
                      <TableCell className="hidden md:table-cell">
                        {row.description}
                      </TableCell>
                      <TableCell>500 in stock</TableCell>
                      <TableCell className="hidden md:table-cell">
                        Luminance Creations
                      </TableCell>

                      <TableCell className="hidden md:table-cell">
                        <Button
                          variant={"ghost"}
                          size={"icon"}
                          className="p-1 text-white bg-red-500 rounded-lg hover:bg-red-600 hover:text-white"
                          onClick={() => {}}
                        >
                          <TrashIcon className="w-5 h-5 " />
                        </Button>
                      </TableCell>
                    </TableRow>
                  );
                })}
              </TableBody>
            </Table>
          </div>
        </main>
      </div>
    </div>
  );
}
