import TDUnit from "./TDUnit";
import TDData from "./TDData";
import ConfigManager from "./Manager/ConfigManager";
import MonUnit from "./MonUnit";
import MonData from "./MonData";
import BulletUnit from "./BulletUnit";
import BulletData from "./BulletData";
import FlyNumUnit from "./FlyNumUnit";
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
    private bulPool:BulletUnit[] = new Array<BulletUnit>()

    private bulPf = "prefabs/bulUnit"
    private monPf = "prefabs/monUnit"
    private tdPf = "prefabs/tdUnit"
    //通过类型获得td
    public getTdByType(tdType,callBack){
 
        if(this.tdPool.length>0){
            let tUnit:TDUnit = this.tdPool.pop()
            let tdd:TDData = ConfigManager.getInstance().getTdData(tdType)
            tUnit.setTdData(tdd)
            tUnit.setActive(true)
            callBack(tUnit)
        }else{
            if(this.pfLs[this.tdPf]){
                let node:cc.Node = cc.instantiate(this.pfLs[this.tdPf])
                let tUnit:TDUnit = node.getComponent(TDUnit)
                tUnit.init()
                let tdd:TDData = ConfigManager.getInstance().getTdData(tdType)
 
                tUnit.setTdData(tdd)
                tUnit.setActive(true)
                callBack(tUnit)

            }else{
                cc.loader.loadRes(this.tdPf,cc.Prefab,(err,res)=>{
                    this.pfLs[this.tdPf] = res
                    let node:cc.Node = cc.instantiate(this.pfLs[this.tdPf])
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
            if(this.pfLs[this.monPf]){
                let node:cc.Node = cc.instantiate(this.pfLs[this.monPf])
                let monUnit:MonUnit = node.getComponent(MonUnit)
                monUnit.init()
                let mdd:MonData = ConfigManager.getInstance().getMonData(monType)
                monUnit.setTdData(mdd)
                monUnit.setActive(true)
                callBack(monUnit)

            }else{
                cc.loader.loadRes(this.monPf,cc.Prefab,(err,res)=>{
                    this.pfLs[this.monPf] = res
                    let node:cc.Node = cc.instantiate(this.pfLs[this.monPf])
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

    public getBulByType(bulType,callBack){
        if(this.bulPool.length>0){
            let bulUnit:BulletUnit = this.bulPool.pop()
            let bld:BulletData = ConfigManager.getInstance().getBulData(bulType)
            bulUnit.setUnitData(bld)
            bulUnit.setActive(true)
            callBack(bulUnit)
        }else{
            if(this.pfLs[this.bulPf]){
                let node:cc.Node = cc.instantiate(this.pfLs[this.bulPf])
                let bulUnit:BulletUnit = node.getComponent(BulletUnit)
                bulUnit.init()
                let bld:BulletData = ConfigManager.getInstance().getBulData(bulType)
                bulUnit.setUnitData(bld)
                bulUnit.setActive(true)
                callBack(bulUnit)
            }else{
                cc.loader.loadRes(this.bulPf,cc.Prefab,(err,res)=>{
                    this.pfLs[this.bulPf] = res
                    let node:cc.Node = cc.instantiate(this.pfLs[this.bulPf])
                    let bulUnit:BulletUnit = node.getComponent(BulletUnit)
                    bulUnit.init()
                    let bld:BulletData = ConfigManager.getInstance().getBulData(bulType)
                    bulUnit.setUnitData(bld)
                    bulUnit.setActive(true)
                    callBack(bulUnit)
                })
            }
        }
    }

    public destroyTd(unit:TDUnit){
        this.tdPool.push(unit)
    }
    public destroyMon(unit:MonUnit){
        this.monPool.push(unit)
    }
    public destroyBullet(unit:BulletUnit){
        this.bulPool.push(unit)
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
    private dragonBoneDict:{[key:string]:[dragonBones.DragonBonesAsset,dragonBones.DragonBonesAtlasAsset]} =  {}
    //获得龙骨数据
    public getDragonBoneData(dragonBoneName,callBack){
 
        if(this.dragonBoneDict[dragonBoneName] == null){
            cc.loader.loadResDir(dragonBoneName,function(err,assets){
     
    
                let tuple:[dragonBones.DragonBonesAsset,dragonBones.DragonBonesAtlasAsset] = [null,null]
 
                for(var i in assets){
                    if(assets[i] instanceof dragonBones.DragonBonesAsset){
                        tuple[0] = assets[i]
                    }
                    if(assets[i] instanceof dragonBones.DragonBonesAtlasAsset){
                        tuple[1] = assets[i]
                    }
                } 
                this.dragonBoneDict[dragonBoneName] = tuple
 
                callBack(tuple)

            }.bind(this))
        }else{
            callBack(this.dragonBoneDict[dragonBoneName]) //直接返回数据
        }
    }
 
    private flyUnitPf:cc.Node
    private flyUnitLs:FlyNumUnit[] = new Array<FlyNumUnit>()
    public getFlyUnit(callBack){
        if(this.flyUnitPf == null){
            cc.loader.loadRes("prefabs/flyNumUnit",cc.Prefab,(err,res)=>{
                 this.flyUnitPf = res
                 let fObj:cc.Node = cc.instantiate(res)
                 fObj.parent = UIManager.getInstance().flyNumLayer
                 let fun = fObj.getComponent(FlyNumUnit)
                 fun.init()
 
                 callBack(fun) 
            })
        }else{
            if(this.flyUnitLs.length<=0){
                let fObj:cc.Node = cc.instantiate(this.flyUnitPf)
                let fun = fObj.getComponent(FlyNumUnit)
                fun.init()
                callBack(fun)
            }else{
                let fun = this.flyUnitLs.pop()
                callBack(fun)
            }
        }
    }
    public removeFlyUnit(flyUnit:FlyNumUnit){
        this.flyUnitLs.push(flyUnit)
    }
}
