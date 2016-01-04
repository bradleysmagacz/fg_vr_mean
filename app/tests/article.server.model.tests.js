var app = require('../../server'),
    request = require('supertest'),
    should = require('should'),
    mongoose = require('mongoose'),
    User = mongoose.model('User'),
    Article = mongoose.model('Article');

var user, article;

describe('Article Model Unit Tests:', function() {
    beforeEach(function(done) {
        user = new User({
            email: 'test@test.com',
            first: 'Full',
            last: 'Name',
            username: 'username',
            password: 'password'
        });
        user.save(function() {
            article = new Article({
                title: 'Article Title',
                content: 'Article Content',
                user: user
            });
            done();
        });
    });

    describe('Testing the save method', function() {
        it('Should be able to save without problems', function() {
            article.save(function(err) {
                should.not.exist(err);
            });
        });
        it('Should not be able to save an article without a title', function() {
            article.title = '';
            article.save(function(err) {
                should.exist(err);
            });
        });
    });

    afterEach(function(done) {
        Article.remove(function() {
            User.remove(function() {
                done();
            });
        });
    });
});