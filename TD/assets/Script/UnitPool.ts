import TDUnit from "./TDUnit";
import TDData from "./TDData";
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
export default class UnitPool{

    private static instance:UnitPool

    static getInstance():UnitPool{
         if(!this.instance)
             this.instance = new UnitPool()
         return this.instance
    }
    private pfLs:{[key:string]:cc.Prefab} = {}; //预设列表

    private tdPool:{[key:number]:TDUnit[];} = {}

    //通过类型获得td
    public getTdByType(tdType,callBack){
        if(this.tdPool[tdType] == null){
            this.tdPool[tdType] = new Array<TDUnit>()
        }
        var popUnit = this.tdPool[tdType].pop()
        if(popUnit){
            callBack(popUnit)
        }else{
            if(this.pfLs["prefabs/tdUnit"]){
                let node:cc.Node = cc.instantiate(this.pfLs["prefabs/tdUnit"])
                let tUnit:TDUnit = node.getComponent(TDUnit)
                callBack(tUnit)

            }else{
                cc.loader.loadRes("prefabs/tdUnit",cc.Prefab,(err,res)=>{
                    this.pfLs["prefabs/tdUnit"] = res
                    let node:cc.Node = cc.instantiate(this.pfLs["prefabs/tdUnit"])
                    let tUnit:TDUnit = node.getComponent(TDUnit)
                    callBack(tUnit)
                })
            
            }
        }
        
    }
}
