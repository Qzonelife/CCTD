import MonUnit from "./MonUnit";
import UnitPool from "./UnitPool";
import UIManager from "./Manager/UIManager";
import ConfigManager from "./Manager/ConfigManager";
import TDUnit from "./TDUnit";

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
            unit.aliveUnit()
            this.monLs.push(unit)
        })
     }
     public assignTarget(tdUnit:TDUnit){
         if(tdUnit.isTargetAlive()){ //攻击对象是否存在,如果有就直接返回
            return
         }
         let deathLs:MonUnit[] = new Array<MonUnit>()
         for(var i=0;i<this.monLs.length;i++){
             //分配到目标就break
             if(!this.monLs[i].isAlive){ //如果怪物池中的怪物死亡就移除
                 deathLs.push(this.monLs[i])
                 continue
             }
             if(tdUnit.checkSetTarget(this.monLs[i])){
                
                 console.log("target set successful")
                break
            }
         }
         for(var i=0;i<deathLs.length;i++){
            this.monLs.splice(this.monLs.indexOf(deathLs[i]),1)
         }
 

     }

}
