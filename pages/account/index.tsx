import Link from 'next/link';
import ShotCounter from '../components/ShotCounter';

export default function AccountDashboard() {
    return (
        <>
        <h1>First Post</h1>
        <h2>
            <ShotCounter></ShotCounter>
          <Link href="/">Back to home</Link>
        </h2>
      </>
    )
}