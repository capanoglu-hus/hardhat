//SPDX-License-Identifier: MIT 
pragma solidity ^0.8.2;

import "./Token.sol" ;
// aynı dizinde oldugu için 

contract Lock{
    BEEToken Token ;
    // degişken 
    uint256 public lockerCount; //kaç kullanıcının parası var 
    uint256 public totalLocked; // kont. ne kadar para var 

    mapping(address=>uint256) public lockers; 
    // adrese baglı bakiye 

    constructor(address tokenAddress){
        Token = BEEToken(tokenAddress);
    }

    // payable -- eth gönderme 
    // tokenları ana varlık olarak gönderemiyorsun bir para birimi gibi aslında 
    function lockTokens(uint256 amount) external {
        require(amount > 0 , " token amount must be bigger than 0 "); //kont. 0 dan büyük olanları gö. gerek 
      //  require(Token.balanceOf(msg.sender) >= amount , "Insufficient balance");
      //  require(Token.allowance(msg.sender , address(this)) >= amount , "Insufficient allowance"); --> gönderdiği kadar harcama yetkisi

        if(!(lockers[msg.sender] > 0)) lockerCount ++ ; //daha önce bir kitleme yaptıysa arttır 
        totalLocked += amount ;
        lockers[msg.sender] += amount;

    bool ok = Token.transferFrom(msg.sender, address(this), amount); 
    // transferFrom ----> düzenli bir şekilde erişim verme kont. yada kişiye harcama yetkisi 

    require(ok , "transfer failed"); // transfer başarılı olup olmadıgını bool ile kontrol ediyor

    }


    function withDraw() external{
        // Safa ERC20 -- TOKENLA ETKİLEŞİM KULLANILIYOR
        require(lockers[msg.sender] > 0 , " not enough token");
        // dışarıdan bir kont. konuşuyorsan işlemleri her zaman önce yap
        // reentrancy
        uint256 amount = lockers[msg.sender];
        delete(lockers[msg.sender]);
        totalLocked -= amount;
        lockerCount -- ;
        require(Token.transfer(msg.sender, amount),"transfer failed");

    }
}