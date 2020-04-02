// connection with ethereum ropsten using metamask provider
let web3 = new Web3(ethereum);
ethereum.enable();

// check web3 version
console.log(web3.version);

// Read of the contract's information
let response = jQuery.get({url:'contracts/voting.json', async:false});
let contract_info = JSON.parse(response.responseText);

// Create the voting smart contract instance
let contract_address = contract_info.address;
let contract_abi = contract_info.abi;
let contractInstance = new web3.eth.Contract(contract_abi, contract_address);

// Contract Functions
// Transaction/Setter functions
async function voteForCandidate() {
    let candidate = $("#candidate").val();
    console.log(web3.utils.utf8ToHex(candidate));
    // Contract method invocation in order to vote for Candidate
    let accounts = await web3.eth.getAccounts();
    let receipt = await contractInstance.methods.voteForCandidate(web3.utils.utf8ToHex(candidate)).send({from: accounts[0]});
    document.getElementById("msg").innerHTML = "Transaction Hash: " + receipt.transactionHash;
    applicationStart();
}

async function changeTitle() {
    let changetitle = $("#changetitle").val();
    // Contract method invocation in order to change the Voting Title
    let accounts = await web3.eth.getAccounts();
    let receipt = await contractInstance.methods.changeTitle(changetitle).send({from: accounts[0]});
    document.getElementById("msg").innerHTML = "Transaction Hash: " + receipt.transactionHash;
}

// Call/Getter/Query functions
async function owner(){
    let contract_owner = await contractInstance.methods.owner().call();
    return contract_owner;
}

async function votetitle(){
    let title = await contractInstance.methods.votetitle().call();
    return title;
}

async function candidates(){
    let res = await contractInstance.methods.candidates().call();
    let list = res.map(web3.utils.hexToUtf8);
    return list;
}

async function totalVotesFor(candidate){
    let votes = contractInstance.methods.totalVotesFor(candidate).call();
    return votes;
}

// html functions
async function accountAddress(){
    let accounts = await web3.eth.getAccounts();
    return accounts[0];
}

async function totalVotesForCandidates(){
    let candidateList = await candidates();
    console.log("Candidates: ", candidateList);
    let str = "";
    for(let i in candidateList){
        let votes = await totalVotesFor(web3.utils.utf8ToHex(candidateList[i]))
        str = str + '<tr><td>'+ candidateList[i] + '</td>' + '<td>' + votes + '</td></tr>'
    }
    return str;
}

async function applicationStart(){
    let str = await totalVotesForCandidates();
    let title = await votetitle();
    let address = await accountAddress();
    $('#tableBody').html(str);
    $("#title").html(title);
    $("#address").html("Connected Ethereum Address: <b>" + address + "</b>");
}

applicationStart();