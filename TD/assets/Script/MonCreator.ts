import MonUnit from "./MonUnit";
import UnitPool from "./UnitPool";
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
export default class MonCreator {

     constructor(){

     }
     public monLs:MonUnit[] = new Array<MonUnit>()
     
     
     //通过id创建一个mon对象
     public creatorMonster(id = 1){
        UnitPool.getInstance().getMonByType(id,(unit:MonUnit)=>{
            unit.setParent(UIManager.getInstance().monLayer)
            unit.setToRoadPoint(1)
        })
     }
}
