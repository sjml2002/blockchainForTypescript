"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
/* TS로 블록체인 코드 만들기 */
//블록체인 = 블럭의 연결
var crypto_js_1 = __importDefault(require("crypto-js"));
var Block = /** @class */ (function () {
    function Block(index, hash, prevHash, data, timestamp) {
        this.index = index;
        this.hash = hash;
        this.prevHash = prevHash;
        this.data = data;
        this.timestamp = timestamp;
    }
    //해쉬 생성 함수
    Block.calculateBlockHash = function (//클래스 밖에서도 쓸 수 있음
    index, prevHash, timestamp, data) {
        var tmp = crypto_js_1.default.SHA256(index + prevHash + timestamp + data).toString();
        return tmp;
    };
    //블록의 구조가 유효한지 체크하는 함수
    Block.validateStructure = function (aBlock) {
        return typeof aBlock.index == "number" &&
            typeof aBlock.hash == "string" &&
            typeof aBlock.prevHash == "string" &&
            typeof aBlock.data == "string" &&
            typeof aBlock.timestamp == "number";
    };
    return Block;
}());
var genesisBlock = new Block(0, "1412480", "", "hello", 123456);
var secondBlock = new Block(1, "12480", "", "second", 123467);
//Block타입의 배열
var blockchain = [genesisBlock, secondBlock];
//블록체인을 get하는 함수
var getBlockchain = function () { return blockchain; }; //return type: Block[], return value: blockchain
//블록체인 안에서 가장 최근것을 구하는 함수
var getLatestBlock = function () { return blockchain[blockchain.length - 1]; };
//지금 시간을 number타입으로 구하는 함수
var getNewTimeStamp = function () { return Math.round(new Date().getTime() / 1000); };
//새로운 블록을 만드는 함수
var createNewBlock = function (data) {
    var prevBlock = getLatestBlock();
    var newIndex = prevBlock.index + 1;
    var newTimestamp = getNewTimeStamp();
    var newHash = Block.calculateBlockHash(newIndex, prevBlock.hash, newTimestamp, data);
    var newBlock = new Block(newIndex, newHash, prevBlock.hash, data, newTimestamp);
    addBlock(newBlock);
    return newBlock;
};
//Block의 해쉬를 구하는 함수 (isBlockValid에서 지금 들어있는 hash값이 맞는지 체크하기 위해)
var getHashforBlock = function (tmpBlock) { return Block.calculateBlockHash(tmpBlock.index, tmpBlock.prevHash, tmpBlock.timestamp, tmpBlock.data); };
//제공되고 있는 블록이 유효한지 아닌지
var isBlockValid = function (candidateBlock, prevBlock) {
    //블록의 구조가 유효한지 체크
    if (!Block.validateStructure(candidateBlock)) {
        return false;
    }
    else if (prevBlock.index + 1 != candidateBlock.index) {
        return false;
    }
    else if (prevBlock.hash != candidateBlock.prevHash) {
        return false;
    }
    else if (getHashforBlock(candidateBlock) != candidateBlock.hash) {
        return false;
    }
    else {
        return true;
    }
};
//블록 추가
var addBlock = function (candidateBlock) {
    if (isBlockValid(candidateBlock, getLatestBlock())) {
        //블록 유효검사가 맞다면 blockchain에 블록 추가
        blockchain.push(candidateBlock);
    }
};
createNewBlock("secondBlock");
createNewBlock("thirdBlock");
createNewBlock("fourthBlock");
console.log(blockchain);
