const dumb = (blogs) => {
  return 1;
};

const totalLikes = (blogList) => {
  return blogList.length === 0
    ? 0
    : blogList.reduce((accum, obj) => accum + obj.likes, 0);
};

const favouriteBlog = (blogList) => {
  if (blogList.length === 0) return {};

  const biggestLikesNumber = Math.max(
    ...blogList.map((blog) => blog.likes)
  );
  let resultBlog = blogList.find(
    (blog) => blog.likes === biggestLikesNumber
  );
  resultBlog = {
    title: resultBlog.title,
    author: resultBlog.author,
    likes: resultBlog.likes,
  };
  return resultBlog;
};

module.exports = {
  dumb,
  totalLikes,
  favouriteBlog,
};
