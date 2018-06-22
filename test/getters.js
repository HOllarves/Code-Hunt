var HuntContract = artifacts.require("./Hunt.sol");

contract('Contract Getters', function (accounts) {

    var contractInstance,
        owner = accounts[0],
        other = accounts[1],
        bountyId,
        testBounty = {
            repoUrl: "https://github.com/HOllarves/Ethereum-Test-Repo",
            userName: "HOllarves",
            issue: 1,
            duration: 432000,
            prize: 2000000000000000000
        }

    HuntContract.deployed()
        .then(instance => {
            contractInstance = instance
        })

    it("...should return true on bounty creation.", () => {
        contractInstance.createBounty(testBounty.repoUrl, testBounty.userName, testBounty.issue, testBounty.duration, { from: accounts[0], value: 2000000000000000000 })
            .then(_bountyId => {
                bountyId = _bountyId
                assert.equal(bountyId, _bountyId, "If an id was returned, the creation was successful")
            })
    });

    it("...should return the bounty created", () => {
        contractInstance.getBounty(bountyId)
            .then(bounty => {
                assert.equal(bounty[0], testBounty.userName, "it should return the same repository url")
                assert.equal(bounty[1], testBounty.repoUrl, "it should return the same repository url")
                assert.equal(bounty[2], testBounty.issue, "it should return the same issue ID")
                assert.equal(bounty[3], testBounty.prize, "it should return the same prize")
            })
    })


    it("...should be able to get a specific bounty's issue", () => {
        contractInstance.getBountyIssue(bountyId, { from: other })
            .then(issue => {
                assert.equal(issue, testBounty.issue, "It should return the bounty's issueID")
            })
    })

    it("...should be able to get a specific bounty's reward", () => {
        contractInstance.getBountyReward(bountyId, { from: other })
            .then(reward => {
                assert.equal(reward, testBounty.prize, "It should return the bounty's reward")
            })
    })

    it("...should be able to get all bounties", () => {
        contractInstance.getBounties({ from: other })
            .then(bounties => {
                assert.equal(bounties.length, 1, "It should return one bounty")
            })
    })

});
