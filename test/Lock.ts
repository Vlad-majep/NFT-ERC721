import { loadFixture } from "@nomicfoundation/hardhat-network-helpers";
import { expect } from "chai";
import { ethers } from "hardhat";
import { LendingProtocol} from "../typechain-types";

describe("LendingProtocol", function() {
    async function deploy() {
      const [ owner, user2 ] = await ethers.getSigners();
      const LendingFactory = await ethers.getContractFactory("LendingProtocol");
      const lending : LendingProtocol = await LendingFactory.deploy();
      await lending.deployed();
      const token = await (await ethers.getContractFactory("MCSToken")).deploy(owner.address)

      return { lending, owner, user2 , token}
    }

});