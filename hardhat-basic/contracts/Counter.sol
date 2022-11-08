// SPDX-License-Identifier: MIT 
pragma solidity ^0.8.9;

contract Counter{

uint256 count ; 

constructor(uint256 n ){
    count = n ;
} 

function getCounter() public view returns(uint256){
    return count;
}

function increment(uint256 n) public {
    count = count + n ;
    
}

}
