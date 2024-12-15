"use client";
import { useEffect } from "react";

export default function Home() {
  useEffect(() => {
    console.log(Math.floor(Date.now() / 1000));
  });
  return <main>Home</main>;
}
