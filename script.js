// Author: Ronaldo Romario Tunque Cahui
// Date: 11-04-2023

const $resultText = document.getElementById("resultText");
const $encryptBtn = document.getElementById("encryptBtn");
const $decryptBtn = document.getElementById("decryptBtn");
const $copyBtn = document.getElementById("copyBtn");

function encrypt() {
	console.log("encrypt");
}

function decrypt() {
	console.log("decrypt");
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

const $foundContainer = document.getElementById("foundContainer");
const $notFoundContainer = document.getElementById("notFoundContainer");

$foundContainer.style.display = "flex";
$notFoundContainer.style.display = "none";
