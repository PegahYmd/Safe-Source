'use strict';

function Block(IdBlock, IdPage, Type, Content, Position) {
  this.IdBlock = IdBlock;
  this.IdPage = IdPage;
  this.Type = Type;
  this.Content = Content;
  this.Position = Position;
}

function Page(IdPage, Title, IdAuthor, DateCreation, DatePublication, Name,LikesSum, category) {
  this.IdPage = IdPage;
  this.Title = Title;
  this.IdAuthor = IdAuthor;
  this.DateCreation = DateCreation;
  this.DatePublication = DatePublication;
  this.Name = Name;
  this.Blocks = [];
  this.LikesSum = LikesSum;
  this.category = category
}

function User(Id, Name) {
  this.IdUser = Id;
  this.Name = Name;
}

function Site(Id, Name) {
  this.IdSite = Id;
  this.Name = Name;
}

function Verify(Id, Link, Author, Title, Feedback){
  this.Id = Id;
  this.Link = Link;
  this.Author = Author;
  this.Title = Title;
  this.Feedback = Feedback;
}

export { Page, Block, User, Site, Verify };