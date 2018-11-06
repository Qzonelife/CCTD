import UnitPool from "./UnitPool";
import TDUnit from "./TDUnit";
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
export default class GameController {

   private static instance:GameController

   static getInstance():GameController{
        if(!this.instance)
            this.instance = new GameController()
        return this.instance
   }

   public createTDUnitByPos(posId,tdType){ 
        UnitPool.getInstance().getTdByType(tdType,(td:TDUnit)=>{

            td.setParent(UIManager.getInstance().tdLayer)
            td.setPos(new cc.Vec2(0,0))
            console.log("prepare to drag")
        })
   }

}
