// Author: Ronaldo Romario Tunque Cahui
// Date: 11-04-2023

const $text = document.getElementById("text");
const $resultText = document.getElementById("resultText");
const $encryptBtn = document.getElementById("encryptBtn");
const $decryptBtn = document.getElementById("decryptBtn");
const $copyBtn = document.getElementById("copyBtn");
const $foundContainer = document.getElementById("foundContainer");
const $notFoundContainer = document.getElementById("notFoundContainer");
const $messageTittle = document.getElementById("messageTittle");

const encryptValues = {
	a: "ai",
	e: "enter",
	i: "imes",
	o: "ober",
	u: "ufat",
};

const decryptValues = {
	ai: "a",
	enter: "e",
	imes: "i",
	ober: "o",
	ufat: "u",
};

function validate(text) {
	// Regex para solo letras minúsculas y sin acentos
	const re = RegExp(/^([a-z-!\s]+)$/g);
	if (text.trim() === "") {
		$foundContainer.style.display = "none";
		$notFoundContainer.style.display = "flex";
		$messageTittle.innerText = "Ningún mensaje fue encontrado";
		return false;
	}
	const isValid = re.test(text);
	if (!isValid) {
		$foundContainer.style.display = "none";
		$notFoundContainer.style.display = "flex";
		$messageTittle.innerText = "Solo se permiten letras minúsculas y sin acentos";
		return false;
	}
	$foundContainer.style.display = "flex";
	$notFoundContainer.style.display = "none";
	return true;
}

function encrypt() {
	const textValue = $text.value;
	let encryptTextValue = "";
	const wasValidated = validate(textValue);
	if (wasValidated) {
		encryptTextValue = textValue.replaceAll(/[aeiou]/g, (x) => encryptValues[x]);
	}
	$resultText.value = encryptTextValue;
}

function decrypt() {
	const textValue = $text.value;
	let decryptTextValue = "";
	const wasValidated = validate(textValue);
	if (wasValidated) {
		decryptTextValue = textValue.replaceAll(/ai|enter|imes|ober|ufat/g, (x) => decryptValues[x]);
	}
	$resultText.value = decryptTextValue;
}

function copy() {
	$resultText.select();
	$resultText.setSelectionRange(0, 99999);
	navigator.clipboard.writeText($resultText.value);
}

function setFunctions() {
	$encryptBtn.onclick = encrypt;
	$decryptBtn.onclick = decrypt;
	$copyBtn.onclick = copy;
}

setFunctions();
