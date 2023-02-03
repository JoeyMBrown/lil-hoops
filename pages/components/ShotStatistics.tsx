import { useState, useEffect } from "react";
import { useUser, useSupabaseClient, Session } from '@supabase/auth-helpers-react'
import { Database } from '../utils/database.types'
type Shots = Database['public']['Tables']['shots_by_date']['Row']

export default function ShotStatistics({ session }: { session: Session }) {
    const supabase = useSupabaseClient<Database>()
    const user = useUser()

    const defaultShotStatistics = {
        shotsMadeThisMonth: 0,
        shotsMissedThisMonth: 0,
        shotsMadePercentage: "0%"
    }

    const [userShotStatistics, setuserShotStatistics] = useState(defaultShotStatistics);


    // Accounts for timezone offset
    function getSpecificMonthInISOFormat(month: number, day: number) {
        let date = new Date();
        var firstOrLastDay = new Date(date.getFullYear(), month, day);
        firstOrLastDay.toISOString().split('T')[0];
        const offset = firstOrLastDay.getTimezoneOffset();
        firstOrLastDay = new Date(firstOrLastDay.getTime() - (offset*60*1000));
        return firstOrLastDay.toISOString().split('T')[0];
    }

    async function fetchShotsMadeByMonth(month: number) {
    try {
        if (!user) throw new Error('No user')

        const {data, error, status} = await supabase
            .from('shots_by_date')
            .select(`id, shots_made_today, shots_missed_today`)
            .match({ user: user.id})
            .gte('date_of_shot', getSpecificMonthInISOFormat(month, 1))
            .lte('date_of_shot', getSpecificMonthInISOFormat(month+1, 0))
    
        if (error && status !== 406) {
            throw error
        }
    
        if (data.length > 0) {
            let shotsMade = 0;
            let shotsMissed = 0;
            let totalShots = 0;
            

            data?.forEach((shotRecord) => {
                shotsMade += shotRecord.shots_made_today;
                shotsMissed += shotRecord.shots_missed_today;
            })
            totalShots += shotsMade + shotsMissed;

            let shotsMadePercentage = (Math.floor(((shotsMade / totalShots) * 100))).toString() + "%";

            setuserShotStatistics({
                shotsMadeThisMonth: shotsMade,
                shotsMissedThisMonth: shotsMissed,
                shotsMadePercentage: shotsMadePercentage
            })

        } else {
            setuserShotStatistics(defaultShotStatistics);
        }
    
        } catch (error) {
            alert('Error loading user data!');
            console.log(error);
        }
    }

    useEffect(() => {
        let date = new Date();
        let currentMonth = date.getMonth();

        fetchShotsMadeByMonth(currentMonth);
    }, [])

    return (
        <>
            <p>Shots Made this Month: {userShotStatistics.shotsMadeThisMonth}</p>
            <p>Shots Missed this Month: {userShotStatistics.shotsMissedThisMonth}</p>
            <p>Shot Percentage this Month: {userShotStatistics.shotsMadePercentage}</p>

            <label htmlFor="months">Choose a Month</label>

            <select onChange={(e) => fetchShotsMadeByMonth(Number(e.target.value))} name="months" id="months">
                <option hidden disabled selected >Select a Month</option>
                <option value="0">January</option>
                <option value="1">February</option>
                <option value="2">March</option>
                <option value="3">April</option>
                <option value="4">May</option>
                <option value="5">June</option>
                <option value="6">July</option>
                <option value="7">August</option>
                <option value="8">September</option>
                <option value="9">October</option>
                <option value="10">November</option>
                <option value="11">December</option>
            </select>
        </>
      )
}