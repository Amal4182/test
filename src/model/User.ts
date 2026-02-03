import mongoose from 'mongoose'

const UserSchema = new mongoose.Schema({
    name: { type: String, required: true },
    gender:{type:String,required:true},
    email:{type:String,required:true},
    age: { type: Number, required: true },
    course: { type: String, required: true },
    year: { type: Number, required: true },
    bio: { type: String, required: true },
    interests: [{ type: String }],
    photos: [{ type: String }]
}, {
    timestamps: true
})

export default mongoose.models.User || mongoose.model('User', UserSchema)
