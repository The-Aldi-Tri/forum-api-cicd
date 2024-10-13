const pool = require('../../database/postgres/pool');

const LikeRepositoryPostgres = require('../LikeRepositoryPostgres');

const UsersTableTestHelper = require('../../../../tests/UsersTableTestHelper');
const ThreadsTableTestHelper = require('../../../../tests/ThreadsTableTestHelper');
const CommentsTableTestHelper = require('../../../../tests/CommentsTableTestHelper');
const LikesTableTestHelper = require('../../../../tests/LikesTableTestHelper');

describe('LikeRepositoryPostgres', () => {
  const user1 = {
    id: 'user-123',
    username: 'username1',
    password: 'secret',
    fullname: 'full name 1',
  };

  const user2 = {
    id: 'user-321',
    username: 'username2',
    password: 'secret',
    fullname: 'full name 2',
  };

  const thread = {
    id: 'thread-123',
    title: 'judul',
    body: 'isi',
    owner: 'user-123',
  };

  const comment = {
    id: 'comment-123',
    thread_id: 'thread-123',
    content: 'isi komen',
    owner: 'user-123',
  };

  beforeAll(async () => {
    await UsersTableTestHelper.addUser(user1);
    await UsersTableTestHelper.addUser(user2);

    await ThreadsTableTestHelper.addThread(thread);

    await CommentsTableTestHelper.addComment(comment);
  });

  afterEach(async () => {
    await LikesTableTestHelper.cleanTable();
  });

  afterAll(async () => {
    await CommentsTableTestHelper.cleanTable();
    await ThreadsTableTestHelper.cleanTable();
    await UsersTableTestHelper.cleanTable();
    await pool.end();
  });

  describe('checkIfUserHasLikedComment function', () => {
    it('should return true if user has liked the comment', async () => {
      // Arrange
      await LikesTableTestHelper.addLike({
        id: 'like-123',
        commentId: comment.id,
        userId: user1.id,
        date: new Date(),
      });

      const fakeIdGenerator = () => '123'; // stub!
      const likeRepositoryPostgres = new LikeRepositoryPostgres(
        pool,
        fakeIdGenerator,
      );

      // Action
      const result = await likeRepositoryPostgres.checkIfUserHasLikedComment({
        commentId: comment.id,
        userId: user1.id,
      });

      // Assert
      expect(result).toBe(true);
    });

    it('should return false if user has not liked the comment', async () => {
      // Arrange
      const fakeIdGenerator = () => '123'; // stub!
      const likeRepositoryPostgres = new LikeRepositoryPostgres(
        pool,
        fakeIdGenerator,
      );

      // Action
      const result = await likeRepositoryPostgres.checkIfUserHasLikedComment({
        commentId: comment.id,
        userId: user1.id,
      });

      // Assert
      expect(result).toBe(false);
    });
  });

  describe('likeComment function', () => {
    it('should persist new like correctly', async () => {
      // Arrange
      const likePayload = {
        commentId: comment.id,
        userId: user1.id,
      };

      const fakeIdGenerator = () => '123'; // stub!
      const likeRepositoryPostgres = new LikeRepositoryPostgres(
        pool,
        fakeIdGenerator,
      );

      // Action
      await likeRepositoryPostgres.likeComment(likePayload);

      // Assert
      const like = await LikesTableTestHelper.findLikeById('like-123');
      expect(like).toHaveLength(1);
    });
  });

  describe('unlikeComment function', () => {
    it('should delete like correctly', async () => {
      // Arrange
      const likePayload = {
        id: 'like-123',
        commentId: comment.id,
        userId: user1.id,
        date: new Date(),
      };

      await LikesTableTestHelper.addLike(likePayload);

      const fakeIdGenerator = () => '123'; // stub!
      const likeRepositoryPostgres = new LikeRepositoryPostgres(
        pool,
        fakeIdGenerator,
      );

      // Action
      await likeRepositoryPostgres.unlikeComment(likePayload);

      // Assert
      const like = await LikesTableTestHelper.findLikeById(likePayload.id);
      expect(like).toHaveLength(0);
    });
  });

  describe('countCommentLikes function', () => {
    it('should count likes correctly', async () => {
      const likePayload = {
        id: 'like-123',
        commentId: comment.id,
        userId: user1.id,
        date: new Date(),
      };

      const likePayload2 = {
        id: 'like-1234',
        commentId: comment.id,
        userId: user2.id,
        date: new Date(),
      };

      await LikesTableTestHelper.addLike(likePayload);
      await LikesTableTestHelper.addLike(likePayload2);

      const fakeIdGenerator = () => '123'; // stub!
      const likeRepositoryPostgres = new LikeRepositoryPostgres(
        pool,
        fakeIdGenerator,
      );

      // Action
      const count = await likeRepositoryPostgres.countCommentLikes(comment.id);

      // Assert
      expect(count).toBe(2);
    });
  });
});
