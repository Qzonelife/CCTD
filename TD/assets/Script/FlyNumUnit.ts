import BaseUnit from "./Base/BaseUnit";
import UnitPool from "./UnitPool";

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
export default class FlyNumUnit extends BaseUnit {

    private flyNumType:cc.Label
    private flyNum:cc.Label
    public init(){
        this.flyNum = this.node.getChildByName("flyNum").getComponent(cc.Label)
        this.flyNumType = this.node.getChildByName("flyType").getComponent(cc.Label)
    }

    public fly(node:cc.Node,flyNum,flyType = ""){
        this.node.position = node.position.add(cc.v2(0,100))
        this.flyNum.string = flyNum
        this.flyNumType.string = flyType
        this.setActive(true)
  
        let action = cc.moveTo(0.2,this.node.position.add(cc.v2(0,40)))
        let seq = cc.sequence(action,cc.callFunc(()=>{
            this.flyEnd()
        },this))
        this.node.runAction(seq)
    }

    public flyEnd(){
        this.setActive(false)
        UnitPool.getInstance().removeFlyUnit(this)
    }
}
