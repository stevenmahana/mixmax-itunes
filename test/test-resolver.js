var supertest = require('supertest')
    , should = require("should");

var server = supertest.agent("http://localhost:9145");


// UNIT test begin
describe("Testing Resolver",function(){

    it("testing good text param - should return array",function(done){

        server
            .get("/resolver?text=297957761")
            .expect("Content-type",/json/)
            .expect(200) // THis is HTTP response
            .end(done);
    });

    it("testing bad text param - should return array",function(done){

        server
            .get("/resolver?text=asdasds")
            .expect("Content-type",/json/)
            .expect(200) // THis is HTTP response
            .end(done);
    });

    it("testing empty text param - should return error",function(done){

        server
            .get("/resolver?text=")
            .expect("Content-type","text/html; charset=utf-8")
            .expect(500) // THis is HTTP response
            .end(done);
    });

    it("testing missing param - should return error",function(done){

        server
            .get("/resolver?")
            .expect("Content-type","text/html; charset=utf-8")
            .expect(500) // THis is HTTP response
            .end(done);
    });

});