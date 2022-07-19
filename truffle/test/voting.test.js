//Verifier les types de retour

const voting = artifacts.require("./voting.sol");
const { BN, expectRevert, expectEvent } = require("@openzeppelin/test-helpers");
const { expect } = require("chai");
const constants = require("@openzeppelin/test-helpers/src/constants");
// Test revert on bad type parrams
// Test revert on bad type returns
// Test bigNumbers

contract("Voting", (accounts) => {
  const OWNER = accounts[0];
  const VOTER_1 = accounts[1];
  const VOTER_2 = accounts[2];
  const VOTER_3 = accounts[3];
  const VOTER_4 = accounts[4];
  const VOTER_5 = accounts[5];
  VOTERS = [VOTER_1, VOTER_2, VOTER_3, VOTER_4, VOTER_5];
  const NON_VOTER = accounts[4];

  PROPOSAL_1 = { id: new BN(0), description: "Proposal example 1" };
  PROPOSAL_2 = { id: new BN(1), description: "Proposal example 2" };
  PROPOSAL_3 = { id: new BN(2), description: "Proposal example 3" };
  PROPOSALS = [PROPOSAL_1, PROPOSAL_2, PROPOSAL_3];
  FAKE_PROPOSAL = { id: new BN(100000), description: "No Proposal" };

  const RegisteringVoters = new BN(0);
  const startProposalsRegistering = new BN(1);
  const endProposalsRegistering = new BN(2);
  const startVotingSession = new BN(3);
  const endVotingSession = new BN(4);
  const tallyVotes = new BN(5);

  /* -------------------------------------------------------------------------- */
  /*                                   Helpers                                  */
  /* -------------------------------------------------------------------------- */

  async function gotToStatus(voting, status) {
    for (let i = 0; i < status.toNumber(); i++) {
      await voting.nextStatus({ from: OWNER });
    }
  }

  const goToVotingSession = async () => {
    await this.voting.addVoter(VOTER_1, { from: OWNER });
    await gotToStatus(this.voting, startProposalsRegistering);
    await this.voting.addProposal(PROPOSAL_1.description, { from: VOTER_1 });
    await gotToStatus(this.voting, endProposalsRegistering);
    await gotToStatus(this.voting, startVotingSession);
  };

  const goToProposalsRegistering = async () => {
    await this.voting.addVoter(VOTER_1, { from: OWNER });
    await gotToStatus(this.voting, endProposalsRegistering);

    return VOTER_1;
  };

  const addProposals = async (caller) => {
    for (let i = 0; i < PROPOSALS.length; i++) {
      const result = await this.voting.addProposal(PROPOSALS[i].description, {
        from: caller
      });
    }
  };

  beforeEach(async () => {
    this.voting = await voting.new({ from: OWNER });
  });

  context("Status Functions", () => {
    describe("next status function", () => {
      beforeEach(async () => {
        this.voting = await voting.new({ from: OWNER });
      });

      it("should return the next status", async () => {
        const prevStatus = await this.voting.workflowStatus();
        await this.voting.nextStatus();
        const nextStatus = await this.voting.workflowStatus();
        const prevStatusNum = prevStatus.toNumber();
        const nextStatusNum = nextStatus.toNumber();
        console.log(prevStatusNum, nextStatusNum);
        expect(nextStatusNum).to.be.equal(prevStatusNum + 1);
      });
    });
  });

  context("Get Set Functions", () => {
    describe("Function Add Voter ", () => {
      beforeEach(async () => {
        this.voting = await voting.new({ from: OWNER });
      });

      it("...should add a voter", async () => {
        await this.voting.addVoter(OWNER, { from: OWNER });
        await this.voting.addVoter(VOTER_1, { from: OWNER });
        const voter = await this.voting.getVoter(VOTER_1);
        expect(voter).to.exist;
        expect(voter.isRegistered).to.be.true;
        expect(voter.hasVoted).to.be.false;
      });

      it("...should revert when addVoter is called by non-owner", async () => {
        await expectRevert(this.voting.addVoter(VOTER_1, { from: VOTER_1 }), "caller is not the owner");
      });

      it("...should emit an event VoterAdded when addVoter is called", async () => {
        const { logs } = await this.voting.addVoter(VOTER_1, { from: OWNER });
        expectEvent.inLogs(logs, "VoterRegistered", {
          voterAddress: VOTER_1
        });
      });

      it("...should revert when addVoter is called and status is not RegisteringVoters", async () => {
        await gotToStatus(this.voting, startProposalsRegistering);
        await expectRevert(this.voting.addVoter(VOTER_1, { from: OWNER }), "Voters registration is not open yet");
      });

      it("...should revert when addVoter is called and the voter is already registered", async () => {
        this.voting.addVoter(VOTER_1, { from: OWNER });
        await expectRevert(this.voting.addVoter(VOTER_1, { from: OWNER }), "Already registered");
      });
    });

    describe("Function Add Proposal ", () => {
      beforeEach(async () => {
        this.voting = await voting.new({ from: OWNER });
      });

      it("...should add a proposal", async () => {
        await this.voting.addVoter(OWNER, { from: OWNER });
        await gotToStatus(this.voting, startProposalsRegistering);
        await this.voting.addProposal(PROPOSAL_1.description, { from: OWNER });
        await this.voting.addProposal(PROPOSAL_2.description, { from: OWNER });

        const proposal1 = await this.voting.getOneProposal(PROPOSAL_1.id);
        const proposal2 = await this.voting.getOneProposal(PROPOSAL_2.id);

        expect(proposal1.description).to.equal(PROPOSAL_1.description);
        expect(proposal2.description).to.equal(PROPOSAL_2.description);
      });

      it("...should emit an event ProposalRegistered when addProposal is called", async () => {
        await this.voting.addVoter(OWNER, { from: OWNER });
        await gotToStatus(this.voting, startProposalsRegistering);
        const { logs } = await this.voting.addProposal(PROPOSAL_1.description, {
          from: OWNER
        });
        expectEvent.inLogs(logs, "ProposalRegistered", {
          proposalId: PROPOSAL_1.id
        });
      });

      it("...should revert when addProposal is called and status is not ProposalsRegistering", async () => {
        await this.voting.addVoter(OWNER, { from: OWNER });
        await expectRevert(
          this.voting.addProposal(PROPOSAL_1.description, { from: OWNER }),
          "Proposals are not allowed yet"
        );
      });

      it("...should revert when addProposal is called by non-voter", async () => {
        await gotToStatus(this.voting, startProposalsRegistering);
        await expectRevert(this.voting.addProposal(PROPOSAL_1.description, { from: VOTER_1 }), "You're not a voter");
      });

      it("...should revert when addProposal is called and the proposal is empty", async () => {
        await this.voting.addVoter(OWNER, { from: OWNER });
        await gotToStatus(this.voting, startProposalsRegistering);
        await expectRevert(this.voting.addProposal("", { from: OWNER }), "Vous ne pouvez pas ne rien proposer");
      });
    });

    describe("Function SetVote", () => {
      beforeEach(async () => {
        this.voting = await voting.new({ from: OWNER });
      });

      it("...should set a vote", async () => {
        // TODO- function go to voting session
        await this.voting.addVoter(VOTER_1, { from: OWNER });
        await gotToStatus(this.voting, startProposalsRegistering);
        await this.voting.addProposal(PROPOSAL_1.description, {
          from: VOTER_1
        });
        await gotToStatus(this.voting, endProposalsRegistering);

        await gotToStatus(this.voting, startVotingSession);

        await this.voting.setVote(PROPOSAL_1.id, {
          from: VOTER_1
        });
        const voter = await this.voting.getVoter(VOTER_1, { from: VOTER_1 });
        const proposal = await this.voting.getOneProposal(PROPOSAL_1.id, {
          from: VOTER_1
        });
        expect(voter.hasVoted).to.be.true;
        expect(voter.votedProposalId).to.bignumber.equal(PROPOSAL_1.id);
        expect(proposal.voteCount).to.bignumber.equal(new BN(1));
      });

      it("...should emit an event when a voter has voted", async () => {
        await this.voting.addVoter(VOTER_1, { from: OWNER });
        await gotToStatus(this.voting, startProposalsRegistering);
        await this.voting.addProposal(PROPOSAL_1.description, {
          from: VOTER_1
        });
        await gotToStatus(this.voting, endProposalsRegistering);

        await gotToStatus(this.voting, startVotingSession);

        const { logs } = await this.voting.setVote(PROPOSAL_1.id, {
          from: VOTER_1
        });

        expectEvent.inLogs(logs, "Voted", {
          voter: VOTER_1,
          proposalId: PROPOSAL_1.id
        });
      });

      it("...should revert when setVote is called by non-voter", async () => {
        await goToVotingSession();
        await expectRevert(this.voting.setVote(PROPOSAL_1.id, { from: NON_VOTER }), "You're not a voter");
      });

      it("...should revert when setVote is called and status is not VotingSession", async () => {
        const voter = await goToProposalsRegistering();
        await expectRevert(this.voting.setVote(PROPOSAL_1.id, { from: voter }), "Voting session havent started yet");
      });

      it("...should revert when setVote is called and the proposal is not found", async () => {
        await goToVotingSession();
        await expectRevert(this.voting.setVote(FAKE_PROPOSAL.id, { from: VOTER_1 }), "Proposal not found");
      });

      it("...should revert when setVote is called and the voter has already voted", async () => {
        await goToVotingSession();
        await this.voting.setVote(0, { from: VOTER_1 });
        await expectRevert(this.voting.setVote(0, { from: VOTER_1 }), "You have already voted");
      });
    });

    describe("Function getVoter ", () => {
      // TODO get voter not exist
      beforeEach(async () => {
        this.voting = await voting.new({ from: OWNER });
      });

      it("...should revert when getVoter is called by non-voter", async () => {
        await goToVotingSession();
        await expectRevert(this.voting.getVoter(VOTER_1, { from: NON_VOTER }), "You're not a voter");
      });

      it("...should return the voter", async () => {
        await goToVotingSession();
        const voter = await this.voting.getVoter(VOTER_1, { from: VOTER_1 });
        // TODO - check chai how to check if object
        expect(voter.hasVoted).to.be.false;
        expect(voter.votedProposalId).to.equal("0");
      });

      it("...should revert when getOneProposal is called by non-voter", async () => {
        await goToVotingSession();
        await expectRevert(this.voting.getOneProposal(0, { from: NON_VOTER }), "You're not a voter");
      });

      it("...should return the proposal", async () => {
        await goToVotingSession();
        const proposal = await this.voting.getOneProposal(0, { from: VOTER_1 });
        expect(proposal.description).to.equal(PROPOSAL_1.description);
      });
    });
  });

  describe("Winner Id calculation", () => {
    beforeEach(async () => {
      this.voting = await voting.new({ from: OWNER });
    });

    it("...should calculate the winning proposal", async () => {
      await this.voting.addVoter(OWNER, { from: OWNER });
      await this.voting.addVoter(VOTER_1, { from: OWNER });
      await this.voting.addVoter(VOTER_2, { from: OWNER });
      await this.voting.addVoter(VOTER_3, { from: OWNER });
      await this.voting.addVoter(VOTER_4, { from: OWNER });
      await this.voting.addVoter(VOTER_5, { from: OWNER });

      await gotToStatus(this.voting, startProposalsRegistering);

      await addProposals(VOTER_1);

      await gotToStatus(this.voting, endProposalsRegistering);

      await gotToStatus(this.voting, startVotingSession);

      await this.voting.setVote(PROPOSAL_1.id, {
        from: OWNER
      });
      await this.voting.setVote(PROPOSAL_1.id, {
        from: VOTER_1
      });
      await this.voting.setVote(PROPOSAL_2.id, {
        from: VOTER_2
      });
      await this.voting.setVote(PROPOSAL_2.id, {
        from: VOTER_3
      });
      await this.voting.setVote(PROPOSAL_2.id, {
        from: VOTER_4
      });
      await this.voting.setVote(PROPOSAL_3.id, {
        from: VOTER_5
      });
      await gotToStatus(this.voting, endVotingSession);
      await gotToStatus(this.voting, tallyVotes);

      const winner = await this.voting.winningProposalID();
      expect(winner).to.bignumber.equal(PROPOSAL_2.id);
    });
  });
});
