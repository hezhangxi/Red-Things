const userRouter = require('express').Router()
const { Group, User } = require('../models/index')
const { createPassword } = require('../api/bcrypt')

userRouter.get('/', function (req, res) {
  res.send({
    username: req.app.username
  })
})

userRouter.post('/group', async (req, res) => {
  let name = req.body.name
  let level = req.body.level
  let stack = req.body.stack
  console.log(req.body)
  if (!name) {
    return res.send({
      code: 500,
      msg: 'name is wrong'
    })
  }
  if (parseInt(level) > 6 || parseInt(level < 0)) {
    return res.send({
      code: 500,
      msg: 'level is wrong'
    })
  }
  try {
    let group = await Group.create({
      name,
      level,
      stack
    })
    res.send({
      code: 200,
      msg: group
    })
  } catch (error) {
    console.log(error)
    res.send({
      code: 500,
      msg: 'save error'
    })
  }

})

userRouter.get('/group', async (req, res) => {
  try {
    let groups = await Group.find()
    res.send({
      code: 200,
      groups
    })
  } catch (error) {
    res.send({
      code: 404,
      msg: 'groups empty'
    })
  }
})

userRouter.delete('/group', async (req, res) => {
  try {
    let name = req.body.name
    let status = await Group.deleteOne({ name })
    res.send({
      code: 200
    })
  } catch (error) {
    console.log(error)
    res.send({
      code: 500
    })
  }
})

userRouter.put('/group/:name', async (req, res) => {
  try {
    let group = await Group.updateOne({ name: req.params.name }, req.body)
    res.send({
      code: 200
    })
  } catch (error) {
    res.send({
      code: 500
    })
  }
})

userRouter.get('/user', async (req, res) => {
  try {
    let users = await User.find()
    if (users) {
      res.send({
        code: 200,
        data: users
      })
    }
  } catch (error) {
    res.send({
      code: 500
    })
  }
})

userRouter.delete('/user', async (req, res) => {
  try {
    let status = await User.deleteOne({
      _id: req.body.id
    })
    console.log(status)
    if (status) {
      res.send({
        code: 200
      })
    }
  } catch (error) {
    res.send({
      code: 500
    })
  }
})

userRouter.put('/user/:id', async (req, res) => {
  try {
    let nickname = req.body.nickname
    let group = req.body.group
    let user = await User.updateOne({ _id: req.params.id }, { nickname: nickname, group: group })
    res.send({
      code: 200,
      data: user
    })
  } catch (error) {
    res.send({
      code: 500
    })
  }
})


userRouter.post('/user', async (req, res) => {
  try {
    let username = req.body.username
    let password = req.body.password
    let nickname = req.body.nickname
    let group = req.body.group
    let user = await User.findOne({ username: username })
    if (user || !password) {
      res.send({
        code: 300,
        msg: '用户名已经存在/密码不能为空'
      })
    } else {
      password = createPassword(password)
      let user = await User.create({ username: username, password: password, nickname: nickname, group: group })
      res.send({
        code: 200,
        data: user
      })
    }
  } catch (error) {
    res.send({
      code: 500
    })
  }
})

userRouter.post('/modify',async(req,res)=>{
  try {
    let username = req.body.username
    let password = req.body.password
    if(!password){
      res.send({
        code:200,
        msg:'密码不能为空'
      })
    }
    let user = await User.findOne({username:username})
    if(user){
      password=createPassword(password)
      await User.updateOne({username:username},{password:password})
      res.send({
        code:200,
        msg:'修改密码成功'
      })
    }else{
      res.send({
        code:200,
        msg:'用户不存在'
      })
    }
  } catch (error) {
    res.send({
      code:500
    })
  }
})

module.exports = userRouter