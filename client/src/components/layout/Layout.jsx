import { Outlet } from 'react-router-dom'
import Navbar from './Navbar'
import SeasonalPageAtmosphere from './SeasonalPageAtmosphere'
import { useActiveSeason } from '../../context/SeasonContext'

export default function Layout() {
  const { season } = useActiveSeason()
  return (
    <div>
      <SeasonalPageAtmosphere season={season} />
      <Navbar season={season} />
      {/* pt-14 offsets the fixed navbar height (h-14 = 56px) */}
      <div className="pt-14">
        <Outlet />
      </div>
    </div>
  )
}
