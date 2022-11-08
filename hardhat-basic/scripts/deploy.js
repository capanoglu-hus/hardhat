const hre = require("hardhat");

async function main(){
  const CounterContract = await hre.ethers.getContractFactory("Counter"); // kont. çalıştırma 
  const counterContact = await CounterContract.deploy(10); //deploy etme 
  await counterContact.deploed();
  console.log('Contract deployed at adress   ${counterContact.address} '); // kont. adresini yazma 


  let count = await counterContact.function.getCounter(); // kont. yazılan değişkeni yazdırma  
  console.log('currently the counter is at ${count}');

  const increment = await CounterContract.function.increment(1); // bir arttırır
  await increment.wait(); // artışın tamamlanmasını bekledik 
  count = await counterContact.function.getCounter(); // yeniden degişkeni göster 
  console.log('Incremented by 1. the counter is now at ${count}') ; 

}

main()
  .then(() => process.exit(0))
  .catch((err) => {
    console.error(err);
    process.exit(1);
  })