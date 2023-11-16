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

const mostBlogs = (blogList) => {
  if (blogList.length === 0) return "No blogs in this list";

  const authors = blogList.map((blog) => blog.author);
  const authorWithMostBlogs = authors.reduce(
    (accum, author) => (accum.author = author)
  );
  const filteredList = blogList.filter(
    (blog) => blog.author === authorWithMostBlogs
  );
  const result = {
    author: authorWithMostBlogs,
    blogs: filteredList.length,
  };
  return result;
};

const mostLikes = (blogList) => {
  if (blogList.length === 0) return "No blogs in this list";

  const likesCount = {};

  blogList.forEach((blog) => {
    if (likesCount[blog.author]) {
      likesCount[blog.author] = blog.likes + likesCount[blog.author];
    } else {
      likesCount[blog.author] = blog.likes;
    }
  });
  const likesCountToArray = Object.entries(likesCount);
  const biggestNumber = Math.max(...Object.values(likesCount));

  const mostLiked = likesCountToArray.find(
    (entry) => entry[1] === biggestNumber
  );
  return { author: mostLiked[0], likes: mostLiked[1] };
};

module.exports = {
  dumb,
  totalLikes,
  favouriteBlog,
  mostBlogs,
  mostLikes,
};
