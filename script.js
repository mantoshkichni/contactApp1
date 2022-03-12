const express=require('express')
const ejs=require('ejs');
const path=require('path');
const app=express();
const bodyparser=require('body-parser');
const mongoose=require('mongoose')
const session=require('express-session');
require('dotenv').config();
const PORT=process.env.PORT;





app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, '/views')); 
var public = path.join(__dirname, 'public');
app.use('/', express.static(path.join(__dirname, 'public')))
app.use(bodyparser.urlencoded({extended:true}))
app.use(session({
    secret: 'keyboard cat',
    resave: false,
    saveUninitialized: true
    
  }))
mongoose.connect('mongodb+srv://mantoshdatabase:mantoshdatabase98@cluster0.qbylv.mongodb.net/myapp', {
    useNewUrlParser: true,
    useUnifiedTopology: true
  })


const modelSchema={
    email:{
        type:String,
        unique:true
    },
    password:String,
    secretKey:String,
    contacts:[{
        name:String,
        phoneNo:String,
        email:String
    }]
}
const signUp=mongoose.model("user",modelSchema);


app.get('/',(req,res)=>{
    res.sendFile(path.join(public, 'index.html'));
})


app.get('/views',async(req,res)=>{
    if(req.session._user_id===undefined)
    {
        const data=req.session._user_id_signin;
        const libdata=await signUp.findById(data);
        console.log("%$#$%$#$%^%$#$%^")
        console.log(libdata.contacts);
        res.render('contacts',{Ddata:libdata.contacts})
    }
    else{
        const data=req.session._user_id;
        const libdata=await signUp.findById(data);
        console.log("%$#$%$#$%^%$#$%^")
        console.log(libdata.contacts);
        res.render('contacts',{Ddata:libdata.contacts})
    }
    
})


app.post('/signup',async(req,res)=>{
    //getting input from user
    const email=req.body.email;
    const password=req.body.password;
    const secret_key=req.body.secretkey;
    console.log(email+" "+password+" "+secret_key);


    //%%%%%%%^^^^^^^^^^^^^^^^^^%%%%%%%%%%%%%%%
    const con=await signUp.find({email:email}).count();
    console.log("@@@@@@@@########################$$$$$$$$$$$$$$$$$$$$$$$"+con)

        try {
            
            let signUpUser=new signUp({email:email,password:password,secretKey:secret_key})
        await signUpUser.save();
        console.log('Success');
         //finding the userid from signup page
         const user_id=await signUp.find({email:email});
         console.log("_______________||||||||||||_________________")
         console.log(user_id);
         console.log(user_id[0]._id.valueOf());
         //req.session.email=email;
         req.session._user_id=user_id[0]._id.valueOf();
         req.session._email=user_id[0].email;
         console.log(req.session._email)
         console.log(req.session._user_id);
        
        res.sendFile(path.join(public, 'contactpage.html'));
        } catch (error) {
            res.sendFile(path.join(public, 'error.html'));
            console.log(error)
        }
    
    const cou=await signUp.find({email:email}).count();
    console.log("@@@@@@@@@@@@@@###################$$$$$$$$$$$$$$$$$$$$$$$$$"+cou)
   
       
    
    //Saving into databases
    
})
// app.get('/contactpage',(req,res)=>{
//     res.sendFile(path.join(public, 'contactpage.html'))
// })

app.post('/contactpage',async(req,res)=>{
   const userID=req.session._user_id;
//    const userID=req.session.email;
    try {
        const data= await signUp.findById(userID);
        // const data= await signUp.find({email:userID});
    console.log(req.session._user_id)
    console.log(req.session._email)
    console.log(data);
    //console.log(email);
    await signUp.updateOne( 
        {_id:req.session._user_id },
        { $push: { 
            "contacts":{name:req.body.name,phoneNo:req.body.phoneno,email:req.body.email}
        }
         }
      )
    console.log("####@@@@@@@@@@@@@@!!!!!!!!!!!!!!!!!!!!!")
    // await signUp.findByIdAndUpdate({_id:req.session._user_id},{$push: { 
    //             "contacts":{name:req.body.name,phoneNo:req.body.phoneno,email:req.body.email}
    //         }})
      console.log(data.contacts);
    res.redirect('/views');
    } catch (error) {
        res.send("error")
    }
    
})

app.post('/signupcontactpage',async(req,res)=>{
    const siguserID=req.session._user_id_signin;
    console.log(siguserID+"@@@@")
    try {
        const data= await signUp.findById(siguserID);
    console.log(req.session._user_id_signin)
    console.log(data);
    await signUp.updateOne( 
        {_id:req.session._user_id_signin },
        { $push: { 
            "contacts":{name:req.body.name,phoneNo:req.body.phoneno,email:req.body.email}
        }
         }
      )
      console.log(data.contacts);
    res.redirect('/views');
    } catch (error) {
        res.send(error)
    }
    
})




app.post('/signin',async(req,res)=>{
    
    const email=req.body.email;
    const password=req.body.password;
    const data=await signUp.find({email:email});
    console.log(data)
    console.log("$$$$$$$$$$%%%%%%%%%%%%%%"+data[0].password);
    req.session._user_id_signin=data[0]._id.valueOf();
    console.log(req.session._user_id_signin)
    if(data[0].password===password)
    {
        console.log(req.session._user_id_signin)
        res.sendFile(path.join(public, 'signupcontactpage.html'))
    }else{
        res.sendFile(path.join(public, 'error.html'))
    }
    
    
    

})























app.listen(PORT||'3000',()=>console.log('Server is up and running:'+PORT));