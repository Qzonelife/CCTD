import UnitPool from "./UnitPool";
import UIManager from "./Manager/UIManager";
import BulletUnit from "./BulletUnit"
import TDUnit from "./TDUnit";
import MonUnit from "./MonUnit";
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
export default class BulletManager  {
    constructor(){

    }
    public bulList:BulletUnit[] = new Array<BulletUnit>()
    
    
    //通过id创建一个bullet对象
    public createBullet(creator:TDUnit,target:MonUnit){
        let id = creator.tdData.bulletType
       UnitPool.getInstance().getMonByType(id,(unit:BulletUnit)=>{
           unit.setParent(UIManager.getInstance().bulLayer)
         
       })
    }
}