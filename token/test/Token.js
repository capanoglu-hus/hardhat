//const { inputToConfig } = require('@ethereum-waffle/compiler');
const {expect} = require('chai');
const { ethers } = require('hardhat');

describe('Token contract' , function ()  {
    let Token ,token, owner, addr1, addr2 ;
 
    beforeEach(async function () {
        Token = await ethers.getContractFactory('Token'); 
        token = await Token.deploy(true); 
        await token.deployed();
        [owner ] = await ethers.getSigners();
        [addr1 ] = await ethers.getSigners();
        [addr2 ] = await ethers.getSigners();
        
        
        //
    });

    describe('deployment' , function  ()  {
        it('Should set the right owner' , async function  () {
            expect(await token.owner()).to.equal(owner.address);
            // kullanıcı adresine eşit olup olmadıgına bakıyor 
        });

        it('should assign the total Supply of tokens to the owner' , async function () {
            const ownerBalance = await token.balanceOf(owner.address);
            expect( await token.totalSupply()).to.equal(ownerBalance);
            // toplam tokena eşit olup olmadıgına bakıyor 
        });
    });

    describe('Transaction' , function  ()  {
        it('Should transfer tokens between accounts', async function  ()  {
            await token.transfer(addr1.address , 50 ); // adrese 50 gönderiyor 
            const addr1Balance = await token.balanceOf(addr1.address);
            expect(addr1Balance).to.equal(50); // eşit olup olmadıgına bakıyor 

            await token.connect(addr1).transfer(addr2.address , 50 ); // addr1 --> addr2 'ye gönderiyor
            const addr2Balance = await token.balanceOf(addr2.address);
            expect(addr2Balance).to.equal(50);
        });

        it('should fail if sender doesnt have enough tokens' , async function ()  {
            const initialOwnerBalance = await token.balanceOf(owner.address);
            // yeterli degilse hata olmalı 
            await expect(
                token
                    .connect(addr1) // bu adresten gönderme 
                    .transfer(owner.address , 1 ) //sahibine 1 token vermeye çalısacagız 
                )
                    .to
                    .be
                    .revertedWith('not enough token'); // hata mesajı gibi
                expect(
                    await token.balanceOf(owner.address)
                )
                    .to
                    .equal(initialOwnerBalance);
        });

        it('Should update balances after transfers' , async function  ()  {
            const initialOwnerBalance = await token.balanceOf(owner.address);
            await token.transfer(addr1.address , 100);
            await token.transfer(addr2.address , 50 );

            const finalOwnerBalance = await token.balanceOf(owner.address);
            expect(finalOwnerBalance).to.equal(initialOwnerBalance - 150);
            // tarnsferlerden sonra dogru çalışıp çalışmadıgını görmek için 
            const addr1Balance = await token.balanceOf(addr1.address);
            except(addr1Balance).to.equal(100);

            const addr2Balance = await token.balanceOf(addr2.address);
            except(addr2Balance).to.equal(50);

        })
    });

});
