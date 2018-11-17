import DraggableUnit from "./Base/DraggableUnit";
import TDData from "./TDData";
import UIManager from "./Manager/UIManager";
import ConfigManager from"./Manager/ConfigManager"
import GameController from "./GameController";
import UnitPool from "./UnitPool";
import MonUnit from "./MonUnit";
import BulletManager from "./BulletManager";
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
export default class TDUnit extends DraggableUnit {
    
    public tdData:TDData
    private orgPos:cc.Vec2
    public curPosId:number

    public target:MonUnit

    public isTargetAlive():boolean{
        if(this.target == null){
            return false
        }
        if(this.target.isAlive){
            return true
        }else{
            this.target = null
            return false
        }
    }
    //设置攻击目标,检查是否可以攻击
    public checkSetTarget(target:MonUnit):boolean{
        //设置攻击目标
        if(this.distanceTo(target) < this.tdData.atkRang){
            this.target = target
            return true
        }
        return false
        
    }
    public setTdData(tdd:TDData){ //设置数据，各种需要刷新下
        this.tdData = tdd
        this.updateSprite()
        this.drawRang()
        
    }

    public attack(){
        console.log("do attack1")
        if(this.isTargetAlive()){

            BulletManager.createBullet(this,this.target)

        }else{

            //没有攻击目标就请求一个进行攻击
        }
        //执行攻击操作
        this.scheduleOnce(function(){
            this.attack()
        },this.tdData.attackSpeed)
    }   

    public drawRang(){

        let node = this.node.getChildByName("graphics")
        if(node == null){
            node = new cc.Node()
            node.name = "graphics"
            node.parent = this.node
            node.setSiblingIndex(0)
            node.position = cc.p(0,0)
        }
        
        let grap:cc.Graphics = node.addComponent(cc.Graphics)
        grap.circle(0,0,this.tdData.atkRang)
        let fillColor:cc.Color = cc.Color.RED
        fillColor.setA(20)
        grap.fillColor = fillColor
        grap.stroke()
        grap.fill()
    }
    public updateSprite(){  
        UnitPool.getInstance().getSprite(this.tdData.spriteRes,(res)=>{
            this.spriteNode.spriteFrame = res
        })
    }
    public setPosById(posId:number){
        let pos = ConfigManager.getInstance().gridPos[posId]
        this.curPosId = posId
        this.orgPos = pos
        this.setPos(pos)

    }
 
    start(){
        super.start()
        this.enableDragEvent(this.spriteNode.node)
        this.attack()
    }
    onDragging(evt:cc.Event.EventMouse){
        this.node.position = UIManager.getInstance().adjustPosByScreen(evt.getLocation())
    }
    //拖拽结束，需要判断
    endDragCallBack(){

        GameController.getInstance().checkUnitEndAction(this)
 
    }

    public backToOrigin(){
        
        this.isCanDrag = false
        let act = cc.moveTo(0.1,this.orgPos)
        let seq:cc.Action = cc.sequence(act,cc.callFunc(function(){
            this.isCanDrag = true

        },this))
 
        this.node.runAction(seq)
    }

    //升个级，做个动画
    public doLevelUpAction(){
        let node1:cc.Node  = cc.instantiate(this.spriteNode.node)
        let node2:cc.Node = cc.instantiate(this.spriteNode.node)
         node1.parent = this.node
         node2.parent = this.node


        let ac11 = cc.moveTo(0.2,this.spriteNode.node.position.add(new cc.Vec2(100,0))) 
        let ac12 = cc.moveTo(0.2,this.spriteNode.node.position)
        let seq1:cc.Action = cc.sequence(ac11,ac12,cc.callFunc(function(){
                node1.destroy()
                node2.destroy()
                this.levelUp()
        },this))

        let ac21 = cc.moveTo(0.2,this.spriteNode.node.position.add(new cc.Vec2(-100,0)))
        let ac22 = cc.moveTo(0.2,this.spriteNode.node.position) 
        let seq2:cc.Action = cc.sequence(ac21,ac22)
        node2.runAction(seq2)
        node1.runAction(seq1)
    }
    public levelUp(){
        let nextTd:TDData = ConfigManager.getInstance().getTdByLevel(this.tdData.level+1)
        if(nextTd!=null){
            this.setTdData(nextTd)
        }
       

    }
    public reset(){
        this.isCanDrag = true
        this.isDragging = false
        
    }
    public remove(){
        this.reset()
        this.setActive(false)
        UnitPool.getInstance().destroyTd(this)
    }
}
