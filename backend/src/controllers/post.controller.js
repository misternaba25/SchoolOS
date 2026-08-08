import { Post } from "../models/post.model.js";

// creation of a post

const createPost = async (req, res) =>{
    try {
        const {name, description, age} = req.body

        if(!name || !description || !age){
            return res.status(400).json({
                messag: "All fields are required"
            })
        }

        const post = await Post.create({name, description,age})

        res.status(201).json({
            message: "post created succesfully", post
        })

    } catch (error) {
        res.status(500).json({
            message: "Erreur interne", error
        })
    }
}

// read all posts

const getPosts = async (req, res) =>{
    try {
        const posts = await Post.find()
        res.status(200).json(posts)
    } catch (error) {
        res.status(500).json({
            message: "Erreur interne", error
        })
    }
}

// update one post

const updatePost = async (req, res)=>{
    try {
        
        // on vérifie si il y a un contenu dans les posts
        if(Object.keys(req.body).length === 0){
            return res.status(200).json({
                message: "Pas assez de données fournies"
            })
        }
        
        const post = await Post.findByIdAndUpdate(req.params.id, req.body, {new:true})

        if(!post) return res.status(404).json({
            message: "Poste introuvable"
        })

        res.status(200).json({
            message: "Poste mis à jour avec succes"
        })

    } catch (error) {
        
        return res.status(500).json({
            message: "Interal server error", error
        })

    }
}

//delete post

const deletePost = async (req,res)=>{
    try {
        
        const deleted = await Post.findByIdAndDelete(req.params.id)

        if(!deleted) return res.status(404).json({
            message: "Pose introuvabe"
        })

        return res.status(200).json({
            message: "Poste supprimé avec succès"
        })

    } catch (error) {
        return res.status(500).json({
            message: "Erreur interne du serveur"
        })
    }
}

export {createPost, getPosts, updatePost, deletePost}