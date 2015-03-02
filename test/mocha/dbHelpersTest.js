var should = require('should');
var monk = require('monk');
var expect = require('expect');
var helpersDB = require('../../models/helpersDatabase');



describe("connection and initialization of DB",function(){

  it('should be connected',function(done){
    var db = monk('localhost/playlisterTest');
    should.exists(db);
    done();
  });

  it('should get hold of a collection',function(done){
    var db = monk('localhost/playlisterTest');
    var collectionName = db.get("ppSpotifyCredentials");
    should.exists(collectionName);
    done();
  });

});

describe('should add data',function(){

  var db,collectionName = {};

  beforeEach(function(done){
    db = monk('localhost/playlisterTest');
    collectionName = db.get('ppSpotifyCredentials');
    done();
  });

  after(function(done){
    // monk('localhost/playlisterTest')
    // .get('ppSpotifyCredentials')
    console.log('DB: ' + db);
    console.log('Collection Name; ' + collectionName);
    db.collectionName.drop(function(err){
      if(err) return done(err);
    });
    done();
  });

  it('should save and read data',function(done){
    var db = monk('localhost/playlisterTest');
    var collectionName = db.get('ppSpotifyCredentials');
    var collectionObject = {spotifyID:"nameTest",spotifyAccessToken:'9999',
                        spotifyRefreshToken:'8888'};
    helpersDB.saveToDatabase(db, collectionName, collectionObject).
      then(collectionName.findOne({}, function(err, doc){
      if (err) return done(err);
      console.log(doc);
      should.exists(doc);
      done();
    }));
  });

});
