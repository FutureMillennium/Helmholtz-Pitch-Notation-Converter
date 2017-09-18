var notes = ['C', 'C♯', 'D', 'D♯', 'E', 'F', 'F♯', 'G', 'G♯', 'A', 'A♯', 'B'];
var noteFrequencies = [
	261.63,
	277.18,
	293.66,
	311.13,
	329.63,
	349.23,
	369.99,
	392.00,
	415.30,
	440.00,
	466.16,
	493.88,
];

var frequencyInput = document.getElementById('frequency'),
	helmholtzInput = document.getElementById('helmholtz'),
	scientificInput = document.getElementById('scientific'),
	guitarProInput = document.getElementById('guitarpro'),
	yamahaInput = document.getElementById('yamaha'),
	midiInput = document.getElementById('midi');
var inputs = [frequencyInput, helmholtzInput, scientificInput, guitarProInput, yamahaInput, midiInput];
var prevFrequencyText = '',
	prevHelmholtzText = '',
	prevScientificText = '',
	prevGuitarProText = '',
	prevYamahaText = '',
	prevMIDIText = '';
var curNotes;
var isDefaultValue = true;

function AddNoteGlobal(curItem) {
	if (curItem.octave == '-')
		return false;
	
	if (curItem.noteI != null) {
		if (curItem.octave == null)
			return false;

		if (curItem.noteI >= notes.length) {
			curItem.octave += Math.floor(curItem.noteI / notes.length);
			curItem.noteI = curItem.noteI % notes.length;
		}
		else while (curItem.noteI < 0) {
			curItem.noteI += 12;
			curItem.octave -= 1;
		}

		curNotes.push(curItem);
		return true;
	}
}

function OutputFrequency() {
	var output = '';
	var max = curNotes.length;

	for (var i = 0; i < max; i++) {
		var note = curNotes[i];

		output += noteFrequencies[note.noteI] * Math.pow(2, note.octave - 4);
		if (i != max - 1)
			output += ", ";
	}

	frequencyInput.className = "";
	frequencyInput.value = output;
	prevFrequencyText = output;
}

function OutputHelmholtz() {
	var output = '';
	var max = curNotes.length;

	for (var i = 0; i < max; i++) {
		var note = curNotes[i];
		var name = notes[note.noteI];
		var octave = note.octave;
		var symbol = "′";

		if (octave >= 3) {
			octave -= 3;
			name = name.toLowerCase();
		} else {
			octave -= 2;
			octave *= -1;
		}

		for (var j = 0; j < octave; j++) {
			name += symbol;
		}

		output += name;
		if (i != max - 1)
			output += " ";
	}

	helmholtzInput.className = "";
	helmholtzInput.value = output;
	prevHelmholtzText = output;
}

function OutputScientific() {
	var output = '';
	var max = curNotes.length;

	for (var i = 0; i < max; i++) {
		var note = curNotes[i];

		output += notes[note.noteI] + note.octave;
		if (i != max - 1)
			output += ", ";
	}

	scientificInput.className = "";
	scientificInput.value = output;
	prevScientificText = output;
}

function OutputGuitarPro() {
	var output = '';
	var max = curNotes.length;

	for (var i = 0; i < max; i++) {
		var note = curNotes[i];

		output += notes[note.noteI] + (note.octave + 1);
		if (i != max - 1)
			output += ", ";
	}

	guitarProInput.className = "";
	guitarProInput.value = output;
	prevGuitarProText = output;
}

function OutputYamaha() {
	var output = '';
	var max = curNotes.length;

	for (var i = 0; i < max; i++) {
		var note = curNotes[i];

		output += notes[note.noteI] + (note.octave - 1);
		if (i != max - 1)
			output += ", ";
	}

	yamahaInput.className = "";
	yamahaInput.value = output;
	prevYamahaText = output;
}

function OutputMIDI() {
	output = '';
	max = curNotes.length;

	for (var i = 0; i < max; i++) {
		var note = curNotes[i];

		output += ((note.octave + 1) * 12 + note.noteI);
		if (i != max - 1)
			output += ", ";
	}

	midiInput.className = "";
	midiInput.value = output;
	prevMIDIText = output;
}

function AcceptScientific(field) {
	var text = field.value;
	var max = text.length;
	var curItem;
	var isError = false;

	function InitCurItem() {
		curItem = {
			noteI: null,
			octave: null,
		};
	}

	function AddNote() {
		return AddNoteGlobal(curItem);
	}

	InitCurItem();
	curNotes = [];

	for (var i = 0; i < max; i++) {
		var isDone = false;
		var c = text[i];

		if (c >= '0' && c <= '9') {
			if (curItem.octave == null || curItem.octave == '-') {
				var num = parseInt(c);
				if (curItem.octave == '-')
					num = num * -1;
				curItem.octave = num;
				isDone = true;
			} else {
				// @TODO octaves higher than 9?
				isError = true;
				break;
			}
		}
		else switch(c) {
			case '♯':
			case '#':
				if (curItem.noteI == null) {
					isError = true;
				} else {
					curItem.noteI++;
					isDone = true;
				}
				break;
			case '♭':
			case 'b':
				if (curItem.noteI == null) {
					// might be the B note
				} else {
					curItem.noteI--;
					isDone = true;
				}
				break;
			case '-':
				if (curItem.octave != null) {
					isError = true;
				} else {
					curItem.octave = '-';
					isDone = true;
				}
				break;
			case ',':
			case '–':
			case ' ':
				if (AddNote() == false) {
					isError = true;
					break;
				}
				InitCurItem();
				isDone = true;
				break;
		}

		if (isError == true) {
			break;
		}

		if (isDone == true)
			continue;

		c = c.toUpperCase();
		var noteI = notes.indexOf(c);

		if (noteI != -1) {
			if (curItem.noteI != null) {
				isError = true;
				break;
			}
			curItem.noteI = noteI;
		}
	}

	if (AddNote() == false)
		isError = true;
	
	if (curNotes.length == 0)
		isError = true;

	if (isError && text.length > 0) {
		field.className = 'error';
	} else {
		field.className = '';
	}

	isDefaultValue = false;
}

function HelmholtzChanged(e) {
	if (prevHelmholtzText != this.value) {
		var text = this.value;
		var max = text.length;
		var curItem;
		var isError = false;
		var isCurCapital = false;

		function InitCurItem() {
			curItem = {
				noteI: null,
				octave: null,
			};
		}

		function AddNote() {
			if (curItem.octave == null) {
				curItem.octave = 0;
			}

			if (isCurCapital == true) {
				curItem.octave = 2 - curItem.octave;
			} else {
				curItem.octave += 3;
			}

			isCurCapital = false;
			return AddNoteGlobal(curItem);
		}

		InitCurItem();
		curNotes = [];

		for (var i = 0; i < max; i++) {
			var isDone = false;
			var c = text[i];

			if (c >= '0' && c <= '9') {
				if (curItem.octave == null || curItem.octave == '-') {
					var num = parseInt(c);
					if (curItem.octave == '-')
						num = num * -1;
					curItem.octave = num;
					isDone = true;
				} else {
					// @TODO octaves higher than 9?
					isError = true;
					break;
				}
			}
			else switch(c) {
				case '♯':
				case '#':
					if (curItem.noteI == null) {
						isError = true;
					} else {
						curItem.noteI++;
						isDone = true;
					}
					break;
				case '♭':
				case 'b':
					if (curItem.noteI == null) {
						// might be the B note
					} else {
						curItem.noteI--;
						isDone = true;
					}
					break;
				case '-':
					if (curItem.octave != null) {
						isError = true;
					} else {
						curItem.octave = '-';
						isDone = true;
					}
					break;
				case '′':
				case '͵':
				case '\'':
				case 'i':
					if (curItem.octave == null)
						curItem.octave = 1;
					else
						curItem.octave++;
					break;
				case ',':
				case '–':
				case ' ':
					if (AddNote() == false) {
						isError = true;
						break;
					}
					InitCurItem();
					isDone = true;
					break;
			}

			if (isError == true) {
				break;
			}

			if (isDone == true)
				continue;

			c = c.toUpperCase();
			var noteI = notes.indexOf(c);

			if (noteI != -1) {
				if (curItem.noteI == null) {
					curItem.noteI = noteI;
					if (c == text[i]) {
						isCurCapital = true;
					}
				} else {
					if (curItem.noteI != noteI) {
						isError = true;
						break;
					}

					if (curItem.octave == null)
						curItem.octave = 1;
					else
						curItem.octave++;
				}
			}
		}

		if (AddNote() == false)
			isError = true;
		
		if (curNotes.length == 0)
			isError = true;
		else {
			OutputFrequency();
			OutputScientific();
			OutputGuitarPro();
			OutputYamaha();
			OutputMIDI();
		}

		if (isError && text.length > 0) {
			this.className = 'error';
		} else {
			this.className = '';
		}

		prevHelmholtzText = this.value;
		isDefaultValue = false;
	}
};

function ScientificChanged(e) {
	if (prevScientificText != this.value) {
		AcceptScientific(this);

		if (curNotes.length > 0) {
			OutputFrequency();
			OutputHelmholtz();
			// this
			OutputGuitarPro();
			OutputYamaha();
			OutputMIDI();
		}

		prevScientificText = this.value;
	}
};

function GuitarProChanged(e) {
	if (prevGuitarProText != this.value) {
		AcceptScientific(this);

		if (curNotes.length > 0) {
			for (var i = 0; i < curNotes.length; i++) {
				curNotes[i].octave -= 1;
			}

			OutputFrequency();
			OutputHelmholtz();
			OutputScientific();
			// this
			OutputYamaha();
			OutputMIDI();
		}

		prevGuitarProText = this.value;
	}
};

function YamahaChanged(e) {
	if (prevYamahaText != this.value) {
		AcceptScientific(this);

		if (curNotes.length > 0) {
			for (var i = 0; i < curNotes.length; i++) {
				curNotes[i].octave += 1;
			}

			OutputFrequency();
			OutputHelmholtz();
			OutputScientific();
			OutputGuitarPro();
			// this
			OutputMIDI();
		}

		prevYamahaText = this.value;
	}
};

helmholtzInput.oninput = HelmholtzChanged;
scientificInput.oninput = ScientificChanged;
guitarProInput.oninput = GuitarProChanged;
yamahaInput.oninput = YamahaChanged;

for (var i = 0; i < inputs.length; i++) {
	inputs[i].onfocus = function() {
		if (isDefaultValue) {
			this.select();
		} else {
			this.onfocus = null;
		}
	};
}
