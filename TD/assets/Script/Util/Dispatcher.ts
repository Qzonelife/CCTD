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
export default class Dispatcher   {
    
    private static eventLs = {}
    public static addListener(name:string,callBack:Function,context:any){
        let observers:Observer[] = this.eventLs[name]
        if(!observers){
            this.eventLs[name] = []
        }
        this.eventLs[name].push(new Observer(callBack,context))
    }

    public static remove(name:string,callBack:Function,context:any){
        let observers:Observer[] = this.eventLs[name]
        if(!observers){
            return
        }
        let len = observers.length
        for(var i = 0;i<observers.length;i++){
            if(observers[i].compar(context)){
                observers.splice(i,1)
                break
            }
        }
        if(observers.length<=0){
            delete this.eventLs[name]
        }
    }
    //派发事件
    public static dispatch(name:string,...args:any[]){
        let observers:Observer[] = this.eventLs[name]
        if(!observers) {
            return
        }
        for(var i=0;i<observers.length;i++){
            observers[i].notify(name,...args)
        }
    }

}
class Observer {
    /** 回调函数 */
    private callback: Function = null;
    /** 上下文 */
    private context: any = null;

    constructor(callback: Function, context: any) {
        let self = this;
        self.callback = callback;
        self.context = context;
    }

    /**
     * 发送通知
     * @param args 不定参数
     */
    notify(...args: any[]): void {
        let self = this;
        self.callback.call(self.context, ...args);
    }

    /**
     * 上下文比较
     * @param context 上下文
     */
    compar(context: any): boolean {
        return context == this.context;
    }
} 