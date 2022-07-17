/* eslint-disable tailwindcss/classnames-order */
/* eslint-disable tailwindcss/no-custom-classname */
import { KeyIcon } from '@heroicons/react/solid'
import Login from 'components/Login/Login'

const Header = () => {
  return (
    <header className="relative bg-[#fffaf3] p-40">
      <Login />
      <h1 className="-mt-10 text-center font-header text-5xl font-semibold text-gray-800 ">
        🗳 Voting App
      </h1>
    </header>
  )
}

export default Header
