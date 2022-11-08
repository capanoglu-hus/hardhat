//SDPX-License-Idenfitier: UNLICENSED

pragma solidity ^0.8.17;

contract Token {

    string public name =' my hardhat token '; // tokenadı 
    string public symbol ='mht'; // sembolu
    uint public totalSupply= 1000000;  // ne kadar var oldugu 
    address public owner ; //yazarı
    mapping(address => uint256) balances;

constructor(){
    balances[msg.sender] = totalSupply;
    owner = msg.sender; 
}

function transfer(address to , uint256 amount) external payable {
    require(balances[msg.sender] >= amount, "not enough tokens ");
    balances[msg.sender] -= amount;
    balances[to] += amount;
    
}

function balanceOf(address account ) external view returns(uint256){
    return balances[account];
}

}