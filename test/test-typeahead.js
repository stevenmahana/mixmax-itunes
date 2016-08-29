var supertest = require('supertest')
    , should = require("should");

var server = supertest.agent("http://localhost:9145");


// UNIT test begin
describe("Testing Typeahead",function(){

    it("testing good text param - should return array",function(done){

        server
            .get("/typeahead?text=jack")
            .expect("Content-type", /json/)
            .expect(200) // THis is HTTP response
            .end(done);
    });

    it("testing empty text param - should return array",function(done){

        server
            .get("/typeahead?text=")
            .expect("Content-type", /json/)
            .expect(200) // THis is HTTP response
            .end(done);
    });

    it("testing missing param - should return array",function(done){

        server
            .get("/typeahead?")
            .expect("Content-type", /json/)
            .expect(200) // THis is HTTP response
            .end(done);
    });

});