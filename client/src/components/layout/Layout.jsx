import { Outlet } from 'react-router-dom'
import Navbar from './Navbar'

export default function Layout() {
  return (
    <div>
      <Navbar />
      {/* pt-14 offsets the fixed navbar height (h-14 = 56px) */}
      <div className="pt-14">
        <Outlet />
      </div>
    </div>
  )
}
