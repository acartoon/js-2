import {render, unrender} from '../utils.js';
import MovieCommentsContainer from '../components/movie-detail/comments/movie-comments-container.js';
import CommentsList from '../components/movie-detail/comments/comments-list.js';
import CommentComponent from '../components/movie-detail/comments/comment-component.js';
import NewComment from '../components/movie-detail/comments/new-comment.js';

export default class CommentsController{
  constructor(commentsData) {
    this._commentsData = commentsData;
    this._movieCommentsContainer = new MovieCommentsContainer(this._commentsData.length);
    this._commentsList = new CommentsList();
    this._newComment = new NewComment();
  }

  init(container) {
    this._container = container;
    this._renderComments(this._commentsData);
    this._renderNewComments();
    console.log()
  }

  unrender() {
    console.log(`se;lfs;fdgk;alsdgk;`)
    unrender(this._movieCommentsContainer.getElement());
    this._movieCommentsContainer.removeElement();
    unrender(this._commentsList.getElement());
    this._commentsList.removeElement();
    unrender(this._newComment.getElement());
    this._newComment.removeElement();
  }

  _renderComments(commentsData) {
    render(this._container, this._movieCommentsContainer.getElement());
    render(this._movieCommentsContainer.getElement(),this._commentsList.getElement());
    commentsData.forEach((comment) => {
      const commentComponent = new CommentComponent(comment);
      render(this._commentsList.getElement(), commentComponent.getElement())
    });
  }

  _renderNewComments() {
    this._newComment.init(this._movieCommentsContainer.getElement())
  }
}
