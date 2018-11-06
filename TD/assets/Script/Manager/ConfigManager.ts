import TDData from "../TDData";

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
export default class ConfigManager {

    private static instance:ConfigManager

    static getInstance():ConfigManager{
         if(!this.instance)
             this.instance = new ConfigManager()
         return this.instance
    }

    public gridPos:cc.Vec2[] = new Array<cc.Vec2>()
    public tdDatas:{[key:number]:TDData} = {};

    //加载网格配置
    public loadGrid(callBack){
        cc.loader.loadRes("config/unitGridCfg",(err,res)=>{
           if(err){
                console.log("加载配置失败！！")
                console.log(err.message)
           }else{
                let column = Number(res["column"])
                let sizeScale = Number(res["sizeScale"])
                let pos = res["pos"]
                pos.forEach(element => {
                    let vct:cc.Vec2 = this.getPosByStr(element["pos"])
                    vct = new cc.Vec2(vct.x*sizeScale,vct.y*sizeScale)
                    this.gridPos.push()
                });
                this.loadTd(callBack)
           
           }
        }) 
        
    }
    public loadTd(callBack){
        cc.loader.loadRes("config/tdCfg",(err,res)=>{
            if(err){
                 console.log("加载配置失败！！")
                 console.log(err.message)
            }else{ 
                 let tds = res["tds"]
                 tds.forEach(element => { 
                     let tdd = new TDData(element)
                     this.tdDatas[tdd.id] = tdd
                 });
                 callBack()
            
            }
         }) 
    }
    public getPosByStr(str:string){
        let arr:string[] = str.split(',');
        return new cc.Vec2(Number(arr[0]),Number(arr[1]));
    }
   
    
}
