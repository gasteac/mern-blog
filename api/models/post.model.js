import mongoose from "mongoose";

const postSchema = new mongoose.Schema({
  userId: {
    type: String,
    required: true,
  },
  content: {
    type: String,
    required: true,
    max: 1000,
  },
  title: {
    type: String,
    required: true,
    unique: true,
    max: 200,
  },
  image: {
    type: String,
    default:
      "https://mailrelay.com/wp-content/uploads/2017/04/video-tutoriales-sobre-email-marketing.jpg",
  },
  category:{
    type: String,
    default: 'unselected'
  },
    slug: {
        type: String,
        required: true,
        unique: true,
    }
}, 
    {timestamps: true});

const Post = mongoose.model("Post", postSchema);

export default Post;