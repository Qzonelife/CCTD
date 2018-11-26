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
export default class DGTest extends cc.Component {

    

    start () {
        cc.loader.loadResDir("dragonBone/mon/mushroom",function(err,assets){

           
 


            // console.log("load finish~~~~~~~~")
            // let dgDisplay:dragonBones.ArmatureDisplay = this.node.addComponent(dragonBones.ArmatureDisplay)
            // for(var i in assets){
            //     console.log(assets[i])
            //     if(assets[i] instanceof dragonBones.DragonBonesAsset){
            //         console.log("is hehe")
            //         dgDisplay.dragonAsset  = assets[i]
               
            //     }
            //     if(assets[i] instanceof dragonBones.DragonBonesAtlasAsset){
            //         console.log("b  hehe")
            //         dgDisplay.dragonAtlasAsset = assets[i]
            //     }
              
                
            // }
            // dgDisplay.armatureName = "animation"
            // dgDisplay.playAnimation("ffd",0)
        }.bind(this))
      
    }

     
}
