import TDUnit from "./TDUnit";
import TDData from "./TDData";
import ConfigManager from "./Manager/ConfigManager";
import MonUnit from "./MonUnit";
import MonData from "./MonData";

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
export default class UnitPool{

    private static instance:UnitPool

    static getInstance():UnitPool{
         if(!this.instance)
             this.instance = new UnitPool()
         return this.instance
    }
    private pfLs:{[key:string]:cc.Prefab} = {}  //预设列表
    private spriteLs:{[key:string]:cc.SpriteFrame} = {}  //图片精灵列表 

    private tdPool:TDUnit[] = new Array<TDUnit>()
    private monPool:MonUnit[] = new Array<MonUnit>()
    //通过类型获得td
    public getTdByType(tdType,callBack){
 
        if(this.tdPool.length>0){
            let tUnit:TDUnit = this.tdPool.pop()
            let tdd:TDData = ConfigManager.getInstance().getTdData(tdType)
            tUnit.setTdData(tdd)
            tUnit.setActive(true)
            callBack(tUnit)
        }else{
            if(this.pfLs["prefabs/tdUnit"]){
                let node:cc.Node = cc.instantiate(this.pfLs["prefabs/tdUnit"])
                let tUnit:TDUnit = node.getComponent(TDUnit)
                tUnit.init()
                let tdd:TDData = ConfigManager.getInstance().getTdData(tdType)
                console.log(tdType+"lksdjflksdf")
                tUnit.setTdData(tdd)
                tUnit.setActive(true)
                callBack(tUnit)

            }else{
                cc.loader.loadRes("prefabs/tdUnit",cc.Prefab,(err,res)=>{
                    this.pfLs["prefabs/tdUnit"] = res
                    let node:cc.Node = cc.instantiate(this.pfLs["prefabs/tdUnit"])
                    let tUnit:TDUnit = node.getComponent(TDUnit)
                    tUnit.init()
                    let tdd:TDData = ConfigManager.getInstance().getTdData(tdType)
                    tUnit.setTdData(tdd)
                    tUnit.setActive(true)
                    callBack(tUnit)
                })
            
            }
        }
        
    }

    public getMonByType(monType,callBack){
        if(this.monPool.length>0){
            let monUnit:MonUnit = this.monPool.pop()
            let mdd:MonData = ConfigManager.getInstance().getMonData(monType)
            monUnit.setTdData(mdd)
            monUnit.setActive(true)
            callBack(monUnit)
        }else{
            if(this.pfLs["prefabs/monUnit"]){
                let node:cc.Node = cc.instantiate(this.pfLs["prefabs/monUnit"])
                let monUnit:MonUnit = node.getComponent(MonUnit)
                monUnit.init()
                let mdd:MonData = ConfigManager.getInstance().getMonData(monType)
                monUnit.setTdData(mdd)
                monUnit.setActive(true)
                callBack(monUnit)

            }else{
                cc.loader.loadRes("prefabs/monUnit",cc.Prefab,(err,res)=>{
                    this.pfLs["prefabs/monUnit"] = res
                    let node:cc.Node = cc.instantiate(this.pfLs["prefabs/monUnit"])
                    let monUnit:MonUnit = node.getComponent(MonUnit)
                    monUnit.init()
                    let mdd:MonData = ConfigManager.getInstance().getMonData(monType)
                    monUnit.setTdData(mdd)
                    monUnit.setActive(true)
                    callBack(monUnit)
                })
            
            }
        }
    }


    public destroyTd(unit:TDUnit){
        this.tdPool.push(unit)
    }

    public getSprite(sprite,callBack){
        if(this.spriteLs[sprite] != null){
            callBack(this.spriteLs[sprite])
            return
        }

        cc.loader.loadRes(sprite,cc.SpriteFrame,(err,res)=>{
            this.spriteLs[sprite] = res
            callBack(res)
        })
    }
}
