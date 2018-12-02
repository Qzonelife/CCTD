import UIManager from "../Manager/UIManager";
import GameController from "../GameController";
import WindowsManager from "../WindowsManager";
import RoleData from "../RoleData";
import Dispatcher from "../Util/Dispatcher";
import Cmd from "../Define/Cmd";

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
export default class MainSceneUI{
    constructor(){
        cc.loader.loadRes("prefabs/ui/mainSceneUI",(err,res)=>{
            if(err){
                console.log("ui加载失败")
                console.log(err.message)
            }else{
                this.initUI(res)
            }

        })
    }
    private uiNode:cc.Node
    private txtGold:cc.Label
    private txtGem:cc.Label
    private txtProbar:cc.Label
    private probarExp:cc.ProgressBar

    private txtRound:cc.Label
    //ui初始化
    private initUI(res:cc.Prefab){
        this.uiNode = cc.instantiate(res)
        this.uiNode.parent = UIManager.getInstance().windowLayer
        let btnGold = this.uiNode.getChildByName("btnGold").getComponent(cc.Button)
        btnGold.node.on("click",this.onClickGlod,this)
        let btnGem = this.uiNode.getChildByName("btnGem").getComponent(cc.Button)
        btnGem.node.on("click",this.onClickGem,this)
        let btnHead = this.uiNode.getChildByName("btnHead").getComponent(cc.Button)
        btnHead.node.on("click",this.onClickHead,this)
        let btnShop = this.uiNode.getChildByName("btnShop").getComponent(cc.Button)
        btnShop.node.on("click",this.onClickShop,this)
        let btnPurchaseTd = this.uiNode.getChildByName("btnPurchaseTd").getComponent(cc.Button)
        btnPurchaseTd.node.on("click",this.onClickPurchase,this)
        let btnCombine = this.uiNode.getChildByName("btnCombine").getComponent(cc.Button)
        btnCombine.node.on("click",this.onClickCombine,this)
        this.probarExp =  this.uiNode.getChildByName("expProgress").getComponent(cc.ProgressBar)

        this.txtGold = btnGold.node.getChildByName("value").getComponent(cc.Label)
        this.txtGem = btnGem.node.getChildByName("value").getComponent(cc.Label)
        this.txtProbar = this.probarExp.node.getChildByName("value").getComponent(cc.Label)
        this.txtRound = this.uiNode.getChildByName("roundLevel").getComponent(cc.Label)
        this.update()
        Dispatcher.addListener(Cmd.ROLE_GOLD_CHANGE,this.updateGold,this)
        Dispatcher.addListener(Cmd.ROLE_GEM_CHANGE,this.updateGem,this)
        Dispatcher.addListener(Cmd.ROLE_EXP_CHANGE,this.updateExp,this) 
        Dispatcher.addListener(Cmd.ROLE_MAX_TD_CHANGE,this.updateMaxTd,this)
    }
    private updateGold(val){
        this.txtGold.string = RoleData.roleGold.toString()
    }
    
    private updateGem(val){
        this.txtGem.string = RoleData.roleGem.toString()
    }
    
    private updateExp(val){
        this.txtProbar.string = RoleData.roleExp.toString()
        this.probarExp.progress = RoleData.roleExp/RoleData.getCurMaxExp()
    }
    
    private updateMaxTd(val){
        
        this.txtRound.string = "回合等级：" + RoleData.roleCurMaxLevelTd
    }
    public update(){
        this.txtGold.string = RoleData.roleGold.toString()
        this.txtGem.string = RoleData.roleGem.toString()
        this.txtProbar.string = RoleData.roleExp.toString()
        this.probarExp.progress = RoleData.roleExp/RoleData.getCurMaxExp()
        this.txtRound.string = "回合等级：" + RoleData.roleCurMaxLevelTd
    }
    private onClickGlod(){
        console.log("点击了金币")
        WindowsManager.getInstance().openWindow("prefabs/ui/baseWin")
    }
    private onClickGem(){
        console.log("点击了宝石")
        WindowsManager.getInstance().openWindow("prefabs/ui/TestPanel1")
    }
    private onClickHead(){
        console.log("点击了头像")
        
        WindowsManager.getInstance().openWindow("prefabs/ui/TestPanel2")
    }
    private onClickShop(){
        console.log("点击了商店")
    }
    private onClickPurchase(){
        GameController.getInstance().createInEmptyPos(1)
        console.log("点击了购买防御塔")
    }
    private onClickCombine(){
        GameController.getInstance().combineOneKey()
        console.log("点击了合成")
    }
}
