import { notFound } from "next/navigation";
import { getAppId, generateToken04 } from "../action/zego-action";
import RexMeet from "./_components/organism/rex-meet";
import { getLiveTraining } from "../action/get-live-training-action";
import Head from "next/head";

export default async function Page(props: any) {
  if (!props.searchParams.userID || !props.searchParams.roomID) {
    notFound();
  }
  const activeLiveStreaming = await getLiveTraining(
    props.searchParams.roomID,
    props.searchParams.userID
  );
  if (activeLiveStreaming.name == "AppError") {
    notFound();
  }
  const [token, appId] = await Promise.all([
    await generateToken04(props.searchParams.userID, 3600),
    await getAppId(),
  ]);
  const _params = props.params || {};
  const _props = { ...props };
  _props.params = {
    ..._params,
    token,
    appId,
    roomID: props.searchParams.roomID,
    userID: props.searchParams.userID || "default-user",
    userName: props.searchParams.userName || "default user name",
    activeLiveStreaming,
  };
  return (
    <div>
      <Head>
        <title>{activeLiveStreaming.title}</title>
      </Head>
      <RexMeet {..._props} />
    </div>
  );
}
