import "@/styles/globals.css";
import type { AppProps } from "next/app";
import { Toaster } from "sonner";
// import { Toaster } from "@/components/ui/sonner";

export default function App({ Component, pageProps }: AppProps) {
  return (
    <>
      <Toaster />
      <Component {...pageProps} />;
    </>
  );
}
