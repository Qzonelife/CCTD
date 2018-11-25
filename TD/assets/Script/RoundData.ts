// Learn TypeScript:
//  - [Chinese] http://docs.cocos.com/creator/manual/zh/scripting/typescript.html
//  - [English] http://www.cocos2d-x.org/docs/creator/manual/en/scripting/typescript.html
// Learn Attribute:
//  - [Chinese] http://docs.cocos.com/creator/manual/zh/scripting/reference/attributes.html
//  - [English] http://www.cocos2d-x.org/docs/creator/manual/en/scripting/reference/attributes.html
// Learn life-cycle callbacks:
//  - [Chinese] http://docs.cocos.com/creator/manual/zh/scripting/life-cycle-callbacks.html
//  - [English] http://www.cocos2d-x.org/docs/creator/manual/en/scripting/life-cycle-callbacks.html

const {ccclass, property} = cc._decorator;

@ccclass
export default class RoundData  {

    id:number 
    //波次列表，每一波里面有其中的怪物列表
    waveLs:Array<string[]>
    
    constructor(jsonCfg){

        this.id = jsonCfg["roundId"]
        let waveNode = jsonCfg["wave"]
        this.waveLs = new Array<string[]>()
        waveNode.forEach(element => {
            let monsStr:string = element["mons"] //拿到当前波的列表
            let mons:string[] = monsStr.split(',')
            this.waveLs.push(mons)
        });
    }
}
