import UnitPool from "./UnitPool";
import TDUnit from "./TDUnit";
import UIManager from "./Manager/UIManager";
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
export default class GameController {

   private static instance:GameController

   static getInstance():GameController{
        if(!this.instance)
            this.instance = new GameController()
        return this.instance
   }
   public startGameLogic(){
    cc.systemEvent.on(cc.SystemEvent.EventType.KEY_DOWN, this.onKeyDown, this);
   }

   public onKeyDown(){ 
      let createId = Math.floor(Math.random()*16)
      this.createTDUnitByPos(createId,1)
   }
   public unitDict:{[key:number]:TDUnit} = {}

   public createTDUnitByPos(posId,tdType){  
       if(ConfigManager.getInstance().gridPos.length<posId)
        return
        if(this.unitDict[posId]!=null){
            console.log("对应位置已经存在了")
            return
        }
        let pos = ConfigManager.getInstance().gridPos[posId]

        UnitPool.getInstance().getTdByType(tdType,(td:TDUnit)=>{

            td.setParent(UIManager.getInstance().tdLayer)
            td.dragLayer = UIManager.getInstance().dragLayer
            td.setPos(pos)
            this.unitDict[posId] = td
            console.log("prepare to drag")
        })
        // UnitPool.getInstance().getTdByType(tdType,(td:TDUnit)=>{

        //     td.setParent(UIManager.getInstance().tdLayer)
        //     td.dragLayer = UIManager.getInstance().dragLayer
        //     td.setPos(new cc.Vec2(50,0))
            
        //     console.log("prepare to drag")
        // })
   }

}
