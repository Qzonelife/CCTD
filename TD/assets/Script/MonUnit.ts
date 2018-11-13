import BaseUnit from "./Base/BaseUnit";
import MonData from "./MonData";
import UnitPool from "./UnitPool";
import ConfigManager from "./Manager/ConfigManager";

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
export default class MonUnit extends BaseUnit {

    

    public monData:MonData
    public curPosId:number
    public targetPos:cc.Vec2
    public bloodBar:cc.ProgressBar
    public  init(){
        super.init()
        this.bloodBar = this.node.getChildByName("blood").getComponent(cc.ProgressBar)
    }
    public setBloodVisible(isVisible:boolean){
        this.bloodBar.node.active = isVisible
    }
    public setTdData(monData:MonData){ //设置数据，各种需要刷新下
        this.monData = monData
        this.updateSprite()
    }
    public updateSprite(){  
        UnitPool.getInstance().getSprite(this.monData.spriteRes,(res)=>{
            this.spriteNode.spriteFrame = res
        })
    }
    public setToRoadPoint(id:number){
        let rp:[number,cc.Vec2,string] = ConfigManager.getInstance().getRoadPoint(id)
 
        this.curPosId = id
        if(rp[2]=="0"){
            console.log("err here,设置到了最后一个点")
        }
        this.setPos(rp[1])
        this.startMove()
        console.log("start move~!~~~")
    }

    public startMove(){
        let rp:[number,cc.Vec2,string] = ConfigManager.getInstance().getRoadPoint(this.curPosId+1)
        this.targetPos = rp[1]
        this.moveToTarget()
    }

    public moveToTarget(){
        let act = cc.moveTo(5,this.targetPos)
        let seq = cc.sequence(act,cc.callFunc(()=>{
            this.curPosId = this.curPosId+1
            this.startMove()
        }))
        this.node.runAction(seq)
    }
}
