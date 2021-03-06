import TDData from "./TDData";

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
export default class BufferData  {

    id:number
    name:string 
    bufferLevel:number
    bufferType:number
    bufferDetail:[number,number,number] //buffer的数据细节，等级，持续时间,触发概率，参数
    constructor(detail,jsonCfg){

        this.id = jsonCfg["id"]
        this.name = jsonCfg["name"]
        this.bufferType = jsonCfg["bufferType"]
        this.bufferLevel = detail["level"]
        //this.bufferDetail = [detail["duration"],detail["rate"],detail["param"]];
        this.bufferDetail = [detail["duration"],1,detail["param"]]; //概率先默认100%触发
    }
    get duration():number{
        return this.bufferDetail[0]
    }
    get rate():number{
        return this.bufferDetail[1]
    }
    get param():number{
        return this.bufferDetail[2]
    }

    get bufferDetailId():string{
        return this.id+"_"+this.bufferLevel
    }

}

