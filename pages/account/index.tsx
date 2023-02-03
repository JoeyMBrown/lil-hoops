import { useUser, useSupabaseClient, Session } from '@supabase/auth-helpers-react'
import Link from 'next/link';
import { useEffect, useState } from 'react';
import ShotCounter from '../components/ShotCounter';
import { Database } from '../utils/database.types';
type Profiles = Database['public']['Tables']['profiles']['Row'];

export default function AccountDashboard({ session }: { session: Session }) {
  const supabase = useSupabaseClient<Database>()
  const user = useUser();
  const [username, setUserName] = useState("Unknown User");

  useEffect(() => {
    setUserName(fetchUsername());
    console.log(username);
  },[])

  async function fetchUsername() {
    try {
      if (!user) throw new Error('No user')

      let { data, error, status } = await supabase
        .from('profiles')
        .select(`username, avatar_url`)
        .eq('id', user.id)
        .single()

        if(data) {
          console.log(data);
          return data.username;
        }

    } catch(e) {
      console.log(e);
      return "Unknown user";
    }
    
    return "Unknown user";
  }

    return (
        <>
        <h1>Hey, record your shots!</h1>

        <h2>
          <ShotCounter session={session}></ShotCounter>
          <Link href="/">Back to home</Link>
        </h2>
      </>
    )
}