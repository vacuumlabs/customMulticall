const { expect } = require("chai");
const { ethers } = require('ethers')

const Factory = artifacts.require("BFactory");
const PoolState = artifacts.require("PoolState");
const TToken = artifacts.require("TToken");
const BPool = artifacts.require("BPool");

describe("PoolState", function() {
  let factory;
  let pool;
  let POOL;
  let WETH;
  let DAI;
  let weth;
  let dai;
  let poolState;
  let admin;
  let MAX = ethers.constants.MaxUint256;
  let poolAddr;

  this.timeout(0)

  before(async () => {
      const accounts = await web3.eth.getAccounts()
      admin = accounts[0]
      console.log(admin)
      
      factory = await Factory.new();
      poolState = await PoolState.new();

      weth = await TToken.new('Wrapped Ether', 'WETH', 18);
      dai = await TToken.new('Dai Stablecoin', 'DAI', 18);

      WETH = weth.address;
      DAI = dai.address;

      // admin balances
      await weth.mint(admin, ethers.utils.parseEther('200'));
      await dai.mint(admin, ethers.utils.parseEther('200'));

      POOL = await factory.newBPool();
      // find pool addr
      POOL.logs.forEach(log => {
        if(log.event === 'LOG_NEW_POOL'){
          poolAddr = log.args[1];
          console.log(log.args[1])
        }
      })

      pool = await BPool.at(poolAddr);

      await weth.approve(poolAddr, MAX);
      await dai.approve(poolAddr, MAX);

      await pool.bind(WETH, ethers.utils.parseEther('50'), ethers.utils.parseEther('2'));
      await pool.bind(DAI, ethers.utils.parseEther('60'), ethers.utils.parseEther('7'));
      await pool.finalize();
  });

  it("Should confirm pool deployed ok", async function() {
      const swapFee = await pool.getSwapFee();
      const wethBal = await pool.getBalance(WETH);
      const daiBal = await pool.getBalance(DAI);
      expect(wethBal.toString()).to.equal(ethers.utils.parseEther('50').toString());
      expect(daiBal.toString()).to.equal(ethers.utils.parseEther('60').toString());
      expect(swapFee.toString()).to.equal('1000000000000');
  });

  it("Should output correct addresses", async function() {
    let pools =
    {
        "pools": [
          {
            "id": poolAddr,
            "tokens": [
              {
                "address": WETH
              },
              {
                "address": DAI
              }
            ]
          }
        ]
    }

    let addresses = [];
    let total = 0;
    pools.pools.forEach((pool, index) => {
      console.log(`${index} ${pool.id}`);
      addresses.push([pool.id]);

      pool.tokens.forEach((token, tokenIndex) => {
        addresses[index].push(token.address);
        total ++;
      })
    })

    console.log({ addresses })

    let onChainInfo = await poolState.getPoolInfo(addresses, total);

    console.log({onChainInfo})

    expect(onChainInfo.length).to.equal(2);
    expect(total).to.equal(2);
    expect(onChainInfo[0].toString()).to.equal(ethers.utils.parseEther('50').toString()); // token balance
    expect(onChainInfo[1].toString()).to.equal(ethers.utils.parseEther('60').toString()); // token balance
  });
});
