/* eslint-disable no-unused-vars */
class LikeRepository {
  async checkIfUserHasLikedComment({ commentId, userId }) {
    throw new Error('Like_REPOSITORY.METHOD_NOT_IMPLEMENTED');
  }

  async likeComment({ commentId, userId }) {
    throw new Error('Like_REPOSITORY.METHOD_NOT_IMPLEMENTED');
  }

  async unlikeComment({ commentId, userId }) {
    throw new Error('Like_REPOSITORY.METHOD_NOT_IMPLEMENTED');
  }

  async countCommentLikes(commentId) {
    throw new Error('Like_REPOSITORY.METHOD_NOT_IMPLEMENTED');
  }
}

module.exports = LikeRepository;
