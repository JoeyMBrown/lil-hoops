import Link from 'next/link';
import Account from '../components/account';
import { useUser, useSupabaseClient, Session } from '@supabase/auth-helpers-react'
import { Database } from '../utils/database.types';

export default function Profile({ session }: { session: Session }) {
    const supabase = useSupabaseClient<Database>()
    const user = useUser();

    return (
        <>
        <h2>
          <Link href="/account/">Back to Dashboard</Link>
        </h2>

        <Account session={session}></Account>

        <h2>
          <Link href="/account/">Back to Dashboard</Link>
        </h2>
      </>
    )
}