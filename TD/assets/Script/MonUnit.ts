import BaseUnit from "./Base/BaseUnit";
import MonData from "./MonData";
import UnitPool from "./UnitPool";
import ConfigManager from "./Manager/ConfigManager";
import GameController from "./GameController";
import BufferBase from "./BufferBase";
import BufferData from "./BufferData";
import BloodBar from "./BloodBar";
import FUNManager from "./FUNManager";

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
    //public bloodBar:cc.ProgressBar
    public bloodBar:BloodBar
    public isAlive:boolean
    private buffer:BufferBase = new BufferBase()
    public curBlood //当前血量
    public  init(){
        super.init()
        this.buffer.setBuffEventCallBack(this.bufEvent.bind(this))
        this.bloodBar = this.node.getChildByName("blood").getComponent(BloodBar)
        this.bloodBar.setOwner(this)
    }
    // public setBloodVisible(isVisible:boolean){
    //     if(this.bloodBar.node.active == isVisible)
    //         return
    //     this.bloodBar.node.active = isVisible
    // }
    public setTdData(monData:MonData){ //设置数据，各种需要刷新下
        this.monData = monData
        this.updateSprite()
    }
    public updateSprite(){  
        UnitPool.getInstance().getDragonBoneData(this.monData.spriteRes,(tuple)=>{
 
            this.dragonBone.dragonAsset = tuple[0]
            this.dragonBone.dragonAtlasAsset = tuple[1]
            this.dragonBone.armatureName = "armatureName"
            this.dragonBone.playAnimation("newAnimation",-1)
         
        }) 
    }

    public aliveUnit(){
        this.bloodBar.setBloodVisible(false)
        this.curBlood = this.monData.blood
        this.bloodBar.setBloodProgress(1)
        this.isAlive = true
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
        let rpn:[number,cc.Vec2,string] = ConfigManager.getInstance().getRoadPoint(this.curPosId)
        if(rpn[2]=="3"){ //看向左边
            this.dragonBone.node.scaleX = -Math.abs(this.dragonBone.node.scaleX)
        }else if(rpn[2] == "4"){ //看向右边
            this.dragonBone.node.scaleX =  Math.abs(this.dragonBone.node.scaleX)
        }
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
        
        let dis = this.node.position.sub(this.targetPos).mag() //算剩余距离
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

    public sufferDamage(val){ 
        this.curBlood = this.curBlood-val
        this.curBlood = this.curBlood<=0? 0:this.curBlood
        this.bloodBar.setBloodProgress(this.curBlood/this.monData.blood)
        FUNManager.flyBlood(this.node,val)
      
        if(this.curBlood<=0){
            GameController.getInstance().monDie(this)
            this.remove()
        }
    }
    //检查当前怪物可移动状态，如果怪物身上具有buffertype == 4的，怪物则处于不可移动状态中
    public moveStateChage(){

    }

    //buffer触发的事件
    public bufEvent(buf:BufferData,state){
 
        if(state==0){ //buff的一次触发
            if(buf.bufferType == 3){ //伤害造成的buf
                this.sufferDamage(buf.param) //造成的伤害值
            }
        }else if(state==1){ //buff的一次添加
            if(buf.bufferType == 2){
                this.speedChange()
            }else if(buf.bufferType == 4){
                this.moveStateChage()
            }
        }else{ //buff的一次移除
            if(buf.bufferType == 2){
                this.speedChange()
            }else if(buf.bufferType == 4){
                this.moveStateChage()
            }
        }
      
    }

    public addBuff(buf:BufferData){
        this.buffer.addBuff(buf)
    }

    public remove(){
        this.bloodBar.setBloodVisible(false)
        this.buffer.clearBuff()
        this.isAlive = false
        this.setActive(false)
        UnitPool.getInstance().destroyMon(this)
    }

}
