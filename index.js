const express=require('express');
const app=express();
const port=4000;

const mongoose=require('mongoose');
const connectionString='mongodb://localhost:27017/bookapp';


app.use(express.json())


mongoose.connect(connectionString, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
    useFindAndModify: false
},(err)=>{
    if(err){
        //to account for an error if it doesnt connect to the database
        console.log("Your are unable to connect to the database",err)
    } else{
        console.log('database connection successful')
    }
})
const bookSchema =new mongoose.Schema(
    {
        name: String,
        email: String,
        country: String
    }
)
const Book = mongoose.model('Book',bookSchema)
//the post route that will allow users to add name,email and country details
app.post('/books', function(req, res){
const book=req.body.book;
Book.create({
    name:book.name,
    email:book.email,
    country: book.country
},
    (err, newBook)=>{
        if(err){
            //will show the error if it foesnt upload the new details
            return res.status(500).json({message:err})

        }
        else{
            return res.status(200).json({message:"New database added",newBook})
        }
    }

)
console.log({book})//will show the details of the new details in the console
})
app.get('/books/:id',(req,res)=>{
    //It will ne used to get details by a specific Id 
    Book.findOne({_id:req.params.id},(err, book)=>{
        if(err){
            return res.status(500).json({message:err})
        }
        else if(!book){
            //This will show the user if such an Id does not exits or the details have not been found
            return res.status(404).json({message:"details is not found"})
        }
        else{
            return res.status(200).json(book)
        }
    })
})

app.get('/books',(req,res)=>{
    //This will show the complete database
Book.find({},(err, books)=>{
    if(err){
        return res.status(500).json({message:err})
    }
    else{
        return res.status(200).json(books)
    }
})


})
app.put('/books/:id',(req,res)=>{
    //This will be used to update the details by Id
Book.findByIdAndUpdate(req.params.id,
    {name:req.body.name,
    email:req.body.email,
    country:req.body.country},
    (err,book)=>{
        if(err){
            return res.status(500).json({message:err})
        }
        else if(!book){

       return res.status(404).json({message:"details not found"})
        }
        else{
            //This will save the updated details
            book.save((err,savedBook)=>{
                if(err){
            return res.status(400).json({message:err})

            }
            else{
                //confirmation of saved updated details
                return res.status(200).json({message:"details updated succesfully"})
            }    
        }
            )}
    
    })
})



app.delete('/books/:id',(req,res)=>{
    //This will delete details by ID
    Book.findByIdAndDelete(req.params.id,(err,book)=>{
        if(err){
            return res.status(500).json({message:err})
        }
        else if(!book)
        {
            return res.status(404).json({messsage:"details was not found"})
        }
        else{
            return res.status(200).json({message:"details have been deleted"})
        }
    })
})
//This is to confirm that the app is running and working on port 4000
app.listen(port, ()=>console.log("app listening on port "+port));