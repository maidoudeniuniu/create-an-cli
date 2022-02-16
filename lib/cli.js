#!/usr/bin/env node

const inquirer = require('inquirer')
const path = require('path')
const fs = require('fs')
const shell = require('shelljs');
let AWSOBJ = {};
//启动
function run () {
    inquirer.prompt(
        [ 
            {
                type:"input",
                name:"name",
                message:"请输入创建项目名称",
                default:this.appname,
            },
            {
                type:"list",
                name:"apply",
                message:"请选择应用类型", 
                default:"",
                choices:['PC','H5','MPAPP','APP']
            },
            {
                type:"list",
                name:"subapply",
                message:"请选择子应用模版", 
                choices:(name) => {  
                    return _subApply(name.apply)
                },
            }
        ]
    ).then(aws=>{ 
        AWSOBJ = aws;
        getDefault()
    })
}

run() 
 

//获取子应用类型展示
function _subApply (name) { 
    const objname = name || AWSOBJ.apply
    const obj = {
        'PC':['adminLayout'],
        'H5':['cci','zlb'],
        'MPAPP':['wx','alipay'],
        'APP':[]
    }
    return obj[objname]
}

 //如果generator内部还有不符合任意一个任务队列任务名的方法，将会被放在default这个任务下进行运行
 function getDefault() {  
    const objUrl = path.resolve() + "/" + AWSOBJ.name // 创建项目目录的当前路径
    console.log('objUrl',objUrl)
    // 判断当前的目录是否存在，如果存在，提示当前用户的
    getStat(objUrl).then(res=>{ 
        let gitUrl = _gitUrl(AWSOBJ.subapply) 
        let objName = AWSOBJ.name   
        if(
        shell.exec(`
            cd ${path.resolve()} && 
            git clone ${gitUrl} ${objName} && 
            cd ${objName} && 
            npm i`
        ).code == 0){
            console.log("已完成")
        }else{
            console.log("未完成")
        }

        //处理项目业务逻辑 
       
        // this.download(gitUrl,objUrl).then(res=>{
        //     console.log("已完成")
        // }).catch(err=>{
        //     console.log("err")
        // }) 
    }).catch(err=>{
        console.log(err)  
        console.log(AWSOBJ.name + "已存在")  
    })  
}


/**
   * 读取路径信息
   * @param {string} filepath 路径
   */
function getStat(filepath) {
    if(!filepath){
        return
    } 
    return new Promise((resolve, reject) => {  
     if(!fs.existsSync(filepath)){
       resolve(true) 
     }else{
        reject(false)
     }   
    }) 
}

// 自应用模版对应的git仓库地址 
function _gitUrl (name) { 
    const obj = {
        'adminLayout':'ssh://git@git.citycloud.com.cn:3022/yueqing/park-mph5.git',
        'cci':'ssh://git@git.citycloud.com.cn:3022/yueqing/park-mph5.git',
        'zlb':'ssh://git@git.citycloud.com.cn:3022/yueqing/park-mph5.git',
        'wx':'ssh://git@git.citycloud.com.cn:3022/yueqing/park-mph5.git',
        'alipay':'ssh://git@git.citycloud.com.cn:3022/yueqing/park-mph5.git'
    }
    return obj[name]
}