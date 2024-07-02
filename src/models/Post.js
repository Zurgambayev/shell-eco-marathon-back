// import mongoose from "mongoose";

// const PostSchema = new mongoose.Schema({
//     title: {type:String,required:true},
//     text: {type:String,required:true,unique:true},
//     tags:{type:Array,default:[]},
//     viewsCount:{type:Number,default:0},
//     user:{type:mongoose.Schema.Types.ObjectId,ref:'User',required:true},
//     imageURL:String
// },
// {
//     timestamps:true,
// });

// export default mongoose.model('Post', PostSchema);
import mongoose from 'mongoose';

const PostSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: true,
    },
    text: {
      type: String,
      required: true,
    },
    imageURL: String,
    tags: {
      type: Array,
      default: [],
    },
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    viewsCount: {
      type: Number,
      default: 0,
    },
    comments: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Comment',
      },
    ],
  },
  {
    timestamps: true,
  }
);

// Виртуальное свойство для подсчета количества комментариев
PostSchema.virtual('commentsCount').get(function() {
  return this.comments.length;
});

export default mongoose.model('Post', PostSchema);
