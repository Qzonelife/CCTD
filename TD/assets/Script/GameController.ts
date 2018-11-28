import UnitPool from "./UnitPool";
import TDUnit from "./TDUnit";
import UIManager from "./Manager/UIManager";
import ConfigManager from "./Manager/ConfigManager";
import TDData from "./TDData";
import MonCreator from "./MonCreator";
import MonUnit from "./MonUnit";
import BufferManager from "./BufferManager";
import RoleData from "./RoleData";

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
   private monCreator:MonCreator
   public init(){
       //this.initPlatform()
       this.monCreator = new MonCreator()
 
    }

//    //初始化平台
//    public initPlatform(){
//        let cNodes:cc.Node[] = new Array<cc.Node>()
//        let cfg:cc.Vec2[] = ConfigManager.getInstance().gridPos
//        cfg.forEach(element => {
//            let node:cc.Node = new cc.Node
//            cNodes.push(node)
//            node.parent = UIManager.getInstance().platformLayer
//            node.setPosition(element)
          
//        });
//        cc.loader.loadRes("texture/Map/platform",cc.SpriteFrame,(err,res:cc.SpriteFrame)=>{
//             cNodes.forEach(element => {
             
//                 let sp:cc.Sprite = element.addComponent(cc.Sprite)
//                 sp.spriteFrame = res
                
//                 element.setAnchorPoint(new cc.Vec2(0.5,0.8))
//                 element.setContentSize(cc.size(100,100))
//             });
//        })
      
//    }
   public isGameLogicStart:boolean
   public startGameLogic(){
    cc.systemEvent.on(cc.SystemEvent.EventType.KEY_DOWN, this.onKeyDown, this);
    this.isGameLogicStart = true
    this.monCreator.setRound(ConfigManager.getInstance().getRoundById(1),false)
    this.monCreator.startWave()
   // setInterval(this.onKeyDown.bind(this),2000)
   }

   public onKeyDown(){  
    // BufferManager.addBuff(1)
    //   let createId = Math.floor(Math.random()*16)
    //   this.createTDUnitByPos(createId,1)
     this.createInEmptyPos()
    // this.monCreator.creatorMonster()
   }
   public unitDict:{[key:number]:TDUnit} = {}
   public activeTd:TDUnit[] = new Array<TDUnit>() //用于遍历的防御塔数组
   /**
    * createInEmptyPos ,在一个空位置创造一个
    */
   public createInEmptyPos(tdType=1) {
        let len = ConfigManager.getInstance().gridPos.length
        let eptArr:number[] = new Array<number>()
        for(var i=0;i<len;i++){
            if(this.unitDict[i]==null){
                eptArr.push(i)
            }
        }
        if(eptArr.length==0){
            console.log("位置满了")
            return
        }
        let createId = Math.floor(Math.random()*eptArr.length)
        this.createTDUnitByPos(eptArr[createId],tdType)
   }

   public createTDUnitByPos(posId,tdType){  
       if(ConfigManager.getInstance().gridPos.length<posId)
        return
        if(this.unitDict[posId]!=null){
            console.log("对应位置已经存在了")
            return
        }

        UnitPool.getInstance().getTdByType(tdType,(td:TDUnit)=>{

            td.init()
            td.setParent(UIManager.getInstance().tdLayer)
            td.dragLayer = UIManager.getInstance().dragLayer
            td.setPosById(posId)
            this.unitDict[posId] = td
            this.activeTd.push(td)  //顺便将这个对象加入列表
            // let tdId = Math.floor(Math.random()*3)+1
            // let tdd:TDData = ConfigManager.getInstance().getTdData(tdId)
            // td.setTdData(tdd)
            
        })
        // UnitPool.getInstance().getTdByType(tdType,(td:TDUnit)=>{

        //     td.setParent(UIManager.getInstance().tdLayer)
        //     td.dragLayer = UIManager.getInstance().dragLayer
        //     td.setPos(new cc.Vec2(50,0))
            
        //     console.log("prepare to drag")
        // })
   }
   //判断这个对象结束拖拽的时候，应该执行的事件
   public checkUnitEndAction(td:TDUnit){
       let arr:cc.Vec2[] =  ConfigManager.getInstance().gridPos
       let resetPos:boolean = false
       for(let i =0;i<arr.length;i++){
           if(td.curPosId == i){
             
             continue
           } 
           if(td.disToPos(arr[i])<50){
               //判断可以移动到这个位置，做对应的操作
               this.putTdUnitHere(td,i)
               resetPos = true
               break;
           }
       }
       if(!resetPos){
         td.backToOrigin()
       }
   }

   //将防御塔放到这个位置
   public putTdUnitHere(unit:TDUnit,posId:number){
        //首先判断该位置是否已经存在防御塔了
        if(this.unitDict[posId]!=null){
            let tarTd:TDUnit = this.unitDict[posId]
            if(!this.combineTwoTd(unit,tarTd)){
                this.exchangeUnit(unit,tarTd) 
            }
 
        }else{
            let orgPosId:number = unit.curPosId
            unit.setPosById(posId)
            this.unitDict[orgPosId] = null
            this.unitDict[posId] = unit
        }
   }
   public removeTd(unit:TDUnit){
        this.unitDict[unit.curPosId] = null
        //从列表中移除
        for(var i=0;this.activeTd.length;i++){
            if(unit == this.activeTd[i]){
                this.activeTd.splice(i,1)
                break;
            }
        }
        unit.remove()
   }
   //合成两个防御塔
   public combineTwoTd(tda:TDUnit,tdb:TDUnit){
        if(tda.tdData.level == tdb.tdData.level){ //首先是等级相同
            if(ConfigManager.getInstance().getTdByLevel(tda.tdData.level+1)!=null){

                this.removeTd(tda)
                tdb.doLevelUpAction()
                return true
            }else{ //已经是最高级了，无法合成
                return false
            }
        }
        return false
   }

   //进行一键合成操作
   public combineOneKey(){
       let ignore:{[key:number]:boolean} = {}
       let removeId:Array<TDUnit> = new Array<TDUnit>()
       let levelUpId:Array<TDUnit> = new Array<TDUnit>()
  
        for(var i=0;i<this.activeTd.length;i++){
            if(ignore[i]){
                continue
            } 
            let ta = this.activeTd[i]
            for(var j=i+1;j<this.activeTd.length;j++){
                let tb = this.activeTd[j]
                if(ta.tdData.level == tb.tdData.level){
                    ignore[i] = true
                    ignore[j] = true
                    removeId.push(this.activeTd[i])
                    levelUpId.push(this.activeTd[j])
                    break;
                }
            }
        }

        for(var i=0;i<removeId.length;i++){
            this.combineTwoTd(removeId[i],levelUpId[i])
        } 

   }
   public exchangeUnit(unit1:TDUnit,unit2:TDUnit){
       if(unit1!=null && unit2!=null && unit1!=unit2){
            let p1:number = unit1.curPosId
            let p2:number = unit2.curPosId
            this.unitDict[p1] = unit2
            this.unitDict[p2] = unit1
            unit1.setPosById(p2)
            unit2.setPosById(p1)
       }else{
           console.log("换位失败")
       }
       
       this.updateCurrentTdLs()
   }


   public update(){
        if(!this.isGameLogicStart){
            return
        } 
        for(var i=0;i<this.activeTd.length;i++){
            this.monCreator.assignTarget(this.activeTd[i]) //给每个td分配一个攻击对象
        }

   }

   //通过角色本地数据初始化
   public initByRoleData(){
       for(var i in RoleData.tdArr){
            this.createTDUnitByPos(RoleData.tdArr[i][0],RoleData.tdArr[i][1])
       }
       
   }

   public updateCurrentTdLs(){
        let arr:Array<[number,number]> = new Array<[number,number]>()
        for(var i in this.activeTd){
           arr.push([this.activeTd[i].curPosId,this.activeTd[i].tdData.id])
        } 
        RoleData.tdArr = arr
        RoleData.saveTdInfo()
   }
    //怪物被打死
   public monDie(monUnit:MonUnit){

   }
   //怪物逃跑了
   public monEscape(monUnit:MonUnit){
    
   }



}
