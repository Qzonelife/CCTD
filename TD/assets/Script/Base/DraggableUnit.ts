import BaseUnit from "./BaseUnit";

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
export default class DraggableUnit extends BaseUnit implements IDraggable {

   
    isDragging = false
    isCanDrag = true

    @property(cc.Node)
    dragLayer:cc.Node = null//拖拽时候物体所在的层级

    dragObserver:cc.Node
    //开启拖拽事件
    enableDragEvent(target:cc.Node){
        this.dragObserver = target
        target.on(cc.Node.EventType.TOUCH_START,this.onStartDrag,this) 
    }
    
    onMouseOut(){
        this.onEndDrag()
    }
    onMouseUp(){
        this.onEndDrag()
    }
    onDragging(evt:cc.Event.EventTouch){
       // console.log("dragging")
    }
    onStartDrag(){
        if(!this.isCanDrag)
            return
        if(this.dragLayer!=null){
            this.node.parent = this.dragLayer
        }
        this.isDragging = true
        this.dragObserver.on(cc.Node.EventType.TOUCH_MOVE,this.onDragging,this)
        this.dragObserver.on(cc.Node.EventType.TOUCH_END,this.onMouseUp,this)
        this.dragObserver.on(cc.Node.EventType.TOUCH_CANCEL,this.onMouseOut,this)
        this.startDragCallBack()
    }

    onEndDrag(){
        this.isDragging = false
        this.node.parent = this.parentNode
        this.dragObserver.off(cc.Node.EventType.TOUCH_MOVE,this.onDragging,this)
        this.dragObserver.off(cc.Node.EventType.TOUCH_END,this.onMouseUp,this)
        this.dragObserver.off(cc.Node.EventType.TOUCH_CANCEL,this.onMouseOut,this)
        this.endDragCallBack()
    }
    startDragCallBack(){

    }
    endDragCallBack(){

    }

    // update (dt) {}
}
