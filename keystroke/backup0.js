/***********************************************************
                       Keystroke.js
                        
        This is the pre-alpha v-0.0.1 of Keystroke.js
                            by 
    Event Horizon(bezoar17,fourEC,jayantabh,SatwikPrabhuK)
************************************************************/
// FUNCTIONS & VARIABLES TO BE USED AHEAD
var downstrokes=0,upstrokes=0;
//OBJECT CREATING FUNCTIONS
function strokes(code,type,time)
{
    this.code=code;
    this.type=type;
    this.time=time;
}
function n_graph(character,duration,weight) 
{
    this.character=character;
    this.duration=duration;
    this.weight=weight;
}
//checks is object exists already or not
function exists(arr, elem) 
{
    for (var x = 0; x < arr.length; x++) {
        if (arr[x].character == elem) {
            return x; //returning index if element found
        }
    }
    return -1;//returning -1 if element not found
}
//useful 
function letter(charac,downtime,uptime)
{
    this.charac=charac;
    this.downtime=downtime;
    this.uptime=uptime;
}
//Constructor defining Keystroke object structure
function Keystroke () 
{
    this.inputtext = ''; //the typed text
    //arrays holding timestamp
    this.monographTimes = []; 
    this.digraphUUTimes = [];
    this.digraphUDTimes = []; 
    this.digraphDUTimes = [];
    this.digraphDDTimes = [];
    this.trigraphUUTimes = [];
    this.trigraphUDTimes = [];
    this.trigraphDUTimes = [];
    this.trigraphDDTimes = [];  
    //raw and pure events and times
    this.raw=[];
    this.pure=[];

    this.all_letters=[];

    //HELPER FUNCTIONS  
    //prev_down,prev_press,next_press,next_up  are four functions which each take 2 arguments [i,check] i: current index & check: true/false  
    //according to whether to find the key(down,press,up) of corresponding keycode(true) of irrespective of keycode(false)
    this.prev_down = function(i,check)
        {
            for(var k=i-1;k>=0;k--)
            {
                if (this.raw[k].type=="keydown") 
                {   
                    if (this.raw[i].code==this.raw[k].code && check==true) 
                    {
                        return k;
                    }
                    else if(check==false)
                    return k;
                    
                }
            }
            return null;
        }
    this.next_down = function(i,check) 
        {
            for(var k=i+1;k<this.raw.length;k++)
            {
                if (this.raw[k].type=="keydown") 
                {
                    if (this.raw[i].code==this.raw[k].code && check==true ) 
                    {
                        return k;
                    }
                    else if(check==false) 
                    return k;
                }
            }   
            return null; 
        }
    this.prev_press = function(i,check) 
        {
            for(var k=i-1;k>=0;k--)
            {
                if (this.raw[k].type=="keypress") 
                {
                    if (this.raw[i].code==this.raw[k].code && check==true ) 
                    {
                        return k;
                    }
                    else if(check==false) 
                    return k;
                }
            } 
            return null;   
        }
    this.next_press = function(i,check)
        {
            for(var k=i+1;k<this.raw.length;k++)
            {
                if (this.raw[k].type=="keypress") 
                {
                    if (this.raw[i].code==this.raw[k].code && check==true ) 
                    {
                        return k;
                    }
                    else if(check==false)
                    return k;
                }
            }  
            return null;  
        }
    this.prev_up = function (i,check)
        {
            for(var k=i-1;k>=0;k--)
            {
                if (this.raw[k].type=="keyup") 
                {   
                    if (this.raw[i].code==this.raw[k].code && check==true) 
                    {
                        return k;
                    }
                    else if(check==false)
                    return k;
                    
                }
            }
            return null;
        }
    this.next_up = function(i,check) 
        {
            for(var k=i+1;k<this.raw.length;k++)
            {
                if (this.raw[k].type=="keyup") 
                {
                    if (this.raw[i].code==this.raw[k].code && check==true ) 
                    {
                        return k;
                    }
                    else if(check==false) 
                    return k;
                }
            }    
            return null;
        }

    //populate() extracts n-graph timings from the raw timings
    this.populate = function() 
        {
            //populating monographTimes
            for (var i = 0; i <= this.prev_down(this.raw.length-1,false); i++) 
            {
                if (this.raw[i].type=="keydown") 
                {
                    var existence=exists(this.monographTimes,String.fromCharCode(this.raw[i].code));
                   if( existence != -1)
                    {
                        this.monographTimes[existence].duration=((this.monographTimes[existence].duration*this.monographTimes[existence].weight)+this.raw[this.next_up(i,true)].time-this.raw[i].time)/(this.monographTimes[existence].weight+1);
                        this.monographTimes[existence].weight+=1;
                    }
                    else
                    this.monographTimes.push(new n_graph(String.fromCharCode(this.raw[i].code),this.raw[this.next_up(i,true)].time-this.raw[i].time,1));
                
                }   
            }
            /*
            //populating digraphUUTimes
            for(var i=0;i <= this.prev_down(this.prev_down(this.raw.length-1,false),false);i++)
            {
                if(this.raw[i].type="keydown")
                {

                    var character=String.fromCharCode(this.raw[i].code,this.raw[this.next_down(i,false)].code);
                    var existence=exists(this.digraphUUTimes,character);
                    var duration= this.raw[this.next_up(this.next_down(i,false),true)].time -this.raw[this.next_up(i,true)].time;
                    if(existence!= -1)
                    {
                        this.digraphUUTimes[existence].duration=((this.digraphUUTimes[existence].duration*this.digraphUUTimes[existence].weight)+duration)/(this.digraphUUTimes[existence].weight+1);
                        this.digraphUUTimes[existence].weight+=1;
                    }
                    else
                    {
                        this.digraphUUTimes.push(new n_graph(character,duration,1));
                    }
                }
            }
            
            //populating digraphUDTimes
            for(var i=0;i <= this.prev_down(this.prev_down(this.raw.length-1,false),false);i++)
            {
                if(this.raw[i].type="keydown")
                {

                    var character=String.fromCharCode(this.raw[i].code,this.raw[this.next_down(i,false)].code);
                    var existence=exists(this.digraphUDTimes,character);
                    var duration= this.raw[this.next_up(this.next_down(i,false),true)].time -this.raw[i].time;//2rp
                    if(existence!= -1)
                    {
                        this.digraphUDTimes[existence].duration=((this.digraphUDTimes[existence].duration*this.digraphUDTimes[existence].weight)+duration)/(this.digraphUDTimes[existence].weight+1);
                        this.digraphUDTimes[existence].weight+=1;
                    }
                    else
                    {
                        this.digraphUDTimes.push(new n_graph(character,duration,1));
                    }
                }
            }
            
            //populating digraphDUTimes
            for(var i=0;i <= this.prev_down(this.prev_down(this.raw.length-1,false),false);i++)
            {
                if(this.raw[i].type="keydown")
                {

                    var character=String.fromCharCode(this.raw[i].code,this.raw[this.next_down(i,false)].code);
                    var existence=exists(this.digraphDUTimes,character);
                    var duration= this.raw[this.next_down(i,false)].time - this.raw[this.next_up(i,true)].time;//2pr
                    if(existence!= -1)
                    {
                        this.digraphDUTimes[existence].duration=((this.digraphDUTimes[existence].duration*this.digraphDUTimes[existence].weight)+duration)/(this.digraphDUTimes[existence].weight+1);
                        this.digraphDUTimes[existence].weight+=1;
                    }
                    else
                    {
                        this.digraphDUTimes.push(new n_graph(character,duration,1));
                    }
                }
            }

            //populating digraphDDTimes
            for(var i=0;i <= this.prev_down(this.prev_down(this.raw.length-1,false),false);i++)
            {
                if(this.raw[i].type="keydown")
                {

                    var character=String.fromCharCode(this.raw[i].code,this.raw[this.next_down(i,false)].code);
                    var existence=exists(this.digraphDDTimes,character);
                    var duration= this.raw[this.next_down(i,false)].time - this.raw[i].time;//2pp
                    if(existence!= -1)
                    {
                        this.digraphDDTimes[existence].duration=((this.digraphDDTimes[existence].duration*this.digraphDDTimes[existence].weight)+duration)/(this.digraphDDTimes[existence].weight+1);
                        this.digraphDDTimes[existence].weight+=1;
                    }
                    else
                    {
                        this.digraphDDTimes.push(new n_graph(character,duration,1));
                    }
                }
            } 
            */
                 
        }
    //other attempt at populate 
    this.populate_1=function()
    {
        for(var i=0;i <= this.prev_down(this.raw.length-1,false);i++)
        {
            if(this.raw[i].type=="keydown")
            {
                this.all_letters.push(new letter(this.raw[i].code,this.raw[i].time,this.raw[this.next_up(i,true)].time));//populating this.all_letters
            }
        }
        
        for(var i=0;i<this.all_letters.length;i++)
        {
            var duration0=this.all_letters[i].uptime-this.all_letters[i].downtime;//mono
            var existence0=exists(this.monographTimes,String.fromCharCode(this.all_letters[i].charac));//mono

            if(existence0 == -1)this.monographTimes.push(new n_graph(String.fromCharCode(this.all_letters[i].charac),duration0,1));
                else{
                    this.monographTimes[existence0].duration=((this.monographTimes[existence0].duration)*(this.monographTimes[existence0].weight)+duration0)/(this.monographTimes[existence0].weight+1);
                    this.monographTimes[existence0].weight+=1;
                }
        }

        for (var i = 0; i < this.all_letters.length-1; i++) 
            {
                var character=String.fromCharCode(this.all_letters[i].charac,this.all_letters[i+1].charac);                
                var duration1=this.all_letters[i+1].uptime-this.all_letters[i].uptime;//uu
                var duration2=this.all_letters[i+1].uptime - this.all_letters[i].downtime;//ud
                var duration3=this.all_letters[i+1].downtime - this.all_letters[i].uptime;//du
                var duration4=this.all_letters[i+1].downtime- this.all_letters[i].downtime;//dd                
                var existence1=exists(this.digraphUUTimes,character);
                var existence2=exists(this.digraphUDTimes,character);
                var existence3=exists(this.digraphDUTimes,character);
                var existence4=exists(this.digraphDDTimes,character);                
                if(existence1 == -1)this.digraphUUTimes.push(new n_graph(character,duration1,1));
                else{
                    this.digraphUUTimes[existence1].duration=((this.digraphUUTimes[existence1].duration)*(this.digraphUUTimes[existence1].weight)+duration1)/(this.digraphUUTimes[existence1].weight+1);
                    this.digraphUUTimes[existence1].weight+=1;
                }
                if(existence2 == -1)this.digraphUDTimes.push(new n_graph(character,duration2,1));
                else{
                    this.digraphDUTimes[existence2].duration=((this.digraphUDTimes[existence2].duration)*(this.digraphUDTimes[existence2].weight)+duration2)/(this.digraphUDTimes[existence2].weight+1);;
                    this.digraphDUTimes[existence2].weight+=1;
                }
                if(existence3 == -1)this.digraphDUTimes.push(new n_graph(character,duration3,1));
                else{
                    this.digraphUDTimes[existence3].duration=((this.digraphDUTimes[existence3].duration)*(this.digraphDUTimes[existence3].weight)+duration3)/(this.digraphDUTimes[existence3].weight+1);;
                    this.digraphUDTimes[existence3].weight+=1;
                }
                if(existence4 == -1)this.digraphDDTimes.push(new n_graph(character,duration4,1));
                else{
                    this.digraphDDTimes[existence4].duration=((this.digraphDDTimes[existence4].duration)*(this.digraphDDTimes[existence4].weight)+duration4)/(this.digraphDDTimes[existence4].weight+1);;
                    this.digraphDDTimes[existence4].weight+=1;
                }
            };
    }
    //other attempt at populate
    this.populate_2=function(){
        //populating all of them at once   
        for(var i=0;i <= this.prev_down(this.prev_down(this.raw.length-1,false),false);i++)
            {
                if(this.raw[i].type="keydown")
                {

                    var character=String.fromCharCode(this.raw[i].code,this.raw[this.next_down(i,false)].code);
                    var existence1=exists(this.digraphUUTimes,character);
                    var existence2=exists(this.digraphUDTimes,character);
                    var existence3=exists(this.digraphDUTimes,character);
                    var existence4=exists(this.digraphDDTimes,character);
                    var duration1= this.raw[this.next_up(this.next_down(i,false),true)].time -this.raw[this.next_up(i,true)].time;//2rr UU
                    var duration2= this.raw[this.next_up(this.next_down(i,false),true)].time -this.raw[i].time;//2rp UD
                    var duration3= this.raw[this.next_down(i,false)].time - this.raw[this.next_up(i,true)].time;//2pr DU
                    var duration4= this.raw[this.next_down(i,false)].time - this.raw[i].time;//2pp DD
                    if(existence1!= -1)
                    {
                        this.digraphUUTimes[existence1].duration=((this.digraphUUTimes[existence1].duration*this.digraphUUTimes[existence1].weight)+duration1)/(this.digraphUUTimes[existence1].weight+1);
                        this.digraphUUTimes[existence1].weight+=1;
                    }
                    else
                    {
                        this.digraphUUTimes.push(new n_graph(character,duration1,1));
                    }
                    if(existence2!= -1)
                    {
                        this.digraphUDTimes[existence2].duration=((this.digraphUDTimes[existence2].duration*this.digraphUDTimes[existence2].weight)+duration2)/(this.digraphUDTimes[existence2].weight+1);
                        this.digraphUDTimes[existence2].weight+=1;
                    }
                    else
                    {
                        this.digraphUDTimes.push(new n_graph(character,duration2,1));
                    }
                    if(existence3!= -1)
                    {
                        this.digraphDUTimes[existence3].duration=((this.digraphDUTimes[existence3].duration*this.digraphDUTimes[existence3].weight)+duration3)/(this.digraphDUTimes[existence3].weight+1);
                        this.digraphDUTimes[existence3].weight+=1;
                    }
                    else
                    {
                        this.digraphDUTimes.push(new n_graph(character,duration3,1));
                    }
                    if(existence4!= -1)
                    {
                        this.digraphDDTimes[existence4].duration=((this.digraphDDTimes[existence4].duration*this.digraphDDTimes[existence4].weight)+duration4)/(this.digraphDDTimes[existence4].weight+1);
                        this.digraphDDTimes[existence4].weight+=1;
                    }
                    else
                    {
                        this.digraphDDTimes.push(new n_graph(character,duration4,1));
                    }
                }
            }
    }
    //cleanup() is performed to cleanup the pure this.raw to form the raw this.raw by deleting the keypresses and Backspace keys.
    this.cleanup = function () 
        {
            //modifying the this.raw array to eliminate the keypress and have correct codes.
            for (var i = 0; i < this.raw.length; i++) 
            {   
                if(this.raw[i].type == "keypress")
                {
                    
                    /* Taken this concept lite
                    if(this.prev_down(i,true) == null)
                    {
                        //change both prevkeydown and nextkeyup.
                        this.raw[this.prev_down(i,false)].code=this.raw[i].code;
                        //keyup is registered according to keypress
                    }*/
                    this.raw.splice(i,1); 
                    //else nothing happens
                }
            }
            //discard all those threshold values;
            /*
            //execute Backspace deletion.
            for (var i = 0; i < this.raw.length; i++) 
            {   
                if(this.raw[i].code==8 && this.raw[i].type=="keydown")
                {   
                    this.raw.splice(this.prev_down(i,false),1);
                    this.raw.splice(this.next_up(i,false),1);
                    this.raw.splice(i,1);
                    this.raw.splice(this.next_up(i,true),1);
                }
                
            }
            
            //delete all the BAD values
            for (var i = 0; i < this.raw.length; i++) 
            {   
                if (this.raw[i].code==9 || this.raw[i].code==13 || this.raw[i].code==17 || this.raw[i].code==18 || this.raw[i].code==19 || this.raw[i].code==27 || this.raw[i].code==33 
                    || this.raw[i].code==34 || this.raw[i].code==35 || this.raw[i].code==36 || this.raw[i].code==37 || this.raw[i].code==38 || this.raw[i].code==39 || this.raw[i].code==40
                    || this.raw[i].code==45 || this.raw[i].code==93 || this.raw[i].code==144 || this.raw[i].code==145 || this.raw[i].code==46 ) 
                {
                    this.raw.splice(i,1);
                    this.raw.splice(this.next_up(i,true),1);
                }
            }
            */
            
        }
                   
}
//member functions of Keystroke
Keystroke.prototype = {
    constructor: Keystroke,
    //input functions
    listen:function (identity)                  
                    {   
                        var refer=this;
                        console.log(identity);
                        $('#' + identity).keyup(function(event)
                                                          {
                                                            //Enter
                                                            if(event.which != 13)
                                                            {
                                                            upstrokes++;                                            
                                                            refer.pure.push(new strokes(event.which,"keyup",event.timeStamp));
                                                            refer.raw.push(new strokes(event.which,"keyup",event.timeStamp));
                                                            } 
                                                            //change value of keyup acc to keypress for raw
                                                            /* Taken this concept lite 
                                                            if( refer.next_press(refer.prev_down(refer.raw.length-1,true),false)!= null)
                                                            {refer.raw[refer.raw.length-1].code=refer.raw[refer.next_press(refer.prev_down(refer.raw.length-1,true),false)].code;}
                                                            } */ 
                                                            else
                                                            {

                                                            }                                     
                                                          })
                                         .keydown(function(event)
                                                          {
                                                            //Enter
                                                            if ( event.which == 13 ) 
                                                            {
                                                              event.preventDefault();
                                                              refer.inputtext=refer.inputtext+"~~~~~"+$('#' + identity).val();                                                                                                                                                                                          
                                                              
                                                            }
                                                            //other than Enter
                                                            else
                                                            {
                                                              downstrokes++;                                               
                                                              refer.pure.push(new strokes(event.which,"keydown",event.timeStamp));
                                                              refer.raw.push(new strokes(event.which,"keydown",event.timeStamp));
                                                            }
                                                            
                                                          });
                                         /*.keypress(function( event)
                                                          {
                                                              refer.pure.push(new strokes(event.which,"keypress",event.timeStamp));
                                                              refer.raw.push(new strokes(event.which,"keypress",event.timeStamp));            
                                                            
                                                          }); */
                    },
    trainModelFromField:function(elementID,algorithm){},
    trainModelFromFile:function(datasetFilepath){},
    loadModelFromFile:function(filepath){},    
    //utility functions
    testModel:function(){},
    setSecurityToField:function(elementID){},
    //algorithmic functions
    arrayDisorder:function(trained,input){},
    neuralNetwork:function(trained,input){},
    
    //PROVIDER FUNCTIONS
    /*
        get_ngraph usage :
        var value;
        value=hello.get_ngraph();  
        value=hello.get_ngraph('monograph'); value.monograph is an array of objects where each is character,duration
        value=hello.get_ngraph('digraph'); value.digraph.UUT is an array of objects where each is character,duration
        value=hello.get_ngraph('trigraph'); 
    */
    get_ngraph:function()
    {
        this.cleanup();// not actually necessary but playing safe have to check this sometime
        this.populate_1();
        var result=new Object();//cannot add properties to undefined 
        if(arguments.length==0)
        {
            result.monograph=this.monographTimes;
            result.digraph={UUT:this.digraphUUTimes,UDT:this.digraphUDTimes,DUT:this.digraphDUTimes,DDT:this.digraphDDTimes};
            result.trigraph={UUT:this.trigraphUUTimes,UDT:this.trigraphUDTimes,DUT:this.trigraphDUTimes,DDT:this.trigraphDDTimes};
        }
        else
        {
            for (var i = 0; i < arguments.length; i++) 
                {
                 if(arguments[i]=="monograph")
                 {
                    result.monograph=this.monographTimes;
                 } 
                 else if(arguments[i]=="digraph")
                 {
                    result.digraph={UUT:this.digraphUUTimes,UDT:this.digraphUDTimes,DUT:this.digraphDUTimes,DDT:this.digraphDDTimes};
                 }
                 else if(arguments[i]=="trigraph")
                 {
                    result.trigraph={UUT:this.trigraphUUTimes,UDT:this.trigraphUDTimes,DUT:this.trigraphDUTimes,DDT:this.trigraphDDTimes};
                 }
                }
        }
        
        return result; 
    },
    get_raw_timings:function()
    {
        this.cleanup();
        return this.raw;
    },
    get_pure_timings:function()
    {
        return this.pure;
    },
    get_input_text:function()
    {
        return this.inputtext;
    },
    //output functions
    saveModelToFile:function()
    {
        //txt,csv
    },
    getJSON:function()
    {
        var result;        
        result=JSON.stringify(get_ngraph.apply(null,arguments));
        return result;
    }
};