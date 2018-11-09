import DraggableUnit from "./Base/DraggableUnit";
import TDData from "./TDData";
import UIManager from "./Manager/UIManager";

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
    
    private tdData:TDData
    private orgPos:cc.Vec2
    public setTdData(tdd:TDData){
        this.tdData = tdd
    }

   public setPos(pos:cc.Vec2){
        super.setPos(pos)
        this.orgPos = pos
   }
    start(){
        super.start()
        this.enableDragEvent(this.spriteNode.node)
    }
    onDragging(evt:cc.Event.EventMouse){
        console.log(this.node.parent.name)
        this.node.position = UIManager.getInstance().adjustPosByScreen(evt.getLocation())
    }
    endDragCallBack(){
        this.isCanDrag = false
        let act = cc.moveTo(0.1,this.orgPos)
        let seq:cc.Action = cc.sequence(act,cc.callFunc(function(){
            console.log(this.isCanDrag)
            this.isCanDrag = true
            console.log(this.isCanDrag)

        },this))
 
        this.node.runAction(seq)
        this.doLevelUp()
    }

    //升个级，做个动画
    public doLevelUp(){
        let node1:cc.Node  = cc.instantiate(this.spriteNode.node)
        let node2:cc.Node = cc.instantiate(this.spriteNode.node)
         node1.parent = this.node
         node2.parent = this.node


        let ac11 = cc.moveTo(0.2,this.spriteNode.node.position.add(new cc.Vec2(100,0))) 
        let ac12 = cc.moveTo(0.2,this.spriteNode.node.position)
        let seq1:cc.Action = cc.sequence(ac11,ac12,cc.callFunc(function(){
                node1.destroy()
                node2.destroy()
        },this))

        let ac21 = cc.moveTo(0.2,this.spriteNode.node.position.add(new cc.Vec2(-100,0)))
        let ac22 = cc.moveTo(0.2,this.spriteNode.node.position) 
        let seq2:cc.Action = cc.sequence(ac21,ac22)
        node2.runAction(seq2)
        node1.runAction(seq1)
    }
}
