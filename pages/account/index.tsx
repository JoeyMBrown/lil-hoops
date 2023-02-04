import { useUser, useSupabaseClient, Session } from '@supabase/auth-helpers-react'
import Link from 'next/link';
import { useState } from 'react';
import ShotCounter from '../components/ShotCounter';
import ShotStatistics from '../components/ShotStatistics';
import { Database } from '../utils/database.types';
type Profiles = Database['public']['Tables']['profiles']['Row'];

export default function AccountDashboard({ session }: { session: Session }) {
  const supabase = useSupabaseClient<Database>()
  const user = useUser();
  const [username, setUserName] = useState("Unknown User");

  fetchUsername();

  async function fetchUsername() {
    try {
      if (!user) throw new Error('No user')

      let { data, error, status } = await supabase
        .from('profiles')
        .select(`username, avatar_url`)
        .eq('id', user.id)
        .single()

        if(data) {
          setUserName(data.username);
        }

    } catch(e) {
      console.log(e);
      return "Unknown user";
    }
    
    return "Unknown user";
  }

    return (
        <>
        <Link href="/account/profile">Edit Account Details</Link>
        <h1>Hey {username}, record your shots!</h1>

        <h2>
          <ShotCounter session={session}></ShotCounter>
          <ShotStatistics session={session}></ShotStatistics>
          <button className="button block" onClick={() => supabase.auth.signOut()}>Sign Out</button>
        </h2>
      </>
    )
}