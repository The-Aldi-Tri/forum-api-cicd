/* istanbul ignore file */
const pool = require('../src/Infrastructures/database/postgres/pool');

const RepliesTableTestHelper = {
  async addLike(
    {
      id = 'like-123',
      commentId = 'comment-123',
      userId = 'user-123',
      date = new Date(),
    } = {},
  ) {
    const query = {
      text: 'INSERT INTO likes (id, comment_id, owner, date) VALUES($1, $2, $3, $4)',
      values: [id, commentId, userId, date],
    };

    await pool.query(query);
  },

  async findLikeById(likeId) {
    const query = {
      text: 'SELECT * FROM likes WHERE id = $1',
      values: [likeId],
    };

    const result = await pool.query(query);
    return result.rows;
  },

  async deleteLike(likeId) {
    const query = {
      text: 'DELETE FROM likes WHERE id = $1',
      values: [likeId],
    };

    await pool.query(query);
  },

  async countCommentLikes(commentId) {
    const query = {
      text: 'SELECT COUNT(*) FROM likes WHERE comment_id = $1',
      values: [commentId],
    };

    const result = await pool.query(query);

    return parseInt(result.rows[0].count, 10);
  },

  async cleanTable() {
    await pool.query('DELETE FROM likes WHERE 1=1');
  },
};

module.exports = RepliesTableTestHelper;
