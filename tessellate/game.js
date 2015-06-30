/**
 * Returns a random integer between min (inclusive) and max (inclusive)
 * Using Math.round() will give you a non-uniform distribution!
 */
function getRandomPos(min, max) 
{
    return Math.floor(Math.random() * (max - min + 1)) + min;
}
/**
*
*
*/
$.fn.multiline = function(text)
{
    this.text(text);
    this.html(text.replace(/\n/g,'<br/>'));
    return this;
}
/**
*
*
*/
var levels=[];
function new_level(level_no,columns,rows,no_of_tiles)
{
	this.level_no=level_no;
	this.rows=rows;
	this.columns=columns;
	this.no_of_tiles=no_of_tiles;
}

levels.push(new new_level(0,0,0,5));//dummy
levels.push(new new_level(1,4,4,6));
levels.push(new new_level(2,4,5,7));
levels.push(new new_level(3,4,5,8));
levels.push(new new_level(4,4,5,9));
levels.push(new new_level(5,4,5,10));
levels.push(new new_level(6,4,5,11));
levels.push(new new_level(7,5,6,12));
levels.push(new new_level(8,5,6,13));
levels.push(new new_level(9,5,6,14));
levels.push(new new_level(10,6,6,15));
levels.push(new new_level(11,6,6,16));
levels.push(new new_level(12,6,6,17));
levels.push(new new_level(13,6,6,18));
levels.push(new new_level(14,6,6,19));
levels.push(new new_level(15,6,6,20));

var score=0;
var audio_playing;
var game_over=0;
var canvas = new fabric.Canvas('c');
//goto line 8424 for changing the style 
var ans_tiles;
var turns;
var current_level;
var random_colour;
var done_tiles;
var hints=4;

/**
*
*
*/
var fonts=[];
fonts.push('Comfortaa','Orbitron','Eater','Quicksand');
/**
*
*
*/
var tile_colours=[];
function new_colour(colour1,colour2)
{
	this.colour1=colour1;
	this.colour2=colour2;
}
tile_colours.push(new new_colour('#FF5714','#6EEB83'));
tile_colours.push(new new_colour('#50514F','#70C1B3'));
tile_colours.push(new new_colour('#FFBF00','#FFFFFF'));
tile_colours.push(new new_colour('#FF686B','#FFFFFF'));
tile_colours.push(new new_colour('#0B132B','#6FFFE9'));
tile_colours.push(new new_colour('#083D77','#F95738'));
tile_colours.push(new new_colour('#0B132B','#6FFFE9'));
tile_colours.push(new new_colour('#513B56','#BCE784'));
tile_colours.push(new new_colour('#42D9C8','#931621'));

/**
*
*
*/
var reloadButton  = document.querySelector( '.reload' );
var reloadSvg     = document.querySelector( 'svg' );
var reloadEnabled = true;
var rotation      = 0;

/**
*
*
*/
$("#reload_button").click(function()
	{
		reloadClick();		
	});
/**
*
*
*/
$("#hint_button").click(function()
{
	if(hints!=0)
		hint_turn(take_input);
	else
		end_game();
});
/**
* 
*
*/
function reloadClick()
	{
		  reloadEnabled = false;
		  rotation -= 180;  
		  // Eh, this works.
		  reloadSvg.style.webkitTransform = 'translateZ(0px) rotateZ( ' + rotation + 'deg )';
		  reloadSvg.style.MozTransform  = 'translateZ(0px) rotateZ( ' + rotation + 'deg )';
		  reloadSvg.style.transform  = 'translateZ(0px) rotateZ( ' + rotation + 'deg )';
		  if(hints!=0)
		  {
			  	//reducing points for reloading
			  	if(current_level!=1)
						 	score=score-200-(current_level-1)*1000;
				//end of points
			  	setTimeout(function() 
			  	{
			    	level_show(levels[current_level]);
				}, 400);	
		  }
		  else
		  {
			  	if(game_over==0)
			  		end_game();
			  	else
			  		new_game();
		  }	  
	}
/**
*
*
*/
function end_game()
	{
		canvas.clear();
		canvas.off('mouse:down');$("#hint_button").hide();
		//show game over ,score and replay sign;
		$("#levelsh").css({'font-family':fonts[getRandomPos(0,3)]});
		$("#levelsh").css({'line-height':'90%'});
		$("#levelsh").multiline("Game Over\n"+"Score"+score+"\n<small>"+"Click to start a new game."+"</small>");
		$("#levelsh").fadeIn("slow");$("#reload_button").fadeIn();$("#hint_button").css({'left':'85%'});
		game_over=1;
	}

/**
*
*
*/
function new_game()
	{
		score=0;hints=4;game_over=0;
	  	canvas.clear();
	  	$("#levelsh").hide();
		$("#reload_button").hide();
		$("#hint_button").hide();
		$('body').css('background-image','url("back_default.jpg")');
		$("#startbutton").fadeIn();

	}
/**
*
*
*/
function level_show(level)
	{	
		//Background generation
		$("#reload_button").hide();
		$("#hint_button").hide();
		if(hints==0) end_game();
		else
		{
			canvas.clear();
			canvas.calcOffset();

			var random_check=Math.floor(Math.random()*100);
			if(random_check%2==0)
			{
				var pattern = Trianglify({
			        width:window.innerWidth, 
			        height: window.innerHeight        
			    });
				$('body').css('background-image','url("'+pattern.png()+'")');
			}
			else
			{
				var gen=Math.random().toString(36).substring(7);
		 	   	var pattern = GeoPattern.generate(gen);
			    $('body').css('background-image',pattern.toDataUrl());
			}

			current_level=level.level_no;
			score = score + (current_level-1)*1000;	
			if(score<0) score=0;
			//random font
			$("#levelsh").css({'font-family':fonts[getRandomPos(0,3)]});

			$("#levelsh").multiline("<small>"+"Level "+current_level+"\n"+level.no_of_tiles+" Tiles\n"+"Score "+score+"</small>");
			$("#levelsh").fadeIn("fast",function()
				{
					setTimeout(function()
						{ 
							$("#levelsh").fadeOut("slow",function()
								{
									pre_show(level);
								});
					    },2000);
				});	
		}		
	}
/**
*
*
*/
function pre_show(level)
	{
		canvas.clear();
		//calculate positions based on level 
		canvas.setWidth(55*level.columns+5);
		canvas.setHeight(55*level.rows+5);
		canvas.calcOffset();
		canvas.off('mouse:down');
		//show level
		ans_tiles=[];var rand;
		while(ans_tiles.length!=level.no_of_tiles)
		{
			rand=getRandomPos(1,level.rows*level.columns);
			if(ans_tiles.indexOf(rand)==-1)
				ans_tiles.push(rand);
		}
		show(level);
	}
/**
*
*
*/
function show(level)
	{
		//actually show for some time x then wait for input;
		var l,t,tile;
		for (var i = 1; i <=level.rows*level.columns; i++) 
			{
				var tile = new fabric.Rect({width:50,height:50});
				tile.toObject = (function(toObject) {
				  return function() {
				    return fabric.util.object.extend(toObject.call(this), {
				      tile_number: this.tile_number
				    });
				  };
				})(tile.toObject);

				tile.tile_number=i;
				if(i%level.columns==0)
					{l=(level.columns-1)*55;t=(Math.floor(i/level.columns)-1)*55;}
				else
					{l=(i%level.columns-1)*55;t=Math.floor(i/level.columns)*55;}
				if(ans_tiles.indexOf(i)==-1)
						tile.set('fill',tile_colours[random_colour].colour1);
				else
						tile.set('fill',tile_colours[random_colour].colour2);
				tile.set({left:l+25+5,top:t+25+5,originX:'center',originY:'center'});
				tile.selectable=false;
				canvas.add(tile);
			};

		//make allcolour2
		canvas.renderAll();	
		setTimeout(function()
			{ 
				take_input(level);
			},level.no_of_tiles*200+500);
		//take_input(level);
	}
/**
*
*
*/
function take_input(level)
	{
		//check if its ans tiles or not and increase counter for chances
		if(hints!=0) 
			{
				if(hints!=1)
					$("#hint_button").text("Hints ("+(hints)+")");
				else
					$("#hint_button").text("Last Hint");
			}
		else 
			{$("#hint_button").text("Game Over");}
		if(level.no_of_tiles==ans_tiles.length)
			{
				//first time intialization
				turns=level.no_of_tiles;
				done_tiles=[];
			}
		$(".canvas-container").css('pointer-events','none');
		//critical , pointer events disabled
		for (var i = 0; i < ans_tiles.length; i++) 
			{
				if(i==ans_tiles.length-1)
					{
						canvas.item(ans_tiles[i]-1).animate('opacity', 1, {onChange: canvas.renderAll.bind(canvas),duration:100,onComplete:function()
							{ 
								for (var i = 0; i < ans_tiles.length; i++) 
								{
									canvas.item(ans_tiles[i]-1).set({opacity:1,fill:tile_colours[random_colour].colour1});							
								};
						 		canvas.renderAll();
								if(level.no_of_tiles==ans_tiles.length)
									{
										$("#reload_button").show();
										$("#hint_button").css({'left':'85%'});
										$("#hint_button").show();
									}
								//critical ends, pointer events enabled
								$(".canvas-container").css('pointer-events','auto');
					        }});
					}
					else
					{canvas.item(ans_tiles[i]-1).animate('opacity', 0, {onChange: canvas.renderAll.bind(canvas),duration:100});}			
			};		
		canvas.renderAll();
		canvas.on('mouse:down', function(options) 
		{	  
		  //critical ends, pointer events disabled
		  $(".canvas-container").css('pointer-events','none');    
		  if (options.target) 
		  {
		  	if(turns==level.no_of_tiles)
		  		{
		  			$("#reload_button").hide();
		  			$("#hint_button").css({'left':'50%'});//if one input received refresh option vanishes
		  		}
		  	if(options.target.type=='rect')
		    {
		    	var pos=ans_tiles.indexOf(options.target.tile_number);
		    	if(pos==-1 && done_tiles.indexOf(options.target.tile_number)==-1)
			    	{
			    		//flash a cross
			    		// $("#input_res").fadeIn(300,function(){$("#input_res").fadeOut("fast");});
			    		//change colour of the tile ,thats it.
			    		options.target.set('fill','#FF4F00');
								  		fabric.Image.fromURL('cross.png', function(oImg) 
								  		{
								  		  oImg.left=options.target.left;
								  		  oImg.top=options.target.top;
								  		  oImg.originY='center';
								  		  oImg.originX='center';
								  		  oImg.scale(1.2);
								  		  oImg.selectable=false;
										  canvas.add(oImg);
										});
						//image is not considered an object
				  		canvas.renderAll();	
				  		// Materialize.toast('Wrong Tile',500);
			    		turns--;
			    	}
		    	else
			    	{
			    		var random_rotation;
			    		random_rotation=Math.floor(Math.random()*100);
			    		if(random_rotation%2==0)
			    			random_rotation=-1;
			    		else
			    			random_rotation=+1;
			    		//correct ans and not previously pressed
			    		if(done_tiles.indexOf(options.target.tile_number)==-1 && done_tiles.length!=level.no_of_tiles-1)
			    		{
				    		turns--;
				    		options.target.animate('angle', random_rotation*180, 
					    		{
								  onChange: canvas.renderAll.bind(canvas),
								  duration: 200,
								  onComplete: function(){options.target.set('fill',tile_colours[random_colour].colour2);
								  canvas.renderAll();}
								});
							canvas.renderAll();
							done_tiles.push(ans_tiles[pos]);
							ans_tiles.splice(pos,1);
						}
						//last correct tile
						if(done_tiles.indexOf(options.target.tile_number)==-1 && done_tiles.length==level.no_of_tiles-1)
			    		{
				    		turns--;
				    		options.target.animate('angle', random_rotation*180, 
					    		{
								  onChange: canvas.renderAll.bind(canvas),
								  duration: 200,
								  onComplete: function()
								  	{
								  		options.target.set('fill','#32CD32');
								  		fabric.Image.fromURL('check.png', function(oImg) 
								  		{
								  		  oImg.left=options.target.left;
								  		  oImg.top=options.target.top;
								  		  oImg.originY='center';
								  		  oImg.originX='center';
								  		  oImg.scale(1.2);
								  		  oImg.selectable=false;
										  canvas.add(oImg);
										});
										//image is not considered an object
								  		canvas.renderAll();
								  	}
								});
							canvas.renderAll();
							done_tiles.push(ans_tiles[pos]);
							ans_tiles.splice(pos,1);
						}	    		
			    	}
		    	if(turns==0)
		    	{	
		    		//end  
		    		if(ans_tiles.length==0)
						setTimeout(function(){ level_show(levels[level.level_no+1]);},2000);
					else
					{
					 //remaining ones have to be changed				
					 while(ans_tiles.length)
					 {
					 	//animate it
					 	canvas.item(ans_tiles[0]-1).set({opacity:1,fill:tile_colours[random_colour].colour2});
					 	ans_tiles.splice(0,1);				 	
					 }
					 canvas.renderAll();
					 if(level.level_no!=1)
					 {
					 	if(level.level_no==2) score=score-500;
					 	else score=score-500-1000*(current_level-2);
					 	setTimeout(function(){ level_show(levels[level.level_no-1]);},2000);
					 }
					 else
					 setTimeout(function(){ level_show(levels[1]);},2000);
					}
		    	}
		    }
		  }
		  //critical ends, pointer events enabled
		  if(turns!=0)$(".canvas-container").css('pointer-events','auto');    
		});	
	}

function hint_turn(take_input)
	{
		canvas.off('mouse:down');
		for (var i = 0; i < ans_tiles.length; i++) 
			{
				if(i==ans_tiles.length-1)
					{
						canvas.item(ans_tiles[i]-1).animate('opacity', 0, {onChange: canvas.renderAll.bind(canvas),duration:200,onComplete:function()
							{ 
								for (var i = 0; i < ans_tiles.length; i++) 
								 {
									canvas.item(ans_tiles[i]-1).set({opacity:1,fill:tile_colours[random_colour].colour2});
								 };
						 		 canvas.renderAll();
						    }});
					}
				else
					{canvas.item(ans_tiles[i]-1).animate('opacity', 0, {onChange: canvas.renderAll.bind(canvas),duration:200});}			
			};
		canvas.renderAll();
		hints--;
		setTimeout(function()
			{
				take_input(levels[current_level]);
			},levels[current_level].no_of_tiles*200+500);
	}

$(function()
	{
			// Vars
		document.getElementById('player').volume=.2;
		$('#player_button').click(function() 
		  {
		  	  $(this).toggleClass("waves-green");
		  	  $(this).toggleClass("waves-red");
		      if (audio_playing == false) 
		      {
		        document.getElementById('player').play();
		        audio_playing = true;
		      } 
		      else 
		      {
		        document.getElementById('player').pause();
		        audio_playing = false;
		      }
		  });
		document.getElementById('player').play();
		audio_playing=true;
		$("#input_res").hide();
		$("#reload_button").hide();
		$("#hint_button").hide();
		$("#startbutton").click(function()
			{
				$("#startbutton").fadeOut("slow",function()
					{
						random_colour=getRandomPos(0,8);
						level_show(levels[1]);
					});
			});	
	});
