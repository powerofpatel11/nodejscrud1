const jwt = require("jsonwebtoken");
const Student=require("../model/model")

const auth = async (req, resp, next) => {
  const mytoken =  req.cookies.jwt
  try {
    const st = await jwt.verify(mytoken, process.env.SECRET_KEY);
    const stdata =await  Student.findOne({_id:st._id});
    const tkn= stdata.Tokens.filter((element)=>{
      return element.token===mytoken
    })
    if(tkn[0]==undefined){
      resp.render("login", { err: "please login frist" });
    }

    req.user=stdata
    req.token=mytoken


    next(); 
  } catch (error) {
    resp.render("login", { err: "please login frist" });
  }
};
module.exports = auth;
