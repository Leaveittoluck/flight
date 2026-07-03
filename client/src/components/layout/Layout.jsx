import { Outlet, useLocation } from 'react-router-dom'
import Navbar from './Navbar'
import SeasonalPageAtmosphere from './SeasonalPageAtmosphere'
import { useActiveSeason } from '../../context/SeasonContext'

export default function Layout() {
  const { season } = useActiveSeason()
  const { pathname } = useLocation()
  const isDashboard = pathname === '/dashboard'

  return (
    <div>
      <SeasonalPageAtmosphere season={season} />
      {!isDashboard && <Navbar season={season} />}
      <div className={isDashboard ? '' : 'pt-16'}>
        <Outlet />
      </div>
    </div>
  )
}
