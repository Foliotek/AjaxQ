(function () {
  'use strict';

  describe('AjaxQ', function () {
    beforeEach(function() {
        this.xhr = sinon.useFakeXMLHttpRequest();

        this.requests = [];
        this.xhr.onCreate = function(xhr) {
            this.requests.push(xhr);
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
          var resp = {
            id: 1
          };
          $.ajaxq ('test-queue',{
                   url: 'http://example.com',
                   type: 'post'
          });
          expect($.ajaxq.isRunning()).to.be.Ok;
          expect($.ajaxq.isRunning('test-queue')).to.be.Ok;
          this.requests[0].respond(200, { "Content-Type": "application/json" },
                                   JSON.stringify(resp));
        });

        it('should return false if no request running', function (done) {
          var resp = {
            id: 1
          };
          $.ajaxq ('test-queue',{
                   url: 'http://example.com',
                   type: 'post'
          })
          .then(function () {
            expect($.ajaxq.isRunning()).to.be.not.Ok;
            done();
          });
          this.requests[0].respond(200, { "Content-Type": "application/json" },
                                   JSON.stringify(resp));
        });

        it('should return false if queue is not added', function () {
          expect($.ajaxq.isRunning('test-nonexistent-queue')).to.be.not.Ok;
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

        xit('should resolve promise upon queue abort', function () {

        });
      });

      describe('$.ajaxq.clear', function () {
        xit('should resolve promise upon queue cleared', function () {

        });
      });
    });
  });
})();
