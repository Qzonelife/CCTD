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

    id:number  //怪物id
    name:string //怪物姓名
    level:number //等级
    blood:number //怪物血量
    moveSpeed:number //移动速度
    bamboo:number //竹子数量
    killExp:number //击杀经验
    escapeExp:number //逃跑扣掉的经验
    gem:number      //掉落宝石
    spriteRes:string  //资源地址

    constructor(jsonCfg){

        this.id = jsonCfg["id"]
        this.name = jsonCfg["name"]
        this.level = jsonCfg["level"]
        this.blood = jsonCfg["blood"]
        this.moveSpeed = jsonCfg["moveSpeed"]
        this.bamboo = jsonCfg["bamboo"]
        this.killExp = jsonCfg["killExp"]
        this.escapeExp = jsonCfg["escapeExp"]
        this.gem = jsonCfg["gem"]
        this.spriteRes = jsonCfg["spriteRes"]
    }
}
