/* TS로 블록체인 코드 만들기 */
//블록체인 = 블럭의 연결
import CryptoJS from "crypto-js";

class Block{
    public index: number;
    public hash: string;
    public prevHash: string;
    public data: string;
    public timestamp: number;

      //해쉬 생성 함수
    static calculateBlockHash = ( //클래스 밖에서도 쓸 수 있음
        index:number, 
        prevHash:string, 
        timestamp:number, 
        data:string
    ):string => {
        const tmp:string = CryptoJS.SHA256(index + prevHash + timestamp + data).toString();
        return tmp;
    }
      //블록의 구조가 유효한지 체크하는 함수
    static validateStructure = (aBlock:Block):boolean => 
        typeof aBlock.index=="number" &&
        typeof aBlock.hash=="string" &&
        typeof aBlock.prevHash=="string" &&
        typeof aBlock.data=="string" &&
        typeof aBlock.timestamp=="number";

    constructor(index:number, hash:string, prevHash:string, data:string, timestamp:number){
        this.index = index;
        this.hash = hash;
        this.prevHash = prevHash;
        this.data = data; 
        this.timestamp = timestamp;
    }
}

const genesisBlock:Block = new Block(0, "1412480", "", "hello", 123456);
const secondBlock:Block = new Block(1, "12480", "", "second", 123467);
//Block타입의 배열
let blockchain: Block[] = [genesisBlock, secondBlock];

  //블록체인을 get하는 함수
const getBlockchain = () : Block[] => blockchain; //return type: Block[], return value: blockchain
  //블록체인 안에서 가장 최근것을 구하는 함수
const getLatestBlock = () : Block => blockchain[blockchain.length-1];
  //지금 시간을 number타입으로 구하는 함수
const getNewTimeStamp = (): number => Math.round(new Date().getTime()/1000);

  //새로운 블록을 만드는 함수
const createNewBlock = (data:string,): Block => {
    const prevBlock: Block = getLatestBlock();
    const newIndex:number = prevBlock.index + 1;
    const newTimestamp:number = getNewTimeStamp();
    const newHash:string = Block.calculateBlockHash(
        newIndex, 
        prevBlock.hash, 
        newTimestamp, 
        data
    );
    const newBlock:Block = new Block(
        newIndex, 
        newHash, 
        prevBlock.hash,
        data,
        newTimestamp,
    )
    addBlock(newBlock);
    return newBlock;
}

//Block의 해쉬를 구하는 함수 (isBlockValid에서 지금 들어있는 hash값이 맞는지 체크하기 위해)
const getHashforBlock = (tmpBlock:Block):string => Block.calculateBlockHash(
    tmpBlock.index,
    tmpBlock.prevHash,
    tmpBlock.timestamp,
    tmpBlock.data,
);

  //제공되고 있는 블록이 유효한지 아닌지
const isBlockValid = (candidateBlock:Block, prevBlock:Block):boolean => {
    //블록의 구조가 유효한지 체크
    if(!Block.validateStructure(candidateBlock)){
        return false;
    }
    else if(prevBlock.index + 1 != candidateBlock.index) {
        return false;
    }
    else if(prevBlock.hash != candidateBlock.prevHash) {
        return false;
    }
    else if(getHashforBlock(candidateBlock) != candidateBlock.hash){
        return false;
    }
    else{
        return true;
    }
};

//블록 추가
const addBlock = (candidateBlock:Block) : void => {
    if(isBlockValid(candidateBlock, getLatestBlock())) {
        //블록 유효검사가 맞다면 blockchain에 블록 추가
        blockchain.push(candidateBlock);
    }
}

createNewBlock("secondBlock");
createNewBlock("thirdBlock");
createNewBlock("fourthBlock");

console.log(blockchain);

export{}; //이 파일이 모듈이라는 것을 알려주는 코드
