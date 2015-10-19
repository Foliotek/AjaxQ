(function () {
  'use strict';
  var oldExpect = window.expect;
  var expect = function(v) {
    return oldExpect(v);
  };

  describe('AjaxQ', function () {
    var xhr 
    beforeEach(function() {
        var self = this;
        self.xhr = sinon.useFakeXMLHttpRequest();

        self.requests = [];
        self.xhr.onCreate = function(xhr) {
            self.requests.push(xhr);
        }.bind(this);
    });

    afterEach(function() {
        this.xhr.restore();
    });

    describe('High level functions', function () {

      it('$.ajaxq', function (done) {
        var resp = {
          id: 1
        };
        $.ajaxq ('test-queue', {
            url: 'http://example.com',
            type: 'post'
        }).then(function (data) {
          expect(data).to.be.deep.equal(resp);
          done();
        });
        this.requests[0].respond(200, { "Content-Type": "application/json" },
                                 JSON.stringify(resp));
      });

      it('$.getq should return promise', function (done) {
        var resp = {
          id: 1
        };
        $.getq ('test-queue', 'http://example.com')
        .then(function (data) {
          expect(data).to.be.deep.equal(resp);
          done();
        });
        this.requests[0].respond(200, { "Content-Type": "application/json" },
                                 JSON.stringify(resp));
      });

      it('$.getq should call callback', function (done) {
        var resp = {
          id: 1
        };
        $.getq ('test-queue', 'http://example.com', function (data) {
                  expect(data).to.be.deep.equal(resp);
                  done();
               })
        this.requests[0].respond(200, { "Content-Type": "application/json" },
                                 JSON.stringify(resp));
      });

      it('$.postq should return promise', function (done) {
        var resp = {
          id: 1
        };
        $.postq ('test-queue','http://example.com')
        .then(function (data) {
          expect(data).to.be.deep.equal(resp);
          done();
        });
        this.requests[0].respond(200, { "Content-Type": "application/json" },
                                 JSON.stringify(resp));
      });

      it('$.postq should call callback', function (done) {
        var resp = {
          id: 1
        };
        $.postq ('test-queue','http://example.com', function (data) {
          expect(data).to.be.deep.equal(resp);
          done();
        });
        this.requests[0].respond(200, { "Content-Type": "application/json" },
                                 JSON.stringify(resp));
      });
    });

    describe('Test low level methods', function () {

      describe('$.ajaxq.isRunning', function () {

        it('should return true if any request running', function () {
          var self = this,
              resp = {
                id: 1
              };
          $.ajaxq ('test-isrunning-queue', {
                   url: 'http://example.com',
                   type: 'post'
          });
          expect($.ajaxq.isRunning()).to.be.ok;
          expect($.ajaxq.isRunning('test-isrunning-queue')).to.be.ok;
          self.requests[0].respond(200, { "Content-Type": "application/json" }, JSON.stringify(resp));
        });

        it('should return false if no request running', function (done) {
          var resp = {
            id: 1
          };
          var first = $.ajaxq ('test-isrunning-queue',{
                   url: 'http://example22.com',
                   type: 'post'
          });
          first.done(function () {
            setTimeout(function () {
              expect($.ajaxq.isRunning('test-isrunning-queue')).to.be.not.ok;
              done();
            }, 1)
          });
          this.requests[0].respond(200, { "Content-Type": "application/json" },
                                   JSON.stringify(resp));
        });

        it('should return false if queue is not added', function () {
          expect($.ajaxq.isRunning('test-nonexistent-queue')).to.be.not.ok;
        });
      });

      describe('$.ajax.getActiveRequest', function () {
        it('should throw error is no queue is defined', function () {
          expect($.ajaxq.abort).to.throw('AjaxQ: queue name is required');
        });

        it('should get active request', function (done) {
          var resp = {
            id: 1
          };
          $.ajaxq ('test-queue',{
                   url: 'http://example.com',
                   type: 'post'
          })
          .then(function () {
            done();
          });
          var xhr = $.ajaxq.getActiveRequest('test-queue');
          this.requests[0].respond(200, { "Content-Type": "application/json" },
                                   JSON.stringify(resp));
          expect(xhr.status).to.be.equal(200);
        });
      });

      describe('$.ajaxq.abort', function () {
        it('should throw error is no queue is defined', function () {
          expect($.ajaxq.abort).to.throw('AjaxQ: queue name is required');
        });

        it('should not resolve promise and queue should be empty', function () {
          var firstXhr = $.ajaxq('test-abort-queue', { 
                            url: 'http://example.com',
                            type: 'post'
          });
          var secondXhr = $.ajaxq('test-abort-queue', {
                                url: 'http://example.com',
                                type: 'post'
          });

          var cb = chai.spy();
          firstXhr.done(cb);

          $.ajaxq.abort('test-abort-queue');
          expect(this.requests[0].readyState).to.be.equal(0);
          expect(cb).to.not.have.been.called();
        });
      });

      describe('$.ajaxq.clear', function () {
        it('should resolve promise upon queue cleared and next request not executed', function (done) {

          var firstXhr = $.ajaxq('test-clear-queue', { 
                                url: 'http://example.com',
                                type: 'post'
          });
          var secondXhr = $.ajaxq('test-clear-queue', {
                                url: 'http://example.com',
                                type: 'post'
          });

          $.ajaxq.clear('test-clear-queue');
          firstXhr.done(function () {
              setTimeout(function(){
                  expect($.ajaxq.isRunning('test-clear-queue')).to.not.be.ok;
                  done();
              }, 1);
          });

          this.requests[0].respond(200, { "Content-Type": "application/json" }, JSON.stringify({}));
        });
      });
    });
  });
})();
