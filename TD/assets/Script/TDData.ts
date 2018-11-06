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
export default class TDData {

    id:number
    level:number
    attack:number
    attackSpeed:number
    spriteRes:string
    bulletType:number

    constructor(jsonCfg){

        this.id = jsonCfg["id"]
        this.level = jsonCfg["level"]
        this.attack = jsonCfg["attack"]
        this.attackSpeed = jsonCfg["atkSp"]
        this.spriteRes = jsonCfg["spriteRes"]
        this.bulletType = jsonCfg["bulType"]
    }
      
}
