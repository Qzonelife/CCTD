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
export default class MonData  {

    id:number
    name:string
    level:number
    blood:number
    moveSpeed:number
    scale:number
    spriteRes:string 
    constructor(jsonCfg){

        this.id = jsonCfg["id"]
        this.name = jsonCfg["name"]
        this.level = jsonCfg["level"]
        this.blood = jsonCfg["blood"]
        this.moveSpeed = jsonCfg["moveSpeed"]
        this.scale = jsonCfg["scale"]
        this.spriteRes = jsonCfg["spriteRes"]
    }
}
