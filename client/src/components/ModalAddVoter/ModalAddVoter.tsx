/* eslint-disable tailwindcss/no-custom-classname */
import Button from 'components/Button/Button'
import { useState } from 'react'
import { toast } from 'react-toastify'
import { BadgeCheckIcon, ExclamationCircleIcon } from '@heroicons/react/solid'
import 'react-toastify/dist/ReactToastify.css'

const ModalAddVoter = ({ onAdd }: { onAdd: (prop: string) => void }) => {
  const [text, setText] = useState('')
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)
  const regex = /^0x[a-fA-F0-9]{40}$/g
  const isAddressValid = text.match(regex)

  const onTextChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    error && setError('')
    setText(e.target.value)
  }
  const notifyError = () => toast('Voter already in whiteList!')

  // TODO: custom hook
  const closeModal = () => {
    const input = document.getElementById(
      'add-voter-modal'
    ) as HTMLInputElement | null

    if (input != null) {
      input.checked = false
    }
  }

  const cleanModal = () => {
    closeModal()
    setText('')
    setError('')
    setLoading(false)
  }

  const add = async () => {
    setLoading(true)

    if (!isAddressValid) {
      setError('Invalid address')
      setLoading(false)
      return
    }
    try {
      await onAdd(text)
      cleanModal()
    } catch (error: any) {
      if (!error.message.includes('User denied transaction signature')) {
        notifyError()
      }
      setLoading(false)
    }
  }

  return (
    <div>
      <input type="checkbox" id="add-voter-modal" className="modal-toggle" />
      <div className="modal">
        <div className="modal-box relative">
          <div className="mt-4 flex justify-between">
            <h3 className="mb-2 text-lg font-bold">Add a new voter</h3>
          </div>
          <div className="flex flex-col">
            <div className="flex items-center">
              <input
                type="text"
                placeholder="Type here"
                className={`input-bordered ${
                  error ? 'input-error' : 'input-primary'
                } input w-full max-w-xs`}
                value={text}
                onChange={onTextChange}
              />
              {isAddressValid && (
                <span className=" flex items-center justify-center p-3 text-primary">
                  <BadgeCheckIcon width={30} />
                </span>
              )}
              {error && (
                <span className="flex items-center justify-center p-3 text-error">
                  <ExclamationCircleIcon width={30} />
                </span>
              )}
            </div>
            {error && <span className="text-red-500">{error}</span>}
          </div>
          <div className="mt-4 flex justify-between">
            <Button onClick={cleanModal} className="w-1/3" disabled={loading}>
              <span>Cancel</span>
            </Button>
            <Button
              onClick={loading ? undefined : add}
              className={`w-1/3 ${loading && 'loading'}`}
              disabled={text.length === 0}
            >
              <span>Add</span>
            </Button>
          </div>
        </div>
      </div>
    </div>
  )
}

export default ModalAddVoter
