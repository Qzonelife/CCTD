import DraggableUnit from "./Base/DraggableUnit";
import TDData from "./TDData";
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
export default class TDUnit extends DraggableUnit {
    
    private tdData:TDData

    public setTdData(tdd:TDData){
        this.tdData = tdd
    }

   
    start(){
        super.start()
        this.enableDragEvent(this.spriteNode.node)
    }
    onDragging(evt:cc.Event.EventMouse){
        this.node.position = UIManager.getInstance().adjustPosByScreen(evt.getLocation())
    }
}
