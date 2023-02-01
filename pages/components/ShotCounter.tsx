import { ChangeEvent, MouseEvent, useEffect, useState } from "react";
import { useUser, useSupabaseClient, Session } from '@supabase/auth-helpers-react'
import { Database } from '../utils/database.types'
type Shots = Database['public']['Tables']['shots_by_date']['Row']

const ShotCounter = ({ session }: { session: Session }) => {
  const supabase = useSupabaseClient<Database>()
  const user = useUser()

  const [shotCount, setShotCount] = useState<Shots['shots_made_today']>("0");
  const [shotTaken, setShotTaken] = useState(false);

  useEffect(() => {
    // check DB for shot today with corresponding user ID as primary key.  If exists, disable button. populate some sort of error message.
    // If no shot, persist dom.

    if(!shotTaken) {
      fetchTodaysShots();
    }
    
  }, [])

  function handleChange(e: React.ChangeEvent<HTMLInputElement>) {
    setShotCount(e.target.value);
  }

  async function fetchTodaysShots() {

    try {
      if (!user) throw new Error('No user')

      const {data, error, status} = await supabase
        .from('shots_by_date')
        .select(`id, shots_made_today, shots_missed_today`)
        .eq('user', user.id)

      if (error && status !== 406) {
        throw error
      }

      if (data[0]) {
        console.log(data);
        setShotTaken(true);
      }
    } catch (error) {
      alert('Error loading user data!')
      console.log(error)
    } finally {
      console.log('finally')
    }
  }


  // Update localState with shot submitted for today = true;
  // Add shot record for today in shots DB.  Be sure to implicilty state makes and misses
  async function handleSubmit (e: MouseEvent) {
    e.preventDefault();

    const { data, error} = await supabase
      .from('shots_by_date')
      .insert({user: '414e663c-9383-4fde-a14d-a7d115b6b6d1', shots_made_today: shotCount, shots_missed_today: (3 - Number(shotCount)).toString() })

    setShotCount("0");

    if(data) {
      console.log(data);
    }

    if(error) {
      console.log(error)
    }

    setShotTaken(true);
  }

  return (
    <div>
        <form>
            <label htmlFor="shotsMade">Shots Made:</label>
            <input type="number" id="shotsMade" name="shotsMade" value={shotCount} onChange={(e) => handleChange(e)} min="0" max="3"/>
            {shotTaken ? <h3>You have already taken your shots for today!</h3> : <button type="submit" onClick={(e) => handleSubmit(e)}>Submit</button>}
        </form>
    </div>
  )
}

export default ShotCounter;