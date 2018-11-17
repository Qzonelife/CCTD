import BaseUnit from "./Base/BaseUnit";
import BulletData from "./BulletData";
import UnitPool from "./UnitPool";
import MonUnit from "./MonUnit";

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
export default class BulletUnit extends BaseUnit{

    public bulletData:BulletData
    private target:MonUnit
    public setUnitData(bld:BulletData){ //设置数据，各种需要刷新下
        this.bulletData = bld
        this.updateSprite()
    }
    public updateSprite(){  
        UnitPool.getInstance().getSprite(this.bulletData.spriteRes,(res)=>{
            this.spriteNode.spriteFrame = res
        })
    }

    public setTarget(mon:MonUnit){
        this.target = mon
    }
    
    public update(){ 
        if(this.target ==null || !this.target.isAlive){
 
            return
        }
        this.moveToPos(this.target.node.position)
    }

    public moveToPos(targetPos:cc.Vec2){
        let delt:cc.Vec2 = cc.pSub(targetPos,this.node.position)
        delt.normalize()
        let newPos = cc.pAdd(this.node.position,delt.mul(0.1))
        console.log(this.bulletData.moveSpeed)
        this.setPos(newPos)
    }
 
}
