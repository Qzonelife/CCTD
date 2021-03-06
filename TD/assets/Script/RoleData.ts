import Dispatcher from "./Util/Dispatcher";
import Cmd from "./Define/Cmd";

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
export default class RoleData {

    private static _roleGold:number = 0  //角色金币 
    private static _roleCurMaxLevelTd:number = 1 //角色当前等级最高级的防御塔 ，默认一级
    private static _roleExp:number = 0 //角色经验
    private static _roleGem:number = 0 //角色宝石


    public static tdArr:Array<[number,number]> = new Array<[number,number]>()
    public static get roleGold(){
        return this._roleGold
    }
    public static set roleGold(val){
        this._roleGold = val
        Dispatcher.dispatch(Cmd.ROLE_GOLD_CHANGE,val)
    }

    public static get roleExp(){
        return this._roleExp
    }
    public static set roleExp(val){
        this._roleExp = val
        Dispatcher.dispatch(Cmd.ROLE_EXP_CHANGE,val)
    }   

    public static get roleGem(){
        return this._roleGem
    }
    public static set roleGem(val){
        this._roleGem = val
        Dispatcher.dispatch(Cmd.ROLE_GEM_CHANGE,val)
    }   

    
    public static get roleCurMaxLevelTd(){
        return this._roleCurMaxLevelTd
    }
    public static set roleCurMaxLevelTd(val){
        this._roleCurMaxLevelTd = val
        Dispatcher.dispatch(Cmd.ROLE_MAX_TD_CHANGE)
    }

    ///获得当前升级需要的经验
    public static getCurMaxExp(){
        return 100
    }
    // update (dt) {}
    public static init(){
        cc.sys.localStorage.clear()
        let data = RoleData.getItem("roleData")
        if(data==null){ 
            this.save()
        }else{ 
            let json = JSON.parse(data)
            RoleData.roleGold = Number(json["roleGold"])
            RoleData.roleExp =  Number(json["roleExp"]) 
            RoleData.roleGem = Number(json["roleGem"])
            RoleData.roleCurMaxLevelTd = Number(json["roleCurMaxLevelTd"])

        } 
        let tdd = RoleData.getItem("tdData")
        if(tdd==null){
            this.saveTdInfo()
        }else{
            let json = JSON.parse(tdd)
            let tdJson = json["tdArr"]
 
            for(var i in tdJson){
                this.tdArr.push([Number(i),tdJson[i]])
            }  
        }
    }

    public static save(){     
        let rd = new Object()
        rd["roleGold"] = RoleData.roleGold
        rd["roleExp"] = RoleData.roleExp
        rd["roleGem"] = RoleData.roleGem
        rd["roleCurMaxLevelTd"] =  RoleData.roleCurMaxLevelTd 
        RoleData.saveItem("roleData",JSON.stringify(rd))
    }
    public static saveTdInfo(){
        let tdd = new Object()
        let tdJson = new Object()
        for(var i in RoleData.tdArr){
            let tp = RoleData.tdArr[i]
            tdJson[tp[0]] = tp[1]
            console.log("save!!!!!!!!!")
        }
        tdd["tdArr"] = tdJson
        RoleData.saveItem("tdData",JSON.stringify(tdd))
    }

    public static saveItem(key,val){
        if(CC_WECHATGAME){
            wx.setStorageSync(key,val)
        }else{
            cc.sys.localStorage.setItem(key,val)
        }
       
    }
    public static getItem(key){
        if(CC_WECHATGAME){
            return wx.getStorageSync(key)
        }else{
            return cc.sys.localStorage.getItem(key)
        }
        
    }
}
