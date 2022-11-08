const { ethers } = require("hardhat") ;

async function main(){
    const [deployer] = await ethers.getSigners();

    const Lock = await ethers.getContractFactory("Lock");
    const lock = await Lock.deploy("0x9d............");

    console.log("contract address :" , lock.address);
}

main()
    .then( () => process.exit(0))
    .catch((error) => {
        console.error(error);
        process.exit(1);
    })