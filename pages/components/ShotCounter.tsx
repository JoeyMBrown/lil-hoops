import { MouseEvent, useEffect } from "react";
import { useUser, useSupabaseClient, Session } from '@supabase/auth-helpers-react'
import { Database } from '../utils/database.types'
type Shots = Database['public']['Tables']['shots']['Row']

const ShotCounter = () => {
  const supabase = useSupabaseClient<Database>()
  const user = useUser()

  useEffect(() => {
    // check DB for shot today with corresponding user ID as primary key.  If exists, disable button. populate some sort of error message.
    // If no shot, persist dom.
  })

  function handleSubmit (e: MouseEvent) {
    e.preventDefault();

    // Update localState with shot submitted for today = true;
    // Add shot record for today in shots DB.  Be sure to implicilty state makes and misses
    console.log(e);
  }

  return (
    <div>
        <form>
            <label htmlFor="shotsMade">Shots Made:</label>
            <input type="number" id="shotsMade" name="shotsMade" min="0" max="3"/>
            <button type="submit" onClick={(e) => handleSubmit(e)}>Submit</button>
        </form>
    </div>
  )
}

export default ShotCounter;