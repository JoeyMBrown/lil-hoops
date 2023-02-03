import { ChangeEvent, MouseEvent, useEffect, useState } from "react";
import { useUser, useSupabaseClient, Session } from '@supabase/auth-helpers-react'
import { Database } from '../utils/database.types'
type Shots = Database['public']['Tables']['shots_by_date']['Row']

const ShotCounter = ({ session }: { session: Session }) => {
  const supabase = useSupabaseClient<Database>()
  const user = useUser()

  const [shotCount, setShotCount] = useState<Shots['shots_made_today']>("0");
  const [shotDate, setShotDate] = useState<Shots['date_of_shot']>(getTodaysDateInISOFormat());
  const [showFormMessage, setShowFormMessage] = useState(false);
  const [formMessage, setFormMessage] = useState("");

  // Accounts for timezone offset
  function getTodaysDateInISOFormat() {
    let yourDate = new Date()
    yourDate.toISOString().split('T')[0]
    const offset = yourDate.getTimezoneOffset()
    yourDate = new Date(yourDate.getTime() - (offset*60*1000))
    return yourDate.toISOString().split('T')[0]
  }

  function handleChange(e: React.ChangeEvent<HTMLInputElement>) {

    switch(e.target.name) {
      case "shotDate":
        setShotDate(e.target.value);
        break;
      case "shotsMade":
        setShotCount(e.target.value);
        break;
      default:
        break;
    }

  }

  async function fetchShotByDate(date: Database) {

    try {
      if (!user) throw new Error('No user')

      const {data, error, status} = await supabase
        .from('shots_by_date')
        .select(`id, shots_made_today, shots_missed_today`)
        .match({ user: user.id, date_of_shot: date })

      if (error && status !== 406) {
        throw error
      }

      if (data[0]) {
        setFormMessage("A shot has already been recorded for that date!");
        return true;
      }

    } catch (error) {
      alert('Error loading user data!');
      console.log(error);
      return false;
    }

    return false;
  }

  function validateShotCount(){ 

    if(Number(shotCount) > 3 || Number(shotCount) < 0) {
      setFormMessage("Shots cannot be greater than 3, or less than 0!");
      setShowFormMessage(true);
      return false;
    }

    return true;
  }

  function validateShotDate() {
    if(shotCount.length < 1 || shotDate.length < 1) {
      setFormMessage("Please enter a valid date and shot count!");
      setShowFormMessage(true);
      return false;
    }

    return true;
  }

  // on submit, calculate shots missed, shots made, and create a record in the DB
  // We can specify a date here to setup for missed day back filling in future.
  async function handleSubmit (e: MouseEvent) {
    e.preventDefault();

    if(!validateShotCount() || !validateShotDate()) {
      return;
    }

    const shotAlreadyTaken = await fetchShotByDate(shotDate);

    if(shotAlreadyTaken) {
      setShotDate(getTodaysDateInISOFormat());
      return;
    }

    try {
      if (!user) throw new Error('No user')

      const shotsMissed = (3 - Number(shotCount)).toString();

      const {error, status} = await supabase
        .from('shots_by_date')
        .insert({user: user.id, shots_made_today: shotCount, shots_missed_today: shotsMissed, date_of_shot: shotDate })

      if (error && status !== 406) {
        throw error;
      }

    }
    catch (error) {
      alert('Error loading user data!');
      console.log(error);
    }

    setShotDate(getTodaysDateInISOFormat());
    setShotCount("0");
    setFormMessage("Your shots have been recorded, noice!");
    setShowFormMessage(true);
  }

  return (
    <div>
        <form>
            <label htmlFor="shotsMade">Shots Made:</label>
            <input type="number" id="shotsMade" name="shotsMade" value={shotCount} onChange={(e) => handleChange(e)} min="0" max="3"/>
            <input type="date" min="02/01/2023" id="shotDate" name="shotDate" placeholder="mm/dd/yyyy" value={shotDate} onChange={(e) => handleChange(e) } />
            {showFormMessage ? <p>{formMessage}</p> : <></>}
            <button type="submit" onClick={(e) => handleSubmit(e)}>Submit</button>
        </form>
    </div>
  )
}

export default ShotCounter;