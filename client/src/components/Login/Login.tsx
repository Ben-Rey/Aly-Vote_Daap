/* eslint-disable tailwindcss/no-custom-classname */
import { KeyIcon, UserIcon } from '@heroicons/react/solid'
import { useEth } from 'context'

// TODO: On connect update page

const Login = () => {
  const {
    dispatch,
    state: { accounts }
  } = useEth()

  const connectWallet = async () => {
    const data: string[] = await window.ethereum.request({
      method: 'eth_requestAccounts'
    })

    if (data.length > 0) {
      dispatch({ type: 'SET_ACCOUNTS', data })
    }
  }

  const formatAdress = (address: string) => {
    return (
      address.substring(0, 2) + '...' + address.substring(address.length - 4)
    )
  }

  return (
    <div className="flex flex-col">
      {accounts && accounts.length > 0 ? (
        <div className="absolute left-10 top-10 flex flex-col justify-center rounded-full">
          <div className=" absolute z-10 rounded-full bg-gray-800 p-4 text-[#fffaf3] shadow-lg">
            <UserIcon width={16} />
          </div>
          <div className="absolute  flex  flex-col rounded-full border-2 border-gray-800 p-2 pl-16 pr-4 shadow-lg">
            {formatAdress(accounts[0])}
          </div>
        </div>
      ) : (
        <button
          className="btn-outline btn absolute left-10  top-10 rounded-full"
          onClick={connectWallet}
        >
          <KeyIcon width={20} />
          <span className="p-2">Connection</span>
        </button>
      )}
    </div>
  )
}

export default Login
