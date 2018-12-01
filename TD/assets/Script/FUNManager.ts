import UnitPool from "./UnitPool";
import FlyNumUnit from "./FlyNumUnit";

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
export default class FUNManager  {

    private static nodeLs:Array<[cc.Node,number,string]> = new Array<[cc.Node,number,string]>()
    //飞血
   public static flyBlood(node:cc.Node,flyNum,flyType=""){
        UnitPool.getInstance().getFlyUnit(function(fun:FlyNumUnit){
            fun.fly(node,flyNum,flyType)
        }.bind(this))
   }
}
