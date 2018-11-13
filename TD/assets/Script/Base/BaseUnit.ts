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
export default class BaseUnit extends cc.Component {

    
    @property(cc.Node)
    parentNode:cc.Node //对象父节点

    protected spriteNode:cc.Sprite //动画对象

    public setParent(parent:cc.Node){
        this.parentNode = parent
        this.node.parent = this.parentNode
    }
    public setPos(pos:cc.Vec2){
        this.node.position = pos
 
    }
    public setActive(isActive:boolean){
        this.node.active = isActive
    }
    public init(){
        this.spriteNode = this.node.getChildByName("body").getComponent(cc.Sprite)
    }
    start(){
        //this.spriteNode = this.node.getChildByName("body").getComponent(cc.Sprite)
        
    }

    public distanceTo(unit:BaseUnit):number{
        return this.disToPos(unit.node.position)
    }
    public disToPos(pos:cc.Vec2):number{
        return cc.pDistance(this.node.position,pos)
    }
    // update (dt) {}
}
