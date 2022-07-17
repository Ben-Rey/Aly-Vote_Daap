<p align="center">
    <img src="https://avatars.githubusercontent.com/u/65595746?s=280&v=4"  width="200" height="200">
</p>

# Voting contract test
The goal is to test the functionalities of the voting.sol contract
## ⚙️ Setup

```sh
npm install
```

## 🤖 Run test

```sh
npm run test
```

or

```sh
truffle test
```

## 🥸 Run test with coverage

```sh
npm run coverage
```

or

```sh
truffle run coverage
```

## 🤓 Testing Report

### Coverage

| File       | % Stmts | % Branch | % Funcs | % Lines | Uncovered Lines |
| ---------- | ------- | -------- | ------- | ------- | --------------- |
| Voting.sol | 100     | 100      | 100     | 100     |                 |
| All files  | 100     | 100      | 100     | 100     |                 |

## 🧪 Tested features

### Status Functions

- #### Function startProposalsRegistering

```text
  ✅  should start the Proposals Registering (102ms)
  ✅  should revert when startProposalsRegistering is called by non-owner (240ms)
  ✅  should revert when startProposalsRegistering is called and previus status is not RegisteringVoters (233ms)
  ✅  should emit an event WorkflowStatusChange when startProposalsRegistering is called (81ms)
```

- #### Function endProposalsRegistering

```text
  ✅  should end the Proposals Registering (154ms)
  ✅  should revert when endProposalsRegistering is called by non-owner (78ms)
  ✅  should revert when endProposalsRegistering is called and previous status is not ProposalsRegistrationStarted
  ✅  should emit an event WorkflowStatusChange when endProposalsRegistering is called (56ms)
```

- #### Function startVotingSession

```text
  ✅  should start the voting session (85ms)
  ✅  should revert when startVotingSession is called by non-owner
  ✅  should revert when startVotingSession is called and previous status is not ProposalsRegistrationEnded (79ms)
  ✅  should emit an event WorkflowStatusChange when startVotingSession is called (62ms)
```

- #### Function endVotingSession

```text
  ✅  should end the voting session (98ms)
  ✅  should revert when endVotingSession is called by non-owner
  ✅  should revert when endVotingSession is called and status is not VotingSessionStarted
  ✅  should emit an event WorkflowStatusChange when endVotingSession is called (90ms)
```

- #### Function tallyVotes

```text
  ✅  should tally votes (132ms)
  ✅  should revert when tallyVotes is called by non-owner
  ✅  should revert when tallyVotes is called when prvius status is not VotingSessionEnded (154ms)
  ✅  should emit an event WorkflowStatusChange when tallyVotes is called (131ms)
```

### Get Set Functions

#### Function Add Voter

```text
  ✅  should add a voter (51ms)
  ✅  should revert when addVoter is called by non-owner
  ✅  should emit an event VoterAdded when addVoter is called
  ✅  should revert when addVoter is called and status is not RegisteringVoters (41ms)
  ✅  should revert when addVoter is called and the voter is already registered (43ms)
```

#### Function Add Proposal

```text
  ✅  should add a proposal (81ms)
  ✅  should emit an event ProposalRegistered when addProposal is called (82ms)
  ✅  should revert when addProposal is called and status is not ProposalsRegistering (59ms)
  ✅  should revert when addProposal is called by non-voter (55ms)
  ✅  should revert when addProposal is called and the proposal is empty (95ms)
```

#### Function SetVote

```text

  ✅  should set a vote (174ms)
  ✅  should emit an event when a voter has voted
  ✅  should revert when setVote is called by non-voter (184ms)
  ✅  should revert when setVote is called and status is not VotingSession (97ms)
  ✅  should revert when setVote is called and the proposal is not found (281ms)
  ✅  should revert when setVote is called and the voter has already voted (372ms)
```

#### Function getVoter

```text
  ✅  should revert when getVoter is called by non-voter (202ms)
  ✅  should return the voter (449ms)
  ✅  should revert when getOneProposal is called by non-voter (228ms)
  ✅  should return the proposal (211ms)
```

#### Winner Id calculation

```text
  ✅  should calculate the winning proposal (1178ms)
```
