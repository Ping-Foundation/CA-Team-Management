var express = require('express');
var router = express.Router();
var mongoose = require('mongoose');
var teams=mongoose.model('teams');
var members=mongoose.model('members');
var groups=mongoose.model('groups');
var mkdir = require('mkdirp');

router.get('/',function (req,res,next) {
  teams.find({},function (err,listTeam) {
    if(!err){
      // console.log(listTeam);
      res.json(listTeam);
    }else{
      console.log('Error : (Teams) => dbError');
    }
  })
})
router.post('/',function (req,res,next) {
  teams.findOne({name:req.body.name},function (bdError,teamList) {
    if(!bdError){
      if(!teamList){
        var objTeams=new teams();
        objTeams.name =req.body.name;
        objTeams.save(function (teamDbError,newTeam) {
          if(!teamDbError) {
            mkdir('public/uploads/groups/'+req.body.name)
            res.send({
              status:200,
              message:'Team Successfully created'
            });
          }else{
            res.send({
              status:400,
              message:'Team Creation Error ,please retry again'
            });
          }
        });
      }else{
        res.send({
          status:400,
          message:'Team Already exists'
        });
      }
    }else{
      console.log('Error : (Teams) => dbError new User');
    }
  });
});
router.post('/:name',function (req,res,next) {
  // console.log(req.params.name);
  // console.log(req);
  if(req.files){
    teams.findOne({name:req.params.name,'groups.name':req.body.name},function(dbErr,objTeam){
      var link = 'public/uploads/groups/'+req.params.name+'/'+req.body.name+'.jpeg';
      var uploadFile = req.files.uploadFile;
      if(!dbErr){
        if(!objTeam){

          var objTeam =new teams();
          teams.update(
            {
              name:req.params.name
            },
            {
              $addToSet: {
                groups: {
                  name: req.body.name,
                  icon: 'uploads/groups/'+req.params.name+'/'+req.body.name+'.jpeg'
                }
              }
            },function(err,data) {
              if(!err){
                uploadFile.mv(link,function(err){
                  if(!err){
                    res.send({
                      status:200,
                      message:'successfully created'
                    });
                  }
                  else {
                    console.log(err);
                  }
                });
                /*res.send({
                  status:200,
                  message:'successfully created'
                });*/
              }
              else {
                console.log(err);
              }
            })

          /*var objGroup =new groups();
          objGroup.name = req.body.name;
          objGroup.icon = '/uploads/groups/'+req.params.name+'/'+req.body.name+'.jpeg';*/
         /* objTeam.groups.name=req.body.name;
          objTeam.groups.name='/uploads/groups/'+req.params.name+'/'+req.body.name+'.jpeg';
          objTeam.save(function (err,data) {
            if(!err){
              res.send({
                status:200,
                message:'Group added successfully'
              });
            }else{
              res.send({
                status:400,
                message:'error'
              });
            }
          })*/
          // console.log('hello')
          /*teams.update(
            {
              name:req.params.name
            },
            {
              $addToSet: {
                groups: {
                  name: req.body.name,
                  icon: '/uploads/groups/'+req.params.name+'/'+req.body.name+'.jpeg'
                }
              }
            },function(err,data){
            if(data){
              uploadFile.mv(link,function(err){
                if(!err){
                  res.send({
                    status:200,
                    message:'successfully created'
                  });
                }
                else {
                  console.log(err);
                }
              })*/
            }else{
              res.send({
                status:400,
                message:'error Please retry Again'
              });
            }
      }else{
        res.send({
          status:400,
          message:'internal Error please try again (code : dbEr) '
        });
      }
    });
  }
  else{
    res.send({
      status:400,
      message:'Please Select  file'
    });
  }

});
router.post('/delete/group/:_id',function (req,res) {
  console.log(req.params._id);
  members.findOne({'group':req.params._id },function (memError,objMem) {
    console.log('hehe'+objMem)
    if(memError) {
      res.send({
        status:400,
        message:'internal Error please try again (code : dbEr) ' + memError
      });
    } else if(objMem) {
      res.send({
        status:400,
        message:'Reference already exists'
      });
    } else {
      teams.update({ 'groups._id': req.params._id },{$pull:{groups:{ _id: req.params._id }} },function (teamError,teamUpdate) {
        if (teamError) {
          res.send({
            status:400,
            message:'internal Error please try again (code : dbEr) ' + teamError
          });
        } else {
          res.send({
            status:200,
            message:'successfully Deleted'
          });
        }
      });
    }
  });
})


module.exports = router;
