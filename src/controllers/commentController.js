import CommentModel from '../models/Comment.js';
import PostModel from '../models/Post.js';

export const addComment = async (req, res) => {
  try {
    const postId = req.params.postId;
    const userId = req.userId;
    const { text } = req.body;

    const comment = new CommentModel({
      text,
      user: userId,
      post: postId,
    });

    const savedComment = await comment.save();

    await PostModel.updateOne(
      { _id: postId },
      { $push: { comments: savedComment._id } }
    );

    res.json(savedComment);
  } catch (err) {
    console.log(err);
    res.status(500).json({
      message: 'Не удалось добавить комментарий',
    });
  }
};

export const getComments = async (req, res) => {
  try {
    const postId = req.params.postId;

    const post = await PostModel.findById(postId).populate({
      path: 'comments',
      populate: {
        path: 'user',
        select: 'fullName',
      },
    });

    if (!post) {
      return res.status(404).json({
        message: 'Пост не найден',
      });
    }

    res.json(post.comments);
  } catch (err) {
    console.log(err);
    res.status(500).json({
      message: 'Не удалось получить комментарии',
    });
  }
};

export const removeComment = async (req, res) => {
  try {
    const commentId = req.params.commentId;

    const comment = await CommentModel.findByIdAndDelete(commentId);

    if (!comment) {
      return res.status(404).json({
        message: 'Комментарий не найден',
      });
    }

    await PostModel.updateOne(
      { _id: comment.post },
      { $pull: { comments: commentId } }
    );

    res.json({
      success: true,
    });
  } catch (err) {
    console.log(err);
    res.status(500).json({
      message: 'Не удалось удалить комментарий',
    });
  }
};
