const DB = require('../utils/db.js')
module.exports={
  /**
   * 拉取电影列表
   * 
   */
  hotMovie: async ctx => {
    ctx.state.data = await DB.query("select * from movies limit 1;")
  },
  getComment: async ctx => {
    let commentid=+ctx.request.query.comment_id
    if(!isNaN(commentid)){
      ctx.state.data = (await DB.query("select * from movies_comment where movie_id = ? limit 1;", [commentid]))[0]
    }else{
      ctx.state.data = {}
    }
  },
  movieDetail: async ctx => {
    let movieId = + ctx.params.id
    let movie
    if (!isNaN(movieId)){
      // product = (await DB.query('select * from product where product.id = ?', [productId]))[0]
      // movie = (ctx.state.data = await DB.query("select * from movies where id = ?", [movieId]))[0]
      movie = (await DB.query('select * from movies where movies.id = ?', [movieId]))[0]
    }else{
      movie ={}
    }
    ctx.state.data=movie
  },
  moviesList: async ctx => {
    ctx.state.data = await DB.query("select * from movies;")
  },
  commentsListItem: async ctx => {
    let commentId = + ctx.request.query.comment_id
    if (!isNaN(commentId)) {
      ctx.state.data = await DB.query("select * from movies_comment where movie_id = ?", [commentId])
    }else{
      ctx.state.data = []
    }
  }
}