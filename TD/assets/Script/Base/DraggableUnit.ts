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
    orgParent:cc.Node = null //原本的层级

    @property(cc.Node)
    dragLayer:cc.Node = null//拖拽时候物体所在的层级

    dragObserver:cc.Node
    //开启拖拽事件
    enableDragEvent(target:cc.Node){
        this.dragObserver = target
        target.on(cc.Node.EventType.MOUSE_DOWN,this.onStartDrag,this)

    }
    
    onMouseOut(){
        this.onEndDrag()
    }
    onMouseUp(){
        this.onEndDrag()
    }
    onDragging(evt:cc.Event.EventMouse){
        console.log("dragging")
    }
    onStartDrag(){
        if(!this.isCanDrag)
            return
        this.isDragging = true
        this.dragObserver.on(cc.Node.EventType.MOUSE_MOVE,this.onDragging,this)
        this.dragObserver.on(cc.Node.EventType.MOUSE_UP,this.onMouseUp,this)
        this.dragObserver.on(cc.Node.EventType.MOUSE_LEAVE,this.onMouseOut,this)

    }

    onEndDrag(){
        this.isDragging = false
        this.dragObserver.off(cc.Node.EventType.MOUSE_MOVE,this.onDragging,this)
        this.dragObserver.off(cc.Node.EventType.MOUSE_UP,this.onMouseUp,this)
        this.dragObserver.off(cc.Node.EventType.MOUSE_LEAVE,this.onMouseOut,this)
        this.endDragCallBack()
    }

    endDragCallBack(){

    }

    // update (dt) {}
}
