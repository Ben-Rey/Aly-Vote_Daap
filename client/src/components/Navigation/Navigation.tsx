import { useState, useEffect } from 'react'
import { Link, useLocation } from 'react-router-dom'
import INavigationProps from './INavigationProps'
import { useNavigate } from 'react-router-dom'

export const navElements = [
  { label: 'Proposals', to: 'proposals', active: true }
  // { label: 'Voters', to: 'voters', active: false }
  // { label: 'My Informations', to: 'my-informations', active: false }
]

/* eslint-disable tailwindcss/no-custom-classname */
type Element = {
  label: string
  to: string
}

const NavElement = ({
  element,
  active
}: {
  element: Element
  active: boolean
}) => {
  const isActive = active ? 'tab-active' : ''
  return (
    <Link to={element.to} className={`tab ${isActive}`}>
      {element.label}
    </Link>
  )
}

const Navigation = ({ isOwner, isVoter }: INavigationProps) => {
  const [active, setActive] = useState(navElements[0].to)
  const location = useLocation()
  const navigate = useNavigate()

  const path = location.pathname.split('/')[1]

  useEffect(() => {
    path === 'owner' && !isOwner && navigate('/')
    path === 'voters' && !isVoter && navigate('/')
    setActive(location.pathname.split('/')[1])
    location.pathname === '/' && setActive(navElements[0].to)
  }, [isOwner, isVoter, location, navigate, path])

  return (
    <nav className="tabs tabs-boxed">
      {navElements.map((element) => (
        <NavElement
          key={element.label}
          element={element}
          active={active === element.to}
        />
      ))}
      {isVoter && (
        <NavElement
          element={{ label: 'Voter', to: 'voter' }}
          active={location.pathname.includes('voter')}
        />
      )}
      {isOwner && (
        <NavElement
          element={{ label: 'Owner', to: 'owner' }}
          active={location.pathname.includes('owner')}
        />
      )}
    </nav>
  )
}

export default Navigation
