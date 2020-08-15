import {render, unrender, keyCode, emoji, Position, typeDataChange} from '../utils.js';
import MovieCommentsContainer from '../components/movie-detail/comments/movie-comments-container.js';
import CommentsList from '../components/movie-detail/comments/comments-list.js';
import CommentComponent from '../components/movie-detail/comments/comment-component.js';
import NewComment from '../components/movie-detail/comments/new-comment.js';

export default class CommentsController{
  constructor(commentsData, onDataChange) {
    this._commentsData = commentsData;
    this._movieCommentsContainer = new MovieCommentsContainer(this._commentsData.length);
    this._commentsList = new CommentsList();
    this._onDocumentKeyDown = this._onDocumentKeyDown.bind(this);
    this._newComment = new NewComment(this.onTextareaInput.bind(this), this.getEmotion);
    this._onDataChangeMain = onDataChange;
    this.onDataChange = this.onDataChange.bind(this);
    this._selectedEmotion = null;
  }

  init(container) {
    this._container = container;
    render(this._container, this._movieCommentsContainer.getElement());
    render(this._movieCommentsContainer.getElement(),this._commentsList.getElement());

    this._renderComments();
    this._renderNewComments();
  }

  onDataChange({typeData, value}) {
    this._activeComment = value;
    this._onDataChangeMain({typeData: typeData, value: this._activeComment.id})
  }

  _onDocumentKeyDown(e) {
    if(e.key === keyCode.ENTER && (e.ctrlKey || e.metaKey)) {
      const comment = _.escape(e.target.value);
      this._selectedEmotion = this._newComment.getEmotion();
      const message = this._createNewMessage(this._selectedEmotion, comment);
      this._newComment.removeError();
      this._onDataChangeMain({typeData: typeDataChange.CREATE_COMMENT, value: message});
    }
  }

  onError() {
    this._newComment.showError();
  }

  onTextareaInput() {
    document.addEventListener(`keydown`, this._onDocumentKeyDown);
  }

  update({typeData, value}) {
    this._commentsData = value;
    this._movieCommentsContainer.update(this._commentsData.length);

    switch (typeData) {
      case typeDataChange.CREATE_COMMENT:
        const commentComponent = new CommentComponent(this._commentsData[this._commentsData.length-1], this.onDataChange);
        render(this._commentsList.getElement(), commentComponent.getElement(), Position.BEFOREEND);
        this._newComment.clear();
        break;
      case typeDataChange.REMOVE_COMMENT:
        this._activeComment.remove();
        break;
    }
  }

  _createNewMessage(emotion, comment) {
    return {
      comment,
      date: new Date(),
      emotion: emotion ? emotion : emoji.SMILE,
    }
  }

  unrender() {
    document.removeEventListener(`keydown`, this._onDocumentKeyDown);
    this._newComment.removeListeners();
    unrender(this._movieCommentsContainer.getElement());
    this._movieCommentsContainer.removeElement();
    unrender(this._commentsList.getElement());
    this._commentsList.removeElement();
    unrender(this._newComment.getElement());
    this._newComment.removeElement();
  }

  _renderComments() {
    this._commentsData.forEach((comment) => {
      const commentComponent = new CommentComponent(comment, this.onDataChange);
      render(this._commentsList.getElement(), commentComponent.getElement())
    });
  }

  _renderNewComments() {
    this._newComment.init(this._movieCommentsContainer.getElement())
  }
}
