/* ------------  
   CPU.js

   Requires global.js.
   
   Routines for the host CPU simulation, NOT for the OS itself.  
   In this manner, it's A LITTLE BIT like a hypervisor,
   in that the Document environment inside a browser is the "bare metal" (so to speak) for which we write code
   that hosts our client OS. But that analogy only goes so far, and the lines are blurred, because we are using
   JavaScript in both the host and client environments.

   This code references page numbers in the text book: 
   Operating System Concepts 8th edition by Silberschatz, Galvin, and Gagne.  ISBN 978-0-470-12872-5
   ------------ */

function Cpu() {
		this.PC    = 0;
        this.Acc   = 0;
        this.Xreg  = 0;
        this.Yreg  = 0;
        this.Zflag = 0;      
        this.isExecuting = false;  
		this.QuantumSeperation = _Quantum;
		this.SeperationValidOpCode = 0;
    
    this.init = function() {
		this.PC    = 0;     // Program Counter
		document.getElementById('PC').innerHTML=this.PC;
		this.Acc   = 0;     // Accumulator
		document.getElementById('ACC').innerHTML=this.Acc;
		this.Xreg  = 0;     // X register
		document.getElementById('X').innerHTML=this.Xreg;
		this.Yreg  = 0;     // Y register
		document.getElementById('Y').innerHTML=this.Yreg;
		this.Zflag = 0;     // Z-ero flag (Think of it as "isZero".)
		document.getElementById('Z').innerHTML=this.Zflag;
		this.isExecuting = false;
		_PCB = new PCB;
		_PCB.init(0);
    };
    
    this.cycle = function() {
        krnTrace("CPU cycle");
        // Do the real work here. Be sure to set this.isExecuting appropriately.
		if(this.isExecuting)
		{
			this.CPUScheduler();
			var op = _Memory.memory[this.PC + _PCB.base];
			switch(op)
			{
				case "A9":
				 //load accumulator with a constant
				{
					this.Acc = parseInt(_Memory.memory[++this.PC + _PCB.base], 16);
					document.getElementById('ACC').innerHTML=this.Acc;
					this.SeperationValidOpCode = 0;
					break;
				}
				case "AD":
				 //load the accumulator from memory
				{
					var location = _Memory.memory[++this.PC + _PCB.base];
					this.Acc = _Memory.memory[_PCB.checkLimit(_Memory.convert(location))];
					document.getElementById('ACC').innerHTML=this.Acc;
					this.SeperationValidOpCode = 0;
					break;
				}
				case "8D":
				//store the accumulator in memory
				{
					var location = _Memory.memory[++this.PC + _PCB.base];
					_Memory.memory[_PCB.checkLimit(_Memory.convert(location))] = this.Acc.toString(16);
					document.getElementById(_PCB.checkLimit(_Memory.convert(location))).innerHTML=this.Acc.toString(16).toUpperCase();
					this.SeperationValidOpCode = 0;
					break;
				}
				case "6D":
				//load with carry, add an address to accumulator
				{
					var adder = _Memory.memory[++this.PC + _PCB.base];
					this.Acc = this.Acc + parseInt(_Memory.memory[_PCB.checkLimit(_Memory.convert(adder))], 16);
					document.getElementById("ACC").innerHTML=this.Acc;
					this.SeperationValidOpCode = 0;
					break;
				}
				case "A2":
				//load x register with a constant
				{
					this.Xreg = parseInt(_Memory.memory[++this.PC + _PCB.base],16);
					document.getElementById("X").innerHTML=this.Xreg.toString(16);
					this.SeperationValidOpCode = 0;
					break;
				}
				case "AE":
				//load x register from memory
				{
					var location = _Memory.memory[++this.PC + _PCB.base];
					this.Xreg = parseInt(_Memory.memory[_PCB.checkLimit(_Memory.convert(location))], 16);
					document.getElementById("X").innerHTML=this.Xreg.toString(16);
					this.SeperationValidOpCode = 0;
					break;
				}
				case "A0":
				//load y register with a constant
				{
					this.Yreg = parseInt(_Memory.memory[++this.PC + _PCB.base],16);
					document.getElementById("Y").innerHTML=this.Yreg.toString(16);
					this.SeperationValidOpCode = 0;
					break;
				}
				case "AC":
				//load y register from memory
				{
					var location = _Memory.memory[++this.PC + _PCB.base];
					this.Yreg = parseInt(_Memory.memory[_PCB.checkLimit(_Memory.convert(location))], 16);
					document.getElementById("Y").innerHTML=this.Yreg.toString(16);
					this.SeperationValidOpCode = 0;
					break;
				}
				case "EA":
				//do nothing
				{
					this.SeperationValidOpCode = 0;
					break;
				}
				case "00":
				 //break
				{
					if((_Memory.memory[(this.PC + _PCB.base) + 1] === "00") && (_Memory.memory[(this.PC + _PCB.base) + 2] === "00") && (_Memory.memory[(this.PC + _PCB.base) + 3] === "00"))
					{
						if(_ReadyQueue.isEmpty())
						{
							_PCB.isDone = true;
							_PCB.ACCVal = 0;
							_PCB.XRegVal = 0;
							_PCB.YRegVal = 0;
							_PCB.ZFlagVal = 0;
							this.Acc   = 0;
							this.Xreg  = 0;
							this.Yreg  = 0;
							this.Zflag = 0;
							this.isExecuting = false;
						}
						else
						{
							_PCB.isDone = true;
							_PCB.ACCVal = 0;
							_PCB.XRegVal = 0;
							_PCB.YRegVal = 0;
							_PCB.ZFlagVal = 0;
							this.Acc   = 0;
							this.Xreg  = 0;
							this.Yreg  = 0;
							this.Zflag = 0;
							_KernelInterruptQueue.enqueue( new Interrupt(CONTEXTSWITCH_IRQ, 0) );
						}
					}
					this.SeperationValidOpCode = 0;
					break;
				}
				case "EC":
				//compare a byte in memory to the x reg sets z flag if equal
				{
					var location = _Memory.memory[++this.PC + _PCB.base];
					if(this.Xreg != _Memory.memory[_PCB.checkLimit(_Memory.convert(location))])
					{
						this.Zflag = 1;
						_PCB.ZFlagVal = 1;
						document.getElementById("Z").innerHTML = this.Zflag;
					}
					else
					{
						this.Zflag = 0;
						_PCB.ZFlagVal = 0;
						document.getElementById("Z").innerHTML = this.Zflag;
					}
					this.SeperationValidOpCode = 0;
					break;
				}
				case "D0":
				//branch x bytes if z flag = 0
				{
					if(this.Zflag > 0)
					{
						var offset = _Memory.memory[++this.PC + _PCB.base];
						offset = parseInt(offset,16);
						this.PC = ((this.PC + _PCB.base + offset) % (_MaxBlock + 1));
					}
					else
					{
						this.PC++;
					}
					this.SeperationValidOpCode = 0;
					break;
				}
				case "EE":
				//increment the value of a byte
				{
					var index = _PCB.checkLimit(_Memory.convert(_Memory.memory[++this.PC + _PCB.base]))
					incrementor = parseInt(_Memory.memory[index],16);
					incrementor++;
					_Memory.memory[index] = incrementor.toString(16);
					document.getElementById(index).innerHTML = incrementor.toString(16);
					this.SeperationValidOpCode = 0;
					break;
				}
				case "FF":
				//system call
				{
					if(this.Xreg === 1)
					{
						 _Console.putText(this.Yreg.toString(16));
						 _Console.putText(" ");
					}
					else if(this.Xreg === 2)
					{
						var tempY = this.Yreg;
						_PCB.YRegVal = this.Yreg;
						while(_Memory.memory[tempY] != "00")
						{
							_Console.putText(String.fromCharCode(parseInt(_Memory.memory[tempY], 16)));
							tempY++;
						}
						_Console.putText(" ");
					}
					this.SeperationValidOpCode = 0;
					break;
				}
				default:
				{
						this.PC++;
						document.getElementById('PC').innerHTML=this.PC;
						this.SeperationValidOpCode++;
				}
			}
			this.PC++;
			document.getElementById('PC').innerHTML=this.PC + _PCB.base;
		}
    };
	
	this.CPUScheduler = function()
	{
		if(this.QuantumSeperation >= _Quantum)
		{
			_KernelInterruptQueue.enqueue( new Interrupt(CONTEXTSWITCH_IRQ, 0) );
		}
		this.QuantumSeperation++;
	};
	
	this.Scheduler = function(program)
	{
		_ReadyQueue.enqueue(program);
		if(!this.isExecuting)
		{
			_PCB = _ReadyQueue.dequeue();
		}
	};
	
	this.ContextSwitch = function()
	{
		var temp = _PCB;
		_PCB.PCLoc = this.PC;
		_PCB.ACCVal = this.Acc;
		_PCB.XRegVal = this.Xreg;
		_PCB.YRegVal = this.Yreg;
		_PCB.ZFlagVal = this.Zflag;
		
		if(!_PCB.isDone)
		{ 
			_ReadyQueue.enqueue(temp);
		}
		
		if(_ReadyQueue.isEmpty())
		{
			this.isExecuting = false;
			this.PC    = 0;
			this.Acc   = 0;
			this.Xreg  = 0;
			this.Yreg  = 0;
			this.Zflag = 0;
		}
		
		_PCB = _ReadyQueue.dequeue();
		if(_ReadyQueue.getSize() === 2)
		{
			document.getElementById('RQ3').innerHTML=temp.toString();
			var tempPCB2 = document.getElementById('RQ3').textContent;
			var tempPCB1 = document.getElementById('RQ2').textContent;
			document.getElementById('RQ2').innerHTML=tempPCB2;
			document.getElementById('RQ1').innerHTML=tempPCB1;
			document.getElementById('RQ3').innerHTML="Alpaca";
		}
		else if (_ReadyQueue.getSize() === 1)
		{
			document.getElementById('RQ2').innerHTML=temp.toString();
			var tempPCB1 = document.getElementById('RQ2').textContent;
			document.getElementById('RQ1').innerHTML=tempPCB1;
			document.getElementById('RQ2').innerHTML="Alpaca";
			document.getElementById('RQ3').innerHTML="Alpaca";
		}
		else if(_ReadyQueue.getSize() === 0)
		{
			document.getElementById('RQ1').innerHTML="Alpaca";
			document.getElementById('RQ2').innerHTML="Alpaca";
			document.getElementById('RQ3').innerHTML="Alpaca";
		}
		this.PC    = _PCB.PCLoc;
		this.Acc   = _PCB.ACCVal;
		this.Xreg  = _PCB.XRegVal;
		this.Yreg  = _PCB.YRegVal;
		this.Zflag = _PCB.ZFlagVal;
		document.getElementById('PC').innerHTML=this.PC + _PCB.base;
		document.getElementById('ACC').innerHTML=this.Acc;
		document.getElementById('X').innerHTML=this.Xreg.toString(16);
		document.getElementById('Y').innerHTML=this.Yreg.toString(16);
		document.getElementById('Z').innerHTML=this.Zflag;
		this.QuantumSeperation = 0;		
	};
	this.InvalidOpCode = function()
	{
			_PCB.isDone = true;
			_StdIn.putText("Check " + (this.PC + _PCB.base));						
	};
}
