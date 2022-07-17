import { useEth } from 'context'
import useUser from 'hooks/use-user'
import { memo, useEffect } from 'react'

import { getStatusLabelById } from 'utils'

const GlobalInfo = () => {
  const {
    state: { contract, status }
  } = useEth()

  const { isOwner, isVoter, getRole } = useUser()

  useEffect(() => {
    getRole()
  }, [getRole])

  // TODO: check if voter or admin or not registered

  const style = { '--value': 70 } as React.CSSProperties
  const radClass = 'radial-progress absolute right-10 top-1/2 -translate-y-1/2'

  return (
    <div className="overflow-hidden rounded-md  border bg-cover text-gray-100">
      <div className="relative flex h-full w-full flex-col bg-slate-800 p-10">
        <div className="flex w-10/12 flex-col space-y-3">
          {/* <h3 className=" text-2xl font-bold">Main Informations</h3> */}

          <p>
            <span className="text-lg font-bold">Role: </span>
            <span>{isOwner ? 'Administrator and ' : ''}</span>
            <span>{isVoter ? 'Voter' : 'Non-Voter'}</span>
          </p>
          <p>
            <span className="text-lg font-bold">Satus: </span>
            <span>{status ? getStatusLabelById(status) : ''}</span>
          </p>
          <p>
            <span className="text-lg font-bold">Contract adress:</span>
            <span>{contract?._address}</span>
          </p>
        </div>
        <div className={radClass} style={style}>
          70%
        </div>
      </div>
    </div>
  )
}
const MemoizedGlobalInfo = memo(GlobalInfo)

export default MemoizedGlobalInfo
