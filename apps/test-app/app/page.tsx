import isEven from 'is-even';

/** Add your relevant code here for the issue to reproduce */
export default function Home() {
  return <div>Hello world! {`${isEven(1)}`}</div>;
}
