const LikeUnlikeUseCase = require('../../../../Applications/use_case/LikeUnlikeUseCase');

class LikesHandler {
  constructor(container) {
    this._container = container;

    this.putLikeHandler = this.putLikeHandler.bind(this);
  }

  async putLikeHandler(request, h) {
    const { threadId, commentId } = request.params;
    const { id: userId } = request.auth.credentials;

    const likeUnlikeUseCase = this._container.getInstance(
      LikeUnlikeUseCase.name,
    );
    await likeUnlikeUseCase.execute({
      threadId,
      commentId,
      userId,
    });

    const response = h.response({
      status: 'success',
    });
    response.code(200);
    return response;
  }
}

module.exports = LikesHandler;
