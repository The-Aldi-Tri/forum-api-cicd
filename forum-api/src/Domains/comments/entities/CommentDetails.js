class CommentDetails {
  constructor(payload) {
    this._verifyPayload(payload);

    const {
      id, username, date, content, replies, likeCount,
    } = this._formatPayload(payload);

    this.id = id;
    this.username = username;
    this.date = date;
    this.content = content;
    this.likeCount = likeCount;
    this.replies = replies;
  }

  _verifyPayload({
    id, username, date, content, replies, is_deleted: isDeleted, likeCount,
  }) {
    if (!id
      || !username
      || !date
      || !content
      || !replies
      || isDeleted === undefined
      || likeCount === undefined) {
      throw new Error('COMMENT_DETAILS.NOT_CONTAIN_NEEDED_PROPERTY');
    }

    if (
      typeof id !== 'string'
      || typeof username !== 'string'
      || !(date instanceof Date)
      || typeof content !== 'string'
      || typeof likeCount !== 'number'
      || !(Array.isArray(replies)
      && replies.every((reply) => typeof reply === 'object' && reply !== null))
      || typeof isDeleted !== 'boolean'
      // replies must be array of object(s) and not null since typeof null also returns 'object'
    ) {
      throw new Error('COMMENT_DETAILS.NOT_MEET_DATA_TYPE_SPECIFICATION');
    }
  }

  _formatPayload({
    id, username, date, content, replies, is_deleted: isDeleted, likeCount,
  }) {
    return {
      id,
      username,
      date,
      content: isDeleted ? '**komentar telah dihapus**' : content,
      likeCount,
      replies,
    };
  }
}

module.exports = CommentDetails;
