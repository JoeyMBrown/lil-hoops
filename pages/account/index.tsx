import { useUser, useSupabaseClient, Session } from '@supabase/auth-helpers-react'
import Link from 'next/link';
import ShotCounter from '../components/ShotCounter';

export default function AccountDashboard({ session }: { session: Session }) {
    return (
        <>
        <h1>First Post</h1>
        <h2>
          <ShotCounter session={session}></ShotCounter>
          <Link href="/">Back to home</Link>
        </h2>
      </>
    )
}