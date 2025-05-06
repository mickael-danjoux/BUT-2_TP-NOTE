import { User } from '../../src/database/models/user.model.js'
import { Post } from '../../src/database/models/post.model.js'
import bcrypt from 'bcrypt'

export const createTestUser = async (userData = {}) => {
  const salt = await bcrypt.genSalt(10);
  return await User.create({
    firstName: userData.firstName || 'Test',
    lastName: userData.lastName || 'User',
    email: userData.email || `test.${Date.now()}.${Math.random().toString(36).substring(2)}@example.com`,
    birthDate: userData.birthDate,
    password: await bcrypt.hash(userData.password || 'Azerty1%', salt),
  });
};

export const createTestPost = async (postData = {}, user = null) => {
  const author = user || await createTestUser();

  return await Post.create({
    title: postData.title || 'Test Post Title',
    content: postData.content || 'This is a test post content with enough characters.',
    published: postData.published !== undefined ? postData.published : true,
    userId: author.id
  });
};
