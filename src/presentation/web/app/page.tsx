import { getAppId, generateToken04 } from "../action/zego-action";
import RexMeet from "./_components/organism/rex-meet";

export default async function Page(props: any) {
  const [token, appId] = await Promise.all([
    await generateToken04("annasR", 3600),
    await getAppId(),
  ]);
  const _params = props.params || {};
  props.params = {
    ..._params,
    token,
    appId,
    roomID: "annas-room-02",
    userID: "annasR",
    userName: "annas-02",
  };
  return <RexMeet {...props} />;
}
