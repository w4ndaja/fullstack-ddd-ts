"use client";
import React, { useEffect, useRef, useState } from "react";
export default function RexMeet(props: any) {
  const appId: number = Number(props.params.appId);
  const { token, roomID, userID, userName }: any = props.params;
  const streamContainerRef = useRef<HTMLDivElement>(null);
  const [run, setRun] = useState(1);
  useEffect(() => {
    const doAsync_ = async () => {
      const { ZegoUIKitPrebuilt } = await import("@zegocloud/zego-uikit-prebuilt");
      const { ZIM } = await import("zego-zim-web");
      console.log({ZegoUIKitPrebuilt, ZIM})
    }
    const doAsync = async () => {
      const { ZegoUIKitPrebuilt } = await import("@zegocloud/zego-uikit-prebuilt");
      const { ZIM } = await import("zego-zim-web");
      const kitToken = ZegoUIKitPrebuilt.generateKitTokenForProduction(
        appId,
        token,
        roomID,
        userID,
        userName
      );
      // const kitToken =  ZegoUIKitPrebuilt.generateKitTokenForTest(appId, "94d3c7a74038ee8ed17f0e472340d500", roomId,  userId,  userName);

      const getUrlParams: any = (url = window.location.href) => {
        let urlStr = url.split("?")[1];
        return new URLSearchParams(urlStr);
      };
      let role_str = getUrlParams(window.location.href).get("role") || "Host";
      const role =
        role_str === "Host"
          ? ZegoUIKitPrebuilt.Host
          : role_str === "Cohost"
          ? ZegoUIKitPrebuilt.Cohost
          : ZegoUIKitPrebuilt.Audience;

      let sharedLinks = [];
      if (role === ZegoUIKitPrebuilt.Host || role === ZegoUIKitPrebuilt.Cohost) {
        sharedLinks.push({
          name: "Join as co-host",
          url:
            window.location.protocol +
            "//" +
            window.location.host +
            window.location.pathname +
            "?roomID=" +
            roomID +
            "&role=Cohost",
        });
      }
      sharedLinks.push({
        name: "Join as audience",
        url:
          window.location.protocol +
          "//" +
          window.location.host +
          window.location.pathname +
          "?roomID=" +
          roomID +
          "&role=Audience",
      });

      const zp = ZegoUIKitPrebuilt.create(kitToken);
      zp.addPlugins({ ZIM });
      // start the call
      zp.joinRoom({
        container: streamContainerRef.current,
        scenario: {
          mode: ZegoUIKitPrebuilt.LiveStreaming,
          config: {
            role,
          },
        },
        sharedLinks,
        showInviteToCohostButton: true, // Whether to show the button that is used to invite the audience to co-host on the host end.
        showRemoveCohostButton: true, // Whether to show the button that is used to remove the audience on the host end.
        showRequestToCohostButton: true, // Whether to show the button that is used to request to co-host on the audience end.
      });
    };
    if (run == 1) {
      doAsync();
      // doAsync_();
    }
    return () => {
      setRun((run) => run + 1);
    };
  }, []);
  return (
    <>
      <div
        className="flex items-center justify-center w-screen h-screen max-w-screen max-h-screen"
        id="stream-container"
        ref={streamContainerRef}
      ></div>
    </>
  );
}
