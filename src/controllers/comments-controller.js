import {render, unrender, KEY_CODE, DATA_CHANGE, EMOJIS, getRandomString, Position, REMOVE_COMMENT, CREATE_COMMENT} from '../utils.js';
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
    this._newComment = new NewComment(this.onTextareaInput.bind(this));
    this._onDataChangeMain = onDataChange;
    this.onDataChange = this.onDataChange.bind(this);
    this._selectedEmotion = null;
    // this.onTextareaInput = this.onTextareaInput;
  }

  init(container) {
    this._container = container;
    render(this._container, this._movieCommentsContainer.getElement());
    render(this._movieCommentsContainer.getElement(),this._commentsList.getElement());

    this._renderComments();
    this._renderNewComments();
  }

  onDataChange({typeDataChange, value}) {
    this._activeComment = value;
    this._onDataChangeMain({typeDataChange: typeDataChange, value: this._activeComment.id})
  }

  _onDocumentKeyDown(e) {
    if(e.key === KEY_CODE.ENTER && (e.ctrlKey || e.metaKey)) {
      const comment = e.target.value;
      const message = this._createNewMessage(this._selectedEmotion, comment);
      this._onDataChangeMain({typeDataChange: DATA_CHANGE.CREATE_COMMENT, value: message});
    }
  }

  onTextareaInput(e, selectedEmotion) {
    this._selectedEmotion = selectedEmotion;
    document.addEventListener(`keydown`, this._onDocumentKeyDown)
  }

  update({typeDataChange, value}) {
    console.log(value)
    this._commentsData = value;
    this._movieCommentsContainer.update(this._commentsData.length);

    switch (typeDataChange) {
      case CREATE_COMMENT:
        const commentComponent = new CommentComponent(this._commentsData[this._commentsData.length-1], this.onDataChange);
        render(this._commentsList.getElement(), commentComponent.getElement(), Position.BEFOREEND);
        break;
      case REMOVE_COMMENT:
        console.log(`sdlkfj`)
        this._activeComment.remove();
        break;
    }
  }

  _createNewMessage(emotion, comment) {
    return {
      comment,
      date: new Date(),
      emotion: emotion ? emotion : EMOJIS.SMILE,
    }
  }

  unrender() {
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
