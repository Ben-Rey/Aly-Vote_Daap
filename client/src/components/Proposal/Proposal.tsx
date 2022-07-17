import { IProposalProps } from './IProposalProps'
import Button from '../Button/Button'
import BN from 'bn.js'
// TODO: LE front peut afficher pour la bonne proposition mais voter pour une autre
const Proposal = ({
  vote,
  index,
  content,
  voteCount,
  buttonTitle,
  votingStarted,
  showVoteNumber,
  isWinner
}: IProposalProps) => {
  const gold = ' bg-gradient-to-r from-yellow-400 via-yellow-600 to-yellow-200 '

  return (
    <div
      className={`my-4 flex flex-col items-center rounded-lg  bg-gray-100 p-5 sm:flex-row ${
        isWinner ? ` border-4 border-yellow-500` : 'border-2 border-gray-100 '
      }`}
    >
      <div className="w-1/12">
        <span className="flex h-10 w-10 items-center justify-center rounded-full border border-gray-800">
          {index}
        </span>
      </div>
      <span className="flex w-9/12 items-center text-gray-800">{content}</span>
      {votingStarted && (
        <span className="flex w-2/12  items-center justify-end ">
          <Button
            // Check security man in the middle
            onClick={() => vote(new BN(index))}
            variant="outlined"
            className="flex flex-col"
          >
            <span>{buttonTitle}</span>
            <span>{voteCount}</span>
          </Button>
        </span>
      )}
      {showVoteNumber && <span> Result: {voteCount}</span>}
    </div>
  )
}

export default Proposal
