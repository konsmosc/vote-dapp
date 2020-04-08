pragma solidity ^0.6.1;

contract Voting {

    address public owner;
    mapping (bytes32 => uint) private votesReceived;
    bytes32[] public candidateList;
    mapping (address => bool) private voters;
    string public votetitle;

    modifier onlyOwner(){
        require(msg.sender == owner,"Only owner can call this function.");
        _;
    }

    constructor(bytes32[] memory candidateNames, string memory title) public {
        candidateList = candidateNames;
        votetitle = title;
        owner = msg.sender;
    }

    function voteForCandidate(bytes32 candidate) public {
        require(validCandidate(candidate) == true,"Candidate doesn't exists");
        require(!voters[msg.sender], "You have already submit your vote");
        votesReceived[candidate] += 1;
        voters[msg.sender] = true;
    }

    function changeTitle(string memory title) public onlyOwner {
        votetitle = title;
    }

    function totalVotesFor(bytes32 candidate) public view returns (uint) {
        require(validCandidate(candidate) == true, "Candidate doesn't exists");
        return votesReceived[candidate];
    }

    function validCandidate(bytes32 candidate) private view returns (bool) {
        for(uint i = 0; i < candidateList.length; i++) {
            if (candidateList[i] == candidate) {
                return true;
            }
        }
        return false;
    }
<<<<<<< HEAD

	function candidates() public view returns (bytes32[] memory) {
=======
	
    function candidates() public view returns (bytes32[] memory) {
>>>>>>> 3439a5c151fab319603f0b86094a1433de3c1b7b
        bytes32[] memory list = new bytes32[](candidateList.length);
        for(uint i = 0; i < candidateList.length; i++){
            list[i] = candidateList[i];
        }
        return list;
    }

}
