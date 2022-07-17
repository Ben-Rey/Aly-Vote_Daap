import Button from 'components/Button/Button'
import { useState } from 'react'

const MAX_LENGTH = 280

const ModalNewProp = ({ onAdd }: { onAdd: (prop: string) => void }) => {
  const [text, setText] = useState('')
  const [loading, setLoading] = useState(false)

  const onTextChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setText(e.target.value)
  }
  // TODO: custom hook
  const closeModal = () => {
    const input = document.getElementById(
      'new-prop-modal'
    ) as HTMLInputElement | null

    if (input != null) {
      input.checked = false
    }
  }

  const cleanModal = () => {
    closeModal()
    setText('')
  }

  const add = async () => {
    setLoading(true)
    await onAdd(text)
    cleanModal()
    setLoading(false)
  }

  return (
    <div>
      <input type="checkbox" id="new-prop-modal" className="modal-toggle" />
      <div className="modal">
        <div className="modal-box relative">
          <div className="mt-4 flex justify-between">
            <h3 className="mb-4 text-lg font-bold">Add a new proposal</h3>
            <span>
              {text.length}/{MAX_LENGTH}
            </span>
          </div>

          <textarea
            className="textarea-primary textarea h-64 w-full"
            placeholder="Proposal content"
            maxLength={MAX_LENGTH}
            value={text}
            onChange={onTextChange}
          ></textarea>
          <div className="mt-4 flex justify-between">
            <Button
              onClick={cleanModal}
              label="Cancel"
              className="w-1/3"
              disabled={loading}
            >
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

export default ModalNewProp
