import { cn } from "@/lib/utils";
import axios from "axios";
import Link from "next/link";
import React, { useEffect, useState } from "react";
import Cookies from "js-cookie";
import { Button } from "../ui/button";
import { useRouter } from "next/router";

type Props = {
  className?: string;
};

export default function Navbar(props: Props) {
  const [user, setUser] = useState(null);

  const router = useRouter();

  useEffect(() => {
    const token = Cookies.get("token");
    console.log(token);
    if (token) {
      const getUser = async () => {
        try {
          const response = await axios.get("http://localhost:5000/auth/me", {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          });

          if (response.data.status === "success") {
            // console.log(response.data.results);
            setUser(response.data.results.data);
          }
        } catch (err) {
          console.log(err);
        }
      };

      getUser();
    }
  }, []);

  return (
    <header
      className={cn(
        "flex h-20 w-full items-center px-4 md:px-6",
        props.className
      )}
    >
      <Link
        className="flex items-center font-semibold text-lg sm:text-xl"
        href="/"
      >
        Foody Feed 🍔
      </Link>
      <nav className="ml-auto space-x-4">
        <Link
          className="font-medium rounded-md px-2 py-1 transition-colors hover:bg-gray-100/50"
          href="/"
        >
          Home
        </Link>
        <Link
          className="font-medium rounded-md px-2 py-1 transition-colors hover:bg-gray-100/50"
          href="/search"
        >
          Food Search
        </Link>

        {user ? (
          <>
            <Link
              className="font-medium rounded-md px-2 py-1 transition-colors hover:bg-gray-100/50"
              href="/user"
            >
              Profile
            </Link>
            <Button
              className="font-medium rounded-md px-2 py-1 transition-colors hover:bg-gray-100/50"
              variant={"ghost"}
              onClick={() => {
                router.push("/auth/login");
                Cookies.remove("token");
              }}
            >
              Logout
            </Button>
            {/* <Link
              className="font-medium rounded-md px-2 py-1 transition-colors hover:bg-gray-100/50"
              href="/auth/logout"
            >
              Logout
            </Link> */}
          </>
        ) : (
          <>
            <Link
              className="font-medium rounded-md px-2 py-1 transition-colors hover:bg-gray-100/50"
              href="/auth/login"
            >
              Login
            </Link>
            <Link
              className="font-medium rounded-md px-2 py-1 transition-colors hover:bg-gray-100/50"
              href="/auth/register"
            >
              Register
            </Link>
          </>
        )}
      </nav>
    </header>
  );
}
