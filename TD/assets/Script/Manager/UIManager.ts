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
export default class UIManager {
    private static instance:UIManager

    static getInstance():UIManager{
         if(!this.instance)
             this.instance = new UIManager()
         return this.instance
    }
    canvas:cc.Canvas
    tdLayer:cc.Node
    dragLayer:cc.Node
    windowLayer:cc.Node
    topLayer:cc.Node
    public init(){
        this.canvas = cc.find("Canvas").getComponent(cc.Canvas)
        this.tdLayer = cc.find("Canvas/sceneLayer/tdLayer")
        this.tdLayer = cc.find("Canvas/sceneLayer/dragLayer")
        this.tdLayer = cc.find("Canvas/windowLayer")
        this.tdLayer = cc.find("Canvas/topLayer")
        
    }

    public adjustPosByScreen(pos:cc.Vec2):cc.Vec2{
        return new cc.Vec2(pos.x-this.canvas.designResolution.width/2,pos.y - this.canvas.designResolution.height/2)
    }
}
