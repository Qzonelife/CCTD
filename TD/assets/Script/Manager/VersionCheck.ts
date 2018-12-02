import RoleData from "../RoleData";
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
export default class VersionCheck extends cc.Component {

    private progressCb:Function
    private resFinishCb:Function

    
    public initVerCheck(pgCb,resCb,isDebug = true){
        this.progressCb = pgCb
        this.resFinishCb = resCb
        if(isDebug){
            this.resFinishCb()
        }else{
            this.startCheck()
        }
       
    }

    startCheck() {
        console.log("onload")
        let fileManager = wx.getFileSystemManager(), self = this, res_ver = RoleData.getItem("res_ver");
        wx.downloadFile({
            url: 'http://192.168.10.102/res_ver.txt',
            success (res) {

                fileManager.readFile({
                    filePath : res.tempFilePath,
                    encoding : "utf8",
                    success : function(res){// 读取成功
                        console.log("当前版本号是："+res_ver)
                         console.log(res.data)
                        if(res_ver != res.data){
                            console.log("文件版本存在差异，需要重新下载更新")
                            res_ver = res.data;
                            self.downloadRes(res_ver);
                        }else{
                            console.log("文件版本无差异，可以直接进行游戏")  
                            self.resFinish()                          
                        }

                    },
                })
            },
            fail : function(res){// 下载失败

                console.log("res_ver 下载失败")
            },
        });
    }

    downloadRes(res_ver) {
        let self = this, fileManager = wx.getFileSystemManager(),
            downloadTask = wx.downloadFile({
            url: 'http://192.168.10.102/res.zip', //仅为示例，并非真实的资源
            success (res) {
                let filePath = res.tempFilePath; // 下载路径
                
                fileManager.unzip({
                    zipFilePath: filePath,   // 资源下载后路径
                    targetPath: wx.env.USER_DATA_PATH,  // 解压资源存放路径

                    success : function(res){// 解压成功
                        console.log("解压成功")
                        RoleData.saveItem("res_ver", res_ver);

                        console.log("版本信息保存成功"+RoleData.getItem("res_ver"))
                        self.resFinish()     
                      
                    },

                    fail : function(res){// 解压失败
                        console.log("解压失败")
                    },

                })

            },
            fail : function(res){// 下载失败
                console.log("下载失败")
            },
        })

        downloadTask.onProgressUpdate((res) => {
            // self.progressTip.string = res.progress + "%";
            // self.progressBar.progress = res.progress / 100;

            console.log('下载进度', res.progress)
            console.log('已经下载的数据长度', res.totalBytesWritten)
            console.log('预期需要下载的数据总长度', res.totalBytesExpectedToWrite)
        })
    }

    resFinish(){
        console.log("资源初始化成功")
        this.resFinishCb()
      
    }
}
