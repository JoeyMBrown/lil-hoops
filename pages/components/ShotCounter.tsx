const ShotCounter = () => {

  return (
    <div>
        <form>
            <label htmlFor="shotsMade">Shots Made:</label>
            <input type="number" id="shotsMade" name="shotsMade" min="0" max="3"/>
            <button type="submit">Submit</button>
        </form>
    </div>
  )
}

export default ShotCounter;