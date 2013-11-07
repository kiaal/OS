function meemory()
{
	this.memArray=[""];
	this.init = function(){
		var i = 0;
		while(i<_MaxMemory){
			this.memArray[i] = "00";
			document.getElementById(""+i).innerHTML=this.memArray[i];
			i++;
		}
	}
}