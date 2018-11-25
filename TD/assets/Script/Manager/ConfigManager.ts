import TDData from "../TDData";
import MonData from "../MonData";
import BulletData from "../BulletData";
import BufferData from "../BufferData";
import RoundData from "../RoundData";

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
    public roadPoints:[number,cc.Vec2,string][] = new Array<[number,cc.Vec2,string]>() //路点标记的元组
    public tdDatas:{[key:number]:TDData} = {}
    public monDatas:{[key:number]:MonData} = {}
    public bulDatas:{[key:number]:BulletData} = {}
    public bufferDict:{[key:number]:BufferData} = {} //buffer列表，配置的buff可以通过 bufferid_level获得对应等级的buffer
    public roundDict:{[key:number]:RoundData} = {} //出怪的回合波次列表

    //通过buffer_id或者buffer获得一个bufferdata数据,默认获得1级别buff
    public getBufferData(id:string){
        if(id.indexOf("_")==-1){
            id = id+"_1"
        }
        return this.bufferDict[id]
    }
    //获得怪物路点
    public getRoadPoint(index:number):[number,cc.Vec2,string]{
 
        for(let i=0;i<this.roadPoints.length;i++){
            if(this.roadPoints[i][0] == index){
                return this.roadPoints[i]
            }
        }
        return null
    }
    //获得当前回合的数据
    public getRoundById(id){
        return this.roundDict[id]
    }
    public getTdData(tdId:number){
        return this.tdDatas[tdId]
    }
    public getTdByLevel(level:number):TDData{
        for(let k in this.tdDatas){
            if(this.tdDatas[k].level == level){
                return this.tdDatas[k]
            }
        }
        return null
    }
    public getBulData(bulId:number){
        return this.bulDatas[bulId]
    }
    public getMonData(monId:number){
        return this.monDatas[monId]
    }

    //加载网格配置
    public loadGrid(callBack){
        cc.loader.loadRes("config/unitGridCfg",(err,res)=>{
           if(err){
                console.log("加载配置失败！！地图网格配置")
                console.log(err.message)
           }else{
                let column = Number(res["column"])
                let sizeScale = Number(res["sizeScale"])
                let pos = res["pos"]
                pos.forEach(element => {
                    let vct:cc.Vec2 = this.getPosByStr(element["pos"])
                    vct = new cc.Vec2(vct.x*sizeScale,vct.y*sizeScale)
                    this.gridPos.push(vct) 
                });

                let roadPointNodes = res["roadPoints"]
                roadPointNodes.forEach(element => {
                    
                    let id = element["id"]
                    let vct:cc.Vec2 = this.getPosByStr(element["pos"])
                    let faceTo = element["faceTo"] 
                    this.roadPoints.push([id,vct,faceTo])
                });
                this.loadTd(callBack)
           
           }
        }) 
        
    }
    //加载防御塔配置
    public loadTd(callBack){
        cc.loader.loadRes("config/tdCfg",(err,res)=>{
            if(err){
                 console.log("加载配置失败！！防御塔配置")
                 console.log(err.message)
            }else{ 
                 let tds = res["tds"]
                 tds.forEach(element => { 
                     let tdd = new TDData(element)
                     this.tdDatas[tdd.id] = tdd
                 });
                 this.loadMon(callBack)
            
            }
         }) 
    }

    //读取怪物配置
    public loadMon(callback){
        cc.loader.loadRes("config/monCfg",(err,res)=>{
            if(err){
                 console.log("加载配置失败！！，怪物配置")
                 console.log(err.message)
            }else{ 

                //读取怪物的信息
                 let mons = res["mons"]
                 mons.forEach(element => { 
                     let mon = new MonData(element)
                     this.monDatas[mon.id] = mon
                 });

                 //读取出怪逻辑的信息
                 let rounds = res["rounds"]
                 rounds.forEach(element => {
                     let round = new RoundData(element)
                     this.roundDict[round.id] = round
                 });


                 this.loadBullet(callback)
                 
            }
         }) 
    }
    //读取子弹配置
    public loadBullet(callBack){
        cc.loader.loadRes("config/bulletCfg",(err,res)=>{
            if(err){
                 console.log("加载配置失败！！，子弹配置")
                 console.log(err.message)
            }else{ 
                 let bulRes = res["bullets"]
                 bulRes.forEach(element => { 
                     let bul = new BulletData(element)
                     this.bulDatas[bul.id] = bul 
                 });
                 this.loadBuffer(callBack)
            
            }
         }) 
    }

    public loadBuffer(callback){
        cc.loader.loadRes("config/bufferCfg",(err,res)=>{
            if(err){
                console.log("加载配置失败！！，buffer配置")
                console.log(err.message)
            }else{
                let buf = res["buffs"]
                buf.forEach(element => {
                    let levelsDetail = element["levels"]
                    levelsDetail.forEach(detail => {
                        let bfd = new BufferData(detail,element)
                        this.bufferDict[bfd.bufferDetailId] = bfd
                    });
                   
                });
                callback()
            }

        })
    }

    public getPosByStr(str:string){
        let arr:string[] = str.split(',');
        return new cc.Vec2(Number(arr[0]),Number(arr[1]));
    }
   
    
}
