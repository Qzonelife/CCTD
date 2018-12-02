
cc.Class({
    extends: cc.Component,

    properties: {
        progressBar: {
            default: null,
            type: cc.ProgressBar
        },
        progressTip: {
            default: null,
            type: cc.Label
        },
    },


    onLoad: function () {

        var cvs = this.node.getComponent(cc.Canvas);
        cvs.fitHeight = false;
        cvs.fitWidth = true;

        let fileManager = wx.getFileSystemManager(), self = this, res_ver = WXGlobal.getLocalStorage(code.storage_key_res_version);
        wx.downloadFile({
            url: 'https://friendres.gzyike.cn/res_ver.txt',
            success (res) {

                fileManager.readFile({
                    filePath : res.tempFilePath,
                    encoding : "utf8",
                    success : function(res){// 读取成功

                        if(res_ver != res.data){
                            res_ver = res.data;
                            self.downloadRes(res_ver);
                        }else{
                            self.login();
                        }

                    },
                })
            },
            fail : function(res){// 下载失败

                console.log("res_ver 下载失败")
            },
        });
    },

    downloadRes: function (res_ver) {
        let self = this, fileManager = wx.getFileSystemManager(),
            downloadTask = wx.downloadFile({
            url: 'https://friendres.gzyike.cn/res.zip', //仅为示例，并非真实的资源
            success (res) {
                let filePath = res.tempFilePath; // 下载路径

                fileManager.unzip({
                    zipFilePath: filePath,   // 资源下载后路径
                    targetPath: wx.env.USER_DATA_PATH,  // 解压资源存放路径

                    success : function(res){// 解压成功
                        console.log("解压成功")
                        WXGlobal.setLocalStroage(code.storage_key_res_version, res_ver);
                        self.login();
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
            self.progressTip.string = res.progress + "%";
            self.progressBar.progress = res.progress / 100;

            console.log('下载进度', res.progress)
            console.log('已经下载的数据长度', res.totalBytesWritten)
            console.log('预期需要下载的数据总长度', res.totalBytesExpectedToWrite)
        })
    },

    login: function () {

        let self = this, openid = WXGlobal.getLocalStorage(code.storage_key_openid);
        self.progressTip.string = "100%", self.progressBar.progress = 1;
        if(null == openid || openid == ""){
            let canvas = window.canvas, canvas_width = canvas.width, canvas_height = canvas.height;
            let button = wx.createUserInfoButton({
                type: 'text',
                text: '开始游戏',
                style: {
                    left: 100 * (canvas_width / 750),
                    top: 400 * (canvas_height / 1334),
                    width: 200,
                    height: 40,
                    lineHeight: 40,
                    backgroundColor: '#ff0000',
                    color: '#ffffff',
                    textAlign: 'center',
                    fontSize: 16,
                    borderRadius: 4
                }
            });

            button.onTap(function (res) {
                console.log(res);
                let userInfo = res.userInfo;
                if(undefined != userInfo){
                    wx.login({
                        success: function(code) {
                            console.log(code);
                            if (code.code) {
                                button.destroy();
                                self.goHome(code.code, userInfo);
                            }else{
                                console.log("登录失败")
                            }
                        },
                        fail : function(res){// 登录失败
                            console.log("登录失败")
                        },
                    });

                }
            })

        }else {
            self.goHome(null, null);
        }
    },


    goHome: function (login_code, login_userInfo) {
        WXGlobal.setLocalStroage(code.storage_key_login_code, login_code);
        WXGlobal.setLocalStroage(code.storage_key_login_userInfo, login_userInfo);
        cc.director.loadScene("Home");
    }



});
