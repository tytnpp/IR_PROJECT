import Navbar from "@/components/common/Navbar";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Separator } from "@/components/ui/separator";
// import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import z from "zod";
// import Link from "next/link";
import axios from "axios";
import { useRouter } from "next/router";
import { toast } from "sonner";

import Cookies from "js-cookie";

type Props = {};

const formSchema = z.object({
  email: z.string().email(),
  password: z.string().min(8),
});

export default function Login({}: Props) {
  const router = useRouter();
  // 1. Define your form.
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      email: "",
      password: "",
    },
  });

  // 2. Define a submit handler.
  async function onSubmit(values: z.infer<typeof formSchema>) {
    try {
      await toast.promise(
        axios.post("http://localhost:5000/auth/login", {
          email: values.email,
          password: values.password,
        }),
        {
          loading: "Loading...",
          success: (res) => {
            // console.log(res);
            if (res.data.status === "success") {
              Cookies.set("token", res.data.results.data.token);
              router.push("/user");
              return "Login successful";
            } else {
              throw new Error(res.data.results.message);
            }
          },
          error: (err) => {
            console.log(err);
            return "Login failed";
          },
        }
      );
    } catch (error) {
      console.error(error);
    }
  }

  return (
    <div className="flex flex-col w-full min-h-screen relative">
      <Navbar />
      <Card className="mx-auto max-w-md my-auto w-full">
        <CardHeader className="space-y-1">
          <CardTitle className="text-2xl font-bold">Login</CardTitle>
          <CardDescription>
            Enter your email below to login to your account
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
              <FormField
                control={form.control}
                name="email"
                render={({ field }) => (
                  <FormItem className="space-y-2">
                    <FormLabel>Email</FormLabel>
                    <FormControl>
                      <Input required placeholder="m@example.com" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="password"
                render={({ field }) => (
                  <FormItem className="space-y-2">
                    <FormLabel>Password</FormLabel>
                    <FormControl>
                      <Input required type="password" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <Button type="submit" className="w-full">
                Login
              </Button>
            </form>
          </Form>
          <Separator className="my-6" />
          <div className="text-center">
            <Button
              variant="ghost"
              onClick={() => {
                router.push("/auth/register");
              }}
              className="gap-2"
            >
              <span>{`Don't have an account?`}</span>
              <span className="text-blue-500">Sign up</span>
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
