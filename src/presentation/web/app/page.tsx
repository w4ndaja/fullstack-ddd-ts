"use client";
import React, { useEffect, useState } from "react";
import { io } from "socket.io-client";

export default function Page() {
  const [changeCount, setChangeCount] = useState(0);
  useEffect(() => {
    const socket = io();
    socket.on("connect", () => {
      console.log(`Socket Connected With ID => ${socket.id}`);
    });
    socket.on("something-changes", (data) => {
      setChangeCount((data) => data + 1);
      console.log(data);
    });
  }, []);
  return <div>{changeCount}</div>;
}
