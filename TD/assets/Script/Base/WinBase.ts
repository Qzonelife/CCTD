import WindowsManager from "../WindowsManager";

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
export default class WinBase extends cc.Component {

    protected winName:string

    public  init(){
        this.winName = "WinBase"
    }
    start(){
        this.initUI()
        //将关闭按钮默认初始化
        let closeBtn:cc.Button = this.node.getChildByName("close").getComponent(cc.Button)
        if(closeBtn!=null){
            closeBtn.node.on("click",this.onClose,this)
        }
    }
    public initUI(){

    }

    private onClose(){
        WindowsManager.getInstance().closeWindow(this)
    }

     public open(){
         this.node.active =true
         this.node.setScale(0,0)
        let action = cc.scaleTo(0.2,1,1)
         action.easing(cc.easeCircleActionOut())
         this.node.runAction(action)
     }
     public close(){ 
         let action = cc.scaleTo(0.2,0,0)
         action.easing(cc.easeCircleActionOut())
         let seq = cc.sequence(action,cc.callFunc(()=>{
             this.node.active = false
         }))
         this.node.runAction(seq)
     }
}
