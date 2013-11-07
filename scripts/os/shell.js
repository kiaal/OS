/* ------------
   Shell.js
   
   The OS Shell - The "command line interface" (CLI) for the console.
   ------------ */

// TODO: Write a base class / prototype for system services and let Shell inherit from it.

function Shell() {
    // Properties
    this.promptStr   = ">";
    this.commandList = [];
    this.curses      = "[fuvg],[cvff],[shpx],[phag],[pbpxfhpxre],[zbgureshpxre],[gvgf]";
    this.apologies   = "[sorry]";
    // Methods
    this.init        = shellInit;
    this.putPrompt   = shellPutPrompt;
    this.handleInput = shellHandleInput;
    this.execute     = shellExecute;
}

function shellInit() {
    var sc = null;
    //
    // Load the command list.

    // ver
    sc = new ShellCommand();
    sc.command = "ver";
    sc.description = "- Displays the current version data.";
    sc.function = shellVer;
    this.commandList[this.commandList.length] = sc;
	
	// load
	sc = new ShellCommand();
	sc.command = "load"
	sc.description = "Load a program"
	sc.function = shellLoad;
	this.commandList[this.commandList.length] = sc;
	
	// Test BSOD
	sc = new ShellCommand();
	sc.command = "bsod";
	sc.description = "Causes BSOD"
	sc.function = shellBSOD;
	this.commandList[this.commandList.length] = sc;
	
	// status <string>
	sc = new ShellCommand();
	sc.command = "status"
	sc.description = "Changes the status"
	sc.function = shellStatus;
	this.commandList[this.commandList.length] = sc;
	
	// date
	sc = new ShellCommand();
	sc.command = "date";
	sc.description = "- Displays the current date and time.";
	sc.function = shellDate;
	this.commandList[this.commandList.length]=sc;
	
	//surprise
    sc = new ShellCommand();
    sc.command = "surprise";
    sc.description = "- Displays something interesting and creative.";
    sc.function = shellSurprise;
    this.commandList[this.commandList.length] = sc;
	
	// Location
	sc = new ShellCommand();
	sc.command = "whereami";
	sc.description = "- Displays the current location";
	sc.function = shellLocation;
	this.commandList[this.commandList.length]=sc;
	
    // help
    sc = new ShellCommand();
    sc.command = "help";
    sc.description = "- This is the help command. Seek help.";
    sc.function = shellHelp;
    this.commandList[this.commandList.length] = sc;
	
	// shutdown
    sc = new ShellCommand();
    sc.command = "shutdown";
    sc.description = "- Shuts down the virtual OS but leaves the underlying hardware simulation running.";
    sc.function = shellShutdown;
    this.commandList[this.commandList.length] = sc;
	
	// cls
    sc = new ShellCommand();
    sc.command = "cls";
    sc.description = "- Clears the screen and resets the cursor position.";
    sc.function = shellCls;
    this.commandList[this.commandList.length] = sc;
	
	// run <pid>
	sc = new ShellCommand();
	sc.command = "run";
	sc.description = "Run a Program";
	sc.function = shellRun;
	this.commandList[this.commandList.length] = sc;
	
	// man <topic>
    sc = new ShellCommand();
    sc.command = "man";
    sc.description = "<topic> - Displays the MANual page for <topic>.";
    sc.function = shellMan;
    this.commandList[this.commandList.length] = sc;

	// runall
	sc = new ShellCommand();
	sc.command = "runall";
	sc.description = "runs all programs in memory"
	sc.function = shellRunAll;
	this.commandList[this.commandList.length] = sc;
	
	// quantum <int>
	sc = new ShellCommand();
	sc.command = "quantum";
	sc.description = "Sets the quantum entanglement field";
	sc.function = shellQuantum;
	this.commandList[this.commandList.length] = sc;
	
    // trace <on | off>
    sc = new ShellCommand();
    sc.command = "trace";
    sc.description = "<on | off> - Turns the OS trace on or off.";
    sc.function = shellTrace;
    this.commandList[this.commandList.length] = sc;
	
    // rot13 <string>
    sc = new ShellCommand();
    sc.command = "rot13";
    sc.description = "<string> - Does rot13 obfuscation on <string>.";
    sc.function = shellRot13;
    this.commandList[this.commandList.length] = sc;

    // prompt <string>
    sc = new ShellCommand();
    sc.command = "prompt";
    sc.description = "<string> - Sets the prompt.";
    sc.function = shellPrompt;
    this.commandList[this.commandList.length] = sc;

    // processes - list the running processes and their IDs
	sc = new ShellCommand();
    sc.command = "processes";
    sc.description = "displays a list of all running processes";
    sc.function = shellProcesses;
    this.commandList[this.commandList.length] = sc;
	
    // kill <id> - kills the specified process id.
	sc = new ShellCommand();
    sc.command = "kill";
    sc.description = "Kills the PID";
    sc.function = shellKill;
    this.commandList[this.commandList.length] = sc;

    //
    // Display the initial prompt.
    this.putPrompt();
}

function shellPutPrompt()
{
    _StdIn.putText(this.promptStr);
}

function shellHandleInput(buffer)
{
    krnTrace("Shell Command~" + buffer);
    // 
    // Parse the Input...
    //
    var userCommand = new UserCommand();
    userCommand = shellParseInput(buffer);
    // ... and assign the command and args to local variables.
    var cmd = userCommand.command;
    var args = userCommand.args;
    //
    // Determine the command and execute it.
    //
    // JavaScript may not support associative arrays in all browsers so we have to
    // iterate over the command list in attempt to find a match.  TODO: Is there a better way? Probably.
    var index = 0;
    var found = false;
    while (!found && index < this.commandList.length)
    {
        if (this.commandList[index].command === cmd)
        {
            found = true;
            var fn = this.commandList[index].function;
        }
        else
        {
            ++index;
        }
    }
    if (found)
    {
        this.execute(fn, args);
    }
    else
    {
        // It's not found, so check for curses and apologies before declaring the command invalid.
        if (this.curses.indexOf("[" + rot13(cmd) + "]") >= 0)      // Check for curses.
        {
            this.execute(shellCurse);
        }
        else if (this.apologies.indexOf("[" + cmd + "]") >= 0)      // Check for apologies.
        {
            this.execute(shellApology);
        }
        else    // It's just a bad command.
        {
            this.execute(shellInvalidCommand);
        }
    }
}

function shellParseInput(buffer)
{
    var retVal = new UserCommand();

    // 1. Remove leading and trailing spaces.
    buffer = trim(buffer);

    // 2. Lower-case it.
    buffer = buffer.toLowerCase();

    // 3. Separate on spaces so we can determine the command and command-line args, if any.
    var tempList = buffer.split(" ");

    // 4. Take the first (zeroth) element and use that as the command.
    var cmd = tempList.shift();  // Yes, you can do that to an array in JavaScript.  See the Queue class.
    // 4.1 Remove any left-over spaces.
    cmd = trim(cmd);
    // 4.2 Record it in the return value.
    retVal.command = cmd;

    // 5. Now create the args array from what's left.
    for (var i in tempList)
    {
        var arg = trim(tempList[i]);
        if (arg != "")
        {
            retVal.args[retVal.args.length] = tempList[i];
        }
    }
    return retVal;
}

function shellExecute(fn, args)
{
    // We just got a command, so advance the line...
    _StdIn.advanceLine();
    // ... call the command function passing in the args...
    fn(args);
    // Check to see if we need to advance the line again
    if (_StdIn.CurrentXPosition > 0)
    {
        _StdIn.advanceLine();
    }
    // ... and finally write the prompt again.
    this.putPrompt();
}


//
// The rest of these functions ARE NOT part of the Shell "class" (prototype, more accurately), 
// as they are not denoted in the constructor.  The idea is that you cannot execute them from
// elsewhere as shell.xxx .  In a better world, and a more perfect JavaScript, we'd be
// able to make then private.  (Actually, we can. have a look at Crockford's stuff and Resig's JavaScript Ninja cook.)
//

//
// An "interior" or "private" class (prototype) used only inside Shell() (we hope).
//
function ShellCommand()     
{
    // Properties
    this.command = "";
    this.description = "";
    this.function = "";
}

//
// Another "interior" or "private" class (prototype) used only inside Shell() (we hope).
//
function UserCommand()
{
    // Properties
    this.command = "";
    this.args = [];
}


//
// Shell Command Functions.  Again, not part of Shell() class per se', just called from there.
//
function shellInvalidCommand()
{
    _StdIn.putText("Invalid Command. ");
    if (_SarcasticMode)
    {
        _StdIn.putText("Duh. Go back to your Speak & Spell.");
    }
    else
    {
        _StdIn.putText("Type 'help' for, well... help.");
    }
}

function shellCurse()
{
    _StdIn.putText("Oh, so that's how it's going to be, eh? Fine.");
    _StdIn.advanceLine();
    _StdIn.putText("Bitch");
    _SarcasticMode = true;
}

function shellApology()
{
   if (_SarcasticMode) {
      _StdIn.putText("Okay. I forgive you. This time.");
      _SarcasticMode = false;
   } else {
      _StdIn.putText("For what?");
   }
}

function shellVer(args)
{
    _StdIn.putText(APP_NAME + " " + APP_VERSION);    
}

function shellStatus(args)
{
	var i = 0;
    var stat = "";
    while (i<args.length){
		stat += args[i]+= " ";
		i+=1;
    }
    document.getElementById("status").innerHTML=stat;
}

function shellBSOD(args)
{
	krnTrapError();
}

function shellLoad(args)
{
	//get the input from the input box
	var programInput = document.getElementById("taProgramInput").value;
	//check for anything that ISNT code and then move forward based on that
	var regx =  /[g-z]/gi;
	if(!regx.test(programInput))
	{
		//three or more programs already running means we cant handle this one
		//theres a problem if it already was higher than 3
		if(_ProgramCount >= 3)
		{
			_StdIn.putText("Not enough Memory");
		}
		else
		{
		//Check what block of memory to put the program in
		//no current programs means it goes in block one
			if(_ProgramCount === 0)
			{
				var i = _FirstBlock;
				_PCB一 = new PCB;
				_PCB一.init(_ProgramCount);
				document.getElementById("RL1").innerHTML=_PCB一.toString();
				_ResidentList.push(_PCB一.toString());
			}
			//a current program means it goes to block two
			else if(_ProgramCount === 1)
			{
				var i = _SecondBlock;
				_PCB二 = new PCB;
				_PCB二.init(_ProgramCount);
				document.getElementById("RL2").innerHTML=_PCB二.toString();
				_ResidentList.push(_PCB二.toString());
			}
			//two current programs means it goes to block three
			else
			{
				var i = _ThirdBlock;
				_PCB三 = new PCB;
				_PCB三.init(_ProgramCount);
				document.getElementById("RL3").innerHTML=_PCB三.toString();
				_ResidentList.push(_PCB三.toString());
			}
			
			//Go through the program and add it to memory
			var toBeEntered = programInput.split(" ");
			var j = 0;
			while (j < toBeEntered.length)
			{
				_Memory.memory[i] = toBeEntered[j];
				document.getElementById(i).innerHTML=_Memory.memory[i];
				j++;
				i++;
			}
			_StdIn.putText("PID: " + _ProgramCount++);
		}
	}
	else
	{
		_StdIn.putText("Not Code");
	}
}

function shellDate(args)
{
	_StdIn.putText(Date());
}

function shellLocation(args)
{
        _StdIn.putText("Uh, New York? CT? Japan?");
}

function shellSurprise(args)
{
    document.getElementById("divergence1").src = "images/divergence2.png";
}

function shellRun(args)
{
	 if (args.length === 1)
    { 
		if(args[0] === "0")
		{
			_CPU.PC = _FirstBlock;
			_PCB一.isDone = false;
			document.getElementById("PC").innerHTML=_CPU.PC;
			if(_ReadyQueue.isEmpty())
			{
				_RunCounter = 0;
			}
			if(_RunCounter === 0)
			{
				document.getElementById("RQ1").innerHTML=_PCB一.toString();
				_RunCounter++;
			}
			else if(_RunCounter === 1)
			{
				document.getElementById("RQ2").innerHTML=_PCB一.toString();
				_RunCounter++;
			}
			else if(_RunCounter === 2)
			{
				document.getElementById("RQ3").innerHTML=_PCB一.toString();
				_RunCounter = 0;
			}
			_CPU.Scheduler(_PCB一);
			_CPU.isExecuting = true;
		}
		else if(args[0] === "1")
		{
			_CPU.PC = _SecondBlock;
			_CPU.Scheduler(_PCB二);
			_PCB二.isDone = false;
			document.getElementById("PC").innerHTML=_CPU.PC;
			if(_RunCounter === 0)
			{
				document.getElementById("RQ1").innerHTML=_PCB二.toString();
				_RunCounter++;
			}
			else if(_RunCounter === 1)
			{
				document.getElementById("RQ2").innerHTML=_PCB二.toString();
				_RunCounter++;
			}
			else if(_RunCounter === 2)
			{
				document.getElementById("RQ3").innerHTML=_PCB二.toString();
				_RunCounter = 0;
			}
			_CPU.isExecuting = true;
		}
		else if(args[0] === "2")
		{
				_CPU.pc = _ThirdBlock;
				_CPU.Scheduler(_PCB三);
				_PCB三.isDone = false;
				document.getElementById("PC").innerHTML=_CPU.PC;
			if(_RunCounter === 0)
			{
				document.getElementById("RQ1").innerHTML=_PCB三.toString();
				_RunCounter++;
			}
			else if(_RunCounter === 1)
			{
				document.getElementById("RQ2").innerHTML=_PCB三.toString();
				_RunCounter++;
			}
			else if(this.numTimesRan === 2)
			{
				document.getElementById("RQ3").innerHTML=_PCB三.toString();
				_RunCounter = 0;
			}
				_CPU.isExecuting = true;
		}
		else
		{
			_StdIn.putText("Try a better PID");
		}
	}
	else
	{
		_StdIn.putText("pid?");
	}
}

function shellRunAll(args)
{
	_CPU.PC = _FirstBlock;
	_CPU.Scheduler(_PCB一);
	_PCB一.isDone = false;
	_CPU.isExecuting = true;
	document.getElementById("PC").innerHTML=_CPU.PC;
	document.getElementById("RQ1").innerHTML=_PCB一.toString();
	if(_PCB二 != null)
	{
		_CPU.Scheduler(_PCB二);
		_PCB二.isDone = false;
		document.getElementById("RQ2").innerHTML=_PCB二.toString();
	}
	if(_PCB三 != null)
	{
		_CPU.Scheduler(_PCB三);
		_PCB三.isDone = false;
		document.getElementById("RQ3").innerHTML=_PCB三.toString();
	}
};

function shellQuantum(args)
{
	if (args.length > 0)
	{
		_Quantum = args[0];
	}
	else
	{
		_StdIn.putText("No Quantum Specified");
	}
}


function shellHelp(args)
{
    _StdIn.putText("Commands:");
    for (var i in _OsShell.commandList)
    {
        _StdIn.advanceLine();
        _StdIn.putText("  " + _OsShell.commandList[i].command + " " + _OsShell.commandList[i].description);
    }    
}

function shellShutdown(args)
{
     _StdIn.putText("Shutting down...");
     // Call Kernel shutdown routine.
    krnShutdown();   
    // TODO: Stop the final prompt from being displayed.  If possible.  Not a high priority.  (Damn OCD!)
}

function shellCls(args)
{
    _StdIn.clearScreen();
    _StdIn.resetXY();
}

function shellMan(args)
{
    if (args.length > 0)
    {
        var topic = args[0];
        switch (topic)
        {
            case "help": 
                _StdIn.putText("Help displays a list of (hopefully) valid commands.");
                break;
            default:
                _StdIn.putText("No manual entry for " + args[0] + ".");
        }        
    }
    else
    {
        _StdIn.putText("Usage: man <topic>  Please supply a topic.");
    }
}

function shellTrace(args)
{
    if (args.length > 0)
    {
        var setting = args[0];
        switch (setting)
        {
            case "on":
                if (_Trace && _SarcasticMode)
                {
                    _StdIn.putText("Trace is already on, dumbass.");
                }
                else
                {
                    _Trace = true;
                    _StdIn.putText("Trace ON");
                }

                break;
            case "off":
                _Trace = false;
                _StdIn.putText("Trace OFF");
                break;
            default:
                _StdIn.putText("Invalid arguement. Usage: trace <on | off>.");
        }
    }
    else
    {
        _StdIn.putText("Usage: trace <on | off>");
    }
}



function shellRot13(args)
{
    if (args.length > 0)
    {
        _StdIn.putText(args[0] + " = '" + rot13(args[0]) +"'");     // Requires Utils.js for rot13() function.
    }
    else
    {
        _StdIn.putText("Usage: rot13 <string>  Please supply a string.");
    }
}

function shellPrompt(args)
{
    if (args.length > 0)
    {
        _OsShell.promptStr = args[0];
    }
    else
    {
        _StdIn.putText("Usage: prompt <string>  Please supply a string.");
    }
}

function shellProcesses(args)
{
	if(!_CPU.isExecuting)
	{
		_StdIn.putText("There is nothing running");
	}
	else
	{
		if(!_PCB一.isDone)
		{
			_StdIn.putText(_PCB一.toString());
			_StdIn.advanceLine();
		}
		if(!_PCB二.isDone)
		{
			_StdIn.putText(_PCB二.toString());
			_StdIn.advanceLine();
		}
		if(!_PCB三.isDone)
		{
			_StdIn.putText(_PCB三.toString());
			_StdIn.advanceLine();
		}
	}
}

function shellKill(args)
{

	if(!_CPU.isExecuting)
	{
		_StdIn.putText("There is nothing running");
	}
	else if (args.length > 0)
	{
		if(args[0] === "0")
		{
			_PCB一.isDone = true;
		}
		else if(args[0] === "1")
		{
			_PCB二.isDone = true;
		}
		else if(args[0] === "2")
		{
			_PCB三.isDone = true;
		}
		else
		{
			_StdIn.putText("Nothing to Kill");
		}
	}
	else
	{
			_StdIn.putText("Nothing to Kill");
	}
}
