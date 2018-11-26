import UnitPool from "./UnitPool";
import TDUnit from "./TDUnit";
import UIManager from "./Manager/UIManager";
import ConfigManager from "./Manager/ConfigManager";
import TDData from "./TDData";
import MonCreator from "./MonCreator";
import MonUnit from "./MonUnit";
import BufferManager from "./BufferManager";
import WinBase from "./Base/WinBase";

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
export default class WindowsManager {

   private static instance:WindowsManager

   static getInstance():WindowsManager{
        if(!this.instance)
            this.instance = new WindowsManager()
        return this.instance
   }
   
   private winPool:{[key:string]:WinBase} = {}
   private curOpenWindow:WinBase


   public openWindow(winName){
       
        if(this.curOpenWindow!=null){
            if(this.curOpenWindow == this.winPool[winName]){
                return
            }
            this.curOpenWindow.close()
        }
        if(this.winPool[winName]!=null){
            this.curOpenWindow = this.winPool[winName]
            this.curOpenWindow.open()
        }else{
            cc.loader.loadRes(winName,function(err,res){
                let wd:cc.Node = cc.instantiate(res)
                wd.parent = UIManager.getInstance().windowLayer
                let wb = wd.getComponent(WinBase)
                this.winPool[winName] = wb
                this.curOpenWindow = wb
                wb.open()
            }.bind(this))
        }
   }
   public closeWindow(wb:WinBase){
       if(wb == this.curOpenWindow){
           wb.close()
           this.curOpenWindow = null
       }
   }

   


}
