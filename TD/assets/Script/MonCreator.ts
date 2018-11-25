import MonUnit from "./MonUnit";
import UnitPool from "./UnitPool";
import UIManager from "./Manager/UIManager";
import ConfigManager from "./Manager/ConfigManager";
import TDUnit from "./TDUnit";
import RoundData from "./RoundData";

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
     public curRound:RoundData;
     public curMonArr:string[]; //怪物列表
     public curWaveId:number; //当前波次
     public curMonId:number;  //当前波次准备出的怪物 
     public waveIntervalId:number = -1 //波次开始的计时器标记
     public checkMonIntervalId:number = - 1 //检查怪物是否全部死亡的计时器
     public isRoundChange = false //是否回合发生变化
     private monCreateTime = 1000
     //设置回合的信息，会按照这个逻辑进行出怪
     public setRound(round:RoundData,isRoundChange = true){
        this.curRound = round
        this.curWaveId = 0
        this.isRoundChange = isRoundChange
     }
 
     //开始一波怪物的创建
     public startWave(){
        this.clearAllInterval()
        this.curMonArr = this.curRound.waveLs[this.curWaveId]
        this.curMonId = 0
        this.waveIntervalId = setInterval(this.waveAction.bind(this),this.monCreateTime)
     }
     //执行一次怪物创建操作或者检查
     public waveAction(){ 
        if(this.curMonId>=this.curMonArr.length){ //如果当前波束的怪物已经结束
           
            this.checkAndStartNextWave()
        }else{
            this.creatorMonster(Number(this.curMonArr[this.curMonId]))
            this.curMonId++
        }
     }
     //检查下一波的开始，停止创建怪物
     public checkAndStartNextWave(){
        this.clearAllInterval()
        this.checkMonIntervalId = setInterval(this.checkMon.bind(this),this.monCreateTime)
     }
     //检查怪物是否全部死亡
     public checkMon(){
        if(this.monLs.length<=0){ //怪物全部死亡了，开启下一波的怪物创建
            this.clearAllInterval()
            setTimeout(this.startNextWave.bind(this),3000)
        }else{ //在这里检查怪物是否全部死亡，移除列表外
            let deathLs:MonUnit[] = new Array<MonUnit>()
            for(var i=0;i<this.monLs.length;i++){
                //分配到目标就break
                if(!this.monLs[i].isAlive){ //如果怪物池中的怪物死亡就移除
                    deathLs.push(this.monLs[i])
                }
            }
            for(var i=0;i<deathLs.length;i++){
               this.monLs.splice(this.monLs.indexOf(deathLs[i]),1)
            }

        }
     }
     private startNextWave(){
         //怪物等级发生变化了，下一波的怪物相应也会有所改变
         if(this.isRoundChange){
            this.curWaveId = 0
            this.curMonId = 0
            this.isRoundChange = false
         }else{
            this.curWaveId++
            if(this.curWaveId>=this.curRound.waveLs.length){
               this.curWaveId = 0
            }
         }
       
         this.startWave()
     }

     //清楚当前所有的计时器
     public clearAllInterval(){
        if(this.waveIntervalId!=-1){
            clearInterval(this.waveIntervalId)
            this.waveIntervalId = -1
        }
        if(this.checkMonIntervalId!=-1){
            clearInterval(this.checkMonIntervalId)
            this.checkMonIntervalId
        }
     }
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
         
         for(var i=0;i<this.monLs.length;i++){
             //分配到目标就break
             if(!this.monLs[i].isAlive){ //如果怪物池中的怪物死亡就移除
                 continue
             }
             if(tdUnit.checkSetTarget(this.monLs[i])){
                
                 console.log("target set successful")
                break
            }
         }
 
 

     }

}
