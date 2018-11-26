import BaseUnit from "./Base/BaseUnit";
import MonData from "./MonData";
import UnitPool from "./UnitPool";
import ConfigManager from "./Manager/ConfigManager";
import GameController from "./GameController";
import BufferBase from "./BufferBase";
import BufferData from "./BufferData";

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
    public isAlive:boolean
    private buffer:BufferBase = new BufferBase()
    public curBlood //当前血量
    public  init(){
        super.init()
        this.buffer.setBuffEventCallBack(this.bufEvent.bind(this))
        this.bloodBar = this.node.getChildByName("blood").getComponent(cc.ProgressBar)
    }
    public setBloodVisible(isVisible:boolean){
        if(this.bloodBar.node.active == isVisible)
            return
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

    public aliveUnit(){
        this.setBloodVisible(false)
        this.curBlood = this.monData.blood
        this.bloodBar.progress = 1
        this.isAlive = true
    }
    public removeUnit(){
        this.isAlive = false
    }

    public setToRoadPoint(id:number){
        let rp:[number,cc.Vec2,string] = ConfigManager.getInstance().getRoadPoint(id)
 
        this.curPosId = id
        if(rp[2]=="0"){
            console.log("err here,设置到了最后一个点") //移除
        }
        this.setPos(rp[1])
        this.startMove() 
    }
    public isCanMove(){
        return this.isAlive
    }
    public startMove(){

        let rp:[number,cc.Vec2,string] = ConfigManager.getInstance().getRoadPoint(this.curPosId+1)
        this.targetPos = rp[1]
        this.speedChange()
    }

    private curmoveSeq;
    public  speedChange(){
        if(this.curmoveSeq!=null){
            this.node.stopAction(this.curmoveSeq)
        }
        this.moveToTarget()
    }

    //获取当前怪物移动速度 ,有可能变化
    public getCurMonSpeed(){
        return this.monData.moveSpeed*(1 - this.buffer.getBSpeed())
    }
    public moveToTarget(){
        let dis = cc.pDistance(this.node.position,this.targetPos) //算剩余距离
        let t = dis/this.getCurMonSpeed()
        let act = cc.moveTo(t,this.targetPos)
        this.curmoveSeq = cc.sequence(act,cc.callFunc(()=>{
            let rp:[number,cc.Vec2,string] = ConfigManager.getInstance().getRoadPoint(this.curPosId+1)
            if(rp[2]=="0"){
                
                GameController.getInstance().monEscape(this)
                this.remove()
            }else{
                this.curPosId = this.curPosId+1
                this.startMove()
            }
      
        }))
        
        this.node.runAction(this.curmoveSeq)
    }

    private recordHideBlood = -1
    public sufferDamage(val){ 
        this.curBlood = this.curBlood-val
        this.curBlood = this.curBlood<=0? 0:this.curBlood
        this.bloodBar.progress = this.curBlood/this.monData.blood
        this.setBloodVisible(true)
        if(this.recordHideBlood==-1){ //记录当前显示血条的时候，血量是多少
            this.recordHideBlood = this.curBlood
            this.scheduleOnce(this.hideBloodBar,2)
        }
        if(this.curBlood<=0){
            GameController.getInstance().monDie(this)
            this.remove()
        }
    }
    public hideBloodBar(){
        //记录了这么久，都还是没有变化，就隐藏血条吧
        if(this.curBlood==this.recordHideBlood){
            this.setBloodVisible(false)
        }
        this.recordHideBlood = -1
       
    }
    //buffer触发的事件
    public bufEvent(buf:BufferData,state){
 
        if(state==0){ //buff的一次触发
            if(buf.bufferType == 3){ //伤害造成的buf
                
            }
        }else if(state==1){ //buff的一次添加
            if(buf.bufferType == 2){
                this.speedChange()
            }
        }else{ //buff的一次移除
            if(buf.bufferType == 2){
                this.speedChange()
            }
        }
      
    }

    public addBuff(buf:BufferData){
        this.buffer.addBuff(buf)
    }

    public remove(){
        this.buffer.clearBuff()
        this.isAlive = false
        this.setActive(false)
        UnitPool.getInstance().destroyMon(this)
    }

}
