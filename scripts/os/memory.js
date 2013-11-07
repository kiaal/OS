
//Makes an array for the memory and initializes all blocks to 00
// MaxMemory is 256 for project 2

function memory(){
	this.init = function() {
    this.memArray = [""];
	var i =0;
	while(i<_MaxMemory){
		memArray[i] = "00";
		document.getElementById(i).innerHTML=this.memArray[i];
		i++;
	}
    };
}