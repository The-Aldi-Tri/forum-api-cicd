class LikeUnlikeUseCase {
  constructor({ threadRepository, commentRepository, likeRepository }) {
    this._threadRepository = threadRepository;
    this._commentRepository = commentRepository;
    this._likeRepository = likeRepository;
  }

  async execute(useCasePayload) {
    await this._threadRepository.verifyThreadExist(useCasePayload.threadId);

    await this._commentRepository.verifyCommentExist(useCasePayload.commentId);

    const hasUserLikedComment = await this._likeRepository
      .checkIfUserHasLikedComment(
        {
          userId: useCasePayload.userId,
          commentId: useCasePayload.commentId,
        },
      );

    if (hasUserLikedComment) {
      await this._likeRepository
        .unlikeComment({ commentId: useCasePayload.commentId, userId: useCasePayload.userId });
    } else {
      await this._likeRepository
        .likeComment({ commentId: useCasePayload.commentId, userId: useCasePayload.userId });
    }
  }
}

module.exports = LikeUnlikeUseCase;
