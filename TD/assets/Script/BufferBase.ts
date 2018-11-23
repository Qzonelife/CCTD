import BufferData from "./BufferData";

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
export default class BufferBase  {

     /**
      * buffer分几类，用一个bufferbase来处理所有的buffer效果，tdunit跟monunit都可以使用buff
      * 1:改变攻击速度的buffer， 改变的总效果用一个变量被外部获取
      * 2：改变移动速度的buff,   改变的总效果用一个变量被外部获取
      * 3:持续伤害类型的buff,每隔1s触发一次
      */
    private bufferList:BufferData[] = new Array<BufferData>() //buffer的数组
    private bufferChangeSpeed:number = 0
    private bufferChangeAttackSpeed:number = 0
    private bufferTime:{[key:number]:number} = {} //buffer的剩余时间
 
    private funcInterval:{[key:number]:number} = {} //计时器的计时key
    private bufInterval:{[key:number]:number} = {} //buffer的更新计时器
    //获得最终buffer改变的速度
    public getBSpeed(){
        return this.bufferChangeSpeed
        
    }
    //获得最终buffer改变的攻击速度
    public getBATKSpeed(){
        return this.bufferChangeAttackSpeed
    }
    //添加一个buff
    public addBuff(buf:BufferData){
        console.log("添加buf："+buf.id)
        let mBuf = this.getBuffById(buf.id)
        if(mBuf!=null){ //先判断是否已经有这个同类的buff了，如果有，则判断等级
            if(mBuf.bufferLevel > buf.bufferLevel){ //新的buff等级较低，直接返回
                return
            }
            if(mBuf.bufferLevel == buf.bufferLevel){
                console.log("buffer被刷新了")
                clearInterval(this.funcInterval[buf.id])
                this.funcInterval[buf.id] = setInterval(function(){
                    this.removeBuff(buf)
                }.bind(this),buf.duration*1000)
                return
            }
            this.removeBuff(mBuf) //先移除这个buf，在重新添加
        }
        console.log("这个buff的类型是"+buf.bufferType)
        switch(buf.bufferType){
            case 1:
                this.bufferChangeAttackSpeed += buf.param
                break;
            case 2:
                this.bufferChangeSpeed+=buf.param
                break;
            case 3: //持续伤害类型的buff
                this.bufInterval[buf.id] = setInterval(function(){this.buffUpdateInterval(buf)}.bind(this),1000)
                break;
            default: 
                console.log("添加了一个未知类型的buff:"+buf.id)
                break;
        }
 
        this.bufferList.push(buf)
        this.funcInterval[buf.id] = setInterval(function(){
           
            this.removeBuff(buf)
        }.bind(this),buf.duration*1000)
    }

    //持续类型的buff的更新
    public buffUpdateInterval(buf:BufferData){
        console.log("update buffer"+buf.id)
    }

    //移除一个buff,将对应的计时器移除
    public removeBuff(buf:BufferData){
        if(this.funcInterval[buf.id]!=null){
            clearInterval(this.funcInterval[buf.id])
            this.funcInterval[buf.id] = null
        }
        switch(buf.bufferType){
            case 1:
                this.bufferChangeAttackSpeed-=buf.param
                break;
            case 2:
                this.bufferChangeSpeed -= buf.param
                break;
            case 3:
                clearInterval(this.bufInterval[buf.id])
                this.bufInterval[buf.id] = null
                break;
            default:
                
                break;
        }
        console.log("移除buff："+buf.id)
       this.bufferList.splice( this.bufferList.indexOf(buf),1)

    }
    //清除所有的buff
    public clearBuff(){
       for(let k in this.funcInterval){
           clearInterval(this.funcInterval[k])
       }
       this.funcInterval = {}
       for(let k in this.bufInterval){
            clearInterval(this.bufInterval[k])
       }
       this.bufInterval = {}
       this.bufferChangeAttackSpeed = 0
       this.bufferChangeSpeed = 0
    }
    //判断是否有这个buff
    public checkHasBuff(id:number):boolean{
        for(var i=0;i<this.bufferList.length;i++){
            if(this.bufferList[id].id == id){
                return true
            }
        }
        return false
    }
    public getBuffById(id:number):BufferData{
        console.log("检查buff:"+id+"    yuanchag："+this.bufferList.length)
        for(var i=0;i<this.bufferList.length;i++){
            if(this.bufferList[i].id == id){
                return this.bufferList[i]
            }
        }
        return null
    }
}