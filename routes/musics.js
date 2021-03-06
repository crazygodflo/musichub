var express = require('express');
var util = require('util');
var router = express.Router();

// client list
router.get('/', function(req, res) {
    console.log('loading...')
    
  Music.find().distinct("genre").exec(function(err, genreList)
  {
    genreList.sort();
    Music.find().sort({'album' : 1, 'title' : 1}).exec(function(err, musicFileList)
    {
        if (err)    throw err;
        
        console.log('Found smthg...')
        var jsonGenreList = []
        jsonGenreList.push({"genre" : "", "display" : "All"})
        genreList.forEach(function(genre)
        {
            jsonGenreList.push({"genre" : genre, "display" : genre});
        });
        console.log('Pushed...')
        
        res.render('index', {musicFileList : musicFileList, genreList : jsonGenreList});
    });      
  });
});

// visualisation
router.get('/visu1', function(req, res)
{
    Genre.find().exec(function(err, genreList)
    {
        var jsonGenreList = [];
        genreList.forEach(function(g)
        {
           jsonGenreList.push({'genre' : g.genre, 'number' : g.number}); 
        });
        res.render('visu1', {data : JSON.stringify(jsonGenreList)});
    });
});

router.get('/visu2', function(req, res)
{
    Genre.find().exec(function(err, genreList)
    {
        var jsonGenreList = [];
        genreList.forEach(function(g)
        {
           jsonGenreList.push({'genre' : g.genre, 'number' : g.number}); 
        });
        res.render('visu2', {data : JSON.stringify(jsonGenreList)});
    });
});

router.get('/visu3', function(req, res)
{
    Genre.find().exec(function(err, genreList)
    {
        var jsonGenreList = [];
        genreList.forEach(function(g)
        {
           jsonGenreList.push({'genre' : g.genre, 'number' : g.number}); 
        });
        res.render('visu3', {data : JSON.stringify(jsonGenreList)});
    });
});

// tracking
router.post('/fromtogenre', function(req, postres)
{
    console.log('POST fromtogenre')
    var fromto = req.body;
    if (fromto.from && fromto.to)
    {
        console.log(fromto.from);
        console.log(fromto.to);
        if (fromto.from === fromto.to)  return;
        FromTo.findOne({'from' : fromto.from, 'to' : fromto.to}, 'number', function(err, res)
        {
            var nb = 1;
            if (err) return handleError(err);
            if (res)    nb = res.number  + 1;
            FromTo.update({'from' : fromto.from, 'to' : fromto.to}, {'number' : nb},  {upsert : true}, function(err, numberAffected)
            {
                if (err) return handleError(err);
                console.log('Updated fromtos collection');
                postres.end();
            });
        });
    }
});

router.post('/genre', function(req, postres)
{    
    var genre = req.body.genre;
    console.log('POST genre')
    if (!genre) return;
    Genre.findOne({'genre' : genre}, 'number', function(err, res)
    {
        var nb = 1;
        if (err) return handleError(err);
        if (res)    nb = res.number + 1;
        Genre.update({'genre' : genre}, {'number' : nb}, {upsert : true}, function(err, res)
        {
            if (err) return handleError(err);
            console.log('Updated genres collection - Genre ' + genre + ' listened ' + nb + 'times');
            postres.end();
        })
    })
});


module.exports = router;

