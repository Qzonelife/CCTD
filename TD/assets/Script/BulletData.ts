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
export default class BulletData  {

    id:number
    name:string
    moveSpeed:number
    spriteRes:string 
    buffer:number
    constructor(jsonCfg){

        this.id = jsonCfg["id"]
        this.name = jsonCfg["name"]
        this.moveSpeed = jsonCfg["moveSpeed"]
        this.spriteRes = jsonCfg["spriteRes"]
        this.buffer = jsonCfg["buffer"]
    }
}
