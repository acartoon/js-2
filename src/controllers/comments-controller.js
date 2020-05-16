import {render, unrender, KEY_CODE, DATA_CHANGE, EMOJIS, getRandomString} from '../utils.js';
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
    this.onDataChange = onDataChange;
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

  _onDocumentKeyDown(e) {
    if(e.key === KEY_CODE.ENTER && (e.ctrlKey || e.metaKey)) {
      const comment = e.target.value;
      const message = this._createNewMessage(this._selectedEmotion, comment);
      this.onDataChange(DATA_CHANGE.CREATE_COMMENT, message);
    }
  }

  onTextareaInput(e, selectedEmotion) {
    console.log(selectedEmotion)
    this._selectedEmotion = selectedEmotion;
    document.addEventListener(`keydown`, this._onDocumentKeyDown)
  }

  update(data) {
    this._commentsData = data;
    this._commentsList.getElement().innerHTML = ``;
    console.log(this._commentsData)
    this._renderComments();
    this._movieCommentsContainer.update(this._commentsData.length);
  }

  _createNewMessage(emotion, comment) {
    return {
      id: getRandomString(3),
      comment,
      author: `secret`,
      date: new Date(),
      emotion: emotion ? emotion : EMOJIS.SMILE,
    }
  }

  unrender() {
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
