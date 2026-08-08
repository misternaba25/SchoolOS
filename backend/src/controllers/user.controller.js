import { User } from "../models/user.model.js";

const registerUser = async (req, res) => {
    try {
        const {username, email, password} = req.body

        //validation
        if(!username || !email || !password){
            return res.status(400).json({message: "All fields are important"})
        }

        //check if user exists

        const existing = await User.findOne({email : email.toLowerCase()})
        if(existing){
            return res.status(400).json({message: "User already exists"})
        }

        // create a user
        const user = await User.create ({
            username,
            email: email.toLowerCase(),
            password,
            loggedIn: false,

        })

        res.status(201).json({message: 'User registered successfully', 
            user: {id: user._id,
                   email: user.email,
                   username: user.username
             }
        })

    } catch (error) {
        res.status(500).json({message: 'Internal server error', error: error.message})
    }
}

const loginUser = async (req, res) =>{
    try {
        
        //check if the user exists
        const {email, password} = req.body

        const user = await User.findOne({
            email: email.toLowerCase()
        })

        if(!user) return res.status(400).json({
            message: "User not found !"
        })

        // compare passwords
        const isMatch = await user.comparePassword(password)
        if(!isMatch) return res.status(400).json({
            message: "Invalide "
        })

        res.status(200).json({
            message: "Connexion réussie",
            user:{
                id: user._id,
                email: user.email,
                username: user.username
            }
        })

    } catch (error) {
        res.status(500).json({message: "Erreur interne"})
    }
}

const logoutUser = async (req, res) => {
    try {
        const {email} = req.body

        const user = await User.findOne({email})

        if(!user) return res.status(404).json({
            message: "Utilisateur introuvable"
        })

        res.status(200).json({
            message:"Utilisateur deconnecté"
        })

    } catch (error) {
        return res.status(500).json({message: "Erreur interne", error})
    }
}

export {registerUser, loginUser, logoutUser}