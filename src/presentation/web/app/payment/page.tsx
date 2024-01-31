export default function Page(props: any) {
  const { token } = props.searchParams;
  return <div>{token}</div>;
}
