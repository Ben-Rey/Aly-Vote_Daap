
<p align="center">
    <img src="https://avatars.githubusercontent.com/u/65595746?s=280&v=4"  width="200" height="200">
</p>

# Voting Daap

## โ๏ธ Setup

### Client
```sh
npm install
# Local
npm run dev 
# Prod
npm run build
```

### Truffle
```sh
npm install
# local
truffle migrate
# TestNet
truffle migrate --network ropsten
```

## ๐ Deployed App

https://octopus-app-wlgjk.ondigitalocean.app/

## ๐ฅ Video Link
- App Video https://www.loom.com/share/a680a9fea6854dea9549dccdaa21d36e
- Code Vidรฉo https://www.loom.com/share/d432d33c83f64306ad6f34dbe884fcf0

## Voting contract test
The goal is to test the functionalities of the voting.sol contract
## โ๏ธ Setup

```sh
npm install
```

## ๐ค Run test

```sh
npm run test
```

or

```sh
truffle test
```

## ๐ฅธ Run test with coverage

```sh
npm run coverage
```

or

```sh
truffle run coverage
```

## ๐ค Testing Report

### Coverage

| File       | % Stmts | % Branch | % Funcs | % Lines | Uncovered Lines |
| ---------- | ------- | -------- | ------- | ------- | --------------- |
| Voting.sol | 100     | 100      | 100     | 100     |                 |
| All files  | 100     | 100      | 100     | 100     |                 |

## ๐งช Tested features

### Status Functions

- #### Function startProposalsRegistering

```text
  โ  should Go to the next status (102ms)
```

### Get Set Functions

#### Function Add Voter

```text
  โ  should add a voter (51ms)
  โ  should revert when addVoter is called by non-owner
  โ  should emit an event VoterAdded when addVoter is called
  โ  should revert when addVoter is called and status is not RegisteringVoters (41ms)
  โ  should revert when addVoter is called and the voter is already registered (43ms)
```

#### Function Add Proposal

```text
  โ  should add a proposal (81ms)
  โ  should emit an event ProposalRegistered when addProposal is called (82ms)
  โ  should revert when addProposal is called and status is not ProposalsRegistering (59ms)
  โ  should revert when addProposal is called by non-voter (55ms)
  โ  should revert when addProposal is called and the proposal is empty (95ms)
```

#### Function SetVote

```text

  โ  should set a vote (174ms)
  โ  should emit an event when a voter has voted
  โ  should revert when setVote is called by non-voter (184ms)
  โ  should revert when setVote is called and status is not VotingSession (97ms)
  โ  should revert when setVote is called and the proposal is not found (281ms)
  โ  should revert when setVote is called and the voter has already voted (372ms)
```

#### Function getVoter

```text
  โ  should revert when getVoter is called by non-voter (202ms)
  โ  should return the voter (449ms)
  โ  should revert when getOneProposal is called by non-voter (228ms)
  โ  should return the proposal (211ms)
```

#### Winner Id calculation

```text
  โ  should calculate the winning proposal (1178ms)
```
