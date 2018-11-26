import ConfigManager from "./Manager/ConfigManager";
import UIManager from "./Manager/UIManager";
import GameController from "./GameController";
import MainSceneUI from "./UI/MainSceneUI";
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
export default class Main extends cc.Component {

 
 
    start () {
        RoleData.init()
        UIManager.getInstance().init()
        ConfigManager.getInstance().loadGrid(this.onConfigComplete)
    }

    onConfigComplete(){ 
        console.log("load config complete ~~~~~~~~~~~")
        GameController.getInstance().init()
        GameController.getInstance().startGameLogic()
        let uiMain = new MainSceneUI()
    }

     update (dt) {
         GameController.getInstance().update()
     }
}
