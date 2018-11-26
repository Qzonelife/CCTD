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

    public static roleGold:number = 0  //角色金币 
    public static roleExp:number = 0 //角色经验
    public static roleGem:number = 0 //角色宝石
    
    public static roleCurMaxLevelTd:string //角色当前等级最高级的防御塔
    // update (dt) {}
    public static init(){
        let data = cc.sys.localStorage.getItem("roleData")
        if(data==null){
            console.log("roleData is null")
            this.save()
        }else{
            this.roleGold = data["roleGold"]
        }
    }

    public static save(){
        let rd = new Object()
        rd["roleGold"] = 100
        console.log(rd)
        console.log(JSON.stringify(rd))
        console.log()
        cc.sys.localStorage.setItem("roleData",JSON.stringify(JSON.stringify(rd)))
    }
}
