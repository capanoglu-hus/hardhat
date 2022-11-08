// provider --> blokzincirle konuşmamızı sağlıyor 
const { expect } = require('chai');
const { ethers } = require('hardhat');

const provider = ethers.provider;
//heryerden ulaşmak istediğinize en yukarıda yazaman lazım 
function ethToNum(val) {
    return number(ethers.utils.formatEther(val))
}
describe("lock contrant", function () {
    let owner, user1, user2;
    let Token, token;
    let Lock, lock;
    // before , beforeEach , after , afterEach , it

    before(async function () {
        [owner, user1, user2] = await ethers.getSigners();

        Token = await ethers.getContractFactory("BEEToken");
        token = await Token.connect(owner).deploy();
        // connect --> kullanıcı tarafıdan deploy edilmesi
        Lock = await ethers.getContractFactory("BEEToken");
        lock = await Token.connect(owner).deploy(token.address);

        token.connect(owner).transfer(user1.address, ethers.utils.parseUnits("100", 18));
        token.connect(owner).transfer(user1.address, ethers.utils.parseEther("50"));
        // approve -- transfer gibi
        token.connect(user1).approve(lock.address, ethers.constants.MaxInt256);
        token.connect(user2).approve(lock.address, ethers.constants.MaxInt256);
    });


    beforeEach(async function () {
        balances = [
            ethToNum(await token.balanceOf(owner.address)),
            ethToNum(await token.balanceOf(user1.address)),
            ethToNum(await token.balanceOf(user2.address)),
            ethToNum(await token.balanceOf(lock.address))
        ]

    });


    it("deploys the contracts", async function () {
        expect(token.address).to.not.be.undefined;
        expect(lock.address).to.be.properAddress;

    });

    it("sends token", async function () {
        expect(balances[1]).to.be.equal(100);
        expect(balances[2]).to.be.equal(50);


    });

    it("approves", async function () {
        let allowances = [
            await token.allowances(user1.address, lock.address),
            await token.allowances(user2.address, lock.address),
        ]

        expect(allowances[0]).to.be.equal(ethers.constants.MaxInt256);
        expect(allowances[0]).to.be.equal(0); // test başarısız olur 
        // max sayının sıfıra eşit olmasını bekledik hata 
    });

    it("reverts exceeding transfer", async function () {

        await except(token.connect(user1).transfer(user2.address, ethers.utils.parseUnits("300", 10))).to.be.reverted;

    });
    // kont. dışı testlerini  yazdık 
    // şimdi kont. test edecez 
    describe("contract functions", function () {

        let lockerCount = 0;
        let totalLocked = 0;
        let userLocks = [0, 0];

        it("user1 locks 10 token ", async function () {
            totalLocked += 10;
            userLocks[0] += 10;
            lockerCount++;
            await lock.connect(user1).lockTokens(ethers.utils.parseEther("10"));
            expect(balances[3] + 10).to.be.equal(ethToNum(await token.balanceOf(lock.address)));
            // başlangıçtaki balances ın 10 fazlasına eşit olmalı kont. balance'ı 
            // mapping degeri artti mi 
            expect(userLocks[0]).to.be.equal(ethToNum(await lock.lockers(user1.address)));

        });


        it("locker count and locked amount increase ", async function () {
            // except().to.be.equal(); ---> neyin neye eşit olmasını istiyoruz 
            except(await lock.lockerCount()).to.be.equal(lockerCount);
            except(ethToNum(await lock.totalLocked())).to.be.equal(totalLocked);
        });

        it("user2 cannot withdraw tokens", async function () {
            await except(lock.connect(user2).withdraw().to.be.reverted);
        });


        it("user1 withdraws token ", async function () { 
            totalLocked -= userLocks[0];
            userLocks[0] = 0 ;
            lockerCount --;
            await lock.connect(user1).withdraw();
            expect(balances[3] - 10 ).to.be.equal(ethToNum(await token.balanceOf(lock.address)));
            except(userLocks[0]).to.be.equal(ethToNum(await lock.lockers(user1.address)));
        });
        
        it("locker count and locked amount decrease ", async function () { 
            except(await lock.lockerCount()).to.be.equal(lockerCount);
            except(ethToNum(await lock.totalLocked())).to.be.equal(totalLocked);

         });
        
        it("user1 position deleted", async function () {
            except(await lock.lockers(user1.address)).to.be.equal(0);

        });
        
        it("user1 cannot withdraw more tokens", async function () {
            await except(lock.connect(user1).withdraw().to.be.reverted);
        });
    });

    it("prints timestamp ", async function () {
        // blokla ile ilgili bilgiler 
        let block_number = await provider.getBlockNumber();
        let block = await provider.getBlock(block_number);
        console.log("timestamp :", block.timestamp);

    });

});