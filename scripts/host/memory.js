//Makes an array for the memory and initializes all blocks to 00
// MaxMemory is 768 for project 3


function memory(){
	this.memory = [""];
	var i = 0;
	this.init = function() {
		while( i < _MaxMemory)
		{
			this.memory[i] = "00";
			document.getElementById(i).innerHTML=this.memory[i];
			i++;
		}
	};
	
	this.convert = function(location) 
	{
			var location = parseInt(location,16);
			return location;
		
	}
}