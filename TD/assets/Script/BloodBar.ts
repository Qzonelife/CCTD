import MonUnit from "./MonUnit";
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
export default class BloodBar extends cc.Component {
 
    private owner:MonUnit
    private bar:cc.ProgressBar 
    public setOwner(ow:MonUnit){

        this.owner = ow
        this.bar = this.getComponent(cc.ProgressBar)
        this.node.parent = UIManager.getInstance().bloodLayer 
     
       // console.log(this.node.parent)
    }
     update (dt) { 
         if(this.owner!=null && this.owner.isAlive){
 
             this.node.position = this.owner.node.position.add(cc.v2(0,80))
             
         }
     }
     
    private recordHideBlood = -1
    public setBloodVisible(isVisible:boolean){
        if(this.node.active == isVisible)
            return
        this.node.active = isVisible
    }
    public setBloodProgress(progress){
        this.bar.progress = progress
        // if(progress == 1){
        //     return
        // }
        if(this.recordHideBlood==-1){ //记录当前显示血条的时候，血量是多少
            this.setBloodVisible(true)
            this.recordHideBlood =  this.owner.curBlood
            this.scheduleOnce(this.hideBloodBar,1)
        }
    }

    public hideBloodBar(){
        console.log("隐藏咯")
        //记录了这么久，都还是没有变化，就隐藏血条吧
        if(this.owner.curBlood==this.recordHideBlood){
            this.setBloodVisible(false)
            this.recordHideBlood = -1
        }else{ //继续计时隐藏
            this.scheduleOnce(this.hideBloodBar,0.5)
            this.recordHideBlood = this.owner.curBlood
        }
       
       
    }
}
